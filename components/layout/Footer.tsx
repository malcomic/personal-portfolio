import Link from "next/link";
import { site, socialLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="container-page flex flex-col gap-10 pt-14 pb-10 md:pt-20 md:pb-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <Link href="/" className="w-fit font-display text-[18px] font-extrabold text-text">
              {site.wordmark}
            </Link>
            <p className="text-[13px] text-muted">
              {site.role} · {site.location}
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-[13px] text-muted">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="transition-colors duration-200 hover:text-text"
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 font-mono text-[11px] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted">
            © {new Date().getFullYear()} {site.copyright}
          </p>
          <p className="text-accent-text">{site.build}</p>
        </div>
      </div>
    </footer>
  );
}
