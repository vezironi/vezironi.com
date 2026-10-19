import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { listSettings } from "@/lib/admin/data";
import { requireAdminPage } from "@/lib/auth/server";

// Reads the session at request time; see (panel)/layout.tsx.
export const instant = false;
export const metadata = { title: "Ayarlar" };

export default async function SettingsPage() {
  await requireAdminPage();
  const settings = await listSettings();
  return (
    <>
      <PageHeader title="Site ayarları" description="Ana sayfadaki ad, unvan, giriş metni ve sosyal bağlantılar." />
      <SettingsForm values={settings} />
    </>
  );
}
