# Authentication

`@sass-project/auth` owns the Better Auth server configuration and the
browser-safe client. It uses the singleton Prisma client from
`@sass-project/database`; do not construct another Prisma client here.

## Configuration

Set `BETTER_AUTH_SECRET` to a cryptographically random value of at least 32
bytes and `BETTER_AUTH_URL` to the auth server's origin. Configure every
frontend origin in `FRONTEND_ORIGINS` or the corresponding `*_APP_URL`
variables. Google sign-in is enabled when both Google OAuth credentials are
present. Cross-subdomain cookies remain disabled unless
`BETTER_AUTH_COOKIE_DOMAIN` is explicitly set in production.

Email verification, sign-in verification, and password reset use Resend. New
accounts receive a six-digit email verification code that expires after ten
minutes. Set `RESEND_API_KEY` and `AUTH_EMAIL_FROM`; production startup fails if
either is missing. In local development, email flows fail explicitly until
those values are configured. `AUTH_EMAIL_FROM` must use a sending domain
verified in the Resend account associated with the API key. Resend rejections
are logged with the provider's status, error name, sanitized message, and
request ID when available; API keys, recipient addresses, OTPs, and reset URLs
are redacted. Resend's `onboarding@resend.dev` test sender can only deliver to
the Resend account's own address; use a verified domain to send to other
recipients.

Import `auth` from `@sass-project/auth/server` in server code and
`authClient` from `@sass-project/auth/client` in browser code. Never import the
server entrypoint into a client component.

The Express backend mounts Better Auth at `/api/auth/*`, with CORS credentials
restricted to the configured frontend origins. Apollo context resolves the
Better Auth session for every request. The shared contracts expose `me`,
`currentSession`, and provider-configuration queries; the frontend auth screens
use the Better Auth client for sign-up, sign-in, OAuth, email verification,
password reset, and sign-out.

## Prisma schema

Better Auth's generated models and the application's role and organization
models live in `libs/database/prisma/schema.prisma`. When changing Better Auth
schema options, regenerate and review the auth models before merging them into
the application schema:

```sh
npx auth@1.7.7 generate --config libs/auth/src/server/auth.ts --adapter prisma --dialect postgresql --output libs/database/prisma/better-auth.generated.prisma
npm run db:migrate -- --name describe_auth_schema_change
npm run db:generate
```

The generated auth model fields are kept compatible with Better Auth; the
application role is a Prisma enum and remains server-managed.
