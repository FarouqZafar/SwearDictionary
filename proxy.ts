import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// IPA Unicode ranges: Spacing Modifiers (02B0-02FF), IPA Extensions (0250-02AF),
// Combining Diacritics (0300-036F). Googlebot mistakenly extracted /IPA/ strings
// from word page HTML as root-relative URLs. Return 410 Gone to speed deindexing.
const IPA_CHARS = /[ɐ-˿̀-ͯ]/;
const IPA_ASCII_EXCEPTIONS = new Set(["jopt", "nuj"]);

export function proxy(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/([^\/]+)\/?$/);
  if (match) {
    const segment = decodeURIComponent(match[1]);
    if (IPA_CHARS.test(segment) || IPA_ASCII_EXCEPTIONS.has(segment)) {
      return new NextResponse(null, { status: 410 });
    }
  }
  return NextResponse.next();
}

// Proxy runs as a function on every matched request, even for cached pages, and
// each run is billed. Only one-segment paths can be junk IPA URLs, so match just
// those, and skip the real top-level routes and root files.
export const config = {
  matcher: [
    "/((?!_next|api|about|blog|language|search|submit|words|favicon|robots|sitemap|icon|og-default)[^/]+)",
  ],
};
