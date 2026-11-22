/**
 * Normalize an AWS service badge label into a comparison / reverse-lookup search query.
 */
export function normalizeAwsSearchQuery(
  serviceName: string,
  aliases?: Record<string, string>
): string {
  const trimmed = serviceName.trim();
  const mapped = aliases?.[trimmed];
  if (mapped) return mapped;
  return trimmed
    .replace(/^(Amazon|AWS)\s+/i, "")
    .split(/[（(]/)[0]
    .trim();
}
