// lib/auth.js
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      // scope: "read:user user:email" // default is fine; uncomment if you need more
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // On first sign in attach basic info to the token
      if (account?.provider === "github") {
        token.provider = "github";
      }
      return token;
    },
    async session({ session, token }) {
      // Expose useful bits to the client if needed
      session.provider = token.provider;
      return session;
    },
  },
  pages: {
    // Use NextAuth default pages for now; we can customize later
  },
  // You already set NEXTAUTH_URL and NEXTAUTH_SECRET in env
};
