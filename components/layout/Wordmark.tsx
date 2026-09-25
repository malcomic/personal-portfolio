import Link from "next/link";
import { site } from "@/lib/site";

export function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-3 whitespace-nowrap">
      <span className="font-display text-[20px] font-extrabold text-text">{site.wordmark}</span>
      <span className="font-mono text-[12px] text-accent-text">{site.version}</span>
      <span className="sr-only">, home</span>
    </Link>
  );
}
