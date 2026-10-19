import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { wordIds } = await request.json();

    if (!Array.isArray(wordIds) || wordIds.length === 0 || wordIds.length > 50) {
      return NextResponse.json({ error: "Invalid wordIds" }, { status: 400 });
    }

    // Validate all IDs are strings
    if (!wordIds.every((id) => typeof id === "string")) {
      return NextResponse.json({ error: "Invalid wordIds" }, { status: 400 });
    }

    // One round trip for the whole batch; writes go to the small word_stats table
    const { error } = await supabaseAdmin.rpc("increment_impressions_batch", {
      word_ids: wordIds,
    });

    if (error) {
      return NextResponse.json({ error: "Failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
