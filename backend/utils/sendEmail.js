import nodemailer from "nodemailer";
import dns from "dns";

const dnsPromises = dns.promises;

let transporterPromise;

async function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = (async () => {
      const [ipv4] = await dnsPromises.resolve4("smtp.gmail.com");
      return nodemailer.createTransport({
        host: ipv4,
        port: 465,
        secure: true,
        tls: { servername: "smtp.gmail.com" }, // cert is issued for the hostname, not the raw IP
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        connectionTimeout: 10000,
      });
    })();
  }
  return transporterPromise;
}

export const sendOtpEmail = async (to, otp) => {
  const transporter = await getTransporter();
  await transporter.sendMail({
    from: `"CarField" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your CarField password reset code",
    html: `<p>Your one-time code is <b>${otp}</b>. It expires in 10 minutes. If you didn't request this, ignore this email.</p>`,
  });
};