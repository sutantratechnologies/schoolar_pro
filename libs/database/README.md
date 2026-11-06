# Database

Shared PostgreSQL access for the workspace, using Prisma ORM 7.

## Local PostgreSQL setup

1. Add the `DATABASE_URL` from the root `.env.example` to your existing root
   `.env`. Do not replace other application environment variables.
2. Start the local PostgreSQL container:

   ```sh
   npm run db:up
   ```

3. Generate Prisma Client and sync the current schema:

   ```sh
   npm run db:generate
   npm run db:push
   ```

The `Todo`, Better Auth, user-role, organization, application, invitation, and
audit models are in `prisma/schema.prisma`. The initial Todo migration is kept
under `prisma/migrations`; new schema changes should use additive migrations:

```sh
npm run db:migrate -- --name describe_your_change
```

The generated client is exported as `prisma` from `@sass-project/database`.
It is a singleton reused by `@sass-project/auth`. Better Auth is configured in
`libs/auth`, but the existing Todo GraphQL API has not yet been wired to require
authentication.
`npm run db:down` stops and removes the container/network but keeps the named
volume and its data. Do not use `docker compose down -v` unless you intend to
delete the local database.
