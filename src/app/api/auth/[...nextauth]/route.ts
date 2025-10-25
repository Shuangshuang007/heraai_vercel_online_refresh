import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // 可在此同步用户信息到数据库
      return true;
    },
    async jwt({ token, user, account }) {
      // 将用户邮箱添加到token中
      if (user?.email) {
        token.registeredEmail = user.email;
      }
      return token;
    },
    async session({ session, token, user }) {
      // 将registeredEmail添加到session中
      if (token.registeredEmail && typeof token.registeredEmail === 'string') {
        session.registeredEmail = token.registeredEmail;
      }
      return session;
    },
    async redirect() {
      return "/profile";
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
});

export { handler as GET, handler as POST }; 