"use server"

import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { sendBookingConfirmationEmail } from "@/lib/email"
import { addStudentToCalendar } from "@/lib/google-calendar"
import { formatCurrency, formatDate, formatTime } from "@/lib/utils"
import paypal from "@paypal/checkout-server-sdk"

// --- PayPal SDK Client Setup ---
// Toggle: Set PAYPAL_LIVE_MODE=true in .env to process REAL charges.
// Leave it unset or "false" to use Sandbox (test mode, no real money).
const isLive = process.env.PAYPAL_LIVE_MODE === "true"

const environment = isLive
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID || "", process.env.PAYPAL_CLIENT_SECRET || "")
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID || "", process.env.PAYPAL_CLIENT_SECRET || "")

const client = new paypal.core.PayPalHttpClient(environment)

/**
 * Step 1: Create a PayPal Order.
 * - Authenticates the user via NextAuth server session (no client-provided userId).
 * - Validates the class session exists and has capacity.
 * - Checks for duplicate bookings.
 * - Creates a PayPal Order with the server-defined price (tamper-proof).
 */
export async function createPaypalOrder(
  sessionId: string,
  guestData?: { name: string; email: string; phone: string; address: string },
  registrationType: string = "ORIGINAL"
) {
  try {
    // --- AUTH: Get authenticated user from server session ---
    const authSession = await getSession()
    if (!authSession?.user?.email && !guestData?.email) {
      return { error: "You must provide an email or be signed in" }
    }

    let user = null;
    if (authSession?.user?.email) {
      user = await prisma.user.findUnique({
        where: { email: authSession.user.email },
      })
    }

    // --- VALIDATION: Check class session ---
    const classSession = await prisma.classSession.findUnique({
      where: { id: sessionId },
      include: { course: true }
    })

    if (!classSession || !classSession.course) {
      return { error: "Class session not found" }
    }

    if (classSession.enrolledCount >= classSession.capacity) {
      return { error: "This class is fully booked" }
    }

    // --- DUPLICATE CHECK: Prevent double bookings ONLY if user exists ---
    if (user) {
      const existingBooking = await prisma.booking.findFirst({
        where: {
          userId: user.id,
          sessionId: sessionId,
          status: { in: ["pending", "paid", "CONFIRMED"] },
        },
      })

      if (existingBooking) {
        return { error: "You already have a registration for this class" }
      }
    }

    // --- PAYPAL: Create order with server-side price ---
    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer("return=representation")
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: classSession.id,
          amount: {
            currency_code: "USD",
            value: (registrationType === "RENEWAL" && classSession.course.priceRenewal != null)
              ? classSession.course.priceRenewal.toString()
              : classSession.course.priceOriginal.toString()
          },
          description: `${classSession.course.title} ${registrationType === "RENEWAL" ? "Renewal" : "Original"} - ${classSession.date.toLocaleDateString()}`
        }
      ]
    })

    const response = await client.execute(request)
    return { orderId: response.result.id }

  } catch (error: any) {
    console.error("PayPal Create Order Error:", error)
    return { error: error.message || "Failed to create PayPal order" }
  }
}

/**
 * Step 2: Capture a PayPal Order after the user approves it in the PayPal popup.
 * - Re-authenticates the user on the server (no trusting client data).
 * - Verifies the PayPal capture was truly COMPLETED.
 * - Creates a CONFIRMED Booking record in the database.
 * - Increments the ClassSession enrolledCount.
 * - Sends a confirmation email to the user.
 */
