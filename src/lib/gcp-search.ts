/**
 * Normalize a GCP service badge label into a comparison / reverse-lookup search query.
 */
export function normalizeGcpSearchQuery(kw: string): string {
  return kw.split(/[（(/]/)[0].trim();
}
