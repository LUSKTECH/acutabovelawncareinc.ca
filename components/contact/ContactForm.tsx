'use client';

import { useActionState } from 'react';
import { submitContact, type ContactState } from '@/lib/contact-action';

const initial: ContactState = { status: 'idle' };

function Field({
  label,
  name,
  type = 'text',
  required,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-700">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        aria-label={label}
        className="mt-1 w-full rounded-lg border border-ink-300 bg-white p-3 focus:border-forest-700 focus:outline-none"
      />
      {error && <span className="mt-1 block text-sm text-clay-500">{error}</span>}
    </label>
  );
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);

  if (state.status === 'success') {
    return (
      <div className="rounded-2xl border border-sage-300 bg-moss-100 p-8">
        <p className="font-display text-2xl text-forest-900">
          Thanks — we received your request.
        </p>
        <p className="mt-2 text-ink-700">
          We&rsquo;ll get back to you within one business day.
        </p>
      </div>
    );
  }

  const err = state.status === 'error' ? state.fieldErrors ?? {} : {};

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="text"
        name="company"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
      />
      <Field label="Name" name="name" required error={err['name']} />
      <Field label="Email" name="email" type="email" required error={err['email']} />
      <Field label="Phone (optional)" name="phone" type="tel" error={err['phone']} />
      <label className="block">
        <span className="text-sm font-medium text-ink-700">How can we help?</span>
        <textarea
          name="message"
          required
          aria-label="How can we help?"
          rows={5}
          className="mt-1 w-full rounded-lg border border-ink-300 bg-white p-3 focus:border-forest-700 focus:outline-none"
        />
        {err['message'] && (
          <span className="mt-1 block text-sm text-clay-500">{err['message']}</span>
        )}
      </label>
      {state.status === 'error' && !Object.keys(err).length && (
        <p className="text-sm text-clay-500">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-forest-700 px-6 py-3 font-medium text-cream-50 hover:bg-forest-900 disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send request'}
      </button>
    </form>
  );
}
