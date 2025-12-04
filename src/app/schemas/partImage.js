import * as z from "zod"

export const partImageSchema = z.object({
    id: z.number().optional(),
    source: z.string(),
    isThumbnail: z.boolean().default(false),
})