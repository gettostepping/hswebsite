export const emailConfig = {
  // ============================================
  // BRAND SETTINGS — Edit these to match your brand
  // ============================================
  brand: {
    companyName: "HeartSaverNY Training Academy",
    logoUrl: "https://placehold.co/200x60/1e40af/ffffff?text=HeartSaverNY+Training",
    primaryColor: "#1e40af",
    secondaryColor: "#22c55e",
    supportEmail: "support@lifesavertraining.com",
    phoneNumber: "(555) 123-4567",
    address: "123 Training Center Drive, Suite 100, Medical City, MC 12345",
    website: "https://lifesavertraining.com",
    socialLinks: {
      facebook: "https://facebook.com/lifesavertraining",
      instagram: "https://instagram.com/lifesavertraining",
      linkedin: "https://linkedin.com/company/lifesavertraining",
    },
  },

  // ============================================
  // BOOKING CONFIRMATION EMAIL
  // ============================================
  booking: {
    subject: "🎉 Booking Confirmed – {courseName}",
    header: "Your Training is Confirmed!",
    introText:
      "Thank you for booking your training session. We're excited to see you! Here are your booking details:",
    footerText:
      "Need to reschedule? Contact us at least 48 hours before your session. We're happy to help!",
    ctaText: "View My Booking",
  },

  // ============================================
  // CORPORATE INQUIRY EMAIL
  // ============================================
  corporate: {
    subject: "Corporate Training Inquiry Received",
    autoReplySubject: "Thank You for Your Corporate Training Inquiry",
    autoReplyText:
      "Thank you for reaching out about corporate training! Our team will review your inquiry and get back to you within 1 business day. We look forward to helping your team get certified.",
    internalNotificationSubject: "New Corporate Training Inquiry from {companyName}",
  },

  // ============================================
  // CONTACT FORM EMAIL
  // ============================================
  contact: {
    subject: "Contact Form Message Received",
    autoReplySubject: "We Received Your Message",
    autoReplyText:
      "Thank you for contacting us! We've received your message and will respond within 24 hours. If you need immediate assistance, please call us.",
    internalNotificationSubject: "New Contact Form Submission from {name}",
  },

  // ============================================
  // MAGIC LINK LOGIN EMAIL
  // ============================================
  magicLink: {
    subject: "Sign In to HeartSaverNY Training Academy",
    header: "Sign In to Your Account",
    bodyText:
      "Click the button below to securely sign in to your account. This link will expire in 24 hours.",
    ctaText: "Sign In Now",
    footerNote: "If you didn't request this email, you can safely ignore it.",
  },
};

export type EmailConfig = typeof emailConfig;
