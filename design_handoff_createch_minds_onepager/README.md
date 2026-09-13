# Handoff: Createch Minds one-pager (createch-minds.be)

## Overview
Eén publieke pagina (one-pager) voor **Createch Minds CommV** — Thomas Vankerckhoven, freelance software-ingenieur uit Diksmuide. Doel: lokale bedrijven in de Westhoek overtuigen om hem in te huren, met als conversie één contactformulier.

Secties in volgorde: loader → header/nav → hero (claim + foto + CTA) → stackbalk → "Waarmee ik bijspring" (7 genummerde rijen, incl. standpunt over AI) → "Waar ik gewerkt heb" (carousel: TomTom / Isabel / Liantis) → contact (tekst + formulier) → footer met wettelijke gegevens.

## About the Design Files
De bestanden in deze bundel zijn **design-referenties in HTML** — prototypes die het bedoelde uiterlijk en gedrag tonen, geen productiecode om te kopiëren. De opdracht is om dit ontwerp te **herbouwen in de doelomgeving** (bv. Astro, Next.js, SvelteKit of gewoon statische HTML + één CSS-bestand) met de patronen van die stack. Er is vandaag nog geen codebase: kies dus de eenvoudigste stack die een statische pagina + één form-endpoint aankan.

Concrete aanbeveling voor deze site:
- Statische pagina (Astro of Next.js static export) op Vercel/Netlify/Cloudflare Pages, domein createch-minds.be.
- Formulier post naar één serverless function → **SendGrid** (`@sendgrid/mail`) → mail naar thomas.vankerckhoven@createch-minds.be, met reply-to = ingevuld e-mailadres. Plus anti-spam (honeypot-veld + rate limit of hCaptcha).
- Geen CMS nodig; teksten in de repo.

## Fidelity
**High fidelity.** Kleuren, typografie, spacing en interacties zijn definitief. Herbouw pixel-getrouw. De stijl volgt het "Modernist" design system: platte vlakken, geen radius (0px overal), 2px-regels, alles links uitgelijnd, rood spaarzaam als accent, foto's in zwart-wit.

## Screens / Views

### 1. Loader (intro-animatie)
- Volledig scherm `position:fixed; inset:0; z-index:50`, achtergrond `#ffffff`.
- Gecentreerd: logo-SVG op 130px breed + daaronder een rode balk 170×3px (`--color-accent`).
- Animaties: logo `opacity 0→1` + `scale(.82) rotate(-6deg) → scale(1) rotate(0)`, 0.9s `cubic-bezier(.2,.8,.2,1)`; de balk wipe-t `scaleX(0→1)` vanaf links in 1.2s `cubic-bezier(.65,0,.35,1)`; het hele paneel fade-t weg (opacity 1→0) over 1.4s en wordt daarna **uit de DOM verwijderd** (niet enkel opacity 0 — anders blokkeert het clicks).
- `@media (prefers-reduced-motion: reduce)`: duur ~0.01s (geen animatie).

### 2. Header
- Flex row, `justify-content:space-between`, padding `20px clamp(20px,5vw,56px)`, wrap op smal.
- Links: logo 60px breed + woordmerk "CREATECH MINDS", Archivo 800, 15px, letter-spacing .02em. Logo hover: `rotate(-4deg) scale(1.04)`, transition .35s.
- Rechts: nav-links Aanbod / Klanten / Contact — Archivo 600, 13px, uppercase, letter-spacing .05em, kleur `--color-text`, gap `clamp(16px,2.5vw,32px)`.

### 3. Hero
- Bovenaan een 2px regel in `--color-text` (volle breedte van de contentkolom).
- Grid: `minmax(0,1.45fr) minmax(200px,0.55fr)`, gap `clamp(28px,4vw,56px)`, `align-items:end`.
- H1: "Java-ingenieur uit Diksmuide, te huur per dag." — Archivo 800, `clamp(38px,7vw,78px)`, line-height .96, letter-spacing -.03em, `text-wrap:balance`.
- Paragraaf: `clamp(17px,1.6vw,20px)`, line-height 1.5, max-width 52ch.
- CTA: primaire knop "Stuur me een bericht" (rode vulling, wit label, **label links uitgelijnd**, radius 0) → anchor `#contact`; ernaast grijze noot "Of gewoon bellen — ik kom ook ter plaatse."
- Rechts: portretfoto in kader van 2px `--color-text`, `aspect-ratio:4/5`, `object-fit:cover`, `object-position:50% 22%`, filter `grayscale(1) contrast(1.08)`. Caption 12px in `--color-neutral-700`.

