"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const formEndpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formEndpoint) {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const message = formData.get("message") as string;
      window.location.href = `mailto:rcablk@rca.ac.uk?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${email}\n\n${message}`)}`;
      return;
    }

    setStatus("submitting");
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const res = await fetch(formEndpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-display font-medium text-foreground">Send a message</h3>
      <div>
        <label htmlFor="contact-name" className="block text-base font-medium text-foreground mb-1">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          className="w-full px-3 py-2 border border-foreground/30 bg-white/80 text-foreground text-base"
          disabled={status === "submitting"}
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-base font-medium text-foreground mb-1">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className="w-full px-3 py-2 border border-foreground/30 bg-white/80 text-foreground text-base"
          disabled={status === "submitting"}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-base font-medium text-foreground mb-1">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          className="w-full px-3 py-2 border border-foreground/30 bg-white/80 text-foreground text-base resize-y"
          disabled={status === "submitting"}
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="px-6 py-2 font-display font-medium text-background bg-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send"}
      </button>
      {status === "success" && (
        <p className="text-base text-foreground">Thanks! Your message has been sent.</p>
      )}
      {status === "error" && (
        <p className="text-base text-red-700">Something went wrong. Please email rcablk@rca.ac.uk directly.</p>
      )}
    </form>
  );
}
