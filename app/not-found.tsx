import type { Metadata } from "next";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <SiteChrome>
      <section aria-labelledby="not-found-heading" className="container-page py-24 md:py-32 lg:py-40">
        <div className="flex max-w-[720px] flex-col gap-10">
          <SectionHeader
            as="h1"
            id="not-found-heading"
            label="404 / Not Found"
            title="Route Not Found"
            description="The page you requested doesn't exist or has moved. Head back home or browse the project archive."
          />
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button href="/">Back to Home</Button>
            <Button href="/projects" variant="secondary">
              View Projects
            </Button>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
