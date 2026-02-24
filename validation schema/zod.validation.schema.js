import {z} from "zod"

export const signupPostRequestValidationSchema = z.object({
    firstName: z.string(),
    lastName: z.string().optional(),

    email: z.string().email(),
    
    password: z.string().min(8)
})

export const loginPostRequestValidationSchema = z.object({
    email: z.string().email(),

    password: z.string()
})