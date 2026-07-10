import { DayOfWeek } from "@prisma/client";

export class DateHelper {
  private static readonly DAYS: DayOfWeek[] = [
    DayOfWeek.SUNDAY,
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
  ];

  static getDayOfWeek(date: Date): DayOfWeek {
    return this.DAYS[date.getDay()]!;
  }

  static getStartOfDay(date: Date): Date {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    return start;
  }

  static getEndOfDay(date: Date): Date {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return end;
  }

  static addMinutes(date: Date, minutes: number){
    const result = new Date(date)
    result.setMinutes(result.getMinutes() + minutes)
    return result
  }
}