export const DEFAULT_API_BASE_URL = "http://localhost:8000";
export const DEFAULT_AI_MODEL_NAME = "gpt-4.1-mini";

export type ExtensionEnvInput = {
  VITE_API_BASE_URL?: string;
  VITE_AI_MODEL_NAME?: string;
  VITE_FILE_NAME_PREFIX?: string;
};

export function getExtensionEnv(env: ExtensionEnvInput) {
  const apiBaseUrl = normalizeApiBaseUrl(env.VITE_API_BASE_URL);
  const aiModelName = normalizeAiModelName(env.VITE_AI_MODEL_NAME);
  const filePrefix = env.VITE_FILE_NAME_PREFIX?.trim() || "my";

  return {
    apiBaseUrl,
    aiModelName,
    hostPermission: buildHostPermission(apiBaseUrl),
    fileNamePrefix: filePrefix,
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

function buildHostPermission(apiBaseUrl: string) {
  try {
    return `${new URL(apiBaseUrl).origin}/*`;
  } catch {
    return `${new URL(DEFAULT_API_BASE_URL).origin}/*`;
  }
}
