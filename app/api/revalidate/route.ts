import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const secret = process.env.REVALIDATION_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const token =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    new URL(request.url).searchParams.get("secret");

  if (token !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let path: string | undefined;
  let type: "page" | "layout" | undefined;
  try {
    const body = (await request.json()) as { path?: string; type?: "page" | "layout" };
    path = body.path;
    type = body.type;
  } catch {
    path = new URL(request.url).searchParams.get("path") ?? undefined;
  }

  if (!path || !path.startsWith("/")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  revalidatePath(path, type);
  return NextResponse.json({ revalidated: true, path, type: type ?? "page" });
}
