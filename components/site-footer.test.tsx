// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/data/site";

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
  vi.unstubAllGlobals();
});
const render = (ui: React.ReactElement) => act(() => root.render(ui));

describe("SiteFooter", () => {
  it("opens the same contact door as the about ending", () => {
    render(<SiteFooter />);
    expect(host.textContent).toContain("Have a role or a collaboration in mind?");
    expect(host.textContent).toContain("Message me");
    expect(
      host.querySelector(`a[href="mailto:${site.email}"]`),
    ).not.toBeNull();
  });

  it("mounts somebody else's player lazily, in our frame", () => {
    render(<SiteFooter />);
    const frame = host.querySelector("iframe")!;
    expect(frame.getAttribute("src")).toMatch(/^https:\/\/open\.spotify\.com\/embed\//);
    expect(frame.getAttribute("loading")).toBe("lazy");
    expect(frame.getAttribute("title")).toBeTruthy();
    /* The mount, not the player, carries the site's shape. */
    expect(frame.parentElement!.className).toMatch(/border-line/);
    const out = host.querySelector('a[href^="https://open.spotify.com/playlist/"]')!;
    expect(out.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("keeps the slimmer ending on about: no player", () => {
    render(<SiteFooter playlist={false} />);
    expect(host.querySelector("iframe")).toBeNull();
    expect(host.textContent).not.toContain("On repeat");
    expect(host.textContent).toContain("Have a role or a collaboration in mind?");
    expect(host.textContent).toContain("Back to top");
  });

  it("signs the last line with Lagos time and climbs on command", () => {
    render(<SiteFooter />);
    expect(host.textContent).toMatch(/Lagos \d{2}:\d{2}, GMT \+1/);
    expect(host.textContent).toContain(`© ${new Date().getFullYear()}, Kenny`);
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    const top = [...host.querySelectorAll("button")].find((b) =>
      b.textContent?.includes("Back to top"),
    )!;
    act(() => {
      top.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