export async function capturePaypalOrder(
  orderId: string, 
  sessionId: string,
  guestData?: { name: string; email: string; phone: string; address: string }
) {
  try {
    // --- AUTH: Re-verify user identity on capture ---
    const authSession = await getSession()
    if (!authSession?.user?.email && !guestData?.email) {
      return { error: "You must provide an email or be signed in to complete registration" }
    }

    let user = null;
    if (authSession?.user?.email) {
      user = await prisma.user.findUnique({
        where: { email: authSession.user.email },
      })
    }

    // --- PAYPAL: Capture the approved order ---
    const request = new paypal.orders.OrdersCaptureRequest(orderId)
    request.requestBody({} as any)
    
    const response = await client.execute(request)
    
    if (response.result.status !== "COMPLETED") {
      return { error: "Payment was not completed by PayPal" }
    }

    // --- DATABASE: Atomically create booking + update enrollment ---
    const booking = await prisma.$transaction(async (tx: any) => {
      // Double-check capacity inside transaction to prevent race conditions
      const classSession = await tx.classSession.findUnique({
        where: { id: sessionId },
        include: { course: true }
      })

      if (!classSession) throw new Error("Session not found during capture")
      if (classSession.enrolledCount >= classSession.capacity) {
        throw new Error("Class became fully booked during checkout")
      }

      // Prevent duplicate booking inside transaction
      if (user) {
        const existingBooking = await tx.booking.findFirst({
          where: {
            userId: user.id,
            sessionId: sessionId,
            status: { in: ["pending", "paid", "CONFIRMED"] },
          },
        })

        if (existingBooking) {
          throw new Error("Duplicate booking detected")
        }
      }

      const capturedAmount = response.result.purchase_units[0].payments.captures[0].amount.value

      const newBooking = await tx.booking.create({
        data: {
          userId: user ? user.id : null,
          sessionId,
          status: "CONFIRMED",
          amount: parseFloat(capturedAmount),
          paymentIntentId: orderId,
          paymentProvider: "PAYPAL",
          guestName: !user ? guestData?.name || undefined : undefined,
          guestEmail: !user ? guestData?.email || undefined : undefined,
          guestPhone: !user ? guestData?.phone || undefined : undefined,
          guestAddress: !user ? guestData?.address || undefined : undefined,
        }
      })

      await tx.classSession.update({
        where: { id: sessionId },
        data: { enrolledCount: { increment: 1 } }
      })

      return { booking: newBooking, classSession }
    })

    // --- EMAIL: Send confirmation (outside transaction for performance) ---
    const studentEmail = user?.email || (booking.booking as any).guestEmail || guestData?.email!
    const studentName = user?.name || (booking.booking as any).guestName || guestData?.name || "Student"
    const studentPhone = (user as any)?.phone || (booking.booking as any).guestPhone || guestData?.phone || ""
    const studentAddress = (user as any)?.address || (booking.booking as any).guestAddress || guestData?.address || ""

    try {
      await sendBookingConfirmationEmail({
        to: studentEmail,
        studentName: studentName,
        courseName: booking.classSession.course.title,
        date: formatDate(booking.classSession.date),
        startTime: formatTime(booking.classSession.startTime),
        endTime: formatTime(booking.classSession.endTime),
        location: booking.classSession.location,
        amount: formatCurrency(booking.booking.amount || booking.classSession.course.priceOriginal),
        bookingId: booking.booking.id,
      })
    } catch (emailError) {
      console.error("PayPal confirmation email failed:", emailError)
    }

    // --- CALENDAR: Add student to Google Calendar ---
    try {
      await addStudentToCalendar({
        studentEmail: studentEmail,
        studentName: studentName,
        studentPhone: studentPhone,
        studentAddress: studentAddress,
        courseName: booking.classSession.course.title,
        courseCategory: booking.classSession.course.category,
        date: booking.classSession.date,
        startTime: booking.classSession.startTime,
        endTime: booking.classSession.endTime,
        location: booking.classSession.location,
        bookingId: booking.booking.id,
      })
    } catch (calendarError) {
      console.error("Google Calendar event creation failed:", calendarError)
    }

    return { success: true, bookingId: booking.booking.id }

  } catch (error: any) {
    console.error("PayPal Capture Order Error:", error)
    return { error: error.message || "Failed to capture payment" }
  }
}
