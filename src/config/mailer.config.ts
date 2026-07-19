import nodemailer from "nodemailer";
import { env } from "./env.config";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});

transporter
  .verify()
  .then(() => console.log("[Mailer] SMTP connection ready"))
  .catch((err) => console.error("[Mailer] SMTP connection failed:", err.message));