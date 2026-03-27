"use client";

import Link from "next/link";
import { useState } from "react";

export default function SubmitPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(data.error || "Something went wrong");
    }
  };

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

        {status === "success" ? (
          <p className="submit-success">You&apos;re on the list!</p>
        ) : (
          <form className="submit-email-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="submit-email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === "loading"}
            />
            <button
              type="submit"
              className="submit-email-btn"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Saving..." : "Notify me"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="submit-error">{errorMsg}</p>
        )}
      </div>

      <p className="submit-contact">
        Can&apos;t wait? Email us directly at{" "}
        <a href="mailto:support@sweardictionary.com">support@sweardictionary.com</a>{" "}
        with the word, language, translation, and any context you can share.
      </p>

      <div className="submit-browse">
        <p>In the meantime, explore what we have:</p>
        <div className="submit-browse-links">
          <Link href="/words" className="submit-browse-link">Browse existing words</Link>
          <Link href="/languages" className="submit-browse-link">Browse by language</Link>
        </div>
      </div>
    </main>
  );
}
