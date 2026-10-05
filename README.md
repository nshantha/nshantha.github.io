# nshantha.github.io

Personal site of Nitesh Shantha Kumar — https://nitesh.fyi/

Static pages with no build step, served by a Cloudflare Worker with static assets.

## Layout

```
site/
├── wrangler.jsonc        Worker config: assets, custom domains, D1, rate limit
├── src/worker.js         redirects to https://nitesh.fyi, security headers, /api/*
├── migrations/           D1 schema for the Bug2 leaderboard
├── tools/build-cv.mjs    regenerates the CV PDF from /cv
└── public/               everything that gets served
    ├── index.html        home
    ├── resume.html       resume (served at /resume)
    ├── cv.html           print-first CV (served at /cv)
    ├── Nitesh-Shantha-Kumar-CV.pdf
    ├── 404.html
    ├── css/site.css      shared: transitions, scroll-in, terminal, game, posts
    ├── js/site.js        shared: ~ terminal, scroll-in, latest posts
    ├── js/bug2.js        Bug2 engine (used by the game and the Worker)
    ├── js/game.js        the "outsmart my robot" game
    └── assets/portrait.jpg
```

## API

- `GET /api/scores`: the top 10 Bug2 mazes.
- `POST /api/scores` with `{ name, walls }`: the Worker re-runs Bug2 on the maze, so scores can't be faked. It limits each visitor to 5 submissions a minute, filters names, and lets each maze appear on the board only once.
- `GET /api/posts`: the latest posts from One More Layer's RSS feed, cached for an hour.

## Deploying

- **First time only:** run `npx wrangler d1 create nitesh-fyi` and paste the `database_id` into `wrangler.jsonc`. Then run `npx wrangler d1 migrations apply nitesh-fyi --remote`.
- **Deploy:** run `npx wrangler deploy` from `site/`. To deploy automatically, connect the repo in Cloudflare (**Workers & Pages → Create → Import a repository**) with root directory `site` and deploy command `npx wrangler deploy`.
- **Local dev:** run `npx wrangler d1 migrations apply nitesh-fyi --local`, then `npx wrangler dev --host localhost`.
- **The CV:** edit `public/cv.html`, start `wrangler dev`, then run `node tools/build-cv.mjs http://localhost:8787/cv`.
- **Custom domains** are declared in `wrangler.jsonc`, so Cloudflare creates the DNS records and certificates for them. `www.nitesh.fyi` and `nitesh.onemorelayer.dev` redirect to `nitesh.fyi`.

## Pages

- **`index.html`: the personal home page.** It has an intro with a pixelated portrait you can "enhance", a "Right now" grid, the story so far as a timeline, a GitHub timeline (one square per public repo), likes and dislikes, a bookshelf, a favourite quote, projects, and contact links.
- **`cv.html` / the CV PDF:** a one-page, generic CV with no phone number and no internal work numbers.
- **`resume.html`: the resume.** It shows what I know (expandable knowledge areas), experience, how I work, skills, and education. Printing it, or "Save as PDF", gives a clean one-column resume.
- **`assets/portrait.jpg`: the photo** used by the home page.

Both pages share the same pixel look and the same blog-style layout: a tree table of contents on the left with per-section read meters, the article in the middle, and quick links on the right. On the home page, the reading progress is a pixel coffee mug that fills as you scroll.

## Interactions

- `⌘K` / `Ctrl+K` or `/` opens a command menu to jump to sections, projects, and links.
- `j` / `k` move to the next or previous section.
- `~` opens a terminal (`help`, `whoami`, `cat story`, `play`, `cv`, `coffee` and more).
- The home page has a Bug2 game with a global leaderboard, and pulls the latest Substack posts.
- Pages cross-fade with View Transitions, and sections step in as you scroll (off when reduced motion is set).
- Dark mode follows the system setting, and the toggle remembers your choice.

## Editing

- **Projects** live in the `PROJECTS` array in `site/public/index.html`. It keeps the same format so the automated GitHub sync still works.
- **The GitHub timeline** reads the `REPOS` array in `site/public/index.html`, where `year` is the year the repo was last updated.
- **Resume content** is plain HTML in `site/public/resume.html`. Set `LINKEDIN_URL` there to show LinkedIn links.
- The resume stays generic on purpose: it shows concepts and tools, not internal work details.

The old GitHub Pages copy lives on the `gh-pages` branch. The original React + Vite + Tailwind source is preserved on the `archive/react-source` branch.
