export const homeSectionIds = ["skills", "experience"] as const;

export function isActiveLink(pathname: string, href: string, activeSection: string | null = null) {
  const [path, hash] = href.split("#");
  if (hash) return pathname === (path || "/") && activeSection === hash;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
