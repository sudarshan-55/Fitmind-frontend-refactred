# FitMind frontend

React 18 + Vite + React Router + Axios + Bootstrap 5.

## Run
```bash
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run dev
npm run build
```
Restart `npm run dev` after editing `.env`.

## Structure
- `src/app` routes, layout, shared in-memory state
- `src/components` navigation and form/state components
- `src/features` pages and feature components
- `src/services` all API calls and response normalising
- `src/mocks` sample catalogue only
- `src/constants`, `src/utils`, `src/hooks`, `src/styles`

## What needs a backend
Photo and garment measurement need the Express endpoints in `API-CONTRACT.md`.
Without them the forms show an error; no results are invented.
Manual measurements, preferences, the sample catalogue and the profile work without a backend.

## Data
Photos and results stay in memory until reload. Preferences, saved items and the profile
are kept in this browser's localStorage.

Product images are placeholders until licensed photography is supplied.
