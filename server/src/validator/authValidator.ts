import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long or password is required"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long or confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long or password is required"),
});
