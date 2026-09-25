import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { DirectChannels } from "@/components/contact/DirectChannels";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { contactPage } from "@/lib/data/contact";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: contactPage.intro,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section
      aria-labelledby="contact-heading"
      className="container-page grid gap-10 pt-16 pb-16 md:gap-12 md:pt-20 md:pb-24 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-x-12 lg:pt-[100px] lg:pb-[120px] xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-x-20"
    >
      <Reveal>
        <SectionHeader
          as="h1"
          id="contact-heading"
          label={contactPage.label}
          title={contactPage.title}
          description={contactPage.intro}
        />
      </Reveal>

      <Reveal delay={100} className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <DirectChannels />
      </Reveal>

      <Reveal delay={150} className="min-w-0">
        <ContactForm variant="full" />
      </Reveal>
    </section>
  );
}
