export function DraftNotice({ draft }: { draft: boolean }) {
  if (!draft || process.env.NODE_ENV !== "development") return null;

  return (
    <p className="self-start rounded-[2px] border border-dashed border-accent px-3 py-1.5 font-mono text-[12px] text-accent-text">
      DRAFT CASE STUDY: review and correct in lib/data/projects.ts (visible in development only)
    </p>
  );
}
