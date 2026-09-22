"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { site } from "@/data/site";

/**
 * One cohesive bar for every route.
 *
 * Borrowed from emisho.work/about: a `Back[esc]` that answers the keyboard,
 * a centred title on the page you are on, and a close control that returns
 * home. The home itself keeps the mock's row — dot, Shots / About, Contact
 * pill — so the bar is one component, not three arrangements that drift.
 *
 * Sticky with the page ground, not a blur: the system spends no backdrop
 * filter anywhere, and a bar that frosts would be the only one.
 */
export function SiteNav({ current, title }: { current?: string; title?: string }) {
  const router = useRouter();
  const home = current === "/";

  /* Esc returns home from anywhere. push, not back: a visitor who landed
     deep from a link has no in-site history, and back() would leave the
     site rather than land on the home. */
  useEffect(() => {
    if (home) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      router.push("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [home, router]);

  if (home) {
    return (
      <div className="sticky top-0 z-50 -mx-5 bg-bg px-5 py-2 sm:-mx-6 sm:px-6">
        {/* Sticky like every other bar on the site — september's header never
            leaves, and neither does this one. Solid ground, no blur: the system
            spends no backdrop filter anywhere. */}
        <div className="flex items-center justify-between gap-x-3">
        <div className="flex min-w-0 items-center gap-x-2">
          {/* The face, not a dot: the one image that reads as himself, held
              to avatar size. Links home. */}
          <Link
            href="/"
            aria-label="Kenny Olajide — home"
            aria-current="page"
            className="pressable block shrink-0"
          >
            <Image
              src="/portrait/kenny.png"
              alt=""
              width={160}
              height={160}
              sizes="32px"
              priority
              className="size-8 rounded-full object-cover"
            />
          </Link>
          <nav className="flex min-w-0 items-center gap-x-0.5" aria-label="Sections">
            <Link
              href="/about"
              className="pressable rounded-[4px] px-2 py-1 font-mono text-2xs uppercase tracking-[0.08em] text-ink-2 hover:text-ink"
            >
              About
            </Link>
            <Link
              href="/shots"
              className="pressable rounded-[4px] px-2 py-1 font-mono text-2xs uppercase tracking-[0.08em] text-ink-2 hover:text-ink"
            >
              Shots
            </Link>
          </nav>
        </div>
        <a
          href={`mailto:${site.email}`}
          className="pressable shrink-0 rounded-full bg-strong px-4 py-1.5 font-mono text-2xs uppercase tracking-[0.08em] text-on-strong"
        >
          Connect
        </a>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 grid w-full grid-cols-[1fr_auto_1fr] items-center bg-bg py-2">
      <div className="justify-self-start">
        <Link
          href="/"
          className="pressable inline-flex items-center gap-1 rounded-[4px] px-1.5 py-2 font-mono text-2xs uppercase tracking-[0.08em] text-ink-2 hover:text-ink"
        >
          <span>Back</span>
          <span className="text-ink-3">[esc]</span>
        </Link>
      </div>
      {title && (
        <p className="justify-self-center text-sm font-medium text-ink">{title}</p>
      )}
      {/* Connect rides the bar on every page, september-style: one tap away
          from anywhere, beside the close control. */}
      <div className="flex items-center gap-x-1 justify-self-end">
        <a
          href={`mailto:${site.email}`}
          className="pressable shrink-0 rounded-full bg-strong px-4 py-1.5 font-mono text-2xs uppercase tracking-[0.08em] text-on-strong"
        >
          Connect
        </a>
        <Link
          href="/"
          aria-label="Close and return home"
          className="pressable flex size-12 items-center justify-center rounded-[4px] text-ink-2 hover:text-ink"
        >
          <svg aria-hidden="true" className="size-5" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5 5.00068 14.9993M14.9993 15 5 5.00071"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
