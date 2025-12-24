import { Env } from "./env";

export const REGISTER_URL = `${Env.BACKEND_URL}/api/auth/register`
export const LOGIN_URL = `${Env.BACKEND_URL}/api/auth/login`
export const CHECK_CREDENTIALS_URL = `${Env.BACKEND_URL}/api/auth/check/credentials`
export const FORGET_PASSWORD_URL = `${Env.BACKEND_URL}/api/auth/forget-password`
export const RESET_PASSWORD_URL = `${Env.BACKEND_URL}/api/auth/reset-password`

