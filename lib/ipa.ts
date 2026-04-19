export function cleanIpa(ipa: string | null | undefined): string {
  if (!ipa) return "";
  return ipa.replace(/^\/+/, "").replace(/\/+$/, "").trim();
}
