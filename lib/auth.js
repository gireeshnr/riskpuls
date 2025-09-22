// lib/auth.js
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "github") {
        token.provider = "github";
      }
      return token;
    },
    async session({ session, token }) {
      session.provider = token.provider ?? null;
      return session;
    },
  },
  // NEXTAUTH_URL and NEXTAUTH_SECRET are already in your env
};
