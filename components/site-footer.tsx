import { CopyEmail } from "@/components/copy-email";
import { GlyphIcon } from "@/components/glyph-icon";
import { site } from "@/data/site";

/* Pinned dark in both skins: the player is somebody else's object sitting in
   our frame, and a skin-following embed would restyle their artwork without
   asking. What makes it ours is the mount — the hairline, the tile radius,
   the mono caption row — the same treatment a case reel gives a capture. */
const EMBED_SRC =
  "https://open.spotify.com/embed/playlist/2pxGmlJOb3x1LaTHOqAn4l?utm_source=generator&theme=0";
const PLAYLIST_URL = "https://open.spotify.com/playlist/2pxGmlJOb3x1LaTHOqAn4l";

/**
 * The footer, everywhere: the way out, what is on repeat, and the mail row.
 *
 * The contact block is the about page's own ending, promoted — one open door
 * rather than a summary, and now the same door on every page. The playlist
 * follows it, then the mail row with its copy control, so the one contact
 * path stays one.
 */
export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line pt-8 pb-8">
      <p className="font-mono text-2xs uppercase tracking-wider text-ink-3">Contact</p>
      <a
        href={`mailto:${site.email}`}
        className="pressable group mt-3 flex items-baseline justify-between gap-x-4 text-left"
      >
        <span className="max-w-[20ch] text-lg font-medium leading-snug tracking-tight text-ink">
          Have a role or a collaboration in mind?
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-2xs uppercase tracking-wider text-ink-2 transition-colors group-hover:text-ink">
          Message me
          <GlyphIcon name="arrow-out" size="0.4375rem" />
        </span>
      </a>

      <div className="mt-10 flex items-baseline justify-between gap-x-4">
        <p className="font-mono text-2xs uppercase tracking-wider text-ink-3">On repeat</p>
        <a
          href={PLAYLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-wider text-ink-2 underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink-3"
        >
          Open in Spotify
          <GlyphIcon name="arrow-out" size="0.4375rem" />
        </a>
      </div>
      {/* A slim bar: cover plus the first tracks, not the whole tracklist —
          a footer that scrolls internally has mistaken its job. Lazy, so
          somebody else's player never slows our first paint. */}
      <div className="mt-3 overflow-hidden rounded-[var(--radius-tile)] border border-line">
        <iframe
          title="Spotify playlist player"
          src={EMBED_SRC}
          width="100%"
          height="80"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="block h-[80px] w-full"
        />
      </div>

      <p className="mt-8 font-mono text-2xs uppercase tracking-wider text-ink-3">Email</p>
      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <a
          href={`mailto:${site.email}`}
          className="text-sm text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink-3"
        >
          {site.email}
        </a>
        <CopyEmail email={site.email} />
      </p>
    </footer>
  );
}
