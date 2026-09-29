import type { ComponentPropsWithoutRef } from "react";
import { Spinner } from "@/components/ui/Spinner";

type Variant = "primary" | "secondary" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary: "border border-border text-text hover:border-muted hover:bg-hover-overlay",
  danger: "border border-accent/40 text-accent-text hover:bg-accent/10",
};

export function actionButtonClasses(variant: Variant = "secondary", className = "") {
  return `inline-flex h-10 items-center justify-center gap-2 rounded-[4px] px-4 text-[14px] font-semibold whitespace-nowrap transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${variants[variant]} ${className}`;
}

type ActionButtonProps = Omit<ComponentPropsWithoutRef<"button">, "className"> & {
  variant?: Variant;
  pending?: boolean;
  className?: string;
};

export function ActionButton({
  variant = "secondary",
  pending = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ActionButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      className={actionButtonClasses(variant, className)}
      {...props}
    >
      {pending && <Spinner />}
      {children}
    </button>
  );
}
