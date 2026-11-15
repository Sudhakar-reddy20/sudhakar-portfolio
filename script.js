(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const hasLenis = typeof window.Lenis !== 'undefined';

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------- Smooth scrolling (Lenis) ---------- */
  let lenis = null;
  if (hasLenis && !reduceMotion) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  /* ---------- Smooth in-page links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -20 });
      } else {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
      history.pushState(null, '', '#' + id);
    });
  });

  /* ---------- Active nav highlight ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('[data-nav]');

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.dataset.nav === id;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((section) => navObserver.observe(section));

  /* ---------- Scroll progress and glass nav state ---------- */
  const navEl = document.querySelector('.glass-nav');
  const progressBar = document.querySelector('.scroll-progress');

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (progressBar) {
      progressBar.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
    }
    navEl.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Typing effect in the hero ---------- */
  const typedEl = document.getElementById('typed');
  const phrases = ['SOC Analyst', 'Ethical Hacker', 'VAPT Enthusiast'];

  if (typedEl && !reduceMotion) {
    let phraseIndex = 0;
    let charCount = phrases[0].length;
    let deleting = true;

    /* Start by holding the first phrase, then delete and type the rest */
    const typeTick = () => {
      const word = phrases[phraseIndex];

      if (!deleting) {
        charCount++;
        typedEl.textContent = word.slice(0, charCount);
        if (charCount === word.length) {
          deleting = true;
          setTimeout(typeTick, 1800);
          return;
        }
        setTimeout(typeTick, 90);
      } else {
        charCount--;
        typedEl.textContent = word.slice(0, charCount);
        if (charCount === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typeTick, 350);
          return;
        }
        setTimeout(typeTick, 45);
      }
    };
    setTimeout(typeTick, 1800);
  }

  /* ---------- Mouse spotlight ---------- */
  const spotlight = document.querySelector('.spotlight');
  if (spotlight && finePointer && !reduceMotion) {
    window.addEventListener(
      'pointermove',
      (event) => {
        spotlight.style.setProperty('--mx', event.clientX + 'px');
        spotlight.style.setProperty('--my', event.clientY + 'px');
      },
      { passive: true }
    );
  }

  /* ---------- 3D tilt on pointer hover ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          'perspective(900px) rotateX(' + (-y * 8).toFixed(2) + 'deg) rotateY(' + (x * 10).toFixed(2) + 'deg)';
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- Scroll-driven animations (GSAP + ScrollTrigger) ---------- */
  if (hasGSAP && !reduceMotion) {
    /* Headings and single items fade up as they enter */
    gsap.utils.toArray('.reveal').forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        }
      );
    });

    /* Cards rise one after another as each group enters the screen */
    gsap.utils.toArray('.stagger-group').forEach((group) => {
      gsap.from(group.children, {
        opacity: 0,
        y: 40,
        stagger: 0.14,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 88%', once: true },
      });
    });

    /* Hero text and ID card enter on load */
    gsap.from('.hero-text > *', {
      opacity: 0,
      y: 26,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.15,
    });
    gsap.from('.id-card', {
      opacity: 0,
      y: 50,
      scale: 0.96,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.35,
    });
  }
})();
