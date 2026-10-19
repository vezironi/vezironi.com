"use client";

import { CheckCircle2 } from "lucide-react";
import { useActionState, useState } from "react";
import { submitContact } from "@/lib/contact/action";
import type { ContactResult } from "@/lib/contact/process";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type Labels = Dictionary["contact"];

const inputCls =
  "w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-fg outline-none transition-colors placeholder:text-subtle focus:border-accent aria-[invalid=true]:border-red-500";

function Field({
  name,
  label,
  error,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={name} className="grid content-start gap-1.5">
      <span className="font-mono text-[11px] text-subtle">{label}</span>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}

export function ContactForm({ labels }: { labels: Labels }) {
  const [state, action, pending] = useActionState<ContactResult | null, FormData>(submitContact, null);
  // Controlled so React's post-action form reset doesn't wipe what the visitor typed.
  const [values, setValues] = useState({ name: "", email: "", subject: "", body: "" });
  const bind = (key: keyof typeof values) => ({
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues((v) => ({ ...v, [key]: e.target.value })),
  });

  if (state?.ok) {
    return (
      <div role="status" className="flex items-center gap-3 rounded-lg border border-accent/50 bg-accent-soft/40 p-4 text-sm">
        <CheckCircle2 className="size-5 text-accent" aria-hidden />
        {labels.success}
      </div>
    );
  }

  const fields = state && !state.ok ? state.fields ?? {} : {};
  const fieldError = (key: keyof typeof fields) => (fields[key] ? labels.errorInvalid : undefined);
  const banner =
    state && !state.ok
      ? state.error === "rate_limited"
        ? labels.errorRateLimited
        : state.error === "server"
          ? labels.errorServer
          : labels.errorInvalid
      : null;

  return (
    <form action={action} className="grid gap-4" noValidate>
      <div className="grid items-start gap-4 sm:grid-cols-2">
        <Field name="name" label={labels.name} error={fieldError("name")}>
          <input id="name" name="name" required maxLength={100} autoComplete="name" className={inputCls} aria-invalid={!!fields.name} {...bind("name")} />
        </Field>
        <Field name="email" label={labels.email} error={fieldError("email")}>
          <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" className={inputCls} aria-invalid={!!fields.email} {...bind("email")} />
        </Field>
      </div>
      <Field name="subject" label={labels.subject}>
        <input id="subject" name="subject" maxLength={150} className={inputCls} {...bind("subject")} />
      </Field>
      <Field name="body" label={labels.message} error={fieldError("body")}>
        <textarea id="body" name="body" required minLength={10} maxLength={5000} rows={6} className={`${inputCls} resize-y`} aria-invalid={!!fields.body} {...bind("body")} />
      </Field>
      {/* Honeypot: hidden from people and assistive tech, tempting for bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {banner && (
        <p role="alert" className="text-sm text-red-500">
          {banner}
        </p>
      )}
      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md border border-accent bg-accent px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? labels.sending : labels.send}
        </button>
      </div>
    </form>
  );
}
