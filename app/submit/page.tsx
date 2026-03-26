import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a word — SwearDictionary",
  description:
    "Help us build the world's most comprehensive profanity database. Submit a swear word with its translation, severity, and cultural context.",
  openGraph: {
    title: "Submit a word — SwearDictionary",
    description: "Help us build the world's most comprehensive profanity database.",
    type: "website",
    url: "https://sweardictionary.com/submit",
    siteName: "SwearDictionary",
  },
};

export default function SubmitPage() {
  return (
    <main className="submit-page">
      <h1>Submit a word</h1>
      <p className="submit-page-intro">
        We&apos;re building a submission form so native speakers can contribute
        words, corrections, and cultural context. It&apos;s coming soon.
      </p>

      <div className="submit-email-section">
        <h2>Get notified when submissions open</h2>
        <p>
          Drop your email and we&apos;ll let you know the moment you can start
          contributing.
        </p>
        <form className="submit-email-form" action="#" method="POST">
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            className="submit-email-input"
            required
          />
          <button type="submit" className="submit-email-btn">
            Notify me
          </button>
        </form>
      </div>

      <p className="submit-contact">
        Can&apos;t wait? Email us directly at{" "}
        <a href="mailto:hello@sweardictionary.com">hello@sweardictionary.com</a>{" "}
        with the word, language, translation, and any context you can share.
      </p>
    </main>
  );
}
