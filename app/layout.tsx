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
        <Navbar />

        {children}
        
        <footer className="mt-auto border-t border-white/5 py-12 px-6 sm:px-12 text-center sm:text-left">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-serif italic text-text-dim text-lg">
              Not for the faint of heart.
            </p>
            <div className="flex gap-6 font-mono text-xs uppercase tracking-widest text-text-dim">
              <Link href="/about" className="hover:text-accent transition-colors">About</Link>
              <Link href="/submit" className="hover:text-accent transition-colors">Submit</Link>
              <Link href="/languages" className="hover:text-accent transition-colors">Languages</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
