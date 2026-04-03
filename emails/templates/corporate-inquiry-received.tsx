import {
  Heading,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "../components/EmailLayout";
import { emailConfig } from "../../lib/email-config";

interface CorporateInquiryReceivedProps {
  contactName: string;
  companyName: string;
}

export const CorporateInquiryReceived = ({
  contactName = "Jane Smith",
  companyName = "Acme Corp",
}: CorporateInquiryReceivedProps) => {
  const { corporate, brand } = emailConfig;

  return (
    <EmailLayout preview={`Thank you for your corporate training inquiry`}>
      <Heading style={heading}>Corporate Training Inquiry Received</Heading>

      <Text style={paragraph}>Hi {contactName},</Text>

      <Text style={paragraph}>{corporate.autoReplyText}</Text>

      <Section style={infoBox}>
        <Text style={infoText}>
          <strong>What happens next?</strong>
        </Text>
        <Text style={infoText}>
          Our corporate training specialist will review your requirements and
          reach out with a customized training proposal for {companyName}.
        </Text>
      </Section>

      <Text style={paragraph}>
        If you need immediate assistance, don&apos;t hesitate to call us at{" "}
        <strong>{brand.phoneNumber}</strong> or email{" "}
        <strong>{brand.supportEmail}</strong>.
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

const infoBox = {
  backgroundColor: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "8px",
  padding: "20px 24px",
  marginBottom: "24px",
};

const infoText = {
  fontSize: "14px",
  color: "#1e40af",
  lineHeight: "1.6",
  margin: "0 0 8px",
};

const signoff = {
  fontSize: "14px",
  color: "#64748b",
  lineHeight: "1.6",
};

export default CorporateInquiryReceived;
