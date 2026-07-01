import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation/schemas";
import { checkRateLimit, clientIdentifier } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_EMAILS_API = "https://api.resend.com/emails";
const defaultFromEmail = "Ractysh Design Private Limited <onboarding@resend.dev>";

function parseEmailList(value: string | undefined, fallback: string): string[] {
  const recipients = (value || fallback)
    .split(",")
    .map((recipient) => recipient.trim())
    .filter((recipient) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient));
  return [...new Set(recipients)];
}

function absoluteUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim().replace(/\/+$/, "");
  if (!trimmed) return undefined;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function brandUrl(): string {
  return (
    absoluteUrl(process.env.ARCHITECTURE_PUBLIC_BASE_URL) ||
    absoluteUrl(process.env.EMAIL_PUBLIC_BASE_URL) ||
    absoluteUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    absoluteUrl(process.env.SITE_URL) ||
    absoluteUrl(process.env.PUBLIC_SITE_URL) ||
    absoluteUrl(process.env.WEB_ORIGIN) ||
    "https://www.ractysh.com"
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function display(value: string | undefined | null): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "Not provided";
}

function senderFromEnv(): string {
  return (
    process.env.ARCHITECTURE_CONTACT_MAIL_FROM ||
    process.env.RESEND_FROM_EMAIL ||
    defaultFromEmail
  );
}

function notificationRecipients(): string[] {
  const configured = process.env.ARCHITECTURE_CONTACT_MAIL_TO;
  if (configured) return parseEmailList(configured, "");
  return parseEmailList(process.env.CONSULTATION_NOTIFY_TO, "");
}

function notificationHtml({
  payload, inquiryId, receivedAt, page,
}: {
  payload: { name: string; email: string; phone?: string; projectType: string; location?: string; budget?: string; message: string };
  inquiryId: string;
  receivedAt: string;
  page: string;
}): string {
  const websiteUrl = brandUrl();
  const safeEmail = escapeHtml(payload.email);
  const fields = [
    ["Client", payload.name],
    ["Email", payload.email],
    ["Phone", display(payload.phone)],
    ["Project Type", payload.projectType],
    ["Location", display(payload.location)],
    ["Budget", display(payload.budget)],
    ["Source", page],
    ["Inquiry ID", inquiryId],
  ];

  const fieldCards = fields
    .map(
      ([label, value]) => `
        <td class="field-card-column" width="50%" valign="top" style="padding:0 8px 12px 0">
          <div style="border:1px solid #E7E2D9;border-radius:14px;background:#FFFFFF;padding:18px;box-shadow:0 10px 28px rgba(17,17,17,.05)">
            <p style="margin:0 0 8px;color:#A47A2D;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:.14em;line-height:14px;text-transform:uppercase">${escapeHtml(label)}</p>
            <p style="margin:0;color:#111111;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:22px">${escapeHtml(value)}</p>
          </div>
        </td>`,
    )
    .reduce((rows: string[][], card, index) => {
      if (index % 2 === 0) rows.push([]);
      rows[rows.length - 1].push(card);
      return rows;
    }, [])
    .map((row) => `<tr>${row.join("")}</tr>`)
    .join("");

  return `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Architecture Inquiry</title>
    <style>
      @media only screen and (max-width:640px) {
        .mail-container { width:100% !important; max-width:100% !important; border-radius:0 !important; border-left:0 !important; border-right:0 !important; }
        .mobile-pad { padding-left:24px !important; padding-right:24px !important; }
        .mobile-title { font-size:30px !important; line-height:36px !important; }
        .field-card-column { display:block !important; width:100% !important; padding:0 0 12px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#F8F5EF;color:#111111">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">New architecture inquiry from ${escapeHtml(payload.name)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#F8F5EF">
      <tr><td align="center" style="padding:34px 14px 40px">
        <table role="presentation" class="mail-container" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:680px;border-collapse:separate;border-spacing:0;overflow:hidden;border:1px solid #E7E2D9;border-radius:24px;background:#FFFFFF;box-shadow:0 18px 70px rgba(17,17,17,.08)">
          <tr><td class="mobile-pad" align="center" style="padding:34px 42px 28px;background:#FFFFFF">
            <p style="margin:0;color:#8F1118;font-family:Georgia,'Times New Roman',serif;font-size:44px;font-weight:700;line-height:40px">R</p>
            <p style="margin:6px 0 0;color:#111827;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;letter-spacing:.12em;line-height:34px">RACTYSH</p>
            <p style="margin:5px 0 0;color:#6B5653;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:.28em;line-height:16px;text-transform:uppercase">Architecture Contact Desk</p>
            <div style="width:48px;height:2px;margin:24px auto 0;background:#A47A2D"></div>
          </td></tr>
          <tr><td style="height:4px;background:#A3121A;font-size:0;line-height:0">&nbsp;</td></tr>
          <tr><td class="mobile-pad" align="center" style="padding:32px 42px 34px;border-bottom:1px solid #E7E2D9;background:#FFFCF7">
            <p style="margin:0 0 14px;color:#A47A2D;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:.16em;line-height:16px;text-transform:uppercase">New Lead</p>
            <h1 class="mobile-title" style="margin:0;color:#111111;font-family:Georgia,'Times New Roman',serif;font-size:36px;font-weight:400;line-height:42px">New Architecture Inquiry</h1>
            <p style="margin:14px 0 0;color:#6A6A6A;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:22px">Received ${escapeHtml(receivedAt)}</p>
          </td></tr>
          <tr><td class="mobile-pad" style="padding:34px 42px 40px;background:#FFFFFF">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 26px">${fieldCards}</table>
            <div style="margin:0 0 30px;padding:24px;border:1px solid #E7E2D9;border-left:4px solid #A3121A;border-radius:14px;background:#FFFCF7">
              <p style="margin:0 0 8px;color:#A47A2D;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:.14em;line-height:14px;text-transform:uppercase">Client Message</p>
              <p style="margin:0;color:#2F2F2F;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:27px;white-space:pre-wrap">${escapeHtml(payload.message)}</p>
            </div>
            <a href="mailto:${safeEmail}" style="display:block;margin:0 0 10px;padding:13px 16px;border-radius:8px;background:#A3121A;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:.08em;line-height:18px;text-align:center;text-decoration:none;text-transform:uppercase;box-shadow:0 12px 28px rgba(163,18,26,.2)">Reply to Client</a>
          </td></tr>
          <tr><td class="mobile-pad" align="center" style="padding:28px 42px 34px;border-top:1px solid #E7E2D9;background:#FFFFFF">
            <p style="margin:0;color:#111111;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:700;line-height:25px">Ractysh Group</p>
            <a href="https://www.ractysh.com" style="display:inline-block;margin-top:12px;color:#8F1118;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;text-decoration:none">www.ractysh.com</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

async function sendNotification({
  payload, inquiryId, receivedAt, page,
}: {
  payload: { name: string; email: string; phone?: string; projectType: string; location?: string; budget?: string; message: string };
  inquiryId: string;
  receivedAt: string;
  page: string;
}): Promise<{ sent: boolean; skipped?: boolean; error?: string; id?: string; sentAt?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[architecture-contact] RESEND_API_KEY is not configured.");
    return { sent: false, skipped: true, error: "Email service is not configured." };
  }

  const recipients = notificationRecipients();
  if (!recipients.length) {
    console.warn("[architecture-contact] No notification recipients configured.");
    return { sent: false, skipped: true, error: "No notification recipients configured." };
  }

  try {
    const response = await fetch(RESEND_EMAILS_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": inquiryId,
      },
      body: JSON.stringify({
        from: senderFromEnv(),
        to: recipients,
        reply_to: payload.email,
        subject: `New Architecture Inquiry - ${payload.name}`,
        html: notificationHtml({ payload, inquiryId, receivedAt, page }),
        tags: [{ name: "source", value: "architecture-contact" }],
      }),
      signal: AbortSignal.timeout(8_000),
    });

    const result = (await response.json().catch(() => ({}))) as { id?: string; message?: string; error?: string };

    if (!response.ok) {
      return {
        sent: false,
        error: result.message || result.error || `Email delivery failed with status ${response.status}.`,
      };
    }

    return { sent: true, id: result.id, sentAt: new Date().toISOString() };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Email delivery failed.";
    console.error("[architecture-contact] Email notification failed:", message);
    return { sent: false, error: message };
  }
}

export async function POST(request: NextRequest) {
  const identifier = clientIdentifier(request.headers);
  const { allowed, retryAfter } = checkRateLimit(identifier, 10 * 60_000, 5);

  if (!allowed) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || "Validation failed.";
    return NextResponse.json(
      { success: false, message: firstIssue, issues: parsed.error.issues.map(i => i.message) },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  if (payload.website) {
    return NextResponse.json(
      { success: false, message: "Spam protection triggered." },
      { status: 400 },
    );
  }

  const submittedAt = new Date().toISOString();
  const page = payload.sourcePage || request.headers.get("referer") || request.headers.get("origin") || "architecture-site/contact";
  const subject = `Architecture consultation - ${payload.projectType}`;
  const message = [
    `Project Type: ${payload.projectType}`,
    payload.location ? `Location: ${payload.location}` : undefined,
    payload.budget ? `Budget: ${payload.budget}` : undefined,
    "",
    payload.message,
  ].filter(Boolean).join("\n");

  try {
    const inquiry = await prisma.contactInquiry.create({
      data: {
        division: "architecture",
        name: payload.name,
        email: payload.email,
        phone: payload.phone || undefined,
        service: payload.projectType,
        subject,
        message,
        sourcePage: page,
        status: "new",
      },
    });

    const inquiryDoc = inquiry as unknown as { id: string };

    const notification = await sendNotification({
      payload,
      inquiryId: inquiryDoc.id,
      receivedAt: submittedAt,
      page,
    }).catch((error: unknown): { sent: boolean; error?: string; skipped?: boolean } => {
      console.error("Architecture inquiry email notification failed:", error);
      return { sent: false, error: error instanceof Error ? error.message : "Email delivery failed." };
    });

    if (!notification.sent) {
      console.error("Architecture inquiry email notification failed:", {
        inquiryId: inquiryDoc.id,
        error: notification.error,
      });
    }

    // Auto-reply to submitter (fire-and-forget)
    fetch(RESEND_EMAILS_API, {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "RACTYSH Design Private Limited <onboarding@resend.dev>",
        to: payload.email,
        subject: `Thank You, ${payload.name} — RACTYSH Design`,
        html: renderAutoReplyHtml(payload.name, payload.projectType || null),
      })
    }).catch((err) => console.error("[architecture-contact] Auto-reply failed:", err));

    return NextResponse.json(
      {
        success: true,
        message: notification.sent
          ? "Thank you. Your architecture brief has been received, and the Ractysh team will contact you shortly."
          : "Thank you. Your architecture brief has been received. The Ractysh team will review it shortly.",
        submittedAt,
        inquiry: { id: inquiryDoc.id, stored: true, status: "new" },
        notification,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Architecture inquiry persistence failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to save your architecture brief. Please try again.",
        submittedAt,
        inquiry: { stored: false, storageError: error instanceof Error ? error.message : "Inquiry persistence failed." },
      },
      { status: 503 },
    );
  }
}

function renderAutoReplyHtml(name: string, serviceType: string | null): string {
  const serviceInfo = serviceType
    ? `<tr><td style="padding:0 0 12px;font-size:15px;line-height:22px;color:#62584e"><span style="font-weight:600;color:#20130f">Service Interested:</span> ${escapeHtml(serviceType)}</td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Thank You — RACTYSH Design</title></head>
<body style="margin:0;padding:0;background-color:#f8f3ea;font-family:Georgia,'Times New Roman',serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f3ea">
<tr><td align="center" style="padding:40px 16px">
<table role="presentation" width="540" cellpadding="0" cellspacing="0" style="max-width:540px;width:100%">
<tr><td style="background:linear-gradient(135deg,#0a0806,#1c120e);border-radius:12px 12px 0 0;padding:32px 40px 24px;text-align:center">
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto">
<tr><td style="font-size:28px;font-weight:700;letter-spacing:2px;color:#d9bd7a;font-family:Georgia,'Times New Roman',serif">RACTYSH</td></tr>
<tr><td style="font-size:11px;font-weight:400;letter-spacing:4px;color:#d9bd7a;padding-top:4px;text-transform:uppercase">Design Private Limited</td></tr>
</table></td></tr>
<tr><td style="background-color:#ffffff;padding:40px 40px 32px;border-left:1px solid #e8ddca;border-right:1px solid #e8ddca">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%">
<tr><td style="font-size:28px;font-weight:700;color:#20130f;padding-bottom:8px;font-family:Georgia,'Times New Roman',serif">Thank You, ${escapeHtml(name)}</td></tr>
<tr><td style="height:3px;width:48px;background-color:#d9bd7a;margin:0 0 24px;display:block"></td></tr>
<tr><td style="font-size:16px;line-height:26px;color:#62584e;padding-bottom:16px">We have received your inquiry. A member of our design studio will reach out within <strong style="color:#20130f">24–48 business hours</strong>.</td></tr>
${serviceInfo}
</table></td></tr>
<tr><td style="background-color:#fcf9f4;padding:32px 40px;border-left:1px solid #e8ddca;border-right:1px solid #e8ddca">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%">
<tr><td style="font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#8b1118;padding-bottom:16px;text-align:center;font-family:Arial,Helvetica,sans-serif">Explore RACTYSH</td></tr>
<tr><td style="padding:4px 0"><a href="https://www.ractysh.com" style="color:#20130f;text-decoration:none;font-size:15px;font-weight:600">RACTYSH GROUP</a> <span style="color:#8b6f28;font-size:12px">— Parent Enterprise</span></td></tr>
<tr><td style="padding:4px 0"><a href="https://architects.ractysh.com" style="color:#20130f;text-decoration:none;font-size:15px;font-weight:600">RACTYSH Design</a> <span style="color:#8b6f28;font-size:12px">— Architecture & Interiors</span></td></tr>
<tr><td style="padding:4px 0"><a href="https://construction.ractysh.com" style="color:#20130f;text-decoration:none;font-size:15px;font-weight:600">RACTYSH Infra</a> <span style="color:#8b6f28;font-size:12px">— Construction & Engineering</span></td></tr>
<tr><td style="padding:4px 0"><a href="https://estates.ractysh.com" style="color:#20130f;text-decoration:none;font-size:15px;font-weight:600">RACTYSH Real Estate</a> <span style="color:#8b6f28;font-size:12px">— Premium Properties</span></td></tr>
<tr><td style="padding:4px 0"><a href="https://exports.ractysh.com" style="color:#20130f;text-decoration:none;font-size:15px;font-weight:600">RACTYSH Exim</a> <span style="color:#8b6f28;font-size:12px">— Global Trade</span></td></tr>
<tr><td style="padding:4px 0"><a href="https://exchange.ractysh.com" style="color:#20130f;text-decoration:none;font-size:15px;font-weight:600">RACTYSH Associates</a> <span style="color:#8b6f28;font-size:12px">— OTC Exchange</span></td></tr>
</table></td></tr>
<tr><td style="background:linear-gradient(135deg,#0a0806,#1c120e);border-radius:0 0 12px 12px;padding:24px 40px;text-align:center">
<p style="font-size:12px;line-height:18px;color:#9d8a74;margin:0;font-family:Arial,Helvetica,sans-serif">RACTYSH DESIGN PRIVATE LIMITED</p>
<p style="font-size:11px;line-height:18px;color:#7a6a58;margin:4px 0 0;font-family:Arial,Helvetica,sans-serif">This is an automated acknowledgement.</p>
</td></tr>
</table></td></tr></table></body></html>`;
}

export function GET() {
  return NextResponse.json(
    { success: false, message: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
