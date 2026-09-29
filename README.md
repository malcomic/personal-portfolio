# Malcom — Personal Portfolio

Source for [malcomrono.site](https://malcomrono.site): a dark, engineering-styled portfolio built with Next.js (App Router), React and Tailwind CSS v4, deployed on Vercel.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint
npm run typecheck
npm test        # unit tests
npm run test:e2e  # end-to-end tests (needs a Neon test branch, see docs/testing.md)
```

Testing and CI setup: [docs/testing.md](docs/testing.md).

## Editing content

All text lives in plain TypeScript data files, so most updates never touch a component.

| What | File |
| --- | --- |
| Name, role, email, social links, domain | `lib/site.ts` |
| Home hero, profile, contact intro | `lib/data/home.ts` |
| Skills | `lib/data/skills.ts` |
| Experience and education | `lib/data/experience.ts` |
| Projects and case studies | `lib/data/projects.ts` |
| About page | `lib/data/about.ts` |
| Contact page and project types | `lib/data/contact.ts` |

- **Screenshots:** add the image to `public/` and set `image: "/your-file.png"` next to the matching `caption` in `lib/data/projects.ts`.
- **Case-study links:** set `liveUrl` and `repoUrl` on a project to show the "Visit Live Site" and "GitHub Repository" buttons.
- **Drafts:** case studies with `draft: true` show a "DRAFT" label in development only.
- **CV and portrait:** replace `public/cv.pdf` and `public/portrait.jpeg`.

## Deploying

Every push to `main` deploys automatically on Vercel.
