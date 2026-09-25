import Image from "next/image";
import { site } from "@/lib/site";

type StatusBadgeProps = {
  className?: string;
};

export function StatusBadge({ className = "" }: StatusBadgeProps) {
  return (
    <p className={`flex items-center gap-2 font-mono text-[13px] whitespace-nowrap text-text ${className}`}>
      <Image src="/icons/status-dot.svg" alt="" width={8} height={8} className="shrink-0" />
      {site.availability}
    </p>
  );
}
