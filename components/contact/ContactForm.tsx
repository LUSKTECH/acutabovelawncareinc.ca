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
}: Readonly<{
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
}>) {
  const errorId = error ? `${name}-error` : undefined;
  return (
    <div>
      <label htmlFor={name} className="text-ink-700 block text-sm font-medium">
        {label}
        {required && (
          <span aria-hidden="true" className="text-clay-700 ml-0.5">
            *
          </span>
        )}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        required={required}
        aria-label={label}
        aria-required={required ? true : undefined}
        aria-describedby={errorId}
        aria-invalid={error ? true : undefined}
        className="border-ink-300 focus:border-forest-700 mt-1 w-full rounded-lg border bg-white p-3 focus:outline-none"
      />
      {error && (
        <span id={errorId} role="alert" className="text-clay-700 mt-1 block text-sm">
          {error}
        </span>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);

  if (state.status === 'success') {
    return (
      <div className="border-sage-300 bg-moss-100 rounded-2xl border p-8">
        <p className="font-display text-forest-900 text-2xl">Thanks — we received your request.</p>
        <p className="text-ink-700 mt-2">We&rsquo;ll get back to you within one business day.</p>
      </div>
    );
  }

  const err = state.status === 'error' ? (state.fieldErrors ?? {}) : {};

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
      <p className="text-ink-500 text-sm">
        Fields marked <span className="text-clay-700">*</span> are required.
      </p>
      <Field label="Name" name="name" required error={err['name']} />
      <Field label="Email" name="email" type="email" required error={err['email']} />
      <Field label="Phone (optional)" name="phone" type="tel" error={err['phone']} />
      <div>
        <label htmlFor="message" className="text-ink-700 block text-sm font-medium">
          How can we help?
          <span aria-hidden="true" className="text-clay-700 ml-0.5">
            *
          </span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          aria-label="How can we help?"
          aria-required="true"
          aria-describedby={err['message'] ? 'message-error' : undefined}
          aria-invalid={err['message'] ? true : undefined}
          rows={5}
          className="border-ink-300 focus:border-forest-700 mt-1 w-full rounded-lg border bg-white p-3 focus:outline-none"
        />
        {err['message'] && (
          <span id="message-error" role="alert" className="text-clay-700 mt-1 block text-sm">
            {err['message']}
          </span>
        )}
      </div>
      {state.status === 'error' && !Object.keys(err).length && (
        <p role="alert" className="text-clay-700 text-sm">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="bg-forest-700 text-cream-50 hover:bg-forest-900 rounded-full px-6 py-3 font-medium disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send request'}
      </button>
    </form>
  );
}
