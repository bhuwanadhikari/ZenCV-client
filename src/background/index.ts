import {
  AUTH_MESSAGE_TYPE_SIGN_IN_WITH_GOOGLE,
  type AuthSignInWithGoogleRequest,
  type AuthSignInWithGoogleResponse,
} from "@/lib/auth-messages";
import {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
  type AuthUser,
} from "@/lib/auth-storage";
import { DEFAULT_API_BASE_URL } from "@/lib/env.shared";

const GOOGLE_OAUTH_SCOPES = ["openid", "email", "profile"];
const API_BASE_URL = normalizeApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL,
);

type AuthCallbackResponse = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const typedMessage = message as AuthSignInWithGoogleRequest;

  if (typedMessage?.type !== AUTH_MESSAGE_TYPE_SIGN_IN_WITH_GOOGLE) {
    return;
  }

  void handleGoogleSignInRequest()
    .then((payload) => {
      sendResponse({
        ok: true,
        data: payload,
      } satisfies AuthSignInWithGoogleResponse);
    })
    .catch((error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to complete Google authentication.";

      sendResponse({
        ok: false,
        error: errorMessage,
      } satisfies AuthSignInWithGoogleResponse);
    });

  return true;
});

async function handleGoogleSignInRequest() {
  const clientId = chrome.runtime.getManifest().oauth2?.client_id?.trim() ?? "";

  if (!clientId) {
    throw new Error(
      "Missing Google OAuth client ID in extension manifest. Rebuild the extension with VITE_GOOGLE_CLIENT_ID set.",
    );
  }

  const redirectUri = chrome.identity.getRedirectURL();
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
  await chrome.storage.local.set({
    [AUTH_TOKEN_STORAGE_KEY]: payload.access_token,
    [AUTH_USER_STORAGE_KEY]: JSON.stringify(payload.user),
  });

  return {
    token: payload.access_token,
    user: payload.user,
  };
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

function parseJsonResponse(payload: string) {
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload) as unknown;
  } catch {
    return null;
  }
}

function getErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const record = payload as Record<string, unknown>;

  if (typeof record.detail === "string" && record.detail) {
    return record.detail;
  }

  if (typeof record.message === "string" && record.message) {
    return record.message;
  }

  if (typeof record.error === "string" && record.error) {
    return record.error;
  }

  return "";
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

function normalizeApiBaseUrl(value?: string) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return DEFAULT_API_BASE_URL;
  }

  return trimmedValue.replace(/\/+$/, "");
}
