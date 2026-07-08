import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    accessToken?: string;
    role?: string;
    image?: string | null;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    role?: string;
  }
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({ clientId: process.env.AUTH_GITHUB_CLIENT_ID!, clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET! }),
    GoogleProvider({ clientId: process.env.AUTH_GOOGLE_CLIENT_ID!, clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET! }),
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
     async authorize(credentials) {
    const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Login failed");
    }

    return {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,

        accessToken: data.token, // JWT
        role: data.user.role,
    };
}
    }),
  ],
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
callbacks: {
  async jwt({ token, user, account }) {

    // Credentials Login
    if (user && account?.provider === "credentials") {
      token.id = user.id;
      token.accessToken = user.accessToken;
      token.role = (user as any).role;
    }

    // Google / Github Login
    if (
      user &&
      (account?.provider === "google" ||
        account?.provider === "github")
    ) {

      const res = await fetch(`${API_BASE_URL}/api/users/oauth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          avatar: user.image,
          provider: account.provider,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "OAuth login failed");
      }

      token.id = data.user.id;
      token.accessToken = data.token;
      token.role = data.user.role;
    }

    return token;
  },

  async session({ session, token }) {

    if (session.user) {
      session.user.id = token.id as string;
      (session.user as any).role = token.role;
    }

    session.accessToken = token.accessToken as string;

    return session;
  },

  async redirect({ baseUrl }) {
    return `${baseUrl}/dashboard`;
  },
},
};