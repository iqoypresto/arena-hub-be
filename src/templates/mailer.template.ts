const baseLayout = (title: string, bodyHtml: string) => `
<div style="font-family:sans-serif;max-width:520px;margin:auto;border:1px solid #eee;border-radius:8px;overflow:hidden">
  <div style="background:#0f172a;padding:20px;text-align:center">
    <span style="color:#a3e635;font-weight:800;font-size:20px">ARENA<span style="color:#fff">HUB</span></span>
  </div>
  <div style="padding:24px;color:#111">
    <h2 style="margin-top:0">${title}</h2>
    ${bodyHtml}
  </div>
  <div style="padding:16px;text-align:center;color:#888;font-size:12px">© ArenaHub</div>
</div>`;

export const MailerTemplate = {
  verifyEmail: (fullName: string, verifyUrl: string) =>
    baseLayout(
      "Verifikasi Akun Kamu",
      `<p>Hai ${fullName},</p>
       <p>Terima kasih sudah daftar di ArenaHub. Klik tombol di bawah untuk verifikasi email kamu (berlaku 24 jam):</p>
       <p><a href="${verifyUrl}" style="background:#a3e635;color:#000;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700">Verifikasi Email</a></p>
       <p>Kalau tombol tidak bisa diklik, salin link ini: ${verifyUrl}</p>`,
    ),

  resetPassword: (fullName: string, resetUrl: string) =>
    baseLayout(
      "Reset Password",
      `<p>Hai ${fullName}, kami menerima permintaan reset password untuk akun kamu.</p>
       <p><a href="${resetUrl}" style="background:#a3e635;color:#000;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700">Reset Password</a></p>
       <p>Link berlaku 1 jam. Kalau kamu tidak meminta ini, abaikan email ini.</p>`,
    ),

  bookingInvoice: (
    fullName: string,
    b: {
      bookingCode: string;
      courtName: string;
      date: string;
      time: string;
      totalPrice: string;
      paymentDeadline: string;
      bankName: string;
      accountNumber: string;
      accountHolder: string;
    },
  ) =>
    baseLayout(
      "Invoice Booking Kamu",
      `<p>Hai ${fullName}, booking kamu berhasil dibuat. Segera selesaikan pembayaran sebelum batas waktu habis.</p>
       <table style="width:100%;border-collapse:collapse;margin:16px 0">
         <tr><td style="padding:6px 0;color:#555">Kode Booking</td><td style="text-align:right;font-weight:700">${b.bookingCode}</td></tr>
         <tr><td style="padding:6px 0;color:#555">Lapangan</td><td style="text-align:right">${b.courtName}</td></tr>
         <tr><td style="padding:6px 0;color:#555">Tanggal & Jam</td><td style="text-align:right">${b.date}, ${b.time}</td></tr>
         <tr><td style="padding:6px 0;color:#555">Total Bayar</td><td style="text-align:right;font-weight:700">${b.totalPrice}</td></tr>
         <tr><td style="padding:6px 0;color:#555">Batas Waktu Bayar</td><td style="text-align:right;color:#dc2626">${b.paymentDeadline}</td></tr>
       </table>
       <p>Transfer ke:<br/>${b.bankName} — ${b.accountNumber} a.n ${b.accountHolder}</p>
       <p>Setelah transfer, upload bukti bayar di halaman booking kamu sebelum batas waktu habis.</p>`,
    ),

  bookingApproved: (fullName: string, b: { bookingCode: string; courtName: string; date: string; time: string }) =>
    baseLayout(
      "Pembayaran Dikonfirmasi 🎉",
      `<p>Hai ${fullName}, pembayaran booking <b>${b.bookingCode}</b> sudah kami verifikasi.</p>
       <p>Lapangan <b>${b.courtName}</b> pada <b>${b.date}, ${b.time}</b> sudah pasti jadi milikmu. Sampai jumpa di lapangan!</p>`,
    ),

  bookingRejected: (fullName: string, b: { bookingCode: string; reason: string; newDeadline: string }) =>
    baseLayout(
      "Bukti Pembayaran Ditolak",
      `<p>Hai ${fullName}, bukti pembayaran untuk booking <b>${b.bookingCode}</b> ditolak dengan alasan:</p>
       <p style="background:#fef2f2;border-left:4px solid #dc2626;padding:10px">${b.reason}</p>
       <p>Silakan upload ulang bukti pembayaran yang valid sebelum <b>${b.newDeadline}</b>, atau booking otomatis dibatalkan.</p>`,
    ),
};