/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_AI_MODEL_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.ttf" {
  const src: string;
  export default src;
}
