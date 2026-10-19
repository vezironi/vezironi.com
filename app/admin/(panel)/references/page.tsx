import { EntityManager } from "@/components/admin/entity-manager";
import type { FieldConfig } from "@/components/admin/fields";
import { PageHeader } from "@/components/admin/page-header";
import { listReferences } from "@/lib/admin/data";
import { requireAdminPage } from "@/lib/auth/server";

// Reads the session at request time; see (panel)/layout.tsx.
export const instant = false;
export const metadata = { title: "Referanslar" };

const FIELDS: FieldConfig[] = [
  { type: "text", name: "name", label: "Ad" },
  { type: "image", name: "logoUrl", label: "Logo", folder: "references", svg: true },
  { type: "url", name: "url", label: "Bağlantı (isteğe bağlı)" },
];

export default async function ReferencesAdminPage() {
  await requireAdminPage();
  const rows = await listReferences();
  return (
    <>
      <PageHeader title="Referanslar" />
      <EntityManager entity="references" items={rows} fields={FIELDS} titleKey="name" subtitleKey="url" imageKey="logoUrl" addLabel="Yeni referans" />
    </>
  );
}
