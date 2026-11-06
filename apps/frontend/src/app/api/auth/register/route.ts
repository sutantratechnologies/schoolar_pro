import { getAppTarget, TARGET_POLICIES } from '@/lib/auth/targets';
import { proxyToBackend } from '@/lib/auth/server-proxy';

export async function POST(request: Request): Promise<Response> {
  const target = getAppTarget();
  if (!TARGET_POLICIES[target].canRegister) {
    return Response.json({ message: 'Not found.' }, { status: 404 });
  }

  return proxyToBackend(request, target, '/api/auth/sign-up/email');
}
