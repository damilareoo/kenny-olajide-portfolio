// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CaseReel } from "@/components/case-reel";
import type { CaseBlock } from "@/data/work";

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;
beforeEach(() => { host = document.createElement("div"); document.body.appendChild(host); root = createRoot(host); });
afterEach(() => { act(() => root.unmount()); host.remove(); });
const render = (ui: React.ReactElement) => act(() => root.render(ui));

describe("CaseReel presentation", () => {
  it("prints a caption where one is authored", () => {
    const blocks: CaseBlock[] = [{ kind: "full", caption: "The board, mid-game" }];
    render(<CaseReel blocks={blocks} assets={[]} />);
    expect(host.textContent).toContain("The board, mid-game");
  });

  it("gives a framed capture the frame it asks for", () => {
    const blocks: CaseBlock[] = [{ kind: "full", frame: "phone" }];
    render(<CaseReel blocks={blocks} assets={[]} />);
    expect(host.querySelector("[data-frame-style='phone']")).not.toBeNull();
  });

  it("leaves an unframed capture unframed", () => {
    // The treatment is authored per frame. Framing everything is the same
    // flatness with more decoration.
    const blocks: CaseBlock[] = [{ kind: "full" }];
    render(<CaseReel blocks={blocks} assets={[]} />);
    expect(host.querySelector("[data-frame-style]")).toBeNull();
  });

  it("draws no stroke on a plain capture", () => {
    /* Dark full-bleed screens carry their own edge. Plain drops the slot's
       hairline and ground but keeps the tile radius — borderless, not shapeless. */
    const blocks: CaseBlock[] = [
      { kind: "full", src: "/work/xd/01-trending-games.jpg", plain: true },
    ];
    render(<CaseReel blocks={blocks} assets={[]} />);
    expect(host.querySelector(".border-line")).toBeNull();
  });

  it("keeps the stroke where plain is not asked for", () => {
    const blocks: CaseBlock[] = [{ kind: "full", src: "/work/xd/01-trending-games.jpg" }];
    render(<CaseReel blocks={blocks} assets={[]} />);
    expect(host.querySelector(".border-line")).not.toBeNull();
  });

  it("lets one frame break the column", () => {
    const blocks: CaseBlock[] = [{ kind: "full", bleed: true }];
    render(<CaseReel blocks={blocks} assets={[]} />);
    expect(host.querySelector("[data-bleed]")).not.toBeNull();
  });

  it("links the names a text block declares", () => {
    const blocks: CaseBlock[] = [
      {
        kind: "text",
        heading: "Pieces",
        body: ["With @daomotola & @Damilare, we explored."],
        links: [
          { match: "@daomotola", href: "https://x.com/DaOmotola" },
          { match: "@Damilare", href: "https://www.linkedin.com/in/damilareoo" },
        ],
      },
    ];
    render(<CaseReel blocks={blocks} assets={[]} />);
    expect(host.querySelector('a[href="https://x.com/DaOmotola"]')!.textContent).toBe(
      "@daomotola",
    );
    expect(
      host.querySelector('a[href="https://www.linkedin.com/in/damilareoo"]')!.textContent,
    ).toBe("@Damilare");
  });

  it("leaves text blocks without links untouched", () => {
    const blocks: CaseBlock[] = [{ kind: "text", body: ["Just words."] }];
    render(<CaseReel blocks={blocks} assets={[]} />);
    expect(host.querySelector("a")).toBeNull();
    expect(host.textContent).toContain("Just words.");
  });
});
