"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { navLinks, socialLinks } from "@/lib/site";
import { isActiveLink } from "@/lib/nav";
import { StatusBadge } from "@/components/ui/StatusBadge";

type MobileMenuProps = {
  pathname: string;
  activeSection: string | null;
};

export function MobileMenu({ pathname, activeSection }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const desktop = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !containerRef.current) return;

      const focusable = containerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={containerRef} className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="relative flex size-10 items-center justify-center rounded-[4px] border border-border transition-transform duration-150 active:scale-95"
      >
        <span
          aria-hidden
          className={`absolute h-[2px] w-4 bg-text transition-transform duration-200 ${open ? "rotate-45" : "-translate-y-[4px]"}`}
        />
        <span
          aria-hidden
          className={`absolute h-[2px] w-4 bg-text transition-transform duration-200 ${open ? "-rotate-45" : "translate-y-[4px]"}`}
        />
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-border bg-bg"
      >
        <nav aria-label="Mobile" className="container-page flex min-h-full flex-col justify-between gap-12 py-10">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link, index) => {
              const active = isActiveLink(pathname, link.href, activeSection);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-baseline gap-4 py-2 font-display text-[32px] font-extrabold transition-colors ${
                      active ? "text-text" : "text-muted hover:text-text"
                    }`}
                  >
                    <span className="font-mono text-[12px] font-normal text-accent-text">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-6 border-t border-border pt-8">
            <StatusBadge />
            <ul className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-[13px] text-muted">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={close}
                    className="transition-colors hover:text-text"
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
