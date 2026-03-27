import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwearDictionary — The world's rudest encyclopedia",
  description:
    "A comprehensive, multilingual catalog of profanity. Severity ratings, cultural context, and real usage examples across 40+ languages.",
  openGraph: {
    title: "SwearDictionary — The world's rudest encyclopedia",
    description:
      "A comprehensive, multilingual catalog of profanity across 40+ languages.",
    type: "website",
    url: "https://sweardictionary.com",
    siteName: "SwearDictionary",
  },
  twitter: {
    card: "summary",
    title: "SwearDictionary — The world's rudest encyclopedia",
  },
  alternates: { canonical: "https://sweardictionary.com" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className={`${instrumentSerif.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased bg-bg text-text min-h-screen flex flex-col`}
      >
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',t?t:(d?'dark':'light'));})();` }} />
        <Navbar />

        {children}

        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-top">
              <div className="footer-brand">
                <Link href="/" className="logo">
                  <span className="logo-swear">swear</span>
                  <span className="logo-dict">dictionary</span>
                </Link>
                <p>The internet&apos;s most comprehensive profanity database. Exploring how the world swears — with cultural context, severity ratings, and zero filter.</p>
                <div className="stat-line"><strong>2,030</strong> words &middot; <strong>31</strong> languages</div>
              </div>
              <div className="footer-col">
                <h4>Explore</h4>
                <Link href="/words">All words</Link>
                <Link href="/languages">All languages</Link>
              </div>
              <div className="footer-col">
                <h4>Top languages</h4>
                <Link href="/language/turkish">🇹🇷 Turkish</Link>
                <Link href="/language/spanish">🇪🇸 Spanish</Link>
                <Link href="/language/german">🇩🇪 German</Link>
                <Link href="/language/arabic">🇸🇦 Arabic</Link>
                <Link href="/language/french">🇫🇷 French</Link>
              </div>
              <div className="footer-col">
                <h4>Site</h4>
                <Link href="/about">About</Link>
                <Link href="/submit">Submit a word</Link>
              </div>
            </div>
            <div className="footer-divider" />
            <div className="footer-bottom">
              <div className="footer-copy">
                &copy; 2026 <Link href="/">sweardictionary</Link> &middot; made with questionable intentions
              </div>
              <div className="footer-tagline">Not for the faint of heart.</div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
