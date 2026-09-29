import type { Metadata } from "next";
import { AboutIntro } from "@/components/about/AboutIntro";
import { Portrait } from "@/components/about/Portrait";
import { ProgressCard } from "@/components/about/ProgressCard";
import { Reveal } from "@/components/ui/Reveal";
import { aboutPage } from "@/lib/data/about";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: aboutPage.description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <section
      aria-labelledby="about-heading"
      className="container-page flex flex-col gap-12 pt-16 pb-16 md:pt-20 lg:flex-row lg:items-start lg:gap-12 lg:pt-[100px] lg:pb-20 xl:gap-20"
    >
      <AboutIntro />

      <div className="flex flex-col gap-10 md:gap-12 lg:w-[380px] lg:shrink-0 xl:w-[480px]">
        <Reveal delay={100}>
          <Portrait />
        </Reveal>
        <Reveal delay={150}>
          <ProgressCard />
        </Reveal>
      </div>
    </section>
  );
}
