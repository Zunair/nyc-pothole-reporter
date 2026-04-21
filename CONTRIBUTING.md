# Contributing

## Setup

1. Fork and clone.
2. Install dependencies: `npm install`
3. Copy env examples:
   - `cp packages/web/.env.example packages/web/.env`
   - `cp packages/server/.env.example packages/server/.env`
4. Start app: `npm run dev`

## Branching

- Create feature branches from `main`
- Keep PRs focused and small

## Commit style

Use Conventional Commits (e.g. `feat: add location cache`).

## Validation

Run before opening PR:

```bash
npm run lint
npm run test
npm run build
```

## PR process

- Fill PR template completely
- Confirm compliance checklist (no scraping/automation of NYC endpoints)
- Include tests for logic changes

## Code style

- TypeScript first
- OOP domain/service/repository layering
- Use Prettier formatting
