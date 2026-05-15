'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import { site } from '@/content/site';

const Schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(40).optional().or(z.literal('')),
  message: z.string().min(10).max(5000),
  // honeypot: bots fill any field they see; humans don't
  company: z.string().max(0).optional(),
});

export type ContactState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string> };

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = Schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join('.')] = issue.message;
    }
    return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors };
  }
  if (parsed.data.company) return { status: 'success' }; // silently drop bots

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  if (!apiKey) {
    return {
      status: 'error',
      message: `Email service is not configured. Please call us at ${site.phone}.`,
    };
  }

  // Defense in depth: strip control characters from name before it lands in the subject
  const safeName = parsed.data.name.replace(/[\r\n\t]+/g, ' ');

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from: 'A Cut Above <noreply@acutabovelawncareinc.ca>',
      to: [to],
      replyTo: parsed.data.email,
      subject: `New estimate request from ${safeName}`,
      text: [
        `From: ${safeName} <${parsed.data.email}>`,
        parsed.data.phone ? `Phone: ${parsed.data.phone}` : '',
        '',
        parsed.data.message,
      ]
        .filter(Boolean)
        .join('\n'),
    });
    if (error) {
      console.error('[contact] Resend API error:', error);
      return {
        status: 'error',
        message: `Could not send right now — please call us at ${site.phone}.`,
      };
    }
    return { status: 'success' };
  } catch (err) {
    console.error('[contact] Resend SDK threw:', err);
    return {
      status: 'error',
      message: `Could not send right now — please call us at ${site.phone}.`,
    };
  }
}
