# Project Learnings

## Things We Know to Be True

- `npx eslint .` works for linting the project (eslint.config.mjs is properly configured)
- Tailwind CSS v4 is configured with zero-config approach (config in globals.css, not tailwind.config.ts)
- TypeScript strict mode is enabled
- Next.js 16.1.6 with App Router is the framework version

## Things We Know to Be False

- `npx next lint` does NOT work — it fails with "Invalid project directory provided, no such directory: .../lint". This is the root cause of the automated pipeline failure on issue #1. Must fix the lint script or use `npx eslint .` directly.

## Edge Cases to Watch For

- Tailwind v4 uses `@import "tailwindcss"` in CSS instead of `@tailwind` directives — shadcn/ui setup may need manual CSS variable adjustments
- `middleware.ts` runs in Edge Runtime — bcryptjs (Node.js APIs) cannot be used there; only jose (Edge-compatible) for JWT verification
- In-memory user store resets on every server restart — acceptable for development but must be documented
- The package.json `lint` script is `"eslint"` (no args), which may conflict with `npx next lint`

## Architecture Decisions

- **JWT via jose (not jsonwebtoken)**: jose is Edge Runtime compatible, which is required for Next.js middleware. jsonwebtoken uses Node.js crypto APIs that are not available in Edge Runtime.
- **bcryptjs (not bcrypt)**: Pure JavaScript implementation avoids native build issues across platforms. Only used in API routes (Node.js runtime), never in middleware (Edge runtime).
- **In-memory user store**: Simplest approach for the initial implementation. Users are stored in a Map; the store resets on server restart. This is documented and acceptable for development.
- **Jest + ts-jest for testing**: jose ships ESM-only — must add `transformIgnorePatterns: ["/node_modules/(?!jose/)"]` to jest.config.ts so Jest can process it.
- **Next.js 16 deprecates "middleware" in favor of "proxy"**: The middleware.ts convention still works but shows a deprecation warning during build. Future migration to the proxy convention will be needed.
