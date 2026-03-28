"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/words", label: "Words" },
  { href: "/languages", label: "Languages" },
  { href: "/about", label: "About" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="nav-center">
      {links.map((item, i) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <span key={item.href} className="nav-link-wrap">
            {i > 0 && <span className="nav-dot" />}
            <Link
              href={item.href}
              className={`nav-link${isActive ? " active" : ""}`}
            >
              {isActive && <span className="nav-indicator" />}
              {item.label}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
