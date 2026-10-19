"use client";

import { ImageField } from "./image-field";

export type FieldConfig =
  | { type: "text" | "url" | "email" | "number"; name: string; label: string; placeholder?: string; hint?: string }
  | { type: "textarea"; name: string; label: string; rows?: number; hint?: string }
  | { type: "i18n-text" | "i18n-textarea"; name: string; label: string; rows?: number }
  | { type: "checkbox"; name: string; label: string; hint?: string }
  | { type: "select"; name: string; label: string; options: { value: string; label: string }[] }
  | { type: "image"; name: string; label: string; folder: string; svg?: boolean; optional?: boolean }
  | { type: "list"; name: string; label: string; placeholder?: string };

export type Values = Record<string, string | number | boolean | null | undefined | string[]>;

export const inputCls =
  "w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-fg outline-none transition-colors placeholder:text-subtle focus:border-accent aria-[invalid=true]:border-red-500";

function str(v: Values[string]) {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

function Label({ htmlFor, children, error, hint }: { htmlFor?: string; children: React.ReactNode; error?: string; hint?: string }) {
  return (
    <>
      <label htmlFor={htmlFor} className="font-mono text-[11px] text-subtle">
        {children}
      </label>
      {hint && !error && <p className="-mt-1 text-[11px] text-subtle">{hint}</p>}
      {error && <p className="-mt-1 text-xs text-red-500">{error}</p>}
    </>
  );
}

export function Field({ field, values, errors }: { field: FieldConfig; values: Values; errors: Record<string, string> }) {
  const id = `f-${field.name}`;

  switch (field.type) {
    case "i18n-text":
    case "i18n-textarea":
      return (
        <div className="grid gap-1.5">
          <span className="font-mono text-[11px] text-subtle">{field.label}</span>
          <div className="grid gap-2 sm:grid-cols-2">
            {(["Tr", "En"] as const).map((suffix) => {
              const name = `${field.name}${suffix}`;
              const common = {
                id: `f-${name}`,
                name,
                defaultValue: str(values[name]),
                "aria-invalid": !!errors[name],
                className: inputCls,
              };
              return (
                <div key={suffix} className="grid gap-1">
                  <span className="font-mono text-[10px] text-subtle">{suffix.toUpperCase()}</span>
                  {field.type === "i18n-textarea" ? <textarea rows={field.rows ?? 3} {...common} /> : <input {...common} />}
                  {errors[name] && <p className="text-xs text-red-500">{errors[name]}</p>}
                </div>
              );
            })}
          </div>
        </div>
      );
    case "textarea":
      return (
        <div className="grid gap-1.5">
          <Label htmlFor={id} error={errors[field.name]} hint={field.hint}>
            {field.label}
          </Label>
          <textarea id={id} name={field.name} rows={field.rows ?? 4} defaultValue={str(values[field.name])} className={inputCls} aria-invalid={!!errors[field.name]} />
        </div>
      );
    case "checkbox":
      return (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name={field.name} defaultChecked={!!values[field.name]} className="size-4 accent-[var(--accent)]" />
          {field.label}
          {field.hint && <span className="text-xs text-subtle">{field.hint}</span>}
        </label>
      );
    case "select":
      return (
        <div className="grid gap-1.5">
          <Label htmlFor={id} error={errors[field.name]}>
            {field.label}
          </Label>
          <select id={id} name={field.name} defaultValue={str(values[field.name])} className={inputCls}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "image":
      return (
        <div className="grid gap-1.5">
          <Label error={errors[field.name]}>{field.label}</Label>
          <ImageField name={field.name} folder={field.folder} defaultValue={str(values[field.name])} allowSvg={field.svg} optional={field.optional} />
        </div>
      );
    case "list":
      return (
        <div className="grid gap-1.5">
          <Label htmlFor={id} error={errors[field.name]} hint="Virgülle ayır.">
            {field.label}
          </Label>
          <input id={id} name={field.name} defaultValue={str(values[field.name])} placeholder={field.placeholder} className={inputCls} />
        </div>
      );
    default:
      return (
        <div className="grid gap-1.5">
          <Label htmlFor={id} error={errors[field.name]} hint={field.hint}>
            {field.label}
          </Label>
          <input
            id={id}
            name={field.name}
            type={field.type === "number" ? "number" : field.type === "email" ? "email" : "text"}
            inputMode={field.type === "url" ? "url" : undefined}
            defaultValue={str(values[field.name])}
            placeholder={field.placeholder}
            className={inputCls}
            aria-invalid={!!errors[field.name]}
          />
        </div>
      );
  }
}
