# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# kostody

A repair-shop job-management app with two clients (engineer and customer) served
from one React + Vite frontend, backed by an Express + Prisma API.

## Setup

### Frontend (repo root)

```bash
npm install
cp .env.example .env        # set VITE_API_URL if the API isn't on localhost:5000
npm run dev
```

| Variable       | Required | Default                     | Description                                   |
| -------------- | -------- | --------------------------- | --------------------------------------------- |
| `VITE_API_URL` | no       | `http://localhost:5000/api` | Base URL of the backend API (include `/api`). |

### Backend (`kostody-backend/`)

```bash
cd kostody-backend
npm install
cp .env.example .env        # fill in the values below
npm run dev
```

| Variable                | Required | Description                                                    |
| ----------------------- | -------- | -------------------------------------------------------------- |
| `PORT`                  | no       | Port to listen on (defaults to `5000`).                        |
| `DATABASE_URL`          | yes      | PostgreSQL connection string used by Prisma.                   |
| `JWT_SECRET`            | yes      | Secret for signing/verifying JWTs. **Server won't boot without it.** |
| `CLOUDINARY_CLOUD_NAME` | yes      | Cloudinary cloud name (job photo uploads).                     |
| `CLOUDINARY_API_KEY`    | yes      | Cloudinary API key.                                            |
| `CLOUDINARY_API_SECRET` | yes      | Cloudinary API secret.                                         |

`.env` files are gitignored; never commit real secrets. Use `.env.example` as the
template.

