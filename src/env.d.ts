/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SENDGRID_API_KEY: string;
  readonly SENDGRID_FROM_EMAIL?: string;
  readonly HCAPTCHA_SECRET?: string;
  readonly PUBLIC_HCAPTCHA_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
