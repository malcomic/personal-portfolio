import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview",
};

export default function DashboardPage() {
  return (
    <div className="flex max-w-[720px] flex-col gap-2">
      <h1 className="font-display text-[28px] font-extrabold text-text">Signed in</h1>
      <p className="text-[15px] text-muted">Messages and projects will appear here.</p>
    </div>
  );
}
