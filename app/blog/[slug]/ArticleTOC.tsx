"use client";

import { useState, useEffect } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function ArticleTOC({ headings }: { headings: TOCItem[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first heading that's intersecting
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="article-toc">
      <div className="article-toc-inner">
        <span className="article-toc-label">On this page</span>
        <nav className="article-toc-nav">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`article-toc-link${h.level === 3 ? " article-toc-sub" : ""}${activeId === h.id ? " active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                setActiveId(h.id);
              }}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
