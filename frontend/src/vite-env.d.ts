/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IS_MOCK?: string;
  readonly VITE_PDF_ROOT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
