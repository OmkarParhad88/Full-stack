import { z } from "zod";
import { mimeTypes } from "../config/fileSystem";

export const multerFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  filename: z.string(),
  path: z.string(),
  destination: z.string(),
  encoding: z.string(),
  mimetype: z.string().refine((type) => mimeTypes.includes(type), {
    error: "Only PNG and JPEG images are allowed",
  }),
  size: z.number().max(2 * 1024 * 1024, { error: "File size must be less than 2MB" }),
}, {
  error: "Image is required",
}).transform((data) => data.filename);


export const createFightSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(3, { error: "Title must be at least 3 characters long" })
    .max(100, { error: "Title must be at most 100 characters long" }),

  description: z
    .string({ error: "Description is required" })
    .min(3, { error: "Description must be at least 3 characters long" })
    .max(800, { error: "Description must be at most 800 characters long" }),

  image: multerFileSchema,

  expire_at: z
    .date({ error: "Expire date is required" })
});

export const updateFightSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(3, { error: "Title must be at least 3 characters long" })
    .max(100, { error: "Title must be at most 100 characters long" })
    .optional(),

  description: z
    .string({ error: "Description is required" })
    .min(3, { error: "Description must be at least 3 characters long" })
    .max(800, { error: "Description must be at most 800 characters long" })
    .optional(),

  image: multerFileSchema.optional(),

  expire_at: z
    .date({ error: "Expire date is required" })
    .optional(),
});

