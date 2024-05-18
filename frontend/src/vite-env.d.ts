/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IS_WEB?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
