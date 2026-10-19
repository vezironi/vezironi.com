import { EntityManager } from "@/components/admin/entity-manager";
import type { FieldConfig } from "@/components/admin/fields";
import { PageHeader } from "@/components/admin/page-header";
import { listStack } from "@/lib/admin/data";
import { requireAdminPage } from "@/lib/auth/server";

// Reads the session at request time; see (panel)/layout.tsx.
export const instant = false;
export const metadata = { title: "Stack" };

const FIELDS: FieldConfig[] = [
  { type: "text", name: "name", label: "Ad" },
  {
    type: "select",
    name: "category",
    label: "Kategori",
    options: [
      { value: "tech", label: "Teknoloji" },
      { value: "tool", label: "Araç" },
    ],
  },
  { type: "image", name: "iconUrl", label: "İkon (tek renkli SVG önerilir)", folder: "stack", svg: true },
];

export default async function StackAdminPage() {
  await requireAdminPage();
  const rows = await listStack();
  return (
    <>
      <PageHeader title="Stack" description="İkonlar sitede metin rengine boyanır; simpleicons.org'dan SVG indirebilirsin." />
      <EntityManager
        entity="stackItems"
        items={rows.map((r) => ({ ...r, subtitle: r.category === "tech" ? "Teknoloji" : "Araç" }))}
        fields={FIELDS}
        titleKey="name"
        subtitleKey="subtitle"
        imageKey="iconUrl"
        addLabel="Yeni öğe"
      />
    </>
  );
}
