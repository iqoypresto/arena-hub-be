import z from "zod";

export class CourtValidation{
    static readonly getAvailability = z.object({
        params: z.object({
            courtId: z.uuid()
        }),
        query: z.object({
            date: z.iso.date()
        })
    })
}