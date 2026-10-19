import { GalleryManager } from "@/components/admin/gallery-manager";
import { PageHeader } from "@/components/admin/page-header";
import { listGallery } from "@/lib/admin/data";
import { requireAdminPage } from "@/lib/auth/server";

// Reads the session at request time; see (panel)/layout.tsx.
export const instant = false;
export const metadata = { title: "Galeri" };

export default async function GalleryAdminPage() {
  await requireAdminPage();
  const rows = await listGallery();
  return (
    <>
      <PageHeader title="Galeri" description="Sürükleyerek sırala; açıklama ve tarih isteğe bağlı." />
      <GalleryManager items={rows} />
    </>
  );
}
