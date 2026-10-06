// Shared by every page: the ~ terminal, scroll-in animations, and the latest posts.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (v) => String(v).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c]);
  const onHome = !!document.getElementById('hello');

  // ---- Scroll-in animations ----------------------------------------------------
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const targets = $$('section.chapter > *, .story li, .now > *, .likes > div, .book, .ba-row');
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    targets.forEach((el) => {
      // Anything already on screen stays put; only things below the fold animate in.
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  // ---- Runnable commands: where a section has more to show ---------------------------
  // <button data-cmd-target="id"> shows a command. Running it types the command out and
  // prints the output (#id gets .is-open); running it again clears it.
  const typeOut = (code, text, done) => {
    if (reduceMotion) { code.textContent = text; return done(); }
    let n = 0;
    code.classList.add('typing');
    const tick = setInterval(() => {
      code.textContent = text.slice(0, ++n);
      if (n >= text.length) { clearInterval(tick); code.classList.remove('typing'); done(); }
    }, 26);
  };
  const expanders = new Map();
  $$('[data-cmd-target]').forEach((btn) => {
    const target = document.getElementById(btn.dataset.cmdTarget);
    if (!target) return;
    expanders.set(target.id, { btn, target, code: $('.cmd-text', btn), hint: $('.cmd-hint', btn) });
    btn.addEventListener('click', () => setOpen(target.id, !target.classList.contains('is-open')));
  });
  function setOpen(id, open) {
    const e = expanders.get(id);
    if (!e || e.typing || e.target.classList.contains('is-open') === open) return;
    const finish = () => {
      e.typing = false;
      e.target.classList.toggle('is-open', open);
      e.btn.setAttribute('aria-expanded', String(open));
      if (open) { e.closedHint = e.hint.textContent; e.hint.textContent = e.btn.dataset.hintOpen || 'clear ↵'; }
      else if (e.closedHint) e.hint.textContent = e.closedHint;
    };
    if (!open) return finish();
    e.typing = true;
    typeOut(e.code, e.code.dataset.cmd, finish);
  }
  function openAndShow(id) {
    const e = expanders.get(id);
    if (!e) return false;
    setOpen(id, true);
    (e.btn.closest('section') || e.btn).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    return true;
  }
  $$('[data-open]').forEach((a) => a.addEventListener('click', () => setOpen(a.dataset.open, true)));
  if (location.hash === '#play') setOpen('playOut', true);
  window.openSection = openAndShow;

  // ---- Latest posts from One More Layer -------------------------------------------
  const postList = $('#postList');
  if (postList) {
    fetch('/api/posts').then((r) => (r.ok ? r.json() : Promise.reject(r.status))).then(({ posts }) => {
      if (!posts || !posts.length) return;
      const fmt = (d) => d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
      postList.innerHTML = posts.map((p) => `
        <a class="post${p.image ? '' : ' no-cover'}" href="${esc(p.url)}" target="_blank" rel="noreferrer">
          ${p.image ? `<img class="post-cover" src="${esc(p.image)}" alt="" loading="lazy">` : ''}
          <span class="post-body">
            <span class="meta-row"><span class="kind kind-article">¶ Article</span><small>One More Layer · ${esc(fmt(p.date))}</small></span>
            <b>${esc(p.title)}</b>
            <span class="desc">${esc(p.description)}</span>
            <span class="cta">Read the article ↗</span>
          </span>
        </a>`).join('');
    }).catch(() => { /* keep the static fallback */ });
  }

  // ---- Terminal -----------------------------------------------------------------
  const LINKS = {
    x: 'https://x.com/nitesh_aradhya', twitter: 'https://x.com/nitesh_aradhya',
    github: 'https://github.com/nshantha/', substack: 'https://onemorelayer.dev/', blog: 'https://onemorelayer.dev/',
    hushy: 'https://tryhushy.com/', resume: '/resume', cv: '/Nitesh-Shantha-Kumar-CV.pdf', home: '/'
  };
  const SECTIONS = ['hello', 'now', 'story', 'play', 'likes', 'why', 'writing', 'projects', 'elsewhere'];
  const TEXT = {
    story: [
      'bangalore   loved electronics; built a color-sorting robot, line followers, Bug2 bots',
      '2016-2019   avionics: software for an electronic engine controller. too slow for me.',
      '2017        Andrej Karpathy’s lectures. hooked on machine learning.',
      '2019-2021   M.S. Robotics, University at Buffalo. self-driving cars.',
      '2021-now    Nordstrom: high-traffic systems for millions of customers.',
      '2025        MCP servers from scratch; long-running agents before it was cool.',
      'now         building Hushy, a dictation and voice assistant app.'
    ],
    now: ['building   Hushy', 'writing    One More Layer', 'reading    Hamnet', 'drinking   coffee', 'at home    a 5-month-old'],
    likes: ['+ the process of building', '+ new systems, early', '+ coffee (the grinding!)', '+ sunsets and walks with family', '+ books', '- a slow pace', '- oranges in coffee. never.'],
    quote: ['"For anything to be good, truly good, there must be love in it."', '  — Theo of Golden']
  };
  const COFFEE = [
    '      ( (',
    '       ) )',
    '    ........',
    '    |      |]',
    '    \\      /',
    '     `----\'',
    'brewing... ☕ done. the grind is the best part.'
  ];
  const HELP = [
    'commands:',
    '  whoami            who is this guy',
    '  ls [projects]     list sections, or my projects',
    '  cat <file>        story · now · likes · quote',
    '  cd <section>      jump to a section' + (onHome ? '' : ' (on the home page)'),
    '  open <link>       x · github · substack · hushy · resume · cv',
    '  play              play the coffee-run robot game',
    'on the home page these run right there:',
    '  cat story.md · ./coffee-run · ls projects',
    '  cv                download my CV',
    '  coffee            make a cup',
    '  theme             toggle dark mode',
    '  clear · history · exit'
  ];

  let term, out, input, history = [], hIndex = 0;
  function build() {
    term = document.createElement('div');
    term.className = 'term';
    term.setAttribute('role', 'dialog');
    term.setAttribute('aria-label', 'Terminal');
    term.innerHTML = `
      <div class="term-bar"><span>nitesh@fyi: ~</span><button type="button" class="term-close" aria-label="Close terminal">×</button></div>
      <div class="term-out" aria-live="polite"></div>
      <label class="term-line"><span class="term-prompt">❯</span><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Terminal command"></label>`;
    document.body.appendChild(term);
    out = $('.term-out', term);
    input = $('input', term);
    $('.term-close', term).addEventListener('click', close);
    input.addEventListener('keydown', onKey);
    print(['welcome to nitesh.fyi. type `help` to get started.'], 'dim');
  }
  function print(lines, cls = '') {
    for (const line of [].concat(lines)) {
      const div = document.createElement('div');
      if (cls) div.className = cls;
      div.textContent = line;
      out.appendChild(div);
    }
    out.scrollTop = out.scrollHeight;
  }
  function open() {
    if (!term) { build(); term.getBoundingClientRect(); } // let the slide-in transition run the first time
    term.classList.add('open');
    setTimeout(() => input.focus(), 30); // focus once the panel is visible
  }
  function close() { if (!term) return; term.classList.remove('open'); input.blur(); }
  const go = (url) => { if (url.startsWith('http')) window.open(url, '_blank', 'noreferrer'); else location.href = url; };
  const scrollTo = (id) => { const el = document.getElementById(id); if (el) { close(); el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); } };

  function run(raw) {
    const line = raw.trim();
    print(`❯ ${line}`, 'cmd');
    if (!line) return;
    history.push(line); hIndex = history.length;
    // The section commands on the home page: run them here and the page follows.
    const PAGE = {
      'cat story.md': ['storyList', true], './coffee-run': ['playOut', true], 'ls projects': ['projectsOut', true], 'ls projects --all': ['projectsOut', true]
    };
    const JUMPS = { 'cat now.txt': 'now', 'cat likes.txt': 'likes', 'cat why.md': 'why', 'ls posts': 'writing', 'head story.md': 'story' };
    const jump = onHome && JUMPS[line.toLowerCase().replace(/\s+/g, ' ')];
    if (jump) { print(`→ ${jump}`, 'dim'); close(); document.getElementById(jump).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); return; }
    const pageCmd = PAGE[line.toLowerCase().replace(/\s+/g, ' ')];
    if (pageCmd) {
      const [id, open] = pageCmd;
      if (!onHome) { go('/#' + { storyList: 'story', playOut: 'play', projectsOut: 'projects' }[id]); return; }
      print(open ? 'unfolding it on the page…' : 'folding it up…', 'dim'); close();
      if (open) openAndShow(id); else { setOpen(id, false); document.getElementById(id).closest('section').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }
      return;
    }
    const [cmd, ...args] = line.split(/\s+/);
    const arg = (args[0] || '').toLowerCase();
    switch (cmd.toLowerCase()) {
      case 'help': case '?': return print(HELP);
      case 'whoami': return print(['nitesh shantha kumar — curious engineer, bangalore → seattle.', 'in love with the process of building.']);
      case 'ls':
        if (arg === 'projects') {
          if (typeof PROJECTS === 'undefined') return print('projects live on the home page. try `open home`.');
          return print(PROJECTS.map((p) => `${p.name.padEnd(26)} ${p.language}`));
        }
        return print(onHome ? SECTIONS.join('  ') : 'story.txt  now.txt  likes.txt  quote.txt  — or `open home`');
      case 'cat':
        if (TEXT[arg.replace(/\.txt$/, '')]) return print(TEXT[arg.replace(/\.txt$/, '')]);
        return print(`cat: ${arg || '(nothing)'}: no such file. try story, now, likes or quote.`, 'err');
      case 'cd':
        if (!onHome) { go('/' + (arg ? '#' + arg : '')); return; }
        if (SECTIONS.includes(arg)) return scrollTo(arg);
        return print(`cd: ${arg || '(nowhere)'}: try one of ${SECTIONS.join(', ')}`, 'err');
      case 'open':
        if (LINKS[arg]) { print(`opening ${arg}…`, 'dim'); return go(LINKS[arg]); }
        return print(`open: ${arg || '(nothing)'}: try ${Object.keys(LINKS).join(', ')}`, 'err');
      case 'play': if (onHome) { close(); openAndShow('playOut'); return; } return go('/play');
      case 'cv': case 'resume.pdf': print('downloading CV…', 'dim'); return go(LINKS.cv);
      case 'coffee': return print(COFFEE);
      case 'theme': document.getElementById('themeToggle')?.click(); return print('theme toggled.', 'dim');
      case 'date': return print(new Date().toString());
      case 'echo': return print(args.join(' '));
      case 'history': return print(history.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`));
      case 'clear': out.innerHTML = ''; return;
      case 'exit': case 'quit': return close();
      case 'sudo': return print('nice try. this incident will be reported (to my coffee).', 'err');
      case 'rm': return print('rm: refusing. i like this website.', 'err');
      case 'hushy': print('opening hushy…', 'dim'); return go(LINKS.hushy);
      default: return print(`${cmd}: command not found. type \`help\`.`, 'err');
    }
  }
  const COMPLETIONS = ['cat story.md', './coffee-run', 'help', 'whoami', 'ls', 'ls projects', 'cat story', 'cat now', 'cat likes', 'cat quote', 'open x', 'open github', 'open substack', 'open hushy', 'open resume', 'open cv', 'play', 'cv', 'coffee', 'theme', 'clear', 'history', 'exit', ...SECTIONS.map((s) => 'cd ' + s)];
  function onKey(e) {
    if (e.key === 'Enter') { run(input.value); input.value = ''; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hIndex > 0) input.value = history[--hIndex]; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); hIndex = Math.min(history.length, hIndex + 1); input.value = history[hIndex] || ''; }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const matches = COMPLETIONS.filter((c) => c.startsWith(input.value.toLowerCase()));
      if (matches.length === 1) input.value = matches[0] + ' ';
      else if (matches.length) print(matches.join('  '), 'dim');
    } else if (e.key === 'Escape') close();
  }
  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if ((e.key === '`' || e.key === '~') && !typing && !e.metaKey && !e.ctrlKey) { e.preventDefault(); term?.classList.contains('open') ? close() : open(); }
  });
  $$('[data-terminal]').forEach((b) => b.addEventListener('click', open));

  // The prompt in the hero: types example commands by itself, and runs what you type
  // in the full terminal.
  const heroTerm = $('#heroTerm');
  if (heroTerm) {
    const field = $('input', heroTerm);
    heroTerm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cmd = field.value.trim() || current();
      field.value = '';
      open();
      run(cmd);
    });
    const examples = ['whoami', 'cat story', 'play', 'coffee', 'ls projects', 'help'];
    let i = 0;
    const current = () => examples[i % examples.length];
    // Focusing shows the whole example, so Enter on an empty prompt runs it.
    field.addEventListener('focus', () => { field.placeholder = current(); });
    if (!reduceMotion) {
      let ch = 0, deleting = false;
      setInterval(() => {
        if (document.activeElement === field || field.value) return;
        const word = current();
        if (!deleting) { ch++; if (ch > word.length + 12) deleting = true; }
        else { ch--; if (ch <= 0) { deleting = false; i++; ch = 0; } }
        field.placeholder = word.slice(0, Math.min(ch, word.length)) + (Math.min(ch, word.length) < word.length || Math.floor(Date.now() / 400) % 2 ? '▌' : ' ');
      }, 110);
    }
  }

  // Tell first-time visitors the terminal exists, once, after they start scrolling.
  const seen = (() => { try { return localStorage.getItem('term-hint') === '1'; } catch (e) { return true; } })();
  if (!seen && !document.getElementById('heroTerm')) {
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.6) return;
      window.removeEventListener('scroll', onScroll);
      try { localStorage.setItem('term-hint', '1'); } catch (e) {}
      const hint = document.createElement('button');
      hint.type = 'button';
      hint.className = 'term-hint';
      const touch = window.matchMedia('(pointer: coarse)').matches;
      hint.innerHTML = `<span class="ico" aria-hidden="true">❯_</span><span class="txt">${touch
        ? 'Tip: this site has a terminal. Tap here, or the ❯_ button up top, to explore it.'
        : 'Tip: press <kbd>~</kbd> anywhere, or click here, to explore this site from a terminal.'}</span>`;
      hint.addEventListener('click', () => { hint.remove(); open(); });
      document.body.appendChild(hint);
      requestAnimationFrame(() => hint.classList.add('show'));
      setTimeout(() => { hint.classList.remove('show'); setTimeout(() => hint.remove(), 400); }, 7000);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  window.openTerminal = open;
})();
