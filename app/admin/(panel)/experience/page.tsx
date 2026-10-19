import { EntityManager } from "@/components/admin/entity-manager";
import type { FieldConfig } from "@/components/admin/fields";
import { PageHeader } from "@/components/admin/page-header";
import { listExperiences } from "@/lib/admin/data";
import { requireAdminPage } from "@/lib/auth/server";

// Reads the session at request time; see (panel)/layout.tsx.
export const instant = false;
export const metadata = { title: "Deneyim" };

const FIELDS: FieldConfig[] = [
  { type: "text", name: "company", label: "Şirket / proje" },
  { type: "i18n-text", name: "role", label: "Rol" },
  { type: "i18n-textarea", name: "description", label: "Açıklama (isteğe bağlı)" },
  { type: "number", name: "startYear", label: "Başlangıç yılı" },
  { type: "number", name: "endYear", label: "Bitiş yılı" },
  { type: "checkbox", name: "current", label: "Hâlâ devam ediyor", hint: "(bitiş yılı yerine \"Şimdi\" yazar)" },
];

export default async function ExperienceAdminPage() {
  await requireAdminPage();
  const rows = await listExperiences();
  return (
    <>
      <PageHeader title="Deneyim" description="En üstteki kayıt zaman çizelgesinde ilk görünür." />
      <EntityManager
        entity="experiences"
        items={rows.map((r) => ({
          ...r,
          current: r.endYear === null,
          subtitle: `${r.startYear} — ${r.endYear ?? "Şimdi"} · ${r.roleTr}`,
        }))}
        fields={FIELDS}
        titleKey="company"
        subtitleKey="subtitle"
        addLabel="Yeni deneyim"
      />
    </>
  );
}
