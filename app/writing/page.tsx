import Link from "next/link";
import { IS_PLACEHOLDER, posts } from "@/data/writing";
import { Label } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { STAGGER } from "@/lib/motion";

export const metadata = { title: "Writing" };

export default function WritingIndex() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="mx-auto w-full max-w-[760px] px-6 pb-32 pt-16">
      <Label>Writing</Label>
      {/* Visible in the page, not only in data/writing.ts's source comment,
          so nobody reads this list believing the posts are real. */}
      {IS_PLACEHOLDER && (
        <p className="text-text-3 mt-3 text-[length:var(--text-xs)]">
          Placeholder posts — real writing to be supplied.
        </p>
      )}
      <ul className="mt-8 space-y-10">
        {sorted.map((post, i) => (
          <li key={post.slug} className="border-border border-b pb-10 last:border-none last:pb-0">
            <Reveal delay={i * STAGGER}>
              <Link href={`/writing/${post.slug}`} className="group block">
                <Label>{post.date}</Label>
                <h2 className="text-text-1 mt-2 text-[length:var(--text-lg)] font-medium tracking-[var(--tracking-tight)] group-hover:text-text-2">
                  {post.title}
                </h2>
                <p className="text-text-2 mt-2 text-[length:var(--text-base)]">{post.excerpt}</p>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </main>
  );
}
