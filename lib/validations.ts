import { z } from "zod";

export const corporateInquirySchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const contactMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const bookingSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
});

export type CorporateInquiryInput = z.infer<typeof corporateInquirySchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
