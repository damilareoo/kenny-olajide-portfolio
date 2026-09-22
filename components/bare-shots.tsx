import Image from "next/image";
import { Reveal } from "@/lib/reveal";

export type BareShot = {
  src: string;
  width?: number;
  height?: number;
};

/**
 * Screens with no container.
 *
 * No plate, no hairline, no mount — the picture is the whole object, as it
 * arrives. Natural aspect per file (never cropped: a UI crop reads as a
 * design decision), staggered fade on arrival via `Reveal`, subtle zoom on
 * hover for fine pointers only. Reduced motion collapses to presence.
 */
export function BareShots({
  shots,
  title,
  titles,
  ratio = "9 / 19.5",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 46vw",
  className = "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6",
}: {
  shots: BareShot[];
  /** Whose screens these are — feeds every alt. */
  title: string;
  /** Per-file owner, when one wall mixes products. Falls back to `title`. */
  titles?: Record<string, string>;
  /** Slot ratio when a file carries no dimensions. */
  ratio?: string;
  sizes?: string;
  className?: string;
}) {
  if (shots.length === 0) return null;

  return (
    <div className={className}>
      {shots.map((shot, i) => (
        <Reveal key={shot.src} index={i}>
          <figure className="m-0">
            <div className="frame-zoom overflow-hidden rounded-[var(--radius-tile)]">
              {shot.width && shot.height ? (
                <Image
                  src={shot.src}
                  alt={`${titles?.[shot.src] ?? title}, screen ${i + 1} of ${shots.length}`}
                  width={shot.width}
                  height={shot.height}
                  sizes={sizes}
                  className="h-auto w-full"
                />
              ) : (
                <Image
                  src={shot.src}
                  alt={`${titles?.[shot.src] ?? title}, screen ${i + 1} of ${shots.length}`}
                  width={900}
                  height={1950}
                  sizes={sizes}
                  style={{ aspectRatio: ratio }}
                  className="h-auto w-full"
                />
              )}
            </div>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
