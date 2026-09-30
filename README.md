# Multi-Agent Support Ticket Automation Frontend

Responsive React client for the Multi-Agent Enterprise Support Ticket Automation System. It lets support teams create and track tickets, inspect AI classification and retrieval-assisted solutions, review generated replies, view audit history, search the knowledge base, and monitor workflow health.

## Architecture

The application uses React 18, TypeScript, Vite, Tailwind CSS, React Router, and Axios. Pages own their request and UI state with React hooks. Shared presentation components keep loading, empty, error, badge, form, and card behavior consistent. API calls and backend response normalization live under `src/services`, while domain contracts live under `src/types`.

```text
src/
├── components/       Reusable UI and domain components
│   ├── common/       Button, Input, Card, Badge, Loading, EmptyState, ErrorState
│   ├── dashboard/    Summary cards, recent tickets, status overview
│   ├── knowledge/    Document and search-result cards
│   ├── reviews/      Review status presentation
│   └── tickets/      Ticket badges, AI analysis, and audit trail
├── layouts/          Responsive application shell and navigation
├── pages/            Route-level screens
├── services/
│   ├── api/          Shared Axios client
│   └── endpoints/    Tickets, reviews, knowledge, audit, and monitoring APIs
├── styles/           Tailwind entry point and global styles
├── types/            Domain and API-facing TypeScript types
├── utils/            Small shared utilities
├── App.tsx           Route configuration
└── main.tsx          Browser entry point
tests/                Vitest and Testing Library tests
```

## Pages and routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/dashboard` | Dashboard | Live ticket counts, status distribution, and recent tickets |
| `/tickets` | Tickets | Search and refresh the backend ticket list |
| `/tickets/new` | Create Ticket | Validate and submit a new ticket |
| `/tickets/:ticketId` | Ticket Details | Ticket data, processing state, AI analysis, solution, response, and audit trail |
| `/reviews` | Reviews | Pending and completed human reviews |
| `/reviews/:reviewId` | Review Details | Approve, reject, edit, or regenerate a drafted response |
| `/knowledge` | Knowledge Base | List indexed documents and search retrieved chunks |
| `/monitoring` | Monitoring | Service health, workflow, review, and agent metrics |

The root and unknown routes redirect to `/dashboard`.

## Main components

- `AppLayout` provides responsive navigation and the page outlet.
- Common components provide buttons, inputs, cards, badges, and standard loading/error/empty states.
- `AIAnalysisPanel` separates AI classification, confidence, knowledge sources, solution, troubleshooting steps, and drafted-response information from the original ticket.
- `AuditTrail` renders sanitized ticket and agent events chronologically.
- `ReviewStatusBadge`, `PriorityBadge`, and `StatusBadge` standardize workflow state display.
- Dashboard components render backend-derived summary cards, recent activity, and status totals.

## State management

The frontend intentionally uses local React state, effects, callbacks, and memoized derived values. There is no global state library. Each route fetches the data it needs, exposes explicit refresh/retry actions, and renders loading, error, empty, and success states. React Router provides route parameters and navigation.

## API integration

`src/services/api/client.ts` creates the shared Axios client. Endpoint modules convert backend snake-case payloads to frontend models where needed.

The frontend calls:

- `GET/POST /api/v1/tickets`
- `GET /api/v1/tickets/:id`
- `POST /api/v1/workflows/tickets/:id`
- `GET /api/v1/workflows/:threadId`
- `POST /api/v1/workflows/:threadId/review`
- `GET /api/v1/reviews` and `GET /api/v1/reviews/:id`
- `GET /api/v1/tickets/:id/audit`
- `GET /api/v1/knowledge/documents`
- `POST /api/v1/knowledge/search`
- `GET /health` and `GET /metrics` for monitoring

The request timeout is 15 seconds. Monitoring health and metrics requests use the service root derived by removing `/api/v1` from the configured base URL.

## Backend and environment configuration

Copy the example configuration to a local file:

```powershell
Copy-Item .env.example .env.local
```

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

`VITE_API_BASE_URL` must include the backend API prefix. If omitted, the frontend uses `http://localhost:8000/api/v1`. Restart Vite after changing environment variables. Configure the backend CORS allowlist for the exact frontend origin, normally `http://localhost:5173` and/or `http://127.0.0.1:5173`.

