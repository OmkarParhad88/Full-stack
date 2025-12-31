import { LOGIN_URL } from "@/lib/apiEndPoints";
import axios from "axios";
import { User, type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token, user }) {
      session.user = token.user as User
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials, req) {
        try {
          const { data } = await axios.post(LOGIN_URL, credentials)
          const user = data?.data
          if (user) {
            return user
          } else {
            return null
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.log("NextAuth Error:", error.response?.data);
          } else {
            console.log("NextAuth Error:", error);
          }
          return null
        }

      }
    }),
  ],
}
