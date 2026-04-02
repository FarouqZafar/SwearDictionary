"use client";

import { useEffect, useRef, useCallback } from "react";

const BATCH_DELAY = 2000; // Send batch every 2 seconds
const VIEWPORT_THRESHOLD = 0.5; // Card must be 50% visible

export default function ImpressionTracker() {
  const seenIds = useRef(new Set<string>());
  const pendingIds = useRef(new Set<string>());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    if (pendingIds.current.size === 0) return;
    const ids = Array.from(pendingIds.current);
    pendingIds.current.clear();

    fetch("/api/track-impression", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wordIds: ids }),
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const wordId = (entry.target as HTMLElement).dataset.wordId;
          if (!wordId || seenIds.current.has(wordId)) continue;

          seenIds.current.add(wordId);
          pendingIds.current.add(wordId);
        }

        // Schedule a batch send
        if (pendingIds.current.size > 0 && !timerRef.current) {
          timerRef.current = setTimeout(() => {
            flush();
            timerRef.current = null;
          }, BATCH_DELAY);
        }
      },
      { threshold: VIEWPORT_THRESHOLD }
    );

    // Observe all word cards with data-word-id
    const cards = document.querySelectorAll("[data-word-id]");
    cards.forEach((card) => observer.observe(card));

    // Re-observe when DOM changes (pagination, filters)
    const mutationObserver = new MutationObserver(() => {
      const newCards = document.querySelectorAll("[data-word-id]");
      newCards.forEach((card) => observer.observe(card));
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Flush remaining on page leave
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timerRef.current) clearTimeout(timerRef.current);
      flush();
    };
  }, [flush]);

  return null;
}
