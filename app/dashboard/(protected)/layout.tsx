import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { DashboardNavLink } from "@/components/dashboard/DashboardNavLink";
import { verifySession } from "@/lib/dal";
import { getMessageCounts } from "@/lib/queries/messages";
import { logoutAction } from "../actions";

async function newMessageCount() {
  try {
    return (await getMessageCounts()).NEW;
  } catch (error) {
    console.error("Failed to load message counts", error);
    return 0;
  }
}

function AccountActions({ className = "" }: { className?: string }) {
  return (
    <div className={`items-center gap-2 ${className}`}>
      <ThemeToggle />
      <form action={logoutAction}>
        <button
          type="submit"
          className="h-10 rounded-[4px] border border-border px-4 font-mono text-[13px] text-text transition-colors hover:bg-hover-overlay"
        >
          Log out
        </button>
      </form>
    </div>
  );
}

export default async function ProtectedLayout({ children }: LayoutProps<"/dashboard">) {
  await verifySession();
  const newCount = await newMessageCount();

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="flex flex-col gap-3 border-b border-border px-5 pt-4 pb-3 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:gap-8 lg:border-r lg:border-b-0 lg:px-4 lg:py-6">
        <div className="flex items-center justify-between gap-4 lg:px-3">
          <Link href="/dashboard" className="font-display text-[18px] font-extrabold text-text">
            Dashboard
          </Link>
          <AccountActions className="flex lg:hidden" />
        </div>

        <nav aria-label="Dashboard" className="-mx-1 overflow-x-auto lg:mx-0 lg:flex-1">
          <ul className="flex gap-1 px-1 lg:flex-col lg:px-0">
            <li>
              <DashboardNavLink href="/dashboard" exact>
                Overview
              </DashboardNavLink>
            </li>
            <li>
              <DashboardNavLink href="/dashboard/messages">
                Messages
                {newCount > 0 && (
                  <span className="rounded-full bg-accent px-2 font-mono text-[11px] leading-5 text-white">
                    {newCount}
                    <span className="sr-only"> new</span>
                  </span>
                )}
              </DashboardNavLink>
            </li>
            <li>
              <DashboardNavLink href="/dashboard/projects">Projects</DashboardNavLink>
            </li>
            <li>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 items-center rounded-[4px] px-3 text-[14px] font-medium whitespace-nowrap text-muted transition-colors hover:bg-hover-overlay hover:text-text"
              >
                View site
              </a>
            </li>
          </ul>
        </nav>

        <AccountActions className="hidden lg:flex lg:px-3" />
      </aside>

      <main id="main" className="min-w-0 flex-1 px-5 py-8 md:px-8 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  );
}
