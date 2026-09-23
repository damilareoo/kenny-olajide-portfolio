"use client";

import { useState } from "react";

/**
 * The email row's copy control.
 *
 * Press-scale only (Emil: transform + opacity, ease-out, under 300ms).
 * Label swaps to "Copied" for 1.6s; clipboard failure falls back to the
 * mailto link the address already is.
 */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      }}
      className="pressable lift rounded-full bg-surface-2 px-2 py-0.5 font-mono text-2xs uppercase tracking-wider text-ink-2 hover:text-ink"
      aria-live="polite"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
