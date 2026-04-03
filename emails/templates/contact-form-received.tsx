import {
  Heading,
  Text,
} from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "../components/EmailLayout";
import { emailConfig } from "../../lib/email-config";

interface ContactFormReceivedProps {
  name: string;
}

export const ContactFormReceived = ({
  name = "John",
}: ContactFormReceivedProps) => {
  const { contact, brand } = emailConfig;

  return (
    <EmailLayout preview={`We received your message`}>
      <Heading style={heading}>Message Received</Heading>

      <Text style={paragraph}>Hi {name},</Text>

      <Text style={paragraph}>{contact.autoReplyText}</Text>

      <Text style={paragraph}>
        📞 Call us: <strong>{brand.phoneNumber}</strong>
        <br />
        ✉️ Email us: <strong>{brand.supportEmail}</strong>
      </Text>

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

const signoff = {
  fontSize: "14px",
  color: "#64748b",
  lineHeight: "1.6",
};

export default ContactFormReceived;
