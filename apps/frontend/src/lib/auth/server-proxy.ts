import {
  createProxyHeaders,
} from '@sass-project/auth/proxy-signature';
import type { AppTarget } from '@sass-project/shared';

function renameCookiePrefix(
  cookieHeader: string,
  target: AppTarget,
  toBackend: boolean
): string {
  const targetPrefix = `bg_${target}.`;
  const resultCookies = new Map<string, string>();

  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim();
    const separator = trimmed.indexOf('=');
    if (separator < 0) continue;

    const name = trimmed.slice(0, separator);
    const value = trimmed.slice(separator + 1);
    const securePrefix = name.startsWith('__Secure-')
      ? '__Secure-'
      : name.startsWith('__Host-')
        ? '__Host-'
        : '';
    const plainName = name.slice(securePrefix.length);

    if (toBackend) {
      if (plainName.startsWith(targetPrefix)) {
        const canonicalName = `${securePrefix}better-auth.${plainName.slice(targetPrefix.length)}`;
        resultCookies.set(canonicalName, value);
      } else if (target === 'main' && plainName.startsWith('better-auth.')) {
        if (!resultCookies.has(name)) {
          resultCookies.set(name, value);
        }
      } else if (
        !plainName.startsWith('better-auth.') &&
        !/^bg_(main|portal|workspace)\./.test(plainName)
      ) {
        resultCookies.set(name, value);
      }
    } else {
      if (plainName.startsWith('better-auth.')) {
        const prefixedName = `${securePrefix}${targetPrefix}${plainName.slice('better-auth.'.length)}`;
        resultCookies.set(prefixedName, value);
      } else {
        resultCookies.set(name, value);
      }
    }
  }

  return Array.from(resultCookies.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

function rewriteSetCookie(cookie: string, target: AppTarget): string {
  const prefix = `bg_${target}.`;
  const renamed = cookie.replace(
    /^((?:__Secure-|__Host-)?)better-auth\./,
    `$1${prefix}`
  );
  return renamed.replace(/;\s*Domain=[^;]*/gi, '');
}

export async function proxyToBackend(
  request: Request,
  target: AppTarget,
  backendPath: string
): Promise<Response> {
  const configuredBackendURL = process.env.BACKEND_URL?.trim();
  const backendURL =
    configuredBackendURL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3333'
      : undefined);
  if (!backendURL) {
    console.error(
      'Authentication proxy is unavailable: BACKEND_URL is not configured.'
    );
    return Response.json(
      { message: 'The authentication service is not configured.' },
      { status: 503 }
    );
  }

  let destination: URL;
  try {
    destination = new URL(
      backendPath,
      `${backendURL.replace(/\/+$/, '')}/`
    );
    if (
      !['http:', 'https:'].includes(destination.protocol) ||
      destination.username ||
      destination.password
    ) {
      throw new Error('BACKEND_URL must use HTTP(S) without credentials.');
    }
  } catch (error) {
    console.error(
      'Authentication proxy is unavailable: BACKEND_URL is invalid.',
      error
    );
    return Response.json(
      { message: 'The authentication service is not configured.' },
      { status: 503 }
    );
  }
  const incomingURL = new URL(request.url);
  destination.search = incomingURL.search;
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('content-length');

  const incomingHost =
    request.headers.get('x-forwarded-host') ||
    (incomingURL.host && incomingURL.host !== 'internal' ? incomingURL.host : 'localhost:3000');
  headers.set('x-forwarded-host', incomingHost);

  const incomingProto =
    request.headers.get('x-forwarded-proto') ||
    (incomingURL.protocol && !incomingURL.protocol.startsWith('http')
      ? 'http'
      : incomingURL.protocol.replace(/:$/, '') || 'http');
  headers.set('x-forwarded-proto', incomingProto);

  const cookie = headers.get('cookie');
  if (cookie) {
    headers.set('cookie', renameCookiePrefix(cookie, target, true));
  }

  let signedHeaders: Headers;
  try {
    signedHeaders = createProxyHeaders(
      target,
      request.method,
      destination.pathname
    );
  } catch (error) {
    console.error('Authentication proxy signing is not configured.', error);
    return Response.json(
      { message: 'The authentication service is not configured.' },
      { status: 503 }
    );
  }
  for (const [name, value] of signedHeaders) {
    headers.set(name, value);
  }

  let upstream: Response;
  try {
    upstream = await fetch(destination, {
      method: request.method,
      headers,
      body:
        request.method === 'GET' || request.method === 'HEAD'
          ? undefined
          : await request.arrayBuffer(),
      cache: 'no-store',
      redirect: 'manual',
    });
  } catch (error) {
    console.error(
      `Authentication backend request failed (${destination.origin}).`,
      error
    );
    return Response.json(
      { message: 'The authentication service is unavailable.' },
      { status: 503 }
    );
  }

  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');
  responseHeaders.delete('transfer-encoding');
  responseHeaders.delete('connection');
  responseHeaders.delete('set-cookie');
  responseHeaders.set('cache-control', 'no-store');

  for (const cookieHeader of upstream.headers.getSetCookie()) {
    responseHeaders.append('set-cookie', rewriteSetCookie(cookieHeader, target));
    if (target === 'main' && cookieHeader.includes('better-auth.')) {
      responseHeaders.append(
        'set-cookie',
        cookieHeader.replace(/;\s*Domain=[^;]*/gi, '')
      );
    }
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
