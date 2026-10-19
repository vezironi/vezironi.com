import { Resend } from "resend";
import { env } from "@/lib/env";
import type { ContactMail } from "./process";

export async function sendContactMail(mail: ContactMail): Promise<void> {
  if (!env.resendApiKey) {
    console.warn("RESEND_API_KEY is not set; contact mail skipped (message kept in the inbox).");
    return;
  }
  const { error } = await new Resend(env.resendApiKey).emails.send({
    from: `vezironi.com <${env.contactFromEmail}>`,
    to: mail.to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
  });
  if (error) throw new Error(error.message);
}
