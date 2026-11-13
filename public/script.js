(() => {
  'use strict';

  // 1. Asset-Aware Preloader
  const loader = document.getElementById('site-loader');
  const loaderPercent = loader?.querySelector('.loader-percentage');
  const loaderTrack = loader?.querySelector('.loader-track');
  const loaderStatus = loader?.querySelector('.loader-status-text');
  let loaderProgress = 8;
  let loaderReleased = false;

  const updateLoader = (value, message) => {
    if (!loader || loaderReleased) return;
    loaderProgress = Math.max(loaderProgress, Math.min(100, Math.round(value)));
    loader.style.setProperty('--loader-progress', String(loaderProgress / 100));
    if (loaderPercent) loaderPercent.textContent = `${String(loaderProgress).padStart(2, '0')}%`;
    if (loaderStatus && message) loaderStatus.textContent = message;
    if (loaderTrack) loaderTrack.setAttribute('aria-valuenow', String(loaderProgress));
  };

  const releaseLoader = () => {
    if (!loader || loaderReleased) return;
    loaderReleased = true;
    updateLoader(100, 'Ready');
    window.setTimeout(() => {
      loader.classList.add('loader-hidden');
      document.body.classList.add('page-ready');
      window.setTimeout(() => loader.remove(), 500);
    }, 200);
  };

  if (loader) {
    updateLoader(25, 'Loading visual assets');

    const criticalImages = [...document.querySelectorAll('#root img')]
      .filter((img) => img.getAttribute('loading') !== 'lazy' && (img.currentSrc || img.getAttribute('src')));
    let loadedCount = 0;

    const checkDone = () => {
      loadedCount++;
      const progress = criticalImages.length ? 30 + (loadedCount / criticalImages.length) * 60 : 90;
      updateLoader(progress, 'Finalising');
      if (loadedCount >= criticalImages.length) {
        releaseLoader();
      }
    };

    if (criticalImages.length === 0) {
      window.setTimeout(releaseLoader, 400);
    } else {
      criticalImages.forEach((img) => {
        if (img.complete) {
          checkDone();
        } else {
          img.addEventListener('load', checkDone, { once: true });
          img.addEventListener('error', checkDone, { once: true });
        }
      });
    }

    // Safety timeout: never trap visitor for more than 1.5 seconds
    window.setTimeout(releaseLoader, 1500);

    window.__buildHerBharatAppReady = () => {
      releaseLoader();
    };
  }

  // 2. Mobile Navigation Drawer
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
      }
    });
  }

  // 3. Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  if (themeToggle) {
    let savedTheme = 'dark';
    try {
      savedTheme = window.localStorage.getItem('buildher-bharat-theme') || 'dark';
    } catch (error) {
      console.warn('Theme preference could not be loaded:', error);
    }

    const applyTheme = (theme) => {
      const isLight = theme === 'light';
      document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
      themeToggle.setAttribute('aria-pressed', String(isLight));
      themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} theme`);
      themeToggle.querySelector('span').textContent = `${isLight ? 'Dark' : 'Light'} mode`;
      if (themeMeta) themeMeta.setAttribute('content', isLight ? '#f7f9fc' : '#050c18');
    };

    applyTheme(savedTheme);
    themeToggle.addEventListener('click', () => {
      const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      try {
        window.localStorage.setItem('buildher-bharat-theme', theme);
      } catch (error) {
        console.warn('Theme preference could not be saved:', error);
      }
      applyTheme(theme);
    });
  }

  // 4. Scroll Progress Indicator
  const progressSpan = document.querySelector('.scroll-progress span');
  let ticking = false;

  const updateScroll = () => {
    if (!progressSpan) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    progressSpan.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }, { passive: true });
  updateScroll();

  // 5. Registration Deadline Countdown: 15 November 2026, 11:59 PM IST
  const regDeadline = new Date('2026-11-15T23:59:00+05:30').getTime();
  const regFields = {
    days: document.getElementById('reg-days'),
    hours: document.getElementById('reg-hours'),
    minutes: document.getElementById('reg-minutes'),
    seconds: document.getElementById('reg-seconds')
  };

  const updateRegCountdown = () => {
    const diff = regDeadline - Date.now();
    if (diff <= 0) {
      Object.values(regFields).forEach((el) => { if (el) el.textContent = '00'; });
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (regFields.days) regFields.days.textContent = String(days).padStart(2, '0');
    if (regFields.hours) regFields.hours.textContent = String(hours).padStart(2, '0');
    if (regFields.minutes) regFields.minutes.textContent = String(minutes).padStart(2, '0');
    if (regFields.seconds) regFields.seconds.textContent = String(seconds).padStart(2, '0');
  };
  updateRegCountdown();
  window.setInterval(updateRegCountdown, 1000);

  // 6. Grand Finale Countdown: 25 November 2026, 9:00 AM IST
  const finaleDate = new Date('2026-11-25T09:00:00+05:30').getTime();
  const finaleFields = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
  };

  const updateFinaleCountdown = () => {
    const diff = finaleDate - Date.now();
    if (diff <= 0) {
      Object.values(finaleFields).forEach((el) => { if (el) el.textContent = '00'; });
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (finaleFields.days) finaleFields.days.textContent = String(days).padStart(2, '0');
    if (finaleFields.hours) finaleFields.hours.textContent = String(hours).padStart(2, '0');
    if (finaleFields.minutes) finaleFields.minutes.textContent = String(minutes).padStart(2, '0');
    if (finaleFields.seconds) finaleFields.seconds.textContent = String(seconds).padStart(2, '0');
  };
  updateFinaleCountdown();
  window.setInterval(updateFinaleCountdown, 1000);

  // 7. Statistics Count-Up (Single Viewport Trigger, No Infinite Loops)
  const countupNodes = [...document.querySelectorAll('[data-countup]')];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const formatCount = (value, format) => {
    if (format === 'plain') return String(Math.round(value));
    if (format === 'compact') {
      if (value >= 1000) return `${Math.round(value / 1000)}K`;
      return String(value);
    }
    return Math.round(value).toLocaleString('en-IN');
  };

  const runCount = (node) => {
    if (node.dataset.counted === 'true') return;
    node.dataset.counted = 'true';
    const target = Number(node.dataset.countup || 0);
    const duration = prefersReducedMotion ? 0 : 1800;

    if (!duration) {
      node.textContent = formatCount(target, node.dataset.countFormat);
      return;
    }

    node.textContent = formatCount(0, node.dataset.countFormat);
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = Math.min(1, (now - startTime) / duration);
      // Easing out cubic
      const eased = 1 - Math.pow(1 - elapsed, 3);
      node.textContent = formatCount(target * eased, node.dataset.countFormat);
      if (elapsed < 1) {
        window.requestAnimationFrame(tick);
      }
    };
    window.requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    countupNodes.forEach((node) => statObserver.observe(node));
  } else {
    countupNodes.forEach((node) => runCount(node));
  }

  // 8. Custom Precision Cursor (Desktop Only, Pointer-Events None)
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (finePointer && !prefersReducedMotion) {
    const dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'custom-cursor-ring';

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let isVisible = false;

    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;

      if (!isVisible) {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        isVisible = true;
      }
    }, { passive: true });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      window.requestAnimationFrame(animateRing);
    };
    window.requestAnimationFrame(animateRing);

    const hoverSelectors = 'a, button, summary, .button, .stat-card, .track-card, .podium-card, .team-card, .community-group-card, .partner-card, input[type="range"]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest && e.target.closest(hoverSelectors)) {
        document.body.classList.add('cursor-hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest && e.target.closest(hoverSelectors)) {
        document.body.classList.remove('cursor-hovering');
      }
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      isVisible = false;
    });
  }

  // Signal app ready
  if (typeof window.__buildHerBharatAppReady === 'function') {
    window.__buildHerBharatAppReady();
  }
})();
