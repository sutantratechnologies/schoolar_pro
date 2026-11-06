/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import 'dotenv/config';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { authTypeDefs, todoTypeDefs } from '@sass-project/contracts';
import { prisma } from '@sass-project/database';
import { verifyProxyHeaders } from '@sass-project/auth/proxy-signature';
import express from 'express';
import * as path from 'path';
import { toNodeHandler } from 'better-auth/node';
import { auth, authCapabilities } from '@sass-project/auth/server';
import { createApiContext } from './auth.context.js';
import { authResolvers } from './auth.resolvers.js';
import { todoResolvers } from './todo.resolvers.js';

const app = express();

function requireSignedFrontendProxy(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const pathname = new URL(req.originalUrl, 'http://localhost').pathname;
    const requestHeaders = new Headers();
    for (const [name, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          requestHeaders.append(name, item);
        }
      } else if (value) {
        requestHeaders.set(name, value);
      }
    }

    const target = verifyProxyHeaders(
      requestHeaders,
      req.method,
      pathname
    );

    if (!target) {
      res.status(401).json({ message: 'Unauthorized request.' });
      return;
    }

    req.headers['x-bidy-app-target'] = target;
    next();
  } catch (error) {
    console.error('Frontend proxy authentication is not configured.', error);
    res.status(503).json({ message: 'Authentication service unavailable.' });
  }
}

const assetsPath =
  process.env.NODE_ENV === 'development'
    ? path.join(process.cwd(), 'apps/backend/src/assets')
    : path.join(__dirname, 'assets');

app.use('/assets', express.static(assetsPath));

const allowedOrigins = new Set(
  (process.env.FRONTEND_ORIGINS ??
    'http://localhost:3000,http://127.0.0.1:3000,http://localhost:4200')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

function isAllowedOrigin(origin: string): boolean {
  if (allowedOrigins.has(origin)) {
    return true;
  }

  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  try {
    const { hostname, protocol } = new URL(origin);
    return (
      protocol === 'http:' &&
      (hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '[::1]')
    );
  } catch {
    return false;
  }
}

app.use((req, res, next) => {
  const origin = req.get('origin');

  if (origin && !isAllowedOrigin(origin)) {
    res.status(403).send('Origin is not allowed.');
    return;
  }

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    req.get('access-control-request-headers') ??
      'content-type, authorization, x-csrf-token'
  );

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to the todo API!' });
});

app.use('/api/auth', requireSignedFrontendProxy);
app.get('/api/auth/config', (_req, res) => {
  res.json({ googleOAuthEnabled: authCapabilities.googleOAuth });
});

app.all('/api/auth/*splat', toNodeHandler(auth));

const graphqlServer = new ApolloServer({
  typeDefs: [todoTypeDefs, authTypeDefs],
  resolvers: [todoResolvers, authResolvers],
  introspection: process.env.NODE_ENV !== 'production',
});

async function startServer() {
  await graphqlServer.start();

  app.use('/graphql', requireSignedFrontendProxy);
  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(graphqlServer, {
      context: async ({ req, res }) => createApiContext(req, res, prisma),
    })
  );

  const port = Number(process.env.PORT ?? 3333);
  const server = app.listen(port, () => {
    console.log(`GraphQL API ready at http://localhost:${port}/graphql`);
  });

  server.on('error', (error) => {
    console.error('Backend server failed:', error);
    process.exitCode = 1;
  });
}

startServer().catch((error: unknown) => {
  console.error('Backend failed to start:', error);
  process.exitCode = 1;
});
