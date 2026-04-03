"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { bookingSchema } from "@/lib/validations";
import type { ActionResponse } from "@/types";

export async function createBooking(
  sessionId: string,
  guestData?: { name: string; email: string; phone: string; address: string }
): Promise<ActionResponse<{ bookingId: string }>> {
  try {
    const session = await getSession();
    if (!session?.user?.email && !guestData?.email) {
      return { success: false, error: "You must provide an email or be signed in" };
    }

    const parsed = bookingSchema.safeParse({ sessionId });
    if (!parsed.success) {
      return { success: false, error: "Invalid session ID" };
    }

    // Get the user if logged in
    let user = null;
    if (session?.user?.email) {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
    }

    // Get the class session with course info
    const classSession = await prisma.classSession.findUnique({
      where: { id: sessionId },
      include: { course: true },
    });

    if (!classSession) {
      return { success: false, error: "Class session not found" };
    }

    // Check capacity
    if (classSession.enrolledCount >= classSession.capacity) {
      return { success: false, error: "This class is full" };
    }

    // Check for existing booking ONLY if user is logged in
    if (user) {
      const existingBooking = await prisma.booking.findFirst({
        where: {
          userId: user.id,
          sessionId: sessionId,
          status: { in: ["pending", "paid"] },
        },
      });

      if (existingBooking) {
        return { success: false, error: "You already have a booking for this class" };
      }
    }

    // Create pending booking
    const booking = await prisma.booking.create({
      data: {
        userId: user ? user.id : null,
        sessionId: sessionId,
        status: "pending",
        amount: classSession.course.priceOriginal,
        guestName: !user ? guestData?.name || undefined : undefined,
        guestEmail: !user ? guestData?.email || undefined : undefined,
        guestPhone: !user ? guestData?.phone || undefined : undefined,
        guestAddress: !user ? guestData?.address || undefined : undefined,
      },
// @ts-ignore
    });

    return { success: true, data: { bookingId: booking.id } };
  } catch (error) {
    console.error("Create booking error:", error);
    return { success: false, error: "Failed to create booking" };
  }
}

export async function createStripeCheckout(
  bookingId: string
): Promise<ActionResponse<{ checkoutUrl: string }>> {
  try {
    // No strict session check here because guests exist

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        session: {
          include: { course: true },
        },
        user: true,
      },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    if (booking.status === "paid") {
      return { success: false, error: "This booking is already paid" };
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: booking.session.course.title,
              description: `${booking.session.course.title} - ${new Date(booking.session.date).toLocaleDateString()}`,
            },
            unit_amount: Math.round(booking.session.course.priceOriginal * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/calendar`,
      metadata: {
        bookingId: booking.id,
        sessionId: booking.sessionId,
        courseName: booking.session.course.title,
        date: booking.session.date.toISOString(),
      },
      customer_email: booking.user?.email || (booking as any).guestEmail || undefined,
    });

    return {
      success: true,
      data: { checkoutUrl: checkoutSession.url! },
    };
  } catch (error) {
    console.error("Create checkout error:", error);
    return { success: false, error: "Failed to create checkout session" };
  }
}
