export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

export function isNavHrefActive(pathname: string, href: string): boolean {
  if (!pathname) return false;
  const current = normalizePathname(pathname);
  const target = normalizePathname(href);
  if (target === "/") return current === "/";
  return current === target || current.startsWith(`${target}/`);
}
