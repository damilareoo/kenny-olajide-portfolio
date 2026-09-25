// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ShotsMarquee } from "@/components/shots-marquee";
import type { ShotGroup } from "@/lib/shots";
import { feedAssets } from "@/data/assets.generated";
import { groupShots, stripShots } from "@/lib/shots";

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});
const render = (ui: React.ReactElement) => act(() => root.render(ui));

const groups: ShotGroup[] = [
  {
    item: {
      slug: "chessever",
      title: "ChessEver",
      oneLiner: "One line.",
      year: "2025",
    },
    shots: [
      { src: "/shots/chessever-01.jpg", title: "ChessEver 01", date: null, width: 1290, height: 2803 },
      { src: "/shots/chessever-02.jpg", title: "ChessEver 02", date: null, width: 1290, height: 2803 },
    ],
  },
];

describe("ShotsMarquee", () => {
  it("renders nothing without shots", () => {
    render(<ShotsMarquee groups={[]} />);
    expect(host.innerHTML).toBe("");
  });

  it("runs every shot on one line, twice for the loop", () => {
    render(<ShotsMarquee groups={groups} />);
    /* One track, two identical halves — the seam the -50% loop hides behind. */
    expect(host.querySelectorAll(".shots-track")).toHaveLength(1);
    for (const file of ["chessever-01", "chessever-02"]) {
      /* Next serves local files through its optimizer, so the src is an
         encoded `/_next/image?url=` — matched by filename, not equality. */
      const imgs = [...host.querySelectorAll("img")].filter((img) =>
        img.getAttribute("src")?.includes(file),
      );
      expect(imgs).toHaveLength(2);
    }
  });

  it("announces each screen once; the echo half stays silent", () => {
    render(<ShotsMarquee groups={groups} />);
    const alts = [...host.querySelectorAll("img")].map((img) =>
      img.getAttribute("alt"),
    );
    expect(alts).toContain("ChessEver, screen 1 of 2");
    expect(alts.filter((alt) => alt === "")).toHaveLength(2);
    const halves = host.querySelectorAll(".shots-track > div");
    expect(halves[1].getAttribute("aria-hidden")).toBe("true");
  });

  it("carries no visible labels — the motion is the signpost", () => {
    render(<ShotsMarquee groups={groups} />);
    expect(host.querySelector("h1, h2, h3, p")).toBeNull();
  });

  it("fills every viewport twice over, so the loop never shows air", () => {
    /* The track travels exactly one half per loop. If a half ever measured
       less than the widest container it runs in, the seam would open onto
       empty ground once per loop. */
    const { groups: full } = groupShots(feedAssets);
    const strip = stripShots(full);
    const half =
      strip.reduce(
        (n, group) =>
          n +
          group.shots.reduce((m, shot) => m + (shot.width / shot.height) * 416, 0),
        0,
      ) +
      strip.reduce((n, group) => n + group.shots.length, 0) * 12;
    expect(half).toBeGreaterThan(2400);
  });
});
