"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {open ? (
            <>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </>
          ) : (
            <>
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div className="mobile-menu-overlay" onClick={() => setOpen(false)}>
          <nav className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            {[
              { href: "/words", label: "Words" },
              { href: "/languages", label: "Languages" },
              { href: "/search", label: "Search" },
              { href: "/about", label: "About" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-menu-link${pathname.startsWith(item.href) ? " mobile-menu-active" : ""}`}
              >
                {pathname.startsWith(item.href) && <span className="mobile-menu-indicator" />}
                {item.label}
              </Link>
            ))}
            <Link
              href="/submit"
              className={`mobile-menu-link mobile-menu-submit${pathname === "/submit" ? " mobile-menu-active" : ""}`}
            >
              {pathname === "/submit" && <span className="mobile-menu-indicator" />}
              + Submit a Word
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
