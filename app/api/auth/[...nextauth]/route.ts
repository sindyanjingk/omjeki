// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";



const handler = NextAuth({
  ...authOptions,
  session: {
    strategy: "jwt" as const,
  }
});
export { handler as GET, handler as POST };
