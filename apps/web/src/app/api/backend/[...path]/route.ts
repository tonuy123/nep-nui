import { proxyBackend } from "@/lib/auth/bff";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ path: string[] }> };

async function handle(request: Request, context: RouteContext): Promise<Response> {
  return proxyBackend(request, (await context.params).path);
}

export { handle as GET, handle as POST, handle as PATCH, handle as PUT, handle as DELETE };
