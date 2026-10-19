import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPgliteDb, type Db } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { processContact, type ContactMail } from "@/lib/contact/process";

const valid = { name: "Ayşe", email: "ayse@example.com", subject: "Merhaba", body: "Bir proje hakkında konuşalım mı?", website: "" };

describe("processContact", () => {
  let db: Db;
  let send: ReturnType<typeof vi.fn<(mail: ContactMail) => Promise<void>>>;
  const now = new Date("2026-10-19T12:00:00Z");

  beforeEach(async () => {
    db = await createPgliteDb();
    send = vi.fn(async () => {});
  });

  it("stores the message and mails it with reply-to set to the visitor", async () => {
    const result = await processContact(valid, { db, ip: "1.2.3.4", now, send, to: "contact@vezironi.com" });
    expect(result).toEqual({ ok: true });
    const rows = await db.select().from(s.messages);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ name: "Ayşe", email: "ayse@example.com", read: false });
    expect(rows[0].ipHash).not.toContain("1.2.3.4");
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: "contact@vezironi.com", replyTo: "ayse@example.com" }));
  });

  it("silently drops honeypot submissions", async () => {
    const result = await processContact({ ...valid, website: "http://spam" }, { db, ip: "1.2.3.4", now, send, to: "x@y.z" });
    expect(result).toEqual({ ok: true });
    expect(await db.select().from(s.messages)).toHaveLength(0);
    expect(send).not.toHaveBeenCalled();
  });

  it("rate-limits the 4th message from one IP within 10 minutes", async () => {
    const ctx = { db, ip: "9.9.9.9", send, to: "x@y.z" };
    for (let i = 0; i < 3; i++) {
      expect(await processContact(valid, { ...ctx, now: new Date(now.getTime() + i * 60_000) })).toEqual({ ok: true });
    }
    expect(await processContact(valid, { ...ctx, now: new Date(now.getTime() + 4 * 60_000) })).toEqual({
      ok: false,
      error: "rate_limited",
    });
    expect(await processContact(valid, { ...ctx, ip: "8.8.8.8", now: new Date(now.getTime() + 4 * 60_000) })).toEqual({ ok: true });
  });

  it("allows the same IP again after the window", async () => {
    const ctx = { db, ip: "9.9.9.9", send, to: "x@y.z" };
    for (let i = 0; i < 3; i++) await processContact(valid, { ...ctx, now });
    expect(await processContact(valid, { ...ctx, now: new Date(now.getTime() + 11 * 60_000) })).toEqual({ ok: true });
  });

  it("rejects a too-short message with a field error", async () => {
    const result = await processContact({ ...valid, body: "kısa" }, { db, ip: "1.1.1.1", now, send, to: "x@y.z" });
    expect(result).toMatchObject({ ok: false, error: "invalid" });
    expect(result.ok === false && result.fields?.body).toBeTruthy();
  });

  it("rejects an invalid email", async () => {
    const result = await processContact({ ...valid, email: "nope" }, { db, ip: "1.1.1.1", now, send, to: "x@y.z" });
    expect(result.ok === false && result.fields?.email).toBeTruthy();
  });

  it("keeps the message when the mailer fails", async () => {
    send.mockRejectedValueOnce(new Error("resend down"));
    expect(await processContact(valid, { db, ip: "1.1.1.1", now, send, to: "x@y.z" })).toEqual({ ok: true });
    expect(await db.select().from(s.messages)).toHaveLength(1);
  });
});
