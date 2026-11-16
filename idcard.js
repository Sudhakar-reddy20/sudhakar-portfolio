(() => {
  'use strict';

  const card = document.getElementById('id-card');
  const switcher = document.getElementById('role-switch');
  if (!card || !switcher) return;

  const roleEl = document.getElementById('id-role');
  const missionEl = document.getElementById('id-mission');
  const stampEl = document.getElementById('id-stamp');
  const shareBtn = document.getElementById('card-share');
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INTERVAL_MS = 6000;

  /* Future roles shown on the ID card. Edit the text or colours here.
     rgb is "red, green, blue". Each role is a career goal, not a current job. */
  const ROLES = [
    {
      id: 'soc',
      title: 'SOC Analyst',
      track: 'Blue team',
      rgb: '58, 160, 255',
      mission: 'Watches alerts, triages logs and escalates real incidents.',
    },
    {
      id: 'hunter',
      title: 'Threat Hunter',
      track: 'Blue team',
      rgb: '62, 224, 143',
      mission: 'Searches for attackers who got past the alerts.',
    },
    {
      id: 'responder',
      title: 'Incident Responder',
      track: 'Blue team',
      rgb: '255, 178, 63',
      mission: 'Contains breaches, traces what happened and writes the report.',
    },
    {
      id: 'pentest',
      title: 'Penetration Tester',
      track: 'Red team',
      rgb: '255, 92, 122',
      mission: 'Tests systems with permission and reports weaknesses clearly.',
    },
    {
      id: 'engineer',
      title: 'Security Engineer',
      track: 'Build',
      rgb: '167, 139, 250',
      mission: 'Builds and tunes the detection tools a SOC relies on.',
    },
  ];

  /* A shared link (?role=...) stays on its role. Otherwise the card rotates. */
  const requested = new URLSearchParams(window.location.search).get('role');
  let index = Math.max(0, ROLES.findIndex((role) => role.id === requested));
  let auto = !requested && !reduceMotion;
  let hovering = false;

  const show = (i, flash) => {
    index = i;
    const role = ROLES[i];
    card.dataset.role = role.id;
    card.style.setProperty('--accent', 'rgb(' + role.rgb + ')');
    card.style.setProperty('--accent-rgb', role.rgb);
    card.style.setProperty('--accent-glow', 'rgba(' + role.rgb + ', 0.7)');
    roleEl.textContent = role.title;
    missionEl.textContent = role.mission;
    stampEl.textContent = role.track;
    dots.forEach((dot, n) => dot.setAttribute('aria-pressed', String(n === i)));
    if (flash && !reduceMotion) {
      card.classList.remove('is-switching');
      void card.offsetWidth;
      card.classList.add('is-switching');
    }
  };

  const dots = ROLES.map((role, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'role-dot';
    dot.style.setProperty('--swatch', 'rgb(' + role.rgb + ')');
    dot.textContent = role.title;
    dot.setAttribute('aria-pressed', 'false');
    dot.addEventListener('click', () => {
      auto = false;
      show(i, true);
    });
    switcher.appendChild(dot);
    return dot;
  });

  card.addEventListener('pointerenter', () => {
    hovering = true;
  });
  card.addEventListener('pointerleave', () => {
    hovering = false;
  });

  setInterval(() => {
    const calm = root.classList.contains('calm');
    if (auto && !hovering && !calm) show((index + 1) % ROLES.length, true);
  }, INTERVAL_MS);

  /* ---------- Copy a link that opens the card on this role ---------- */
  const fallbackCopy = (text) => {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (err) {
      ok = false;
    }
    field.remove();
    return ok ? Promise.resolve() : Promise.reject(new Error('copy failed'));
  };

  const copy = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    }
    return fallbackCopy(text);
  };

  if (shareBtn) {
    const label = shareBtn.textContent;
    let timer = null;
    const flash = (text) => {
      shareBtn.textContent = text;
      clearTimeout(timer);
      timer = setTimeout(() => {
        shareBtn.textContent = label;
      }, 1800);
    };

    shareBtn.addEventListener('click', () => {
      const url = new URL(window.location.href);
      url.search = '?role=' + ROLES[index].id;
      url.hash = '';
      copy(url.href).then(
        () => flash('Link copied'),
        () => flash('Copy failed')
      );
    });
  }

  show(index, false);
})();
