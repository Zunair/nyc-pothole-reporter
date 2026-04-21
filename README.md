# NYC Pothole Reporter Assistant

> ⚠️ **Disclaimer:** This project is **not affiliated with, endorsed by, or sponsored by** the City of New York or NYC DOT. It is a personal-assistance tool only. Users must manually review and submit complaints on the official NYC form and are responsible for compliance with NYC.gov Terms of Use: http://www.nyc.gov/html/misc/html/tou.html. See [DISCLAIMER.md](./DISCLAIMER.md).

Open-source web app to help NYC residents prepare pothole complaints faster by collecting location, photos, and structured details before opening the official NYC DOT complaint form.

## Official NYC form

- https://a841-dotvweb01.nyc.gov/potholeform/ViewController/CreateComplaint.aspx

## Features

- Browser geolocation capture (mobile + desktop)
- Reverse geocoding assistance via Nominatim
- Multi-photo capture/upload with client-side compression
- Draft complaint storage in IndexedDB and optional backend sync
- Status tracking: `draft`, `submitted`, `acknowledged`, `in_progress`, `completed`, `rejected`
- Copy-to-clipboard helpers for form fields
- One-click button to open official NYC form in a new tab
- JSON/CSV export for local tracking

## Quickstart

```bash
npm install
npm run dev
```

This starts:
- Web app: `http://localhost:5173`
- API server: `http://localhost:3000`

## Development

- Run checks: `npm run lint && npm run test && npm run build`
- Contribution guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Architecture docs: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## Screenshot

Screenshot is included in the PR description.
