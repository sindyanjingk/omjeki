import { Role } from "@prisma/client";
import axios from "axios";
import jwt from "jsonwebtoken";
import CredentialsProvider from "next-auth/providers/credentials";

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string , role : Role};
  } catch (error) {
    return null;
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { username, password } = credentials ?? {};

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_URL}/api/login-driver`,
            {
              email: username,
              password,
            }
          );

          console.log({response});

          if (response.status === 200 && response.data) {
            return {
              id: response.data?.user?.id,
              name: response.data?.user?.name,
              email: response.data?.user?.email,
              accessToken: response.data?.token,
            };
          }

          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user } : {token: any, user: any}) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token } : {session: any, token: any}) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          accessToken : token.accessToken
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
