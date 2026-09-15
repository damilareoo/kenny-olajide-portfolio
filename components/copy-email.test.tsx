import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { CopyEmail, REVERT_AFTER } from "./copy-email";
import { HOLD } from "@/lib/motion";
import { site } from "@/data/site";

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => reduced.value,
}));

function giveClipboard(writeText: () => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
}

function takeClipboardAway() {
  Reflect.deleteProperty(navigator, "clipboard");
}

describe("CopyEmail", () => {
  afterEach(() => takeClipboardAway());

  it("reverts a beat after the copy, spelled in the site's rest token", () => {
    expect(REVERT_AFTER).toBe(HOLD * 4);
  });

  describe("where the clipboard exists", () => {
    it("copies the address and swaps its label to a confirmation", async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      giveClipboard(writeText);

      render(<CopyEmail />);
      const button = screen.getByRole("button");
      expect(button).toHaveTextContent(site.email);

      fireEvent.click(button);

      expect(writeText).toHaveBeenCalledWith(site.email);
      await waitFor(() => expect(button).toHaveTextContent("Copied"));
    });

    it("puts the address back once the beat has passed", async () => {
      vi.useFakeTimers();
      try {
        const writeText = vi.fn().mockResolvedValue(undefined);
        giveClipboard(writeText);

        render(<CopyEmail />);
        const button = screen.getByRole("button");
        fireEvent.click(button);
        await act(async () => {});
        expect(button).toHaveTextContent("Copied");

        await act(async () => {
          vi.advanceTimersByTime(REVERT_AFTER * 1000 + 1);
        });
        expect(button).toHaveTextContent(site.email);
      } finally {
        vi.useRealTimers();
      }
    });

    it("claims nothing when the clipboard exists and refuses", async () => {
      const writeText = vi.fn().mockRejectedValue(new Error("denied"));
      giveClipboard(writeText);

      render(<CopyEmail />);
      const button = screen.getByRole("button");
      fireEvent.click(button);

      await act(async () => {});
      expect(button).toHaveTextContent(site.email);
      expect(button).not.toHaveTextContent("Copied");
    });
  });

  describe("where the clipboard is absent", () => {
    beforeEach(() => takeClipboardAway());

    it("is a real mailto link, never a dead button", () => {
      render(<CopyEmail />);
      expect(screen.queryByRole("button")).toBeNull();
      expect(screen.getByRole("link", { name: site.email })).toHaveAttribute(
        "href",
        `mailto:${site.email}`,
      );
    });

    it("draws its underline rather than fading one in", () => {
      render(<CopyEmail />);
      expect(screen.getByRole("link", { name: site.email })).toHaveClass("link");
    });
  });
});
