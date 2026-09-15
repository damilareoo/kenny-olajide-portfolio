import type { Metadata } from "next";
import { FooterLine } from "@/components/footer-line";
import { RoleList } from "@/components/role-list";
import { SiteNav } from "@/components/site-nav";
import { roles } from "@/data/experience";

export const metadata: Metadata = {
  title: "About",
  description: "Kenny Olajide — product designer working on chess software.",
};

/**
 * Stage A placeholder.
 *
 * The record, the portrait and the prose around them are Stage B. The role
 * ladder is here because `components/role-list.tsx` is part of what this
 * commit ports and a component nothing renders is a component nothing checks.
 */
export default function About() {
  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col px-5 py-4 sm:px-6">
      <SiteNav current="/about" />
      <div className="mt-10">
        <RoleList roles={roles} />
      </div>
      <div className="flex-1" />
      <div className="mt-16">
        <FooterLine />
      </div>
    </main>
  );
}
