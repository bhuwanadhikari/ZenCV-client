export type AuthUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
  google_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export const AUTH_TOKEN_STORAGE_KEY = "zencv.authToken";
export const AUTH_USER_STORAGE_KEY = "zencv.authUser";

type AuthSession = {
  token: string;
  user: AuthUser | null;
};

function getChromeStorageLocal() {
  const globalChrome =
    typeof globalThis !== "undefined" && "chrome" in globalThis
      ? (globalThis.chrome as typeof chrome)
      : undefined;

  return globalChrome?.storage?.local;
}

export function getStoredAuthToken() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function getStoredAuthUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);

    if (!rawUser) {
      return null;
    }

    const parsedUser = JSON.parse(rawUser) as unknown;

    if (!parsedUser || typeof parsedUser !== "object") {
      return null;
    }

    return parsedUser as AuthUser;
  } catch {
    return null;
  }
}

export function getStoredAuthSession() {
  return {
    token: getStoredAuthToken(),
    user: getStoredAuthUser(),
  };
}

export async function getStoredAuthSessionAsync(): Promise<AuthSession> {
  const localSession = getStoredAuthSession();

  if (localSession.token && localSession.user) {
    return localSession;
  }

  const storage = getChromeStorageLocal();

  if (!storage) {
    return localSession;
  }

  try {
    const values = await storage.get([AUTH_TOKEN_STORAGE_KEY, AUTH_USER_STORAGE_KEY]);
    const token =
      typeof values[AUTH_TOKEN_STORAGE_KEY] === "string"
        ? values[AUTH_TOKEN_STORAGE_KEY]
        : "";
    const user = parseAuthUser(values[AUTH_USER_STORAGE_KEY]);

    if (token && user) {
      writeAuthSessionToLocalStorage({ token, user });
    }

    return {
      token,
      user,
    };
  } catch {
    return localSession;
  }
}

export async function getStoredAuthTokenAsync() {
  const localToken = getStoredAuthToken();

  if (localToken) {
    return localToken;
  }

  const storage = getChromeStorageLocal();

  if (!storage) {
    return "";
  }

  try {
    const values = await storage.get([AUTH_TOKEN_STORAGE_KEY]);
    const token =
      typeof values[AUTH_TOKEN_STORAGE_KEY] === "string"
        ? values[AUTH_TOKEN_STORAGE_KEY]
        : "";

    if (token && typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    }

    return token;
  } catch {
    return "";
  }
}

export function setStoredAuthSession(payload: { token: string; user: AuthUser }) {
  writeAuthSessionToLocalStorage(payload);

  const storage = getChromeStorageLocal();

  if (!storage) {
    return;
  }

  void storage.set({
    [AUTH_TOKEN_STORAGE_KEY]: payload.token,
    [AUTH_USER_STORAGE_KEY]: JSON.stringify(payload.user),
  });
}

export function clearStoredAuthSession() {
  clearAuthSessionFromLocalStorage();

  const storage = getChromeStorageLocal();

  if (!storage) {
    return;
  }

  void storage.remove([AUTH_TOKEN_STORAGE_KEY, AUTH_USER_STORAGE_KEY]);
}

function writeAuthSessionToLocalStorage(payload: { token: string; user: AuthUser }) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, payload.token);
    window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(payload.user));
  } catch {
    // Ignore storage writes when localStorage is unavailable.
  }
}

function clearAuthSessionFromLocalStorage() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  } catch {
    // Ignore storage writes when localStorage is unavailable.
  }
}

function parseAuthUser(rawValue: unknown) {
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
