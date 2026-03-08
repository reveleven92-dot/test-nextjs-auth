# Project Learnings

## Things We Know to Be True

- Next.js 16 removed the `next lint` CLI command. Use `eslint .` directly instead.
- `jose` is Edge Runtime compatible and works in both middleware and API routes.
- `bcryptjs` works in Node.js API routes but must NOT be used in Edge Runtime (middleware).
- Jest needs `transformIgnorePatterns: ["/node_modules/(?!jose/)"]` to handle the ESM-only `jose` package.
- Next.js 16 API route handlers receive standard `Request` objects and return `Response`/`NextResponse`.
- Tailwind CSS v4 uses `@import "tailwindcss"` and `@theme inline` blocks instead of `tailwind.config.js`.

## Things We Know to Be False

- `npx next lint` does NOT work in Next.js 16 — the `lint` subcommand was removed.
- `npx next lint --dir .` also fails — the `--dir` flag does not exist.

## Edge Cases to Watch For

- The worktree setup can trigger a "multiple lockfiles detected" warning during `next build`. This is harmless but noisy.
- The `jose` library exports ESM only — any test runner using CommonJS (like Jest) needs explicit transform configuration.
- Middleware runs at the Edge; do not import Node.js-only modules (bcryptjs, fs, crypto via node:crypto) in middleware.

## Architecture Decisions

- Chose `jose` over `jsonwebtoken` because `jose` is Edge Runtime compatible (needed for middleware JWT verification).
- Chose `bcryptjs` (pure JS) over `bcrypt` (native binary) to avoid native compilation dependencies.
- Chose `sonner` for toast notifications — lightweight, works with React Server Components layout, no provider wrapper needed beyond `<Toaster />`.
- In-memory Map-based user store is acceptable for the initial implementation per spec. Data resets on server restart.
- Auth token is stored in a cookie named `auth-token` (set via document.cookie on client, read via request.cookies in middleware).
- UI components follow shadcn/ui patterns (Card, Button, Input, Label) without importing Radix UI directly, per project rules.
