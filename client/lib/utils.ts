import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Env } from "./env"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(image: string) {
  return `${Env.BACKEND_URL}/images/${image}`
}

