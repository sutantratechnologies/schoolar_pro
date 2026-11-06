import { getAppTarget } from '@/lib/auth/targets';
import { proxyToBackend } from '@/lib/auth/server-proxy';

async function handler(request: Request): Promise<Response> {
  const pathname = new URL(request.url).pathname;
  return proxyToBackend(request, getAppTarget(), pathname);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