### 4. Stackbalk
Volle breedte, achtergrond `--color-text` (#201e1d), witte tekst, padding `16px clamp(20px,5vw,56px)`, flex-wrap gap `10px 28px`, Archivo 600 13px uppercase letter-spacing .07em.
Items: Java · Spring Boot · Event driven architecture · Azure · Databanken · Security · Microservices.

### 5. "Waarmee ik bijspring"
- Sectiekop: 14px uppercase letter-spacing .12em.
- 7 rijen, elk `grid-template-columns: 64px minmax(0,1fr) minmax(0,1.15fr)`, gap `clamp(16px,3vw,32px)`, padding `22px 0`.
- Nummer: Archivo 800, 30px, kleur `--color-accent`. Titel: `clamp(19px,2vw,23px)`. Body: 15px/1.6 in `--color-neutral-800`.
- Regels: eerste rij `border-top:2px solid var(--color-text)`, tussenrijen `2px solid var(--color-divider)`, laatste rij ook `border-bottom:2px solid var(--color-text)`.
- Inhoud (exacte copy staat in `Createch Minds One-pager v2.dc.html`): 01 Code, in Java · 02 Architectuur uittekenen · 03 Event driven architecture (Kafka of RabbitMQ) · 04 Azure en uw cloudrekening · 05 Databanken die traag zijn geworden · 06 Werken mét AI-tools (met supervisie) · 07 Het werk dat niemand graag doet.
- Op smalle schermen: laat de 64px-kolom staan maar stapel titel en body (1 kolom onder ~700px).

### 6. Klanten-carousel
- Kop 14px uppercase + rechts twee secundaire knoppen (← →), `flex:none`.
- Slide-container met `border-top`/`border-bottom` 2px `--color-text`; telkens **één** slide in de DOM.
- Slide-layout: `grid-template-columns: minmax(150px,230px) minmax(0,1fr)`, gap `clamp(20px,4vw,48px)`, padding `clamp(24px,3vw,32px) 0`.
  - Linkerkolom: klantlogo (grayscale + contrast 1.08; TomTom h26, Isabel h30, Liantis 40×40 `object-fit:contain`) + rolletje in 12px uppercase `--color-neutral-700`.
  - Rechterkolom: titel `clamp(22px,2.6vw,30px)`, body 16px/1.6 max-width 62ch, daaronder 3 `.tag-outline` chips.
- Slides: TomTom "Een kaart die live meebeweegt" (Java, Kafka, Real-time data) · Isabel "Isakey uitgerold" (Security, Spring Boot, Uitrol) · Liantis "Facturatie die klopt" (DDD, Databanken, Automatisatie).
- Dots onder de container: 34×6px, geen radius, actief = `--color-accent`, inactief = `--color-neutral-300`, transition background .3s; klikbaar.
- Gedrag: auto-advance elke **6.5s**; na een manuele klik (pijl of dot) interval herstarten op **10s**. Loopt rond. Pauzeer bij `:hover`/`:focus-within` in de productieversie, en respecteer `prefers-reduced-motion` (dan geen auto-advance).
- Gewenste transitie in productie: cross-fade ~400ms of horizontale slide 24px; houd hem subtiel.

### 7. Contact
- `border-top:2px solid var(--color-text)`, grid `repeat(auto-fit, minmax(300px,1fr))`, gap `clamp(28px,5vw,56px)`.
- Links: H2 "Waar loopt het bij u vast?" `clamp(30px,4vw,44px)`; body 16px/1.6 max-width 48ch; daaronder een 2px regel met e-mailadres (link, accentkleur) en adres.
- Rechts: formulier, grid `repeat(auto-fit, minmax(180px,1fr))`, gap 18px.
  - Velden: Naam (required), Bedrijf (optioneel), E-mail (required, type email, volle breedte), "Wat scheelt er?" (textarea, 4 rows, resize vertical, volle breedte).
  - Inputs: `--color-surface`-achtige vulling volgens `.input` uit het design system, 14px, radius 0, focus-visible = 2px accent outline met 2px offset.
  - Submit: primaire knop "Verstuur", volle breedte van de grid, label links.
  - Na succesvol versturen: het formulier wordt vervangen door een blok met achtergrond `--color-text`, witte tekst: titel "Bedankt, uw bericht is onderweg." (Archivo 800, 20px) + "Ik laat binnen twee werkdagen van me horen."
  - In het prototype opent submit een `mailto:` — **in productie vervangen door de SendGrid-call** (zie onder).

### 8. Footer
`border-top:2px solid var(--color-text)`, padding `22px clamp(20px,5vw,56px)`, flex space-between, 12px in `--color-neutral-700`:
- "Createch Minds CommV · BTW BE1002.531.325"
- "Roeselarestraat 67A, 8600 Diksmuide"

## Interactions & Behavior
- Anchor-navigatie naar #top / #aanbod / #klanten / #contact (smooth scroll mag, gebruik géén `scrollIntoView`-hacks in de prototypes).
- Loader: één keer per paginabezoek, ~1.4s, daarna uit de DOM.
- Carousel: auto 6.5s / manueel 10s, dots + pijlen, wrap-around.
- Hover: nav-links onderlijnen; primaire knop → `--color-accent-600`, active → `--color-accent-700`; secundaire knop → 7% ink-tint.
- Focus: `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` — nooit de browser-default.
- Formuliervalidatie: naam + geldig e-mail verplicht (native `required` + server-side hercontrole); toon foutmelding inline, in `--color-accent-700` op 14px. Bij netwerkfout: "Versturen lukte niet — mail me gerust direct op thomas.vankerckhoven@createch-minds.be."
- Loading state op submit: knop disabled (opacity .45) met label "Versturen…".
- Responsive: alles fluid; onder ~700px wordt de hero één kolom (foto boven of onder de tekst), worden de aanbod-rijen gestapeld en staat de carousel-tekst onder het logo.

## State Management
- `loading: boolean` — loader zichtbaar (timeout 1500ms → false).
- `slide: 0 | 1 | 2` — actieve klant; interval + manuele handlers.
- `sent: boolean` — formulier verstuurd → bedanktblok.
- `submitting`, `error` — toe te voegen in productie rond de SendGrid-call.
- Geen data fetching buiten de POST van het formulier.

## Backend: formulier via SendGrid
1. Endpoint `POST /api/contact` (serverless): valideer body (naam, e-mail, bedrijf?, bericht), honeypot-veld leeg, simpele rate limit per IP.
2. `@sendgrid/mail`: `to` = thomas.vankerckhoven@createch-minds.be, `from` = een geverifieerd afzenderadres op createch-minds.be (bv. no-reply@), `replyTo` = het ingevulde e-mailadres, subject "Aanvraag via createch-minds.be — {naam}".
3. Zet SPF + DKIM voor createch-minds.be in SendGrid (domain authentication), anders landt alles in spam.
4. `SENDGRID_API_KEY` als env var in de hosting-provider; nooit in de repo.
5. Optioneel: autoreply naar de invuller ("Bedankt, ik antwoord binnen twee werkdagen").

## Design Tokens
Kleuren: bg `#ffffff` (pagina) / `#f3f2f2` (system-ground) · surface `#eae9e9` · text `#201e1d` · accent `#ec3013` · accent-600 `#dd2b0f` · accent-700 `#ae1800` · divider `color-mix(in srgb, #201e1d 40%, transparent)` · neutral-300 `#d7d3d3` · neutral-700 `#605d5d` · neutral-800 `#444141`.
Type: **Archivo** (400/500/600/800) voor kop én body. H1 `clamp(38px,7vw,78px)`/.96; H2 `clamp(30px,4vw,44px)`; sectiekoppen 14px uppercase .12em; body 15–20px, line-height 1.5–1.6; meta 12px.
Spacing: 4 / 8 / 12 / 16 / 24 / 32px; sectiepadding `clamp(36px,6vw,64px)` verticaal en `clamp(20px,5vw,56px)` horizontaal.
Radius: **0px overal**. Regels: 2px. Schaduwen: geen (het systeem is plat).
Easing: `cubic-bezier(.2,.8,.2,1)` voor entries, `cubic-bezier(.65,0,.35,1)` voor de wipe; 300–600ms.

## Assets
In `assets/` van deze bundel (allemaal door de klant aangeleverd):
- `logo.svg` — Createch Minds logo (kleurrijk; blijft in kleur, wordt niet grayscaled).
- `thomas.jpg` — portret van Thomas (wordt grayscale weergegeven, crop `50% 22%`).
- `tomtom.svg`, `isabel.svg`, `liantis.png` — klantlogo's, grayscale. `liantis.png` is 384×384 (vierkant mark, geen woordmerk) — vandaar de 40×40 `object-fit:contain`-behandeling. Een woordmerk-versie zou hier beter zijn; eventueel bij Liantis opvragen.
- Iconen (indien nodig): Lucide.
- Check of het gebruik van klantlogo's/namen contractueel oké is voor referentievermelding.

## Screenshots
`screenshots/01-page.png` hero · `02` aanbod-rijen · `03` carousel (TomTom) · `04` carousel (Isabel) · `05` carousel (Liantis) · `06` contact + footer. Referentiebeelden, geen specificatie — de maten in dit document gaan voor.

## Files
- `Createch Minds One-pager v2.dc.html` — de definitieve richting (dit is wat je herbouwt).
- `Createch Minds One-pager.dc.html` — eerste ronde met twee richtingen (1A raster, 1B affiche); enkel als context.
- `styles.css` — het volledige "Modernist" design system (tokens + componentklassen `.btn`, `.tag`, `.input`, `.field`, `.table`, `.hr`, `.grayscale`). Neem hier de tokens uit over.
- `info.txt` — ruwe gegevens en brontekst van de klant (BTW, adres, klantprojecten).
