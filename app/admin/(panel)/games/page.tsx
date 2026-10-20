import { EntityManager } from "@/components/admin/entity-manager";
import type { FieldConfig } from "@/components/admin/fields";
import { PageHeader } from "@/components/admin/page-header";
import { listGameProjects } from "@/lib/admin/data";
import { requireAdminPage } from "@/lib/auth/server";
import { youtubeId, youtubeThumbnail } from "@/lib/youtube";

// Reads the session at request time; see (panel)/layout.tsx.
export const instant = false;
export const metadata = { title: "Oyun Projeleri" };

const FIELDS: FieldConfig[] = [
  { type: "text", name: "name", label: "Proje adı", placeholder: "Marriage V2" },
  { type: "text", name: "store", label: "Mağaza", placeholder: "0Resmon" },
  {
    type: "url",
    name: "youtubeUrl",
    label: "YouTube videosu",
    placeholder: "https://www.youtube.com/watch?v=…",
    hint: "Kart bu videoya gider; thumbnail videodan otomatik alınır.",
  },
  { type: "url", name: "tebexUrl", label: "Tebex (isteğe bağlı)", placeholder: "https://….tebex.io/package/…" },
  { type: "i18n-textarea", name: "description", label: "Kısa açıklama", rows: 2 },
  { type: "checkbox", name: "visible", label: "Sitede göster" },
];

export default async function GameProjectsAdminPage() {
  await requireAdminPage();
  const rows = await listGameProjects();
  return (
    <>
      <PageHeader
        title="Oyun Projeleri"
        description="Sürükleyerek sırala. Ana sayfada ilk 4 tanesi görünür, tamamı /games sayfasında listelenir."
      />
      <EntityManager
        entity="gameProjects"
        items={rows.map((r) => {
          const id = youtubeId(r.youtubeUrl);
          return {
            ...r,
            thumbnailUrl: id ? youtubeThumbnail(id, "mqdefault") : null,
            subtitle: `${r.store}${r.tebexUrl ? " · Tebex" : ""}${r.visible ? "" : " · gizli"}`,
          };
        })}
        fields={FIELDS}
        titleKey="name"
        subtitleKey="subtitle"
        imageKey="thumbnailUrl"
        addLabel="Yeni oyun projesi"
      />
    </>
  );
}
