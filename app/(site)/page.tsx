import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Experience } from "@/components/home/Experience";
import { Hero } from "@/components/home/Hero";
import { PersonJsonLd } from "@/components/home/PersonJsonLd";
import { Projects } from "@/components/home/Projects";
import { Skills } from "@/components/home/Skills";

export default function HomePage() {
  return (
    <>
      <PersonJsonLd />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </>
  );
}
