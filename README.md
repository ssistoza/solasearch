# Solasearch

> Your one-and-only personal search engine.

Solasearch is a self-hosted search frontend built on the Kagi API — full SSR
on cold loads, instant SPA navigation with skeleton loaders, a 24-hour result
cache, and DDG-style `!bang` support, wrapped in a fast, keyboard-friendly UI.
One user, one token, one bill that's yours alone.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Configure Environment](#configure-environment)
  - [Run](#run)
  - [Production Build](#production-build)
- [Usage](#usage)
  - [Search](#search)
  - [Bangs](#bangs)
  - [Access Token](#access-token)
- [How It Works](#how-it-works)
  - [Rendering and Caching Layers](#rendering-and-caching-layers)
  - [Auth Flow](#auth-flow)

## Features

- **Web, image, video, and news search** powered by the
  [Kagi API](https://help.kagi.com/kagi/api/search.html) (`POST /api/v1/search`)
- **SSR** — cold page loads render full results on the server; in-app searches
  navigate client-side with skeleton loaders (no full-page reloads)
- **Multi-layer caching** — router-level loader cache keeps results fresh for
  24 hours per session, and `Cache-Control: private, max-age=86400` lets the
  browser reuse rendered pages without hitting the server
- **Bangs** — `!gh tanstack`, `rust !mdn`, `!yt lo-fi`, etc. redirect straight
  to ~45 supported sites for free (no Kagi query spent); unknown bangs fall
  back to a normal search
- **Token gate** — every Kagi request must carry your device token, so a
  deployed instance can't be used by strangers at your expense

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | TanStack Start v1 | Vite-powered React SSR, type-safe file routing, server functions |
| Data loading | TanStack Router loaders | Loader data is cached (`staleTime`), dehydrated across SSR, and rehydrated automatically — no client data-fetching library needed |
| Styling | Tailwind CSS v4 | Utility-first CSS with `@theme` design tokens |
| Font | Geist Sans (Fontsource variable) | Self-hosted, no external font CDN |
| Theme | Catppuccin Mocha palette | Dark-first color tokens defined in `src/styles.css` |
| Env management | Varlock + `.env.schema` | Type-safe env vars, secrets resolved from `.env.local` or a secret manager |
| Auth | Hardcoded device token | Single-user access control with zero infrastructure |
| Package manager | nub | Fast Rust-based PM |
| Database / cache store | None | Caching lives in the browser (router cache + HTTP cache) |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Kagi API key](https://kagi.com/api/keys) (pay-per-search)
- [nub](https://nub.dev) (`npm i -g nub`) — or substitute your favorite PM;
  the scripts are plain `vite` invocations

### Install

```bash
nub install
```

### Configure Environment

Copy the schema expectations into a local env file:

```bash
# .env.local (gitignored — never commit real values)
KAGI_API_KEY=your-kagi-api-key
DEVICE_TOKEN=your-secret-token
```

`DEVICE_TOKEN` is any string you choose; it becomes the `?token=`
value that unlocks searching. Varlock validates both variables against
`.env.schema` at build/dev time and injects them server-side only.

### Run

```bash
nub run dev
```

Then open:

```
http://localhost:3000/?token=your-secret-token
```

The token is required as a URL parameter on first visit and is carried through
every internal link.

### Production Build

```bash
nub run build
nub run preview
```

## Usage

### Search

Use the header prompt on any page. Tabs switch between web results, images,
videos, and news. Results include snippets and related searches where the API
provides them.

### Bangs

Put a bang anywhere in the query — beginning, middle, or end:

| Query | Goes to |
|---|---|
| `!gh tanstack start` | GitHub search |
| `rust async !mdn` | MDN Web Docs search |
| `!w` | Wikipedia homepage |

Highlights: `g` Google · `gh` GitHub · `w` Wikipedia · `yt` YouTube ·
`so` Stack Overflow · `mdn` MDN · `npm` npm · `cr` crates.io · `r` Reddit ·
`am` Amazon · `hn` Hacker News

See [`src/utils/bangs.ts`](src/utils/bangs.ts) for the full list and to add
your own. Bang redirects happen entirely in the browser, so they never touch
the Kagi API.

### Access Token

All search requests validate the `token` URL parameter against
`DEVICE_TOKEN`. Without it, searches are refused before any API call is made.
Change the token by updating `DEVICE_TOKEN` in your env.

## How It Works

### Rendering and Caching Layers

```
cold load  →  SSR: route loaders call the Kagi API on the server,
              render results into HTML, serialize loader data for hydration,
              respond with Cache-Control: private, max-age=86400

in-app     →  SPA navigation: router serves cached loader data when fresh
search       (< 24h staleTime); otherwise shows skeletons while the loader
              fetches via server function RPC

tab switch →  zero network calls while loader data is fresh; preloading on
/ revisit     hover warms adjacent tabs

repeat     →  browser may serve the cached HTML outright (HTTP cache),
visit         skipping the server entirely
```

Note the server itself is stateless — each SSR request gets its own ephemeral
loader run, so there is no shared server-side result cache between users or
requests. Every distinct search costs one Kagi API credit ($0.012).

### Auth Flow

```
browser  ?token=<your-token>  →  included in every navigation/search param
   │
   ▼
route loaders pass it to the searchKagi server function
   │
   ▼
validateDeviceToken() compares against ENV.DEVICE_TOKEN (server-only via Varlock)
   │
   ├─ match    → proxy POST https://kagi.com/api/v1/search (Bot auth header)
   └─ mismatch → Unauthorized, nothing leaves the box
```

The Kagi API key never reaches the client; it only exists inside server
functions.
