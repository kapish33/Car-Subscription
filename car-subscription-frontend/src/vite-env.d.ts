/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SOME_KEY: number
    readonly VITE_BASE_BE_URL: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }