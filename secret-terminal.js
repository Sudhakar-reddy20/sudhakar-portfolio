(() => {
  'use strict';

  const root = document.documentElement;
  const HOME = '/home/kali';
  const FLAGS = {
    flag1: 'FLAG{ls_minus_a_shows_the_hidden}',
    flag2: 'FLAG{base64_is_not_encryption}',
    flag3: 'FLAG{ports_talk_back}',
  };
  const TOTAL = Object.keys(FLAGS).length;
  const KEY = 'sr-ctf-found';
  const CONTACT = [
    'Hire the operator',
    '  email     onteddusudhakarreddy20@gmail.com',
    '  linkedin  sudhakar-reddy1920',
    '  github    Sudhakar-reddy20',
  ];

  /* ---------- Virtual file system ---------- */
  const files = {};
  files[HOME + '/README.txt'] = 'Operator, this box is the portfolio itself.\nThree flags are hidden in it. Type help to start.';
  files[HOME + '/projects/threatlens.md'] = 'threatlens: evidence-driven Python SOC log analysis and SSH threat detection.';
  files[HOME + '/projects/cems.md'] = 'College Event Management System: Flask, SQLite, role-based access.';
  files[HOME + '/.flag1'] = FLAGS.flag1;
  files[HOME + '/.flag2.enc'] = btoa(FLAGS.flag2);

  /* ---------- Progress (saved per visitor, if the browser allows it) ---------- */
  const loadFound = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
      return new Set(Array.isArray(saved) ? saved : []);
    } catch (err) {
      return new Set();
    }
  };

  const found = loadFound();

  const saveFound = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify([...found]));
    } catch (err) {
      /* storage blocked: progress lasts for this visit only */
    }
  };

  const state = { cwd: HOME, history: [], hIdx: 0 };

  const allFiles = () => {
    const merged = Object.assign({}, files);
    if (found.size === TOTAL) {
      merged[HOME + '/contact.txt'] = CONTACT.join('\n');
    }
    return merged;
  };

  const normalise = (path) => {
    const parts = [];
    path.split('/').forEach((part) => {
      if (!part || part === '.') return;
      if (part === '..') parts.pop();
      else parts.push(part);
    });
    return '/' + parts.join('/');
  };

  const resolvePath = (name) => {
    if (!name || name === '~') return HOME;
    if (name.startsWith('~/')) return normalise(HOME + name.slice(1));
    if (name.startsWith('/')) return normalise(name);
    return normalise(state.cwd + '/' + name);
  };

  const isDir = (dir) => {
    if (dir === '/') return true;
    const prefix = dir + '/';
    return Object.keys(allFiles()).some((path) => path.startsWith(prefix));
  };

  const listDir = (dir, showAll) => {
    const prefix = dir === '/' ? '/' : dir + '/';
    const names = new Set();
    Object.keys(allFiles()).forEach((path) => {
      if (!path.startsWith(prefix)) return;
      const rest = path.slice(prefix.length).split('/');
      names.add(rest.length > 1 ? rest[0] + '/' : rest[0]);
    });
    const list = [...names].filter((n) => showAll || !n.startsWith('.')).sort();
    return showAll ? ['.', '..', ...list] : list;
  };

  /* ---------- Commands ---------- */
  const commands = {
    help: () => [
      'Commands:',
      '  help            show this list',
      '  ls [-a]         list files, -a also shows hidden ones',
      '  cat FILE        print a file',
      '  cd DIR          change directory',
      '  pwd, whoami     where am I, who am I',
      '  uname -a        system info',
      '  hint            a nudge when you are stuck',
      '  score           flags captured so far',
      '  reset           clear saved progress',
      '  clear, exit     tidy up, or leave',
    ],
    hint: () => ['Hint: this portfolio is the target. Ctrl+U shows its source, and the source is fair game.'],
    whoami: () => ['kali'],
    pwd: () => [state.cwd],
    uname: () => ['Linux portfolio 6.8.0-kali x86_64 GNU/Linux'],
    echo: (args) => [args.join(' ')],
    sudo: () => ['kali is not in the sudoers file. This incident will be reported.'],
    score: () => ['Flags captured: ' + found.size + '/' + TOTAL],
    reset: () => {
      found.clear();
      saveFound();
      return ['Progress reset. The flags are waiting again.'];
    },
    cd: (args) => {
      const target = args[0] ? resolvePath(args[0]) : HOME;
      if (!isDir(target)) return ['cd: no such directory: ' + (args[0] || '~')];
      state.cwd = target;
      return [];
    },
    ls: (args) => {
      const showAll = args.some((a) => a.startsWith('-') && a.includes('a'));
      const dirArg = args.find((a) => !a.startsWith('-'));
      const target = dirArg ? resolvePath(dirArg) : state.cwd;
      if (!isDir(target)) return ["ls: cannot access '" + dirArg + "': No such file or directory"];
      return [listDir(target, showAll).join('  ') || '(empty)'];
    },
    cat: (args) => {
      if (!args.length) return ['cat: missing file operand'];
      const content = allFiles()[resolvePath(args[0])];
      if (content === undefined) return ['cat: ' + args[0] + ': No such file or directory'];
      return content.split('\n');
    },
    base64: (args) => {
      if (args[0] !== '-d' && args[0] !== '--decode') return ['usage: base64 -d FILE'];
      if (!args[1]) return ['base64: missing file operand'];
      const content = allFiles()[resolvePath(args[1])];
      if (content === undefined) return ['base64: ' + args[1] + ': No such file or directory'];
      try {
        const bytes = Uint8Array.from(atob(content.trim()), (c) => c.charCodeAt(0));
        return new TextDecoder().decode(bytes).split('\n');
      } catch (err) {
        return ['base64: invalid input'];
      }
    },
    nmap: (args) => {
      const target = args.find((a) => !a.startsWith('-'));
      if (target && target !== 'localhost' && target !== '127.0.0.1') {
        return ['Failed to resolve "' + target + '". Only localhost is in scope.'];
      }
      return [
        'Starting Nmap (simulated scan of localhost)',
        'PORT      STATE   SERVICE',
        '22/tcp    closed  ssh',
        '80/tcp    open    http',
        '1337/tcp  open    ctf-lab',
        'Nmap done: 1 IP address (1 host up)',
      ];
    },
    nc: (args) => {
      const parts = args.filter((a) => !a.startsWith('-'));
      const host = parts[0];
      const port = parts[1];
      if (host !== 'localhost' && host !== '127.0.0.1') return ['nc: could not reach ' + (host || 'host')];
      if (port === '80') {
        return ['HTTP/1.1 200 OK', '', 'Nothing to see on this port. The lab is somewhere else.'];
      }
      if (port === '1337') {
        return [
          'Connected to localhost:1337',
          'ctf-lab: welcome, operator.',
          '  ' + FLAGS.flag3,
          'Lab complete on this port. Good scan.',
        ];
      }
      return ['nc: connect to localhost port ' + (port || '?') + ' (tcp) failed: Connection refused'];
    },
  };

  const runLine = (line) => {
    const parts = line.trim().split(/\s+/);
    const cmd = parts[0];
    if (!cmd) return [];
    if (!Object.prototype.hasOwnProperty.call(commands, cmd)) {
      return ['bash: ' + cmd + ': command not found'];
    }
    return commands[cmd](parts.slice(1));
  };

  /* ---------- Flag capture ---------- */
  const captureFlags = (lines) => {
    const text = lines.join('\n');
    const notes = [];
    Object.keys(FLAGS).forEach((key) => {
      if (!found.has(key) && text.includes(FLAGS[key])) {
        found.add(key);
        notes.push('[+] flag captured (' + found.size + '/' + TOTAL + ')');
      }
    });
    if (notes.length) {
      saveFound();
      if (found.size === TOTAL) {
        notes.push('root@portfolio: lab complete. Type ls to see what opened up.');
      }
    }
    return notes;
  };

  /* ---------- Terminal window ---------- */
  let overlay = null;
  let out = null;
  let input = null;
  let topPrompt = null;
  let open = false;
  let booted = false;

  const promptTop = () => {
    const shown = state.cwd === HOME ? '~' : state.cwd.replace(HOME, '~');
    return '┌──(kali㉿portfolio)-[' + shown + ']';
  };

  const addLine = (text, cls) => {
    const el = document.createElement('div');
    el.className = 'term-out-line' + (cls ? ' ' + cls : '');
    el.textContent = text === '' ? ' ' : text;
    out.appendChild(el);
    out.scrollTop = out.scrollHeight;
  };

  const closeTerm = () => {
    if (!overlay) return;
    overlay.hidden = true;
    open = false;
  };

  const onKey = (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const last = state.history.length;
      if (event.key === 'ArrowUp' && state.hIdx > 0) state.hIdx--;
      if (event.key === 'ArrowDown') state.hIdx = Math.min(last, state.hIdx + 1);
      input.value = state.hIdx < last ? state.history[state.hIdx] : '';
      return;
    }
    if (event.key !== 'Enter') return;

    const value = input.value;
    input.value = '';
    const command = value.trim();
    addLine(promptTop(), 'term-top');
    addLine('└─$ ' + value, 'term-echo');

    if (command) state.history.push(command);
    state.hIdx = state.history.length;

    const name = command.split(/\s+/)[0];
    if (name === 'clear') {
      out.textContent = '';
    } else if (name === 'exit') {
      closeTerm();
      return;
    } else {
      const lines = runLine(command);
      lines.forEach((line) => addLine(line));
      captureFlags(lines).forEach((note) => addLine(note, 'term-ok'));
    }
    topPrompt.textContent = promptTop();
  };

  const build = () => {
    overlay = document.createElement('div');
    overlay.className = 'term';
    overlay.hidden = true;
    overlay.setAttribute('data-lenis-prevent', '');
    overlay.innerHTML =
      '<div class="term-win" role="dialog" aria-modal="true" aria-label="Secret terminal">' +
        '<div class="term-bar"><span>kali@portfolio: terminal</span>' +
        '<button type="button" class="term-close" aria-label="Close terminal">&times;</button></div>' +
        '<div class="term-out" aria-live="polite"></div>' +
        '<div class="term-prompt-top"></div>' +
        '<div class="term-input-row"><span class="term-sigil">└─$</span>' +
        '<input class="term-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Terminal input" />' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    out = overlay.querySelector('.term-out');
    input = overlay.querySelector('.term-input');
    topPrompt = overlay.querySelector('.term-prompt-top');
    topPrompt.textContent = promptTop();

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeTerm();
    });
    overlay.querySelector('.term-close').addEventListener('click', closeTerm);
    overlay.querySelector('.term-win').addEventListener('click', () => input.focus());
    input.addEventListener('keydown', onKey);
  };

  const openTerm = () => {
    if (!overlay) build();
    overlay.hidden = false;
    open = true;
    if (!booted) {
      booted = true;
      addLine('Kali-style lab  //  target: this portfolio');
      addLine('Three flags are hidden on this site. View source is fair game.');
      addLine('Type help to start. Escape closes the terminal.');
      addLine('');
    }
    input.focus();
  };

  /* ---------- Secret trigger: type "kali" anywhere on the page ---------- */
  let typed = '';

  document.addEventListener('keydown', (event) => {
    if (open) {
      if (event.key === 'Escape') closeTerm();
      return;
    }
    if (root.classList.contains('is-preloading')) return;

    const target = event.target;
    if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
    if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return;

    typed = (typed + event.key.toLowerCase()).slice(-4);
    if (typed === 'kali') {
      typed = '';
      openTerm();
    }
  });
})();
