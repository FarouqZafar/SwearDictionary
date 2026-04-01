import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "@/components/PostHogProvider";
import { getTotalWordCount, getLanguages } from "@/lib/queries";
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
    images: [{ url: "https://sweardictionary.com/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SwearDictionary — The world's rudest encyclopedia",
  },
  alternates: { canonical: "https://sweardictionary.com" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [wordCount, languages] = await Promise.all([getTotalWordCount(), getLanguages()]);
  const langCount = languages.length;
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <Script src="https://analytics.ahrefs.com/analytics.js" data-key="kSiSPOCvuvEZ/2sofqwGkQ" async strategy="afterInteractive" />
      </head>
      <body
        className={`${instrumentSerif.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased bg-bg text-text min-h-screen flex flex-col`}
      >
        <Script id="theme-init" strategy="beforeInteractive">{`(function(){var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t||'light');})();`}</Script>
        <Navbar />

        <PostHogProvider>
        {children}
        </PostHogProvider>

        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-top">
              <div className="footer-brand">
                <Link href="/" className="logo">
                  <span className="logo-swear">swear</span>
                  <span className="logo-dict">dictionary</span>
                </Link>
                <p>The internet&apos;s most comprehensive profanity database. Exploring how the world swears — with cultural context, severity ratings, and zero filter.</p>
                <div className="stat-line"><strong>{wordCount.toLocaleString()}</strong> words &middot; <strong>{langCount}</strong> languages</div>
              </div>
              <div className="footer-col">
                <h4>Explore</h4>
                <Link href="/words">All words</Link>
                <Link href="/languages">All languages</Link>
                <Link href="/blog">Blog</Link>
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
        <Analytics />
      </body>
    </html>
  );
}
