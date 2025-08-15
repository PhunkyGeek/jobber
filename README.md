# Jobs App (Next.js + MongoDB)

A small jobs board implementing:
- Tailwind UI matching the provided cards/badges/pills layout
- SWR data fetching with auto revalidation
- Delete confirmation modal + toast notifications
- Pagination and sorting (default: createdAt desc)
- API routes, including GET /api/jobs/:id

## Quickstart
1. Install deps
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and set `MONGODB_URI`.
3. Run
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

## Deploy to Vercel
- Push to GitHub, import the repo on Vercel
- Set `MONGODB_URI` as a Project Environment Variable
- Deploy

## Endpoints
- `GET /api/jobs?status=&keyword=&page=1&limit=6&sort=-createdAt`
- `POST /api/jobs`
- `GET /api/jobs/:id`
- `PUT /api/jobs/:id`
- `DELETE /api/jobs/:id`
- `PATCH /api/jobs/:id/publish` (body: `{ action: 'publish'|'draft'|'activate'|'deactivate' }`)
