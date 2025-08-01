# Gemini Customization File

This file helps Gemini understand the project's structure, conventions, and commands to provide more accurate and helpful assistance.

## Project Overview

This is a full-stack TypeScript project using a functional programming approach with the Effect library. The frontend is built with Lit and Vite, styled with Tailwind CSS. The backend is a Bun server that uses Kysely for database access to a PostgreSQL database and Replicache for real-time data synchronization.

## Technologies

- **Backend:**
  - **Runtime:** Bun
  - **Framework:** Effect
  - **Database:** PostgreSQL
  - **Query Builder:** Kysely
  - **Migrations:** Custom script (`src/db/migrator.ts`)
  - **Schema Generation:** Kanel (`src/db/generate-types.ts`)
  - **Real-time Sync:** Replicache
- **Frontend:**
  - **Framework:** Lit
  - **Bundler:** Vite
  - **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Testing:**
  - **Backend/Node:** Vitest (`vitest`)
  - **Frontend/Client:** Web Test Runner (`@web/test-runner`)

## Project Structure

- `bun-server.ts`: The entry point for the backend server.
- `src/main.ts`: The entry point for the frontend application.
- `src/components/`: Lit components for the frontend.
- `src/features/`: Backend feature modules, often containing Effect-based services and handlers.
- `src/db/`: Database-related code, including the Kysely instance, schema, migrations, and seeder.
- `src/lib/`: Shared libraries for both client and server.
  - `src/lib/client/`: Client-specific library code.
  - `src/lib/server/`: Server-specific library code.
  - `src/lib/shared/`: Code shared between the client and server.
- `migrations/`: Database migration files.
- `vite.config.ts`: Vite configuration for the frontend.
- `vitest.config.ts`: Vitest configuration for backend tests.

## Common Commands

- **`npm run dev`**: Start the development server for both client and backend with live reloading.
- **`npm run build`**: Build the frontend application for production.
- **`npm run start`**: Start the production backend server.
- **`npm run lint`**: Lint and format the codebase.
- **`npm run check-types`**: Run the TypeScript compiler to check for type errors.
- **`npm run test:node`**: Run backend tests using Vitest.
- **`npm run test:client`**: Run frontend tests using Web Test Runner.
- **`npm run db:migrate`**: Apply pending database migrations.
- **`npm run db:generate`**: Generate TypeScript types from the database schema.
- **`npm run db:seed`**: Seed the database with initial data.
