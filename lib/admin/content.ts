import { eq, max } from "drizzle-orm";
import { z } from "zod";
import { TAGS, type ContentTag } from "@/lib/content/tags";
import type { Db } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { deleteImage } from "@/lib/storage";
import { youtubeId } from "@/lib/youtube";

// Validation and writes for the simple admin entities. Inputs come straight from
// FormData (all strings); server actions in ./actions/content.ts wrap these with
// requireAdmin() and cache invalidation.

export type FormInput = Record<string, string | undefined>;
export type SaveResult = { ok: true; tag: ContentTag; id: number } | { ok: false; errors: Record<string, string> };

const MSG = {
  required: "Bu alan zorunlu.",
  url: "Geçerli bir adres gir (https://…).",
  image: "Görsel yükle ya da /seed, /uploads veya https:// ile başlayan bir adres gir.",
  year: "2000–2100 arasında bir yıl gir.",
  email: "Geçerli bir e-posta adresi gir.",
  youtube: "Geçerli bir YouTube video adresi gir (https://www.youtube.com/watch?v=…).",
};

const text = z.string({ error: MSG.required }).trim().min(1, MSG.required);
const optionalText = z.string().trim().optional().transform((v) => v ?? "");
const url = z.string({ error: MSG.url }).trim().url(MSG.url).refine((v) => /^https?:\/\//.test(v), MSG.url);
const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || /^https?:\/\/\S+$/.test(v), MSG.url);
const image = z
  .string({ error: MSG.image })
  .trim()
  .refine((v) => /^\/(seed|uploads)\/[\w./-]+$/.test(v) || /^https:\/\/\S+$/.test(v), MSG.image);
const optionalImage = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || /^\/(seed|uploads)\/[\w./-]+$/.test(v) || /^https:\/\/\S+$/.test(v), MSG.image);
const year = z.coerce.number({ error: MSG.year }).int(MSG.year).min(2000, MSG.year).max(2100, MSG.year);
const checkbox = z
  .string()
  .optional()
  .transform((v) => v === "on" || v === "true");
const list = z
  .string()
  .optional()
  .transform((v) => (v ?? "").split(",").map((t) => t.trim()).filter(Boolean));

const schemas = {
  projects: z.object({
    name: text,
    url,
    logoUrl: image,
    screenshotUrl: image,
    bannerUrl: optionalImage,
    descriptionTr: text,
    descriptionEn: text,
    tech: list,
    year,
    visible: checkbox,
  }),
  gameProjects: z.object({
    name: text,
    store: text,
    youtubeUrl: z
      .string({ error: MSG.youtube })
      .trim()
      .refine((v) => youtubeId(v) !== null, MSG.youtube),
    tebexUrl: optionalUrl,
    descriptionTr: text,
    descriptionEn: text,
    visible: checkbox,
  }),
  packages: z.object({
    name: z
      .string()
      .trim()
      .regex(/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/, "Geçerli bir npm paket adı gir (örn. @vezironi/paket)."),
    descriptionTr: text,
    descriptionEn: text,
    homepageUrl: optionalUrl,
    repoUrl: optionalUrl,
  }),
  references: z.object({ name: text, logoUrl: image, url: optionalUrl }),
  experiences: z
    .object({
      company: text,
      roleTr: text,
      roleEn: text,
      descriptionTr: optionalText,
      descriptionEn: optionalText,
      startYear: year,
      current: checkbox,
      endYear: z.string().trim().optional(),
    })
    .transform(({ current, endYear, ...rest }, ctx) => {
      if (current) return { ...rest, endYear: null };
      const end = Number(endYear);
      if (!endYear || !Number.isInteger(end) || end < 2000 || end > 2100) {
        ctx.addIssue({ code: "custom", path: ["endYear"], message: MSG.year });
        return z.NEVER;
      }
      if (end < rest.startYear) {
        ctx.addIssue({ code: "custom", path: ["endYear"], message: "Bitiş yılı başlangıçtan önce olamaz." });
        return z.NEVER;
      }
      return { ...rest, endYear: end };
    }),
  stackItems: z.object({
    category: z.enum(["tech", "tool"], { error: "Kategori seç." }),
    name: text,
    iconUrl: image,
  }),
} as const;

