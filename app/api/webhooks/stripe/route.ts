import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { addStudentToCalendar } from "@/lib/google-calendar";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      try {
        // Update booking status
        const booking = await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: "paid",
            paymentIntentId: session.payment_intent as string,
          },
          include: {
            user: true,
            session: {
              include: { course: true },
            },
          },
        });

        // Update enrolled count
        await prisma.classSession.update({
          where: { id: booking.sessionId },
          data: {
            enrolledCount: { increment: 1 },
          },
        });

        const studentEmail = booking.user?.email || (booking as any).guestEmail!
        const studentName = booking.user?.name || (booking as any).guestName || "Student"
        const studentPhone = (booking.user as any)?.phone || (booking as any).guestPhone || ""
        const studentAddress = (booking.user as any)?.address || (booking as any).guestAddress || ""

        // Send confirmation email
        await sendBookingConfirmationEmail({
          to: studentEmail,
          studentName: studentName,
          courseName: booking.session.course.title,
          date: formatDate(booking.session.date),
          startTime: formatTime(booking.session.startTime),
          endTime: formatTime(booking.session.endTime),
          location: booking.session.location,
          amount: formatCurrency(booking.session.course.priceOriginal),
          bookingId: booking.id,
        });

        // Add student to Google Calendar
        await addStudentToCalendar({
          studentEmail: studentEmail,
          studentName: studentName,
          studentPhone: studentPhone,
          studentAddress: studentAddress,
          courseName: booking.session.course.title,
          courseCategory: booking.session.course.category,
          date: booking.session.date,
          startTime: booking.session.startTime,
          endTime: booking.session.endTime,
          location: booking.session.location,
          bookingId: booking.id,
        });
      } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
          { error: "Webhook processing failed" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
