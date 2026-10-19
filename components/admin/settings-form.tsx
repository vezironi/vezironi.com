"use client";

import { CheckCircle2 } from "lucide-react";
import { useActionState } from "react";
import { saveSettingsAction } from "@/lib/admin/actions/content";
import type { SaveResult } from "@/lib/admin/content";
import { Field, type FieldConfig, type Values } from "./fields";

const FIELDS: FieldConfig[] = [
  { type: "text", name: "name", label: "Ad" },
  { type: "i18n-text", name: "title", label: "Unvan" },
  { type: "i18n-textarea", name: "bio", label: "Giriş metni", rows: 5 },
  { type: "url", name: "github", label: "GitHub adresi" },
  { type: "url", name: "x", label: "X adresi" },
  { type: "email", name: "email", label: "E-posta" },
  { type: "text", name: "discordUsername", label: "Discord kullanıcı adı" },
  { type: "text", name: "discordId", label: "Discord ID", hint: "Lanyard durumu ve Discord linki için kullanılır." },
];

export function SettingsForm({ values }: { values: Values }) {
  const [state, action, pending] = useActionState<SaveResult | null, FormData>(saveSettingsAction, null);
  const errors = state && !state.ok ? state.errors : {};
  return (
    <form action={action} className="grid max-w-3xl gap-4 p-6">
      {FIELDS.map((f) => (
        <Field key={f.name} field={f} values={values} errors={errors} />
      ))}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg disabled:opacity-60">
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {state?.ok && (
          <span role="status" className="flex items-center gap-1.5 text-sm text-accent">
            <CheckCircle2 className="size-4" /> Kaydedildi
          </span>
        )}
      </div>
    </form>
  );
}
