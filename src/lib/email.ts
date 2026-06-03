import nodemailer from 'nodemailer';

// Initialize the secure Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface WelcomeEmailProps {
  studentEmail: string;
  studentName: string;
  trackName: string;
}

export async function sendStudentWelcomeEmail({
  studentEmail,
  studentName,
  trackName,
}: WelcomeEmailProps) {
  try {
    const mailOptions = {
      // 🚀 Displays as "Steins Academy" in the inbox, sending from your official Gmail account
      from: `"Steins Academy" <${process.env.GMAIL_USER}>`,
      to: studentEmail,
      subject: `[Steins Academy] Enrollment Confirmed: ${trackName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #334155;">
          
          <div style="margin-bottom: 32px;">
            <p style="font-size: 10px; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; color: #A27B2C; margin: 0 0 4px 0;">Steins Academy</p>
            <h1 style="font-size: 24px; font-weight: 800; color: #001D4A; margin: 0; letter-spacing: -0.025em;">Seat Confirmed</h1>
          </div>

          <p style="font-size: 15px; line-height: 1.6; color: #475569;">Hello ${studentName},</p>
          
          <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Your payment has been successfully verified. Your seat in the upcoming live cohort for <strong>${trackName}</strong> is officially locked in.
          </p>

          <div style="background-color: #F8F9FA; border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px; margin: 32px 0;">
            <h3 style="font-size: 14px; font-weight: 700; color: #001D4A; margin: 0 0 8px 0;">📅 What Happens Next?</h3>
            <p style="font-size: 13px; line-height: 1.5; color: #475569; margin: 0;">
              Our instructors are compiling the onboarding calendar. You will receive a direct calendar invitation containing the secure live-stream links, schedule details, and lecture links 24 hours prior to our first live session.
            </p>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            No software installation or portal account creation is required yet. If you have any immediate questions, simply reply directly to this email transmission.
          </p>

          <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 40px 0 24px 0;" />

          <p style="font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">
            Security Node Alpha • Automated Operational Transmission
          </p>
        </div>
      `,
    };

    // Send the transmission
    const info = await transporter.sendMail(mailOptions);

    return { success: true, data: info.messageId };
  } catch (err: any) {
    console.error('❌ Failed to dispatch registration email via Gmail:', err.message);
    return { success: false, error: err.message };
  }
}