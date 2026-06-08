/** "BMW 5 Series", 14  →  "bmw-5-series-14" */
export function toCarSlug(name: string, id: number): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base}-${id}`;
}

/** "bmw-5-series-14"  →  14 */
export function idFromCarSlug(slug: string): number {
  const parts = slug.split("-");
  return parseInt(parts[parts.length - 1], 10);
}
