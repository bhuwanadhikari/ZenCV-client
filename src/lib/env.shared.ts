export const DEFAULT_API_BASE_URL = "http://localhost:8000";
export const DEFAULT_AI_MODEL_NAME = "gpt-4.1-mini";

export type ExtensionEnvInput = {
  VITE_API_BASE_URL?: string;
  VITE_BACKEND_URL?: string;
  VITE_AI_MODEL_NAME?: string;
  VITE_FILE_NAME_PREFIX?: string;
  VITE_GOOGLE_CLIENT_ID?: string;
};

export function getExtensionEnv(env: ExtensionEnvInput) {
  const apiBaseUrl = normalizeApiBaseUrl(
    env.VITE_API_BASE_URL || env.VITE_BACKEND_URL,
  );
  const aiModelName = normalizeAiModelName(env.VITE_AI_MODEL_NAME);
  const filePrefix = env.VITE_FILE_NAME_PREFIX?.trim() || "my";
  const googleClientId = normalizeGoogleClientId(env.VITE_GOOGLE_CLIENT_ID);

  return {
    apiBaseUrl,
    aiModelName,
    hostPermission: buildHostPermission(apiBaseUrl),
    fileNamePrefix: filePrefix,
    googleClientId,
  };
}

function normalizeApiBaseUrl(value?: string) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return DEFAULT_API_BASE_URL;
  }

  return trimmedValue.replace(/\/+$/, "");
}

function normalizeAiModelName(value?: string) {
  const trimmedValue = value?.trim();
  return trimmedValue || DEFAULT_AI_MODEL_NAME;
}

function normalizeGoogleClientId(value?: string) {
  return value?.trim() || "";
}

function buildHostPermission(apiBaseUrl: string) {
  try {
    return `${new URL(apiBaseUrl).origin}/*`;
  } catch {
    return `${new URL(DEFAULT_API_BASE_URL).origin}/*`;
  }
}
