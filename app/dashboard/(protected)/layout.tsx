import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { verifySession } from "@/lib/dal";
import { logoutAction } from "../actions";

export default async function ProtectedLayout({ children }: LayoutProps<"/dashboard">) {
  await verifySession();

  return (
    <>
      <header className="border-b border-border">
        <div className="flex h-16 items-center justify-between gap-4 px-5 md:px-8">
          <Link href="/dashboard" className="font-display text-[18px] font-extrabold text-text">
            Dashboard
          </Link>
          <div className="flex items-center gap-3">
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
        </div>
      </header>
      <main id="main" className="flex-1 px-5 py-8 md:px-8">
        {children}
      </main>
    </>
  );
}
