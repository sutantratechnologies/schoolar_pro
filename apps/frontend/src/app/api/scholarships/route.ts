import { getAppTarget } from '@/lib/auth/targets';
import { proxyToBackend } from '@/lib/auth/server-proxy';

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname + url.search;
  return proxyToBackend(request, getAppTarget(), pathname);
}

export const GET = handler;
export const POST = handler;

