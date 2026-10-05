// GitHub-backed portfolio data. Refresh this array from the GitHub API when repositories change.
const PROJECTS = [
  {
    name: 'Actuamind',
    url: 'https://github.com/nshantha/actuamind-archived',
    description: 'Autonomous software engineering intelligence that indexes code repositories into a Neo4j knowledge graph with vector embeddings, then serves natural-language codebase Q&A through a LangGraph agent.',
    year: '2026', language: 'Python', categories: ['ai'],
    tags: ['LangGraph', 'Neo4j', 'FastAPI', 'Streamlit']
  },
  {
    name: 'AlgoMentor',
    url: 'https://github.com/nshantha/codeviz',
    description: 'A local-first FAANG interview-prep desktop app rebuilt with Electron, React, and TypeScript. Its 171-question research-backed catalog drives an 8-week plan, evidence-sized company banks, confusable-pattern drills, and spaced reviews; system-design and behavioral workspaces cover the rest of the loop. A Socratic tutor runs through locally installed Claude Code or Codex CLIs with an offline fallback, while the XP engine rewards unaided pattern recognition, no-hint solves, and on-time reviews. Progress stays in local SQLite and nothing is uploaded.',
    year: 'Sept 2026', language: 'TypeScript', categories: ['ai'],
    tags: ['Electron', 'SQLite', 'Claude / Codex', 'Interview prep']
  },
  {
    name: 'Universal MCP Manager',
    url: 'https://github.com/nshantha/mcp-manager',
    description: 'An Electron desktop app for installing, configuring, and managing Model Context Protocol servers across Claude Code, VS Code, and Cursor.',
    year: '2025', language: 'TypeScript', categories: ['ai'],
    tags: ['Electron', 'MCP', 'React', 'Developer tools']
  },
  {
    name: 'Neo4jAI',
    url: 'https://github.com/nshantha/Neo4jAI',
    description: 'A natural-language interface to Neo4j that translates questions into Cypher through a LangGraph ReAct agent, with MCP integration, Streamlit chat, and automatic query retry.',
    year: '2025', language: 'Python', categories: ['ai'],
    tags: ['MCP', 'Cypher', 'LangGraph', 'Neo4j']
  },
  {
    name: 'SqlAI',
    url: 'https://github.com/nshantha/SqlAI',
    description: 'A chat application for answering natural-language questions over PostgreSQL, using FastAPI, Claude, and an MCP server for controlled database access.',
    year: '2025', language: 'Python', categories: ['ai'],
    tags: ['Claude', 'PostgreSQL', 'MCP', 'FastAPI']
  },
  {
    name: 'Gradle Dependency Upgrader',
    url: 'https://github.com/nshantha/dependency-upgrade-ai',
    description: 'An AI tool that parses build.gradle files, checks Maven Central, upgrades dependencies to the latest safe minor versions, and verifies the resulting build.',
    year: '2025', language: 'Python', categories: ['ai'],
    tags: ['Gradle', 'Maven Central', 'Automation', 'Python']
  },
  {
    name: 'Research Paper Assistant',
    url: 'https://github.com/nshantha/ai_research_assistant',
    description: 'A Streamlit research companion for understanding papers through PDF analysis, equation breakdowns, and contextual question answering.',
    year: '2025', language: 'Python', categories: ['ai'],
    tags: ['Research', 'PDF analysis', 'Q&A', 'Streamlit']
  },
  {
    name: 'RecipeAI',
    url: 'https://github.com/nshantha/RecipeAI',
    description: 'A full-stack recipe experience that browses cooking videos by cuisine, extracts structured recipes, and generates custom recipes with OpenAI.',
    year: '2025', language: 'JavaScript', categories: ['ai'],
    tags: ['React', 'Node.js', 'MongoDB', 'OpenAI']
  },
  {
    name: 'FireBot',
    url: 'https://github.com/nshantha/FireBot',
    description: 'A ROS-based firefighting robot built with TurtleBot and a manipulator arm—part of my university robotics work.',
    year: 'University work', language: 'Python', categories: ['robotics'],
    tags: ['ROS', 'TurtleBot', 'Manipulation', 'Robotics']
  },
  {
    name: 'BUG2',
    url: 'https://github.com/nshantha/BUG2',
    description: 'An implementation of the BUG2 robot motion-planning algorithm and the most-starred repository in my GitHub portfolio.',
    year: 'University work', language: 'Python', categories: ['robotics'],
    tags: ['Motion planning', 'Navigation', 'Algorithms', 'Python']
  }
];

// Renders projects wherever the page asks for them:
//   #projectsFeatured  the first few, as cards
//   #projectList       the rest, revealed by `ls projects --all`
//   #repoSummary       a live line of repository counts from /api/github
(() => {
  const esc = (v) => String(v).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c]);
  const firstSentence = (s) => (s.match(/^.*?[.!?](\s|$)/) || [s])[0].trim();
  let github = null;

  function liveMeta(p) {
    const repo = github && github.repos.find((r) => r.url.toLowerCase() === p.url.replace(/\/$/, '').toLowerCase());
    if (!repo) return '';
    const days = Math.floor((Date.now() - new Date(repo.pushed)) / 86400000);
    const ago = days < 1 ? 'today' : days < 30 ? `${days}d ago` : days < 365 ? `${Math.floor(days / 30)}mo ago` : `${Math.floor(days / 365)}y ago`;
    return `updated ${ago}${repo.stars ? ` · ★ ${repo.stars}` : ''}`;
  }
  const card = (p) => `
    <a class="pcard" href="${esc(p.url)}" target="_blank" rel="noreferrer">
      <span class="meta-row"><span class="kind kind-project">&lt;/&gt; Project</span><small>${esc(p.language)} · ${esc(p.year)}</small></span>
      <b>${esc(p.name)}</b>
      <span class="desc">${esc(firstSentence(p.description))}</span>
      <span class="pcard-foot"><small>${liveMeta(p)}</small><span class="cta">View the code ↗</span></span>
    </a>`;

  function render() {
    const featured = document.getElementById('projectsFeatured');
    const shown = featured ? Number(featured.dataset.count) || 4 : 0;
    if (featured) featured.innerHTML = PROJECTS.slice(0, shown).map(card).join('');
    // #projectList holds the projects not already featured.
    const list = document.getElementById('projectList');
    if (list) list.innerHTML = PROJECTS.slice(shown).map(card).join('');
    const more = document.querySelector('[data-cmd-target="projectList"] .cmd-hint');
    if (more && !more.closest('[aria-expanded="true"]')) more.textContent = `show ${PROJECTS.length - shown} more ↓`;
  }
  render();

  const summary = document.getElementById('repoSummary');
  fetch('/api/github').then((r) => (r.ok ? r.json() : Promise.reject(r.status))).then((gh) => {
    github = gh;
    render();
    if (!summary) return;
    // Private repos are only mentioned when the Worker has a token to count them.
    summary.textContent = gh.includesPrivate
      ? `${PROJECTS.length} highlights from ${gh.total} repositories: ${gh.public} public, plus ${gh.private} private ideas in progress.`
      : `${PROJECTS.length} highlights from my ${gh.public} public repositories.`;
  }).catch(() => { /* keep the static text */ });
})();
