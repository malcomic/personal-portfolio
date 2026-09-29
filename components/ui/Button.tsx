import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[4px] px-8 py-4 text-[16px] leading-none font-semibold whitespace-nowrap transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary: "border border-border text-text hover:border-muted hover:bg-hover-overlay",
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = CommonProps & { href: string; external?: boolean };
type NativeButtonProps = CommonProps & Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & { href?: undefined };

export function buttonClasses(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

export function Button(props: LinkButtonProps | NativeButtonProps) {
  if (props.href !== undefined) {
    const { href, external, variant, className, children } = props;
    const classes = buttonClasses(variant, className);
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant, className, children, ...buttonProps } = props;
  return (
    <button type="button" {...buttonProps} className={buttonClasses(variant, className)}>
      {children}
    </button>
  );
}
