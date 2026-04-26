import { useCallback } from "react";

import { AI_MODEL_NAME, API_BASE_URL } from "@/lib/api";
import {
  getGoogleClientId,
  isGoogleAuthApiAvailable,
  getGoogleOAuthRedirectUri,
  logoutFromBackend,
  signInWithGoogle,
} from "@/lib/auth";
import { usePopupStore } from "@/store/use-popup-store";

export function SettingTabBody() {
  const authStatus = usePopupStore((state) => state.authStatus);
  const authUser = usePopupStore((state) => state.authUser);
  const authError = usePopupStore((state) => state.authError);
  const setAuthLoading = usePopupStore((state) => state.setAuthLoading);
  const setAuthReady = usePopupStore((state) => state.setAuthReady);
  const setAuthSignedOut = usePopupStore((state) => state.setAuthSignedOut);
  const setAuthError = usePopupStore((state) => state.setAuthError);
  const googleClientId = getGoogleClientId();
  const isGoogleAuthAvailable = isGoogleAuthApiAvailable();
  const googleRedirectUri = getGoogleOAuthRedirectUri();
  const isAuthLoading = authStatus === "loading";
  const isSignedIn = authStatus === "signed-in" && Boolean(authUser);

  const handleGoogleSignIn = useCallback(async () => {
    setAuthLoading();

    try {
      const authSession = await signInWithGoogle();
      setAuthReady(authSession);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to complete Google authentication.";
      setAuthError(message);
    }
  }, [setAuthError, setAuthLoading, setAuthReady]);

  const handleLogout = useCallback(async () => {
    setAuthLoading();

    try {
      await logoutFromBackend();
      setAuthSignedOut();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to complete logout.";
      setAuthError(message);
    }
  }, [setAuthError, setAuthLoading, setAuthSignedOut]);

  return (
    <div className="mt-6 grid min-h-0 flex-1 content-start gap-3 overflow-y-auto rounded-2xl bg-secondary/65 p-4">
      <div className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Authentication
        </p>

        <p className="mt-3 text-sm text-muted-foreground">
          Sign in with Google to enable all API endpoints.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          If the popup closes during Google sign-in, reopen it to see your updated status.
        </p>

        <div className="mt-4 rounded-lg border border-border/70 bg-background/70 p-3">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Status
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {isSignedIn
              ? `Signed in as ${authUser?.email ?? "user"}`
              : authStatus === "error"
                ? "Authentication error"
                : "Signed out"}
          </p>

          {isSignedIn && authUser ? (
            <div className="mt-3 rounded-md border border-border/70 bg-background/80 px-3 py-2 text-sm">
              <p className="m-0 font-medium text-foreground">{authUser.name}</p>
              <p className="m-0 text-muted-foreground">{authUser.email}</p>
            </div>
          ) : null}

          {authError ? (
            <p className="mt-2 text-sm text-rose-600">{authError}</p>
          ) : null}
        </div>

        <div className="mt-3 flex items-center gap-2">
          {isSignedIn ? (
            <button
              type="button"
              onClick={() => {
                void handleLogout();
              }}
              disabled={isAuthLoading}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAuthLoading ? "Signing out..." : "Sign out"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                void handleGoogleSignIn();
              }}
              disabled={isAuthLoading || !googleClientId || !isGoogleAuthAvailable}
              className="inline-flex items-center justify-center rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAuthLoading ? "Signing in..." : "Sign in with Google"}
            </button>
          )}
        </div>

        {!googleClientId ? (
          <p className="mt-2 text-xs text-rose-600">
            Missing VITE_GOOGLE_CLIENT_ID in your .env file.
          </p>
        ) : !isGoogleAuthAvailable ? (
          <p className="mt-2 text-xs text-rose-600">
            Google sign-in is only available from the installed extension popup
            (chrome://extensions -&gt; Load unpacked dist).
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          API Config
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          The extension reads these values from your local `.env` file at build
          time.
        </p>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              API Base URL
            </dt>
            <dd className="mt-1 break-all font-medium text-foreground">
              {API_BASE_URL}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              AI Model
            </dt>
            <dd className="mt-1 break-all font-medium text-foreground">
              {AI_MODEL_NAME}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Google Client ID
            </dt>
            <dd className="mt-1 break-all font-medium text-foreground">
              {googleClientId || "Not configured"}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Google Redirect URI
            </dt>
            <dd className="mt-1 break-all font-medium text-foreground">
              {googleRedirectUri || "Unavailable outside extension popup"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
