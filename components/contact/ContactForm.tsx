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
      <label htmlFor={name} className="block text-sm font-medium text-ink-700">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-clay-700">
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
        className="mt-1 w-full rounded-lg border border-ink-300 bg-white p-3 focus:border-forest-700 focus:outline-none"
      />
      {error && (
        <span id={errorId} role="alert" className="mt-1 block text-sm text-clay-700">
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
      <p className="text-sm text-ink-500">
        Fields marked <span className="text-clay-700">*</span> are required.
      </p>
      <Field label="Name" name="name" required error={err['name']} />
      <Field label="Email" name="email" type="email" required error={err['email']} />
      <Field label="Phone (optional)" name="phone" type="tel" error={err['phone']} />
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink-700">
          How can we help?
          <span aria-hidden="true" className="ml-0.5 text-clay-700">
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
          className="mt-1 w-full rounded-lg border border-ink-300 bg-white p-3 focus:border-forest-700 focus:outline-none"
        />
        {err['message'] && (
          <span id="message-error" role="alert" className="mt-1 block text-sm text-clay-700">
            {err['message']}
          </span>
        )}
      </div>
      {state.status === 'error' && !Object.keys(err).length && (
        <p role="alert" className="text-sm text-clay-700">
          {state.message}
        </p>
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
