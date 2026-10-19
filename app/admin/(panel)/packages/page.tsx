import { EntityManager } from "@/components/admin/entity-manager";
import type { FieldConfig } from "@/components/admin/fields";
import { PageHeader } from "@/components/admin/page-header";
import { listPackages } from "@/lib/admin/data";
import { requireAdminPage } from "@/lib/auth/server";

// Reads the session at request time; see (panel)/layout.tsx.
export const instant = false;
export const metadata = { title: "Paketler" };

const FIELDS: FieldConfig[] = [
  { type: "text", name: "name", label: "npm paket adı", placeholder: "@vezironi/paket" },
  { type: "i18n-textarea", name: "description", label: "Açıklama" },
  { type: "url", name: "homepageUrl", label: "Doküman / site (isteğe bağlı)" },
  { type: "url", name: "repoUrl", label: "GitHub (isteğe bağlı)" },
];

export default async function PackagesAdminPage() {
  await requireAdminPage();
  const rows = await listPackages();
  return (
    <>
      <PageHeader title="Paketler" description="Sürüm ve lisans npm'den otomatik gelir; burada sadece adı ve açıklamayı girersin." />
      <EntityManager entity="packages" items={rows} fields={FIELDS} titleKey="name" subtitleKey="descriptionTr" addLabel="Yeni paket" />
    </>
  );
}
