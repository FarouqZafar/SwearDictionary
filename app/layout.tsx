import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
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
  description: "A comprehensive, multilingual catalog of profanity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased bg-bg text-text min-h-screen flex flex-col`}
      >
        <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-white/5 py-4 px-6 sm:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif italic text-2xl text-text hover:text-accent transition-colors"
          >
            Swear<span className="text-accent">Dictionary</span>
          </Link>
          <nav className="flex items-center gap-6">
            <button className="text-text-dim hover:text-text transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <Link
              href="/submit"
              className="px-4 py-2 font-mono text-sm uppercase tracking-wider bg-surface border border-white/10 hover:border-accent/50 hover:bg-surface-hover rounded-full transition-all text-text"
            >
              Submit
            </Link>
          </nav>
        </header>

        {children}
        
        <footer className="mt-auto border-t border-white/5 py-12 px-6 sm:px-12 text-center sm:text-left">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-serif italic text-text-dim text-lg">
              Not for the faint of heart.
            </p>
            <div className="flex gap-6 font-mono text-xs uppercase tracking-widest text-text-dim">
              <Link href="/about" className="hover:text-accent transition-colors">About</Link>
              <Link href="/api" className="hover:text-accent transition-colors">API</Link>
              <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
