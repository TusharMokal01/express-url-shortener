import {z} from "zod"

export const shortenUrlPostRequestValidationSchema = z.object({
    url: z.string().url(),
    code: z.string().optional()
})