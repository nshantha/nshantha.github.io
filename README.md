# nshantha.github.io

Personal site of Nitesh Shantha Kumar — https://nitesh.fyi/ — built as static pages for GitHub Pages with no build step.

## Pages

- **`index.html`: the personal home page.** It has an intro with a pixelated portrait you can "enhance", a "Right now" grid, the story so far as a timeline, a GitHub timeline (one square per public repo), likes and dislikes, a bookshelf, a favourite quote, projects, and contact links.
- **`resume.html`: the resume.** It shows what I know (expandable knowledge areas), experience, how I work, skills, and education. Printing it, or "Save as PDF", gives a clean one-column resume.
- **`assets/portrait.jpg`: the photo** used by the home page.

Both pages share the same pixel look and the same blog-style layout: a tree table of contents on the left with per-section read meters, the article in the middle, and quick links on the right. On the home page, the reading progress is a pixel coffee mug that fills as you scroll.

## Interactions

- `⌘K` / `Ctrl+K` or `/` opens a command menu to jump to sections, projects, and links.
- `j` / `k` move to the next or previous section.
- Dark mode follows the system setting, and the toggle remembers your choice.

## Editing

- **Projects** live in the `PROJECTS` array in `index.html`. It keeps the same format so the automated GitHub sync still works.
- **The GitHub timeline** reads the `REPOS` array in `index.html`, where `year` is the year the repo was last updated.
- **Resume content** is plain HTML in `resume.html`. Set `LINKEDIN_URL` there to show LinkedIn links.
- The resume stays generic on purpose: it shows concepts and tools, not internal work details.

The live site is served from the `gh-pages` branch. The original React + Vite + Tailwind source is preserved on the `archive/react-source` branch.
