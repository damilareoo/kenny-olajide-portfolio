import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { work } from "@/data/work";
import { posts } from "@/data/writing";

/* /work is listed here, not just /work/[slug]: Task 15 created that index and
   Task 9's nav links to it — a linked, indexable route the sitemap denied
   would be a contradiction a crawler resolves against us. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/about", "/work", "/writing"];
  const workRoutes = work.map((w) => `/work/${w.slug}`);
  const writingRoutes = posts.map((p) => `/writing/${p.slug}`);

  return [...staticRoutes, ...workRoutes, ...writingRoutes].map((path) => ({
    url: `${site.url}${path}`,
  }));
}
