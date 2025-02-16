import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'First Name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter the valid email'),
  password: z.string().min(6, 'Password is required')
})

export type SignupFields = z.infer<typeof signupSchema>


