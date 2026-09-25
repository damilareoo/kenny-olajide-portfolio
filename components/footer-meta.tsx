"use client";

import { useEffect, useState } from "react";

/**
 * The footer's last line: where, when, whose — and the way back up.
 *
 * Lagos time, live, because a portfolio that names a city owes the hour
 * there. Ticks every ten seconds; a clock that re-renders every second is
 * motion pretending to be information. Null until mounted, so the server
 * never prints an hour it cannot know. The year is read at render — it only
 * disagrees with the server for one second a year.
 */
export function FooterMeta() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Africa/Lagos",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  const top = () => {
    const calm =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
  };

  return (
    <div className="mt-10 flex items-baseline justify-between gap-x-4">
      <p className="font-mono text-2xs uppercase tracking-wider text-ink-2">
        Lagos {time ?? "--:--"}, GMT +1 &copy; {new Date().getFullYear()}, Kenny
      </p>
      <button
        type="button"
        onClick={top}
        className="pressable shrink-0 text-sm text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink-3"
      >
        Back to top
      </button>
    </div>
  );
}
