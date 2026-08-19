# Meridian Research — Investment Research & Risk Management Platform

Analyze the Business → Value the Business → Measure the Risk → Size the Position → Make a Disciplined Investment Decision.

This is **not** a market predictor and it does **not** issue BUY/SELL signals. It's a structured research tool: deterministic financial calculations (ratios, DCF, risk metrics) with an explanation layer on top, built to be maintained entirely from a phone via GitHub's web UI and Vercel.

---

## 1. Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Recharts** for charts
- No backend/database required for the MVP — all data is served from an in-app mock data layer designed to be swapped for a real API later without rewriting the app.

## 2. File Structure

```
app/                        # Pages (Next.js App Router)
  page.tsx                  # Portfolio Dashboard (home)
  company/[ticker]/page.tsx # Company Analyzer
  dcf/page.tsx               # DCF Valuation
  portfolio/page.tsx         # Risk Management
  scenarios/page.tsx         # Scenario Analysis
  layout.tsx, globals.css

components/
  ui/            # Generic UI primitives (Card, Badge, DataTable, etc.)
  company/       # Company Analyzer components
  dcf/           # DCF Valuation components
  risk/          # Risk Management components
  scenarios/     # Scenario Analysis components
  dashboard/     # Nav bars, Watchlist

lib/
  types/         # All TypeScript types/interfaces
  calculations/  # Pure, deterministic financial math (ratios, DCF, risk, scenarios, decision logic)
  data/          # Data-service abstraction layer (mock today, real API later)
  mock-data/     # Sample companies, financials, prices, portfolio
  ai/            # Narrative/explanation layer — reads numbers, never computes them
  utils/         # Formatting helpers
```

**Architecture principle (Raw Data → Deterministic Calculations → Results → AI Explanation):**
Every number shown in the UI is computed in `lib/calculations/*` using plain arithmetic — never by an LLM. The `lib/ai/explain.ts` layer only turns already-computed numbers into readable sentences. This separation means the app's numbers are always reproducible and auditable.

## 3. Modules

1. **Company Analyzer** (`/company/[ticker]`) — financial statement history, margins/returns ratios, business-quality narrative blocks.
2. **DCF Valuation** (`/dcf`) — adjustable assumptions, live fair value, WACC × terminal growth sensitivity grid.
3. **Risk Management** (`/portfolio`) — position table with weights, concentration, alerts when a position or sector exceeds your configured limit.
4. **Scenario Analysis** (`/scenarios`) — Bear/Base/Bull DCF scenarios plus a manual shock simulator ("NVDA -30%" style), all explicitly labeled hypothetical.
5. **Portfolio Dashboard** (`/`) — overview stats, watchlist connecting valuation + risk for each covered company.

## 4. Data

Everything currently runs on realistic **mock data** (`lib/mock-data/`) so the app works immediately. To connect a real financial data API later:

1. Create server routes under `app/api/.../route.ts`.
2. Read your API key server-side via `process.env.YOUR_KEY` (never in client code).
3. Set the real key in **Vercel → Project Settings → Environment Variables** (see `.env.example`).
4. Update the function bodies in `lib/data/financial-data-service.ts` to call your new routes — the function signatures already match what the rest of the app expects, so no other files need to change.

---

## 5. Deploying from your phone (Android, browser only)

No computer, no terminal, no Node.js install required.

### Step A — Create the GitHub repository

1. Open **github.com** in your phone browser and sign in (create a free account if needed).
2. Tap the **+** icon (top right) → **New repository**.
3. Name it, e.g. `investment-research-platform`. Keep it **Public** or **Private**, your choice. Don't add a README (we already have one).
4. Tap **Create repository**.

### Step B — Upload the project files

GitHub's web uploader accepts a drag-and-drop / file picker, which works from an Android file manager or the "Files" app:

1. On your new repo's page, tap **Add file → Upload files**.
2. Use your phone's file picker to select the project files. If you downloaded a `.zip`, unzip it first using your phone's file manager (most Android file apps have "Extract" built in) so you're uploading the actual folder contents, not the zip.
3. **Important:** GitHub's uploader lets you drag whole folders on desktop, but on mobile you may need to upload folder-by-folder (e.g. select everything inside `app/`, commit, then everything inside `components/`, etc.) since mobile browsers sometimes flatten folder structure. If a folder's structure gets lost, you can fix individual files afterward using GitHub's in-browser editor (tap any file → pencil icon → edit → commit).
4. Scroll down, add a commit message like "Initial commit", and tap **Commit changes**.
5. Repeat until all folders (`app/`, `components/`, `lib/`, plus the root config files like `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.mjs`, `postcss.config.mjs`, `.gitignore`) are uploaded.

**Tip:** it's fine to do this in several small commits — one per folder — rather than one giant upload. Easier to manage from a phone screen.

### Step C — Connect GitHub to Vercel

1. Open **vercel.com** in your phone browser.
2. Tap **Sign Up** (or log in) and choose **Continue with GitHub** — this links the two accounts.
3. Once logged in, tap **Add New → Project**.
4. Vercel will list your GitHub repositories — find `investment-research-platform` and tap **Import**.

### Step D — Deploy

1. Vercel auto-detects Next.js — you shouldn't need to change any build settings.
2. If you have environment variables to add (see `.env.example` — not needed yet for the mock-data MVP), add them under **Environment Variables** on this same screen.
3. Tap **Deploy**.
4. Wait 1–2 minutes. Vercel builds and hosts the project, then gives you a live URL like `investment-research-platform.vercel.app`.

Your app is now live and installable as a mobile web app (add to home screen from your browser's share menu).

### Step E — Updating the project later

Whenever you want to change something:

1. Go to the file on **github.com** (browse the repo, tap the file).
2. Tap the **pencil (edit)** icon.
3. Make your change directly in the browser text editor.
4. Scroll down, add a commit message, tap **Commit changes**.
5. Vercel automatically detects the change and redeploys within a minute or two — no extra steps needed on Vercel's side.

For bigger changes (new files, restructuring), repeat the **Add file → Upload files** flow from Step B.

---

## 6. Environment Variables

None are required for the current mock-data MVP. When you connect a real financial data API:

- Add the key(s) under **Vercel → your project → Settings → Environment Variables**.
- Never commit real API keys into the GitHub repo — `.env.example` is a template only, and `.gitignore` already excludes real `.env` files.

---

## 7. Roadmap (per the original spec's staged plan)

- [x] Stage 1 — Company Analyzer
- [x] Stage 2 — DCF Valuation
- [x] Stage 3 — Portfolio Risk Management
- [x] Stage 4 — Scenario Analysis
- [x] Stage 5 — Portfolio Dashboard & module integration
- [ ] Connect a real financial data API (replace `lib/mock-data` calls in `lib/data/financial-data-service.ts`)
- [ ] Persist portfolio positions (currently in-memory per session — add `window.storage`-style persistence or a small database)
- [ ] Company search by free-text name, not just ticker dropdown
