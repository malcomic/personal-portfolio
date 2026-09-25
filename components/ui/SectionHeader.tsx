import type { ReactNode } from "react";

type SectionHeaderProps = {
  label: string;
  title: ReactNode;
  description?: ReactNode;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  descriptionClassName?: string;
};

export function SectionHeader({
  label,
  title,
  description,
  as: Heading = "h2",
  id,
  className = "",
  descriptionClassName = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col items-start gap-4 ${className}`}>
      <p className="flex items-center gap-2 font-mono text-[14px] text-accent-text uppercase">
        <span aria-hidden className="size-1.5 shrink-0 bg-accent" />
        {label}
      </p>
      <Heading id={id} className="text-heading-section text-text">
        {title}
      </Heading>
      {description && (
        <p className={`text-[16px] leading-[1.6] text-muted md:text-[18px] ${descriptionClassName}`}>{description}</p>
      )}
    </div>
  );
}
