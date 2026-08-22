# kagi-search-proxy

A minimal TanStack Start app with one route and plain CSS.

```bash
nub install
nub run dev
```

Edit `src/routes/index.tsx` to get started. Add route files under
`src/routes`; TanStack Router updates `src/routeTree.gen.ts` for you.

## Bangs

Searches support DDG-style bangs, resolved client-side before hitting Kagi
(so they cost nothing). Put the bang anywhere in the query:

- `!gh tanstack start` → GitHub search
- `rust !mdn` → MDN search
- `!w` → Wikipedia homepage

The list lives in `src/utils/bangs.ts`; unknown bangs fall back to a normal
Kagi search.

Build the production app with:

```bash
nub run build
```