export type Entity = keyof typeof schemas;

const tables = {
  projects: s.projects,
  gameProjects: s.gameProjects,
  packages: s.packages,
  references: s.references,
  experiences: s.experiences,
  stackItems: s.stackItems,
} as const;

export const ENTITY_TAG: Record<Entity, ContentTag> = {
  projects: TAGS.projects,
  gameProjects: TAGS.games,
  packages: TAGS.packages,
  references: TAGS.references,
  experiences: TAGS.experiences,
  stackItems: TAGS.stack,
};

const IMAGE_FIELDS: Partial<Record<Entity, string[]>> = {
  projects: ["logoUrl", "screenshotUrl", "bannerUrl"],
  references: ["logoUrl"],
  stackItems: ["iconUrl"],
};

function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) errors[String(issue.path[0] ?? "_")] ??= issue.message;
  return errors;
}

function uniqueViolation(error: unknown) {
  const code = (error as { code?: string; cause?: { code?: string } })?.cause?.code ?? (error as { code?: string })?.code;
  return code === "23505";
}

/* eslint-disable @typescript-eslint/no-explicit-any -- one generic writer over several Drizzle tables */
export async function saveEntity(db: Db, entity: Entity, input: FormInput): Promise<SaveResult> {
  const parsed = schemas[entity].safeParse(input);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const table = tables[entity] as any;
  const values = parsed.data as Record<string, unknown>;
  const id = input.id ? Number(input.id) : null;

  try {
    if (id) {
      const [previous] = await db.select().from(table).where(eq(table.id, id)).limit(1);
      if (!previous) return { ok: false, errors: { _: "Kayıt bulunamadı." } };
      await db.update(table).set(values).where(eq(table.id, id));
      for (const field of IMAGE_FIELDS[entity] ?? []) {
        const old = (previous as Record<string, unknown>)[field];
        if (typeof old === "string" && old !== values[field]) await deleteImage(old);
      }
      return { ok: true, tag: ENTITY_TAG[entity], id };
    }
    const [{ top }] = (await db.select({ top: max(table.sortOrder) }).from(table)) as { top: unknown }[];
    const [row] = await db
      .insert(table)
      .values({ ...values, sortOrder: (Number(top) || 0) + 1 })
      .returning({ id: table.id });
    return { ok: true, tag: ENTITY_TAG[entity], id: row.id };
  } catch (error) {
    if (uniqueViolation(error)) return { ok: false, errors: { name: "Bu isimde bir kayıt zaten var.", company: "Bu isimde bir kayıt zaten var." } };
    throw error;
  }
}

export async function deleteEntity(db: Db, entity: Entity, id: number): Promise<ContentTag> {
  const table = tables[entity] as any;
  const [row] = (await db.delete(table).where(eq(table.id, id)).returning()) as Record<string, unknown>[];
  for (const field of IMAGE_FIELDS[entity] ?? []) {
    const value = row?.[field];
    if (typeof value === "string") await deleteImage(value);
  }
  return ENTITY_TAG[entity];
}

export async function reorderEntity(db: Db, entity: Entity, ids: number[]): Promise<ContentTag> {
  const table = tables[entity] as any;
  // Sequential updates: the Neon HTTP driver has no interactive transactions.
  for (const [index, id] of ids.entries()) {
    await db.update(table).set({ sortOrder: index }).where(eq(table.id, id));
  }
  return ENTITY_TAG[entity];
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const settingsSchema = z.object({
  name: text,
  titleTr: text,
  titleEn: text,
  bioTr: text,
  bioEn: text,
  github: url,
  email: z.string().trim().email(MSG.email),
  discordUsername: text,
  discordId: z.string().trim().regex(/^\d{5,25}$/, "Discord ID sadece rakamlardan oluşur."),
  x: url,
});

export async function saveSettings(db: Db, input: FormInput): Promise<SaveResult> {
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  await db.update(s.siteSettings).set(parsed.data).where(eq(s.siteSettings.id, 1));
  return { ok: true, tag: TAGS.settings, id: 1 };
}
