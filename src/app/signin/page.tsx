import Link from "next/link";
import { auth, signIn } from "@/auth";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) return null;

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="mt-2 text-[var(--color-muted)]">
        You don&rsquo;t need an account to read, ask, or answer. This is for
        moderators and verified contributors — signing in proves who you are, so
        your answers carry your name and expertise.
      </p>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <button className="mt-5 rounded-full border border-[var(--color-line)] bg-white px-5 py-2.5 text-sm transition hover:border-[var(--color-accent)]">
          Continue with Google
        </button>
      </form>

      <p className="mt-6 text-sm text-[var(--color-muted)]">
        Just here to ask something?{" "}
        <Link href="/ask" className="text-[var(--color-accent)]">
          Ask a question
        </Link>{" "}
        — no sign-in needed.
      </p>
    </div>
  );
}
