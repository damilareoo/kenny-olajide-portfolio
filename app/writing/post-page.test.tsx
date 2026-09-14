import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import PostPage from "./[slug]/page";
import { posts } from "@/data/writing";

const [first, second] = posts;

describe("the writing post page", () => {
  it("carries the breadcrumb naming Writing and the post itself", async () => {
    render(await PostPage({ params: Promise.resolve({ slug: first.slug }) }));
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(breadcrumb).getByRole("link", { name: "Writing" })).toHaveAttribute(
      "href",
      "/writing",
    );
    // The post's own title is the trail's current, non-link crumb — same
    // text as the page's h1, so the lookup is scoped to the breadcrumb
    // rather than a bare getByText that would match both.
    expect(within(breadcrumb).getByText(first.title)).toHaveAttribute("aria-current", "page");
  });

  it("carries pagination wrapping to the other post", async () => {
    render(await PostPage({ params: Promise.resolve({ slug: first.slug }) }));
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
    // Exactly two posts, so both previous and next wrap to the one other post.
    const links = screen.getAllByRole("link", { name: new RegExp(second.title) });
    expect(links).toHaveLength(2);
    for (const link of links) expect(link).toHaveAttribute("href", `/writing/${second.slug}`);
  });
});
