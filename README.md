# nshantha.github.io

Interactive resume for Nitesh Shantha Kumar — https://nshantha.github.io/

A single static `index.html` with no build step, so GitHub Pages serves it as-is.

## Layout

Three columns, modeled on a long-form blog post:

- **Left rail:** a tree-style table of contents with per-section read meters, a dithered progress bar, and time remaining. On phones it becomes a "Contents" drawer.
- **Main column:** the resume as an article. It has a "Read this first" summary, a "What I know" section of expandable knowledge areas, a step-through outbox diagram (Fig A), a throughput calculator (Fig B), experience, skills, projects, education, and contact.
- **Right rail:** a profile card with actions (copy email, save as PDF, GitHub, LinkedIn, copy link) and selected projects.

## Interactions

- `⌘K` / `Ctrl+K` or `/` opens a command menu to jump to sections, stories, and projects, or to run actions.
- `j` / `k` move to the next or previous section.
- Skill chips open the matching knowledge area.
- Dark mode follows the system setting, and the toggle remembers your choice.
- Printing (or "Save as PDF") uses a print stylesheet that produces a clean one-column resume.

## Editing

- **Resume content** is plain HTML in `index.html`. Each knowledge area is a `<details class="case" id="k-…">` block with a `<dl class="concepts">` list.
- The content stays generic on purpose: it shows concepts and tools, not internal work details or production numbers.
- **Projects** come from the `PROJECTS` array in the script. It keeps the same format so the automated GitHub sync still works.
- **LinkedIn:** set `LINKEDIN_URL` at the top of the script. The links stay hidden while it is empty.

The live site is served from the `gh-pages` branch. The original React + Vite + Tailwind source is preserved on the `archive/react-source` branch.
