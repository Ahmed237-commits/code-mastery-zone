import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: { id?: string; name?: string | null; email?: string | null; image?: string | null };
    accessToken?: string;
  }
  interface User { id?: string; accessToken?: string }
}

declare module "next-auth/jwt" {
  interface JWT { id?: string; accessToken?: string }
}

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({ clientId: process.env.AUTH_GITHUB_CLIENT_ID!, clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET! }),
    GoogleProvider({ clientId: process.env.AUTH_GOOGLE_CLIENT_ID!, clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET! }),
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        const res = await fetch("http://localhost:8000/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: credentials?.email, password: credentials?.password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");

        return { id: data.user.id, name: data.user.name, email: data.user.email, accessToken: data.token };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.accessToken = user.accessToken }
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
    async redirect({ baseUrl }) { return `${baseUrl}/dashboard` },
  },
  pages: { signIn: "/signIn", signOut: "/signOut" },
  secret: process.env.NEXTAUTH_SECRET,
};