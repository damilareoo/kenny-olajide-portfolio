import Link from "next/link";
import { Label } from "@/components/ui";

export const metadata = { title: "Not found" };

/**
 * A real 404, not a soft one.
 *
 * This is what Next renders for any route `dynamicParams = false` refuses —
 * see app/work/[slug]/page.tsx and app/writing/[slug]/page.tsx — and it ships
 * with the framework's 404 status code intact.
 */
export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-[60svh] w-full max-w-[1240px] flex-col items-center justify-center px-6 text-center">
      <Label>404</Label>
      <h1 className="text-text-1 mt-4 text-[length:var(--text-xl)] font-medium tracking-[var(--tracking-tight)]">
        Page not found
      </h1>
      <p className="text-text-2 mt-3 text-[length:var(--text-base)]">
        The page you&rsquo;re looking for doesn&rsquo;t exist.
      </p>
      <Link
        href="/"
        className="text-text-1 mt-8 text-[length:var(--text-sm)] underline underline-offset-4"
      >
        Back home
      </Link>
    </main>
  );
}
