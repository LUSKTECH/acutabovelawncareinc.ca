'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { site } from '@/content/site';
import { rateLimit } from '@/lib/rate-limit';

const Schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(40).optional().transform((v) => v?.trim() || undefined),
  message: z.string().min(10).max(5000),
  // Honeypot: bots fill any field they see; humans don't. We allow the field
  // through schema validation so the runtime check below can silently drop
  // the submission with `status: 'success'`, which gives bots no signal that
  // their submission failed.
  company: z.string().max(200).optional(),
});

export type ContactState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string> };

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // IP-bucketed rate limit: 5 submissions per IP per 10 minutes.
  const hdrs = await headers();
  const ip = (hdrs.get('x-forwarded-for') ?? '').split(',')[0]?.trim() || 'unknown';
  const rl = rateLimit(`contact:${ip}`, { max: 5, windowMs: 10 * 60 * 1000 });
  if (!rl.ok) {
    return {
      status: 'error',
      message: `Too many requests right now — please try again later or call ${site.phone}.`,
    };
  }

  const parsed = Schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join('.')] = issue.message;
    }
    return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors };
  }

  // Bot tripped the honeypot: log so we can spot false positives from password managers etc.
  if (parsed.data.company) {
    console.info('[contact] honeypot tripped from ip=%s', ip);
    return { status: 'success' };
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return {
      status: 'error',
      message: `Contact form isn't configured yet — please call us at ${site.phone}.`,
    };
  }

  // Strip control characters before any field lands in an email header or body.
  const safeName = parsed.data.name.replace(/[\r\n\t]+/g, ' ');
  const safeEmail = parsed.data.email.replace(/[\r\n\t]+/g, '');

  try {
    const payload = {
      access_key: accessKey,
      subject: `New estimate request from ${safeName}`,
      from_name: safeName,
      replyto: safeEmail,
      name: safeName,
      email: safeEmail,
      phone: parsed.data.phone ?? '',
      message: parsed.data.message,
    };

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = (await res.json()) as { success: boolean; message?: string };

    if (!json.success) {
      console.error('[contact] Web3Forms error: status=%d message=%s', res.status, json.message);
      return {
        status: 'error',
        message: `Could not send right now — please call us at ${site.phone}.`,
      };
    }

    return { status: 'success' };
  } catch (err) {
    console.error('[contact] Web3Forms fetch threw:', err);
    return {
      status: 'error',
      message: `Could not send right now — please call us at ${site.phone}.`,
    };
  }
}
