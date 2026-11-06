# Contracts

Shared GraphQL schemas, typed response models, and operations used by the
backend and frontend. Todo resolvers live in the backend; Better Auth owns
sign-up, sign-in, OAuth, email verification, password reset, and sign-out.

The auth schema exposes:

- `me` for the current authenticated user.
- `currentSession` for the active session and user.
- `authProviderConfig` to advertise enabled OAuth providers.

The GraphQL endpoint is available at `http://localhost:3333/graphql` while the
backend is running.

Better Auth HTTP endpoints are mounted at
`http://localhost:3333/api/auth/*`. Browser clients should use the exported
Better Auth client instead of recreating those endpoints.
