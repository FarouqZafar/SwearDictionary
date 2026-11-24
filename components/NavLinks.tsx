"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// /words ships every word in its payload, so never prefetch it. This navbar is
// on every page, and a prefetch here made each visit download the whole list.
const links = [
  { href: "/words", label: "Words", prefetch: false },
  { href: "/languages", label: "Languages" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="nav-center">
      {links.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={item.prefetch === false ? false : undefined}
            className={`nav-link${isActive ? " active" : ""}`}
          >
            {isActive && <span className="nav-indicator" />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
