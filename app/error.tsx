"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <div className="error-page-icon">💥</div>
      <h1>Something went wrong.</h1>
      <p>Even swear words need a break sometimes.</p>
      <div className="error-actions">
        <button onClick={() => reset()} className="error-btn error-btn--primary">
          Try again
        </button>
        <a href="/" className="error-btn error-btn--secondary">
          Go home
        </a>
      </div>
    </div>
  );
}
