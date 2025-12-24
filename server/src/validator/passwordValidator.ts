import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
})

export const resetPasswordSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  token: z.string({ message: "Token is required" }),
  password: z.string({ message: "Password is required" }).min(6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z.string({ message: "Confirm Password is required" }).min(6, { message: "Confirm Password must be at least 6 characters long" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})