# Inventory Dashboard

A full-stack-style inventory management dashboard built with React and TypeScript. It includes authentication, role-based access control, full CRUD operations and persistent local storage using IndexedDB, with no backend required.

## Features

- **Authentication:** login page with form validation, session persistence across reloads, and protected routes that redirect unauthenticated users to the login page
- **Role-based access control:** `admin` can add, edit and delete products; `user` can add and edit but cannot delete
- **Dashboard overview:** total products, low-stock count and total inventory value, updated live as data changes
- **Create:** validated form (React Hook Form and Zod) with duplicate SKU detection
- **Read:** table with search across name, SKU and category, plus pagination
- **Update:** edit modal pre-filled with the existing record
- **Delete:** confirmation dialog before removal
- **Persistence:** all data is stored in IndexedDB and survives page reloads
- **Export:** download the currently filtered products as CSV or JSON, with protection against CSV formula injection
- **Resilience:** error boundary with a recovery screen, loading and empty states
- **Quality:** unit tests, strict TypeScript, linting and automatic formatting

## Tech stack

| Area | Choice |
|---|---|
| Build tool | Vite |
| UI | React 19, TypeScript, Tailwind CSS |
| Routing | React Router |
| Local database | Dexie.js (IndexedDB) |
| Forms and validation | React Hook Form, Zod |
| Testing | Vitest, fake-indexeddb |
| Code quality | oxlint, Prettier |

## Getting started

Requirements: Node.js 20 or later (the current LTS release is recommended).

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal (usually http://localhost:5173).

### Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@demo.com | admin123 |
| User | user@demo.com | user123 |

Demo users are created automatically on the first login. In development mode an **Add sample data** button on the dashboard fills the database with example products. It is hidden in production builds.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Serve the production build locally |
| `npm run test` | Run the unit tests once |
| `npm run test:watch` | Run the tests in watch mode |
| `npm run lint` | Lint the source code |
| `npm run format` | Format the source code |

## Project structure

```text
src/
  components/          Reusable UI: Modal, ConfirmDialog, Navbar, ErrorBoundary
  db/                  Data layer: Dexie schema, types, product and user services
  features/
    auth/              Auth context, provider, hook and protected route
    products/          Product table, form, metrics, export buttons, panel
  lib/                 Pure helpers: validation schemas, CSV export, formatting, hashing
  pages/               LoginPage and DashboardPage
  test/                Test setup
```

## Architecture and design decisions

- **Service layer over direct database access.** UI components never call Dexie directly. They call `productService` and `userService`, so replacing IndexedDB with a REST API would only change the `db/` folder.
- **Validation in two places.** Zod schemas validate forms to give users instant feedback, and the services validate again so invalid data can never reach the database.
- **Reactive data.** The dashboard reads products through Dexie's `useLiveQuery`, so every create, update or delete refreshes the table and metrics without manual state syncing.
- **Schema versioning.** The database uses Dexie versions, so new tables can be added without deleting existing user data.
- **Separation of types.** The stored `User` (with password hash) is different from the `SessionUser` kept in the app, so the hash never travels through the UI.
- **Right-sized state management.** React Context handles authentication and live queries handle data. A state library such as Redux would add complexity without benefit at this scale.
- **Security awareness.** Login errors are generic so they do not reveal which emails exist, and CSV exports neutralize cells that start with formula characters.

## Testing

The test suite covers the validation schema, password hashing, CSV export (including escaping and formula injection) and both services, including the unique SKU rule and the login failure paths. Database tests run against an in-memory IndexedDB implementation, so no browser is needed.

```bash
npm run test
```

## Known limitations

This project runs entirely in the browser, which is appropriate for the assignment but not for production use:

- Authentication is simulated. Passwords are hashed with unsalted SHA-256 and sessions live in `localStorage`, so anyone with access to the browser DevTools can alter them. A real system must authenticate on a server using a salted algorithm such as bcrypt or argon2.
- Role checks hide controls in the UI but are not enforced by a server.
- Data is stored per browser and is not shared across devices.

## Possible improvements

- Replace the local data layer with a REST or GraphQL API and real server-side authentication
- Server-side pagination and sorting for large datasets
- Column sorting and category filters
- Component and end-to-end tests (React Testing Library, Playwright)
- Audit log of changes to products