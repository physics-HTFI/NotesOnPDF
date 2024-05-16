/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IS_WEB?: string;
  readonly VITE_PDF_ROOT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
