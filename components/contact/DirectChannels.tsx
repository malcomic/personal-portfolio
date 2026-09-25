import { Icon } from "@/components/ui/Icon";
import { contactPage } from "@/lib/data/contact";
import { contactLinks } from "@/lib/site";

export function DirectChannels() {
  return (
    <div className="flex flex-col gap-8 lg:gap-12">
      <section
        aria-labelledby="channels-heading"
        className="flex flex-col gap-6 rounded-[4px] border border-border bg-surface p-6 md:p-10"
      >
        <h2 id="channels-heading" className="font-display text-[22px] font-extrabold text-text md:text-[24px]">
          {contactPage.channelsTitle}
        </h2>
        <ul className="flex flex-col gap-5">
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
      </section>

      <div className="flex flex-col gap-5 text-muted">
        <p className="font-mono text-[12px]">{contactPage.timezone}</p>
        <p className="text-[14px] leading-[1.5]">{contactPage.availability}</p>
      </div>
    </div>
  );
}
