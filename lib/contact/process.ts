import { createHash } from "node:crypto";
import { and, count, eq, gt } from "drizzle-orm";
import { z } from "zod";
import type { Db } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { env } from "@/lib/env";

export const RATE_LIMIT = 3;
export const RATE_WINDOW_MS = 10 * 60_000;

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().max(150).optional().default(""),
  body: z.string().trim().min(10).max(5000),
});

export type ContactField = "name" | "email" | "subject" | "body";
export type ContactResult =
  | { ok: true }
  | { ok: false; error: "invalid" | "rate_limited" | "server"; fields?: Partial<Record<ContactField, string>> };

export type ContactMail = { to: string; replyTo: string; subject: string; text: string };

export function hashIp(ip: string): string {
  return createHash("sha256").update(`${env.authSecret ?? "vezironi"}:${ip}`).digest("hex");
}

export async function isRateLimited(db: Db, ipHash: string, now: Date): Promise<boolean> {
  const since = new Date(now.getTime() - RATE_WINDOW_MS);
  const [row] = await db
    .select({ n: count() })
    .from(s.messages)
    .where(and(eq(s.messages.ipHash, ipHash), gt(s.messages.createdAt, since)));
  return (row?.n ?? 0) >= RATE_LIMIT;
}

/** Validates, rate-limits, stores and mails a contact submission. */
export async function processContact(
  input: Record<string, string | undefined>,
  ctx: { db: Db; ip: string; now?: Date; send: (mail: ContactMail) => Promise<void>; to: string },
): Promise<ContactResult> {
  // Bots fill every field; humans never see this one. Pretend success.
  if (input.website) return { ok: true };

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fields: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) fields[issue.path[0] as ContactField] ??= issue.message;
    return { ok: false, error: "invalid", fields };
  }

  const now = ctx.now ?? new Date();
  const ipHash = hashIp(ctx.ip);
  try {
    if (await isRateLimited(ctx.db, ipHash, now)) return { ok: false, error: "rate_limited" };
    const { name, email, subject, body } = parsed.data;
    await ctx.db.insert(s.messages).values({ name, email, subject: subject || null, body, ipHash, createdAt: now });

    try {
      await ctx.send({
        to: ctx.to,
        replyTo: email,
        subject: `[vezironi.com] ${subject || `Message from ${name}`}`,
        text: `${name} <${email}>\n\n${body}`,
      });
    } catch (error) {
      // The message is already in the admin inbox; mail is best-effort.
      console.error("Contact mail failed", error);
    }
    return { ok: true };
  } catch (error) {
    console.error("Contact submission failed", error);
    return { ok: false, error: "server" };
  }
}
