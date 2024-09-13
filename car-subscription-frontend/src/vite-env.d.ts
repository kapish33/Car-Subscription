/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SOME_KEY: number
    readonly BASE_URL_: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }