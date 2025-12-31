import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      token?: string | null
    }
  }

  interface User {
    token?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token?: string | null
  }
}