// utils/sendEmail.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (to, otp) => {
  const { error } = await resend.emails.send({
    from: "CarField <onboarding@resend.dev>",
    to,
    subject: "Your CarField password reset code",
    html: `<p>Your one-time code is <b>${otp}</b>. It expires in 10 minutes. If you didn't request this, ignore this email.</p>`,
  });

  if (error) {
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};