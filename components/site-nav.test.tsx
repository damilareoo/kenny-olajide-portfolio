// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SiteNav } from "@/components/site-nav";

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
  document.body.style.overflow = "";
});
const render = (ui: React.ReactElement) => act(() => root.render(ui));
const menu = () => host.querySelector('[role="dialog"]')!;
const openMenu = () =>
  act(() => {
    host
      .querySelector('button[aria-controls="site-menu"]')!
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

describe("SiteNav", () => {
  it("marks the current route and reaches home through the menu", () => {
    render(<SiteNav current="/shots" />);
    openMenu();
    const home = host.querySelector('a[href="/"]')!;
    expect(home.textContent).toContain("Home");
    expect(host.querySelector('[aria-current="page"]')!.textContent).toContain("Shots");
  });

  it("opens the menu on control and lists every route", () => {
    render(<SiteNav current="/" />);
    expect(menu().getAttribute("data-open")).toBeNull();
    openMenu();
    expect(menu().getAttribute("data-open")).toBe("true");
    for (const label of ["Home", "Shots", "About"]) {
      expect(menu().textContent).toContain(label);
    }
  });

  it("closes on the close control and on Escape", () => {
    render(<SiteNav current="/" />);
    openMenu();
    act(() => {
      menu()
        .querySelector('button[aria-label="Close menu"]')!
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(menu().getAttribute("data-open")).toBeNull();

    openMenu();
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(menu().getAttribute("data-open")).toBeNull();
  });

  it("locks the body scroll while open and frees it after", () => {
    render(<SiteNav current="/" />);
    openMenu();
    expect(document.body.style.overflow).toBe("hidden");
    act(() => {
      menu()
        .querySelector('button[aria-label="Close menu"]')!
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(document.body.style.overflow).toBe("");
  });

  it("carries a way out by mail inside the menu", () => {
    render(<SiteNav current="/" />);
    openMenu();
    const mail = menu().querySelector('a[href^="mailto:"]')!;
    expect(mail.textContent).toContain("@");
  });
});
