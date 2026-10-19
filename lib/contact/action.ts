"use server";

import { headers } from "next/headers";
import { getDb } from "@/lib/db/client";
import { env } from "@/lib/env";
import { sendContactMail } from "./mailer";
import { processContact, type ContactResult } from "./process";

export async function submitContact(_prev: ContactResult | null, formData: FormData): Promise<ContactResult> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const input = Object.fromEntries(
    ["name", "email", "subject", "body", "website"].map((k) => [k, String(formData.get(k) ?? "")]),
  );
  return processContact(input, { db: await getDb(), ip, send: sendContactMail, to: env.contactToEmail });
}
