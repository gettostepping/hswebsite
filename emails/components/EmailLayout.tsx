import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { emailConfig } from "../../lib/email-config";

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export const EmailLayout = ({ preview, children }: EmailLayoutProps) => {
  const { brand } = emailConfig;

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Img
              src={brand.logoUrl}
              width="200"
              height="60"
              alt={brand.companyName}
              style={logo}
            />
          </Section>

          <Hr style={divider} />

          {/* Main Content */}
          <Section style={content}>{children}</Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerCompany}>{brand.companyName}</Text>
            <Text style={footerAddress}>{brand.address}</Text>
            <Text style={footerContact}>
              📞 {brand.phoneNumber} | ✉️{" "}
              <Link href={`mailto:${brand.supportEmail}`} style={footerLink}>
                {brand.supportEmail}
              </Link>
            </Text>

            {/* Social Links */}
            <Section style={socialSection}>
              {brand.socialLinks.facebook && (
                <Link href={brand.socialLinks.facebook} style={socialLink}>
                  Facebook
                </Link>
              )}
              {brand.socialLinks.instagram && (
                <Link href={brand.socialLinks.instagram} style={socialLink}>
                  Instagram
                </Link>
              )}
              {brand.socialLinks.linkedin && (
                <Link href={brand.socialLinks.linkedin} style={socialLink}>
                  LinkedIn
                </Link>
              )}
            </Section>

            <Text style={footerDisclaimer}>
              © {new Date().getFullYear()} {brand.companyName}. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
  borderRadius: "8px",
  overflow: "hidden" as const,
};

const header = {
  padding: "24px 32px",
  backgroundColor: "#1e40af",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const divider = {
  borderColor: "#e6ebf1",
  margin: "0",
};

const content = {
  padding: "32px",
};

const footer = {
  padding: "24px 32px",
  backgroundColor: "#f8fafc",
  textAlign: "center" as const,
};

const footerCompany = {
  fontSize: "16px",
  fontWeight: "700" as const,
  color: "#1e40af",
  margin: "0 0 4px",
};

const footerAddress = {
  fontSize: "13px",
  color: "#64748b",
  margin: "0 0 4px",
};

const footerContact = {
  fontSize: "13px",
  color: "#64748b",
  margin: "0 0 16px",
};

const footerLink = {
  color: "#1e40af",
  textDecoration: "none",
};

const socialSection = {
  textAlign: "center" as const,
  marginBottom: "16px",
};

const socialLink = {
  color: "#1e40af",
  textDecoration: "none",
  fontSize: "13px",
  marginRight: "16px",
};

const footerDisclaimer = {
  fontSize: "12px",
  color: "#94a3b8",
  margin: "0",
};

export default EmailLayout;
