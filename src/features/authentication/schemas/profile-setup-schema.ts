import { z } from "zod"

export const profileSetupSchema = z.object({
  firstName: z.string().min(1, "Please enter the First name"),
  lastName: z.string().min(1, "Please enter the Last name"),
  // email: z.string().min(1, 'Email is required').email('Please enter the valid email'),
})



export type ProfileSetupFields = z.infer<typeof profileSetupSchema>