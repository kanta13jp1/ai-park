/**
 * Normalize an LPIC command badge label into a comparison-table search query.
 */
export function normalizeCommandSearchQuery(cmdName: string): string {
  return cmdName.split(" ")[0].replace(/^\//, "").replace(/\*$/, "").trim();
}
