import { site } from "@/lib/site";

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  image: `${site.url}/portrait.jpeg`,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  worksFor: { "@type": "Organization", name: "Bomahut Limited" },
  homeLocation: [
    { "@type": "Place", name: "Nairobi, Kenya" },
    { "@type": "Place", name: "Cambridge, UK" },
  ],
  sameAs: [site.github, site.linkedin],
};

export function PersonJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
    />
  );
}
