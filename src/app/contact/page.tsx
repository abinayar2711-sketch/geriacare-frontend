"use client";

import { useState } from "react";
import { card, input, label, btnPrimary, hint } from "@/lib/ui";
import { submitFeedback } from "@/lib/actions";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      await submitFeedback(fd);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (submitted) {
    return (
      <div className={`${card} mt-10 text-center`}>
        <h1 className="text-2xl font-semibold">Thank you</h1>
        <p className="mt-3 text-[var(--color-muted)]">
          Your message has been received. We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Contact Us</h1>
        <p className="mt-3 max-w-xl text-[var(--color-muted)]">
          Have a question, suggestion, or want to partner with us? We&apos;d love to
          hear from you.
        </p>
      </section>

      {/* WhatsApp */}
      <section className={`${card}`}>
        <h2 className="text-lg font-semibold">WhatsApp</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          For quick questions, reach us on WhatsApp. We respond within 24 hours
          on business days.
        </p>
        <a
          href="https://wa.me/919446945807"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
        >
          Chat on WhatsApp
        </a>
      </section>

      {/* Email */}
      <section className={`${card}`}>
        <h2 className="text-lg font-semibold">Email</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          For detailed questions, partnerships, or feedback — drop us an email.
        </p>
        <a
          href="mailto:support@geriacare.in"
          className="mt-4 inline-block rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
        >
          support@geriacare.in
        </a>
      </section>

      {/* Feedback form */}
      <section className={`${card}`}>
        <h2 className="text-lg font-semibold">Send a Message</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="name" className={label}>
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className={input}
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className={label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={input}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="subject" className={label}>
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              required
              className={input}
              placeholder="What is this about?"
            />
          </div>
          <div>
            <label htmlFor="message" className={label}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className={input}
              placeholder="Tell us what's on your mind..."
            />
          </div>
          {error && <p className={`${hint} text-[var(--color-crisis)]`}>{error}</p>}
          <button type="submit" className={btnPrimary}>
            Send message
          </button>
        </form>
      </section>

      {/* Medical disclaimer */}
      <section className={`${card}`}>
        <h2 className="text-lg font-semibold">Medical Disclaimer</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
          Geriacare is not a medical service. If you or someone you know is
          experiencing a medical emergency, please call your local emergency
          number immediately. We cannot respond to urgent medical questions
          through this form.
        </p>
      </section>
    </div>
  );
}
