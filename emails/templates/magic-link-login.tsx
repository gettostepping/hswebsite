import {
  Button,
  Heading,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "../components/EmailLayout";
import { emailConfig } from "../../lib/email-config";

interface MagicLinkLoginProps {
  url: string;
}

export const MagicLinkLogin = ({
  url = "https://lifesavertraining.com/api/auth/callback/email?token=xxx",
}: MagicLinkLoginProps) => {
  const { magicLink, brand } = emailConfig;

  return (
    <EmailLayout preview={magicLink.subject}>
      <Heading style={heading}>{magicLink.header}</Heading>

      <Text style={paragraph}>{magicLink.bodyText}</Text>

      <Section style={ctaSection}>
        <Button href={url} style={ctaButton}>
          {magicLink.ctaText}
        </Button>
      </Section>

      <Text style={paragraph}>
        Or copy and paste this URL into your browser:
        <br />
        <span style={urlText}>{url}</span>
      </Text>

      <Text style={footerNote}>{magicLink.footerNote}</Text>

      <Text style={signoff}>
        — The {brand.companyName} Team
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

const ctaSection = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const ctaButton = {
  backgroundColor: "#1e40af",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 40px",
};

const urlText = {
  fontSize: "12px",
  color: "#64748b",
  wordBreak: "break-all" as const,
};

const footerNote = {
  fontSize: "13px",
  color: "#94a3b8",
  fontStyle: "italic" as const,
  marginBottom: "16px",
};

const signoff = {
  fontSize: "14px",
  color: "#64748b",
  lineHeight: "1.6",
};

export default MagicLinkLogin;
