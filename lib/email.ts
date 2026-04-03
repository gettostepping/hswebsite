import { Resend } from "resend";
import { render } from "@react-email/components";
import { emailConfig } from "./email-config";
import BookingConfirmation from "../emails/templates/booking-confirmation";
import CorporateInquiryReceived from "../emails/templates/corporate-inquiry-received";
import ContactFormReceived from "../emails/templates/contact-form-received";
import MagicLinkLogin from "../emails/templates/magic-link-login";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = `${emailConfig.brand.companyName} <onboarding@resend.dev>`;
export async function sendBookingConfirmationEmail(params: {
  to: string;
  studentName: string;
  courseName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  amount: string;
  bookingId: string;
}) {
  try {
    const html = await render(
      React.createElement(BookingConfirmation, {
        studentName: params.studentName,
        courseName: params.courseName,
        date: params.date,
        startTime: params.startTime,
        endTime: params.endTime,
        location: params.location,
        amount: params.amount,
        bookingId: params.bookingId,
      })
    );

    const subject = emailConfig.booking.subject.replace(
      "{courseName}",
      params.courseName
    );

    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
  }
}

export async function sendCorporateInquiryEmail(params: {
  to: string;
  contactName: string;
  companyName: string;
}) {
  try {
    const html = await render(
      React.createElement(CorporateInquiryReceived, {
        contactName: params.contactName,
        companyName: params.companyName,
      })
    );

    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: emailConfig.corporate.autoReplySubject,
      html,
    });
  } catch (error) {
    console.error("Failed to send corporate inquiry email:", error);
  }
}

export async function sendContactEmail(params: { to: string; name: string }) {
  try {
    const html = await render(
      React.createElement(ContactFormReceived, { name: params.name })
    );

    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: emailConfig.contact.autoReplySubject,
      html,
    });
  } catch (error) {
    console.error("Failed to send contact email:", error);
  }
}

export async function sendMagicLinkEmail(params: {
  to: string;
  url: string;
}) {
  try {
    const html = await render(
      React.createElement(MagicLinkLogin, { url: params.url })
    );

    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: emailConfig.magicLink.subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send magic link email:", error);
  }
}
