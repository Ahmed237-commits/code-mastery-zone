import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
    };
  }
}
export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET as string,
    }),

    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 🟡 هنا هتربط بقاعدة البيانات
        // مثال بسيط (غير آمن للإنتاج)
        const user = {
          id: "1",
          name: "Ahmed",
          email: credentials.email,
        };

        return user; // لازم ترجع user object
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // يوم
  },

  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
    }
    return token;
  },

  async session({ session, token }) {
    if (session.user && token) {
      session.user.id = token.id as string;
    }
    return session;
  },

  async redirect({ url, baseUrl }) {
    // بعد تسجيل الدخول دايمًا يروح على الداشبورد
    return `${baseUrl}/dashboard`;
  },
},

  pages: {
    signIn: "/signIn",
    signOut: "/signOut",
  },

  secret: process.env.AUTH_SECRET,
};

export default authOptions;
