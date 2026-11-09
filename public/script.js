(() => {
  // Asset-aware loader: progress follows initial images, web fonts and app setup.
  const loader = document.getElementById('site-loader');
  const loaderStatus = loader?.querySelector('.loader-status-text');
  const loaderPercent = loader?.querySelector('.loader-percentage');
  const loaderTrack = loader?.querySelector('.loader-track');
  const loaderLabel = loader?.querySelector('.loader-progress-label');
  const loaderStages = loader ? [...loader.querySelectorAll('.loader-stage')] : [];
  let loaderProgress = 8;
  let loaderAppReady = false;
  let loaderAssetsReady = false;
  let loaderMinimumReady = false;
  let loaderReleased = false;
  let loaderReleaseTimer = null;
  const loaderDelay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const updateLoader = (value, message, label) => {
    if (!loader || loaderReleased) return;
    loaderProgress = Math.max(loaderProgress, Math.min(100, Math.round(value)));
    loader.style.setProperty('--loader-progress', String(loaderProgress / 100));
    if (loaderPercent) loaderPercent.textContent = `${String(loaderProgress).padStart(2, '0')}%`;
    if (loaderStatus && message) loaderStatus.textContent = message;
    if (loaderLabel && label) loaderLabel.textContent = label;
    if (loaderTrack) loaderTrack.setAttribute('aria-valuenow', String(loaderProgress));
    const activeStage = loaderProgress < 30 ? 0 : loaderProgress < 62 ? 1 : loaderProgress < 91 ? 2 : 3;
    loaderStages.forEach((stage, index) => stage.classList.toggle('is-active', index === activeStage));
  };

  const releaseLoader = () => {
    if (!loader || loaderReleased || !loaderAppReady || !loaderAssetsReady || !loaderMinimumReady) return;
    updateLoader(100, 'Your experience is ready', 'COMPLETE');
    loaderReleased = true;
    if (loaderReleaseTimer) window.clearTimeout(loaderReleaseTimer);
    window.setTimeout(() => {
      loader.classList.add('loader-hidden');
      document.body.classList.add('page-ready');
      window.setTimeout(() => loader.remove(), 850);
    }, 320);
  };

  if (loader) {
    const waitForImage = (image) => new Promise((resolve) => {
      if (image.complete) { resolve(); return; }
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        image.removeEventListener('load', finish);
        image.removeEventListener('error', finish);
        resolve();
      };
      const timer = window.setTimeout(finish, 4500);
      image.addEventListener('load', finish, { once: true });
      image.addEventListener('error', finish, { once: true });
    });

    const criticalImages = [...document.querySelectorAll('#root img')]
      .filter((image) => image.getAttribute('loading') !== 'lazy' && (image.currentSrc || image.getAttribute('src')));
    const imageCount = criticalImages.length;
    let imagesDone = 0;

    updateLoader(13, 'Setting up BuildHer Bharat', 'STARTING');
    loaderDelay(180).then(() => updateLoader(24, 'Preparing the event experience', 'PREPARING'));

    const imagePromise = Promise.all(criticalImages.map((image) => waitForImage(image).then(() => {
      imagesDone += 1;
      const imageProgress = imageCount ? 30 + (imagesDone / imageCount) * 46 : 76;
      updateLoader(imageProgress, 'Loading event visuals and images', 'LOADING ASSETS');
    })));

    const fontPromise = document.fonts?.ready
      ? Promise.race([document.fonts.ready.catch(() => undefined), loaderDelay(2600)])
      : Promise.resolve();
    const windowLoadPromise = document.readyState === 'complete'
      ? Promise.resolve()
      : Promise.race([
          new Promise((resolve) => window.addEventListener('load', resolve, { once: true })),
          loaderDelay(2200)
        ]);

    loaderDelay(1250).then(() => {
      loaderMinimumReady = true;
      releaseLoader();
    });

    Promise.all([imagePromise, fontPromise, windowLoadPromise]).then(() => {
      loaderAssetsReady = true;
      updateLoader(88, 'Applying the finishing touches', 'FINALISING');
      releaseLoader();
    });

    // The app explicitly signals readiness after its event handlers are attached.
    window.__buildHerBharatAppReady = () => {
      loaderAppReady = true;
      updateLoader(loaderAssetsReady ? 94 : 82, 'Almost ready to explore', 'GETTING READY');
      releaseLoader();
    };

    // Never trap visitors behind a loader on exceptionally slow or blocked networks.
    loaderReleaseTimer = window.setTimeout(() => {
      loaderAssetsReady = true;
      loaderMinimumReady = true;
      loaderAppReady = true;
      updateLoader(100, 'Opening BuildHer Bharat', 'READY');
      releaseLoader();
    }, 7200);
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  // Accessible mobile navigation.
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
      if (event.key === 'Escape') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
      }
    });
  }

  // Grand Finale: 25 November 2026, 9:00 AM IST.
  const finaleDate = new Date('2026-11-25T09:00:00+05:30').getTime();
  const fields = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
  };
  const updateCountdown = () => {
    const distance = finaleDate - Date.now();
    if (distance <= 0) {
      Object.values(fields).forEach((field) => { if (field) field.textContent = '00'; });
      return;
    }
    const values = {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance % 86400000) / 3600000),
      minutes: Math.floor((distance % 3600000) / 60000),
      seconds: Math.floor((distance % 60000) / 1000)
    };
    Object.entries(values).forEach(([key, value]) => {
      if (fields[key]) fields[key].textContent = String(value).padStart(2, '0');
    });
  };
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Scroll progress line.
  const progress = document.querySelector('.scroll-progress span');
  let scrollTicking = false;
  const updateScrollProgress = () => {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, amount))})`;
    scrollTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollProgress);
      scrollTicking = true;
    }
  }, { passive: true });
  updateScrollProgress();

  // Decorative particle field removed for a calmer, cleaner interface.

  // Reveal key content as it enters the viewport, with a natural stagger.
  const revealTargets = document.querySelectorAll(
    '.section-heading, .section-intro, .about-content, .fact, .eligibility-card, .track-card, .timeline-item, .countdown-panel, .prizes-copy, .prize-card, .benefits-wrap, .benefits-grid > div, .partner-card, .person-card, .community-card, .rule-row, .faq-list details, .registration-copy, .registration-qr-card, .deadline-countdown, .cta-layout > div, .footer-links'
  );
  const siblingCounts = new WeakMap();
  revealTargets.forEach((element) => {
    const parent = element.parentElement;
    const index = siblingCounts.get(parent) || 0;
    siblingCounts.set(parent, index + 1);
    element.dataset.reveal = '';
    element.style.transitionDelay = `${Math.min(index * 95, 475)}ms`;
  });

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -55px 0px' });
    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  }

  // Pointer-driven card tilt removed; cards stay stable and accessible.

  // Registration deadline countdown: 15 November 2026, 11:59 PM IST.
  const registrationDeadline = new Date('2026-11-15T23:59:00+05:30').getTime();
  const registrationFields = {
    days: document.getElementById('reg-days'),
    hours: document.getElementById('reg-hours'),
    minutes: document.getElementById('reg-minutes'),
    seconds: document.getElementById('reg-seconds')
  };
  const registrationPanel = document.querySelector('.deadline-countdown');
  const updateRegistrationCountdown = () => {
    if (!registrationPanel) return;
    const distance = registrationDeadline - Date.now();
    if (distance <= 0) {
      Object.values(registrationFields).forEach((field) => { if (field) field.textContent = '00'; });
      registrationPanel.classList.add('deadline-closed');
      const title = registrationPanel.querySelector('.deadline-heading strong');
      if (title) title.textContent = 'REGISTRATION DEADLINE PASSED';
      return;
    }
    const values = {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance % 86400000) / 3600000),
      minutes: Math.floor((distance % 3600000) / 60000),
      seconds: Math.floor((distance % 60000) / 1000)
    };
    Object.entries(values).forEach(([key, value]) => {
      if (registrationFields[key]) registrationFields[key].textContent = String(value).padStart(2, '0');
    });
  };
  updateRegistrationCountdown();
  window.setInterval(updateRegistrationCountdown, 1000);

  // Count-up metrics animate when they enter the viewport.
  const countupNodes = [...document.querySelectorAll('[data-countup]')];
  const formatCount = (value, format) => {
    if (format === 'plain') return String(Math.round(value));
    if (format === 'compact') {
      if (value >= 1000) return `${Math.round(value / 1000)}K`;
      return String(value);
    }
    return Math.round(value).toLocaleString('en-IN');
  };
  const runCount = (node, force = false) => {
    if (node.dataset.counted === 'true' && !force) return;
    node.dataset.counted = 'true';
    const target = Number(node.dataset.countup || 0);
    const duration = prefersReducedMotion ? 0 : 2200;
    if (!duration) { node.textContent = formatCount(target, node.dataset.countFormat); return; }
    node.textContent = formatCount(0, node.dataset.countFormat);
    const startValue = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - startValue) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      node.textContent = formatCount(target * eased, node.dataset.countFormat);
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };
  const highlightsSection = document.querySelector('#highlights');
  const highlightsNodes = highlightsSection
    ? [...highlightsSection.querySelectorAll('[data-countup]')]
    : [];
  const prizeSection = document.querySelector('#prizes');
  const prizeNodes = prizeSection ? [...prizeSection.querySelectorAll('[data-countup]')] : [];
  const repeatingNodes = new Set([...highlightsNodes, ...prizeNodes]);
  const observeOnce = (nodes) => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => { if (entry.isIntersecting) { runCount(entry.target); obs.unobserve(entry.target); } });
      }, { threshold: 0.35 });
      nodes.forEach((node) => observer.observe(node));
    } else nodes.forEach((node) => runCount(node));
  };
  observeOnce(countupNodes.filter((node) => !repeatingNodes.has(node)));
  const repeatCountUp = (section, nodes) => {
    if (!section || !nodes.length) return;
    let visible = false;
    let loopTimer = null;
    const animate = () => {
      nodes.forEach((node) => {
        node.textContent = '0';
        node.dataset.counted = 'false';
        runCount(node, true);
      });
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          visible = entry.isIntersecting;
          if (visible) {
            animate();
            if (!prefersReducedMotion && !loopTimer) {
              loopTimer = window.setInterval(() => {
                if (visible) animate();
              }, 6500);
            }
          } else if (loopTimer) {
            window.clearInterval(loopTimer);
            loopTimer = null;
          }
        });
      }, { threshold: 0.35 });
      observer.observe(section);
    } else {
      animate();
    }
  };
  repeatCountUp(highlightsSection, highlightsNodes);
  repeatCountUp(prizeSection, prizeNodes);

  // Cursor aura + logo parallax. The sponsor marks subtly follow the pointer
  // inside their own cards without moving their underlying layout.
  const cursorAura = document.querySelector('.cursor-aura');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!prefersReducedMotion && finePointer) {
    let pointerFrame = 0;
    let pointerX = window.innerWidth * 0.5;
    let pointerY = window.innerHeight * 0.35;
    const renderPointerAura = () => {
      if (cursorAura) cursorAura.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      pointerFrame = 0;
    };
    window.addEventListener('pointermove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!pointerFrame) pointerFrame = window.requestAnimationFrame(renderPointerAura);
    }, { passive: true });
    const partnerCards = document.querySelectorAll('.partner-card');
    partnerCards.forEach((card) => {
      const logos = card.querySelectorAll('.partner-logo, .institution-logos img');
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--pointer-x', `${((nx + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--pointer-y', `${((ny + 0.5) * 100).toFixed(1)}%`);
        logos.forEach((logo, index) => {
          const factor = index === 0 ? 18 : 13;
          logo.style.setProperty('--cursor-logo-x', `${(nx * factor).toFixed(1)}px`);
          logo.style.setProperty('--cursor-logo-y', `${(ny * factor).toFixed(1)}px`);
          logo.style.setProperty('--cursor-logo-rotate', `${(nx * 4).toFixed(1)}deg`);
        });
      });
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--pointer-x');
        card.style.removeProperty('--pointer-y');
        logos.forEach((logo) => {
          logo.style.removeProperty('--cursor-logo-x');
          logo.style.removeProperty('--cursor-logo-y');
          logo.style.removeProperty('--cursor-logo-rotate');
        });
      });
    });
  }

  // Apply reveal motion to more of the content, including rules and FAQ rows.

  // Highlight the navigation item for the visible section.
  if ('IntersectionObserver' in window) {
    const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
    const sectionMap = new Map(navLinks.map((link) => [link.getAttribute('href').slice(1), link]));
    const sections = [...sectionMap.keys()].map((id) => document.getElementById(id)).filter(Boolean);
    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.remove('active'));
        const activeLink = sectionMap.get(entry.target.id);
        if (activeLink) activeLink.classList.add('active');
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach((section) => activeObserver.observe(section));
  }

  // Precision cursor target and sponsor-logo magnetic motion (desktop only).
  if (!prefersReducedMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const target = document.createElement('div');
    target.className = 'cursor-target';
    target.setAttribute('aria-hidden', 'true');
    target.innerHTML = '<i></i><b></b>';
    document.body.appendChild(target);
    document.body.classList.add('cursor-ready');
    let pointerX = -100, pointerY = -100, targetX = -100, targetY = -100, raf = 0;
    const sponsors = [...document.querySelectorAll('.partner-card')];
    let clickPulseTimer = 0;
    const hoverTargets = 'a, button, [role="button"], summary, .person-card, .partner-card, .community-card, .track-card, .prize-card, .eligibility-card';
    const moveTarget = () => {
      targetX += (pointerX - targetX) * .22;
      targetY += (pointerY - targetY) * .22;
      target.style.transform = `translate(${targetX}px,${targetY}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(moveTarget);
    };
    raf = requestAnimationFrame(moveTarget);
    window.addEventListener('pointermove', (event) => {
      pointerX = event.clientX; pointerY = event.clientY;
      const hovered = event.target instanceof Element && event.target.closest(hoverTargets);
      target.classList.toggle('cursor-hovering', Boolean(hovered));
      sponsors.forEach((card) => {
        const r = card.getBoundingClientRect();
        const inside = event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
        if (!inside) { card.classList.remove('aim-active'); return; }
        card.classList.add('aim-active');
        const nx = (event.clientX - r.left) / r.width - .5;
        const ny = (event.clientY - r.top) / r.height - .5;
        card.style.setProperty('--aim-x', `${nx * 7}deg`);
        card.style.setProperty('--aim-y', `${-ny * 7}deg`);
        card.style.setProperty('--aim-tx', `${nx * 5}px`);
        card.style.setProperty('--aim-ty', `${ny * 5}px`);
        card.style.setProperty('--spot-x', `${(nx + .5) * 100}%`);
        card.style.setProperty('--spot-y', `${(ny + .5) * 100}%`);
        card.style.setProperty('--logo-x', `${nx * 13}px`);
        card.style.setProperty('--logo-y', `${ny * 10}px`);
      });
    }, { passive: true });
    document.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch') return;
      target.classList.remove('cursor-clicked');
      // Restart the click ripple even when the user clicks repeatedly.
      void target.offsetWidth;
      target.classList.add('cursor-clicked');
      window.clearTimeout(clickPulseTimer);
      clickPulseTimer = window.setTimeout(() => target.classList.remove('cursor-clicked'), 520);
    }, { passive: true });
    window.addEventListener('pointerup', () => target.classList.remove('cursor-pressed'), { passive: true });
    window.addEventListener('blur', () => {
      target.classList.remove('cursor-hovering', 'cursor-clicked', 'cursor-pressed');
      sponsors.forEach(card => card.classList.remove('aim-active'));
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!prefersReducedMotion) raf = requestAnimationFrame(moveTarget);
    });
  }

  // Site-wide motion: animate navigation, hero, headings, media, content and footer.
  // Existing data-reveal targets are left alone to avoid double animation.
  const siteMotionSelector = [
    '.site-header', '.main-nav > a', '.footer-links > a', '.site-footer .footer-layout > *',
    '.hero .hero-grid > *', '.hero .hero-copy > *', '.hero-actions > *', '.hero-poster-wrap',
    '.quick-facts .fact', '.poster-frame',
    'main section .section-heading', 'main section .section-intro',
    'main section .tracks-heading > *', 'main section .about-content > *',
    'main section .eligibility-card', 'main section .track-card', 'main section .timeline-item',
    'main section .countdown-panel', 'main section .prize-card', 'main section .benefits-wrap',
    'main section .benefits-grid > *', 'main section .partner-card', 'main section .person-card',
    'main section .community-card', 'main section .rule-row', 'main section .faq-list details',
    'main section .registration-copy', 'main section .registration-qr-card',
    'main section .deadline-countdown', 'main section .cta-layout > *',
    'main section h2', 'main section h3', 'main section p', 'main section li',
    'main section .eyebrow', 'main section .button', 'main section .text-link',
    'main section img', 'main section .faq-list summary', 'main section .card-index',
    'main section .eligibility-icon', 'main section .track-icon',
    'main section .round-label', 'main section .timeline-meta > *',
    'main section .registration-points > *', 'main section .about-pills > *',
    'main section .institution-logos img', 'main section .person-action',
    'main section .registration-qr-top > *', 'main section .registration-qr-bottom > *',
    'main section .prize-card > *', 'main section .community-card-copy > *',
    'main section .contact-people > *',
    '.social-section .section-heading', '.social-section .social-hub-card', '.social-section .social-hub-card > *', '.social-section .social-hub-link', '.social-section .social-hub-note'
  ].join(',');
  const siteMotionTargets = [...document.querySelectorAll(siteMotionSelector)]
    .filter((element) => !element.hasAttribute('data-reveal') && !element.hasAttribute('data-site-motion'));
  const siteMotionSiblings = new WeakMap();
  siteMotionTargets.forEach((element) => {
    const parent = element.parentElement;
    const index = siteMotionSiblings.get(parent) || 0;
    siteMotionSiblings.set(parent, index + 1);
    element.setAttribute('data-site-motion', '');
    element.style.setProperty('--site-delay', `${Math.min(index * 75, 450)}ms`);
    if (element.matches('.partner-card, .person-card, .community-card, .prize-card, .eligibility-card, .track-card, .social-hub-card')) {
      element.setAttribute('data-motion-style', 'scale');
    } else if (element.matches('.section-heading, .section-intro, .registration-copy')) {
      element.setAttribute('data-motion-style', 'slide-left');
    }
  });

  if (siteMotionTargets.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
    document.documentElement.classList.add('site-motion-ready');
    const siteMotionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('site-motion-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    siteMotionTargets.forEach((element) => siteMotionObserver.observe(element));
  } else {
    siteMotionTargets.forEach((element) => element.classList.add('site-motion-in'));
  }

  // Animate section arrival after any in-page navigation click and keep the header responsive.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const id = link.getAttribute('href').slice(1);
      const destination = id ? document.getElementById(id) : null;
      if (destination) {
        destination.classList.remove('navigation-arrival');
        window.setTimeout(() => destination.classList.add('navigation-arrival'), 80);
        window.setTimeout(() => destination.classList.remove('navigation-arrival'), 1150);
      }
    });
  });
  const header = document.querySelector('.site-header');
  const updateHeaderMotion = () => {
    if (header) header.classList.toggle('header-scrolled', window.scrollY > 24);
  };
  updateHeaderMotion();
  window.addEventListener('scroll', updateHeaderMotion, { passive: true });

  // Round-wise reveal order for the three hackathon milestones.
  document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.setProperty('--round-index', String(index));
    item.style.setProperty('--round-delay', `${index * 180}ms`);
  });

  // Floating soundtrack player. Playback starts only after the visitor presses Play.
  const music = document.getElementById('site-music');
  const musicPlayer = document.getElementById('music-player');
  const musicToggle = document.getElementById('music-toggle');
  const musicVolume = document.getElementById('music-volume');
  const musicState = document.getElementById('music-state');

  if (music && musicPlayer && musicToggle) {
    music.volume = musicVolume ? Number(musicVolume.value) : 0.5;

    const syncMusicUI = (playing) => {
      musicPlayer.classList.toggle('is-playing', playing);
      musicToggle.setAttribute('aria-pressed', String(playing));
      musicToggle.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
      if (musicState) musicState.textContent = playing ? 'ON' : 'OFF';
    };

    musicToggle.addEventListener('click', async () => {
      if (music.paused) {
        try {
          await music.play();
          syncMusicUI(true);
        } catch (error) {
          syncMusicUI(false);
          if (musicState) musicState.textContent = 'TAP';
          console.warn('Background music could not start:', error);
        }
      } else {
        music.pause();
        syncMusicUI(false);
      }
    });

    if (musicVolume) {
      musicVolume.addEventListener('input', () => {
        music.volume = Number(musicVolume.value);
        music.muted = music.volume === 0;
      });
    }

    music.addEventListener('play', () => syncMusicUI(true));
    music.addEventListener('pause', () => syncMusicUI(false));
    music.addEventListener('ended', () => {
      // The audio element is looped; this is a safety UI sync for browser edge cases.
      if (music.loop) syncMusicUI(true);
      else syncMusicUI(false);
    });
    music.addEventListener('error', () => {
      syncMusicUI(false);
      if (musicState) musicState.textContent = 'ERR';
    });
    syncMusicUI(false);
  }

  // Tell the loader that interactive page setup has completed.
  if (typeof window.__buildHerBharatAppReady === 'function') window.__buildHerBharatAppReady();

})();
