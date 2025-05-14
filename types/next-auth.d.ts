// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    id: string;
    name: string;
  }
  
  interface User {
    id: string;
    name: string;
  }
}
