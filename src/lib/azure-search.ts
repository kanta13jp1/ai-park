/**
 * Normalize an Azure topic service badge label into a comparison / reverse-lookup search query.
 */
export function normalizeAzureSearchQuery(serviceLabel: string): string {
  return serviceLabel.split(/[（(/]/)[0].trim();
}
