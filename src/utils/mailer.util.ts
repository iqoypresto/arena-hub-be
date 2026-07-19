import { transporter } from "../config/mailer.config";
import { env } from "../config/env.config";

export class MailerUtil {
  static async send(to: string, subject: string, html: string) {
    try {
      await transporter.sendMail({ from: env.MAIL_FROM, to, subject, html });
    } catch (err) {
      // Kegagalan kirim email TIDAK BOLEH menggagalkan proses utama (register/booking/approve/reject)
      console.error(`[Mailer] Failed to send "${subject}" to ${to}:`, err);
    }
  }
}