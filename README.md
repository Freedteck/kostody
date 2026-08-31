# Kostody marketing site

The public marketing website for Kostody, built with React + Vite and Material
Design 3 (`@material/web`). Pages: Home, Product, About, Help, Privacy, Terms.

The product application (engineer + customer apps and the Express/Prisma backend)
lives in a separate repo.

## Setup

```bash
npm install
cp .env.example .env        # optional; set VITE_APP_URL to the product domain
npm run dev
```

| Variable       | Required | Description                                                                                     |
| -------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `VITE_APP_URL` | no       | Absolute base URL of the product app. The footer's "Open the app" links point here. No trailing slash. When unset, those links fall back to relative paths. |

`.env` files are gitignored; use `.env.example` as the template.

## Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start the Vite dev server.           |
| `npm run build`    | Production build to `dist/`.         |
| `npm run preview`  | Preview the production build.        |
| `npm run lint`     | Run ESLint.                          |
| `npm run gen:icons`| Regenerate favicons and app icons from `src/assets/logo-mark.png`. |
