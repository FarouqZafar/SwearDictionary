import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { wordId } = await request.json();
    if (!wordId || typeof wordId !== "string") {
      return NextResponse.json({ error: "Invalid wordId" }, { status: 400 });
    }

    const { data } = await supabase
      .from("words")
      .select("views")
      .eq("id", wordId)
      .single();

    if (data) {
      await supabase
        .from("words")
        .update({ views: (data.views || 0) + 1 })
        .eq("id", wordId);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
