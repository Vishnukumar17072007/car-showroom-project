// utils/sendEmail.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or your SMTP provider (SendGrid, SES, etc.)
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"CarField" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your CarField password reset code",
    html: `<p>Your one-time code is <b>${otp}</b>. It expires in 10 minutes. If you didn't request this, ignore this email.</p>`,
  });
};