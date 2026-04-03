import {
  Button,
  Heading,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "../components/EmailLayout";
import { emailConfig } from "../../lib/email-config";

interface BookingConfirmationProps {
  studentName: string;
  courseName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  amount: string;
  bookingId: string;
}

export const BookingConfirmation = ({
  studentName = "John Doe",
  courseName = "BLS Provider Course",
  date = "January 15, 2025",
  startTime = "9:00 AM",
  endTime = "1:00 PM",
  location = "HeartSaverNY Training Center",
  amount = "$85.00",
  bookingId = "BK-001",
}: BookingConfirmationProps) => {
  const { booking, brand } = emailConfig;

  return (
    <EmailLayout preview={`Booking Confirmed: ${courseName} on ${date}`}>
      <Heading style={heading}>{booking.header}</Heading>

      <Text style={paragraph}>Hi {studentName},</Text>

      <Text style={paragraph}>{booking.introText}</Text>

      <Section style={detailsBox}>
        <Text style={detailLabel}>Course</Text>
        <Text style={detailValue}>{courseName}</Text>

        <Text style={detailLabel}>Date</Text>
        <Text style={detailValue}>{date}</Text>

        <Text style={detailLabel}>Time</Text>
        <Text style={detailValue}>
          {startTime} – {endTime}
        </Text>

        <Text style={detailLabel}>Location</Text>
        <Text style={detailValue}>{location}</Text>

        <Text style={detailLabel}>Amount Paid</Text>
        <Text style={detailValue}>{amount}</Text>

        <Text style={detailLabel}>Booking ID</Text>
        <Text style={detailValue}>{bookingId}</Text>
      </Section>

      <Section style={ctaSection}>
        <Button
          href={`${brand.website}/booking/success?id=${bookingId}`}
          style={ctaButton}
        >
          {booking.ctaText}
        </Button>
      </Section>

      <Text style={paragraph}>{booking.footerText}</Text>

      <Text style={signoff}>
        Best regards,
        <br />
        The {brand.companyName} Team
      </Text>
    </EmailLayout>
  );
};

const heading = {
  fontSize: "24px",
  fontWeight: "700" as const,
  color: "#1e40af",
  marginBottom: "16px",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#334155",
  marginBottom: "16px",
};

const detailsBox = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "20px 24px",
  marginBottom: "24px",
};

const detailLabel = {
  fontSize: "12px",
  fontWeight: "600" as const,
  color: "#64748b",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "12px 0 2px",
};

const detailValue = {
  fontSize: "15px",
  fontWeight: "600" as const,
  color: "#1e293b",
  margin: "0 0 8px",
};

const ctaSection = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const ctaButton = {
  backgroundColor: "#1e40af",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};

const signoff = {
  fontSize: "14px",
  color: "#64748b",
  lineHeight: "1.6",
};

export default BookingConfirmation;
