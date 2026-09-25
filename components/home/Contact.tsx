import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { contact } from "@/lib/data/home";
import { contactLinks, site } from "@/lib/site";
import { ContactForm } from "@/components/contact/ContactForm";

export function Contact() {
  return (
    <section id="contact" aria-label="Contact" className="scroll-mt-16 bg-bg lg:scroll-mt-20">
      <div className="container-page flex flex-col gap-12 py-16 md:py-20 lg:flex-row lg:gap-20 lg:pt-20 lg:pb-[120px]">
        <Reveal className="flex flex-col gap-8 lg:w-[500px] lg:shrink-0">
          <SectionHeader label={contact.label} title={contact.title} description={contact.intro} />

          <ul className="flex flex-col gap-4">
            {contactLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  aria-label={`${link.label}: ${link.display}`}
                  className="inline-flex items-center gap-3 font-mono text-[14px] break-all text-text transition-colors duration-200 hover:text-accent-text active:text-accent-hover md:text-[15px]"
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <Icon name={link.icon} />
                  {link.display}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-start gap-2">
            <p className="font-mono text-[14px] text-muted">{contact.resumePrompt}</p>
            <Button href={site.cv} external variant="secondary">
              Download Resume
            </Button>
          </div>
        </Reveal>

        <Reveal delay={100} className="min-w-0 flex-1">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
