import type { Metadata } from "next";

// The submit page is a client component, so its metadata lives here.
const title = "Submit a Swear Word | SwearDictionary";
const description =
  "Know a swear word we are missing? Join the SwearDictionary waitlist to submit curse words, slang and profanity from your language.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://sweardictionary.com/submit",
    siteName: "SwearDictionary",
  },
  twitter: { card: "summary", title, description },
  alternates: { canonical: "https://sweardictionary.com/submit" },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
