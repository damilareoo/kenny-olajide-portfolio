import { Fragment } from "react";

export type TextLink = { match: string; href: string };

/**
 * Prose with named things linked inline, benji-style.
 *
 * Matches are the links' own labels, longest first so "Endgame Watch" wins
 * over any shorter share. Anything unmatched stays plain text — a list that
 * renames itself never breaks the sentence around it. A name with no URL on
 * record is simply absent from the list, and renders as text.
 */
export function LinkedText({ text, links }: { text: string; links: TextLink[] }) {
  if (links.length === 0) return <>{text}</>;
  const ordered = [...links].sort((a, b) => b.match.length - a.match.length);
  const pattern = new RegExp(
    `(${ordered.map((link) => link.match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "g",
  );
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) => {
        const link = ordered.find((entry) => entry.match === part);
        return link ? (
          <a
            key={`${link.href}-${i}`}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink-3"
          >
            {part}
          </a>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        );
      })}
    </>
  );
}
