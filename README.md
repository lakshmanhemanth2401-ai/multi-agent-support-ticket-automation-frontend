# SupportFlow Frontend

React, TypeScript, Vite, and Tailwind CSS frontend for multi-agent support ticket automation.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173`. Ticket creation sends `POST /tickets` to the API URL configured by `VITE_API_BASE_URL`.

## Commands

- `npm run dev` — start the development server
- `npm run build` — type-check and build for production
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build
