"use client";

import { useEffect } from "react";

export default function ViewTracker({ wordId }: { wordId: string }) {
  useEffect(() => {
    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wordId }),
    }).catch(() => {});
  }, [wordId]);

  return null;
}
