import { SportType, CourtStatus } from "@prisma/client";
import z from "zod";

export class CourtValidation {
  static readonly getAvailability = z.object({
    params: z.object({
      courtId: z.uuid(),
    }),
    query: z.object({
      date: z.iso.date(),
    }),
  });

  static readonly CREATE = z.object({
    body: z.object({
      name: z.string().min(1).max(100),
      sportType: z.enum(SportType),
      pricePerHour: z.coerce.number().positive(),
    }),
  });

  static readonly UPDATE = z.object({
    params: z.object({ courtId: z.uuid() }),
    body: z.object({
      name: z.string().min(1).max(100).optional(),
      sportType: z.enum(SportType).optional(),
      pricePerHour: z.coerce.number().positive().optional(),
      status: z.enum(CourtStatus).optional(),
    }),
  });

  static readonly DELETE = z.object({
    params: z.object({ courtId: z.uuid() }),
  });

  static readonly LIST = z.object({
    query: z.object({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(10),
    }),
  });
}

export type CourtCreateInput = z.infer<typeof CourtValidation.CREATE>;
export type CourtUpdateInput = z.infer<typeof CourtValidation.UPDATE>;
export type CourtDeleteInput = z.infer<typeof CourtValidation.DELETE>;
export type CourtListInput = z.infer<typeof CourtValidation.LIST>;