import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { Screenshot } from "@/lib/data/projects";

const ratios = {
  card: "aspect-[576/260]",
  hero: "aspect-[1280/450]",
  gallery: "aspect-[342/220]",
} as const;

type ScreenshotPlaceholderProps = {
  screenshot: Screenshot;
  variant: keyof typeof ratios;
  sizes: string;
  preload?: boolean;
  className?: string;
};

export function ScreenshotPlaceholder({
  screenshot,
  variant,
  sizes,
  preload = false,
  className = "",
}: ScreenshotPlaceholderProps) {
  const frame = `relative w-full overflow-hidden rounded-[4px] border border-border bg-surface ${ratios[variant]} ${className}`;

  if (screenshot.image) {
    return (
      <div className={frame}>
        <Image
          src={screenshot.image}
          alt={screenshot.caption}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div role="img" aria-label={`Screenshot coming soon: ${screenshot.caption}`} className={`${frame} flex items-center justify-center p-6 md:p-10`}>
      <div aria-hidden className="flex flex-col items-center gap-3">
        <Icon name="layout-dashboard" />
        <p className="max-w-[60ch] text-center font-mono text-[12px] text-muted md:text-[13px]">
          [SCREENSHOT_PLACEHOLDER: {screenshot.caption}]
        </p>
      </div>
    </div>
  );
}
