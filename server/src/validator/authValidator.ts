import { z } from "zod";

export const registerSchema = z.object({
  name: z.string({ message: "name is required" }).min(3, { message: "Name must be at least 3 characters long" }),
  email: z.email({ message: "Please enter a valid email" }),
  password: z.string({ message: "password is required" }).min(6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z.string({ message: "password is required" }).min(6, { message: "Confirm Password must be at least 6 characters long" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  password: z.string({ message: "password is required" }).min(6, { message: "Password must be at least 6 characters long" }),
});

