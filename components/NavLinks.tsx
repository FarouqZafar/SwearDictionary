"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/words", label: "Words" },
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
