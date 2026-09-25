import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { portrait } from "@/lib/data/about";

const frame = "relative aspect-[480/400] w-full overflow-hidden rounded-[4px] border border-border bg-surface";

export function Portrait() {
  if (portrait.src) {
    return (
      <div className={frame}>
        <Image
          src={portrait.src}
          alt={portrait.alt}
          fill
          priority
          sizes="(min-width: 1280px) 480px, (min-width: 1024px) 380px, 100vw"
          className="object-cover object-[center_35%]"
        />
      </div>
    );
  }

  return (
    <div role="img" aria-label={portrait.alt} className={`${frame} flex items-center justify-center p-10`}>
      <div aria-hidden className="flex flex-col items-center gap-3">
        <Icon name="user-round" />
        <p className="font-mono text-[13px] text-muted">{portrait.placeholder}</p>
      </div>
    </div>
  );
}
