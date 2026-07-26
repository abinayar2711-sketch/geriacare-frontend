import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { db, users, accounts, sessions, verificationTokens } from "@/db";

const moderatorEmails = (process.env.MODERATOR_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [Google],
  session: { strategy: "database" },
  callbacks: {
    async session({ session, user }) {
      const [row] = await db
        .select({ role: users.role, specialization: users.specialization })
        .from(users)
        .where(eq(users.id, user.id));
      session.user.id = user.id;
      session.user.role = row?.role ?? "family";
      session.user.specialization = row?.specialization ?? null;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (user.email && moderatorEmails.includes(user.email.toLowerCase())) {
        await db
          .update(users)
          .set({ role: "moderator" })
          .where(eq(users.id, user.id!));
      }
    },
  },
  pages: { signIn: "/signin" },
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "family" | "expert" | "moderator";
      specialization: string | null;
    } & import("next-auth").DefaultSession["user"];
  }
}
