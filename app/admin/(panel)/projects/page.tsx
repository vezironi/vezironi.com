import { EntityManager } from "@/components/admin/entity-manager";
import type { FieldConfig } from "@/components/admin/fields";
import { PageHeader } from "@/components/admin/page-header";
import { listProjects } from "@/lib/admin/data";
import { requireAdminPage } from "@/lib/auth/server";

// Reads the session at request time; see (panel)/layout.tsx.
export const instant = false;
export const metadata = { title: "Projeler" };

const FIELDS: FieldConfig[] = [
  { type: "text", name: "name", label: "Proje adı" },
  { type: "url", name: "url", label: "Site adresi", placeholder: "https://…" },
  { type: "i18n-textarea", name: "description", label: "Açıklama" },
  { type: "list", name: "tech", label: "Teknolojiler", placeholder: "Next.js, TypeScript" },
  { type: "number", name: "year", label: "Yıl" },
  { type: "image", name: "logoUrl", label: "Logo", folder: "logos", svg: true },
  { type: "image", name: "screenshotUrl", label: "Ekran görüntüsü", folder: "projects" },
  { type: "image", name: "bannerUrl", label: "Banner (isteğe bağlı)", folder: "projects", optional: true },
  { type: "checkbox", name: "visible", label: "Sitede göster" },
];

export default async function ProjectsAdminPage() {
  await requireAdminPage();
  const rows = await listProjects();
  return (
    <>
      <PageHeader title="Projeler" description="Sürükleyerek sırala. Kayıttan hemen sonra ana sayfa güncellenir." />
      <EntityManager
        entity="projects"
        items={rows.map((r) => ({ ...r, subtitle: `${r.year} · ${new URL(r.url).hostname}${r.visible ? "" : " · gizli"}` }))}
        fields={FIELDS}
        titleKey="name"
        subtitleKey="subtitle"
        imageKey="logoUrl"
        addLabel="Yeni proje"
      />
    </>
  );
}
