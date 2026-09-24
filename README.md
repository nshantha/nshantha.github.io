# nshantha.github.io

Interactive resume for Nitesh Shantha Kumar — https://nshantha.github.io/

A single static `index.html` with no build step, so GitHub Pages serves it as-is.

## Layout

Three columns, modeled on a long-form blog post:

- **Left rail:** a sticky table of contents with scroll-spy highlighting and reading progress. On phones it becomes a "Contents" drawer.
- **Main column:** the resume as an article. It has a "Read this first" summary, impact tiles (Fig A), expandable case studies for each role, a step-through outbox diagram (Fig B), a backlog calculator (Fig C), skills, projects, education, and contact.
- **Right rail:** a profile card with actions (copy email, save as PDF, GitHub, LinkedIn, copy link) and selected projects.

## Interactions

- `⌘K` / `Ctrl+K` or `/` opens a command menu to jump to sections, stories, and projects, or to run actions.
- `j` / `k` move to the next or previous section.
- Skill chips highlight the case studies that use that skill.
- Dark mode follows the system setting, and the toggle remembers your choice.
- Printing (or "Save as PDF") uses a print stylesheet that produces a clean one-column resume.

## Editing

- **Resume content** is plain HTML in `index.html`. Each case study is a `<details class="case" data-skills="…">` block.
- **Projects** come from the `PROJECTS` array in the script. It keeps the same format so the automated GitHub sync still works.
- **LinkedIn:** set `LINKEDIN_URL` at the top of the script. The links stay hidden while it is empty.

The live site is served from the `gh-pages` branch. The original React + Vite + Tailwind source is preserved on the `archive/react-source` branch.
