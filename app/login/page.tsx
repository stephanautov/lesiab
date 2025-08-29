// path: app/login/page.tsx
"use client";

import * as React from "react";
import { getSupabaseBrowser } from "../../lib/auth";

export default function LoginPage() {
  const supabase = React.useMemo(() => getSupabaseBrowser(), []);
  const [email, setEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, [supabase]);

  const onGoogle = async () => {
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/")}`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  };

  const onSignOut = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-xl font-semibold">Sign in</h1>

      {email ? (
        <div className="rounded border p-3 text-sm">
          <p className="mb-2">
            Signed in as <b>{email}</b>
          </p>
          <button
            onClick={onSignOut}
            className="rounded border px-4 py-2 text-sm"
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={onGoogle}
            className="rounded bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Continue with Google
          </button>
          <p className="text-xs text-neutral-600">
            You’ll be redirected back to the app after signing in.
          </p>
        </div>
      )}
    </main>
  );
}
