import type { AppCard } from "@/lib/app-store";
import { Chip } from "./ui";

/**
 * Rating, seller, genre, and the one control.
 *
 * `data-source` is not printed. It rides on the root so the recorded fallback
 * can be *verified* rather than reasoned about: point the lookup at a host that
 * will not answer, load the page, read the attribute.
 */
export function AppStoreMeta({ card }: { card: AppCard }) {
  return (
    <div data-source={card.source} className="flex flex-wrap items-center gap-3">
      {/* One decimal. The live figure arrives as 4.73332, and printing that
          would claim a precision thirty votes cannot support. */}
      <span className="text-text-1 text-[length:var(--text-sm)] font-medium">
        {card.rating.toFixed(1)}
      </span>
      <span className="text-text-3 text-[length:var(--text-xs)]">
        {card.ratingCount} ratings
      </span>
      <Chip>{card.genre}</Chip>
      <span className="text-text-3 text-[length:var(--text-xs)]">{card.seller}</span>
      <a
        href={card.storeUrl}
        target="_blank"
        rel="noreferrer"
        className="text-text-1 text-[length:var(--text-xs)] underline underline-offset-4"
      >
        View on the App Store
      </a>
    </div>
  );
}
