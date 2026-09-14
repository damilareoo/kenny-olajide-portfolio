import { roles } from "@/data/experience";
import { Reveal } from "./reveal";
import { STAGGER } from "@/lib/motion";

/**
 * The role history as a dense labelled index, not a card grid.
 *
 * Years left in `.label`'s own step (`--text-2xs`, uppercase, `--tracking-label`);
 * role and company right at `--text-sm`; one hairline between rows using
 * `--border` — RecordRow's own border-b, reused rather than redrawn, since it
 * is the one separator this site allows and it is not to be developed into a
 * ruler, a tick, or any other measuring device.
 *
 * `roles` is read straight from data/experience.ts and rendered in the order
 * that file already carries — most recent first — with nothing hardcoded
 * about how many rows there are. This is where the chess narrative lands: he
 * taught chess, then edited chess courses, then chess e-books, and only then
 * designed a chess product.
 */
export function Ladder() {
  return (
    <ol>
      {roles.map((r, i) => (
        <Reveal key={`${r.company}-${r.from}`} delay={i * STAGGER}>
          <li className="border-border flex items-baseline justify-between gap-6 border-b py-4">
            <span className="label shrink-0">
              {r.from}–{r.to}
            </span>
            <span className="text-text-1 text-right text-[length:var(--text-sm)]">
              {r.role}, {r.company}
            </span>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
