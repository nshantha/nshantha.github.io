# nshantha.github.io

Personal site of Nitesh Shantha Kumar — https://nitesh.fyi/

Static pages with no build step, served by a Cloudflare Worker with static assets.

## Layout

```
site/
├── wrangler.jsonc        Worker config: assets, custom domains, D1, rate limit
├── src/worker.js         redirects to https://nitesh.fyi, security headers, /api/*
├── migrations/           D1 schema for the coffee-run leaderboard
├── tools/build-cv.mjs    regenerates the CV PDF from /cv
├── tools/check-levels.mjs proves every level's par with an exhaustive solver
└── public/               everything that gets served
    ├── index.html        home
    ├── resume.html       resume (served at /resume)
    ├── cv.html           print-first CV (served at /cv)
    ├── Nitesh-Shantha-Kumar-CV.pdf
    ├── 404.html
    ├── css/base.css      shared: colour tokens, base elements, top bar, headings
    ├── css/site.css      shared: transitions, scroll-in, terminal, game, posts, cards
    ├── js/site.js        shared: ~ terminal, command expanders, scroll-in, latest posts
    ├── js/projects.js    project data (PROJECTS) and project cards
    ├── js/bug2.js        Bug2 engine (used by the game and the Worker)
    ├── js/levels.js      coffee-run levels and scoring (shared with the Worker)
    ├── js/game.js        the coffee-run puzzle
    └── assets/portrait.jpg
```

## API

- `GET /api/scores`: the top 10 coffee-run players, by stars.
- `POST /api/scores` with `{ name, solutions: { levelId: { walls, side } } }`: the Worker re-plays every solution with the shared engine, so stars can't be faked. It limits each visitor to 5 submissions a minute, filters names, and keeps each name's best result.
- `GET /api/posts`: the latest posts from One More Layer's RSS feed, cached for an hour.
- `GET /api/github`: your repositories from GitHub, cached for an hour. It powers the repository counts in the Projects intro and adds stars and last-updated dates to project cards. Private repos are only counted per year and are never named. Private counts need a `GITHUB_TOKEN` secret (run `npx wrangler secret put GITHUB_TOKEN` with a fine-grained, read-only token); without it, only public repos are counted.

## Deploying

- **Database:** the `nitesh-fyi` D1 database already exists and is set in `wrangler.jsonc`. After adding a migration, run `npx wrangler d1 migrations apply nitesh-fyi --remote`.
- **Deploy:** run `npx wrangler deploy` from `site/`. To deploy automatically, connect the repo in Cloudflare (**Workers & Pages → Create → Import a repository**) with root directory `site` and deploy command `npx wrangler deploy`.
- **Local dev:** run `npx wrangler d1 migrations apply nitesh-fyi --local`, then `npx wrangler dev --host localhost`.
- **Levels:** edit `public/js/levels.js`, then run `node tools/check-levels.mjs` to confirm each par is right.
- **The CV:** edit `public/cv.html`, start `wrangler dev`, then run `node tools/build-cv.mjs http://localhost:8787/cv`.
- **Custom domains** are declared in `wrangler.jsonc`, so Cloudflare creates the DNS records and certificates for them. `www.nitesh.fyi` and `nitesh.onemorelayer.dev` redirect to `nitesh.fyi`.

## Pages

- **`index.html`: the personal home page.** It has an intro with a pixelated portrait you can "enhance", an Explore row (terminal and game), a "Right now" grid, the story so far, the coffee-run game, likes and dislikes, a bookshelf, a favourite quote, the latest article, featured projects, and contact links. Longer parts unfold on demand.
- **`cv.html` / the CV PDF:** a one-page, generic CV with no phone number and no internal work numbers.
- **`resume.html`: the resume.** It shows what I know (expandable knowledge areas), experience, how I work, skills, and education. Printing it, or "Save as PDF", gives a clean one-column resume.
- **`assets/portrait.jpg`: the photo** used by the home page.

Both pages share the same pixel look and the same blog-style layout: a tree table of contents on the left with per-section read meters, the article in the middle, and quick links on the right. On the home page, the reading progress is a pixel coffee mug that fills as you scroll.

## Interactions

- Each home-page section is titled like a shell comment (`# my story`) and shows its highlights. Where there's more, a runnable command follows: `cat story.md` (the full story), `./coffee-run` (the game, also at `nitesh.fyi/play`) and `ls projects --all`. Running one types it out and prints the rest underneath; running it again clears it. The `~` terminal accepts the same commands. Without JavaScript, everything is shown.

- `⌘K` / `Ctrl+K` or `/` opens a command menu to jump to sections, projects, and links.
- `j` / `k` move to the next or previous section.
- `~` opens a terminal (`help`, `whoami`, `cat story`, `play`, `cv`, `coffee` and more). Under the hero, an "Explore this site" row has two matching cards: a live terminal prompt that types example commands (you can run one right there), and the coffee-run game. There's also a **❯_ Terminal** button in the top bar, and on the resume page first-time visitors get a one-time tip.
- Every link says what it is and what happens: a type badge (Article, Game, Project, App, Newsletter, Book, Video), a preview where there is one (article covers come from the Substack feed), and an action label such as "Read the article ↗" or "View the code ↗".
- The home page has "coffee run", a Bug2 puzzle: 8 levels where you place a few walls and pick which side the robot hugs, so it collects every coffee bean. It awards stars against par and has a global leaderboard. Winning bursts beans out of the flag and brews them into a cup. Visitors find it from the Explore card under the hero, the **Play** link in the menu, the terminal, or the short link `nitesh.fyi/play`. The page also pulls the latest Substack posts.
- Pages cross-fade with View Transitions, and sections step in as you scroll (off when reduced motion is set).
- Dark mode follows the system setting, and the toggle remembers your choice.

## Editing

- **Projects** live in the `PROJECTS` array in `site/public/js/projects.js`. The first four are featured on the home page. It keeps the same format so the automated GitHub sync still works.
- **Resume content** is plain HTML in `site/public/resume.html`. Set `LINKEDIN_URL` there to show LinkedIn links.
- The resume stays generic on purpose: it shows concepts and tools, not internal work details.

The old GitHub Pages copy lives on the `gh-pages` branch. The original React + Vite + Tailwind source is preserved on the `archive/react-source` branch.
