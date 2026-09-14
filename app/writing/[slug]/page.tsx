import { notFound } from "next/navigation";
import { findPost, IS_PLACEHOLDER, posts } from "@/data/writing";
import { Label } from "@/components/ui";
import { Breadcrumb } from "@/components/breadcrumb";
import { adjacent, Pagination } from "@/components/pagination";

/* Same trap as app/work/[slug]/page.tsx, and pinned by the same kind of test
   (see app/writing/writing-route.test.ts): this route also sits behind
   app/loading.tsx, so Next commits HTTP 200 before the body streams and a
   notFound() reached during render can never flip the status.
   dynamicParams = false moves the decision to the router instead. */
export const dynamicParams = false;

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost(slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const index = posts.findIndex((p) => p.slug === slug);
  const { prev, next } = adjacent(
    posts.map((p) => ({ title: p.title, href: `/writing/${p.slug}` })),
    index,
  );

  return (
    <main id="main" className="mx-auto w-full max-w-[760px] px-6 pb-32 pt-16">
      <Breadcrumb
        trail={[
          { label: "Writing", href: "/writing" },
          { label: post.title, href: `/writing/${post.slug}` },
        ]}
      />
      <div className="mt-8">
        <Label>{post.date}</Label>
      </div>
      {/* Same visibility rule as app/about/page.tsx: a placeholder post says
          so on the page, not only in data/writing.ts's source comment. */}
      {IS_PLACEHOLDER && (
        <p className="text-text-3 mt-2 text-[length:var(--text-xs)]">
          Placeholder post — real writing to be supplied.
        </p>
      )}
      <h1 className="text-text-1 mt-3 text-[length:var(--text-xl)] font-medium tracking-[var(--tracking-tight)]">
        {post.title}
      </h1>
      <div className="mt-10 space-y-5">
        {post.body.map((p) => (
          <p key={p} className="text-text-2 text-[length:var(--text-base)]">
            {p}
          </p>
        ))}
      </div>

      <Pagination prev={prev} next={next} />
    </main>
  );
}
