"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/site";
import { homeSectionIds, isActiveLink } from "@/lib/nav";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Wordmark } from "./Wordmark";
import { MobileMenu } from "./MobileMenu";
import { useActiveSection } from "./useActiveSection";

export function Nav() {
  const pathname = usePathname();
  const activeSection = useActiveSection(homeSectionIds, pathname === "/");

  return (
    <header className="sticky top-0 z-50 border-b border-border">
      <div aria-hidden className="absolute inset-0 -z-10 bg-bg/85 backdrop-blur-md" />
      <div className="container-page flex h-16 items-center justify-between lg:grid lg:h-20 lg:grid-cols-[1fr_auto_1fr]">
        <Wordmark />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActiveLink(pathname, link.href, activeSection);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative block text-[14px] font-medium whitespace-nowrap transition-[color,transform] duration-200 ease-out ${
                      active ? "scale-105 text-text" : "text-muted hover:text-text"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className={`absolute top-[calc(100%+4px)] left-1/2 h-[2px] w-3 -translate-x-1/2 bg-accent transition-transform duration-200 ease-out ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-4">
          <StatusBadge className="hidden md:flex" />
          <MobileMenu pathname={pathname} activeSection={activeSection} />
        </div>
      </div>
    </header>
  );
}
