import type { Metadata } from "next";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({ searchParams }: PageProps<"/dashboard/login">) {
  const { next } = await searchParams;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex justify-end p-5 md:p-8">
        <ThemeToggle />
      </div>
      <main className="flex flex-1 items-start justify-center px-5 pt-8 pb-20 md:pt-16">
        <div className="flex w-full max-w-[420px] flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[12px] text-accent-text">DASHBOARD</p>
            <h1 className="font-display text-[32px] leading-tight font-extrabold text-text">Sign in</h1>
          </div>
          <LoginForm next={typeof next === "string" ? next : undefined} />
        </div>
      </main>
    </div>
  );
}
