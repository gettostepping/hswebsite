"use server";

import { createBooking, createStripeCheckout } from "./booking";

export async function createCheckoutSession(
  sessionId: string,
  guestData?: { name: string; email: string; phone: string; address: string }
) {
  try {
    // 1. Create the pending booking record in the database
    const bookingResult = await createBooking(sessionId, guestData);
    
    if (!bookingResult.success || !bookingResult.data?.bookingId) {
      console.error("Booking creation failed:", bookingResult.error);
      return { url: null, error: bookingResult.error };
    }

    // 2. Wrap that booking in a Stripe Checkout Session
    const checkoutResult = await createStripeCheckout(bookingResult.data.bookingId);
    
    if (!checkoutResult.success || !checkoutResult.data?.checkoutUrl) {
       console.error("Stripe creation failed:", checkoutResult.error);
       return { url: null, error: checkoutResult.error };
    }

    // 3. Return the URL for client redirection
    return { url: checkoutResult.data.checkoutUrl };
    
  } catch (err: any) {
    console.error("Stripe wrap error:", err);
    return { url: null, error: "Failed to initialize secure checkout" };
  }
}
