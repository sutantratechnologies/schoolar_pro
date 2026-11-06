# SassProject

A small Nx monorepo containing a Next.js web app, an Express/Apollo GraphQL API,
and a PostgreSQL database accessed through Prisma.
The web app uses the todo API and shared GraphQL operations.

> The todo app is currently a local-development example. It has no user
> accounts, authorization, or production deployment configuration. Do not
> expose the development database credentials or local API directly to the
> public internet.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Repository structure](#repository-structure)
- [Requirements](#requirements)
- [Clone and install](#clone-and-install)
- [Configure the environment](#configure-the-environment)
- [Start the database and apply migrations](#start-the-database-and-apply-migrations)
- [Run the applications](#run-the-applications)
- [GraphQL API](#graphql-api)
- [Common commands](#common-commands)
- [Database development](#database-development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Features

- Create, list, complete, and delete todos.
- Persist todos in PostgreSQL.
- Use GraphQL API from the Next.js app.
- Share GraphQL schema and operation strings through the contracts library.
- Run projects and tasks through Nx.
- Build and run the local database with Docker Compose.

## Technology

- **Workspace:** Nx with npm workspaces
- **Web:** Next.js, React, TypeScript
- **API:** Express 5, Apollo Server, GraphQL
- **Database:** PostgreSQL 16, Prisma ORM 7
- **End-to-end testing:** Cypress and Nx/Jest project targets

## Repository structure

```text
.
├── apps/
│   ├── backend/             # Express server, Apollo GraphQL API, todo resolvers
│   ├── backend-e2e/         # Backend end-to-end test project
│   ├── frontend/            # Next.js todo web application
│   └── frontend-e2e/        # Cypress end-to-end test project
├── libs/
│   ├── auth/                # Authentication library placeholder
│   ├── contracts/           # Shared GraphQL schema and todo operations
│   ├── database/            # Prisma schema, migrations, and database client
│   └── shared/              # Shared library placeholder
├── tools/                   # Workspace scripts and tooling
├── compose.yaml             # Local PostgreSQL service
├── .env.example             # Root local-development environment template
├── nx.json                  # Nx plugins and workspace configuration
├── package.json             # Workspace scripts and dependencies
└── README.md
```

## Requirements

Install the following before setting up the project:

1. **Git** to clone the repository.
2. **Node.js and npm.** Use a current Node.js LTS release.
3. **Docker Desktop** (Windows/macOS) or Docker Engine with the Compose plugin
   (Linux), with Docker running when you start the database.

Check that the tools are available:

```sh
git --version
node --version
npm --version
docker --version
docker compose version
```

## Clone and install

Clone the GitHub repository. Replace the URL with the clone URL shown on the
repository's GitHub page:

```sh
git clone https://github.com/OWNER/REPOSITORY.git
cd REPOSITORY
```

Install the locked npm workspace dependencies:

```sh
npm ci
```

Use the root `package-lock.json` and `npm ci` so workspace packages install
consistently. You do not need to install each app or library separately.

## Configure the environment

Create a root `.env` file from the checked-in example.

**macOS/Linux/Git Bash:**

```sh
cp .env.example .env
```

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

The root `.env.example` contains the local PostgreSQL connection string and
development CORS origins. The connection settings must match the PostgreSQL
service in `compose.yaml` (database `saas_project`, user `devuser`, host port
`5433`). Keep the generated `.env` local; it is ignored by Git. Do not commit
credentials, production connection strings, or private API keys.

The frontend and backend load the repository-root `.env`. For the signed
frontend-to-backend proxy, set `AUTH_PROXY_SECRET` to the same random value in
that file for both local processes; it must contain at least 32 bytes. Restart
both processes after changing it.

The web app uses `http://localhost:3333/graphql` by default. To use a different
GraphQL URL for the web app, add this to the root `.env` before starting Next.js:

```dotenv
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3333/graphql
```

Restart the frontend after changing environment variables.

## Start the database and apply migrations

Start PostgreSQL and wait for its health check:

```sh
npm run db:up
```

Apply the migration files already present in the repository:

```sh
npm run db:migrate
```

Generate the Prisma client if required:

```sh
npm run db:generate
```

The migration creates the `Todo` table. Migration and client-generation
commands read `DATABASE_URL` from the root `.env`.

## Run the applications

### Web app and backend together

After the database is ready and migrations are applied:

```sh
npm run dev
```

Open:

- **Web app:** <http://localhost:3000>
- **GraphQL API:** <http://localhost:3333/graphql>
- **API health endpoint:** <http://localhost:3333/api>

Todos are stored in the shared local database. The example app does not require
sign-in.

### Start the web app or backend separately

In separate terminals, run:

```sh
npm run dev:backend
```

```sh
npm run dev:frontend
```

The database must be running before starting the backend. The backend prints
the GraphQL URL when it starts. If a required service is stopped, start it and
reload the relevant app.

## GraphQL API

The API is implemented in `apps/backend` and exposed at `/graphql`.
`libs/contracts` provides the schema and operations used by the backend and
clients.

### Todo operations

```graphql
query Todos {
  todos {
    id
    title
    completed
    createdAt
    updatedAt
  }
}
```

```graphql
mutation CreateTodo($title: String!) {
  createTodo(title: $title) {
    id
    title
    completed
    createdAt
    updatedAt
  }
}
```

```graphql
mutation UpdateTodo($id: ID!, $title: String, $completed: Boolean) {
  updateTodo(id: $id, title: $title, completed: $completed) {
    id
    title
    completed
    createdAt
    updatedAt
  }
}
```

```graphql
mutation DeleteTodo($id: ID!) {
  deleteTodo(id: $id)
}
```

Todo titles must contain between 1 and 200 non-whitespace characters. The
database orders incomplete todos first, then newest first.

## Common commands

Run commands from the repository root:

| Command | Purpose |
| --- | --- |
| `npm ci` | Install dependencies from the npm lockfile |
| `npm run dev` | Run the web app and backend together |
| `npm run dev:frontend` | Run only the Next.js app |
| `npm run dev:backend` | Run only the GraphQL backend |
| `npm run db:up` | Start the local PostgreSQL container |
| `npm run db:down` | Stop the container and network, retaining database data |
| `npm run db:logs` | Follow PostgreSQL logs |
| `npm run db:migrate` | Create/apply Prisma development migrations |
| `npm run db:generate` | Generate Prisma Client from the schema |
| `npm run db:push` | Push schema changes without creating a migration |
| `npm run db:studio` | Open Prisma Studio |
| `npm run build:frontend` | Build the web app |
| `npm run build:backend` | Build the backend |
| `npm run build:all` | Run Nx build targets across projects |
| `npm run format` | Format files using Nx formatting |
| `npx nx show projects` | List Nx projects |
| `npx nx graph` | Visualize project dependencies |

For a project-specific target, Nx uses:

```sh
npx nx <target> <project>
```

For example:

```sh
npx nx build frontend
npx nx build backend
```

Use `npx nx show project <project>` to inspect the targets available for a
project. A continuous development server should run in its own terminal.

## Database development

The Prisma schema is at `libs/database/prisma/schema.prisma`; committed
migration files are at `libs/database/prisma/migrations`.

When changing the schema, create and apply a named migration:

```sh
npm run db:migrate -- --name describe_your_change
```

Review and commit the generated migration along with the schema change. The
Prisma client is generated under `libs/database/src/generated/prisma`; it is
generated output and should not be edited by hand.

`npm run db:push` is available for local prototyping when you intentionally do
not want a migration. Prefer migrations for changes that should be reviewed,
shared, or deployed.

Stop the local database without deleting its data:

```sh
npm run db:down
```

The Docker Compose configuration uses a named volume. Avoid
`docker compose down -v` unless you intentionally want to delete the local
database and all of its data.

## Troubleshooting

### Deploying the frontend to multiple application targets

The same frontend build supports `main`, `portal`, and `workspace`. Each
frontend deployment must set `NEXT_PUBLIC_APP_TARGET`, `BACKEND_URL`, and a
private `AUTH_PROXY_SECRET`. See `.env.main.example`, `.env.portal.example`,
and `.env.workspace.example`. Do not prefix the proxy secret with
`NEXT_PUBLIC_`.

The shared backend also needs `AUTH_PROXY_SECRET_MAIN`,
`AUTH_PROXY_SECRET_PORTAL`, and `AUTH_PROXY_SECRET_WORKSPACE`; each must match
the corresponding frontend deployment's `AUTH_PROXY_SECRET`. Keep these three
secrets distinct in production. Set `FRONTEND_ORIGINS` to all deployed frontend
origins and restart the backend after changes.

For local development, run the backend once on port 3333, then start the
frontend three times on ports 3000, 3001, and 3002 with the matching target
environment sample. Local development may use the backend's `AUTH_PROXY_SECRET`
fallback. For production, deploy three frontend projects from this repository
with their respective target settings and one backend shared by all three.

### The API cannot be reached

1. Confirm PostgreSQL is running with `npm run db:up`.
2. Confirm migrations have been applied with `npm run db:migrate`.
3. Start the backend with `npm run dev:backend` or `npm run dev`.
4. Open <http://localhost:3333/api> on the development computer. It should
   return a JSON welcome message.

An HTTP 403 response indicates that the request origin is not allowed by
`FRONTEND_ORIGINS`. Add a trusted development origin to the root `.env` and
restart the backend. Do not add broad or untrusted origins to production
configuration.

### PostgreSQL does not start

- Make sure Docker is running.
- Check whether another process is using port `5433`.
- Inspect container output with `npm run db:logs`.
- Confirm `.env` has a `DATABASE_URL` consistent with the Compose database,
  user, password, and host port.

### Nx or dependency installation issues

- Run commands from the repository root.
- Use `npm ci` after cloning or when restoring a clean dependency installation.
- Check `npx nx show projects` to confirm Nx can discover the workspace apps
  and libraries.

## Contributing

1. Create a feature branch.
2. Make the change in the owning app or shared library.
3. Run the smallest relevant build, test, or lint target available for the
   project.
4. Include Prisma migrations when changing the database schema.
5. Update this README when setup, commands, or project structure changes.
6. Never commit `.env` files, credentials, generated secrets, or production
   connection strings.

Shared GraphQL schema and operations belong in `libs/contracts`; database
access belongs in `libs/database`; API resolver and server behavior belongs in
`apps/backend`. The web client should consume the shared contracts
rather than maintaining separate copies of the GraphQL operation strings.
