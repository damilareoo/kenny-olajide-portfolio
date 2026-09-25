import Image from "next/image";
import type { ShotGroup } from "@/lib/shots";

/**
 * The shots as one line that moves on its own.
 *
 * A rail per product asked the reader to discover swiping; a wall asked them
 * to climb it. This drifts sideways forever without touching anything — the
 * motion itself says there is more. Reduced motion gets the same line as a
 * plain horizontal scroll instead: the blanket rule would freeze the drift
 * at its first frame and strand the rest behind an overflow the visitor can
 * no longer move.
 */
export function ShotsMarquee({ groups }: { groups: ShotGroup[] }) {
  const shots = groups.flatMap((group) =>
    group.shots.map((shot) => ({ shot, title: group.item.title })),
  );
  if (shots.length === 0) return null;

  /* Two identical halves; the track translates -50% on a loop, so the seam
     never shows. The second half hides from assistive tech — same pictures,
     announced once. */
  const halves = [false, true];

  return (
    <div className="shots-viewport">
      <div className="shots-track">
        {halves.map((hidden) => (
          <div
            key={hidden ? "echo" : "line"}
            aria-hidden={hidden || undefined}
            className="flex shrink-0 gap-3 pr-3"
          >
            {shots.map(({ shot, title }, i) => {
              const aspect =
                shot.width && shot.height
                  ? `${shot.width} / ${shot.height}`
                  : "9 / 19.5";
              return (
                <div
                  key={shot.src}
                  style={{ aspectRatio: aspect, height: "min(26rem, 46svh)" }}
                  className="frame-zoom relative shrink-0 overflow-hidden rounded-[var(--radius-tile)]"
                >
                  <Image
                    src={shot.src}
                    alt={
                      hidden
                        ? ""
                        : `${title}, screen ${i + 1} of ${shots.length}`
                    }
                    fill
                    sizes="200px"
                    quality={75}
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
