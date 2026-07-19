export class FormatHelper {
  static toRupiah(amount: number | string): string {
    const num = typeof amount === "string" ? Number(amount) : amount;
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
  }

  static toDateID(date: Date): string {
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
  }

  static toDateTimeID(date: Date): string {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(date) + " WIB";
  }
}