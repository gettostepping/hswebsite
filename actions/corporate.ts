"use server";

import { prisma } from "@/lib/db";
import { corporateInquirySchema, type CorporateInquiryInput } from "@/lib/validations";
import { sendCorporateInquiryEmail } from "@/lib/email";
import type { ActionResponse } from "@/types";

export async function submitCorporateInquiry(
  data: CorporateInquiryInput
): Promise<ActionResponse> {
  try {
    const parsed = corporateInquirySchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid form data",
      };
    }

    await prisma.corporateInquiry.create({
      data: {
        companyName: parsed.data.companyName,
        contactName: parsed.data.contactName,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        message: parsed.data.message,
      },
    });

    // Send auto-reply email
    await sendCorporateInquiryEmail({
      to: parsed.data.email,
      contactName: parsed.data.contactName,
      companyName: parsed.data.companyName,
    });

    return { success: true };
  } catch (error) {
    console.error("Submit corporate inquiry error:", error);
    return { success: false, error: "Failed to submit inquiry. Please try again." };
  }
}
