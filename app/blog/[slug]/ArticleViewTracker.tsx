"use client";

import { useEffect } from "react";

export default function ArticleViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId }),
    }).catch(() => {});
  }, [articleId]);

  return null;
}
