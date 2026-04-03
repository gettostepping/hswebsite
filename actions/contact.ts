"use server";

import { prisma } from "@/lib/db";
import { contactMessageSchema, type ContactMessageInput } from "@/lib/validations";
import { sendContactEmail } from "@/lib/email";
import type { ActionResponse } from "@/types";

export async function submitContactMessage(
  data: ContactMessageInput
): Promise<ActionResponse> {
  try {
    const parsed = contactMessageSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid form data",
      };
    }

    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        message: parsed.data.message,
      },
    });

    // Send auto-reply email
    await sendContactEmail({
      to: parsed.data.email,
      name: parsed.data.name,
    });

    return { success: true };
  } catch (error) {
    console.error("Submit contact message error:", error);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}
