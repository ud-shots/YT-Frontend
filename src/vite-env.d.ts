/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ECY_ALGO: string;
  readonly VITE_ECY_KEY: string;
  readonly VITE_ECY_IV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}