import "server-only";
import { revalidatePath } from "next/cache";

// Every case study shows its neighbours in the pager, so one edit can change any of them.
export function revalidateProjects() {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/projects/[slug]", "layout");
  revalidatePath("/sitemap.xml");
}
