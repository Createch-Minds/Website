# Createch Minds — website

One-pager voor Createch Minds CommV (createch-minds.be), gebouwd met [Astro](https://astro.build).
Herbouwd op basis van de design-referentie in [`design_handoff_createch_minds_onepager/`](design_handoff_createch_minds_onepager/README.md).

## Ontwikkelen

```bash
npm install
npm run dev
```

Site draait op `http://localhost:4321`.

## Formulier / SendGrid

Het contactformulier post naar `/api/contact` ([src/pages/api/contact.ts](src/pages/api/contact.ts)), dat via `@sendgrid/mail`
een e-mail stuurt naar `thomas.vankerckhoven@createch-minds.be` met `replyTo` op het ingevulde adres, en stuurt de invuller
een automatische bevestigingsmail terug.

1. Kopieer `.env.example` naar `.env` en vul `SENDGRID_API_KEY` in (SendGrid dashboard → Settings → API Keys).
2. Verifieer het afzenderadres (`SENDGRID_FROM_EMAIL`) via **Sender Authentication** in SendGrid — via **Single Sender** (snel)
   of **Domain Authentication** (beter, SPF+DKIM voor `createch-minds.be`, minder kans op spam).
3. Zet `SENDGRID_API_KEY` (en `SENDGRID_FROM_EMAIL`) als environment variable bij de hosting-provider. Nooit in de repo
   committen.

**Anti-spam:** een verborgen honeypot-veld (`website`) en een eenvoudige per-IP rate limit (5 requests / 10 minuten) zitten
altijd aan. Optioneel: zet `HCAPTCHA_SECRET` en `PUBLIC_HCAPTCHA_SITE_KEY` (env vars) om een hCaptcha-widget op het formulier
te activeren — zonder die twee blijft het formulier gewoon werken met enkel honeypot + rate limit.

## Deployen

Geconfigureerd met de Vercel-adapter (`@astrojs/vercel`, `output: 'server'`) zodat `/api/contact` als serverless function
draait. Werkt ook op Netlify of Cloudflare Pages — vervang dan de adapter in [astro.config.mjs](astro.config.mjs) door
`@astrojs/netlify` resp. `@astrojs/cloudflare`.

```bash
npm run build
```

De site is nog niet live: dit project draait vandaag enkel lokaal. Om online te gaan moet je nog: het project koppelen aan
een hosting-provider (Vercel/Netlify/Cloudflare Pages), het domein `createch-minds.be` daarheen laten wijzen, en de
environment variables hierboven daar instellen.

## SEO / social

- `robots.txt` + een automatisch gegenereerde `sitemap-index.xml` (via `@astrojs/sitemap`) staan aan.
- Open Graph– en Twitter-cardtags + een gegenereerde deelafbeelding (`public/og-image.png`) zorgen voor een nette preview
  bij het delen van de link (WhatsApp, LinkedIn, ...).
- JSON-LD structured data (`ProfessionalService`) in [Layout.astro](src/layouts/Layout.astro) helpt Google begrijpen wie
  Createch Minds is en waar.
- `public/privacybeleid` (via [src/pages/privacybeleid.astro](src/pages/privacybeleid.astro)) is de wettelijk vereiste
  privacyverklaring voor het contactformulier (GDPR); gelinkt in de footer.

## Structuur

- `src/pages/index.astro` — de one-pager, samengesteld uit de componenten in `src/components/`.
- `src/pages/privacybeleid.astro`, `src/pages/404.astro` — losse pagina's in dezelfde stijl.
- `src/pages/api/contact.ts` — het formulier-endpoint.
- `src/styles/global.css` — design tokens (kleuren, type, spacing) uit het "Modernist" design system.
- `public/assets/` — logo, icoon en klantlogo's (`icon.svg` is het losstaande beeldmerk, gebruikt voor favicons).
