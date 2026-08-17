# Kagi Search Engine

A simple Kagi search engine built with TanStack Start, Varlock for env management, and nubjs as the package manager.

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | TanStack Start v1.0 | Vite-powered, type-safe routing, server functions |
| Package Manager | nubjs (`nub install`) | Fast Rust-based PM, pnpm-compatible |
| Env Management | Varlock + `.env.schema` | First-party nubjs support, type-safe, secrets never on disk |
| Data Fetching | `createServerFn` + TanStack Query | Zero extra deps, simplest for single-user |
| Auth | Hardcoded device token via Varlock | No library, no DB, just a token check |
| Database | None | Not needed |
| Kagi Client | Direct `fetch` to `POST /search` | No need for the full `@kagi/api` SDK for one endpoint |

## Environment Variables

Managed through Varlock. The `.env.schema` file is committed to git and contains no secrets.

```
KAGI_API_KEY  — Your Kagi API key from kagi.com/api/keys (@sensitive)
DEVICE_TOKEN  — Your secret device token for access control (@sensitive)
```

Values are resolved at runtime by Varlock from your configured provider (1Password, Proton Pass, or local `.env.local`).

## Project Structure

```
kagi-search-proxy/
├── src/
│   ├── routes/
│   │   ├── __root.tsx          # Root layout, QueryClientProvider
│   │   └── index.tsx           # Search page (token gate + input + results)
│   ├── utils/
│   │   ├── kagi.ts             # Server function: calls Kagi POST /search
│   │   └── auth.ts             # Token validation helper
│   ├── router.tsx              # TanStack Router setup
│   ├── routeTree.gen.ts        # Auto-generated route tree
│   └── styles.css              # Tailwind CSS entry
├── public/
├── .env.schema                 # Varlock schema (committed, no secrets)
├── env.d.ts                    # Auto-generated types from Varlock
├── vite.config.ts              # Vite config (TanStack Start + Tailwind + Varlock)
├── package.json
├── tsconfig.json
└── nub.lock
```

## Setup

### 1. Install dependencies

```sh
nub install
```

### 2. Configure environment

Create a `.env.local` file at the project root with your actual values:

```
KAGI_API_KEY=your-kagi-api-key-here
DEVICE_TOKEN=your-secret-device-token-here
```

Or configure a Varlock provider (1Password, Proton Pass, etc.) in `.env.schema`.

### 3. Run dev server

```sh
nub run dev
```

## How the Token Flow Works

1. User opens the app → sees a token entry screen
2. User enters their device token → stored in `localStorage`
3. Every search request sends the token as part of the server function input
4. Server function validates against `ENV.DEVICE_TOKEN` (resolved by Varlock)
5. If mismatch → error. If match → proxy the search to Kagi API

## How Varlock Flows Through the Stack

```
.env.schema (git)           Varlock runtime
  KAGI_API_KEY=@sensitive   →  resolves from 1Password / Proton Pass / .env.local
  DEVICE_TOKEN=@sensitive   →  resolves from 1Password / Proton Pass / .env.local
        │
        ▼
  vite.config.ts             varlockVitePlugin() injects into SSR
        │
        ▼
  src/utils/kagi.ts          import { ENV } from 'varlock/env'
                             ENV.KAGI_API_KEY  →  server-only, never bundled for client
                             ENV.DEVICE_TOKEN  →  server-only, never bundled for client
```

## Kagi API Details

- **Endpoint:** `POST https://kagi.com/api/v1/search`
- **Auth header:** `Authorization: Bot <KAGI_API_KEY>`
- **Body:** `{ "query": "...", "workflow": "search" }`
- **Response:** `{ meta: {...}, data: { search: [...], image: [...], ... } }`
- **Cost:** $0.012 per query
