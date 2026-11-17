import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

const registerFields = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be at most 60 characters'),
  email: z.email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must contain a letter')
    .regex(/\d/, 'Password must contain a number'),
  confirmPassword: z.string().min(1, 'Confirm your password'),
})

// Used by the sign-up form
export const registerSchema = registerFields.refine(
  (data) => data.password === data.confirmPassword,
  { path: ['confirmPassword'], message: 'Passwords do not match' },
)

// Used by the service, which does not need the confirmation field
export const newUserSchema = registerFields.omit({ confirmPassword: true })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
