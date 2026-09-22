import { BareShots } from "@/components/bare-shots";
import type { ShotGroup } from "@/lib/shots";

/**
 * Every screen on one cohesive wall.
 *
 * No headings, no labels, no containers: a single grid in the work's own
 * order (Endgame AI, then ChessEver), each picture at its own aspect so
 * nothing is cropped. What a reader who cannot see a frame is owed — which
 * product it is, and where it sits — rides in the alt, not on the page.
 */
export function ShotsWall({ groups }: { groups: ShotGroup[] }) {
  const shots = groups.flatMap((group) =>
    group.shots.map((shot) => ({ shot, title: group.item.title })),
  );
  if (shots.length === 0) return null;

  return (
    <BareShots
      shots={shots.map(({ shot }) => shot)}
      title={groups.length === 1 ? groups[0].item.title : "Kenny Olajide"}
      titles={Object.fromEntries(shots.map(({ shot, title }) => [shot.src, title]))}
    />
  );
}
