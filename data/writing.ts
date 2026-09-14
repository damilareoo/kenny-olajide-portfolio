/**
 * PLACEHOLDER — no real posts have been supplied.
 *
 * The routes, metadata, OG images and loading states around these are real and
 * finished; only the records are stand-ins. Replace the array and drop
 * IS_PLACEHOLDER in one change.
 */
export const IS_PLACEHOLDER = true;

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string[];
  placeholder: boolean;
};

export const posts: Post[] = [
  {
    slug: "on-constraint",
    title: "On constraint",
    date: "2026-01-01",
    excerpt: "Placeholder excerpt. Replace with a real post.",
    body: ["Placeholder body. Replace with a real post."],
    placeholder: true,
  },
  {
    slug: "designing-for-live",
    title: "Designing for live",
    date: "2026-01-01",
    excerpt: "Placeholder excerpt. Replace with a real post.",
    body: ["Placeholder body. Replace with a real post."],
    placeholder: true,
  },
];

export function findPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
