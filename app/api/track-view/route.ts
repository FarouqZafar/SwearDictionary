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

    const table = articleId ? "articles" : "words";
    const id = articleId || wordId;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const { data } = await supabaseAdmin
      .from(table)
      .select("views")
      .eq("id", id)
      .single();

    if (data) {
      await supabaseAdmin
        .from(table)
        .update({ views: (data.views || 0) + 1 })
        .eq("id", id);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
