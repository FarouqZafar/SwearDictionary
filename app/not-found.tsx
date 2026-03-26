import Link from "next/link";

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-page-icon">🤔</div>
      <h1>Page not found.</h1>
      <p>
        Maybe it&apos;s a swear word in a language we haven&apos;t added yet?
      </p>
      <div className="error-actions">
        <Link href="/" className="error-btn error-btn--primary">
          Go home
        </Link>
        <Link href="/languages" className="error-btn error-btn--secondary">
          Browse languages
        </Link>
      </div>
    </div>
  );
}
