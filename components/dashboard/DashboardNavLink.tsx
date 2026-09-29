"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type DashboardNavLinkProps = {
  href: string;
  exact?: boolean;
  children: ReactNode;
};

export function DashboardNavLink({ href, exact = false, children }: DashboardNavLinkProps) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex h-10 shrink-0 items-center justify-between gap-3 rounded-[4px] px-3 text-[14px] font-medium whitespace-nowrap transition-colors ${
        active ? "bg-hover-overlay text-text" : "text-muted hover:bg-hover-overlay hover:text-text"
      }`}
    >
      {children}
    </Link>
  );
}
