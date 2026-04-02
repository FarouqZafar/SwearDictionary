import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wordId, articleId } = body;

    const id = articleId || wordId;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const rpcName = articleId ? "increment_article_views" : "increment_views";
    const paramName = articleId ? "article_id" : "word_id";

    const { error } = await supabaseAdmin.rpc(rpcName, { [paramName]: id });

    if (error) {
      return NextResponse.json({ error: "Failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