Only variables prefixed with `VITE_` are exposed to browser code. Never put secrets, private keys, database credentials, or server-only tokens in a Vite environment variable. `.env` and `.env.local` are ignored; `.env.example` contains only a non-secret local URL.

## Local setup

Requirements: Node.js 20 or newer, npm, and the backend service for live workflows.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:5173`. Start the backend separately on the host and port configured above. The interface will show retryable error states when the backend is unavailable.

## Commands

```powershell
npm run dev          # Vite development server
npm run lint         # ESLint with zero allowed warnings
npm test             # Complete Vitest suite (single run)
npm run test:coverage # Test suite with a coverage report
npm run test:watch   # Interactive test watch mode
npm run build        # TypeScript project build and optimized Vite bundle
npm run preview      # Serve the production bundle locally
npm run check        # Lint, test, and production build
```

Tests use Vitest, jsdom, React Testing Library, and user-event. API modules are mocked in component tests so validation, ticket display, review actions, and loading/error states remain deterministic.

CI enforces baseline coverage thresholds of 65% statements, 55% branches, 50% functions, and 70% lines. Ticket and review lists paginate locally in groups of ten because the current backend returns unpaginated arrays; move pagination to API parameters when the backend exposes a paginated contract.

## Production build

```powershell
npm ci
npm run check
npm run build
npm run preview
```

The optimized output is written to `dist/`. Deploy that directory through a static host configured to fall back to `index.html` for client-side routes. Supply `VITE_API_BASE_URL` at build time because Vite embeds public environment values into the bundle.

## Docker

The included multi-stage `Dockerfile` builds the application with Node and serves the static bundle from unprivileged port `8080` through Nginx. The Nginx configuration includes SPA fallback routing, immutable asset caching, and `/healthz`.

```powershell
docker build --build-arg VITE_API_BASE_URL=http://host.docker.internal:8000/api/v1 -t supportflow-frontend .
docker run --rm -p 8080:8080 supportflow-frontend
```

Open `http://localhost:8080` and check `http://localhost:8080/healthz` for container health. The API URL is embedded at build time; rebuild the image when it changes. `.dockerignore` excludes local environment files, dependencies, build output, and Git metadata.

## Complete demo flow

1. Start the backend and confirm `GET /health` succeeds.
2. Start the frontend and open the Dashboard; confirm live ticket totals load.
3. Open **Create ticket**, complete the required fields, and submit.
4. Confirm navigation to Ticket Details and start or refresh processing.
5. Inspect classification category, priority, confidence, retrieved sources, recommended solution, and troubleshooting steps.
6. Confirm the drafted response reaches pending human review.
7. Open Reviews, select the item, add reviewer comments, then approve, edit, reject, or regenerate it as appropriate.
8. Confirm the refreshed review state and success notification.
9. Return to Ticket Details and confirm the final state and chronological audit history.
10. Open Knowledge Base to inspect indexed documents and run a search, then open Monitoring to inspect service, workflow, review, and agent metrics.

## Troubleshooting

- **Backend unreachable:** Verify the backend is listening at `VITE_API_BASE_URL`, then restart Vite after changing `.env.local`.
- **CORS error:** Add the exact frontend origin to the backend CORS configuration. `localhost` and `127.0.0.1` are different origins.
- **Knowledge requests return 404:** The deployed backend must expose `/api/v1/knowledge/documents` and `/api/v1/knowledge/search`; these routes may not exist in older backend revisions.
- **Monitoring fails while other pages work:** Monitoring additionally requires root-level `/health` and `/metrics` endpoints.
- **Direct route returns a server 404 after deployment:** Configure the static host to serve `index.html` as the SPA fallback.
- **Environment change is ignored:** Stop and restart the Vite process; values are loaded when the development server starts or the production bundle is built.
- **Clean-install mismatch:** Use `npm ci` with the committed lockfile rather than updating individual packages during setup.
- **Authentication:** The current backend contract has no authentication or authorization endpoints. Add login/session handling only after the backend defines its token, refresh, role, and `401`/`403` response contracts.
