import nodemailer from "nodemailer";
import dns from "dns";

// Render's network can't route Gmail's IPv6 SMTP address — force IPv4 resolution
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4, // force IPv4 even if DNS still returns AAAA
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  connectionTimeout: 10000, // fail fast instead of hanging if this ever recurs
});

export const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"CarField" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your CarField password reset code",
    html: `<p>Your one-time code is <b>${otp}</b>. It expires in 10 minutes. If you didn't request this, ignore this email.</p>`,
  });
};