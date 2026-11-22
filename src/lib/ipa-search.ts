/**
 * Normalize an IPA topic keyword badge label into a comparison/quick-lookup search query.
 */
export function normalizeIpaSearchQuery(kw: string): string {
  return kw.split(/[（(/]/)[0].trim();
}
