import {
  clearStoredAuthSession,
  getStoredAuthTokenAsync,
  setStoredAuthSession,
  type AuthUser,
} from "@/lib/auth-storage";
import {
  AUTH_MESSAGE_TYPE_SIGN_IN_WITH_GOOGLE,
  type AuthSignInWithGoogleResponse,
} from "@/lib/auth-messages";
import { API_BASE_URL } from "@/lib/api";

const GOOGLE_OAUTH_SCOPES = ["openid", "email", "profile"];

type AuthCallbackResponse = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

export function getGoogleClientId() {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? "";
}

export function isGoogleAuthApiAvailable() {
  const globalChrome =
    typeof globalThis !== "undefined" && "chrome" in globalThis
      ? (globalThis.chrome as typeof chrome)
      : undefined;

  return Boolean(
    globalChrome?.identity?.launchWebAuthFlow &&
      globalChrome?.identity?.getRedirectURL,
  );
}

export function getGoogleOAuthRedirectUri() {
  if (!isGoogleAuthApiAvailable()) {
    return null;
  }

  return chrome.identity.getRedirectURL();
}

export async function signInWithGoogle() {
  const clientId = getGoogleClientId();

  if (!clientId) {
    throw new Error(
      "Missing VITE_GOOGLE_CLIENT_ID. Add it to your .env file and rebuild the extension.",
    );
  }

  if (isRuntimeMessagingAvailable()) {
    try {
      const session = await requestBackgroundGoogleSignIn();
      setStoredAuthSession(session);
      return session;
    } catch (error) {
      if (!shouldFallbackToPopupOAuth(error)) {
        throw error;
      }
    }
  }

  if (!isGoogleAuthApiAvailable()) {
    throw new Error(
      "Google sign-in is only available from the installed extension popup. The Chrome Identity API is unavailable in this context.",
    );
  }

  const redirectUri = getGoogleOAuthRedirectUri();

  if (!redirectUri) {
    throw new Error(
      "Google sign-in is only available from the installed extension popup. The Chrome Identity API is unavailable in this context.",
    );
  }
  const state = createOAuthState();
  const authUrl = buildGoogleAuthorizationUrl({
    clientId,
    redirectUri,
    state,
  });

  const callbackUrl = await launchWebAuthFlow({ authUrl, redirectUri });
  const parsedCallbackUrl = new URL(callbackUrl);
  const callbackState = parsedCallbackUrl.searchParams.get("state") ?? "";

  if (!callbackState || callbackState !== state) {
    throw new Error("Sign-in was canceled or the OAuth state did not match.");
  }

  const code = parsedCallbackUrl.searchParams.get("code");

  if (!code) {
    const errorReason = parsedCallbackUrl.searchParams.get("error");

    if (errorReason) {
      throw new Error(`Google sign-in failed: ${errorReason}`);
    }

    throw new Error("Google sign-in did not return an authorization code.");
  }

  const payload = await exchangeAuthorizationCode({ code, redirectUri });

  setStoredAuthSession({ token: payload.access_token, user: payload.user });

  return {
    token: payload.access_token,
    user: payload.user,
  };
}

export async function getCurrentUser() {
  const token = await getStoredAuthTokenAsync();

  if (!token) {
    throw new Error("No authentication token found.");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const rawBody = await response.text();
  const parsedBody = parseJsonResponse(rawBody);

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredAuthSession();
    }

    throw new Error(
      getErrorMessage(parsedBody) ||
        `Unable to fetch authenticated user (status ${response.status}).`,
    );
  }

  if (!parsedBody || typeof parsedBody !== "object") {
    throw new Error("Authenticated user response format is not recognized.");
  }

  return parsedBody as AuthUser;
}

export async function logoutFromBackend() {
  const token = await getStoredAuthTokenAsync();

  if (!token) {
    clearStoredAuthSession();
    return;
  }

  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    // Best-effort logout call.
  } finally {
    clearStoredAuthSession();
  }
}

async function exchangeAuthorizationCode(payload: {
  code: string;
  redirectUri: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/auth/google/callback`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: payload.code,
      redirect_uri: payload.redirectUri,
    }),
  });
  const rawBody = await response.text();
  const parsedBody = parseJsonResponse(rawBody);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(parsedBody) ||
        `Authentication failed with status ${response.status}.`,
    );
  }

  if (!isAuthCallbackResponse(parsedBody)) {
    throw new Error("Authentication response format is not recognized.");
  }

  return parsedBody;
}

function buildGoogleAuthorizationUrl(payload: {
  clientId: string;
  redirectUri: string;
  state: string;
}) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  url.searchParams.set("client_id", payload.clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", payload.redirectUri);
  url.searchParams.set("scope", GOOGLE_OAUTH_SCOPES.join(" "));
  url.searchParams.set("state", payload.state);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");

  return url.toString();
}

function createOAuthState() {
  const entropy = `${Date.now()}-${Math.random()}`;

  return entropy.replace(/[^a-zA-Z0-9]/g, "");
}

function launchWebAuthFlow(payload: { authUrl: string; redirectUri: string }) {
  return new Promise<string>((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: payload.authUrl,
        interactive: true,
      },
      (callbackUrl) => {
        const runtimeError = chrome.runtime.lastError;

        if (runtimeError?.message) {
          if (runtimeError.message.includes("redirect_uri_mismatch")) {
            reject(
              new Error(
                `Google OAuth redirect URI mismatch. Configure this exact redirect URI in your Google OAuth client: ${payload.redirectUri}`,
              ),
            );
            return;
          }

          reject(new Error(runtimeError.message));
          return;
        }

        if (!callbackUrl) {
          reject(new Error("Google sign-in did not return a callback URL."));
          return;
        }

        resolve(callbackUrl);
      },
    );
  });
}

function isRuntimeMessagingAvailable() {
  const globalChrome =
    typeof globalThis !== "undefined" && "chrome" in globalThis
      ? (globalThis.chrome as typeof chrome)
      : undefined;

  return Boolean(globalChrome?.runtime?.id && globalChrome?.runtime?.sendMessage);
}

function requestBackgroundGoogleSignIn() {
  return new Promise<{ token: string; user: AuthUser }>((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: AUTH_MESSAGE_TYPE_SIGN_IN_WITH_GOOGLE,
      },
      (response?: AuthSignInWithGoogleResponse) => {
        const runtimeError = chrome.runtime.lastError;

        if (runtimeError?.message) {
          reject(new Error(runtimeError.message));
          return;
        }

        if (!response) {
          reject(new Error("No response received from background authentication."));
          return;
        }

        if (!response.ok) {
          reject(new Error(response.error));
          return;
        }

        resolve(response.data);
      },
    );
  });
}

function shouldFallbackToPopupOAuth(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("receiving end does not exist") ||
    message.includes("could not establish connection") ||
    message.includes("no response received from background authentication")
  );
}

function isAuthCallbackResponse(value: unknown): value is AuthCallbackResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.access_token === "string" &&
    Boolean(record.access_token) &&
    !!record.user &&
    typeof record.user === "object"
  );
}

function parseJsonResponse(rawBody: string) {
  if (!rawBody.trim()) {
    return null;
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    throw new Error("Backend did not return valid JSON.");
  }
}

function getErrorMessage(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  for (const key of ["message", "error", "detail"]) {
    const candidate = record[key];

    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
}
