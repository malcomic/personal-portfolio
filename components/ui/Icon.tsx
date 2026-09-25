import Image from "next/image";

const sizes = {
  server: 20,
  layout: 20,
  terminal: 20,
  cpu: 20,
  "arrow-up-right": 14,
  "arrow-link": 16,
  "layout-dashboard": 24,
  "user-round": 48,
  mail: 16,
  github: 16,
  linkedin: 16,
} as const;

export type IconName = keyof typeof sizes;

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className = "" }: IconProps) {
  const size = sizes[name];
  return <Image src={`/icons/${name}.svg`} alt="" width={size} height={size} className={`shrink-0 ${className}`} />;
}
