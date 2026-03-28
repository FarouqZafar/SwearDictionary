import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo">
          <span className="logo-swear">swear</span>
          <span className="logo-dict">dictionary</span>
        </Link>

        <NavLinks />

        <div className="header-right">
          <ThemeToggle />
          <Link href="/search" className="nav-search-icon" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </Link>
          <Link href="/submit" className="submit-btn">+ Submit</Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
