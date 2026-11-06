import { createHmac, timingSafeEqual } from 'node:crypto';
import { isAppTarget, type AppTarget } from '@sass-project/shared';

const TARGET_HEADER = 'x-bidy-app-target';
const TIMESTAMP_HEADER = 'x-bidy-proxy-timestamp';
const SIGNATURE_HEADER = 'x-bidy-proxy-signature';
const MAX_CLOCK_SKEW_MS = 60_000;

function getProxySecret(target: AppTarget, verifying: boolean): string {
  const targetSecret =
    process.env[`AUTH_PROXY_SECRET_${target.toUpperCase()}`]?.trim() ||
    undefined;
  const secret =
    targetSecret ??
    (verifying && process.env.NODE_ENV === 'production'
      ? undefined
      : process.env.AUTH_PROXY_SECRET?.trim());
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error(
      verifying && process.env.NODE_ENV === 'production'
        ? `AUTH_PROXY_SECRET_${target.toUpperCase()} must contain at least 32 bytes.`
        : 'AUTH_PROXY_SECRET must contain at least 32 bytes.'
    );
  }
  return secret;
}

function signaturePayload(
  target: AppTarget,
  timestamp: string,
  method: string,
  pathname: string
): string {
  return [target, timestamp, method.toUpperCase(), pathname].join('\n');
}

export function createProxyHeaders(
  target: AppTarget,
  method: string,
  pathname: string
): Headers {
  const timestamp = Date.now().toString();
  const signature = createHmac('sha256', getProxySecret(target, false))
    .update(signaturePayload(target, timestamp, method, pathname))
    .digest('hex');
  const headers = new Headers({
    [TARGET_HEADER]: target,
    [TIMESTAMP_HEADER]: timestamp,
    [SIGNATURE_HEADER]: signature,
  });
  return headers;
}

export function verifyProxyHeaders(
  headers: Headers,
  method: string,
  pathname: string
): AppTarget | null {
  const target = headers.get(TARGET_HEADER);
  const timestamp = headers.get(TIMESTAMP_HEADER);
  const signature = headers.get(SIGNATURE_HEADER);
  if (!isAppTarget(target) || !timestamp || !signature || !/^\d+$/.test(timestamp)) {
    return null;
  }

  const timestampMs = Number(timestamp);
  if (
    !Number.isSafeInteger(timestampMs) ||
    Math.abs(Date.now() - timestampMs) > MAX_CLOCK_SKEW_MS ||
    !/^[a-f0-9]{64}$/i.test(signature)
  ) {
    return null;
  }

  const expected = createHmac('sha256', getProxySecret(target, true))
    .update(signaturePayload(target, timestamp, method, pathname))
    .digest();
  const provided = Buffer.from(signature, 'hex');
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  return target;
}
