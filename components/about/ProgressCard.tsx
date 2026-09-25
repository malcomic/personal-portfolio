import { progress, progressTitle } from "@/lib/data/about";

export function ProgressCard() {
  return (
    <section
      aria-labelledby="progress-heading"
      className="flex flex-col gap-6 rounded-[4px] border border-border bg-surface p-6 md:p-8"
    >
      <h2 id="progress-heading" className="font-display text-[20px] font-extrabold text-text">
        {progressTitle}
      </h2>
      <ol className="flex flex-col divide-y divide-border">
        {progress.map((entry) => (
          <li key={entry.title} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0">
            <p className={`font-mono text-[11px] ${entry.upcoming ? "text-accent-text" : "text-muted"}`}>{entry.period}</p>
            <h3 className="text-[15px] font-semibold text-text">{entry.title}</h3>
            <p className="text-[13px] text-muted">{entry.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
