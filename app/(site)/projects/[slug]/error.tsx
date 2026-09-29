"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function CaseStudyError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section role="alert" className="container-page py-24 md:py-32 lg:py-40">
      <div className="flex max-w-[720px] flex-col gap-10">
        <SectionHeader
          as="h1"
          label="Error / Case Study"
          title="This case study could not be loaded"
          description="Something went wrong while loading this project. Try again, or browse the rest of the archive."
        />
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button onClick={() => retry()}>Try Again</Button>
          <Button href="/projects" variant="secondary">
            View Projects
          </Button>
        </div>
      </div>
    </section>
  );
}
