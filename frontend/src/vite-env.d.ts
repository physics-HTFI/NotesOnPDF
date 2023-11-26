/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IS_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
