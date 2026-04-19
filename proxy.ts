import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// IPA Unicode ranges: Spacing Modifiers (02B0-02FF), IPA Extensions (0250-02AF),
// Combining Diacritics (0300-036F). Googlebot mistakenly extracted /IPA/ strings
// from word page HTML as root-relative URLs. Return 410 Gone to speed deindexing.
const IPA_CHARS = /[\u0250-\u02FF\u0300-\u036F]/;
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

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|og-default.png|icon.png).*)",
  ],
};
