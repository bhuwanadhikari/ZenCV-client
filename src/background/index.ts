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
    .then(() => {
      sendResponse({ ok: true } satisfies AuthSignInWithGoogleResponse);
    })
    .catch((error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to complete Google authentication.";

      console.error("Google sign-in failed in background service worker:", errorMessage);
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

  const callbackUrl = await runGoogleAuthInTab({ authUrl, redirectUri });
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
  await persistAuthSession({
    token: payload.access_token,
    user: payload.user,
  });
  // Allow a brief propagation window before signaling completion to the popup.
  await delay(350);

}

async function runGoogleAuthInTab(payload: { authUrl: string; redirectUri: string }) {
  const createdTab = await chrome.tabs.create({
    url: payload.authUrl,
    active: true,
  });

  if (!createdTab.id) {
    throw new Error("Unable to open Google sign-in tab.");
  }

  const authTabId = createdTab.id;

  return await new Promise<string>((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      chrome.tabs.onUpdated.removeListener(handleUpdated);
      chrome.tabs.onRemoved.removeListener(handleRemoved);
    };

    const finalize = (callback: () => void) => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      callback();
    };

    const closeAuthTab = async () => {
      try {
        await chrome.tabs.remove(authTabId);
      } catch {
        // Ignore if the user already closed the tab.
      }
    };

    const handleRemoved = (tabId: number) => {
      if (tabId !== authTabId) {
        return;
      }

      finalize(() => {
        reject(new Error("Google sign-in was canceled before completion."));
      });
    };

    const handleUpdated = (
      tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab,
    ) => {
      if (tabId !== authTabId) {
        return;
      }

      const currentUrl = changeInfo.url || tab.url;

      if (!currentUrl) {
        return;
      }

      if (!currentUrl.startsWith(payload.redirectUri)) {
        return;
      }

      void closeAuthTab();
      finalize(() => {
        resolve(currentUrl);
      });
    };

    chrome.tabs.onUpdated.addListener(handleUpdated);
    chrome.tabs.onRemoved.addListener(handleRemoved);
  });
}

async function persistAuthSession(payload: { token: string; user: AuthUser }) {
  const maxAttempts = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await chrome.storage.local.set({
        [AUTH_TOKEN_STORAGE_KEY]: payload.token,
        [AUTH_USER_STORAGE_KEY]: JSON.stringify(payload.user),
      });

      const storedValues = await chrome.storage.local.get([
        AUTH_TOKEN_STORAGE_KEY,
        AUTH_USER_STORAGE_KEY,
      ]);
      const storedToken =
        typeof storedValues[AUTH_TOKEN_STORAGE_KEY] === "string"
          ? storedValues[AUTH_TOKEN_STORAGE_KEY]
          : "";
      const storedUser = parseStoredAuthUser(storedValues[AUTH_USER_STORAGE_KEY]);

      if (storedToken === payload.token && storedUser) {
        return;
      }

      lastError = new Error(
        `Auth session write verification failed on attempt ${attempt}.`,
      );
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("Unable to persist auth session in extension storage.");
    }
  }

  throw (
    lastError ??
    new Error("Unable to persist auth session in extension storage.")
  );
}

function parseStoredAuthUser(rawValue: unknown) {
  if (typeof rawValue === "string") {
    try {
      const parsed = JSON.parse(rawValue) as unknown;

      if (parsed && typeof parsed === "object") {
        return parsed as AuthUser;
      }
    } catch {
      return null;
    }
  }

  if (rawValue && typeof rawValue === "object") {
    return rawValue as AuthUser;
  }

  return null;
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

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}
