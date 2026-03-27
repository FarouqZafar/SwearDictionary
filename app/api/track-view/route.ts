import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { wordId } = await request.json();
    if (!wordId || typeof wordId !== "string") {
      return NextResponse.json({ error: "Invalid wordId" }, { status: 400 });
    }

    const { data } = await supabaseAdmin
      .from("words")
      .select("views")
      .eq("id", wordId)
      .single();

    if (data) {
      await supabaseAdmin
        .from("words")
        .update({ views: (data.views || 0) + 1 })
        .eq("id", wordId);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
