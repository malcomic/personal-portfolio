"use client";

import { useActionState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { loginAction, type LoginState } from "../actions";

const fieldClasses =
  "h-12 w-full rounded-[2px] border border-border bg-bg px-4 text-[14px] text-text placeholder:text-muted transition-colors duration-200 focus:border-muted focus:outline-none aria-[invalid=true]:border-accent";

const labelClasses = "font-mono text-[12px] text-muted";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, undefined);
  const invalid = state?.error ? true : undefined;

  return (
    <form
      action={formAction}
      aria-busy={pending}
      className="flex flex-col gap-6 rounded-[4px] border border-border bg-surface p-6 md:p-8"
    >
      {next && <input type="hidden" name="next" value={next} />}

      <div className="flex flex-col gap-2">
        <label htmlFor="login-email" className={labelClasses}>
          EMAIL
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state?.email}
          aria-invalid={invalid}
          aria-describedby={invalid && "login-error"}
          className={fieldClasses}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="login-password" className={labelClasses}>
          PASSWORD
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={invalid}
          aria-describedby={invalid && "login-error"}
          className={fieldClasses}
        />
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          disabled={pending}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-[2px] bg-accent text-[15px] font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-accent-hover active:scale-[0.98] disabled:cursor-wait disabled:opacity-80 disabled:active:scale-100"
        >
          {pending && <Spinner />}
          {pending ? "Signing in..." : "Sign in"}
        </button>
        <div role="alert">
          {state?.error && <p id="login-error" className="font-mono text-[12px] text-accent-text">{state.error}</p>}
        </div>
      </div>
    </form>
  );
}
