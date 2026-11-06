import { getAppTarget } from '@/lib/auth/targets';
import { proxyToBackend } from '@/lib/auth/server-proxy';

export async function POST(request: Request): Promise<Response> {
  return proxyToBackend(request, getAppTarget(), '/graphql');
}
