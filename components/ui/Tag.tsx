import type { ReactNode } from "react";

const tones = {
  neutral: "border-border bg-surface text-muted",
  accent: "border-[rgba(220,38,38,0.25)] bg-[rgba(220,38,38,0.08)] text-accent-text",
} as const;

type TagProps = {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
};

export function Tag({ children, tone = "neutral", className = "" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-[2px] border px-2.5 py-1 font-mono text-[12px] leading-4 whitespace-nowrap ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
