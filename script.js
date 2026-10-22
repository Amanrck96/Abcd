/**
 * ABCD — All 'Bout Creativity & Design
 * Client-Side Controller & Presentation Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Shadow on Scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Mobile Menu Navigation Drawer
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside header
    document.addEventListener('click', (e) => {
      if (!header?.contains(e.target) && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. Active Navigation State Tracking via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { rootMargin: '-30% 0px -40% 0px' });

  sections.forEach(section => navObserver.observe(section));

  // 4. Interactive Phone Card Switcher (Recreates Slide 1, 3, 4, 5 live cards)
  const phoneCards = [
    {
      category: 'Inspirations + References',
      headline: 'The Poetics of Monolithic Concrete: Purity in Spatial Form',
      text: 'Behind every remarkable structure is a person with an idea. Raw board-formed concrete, dramatic natural lightwells, and quiet minimalist proportions redefine contemplative spaces for the contemporary era.',
      image: 'images/material-library.jpg',
      meta: '60 words • Curated by A\'bcd Studio'
    },
    {
      category: 'Events & Salons',
      headline: 'Salon #04: Dense Urbanism and the Architecture of Solitude',
      text: 'Join 40 leading architects, urbanists, and interior designers in an intimate roundtable exploring the future of high-density living, acoustic sanctuaries, and human-centric communal spaces.',
      image: 'experiences_salon.jpg',
      meta: 'Milan & London • Limited to 40 Practitioners'
    },
    {
      category: 'Architectural Travel',
      headline: 'Kyoto Pavilion Studies: Modernist Timber Meets Zen Joinery',
      text: 'An exclusive five-day architectural expedition through traditional teahouses, contemporary cedar pavilions, and water courtyards led by Japanese master craftsmen and contemporary architects.',
      image: 'images/travel_kyoto.jpg',
      meta: '5 Days • Kyoto & Uji • Autumn 2026'
    },
    {
      category: 'Networking',
      headline: 'Creative Directory: 12,000+ Architects & Interior Designers',
      text: 'A\'bcd connects the creative fraternity across disciplines. Exchange ideas, discover material sources, collaborate on international competitions, and build relationships beyond the drawing board.',
      image: 'about_vision.jpg',
      meta: 'London • Copenhagen • Mumbai • Tokyo'
    }
  ];

  let currentCardIndex = 0;
  const phoneBadge = document.getElementById('phoneCardBadge');
  const phoneImg = document.getElementById('phoneCardImg');
  const phoneHeadline = document.getElementById('phoneCardHeadline');
  const phoneText = document.getElementById('phoneCardText');
  const phoneMeta = document.getElementById('phoneCardMeta');
  const phoneDots = document.querySelectorAll('.phone-dot');

  const updatePhoneCard = (index) => {
    currentCardIndex = (index + phoneCards.length) % phoneCards.length;
    const card = phoneCards[currentCardIndex];

    if (phoneBadge) phoneBadge.textContent = card.category;
    if (phoneImg) {
      phoneImg.style.opacity = '0.3';
      setTimeout(() => {
        phoneImg.src = card.image;
        phoneImg.alt = card.headline;
        phoneImg.style.opacity = '1';
      }, 150);
    }
    if (phoneHeadline) phoneHeadline.textContent = card.headline;
    if (phoneText) phoneText.textContent = card.text;
    if (phoneMeta) phoneMeta.textContent = card.meta;

    phoneDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentCardIndex);
    });
  };

  document.getElementById('phoneNextBtn')?.addEventListener('click', () => updatePhoneCard(currentCardIndex + 1));
  document.getElementById('phonePrevBtn')?.addEventListener('click', () => updatePhoneCard(currentCardIndex - 1));

  phoneDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
      updatePhoneCard(idx);
    });
  });

  // Tap phone card to read full short
  document.getElementById('phoneLiveCard')?.addEventListener('click', () => {
    const card = phoneCards[currentCardIndex];
    openReaderModal(card.category, card.headline, card.text, card.image, card.meta);
  });

  // 5. Inspirations Category Filter Bar
  const filterButtons = document.querySelectorAll('.filter-btn');
  const inspirationCards = document.querySelectorAll('.inspirations-grid .card-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';
      inspirationCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Reader Modal for 60-word Shorts
  const readerDlg = document.getElementById('cardDetailDlg');
  const readerCategory = document.getElementById('readerCategory');
  const readerTitle = document.getElementById('readerTitle');
  const readerImage = document.getElementById('readerImage');
  const readerShort = document.getElementById('readerShort');
  const readerMeta = document.getElementById('readerMeta');

  const openReaderModal = (cat, title, text, img, meta) => {
    if (!readerDlg) return;
    if (readerCategory) readerCategory.textContent = cat;
    if (readerTitle) readerTitle.textContent = title;
    if (readerShort) readerShort.textContent = text;
    if (readerImage) {
      readerImage.src = img;
      readerImage.alt = title;
    }
    if (readerMeta) readerMeta.textContent = meta;
    readerDlg.showModal();
  };

  // Wire cards with "Read 60-word Short"
  document.querySelectorAll('[data-read-short]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const parentCard = trigger.closest('.card-item');
      if (parentCard) {
        const cat = parentCard.querySelector('.card-tag')?.textContent || 'Inspirations';
        const title = parentCard.querySelector('.card-title')?.textContent || 'ABCD Short';
        const text = parentCard.querySelector('.card-excerpt')?.textContent || '';
        const img = parentCard.querySelector('.card-media img')?.getAttribute('src') || 'images/material-library.jpg';
        const meta = parentCard.querySelector('.card-meta-row')?.textContent || '';
        openReaderModal(cat, title, text, img, meta);
      }
    });
  });

  // 7. Dialog Controllers & Backdrop Click
  document.querySelectorAll('[data-open]').forEach(button => {
    button.addEventListener('click', () => {
      const dlgId = button.getAttribute('data-open');
      const dlg = document.getElementById(dlgId);
      if (dlg) {
        // Optional pre-fill for event or travel
        const eventName = button.getAttribute('data-event-name');
        if (eventName) {
          const noteField = dlg.querySelector('textarea[name="msg"]') || dlg.querySelector('input[name="event_note"]');
          if (noteField) noteField.value = `RSVP for: ${eventName}`;
        }
        const travelDest = button.getAttribute('data-travel-dest');
        if (travelDest) {
          const noteField = dlg.querySelector('textarea[name="msg"]');
          if (noteField) noteField.value = `Inquiry regarding architectural expedition: ${travelDest}`;
        }

        const okMsg = dlg.querySelector('.form-feedback-ok');
        if (okMsg) okMsg.style.display = 'none';
        dlg.showModal();
      }
    });
  });

  document.querySelectorAll('[data-close]').forEach(button => {
    button.addEventListener('click', () => {
      const dlg = button.closest('dialog');
      if (dlg) dlg.close();
    });
  });

  document.querySelectorAll('dialog').forEach(dlg => {
    dlg.addEventListener('click', (e) => {
      const rect = dlg.getBoundingClientRect();
      const inDialog = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!inDialog) dlg.close();
    });
  });

  // 8. Form Submissions
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = form.querySelector('.form-feedback-ok');
      if (ok) ok.style.display = 'block';
      setTimeout(() => {
        form.reset();
      }, 400);
    });
  });

  // 9. Brands Carousel Infinite Loop with Arrows & Keyboard
  (() => {
    const vp = document.getElementById('brandViewport');
    const tr = document.getElementById('brandTrack');
    if (!vp || !tr) return;

    const originals = [...tr.children];
    if (!originals.length) return;

    // Duplicate until track is sufficiently wide
    const minWidth = Math.max(window.innerWidth * 2, 1800);
    while (tr.scrollWidth < minWidth) {
      originals.forEach(item => tr.appendChild(item.cloneNode(true)));
    }

    const gap = 20;
    const stepWidth = () => (originals[0] ? originals[0].offsetWidth + gap : 190);
    const loopWidth = () => stepWidth() * originals.length;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let position = 0;
    let isPaused = false;
    let lastTime = 0;
    let isManualAnimating = false;

    const render = () => {
      const L = loopWidth();
      if (L <= 0) return;
      position = ((position % L) + L) % L;
      tr.style.transform = `translateX(${-position}px)`;
    };

    const step = (now) => {
      if (!lastTime) lastTime = now;
      const dt = now - lastTime;
      lastTime = now;

      if (!isPaused && !prefersReducedMotion && !isManualAnimating) {
        position += dt * 0.035;
        render();
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    const shift = (direction) => {
      isPaused = true;
      isManualAnimating = true;
      const start = position;
      const target = position + direction * stepWidth();
      const startTime = performance.now();

      const easeAnimation = (time) => {
        const progress = Math.min(1, (time - startTime) / 400);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        position = start + (target - start) * easeOut;
        render();

        if (progress < 1) {
          requestAnimationFrame(easeAnimation);
        } else {
          isManualAnimating = false;
          setTimeout(() => { isPaused = false; }, 1200);
        }
      };
      requestAnimationFrame(easeAnimation);
    };

    document.getElementById('brandNext')?.addEventListener('click', () => shift(1));
    document.getElementById('brandPrev')?.addEventListener('click', () => shift(-1));

    vp.addEventListener('mouseenter', () => { isPaused = true; });
    vp.addEventListener('mouseleave', () => { if (!isManualAnimating) isPaused = false; });
    vp.addEventListener('focus', () => { isPaused = true; });
    vp.addEventListener('blur', () => { if (!isManualAnimating) isPaused = false; });

    vp.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        shift(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        shift(-1);
      }
    });
  })();

  // 10. Cookie Notice Banner
  const cookieBanner = document.getElementById('cookieBanner');
  if (cookieBanner) {
    try {
      if (localStorage.getItem('abcd_cookie_consent')) {
        cookieBanner.remove();
      }
    } catch (e) {}

    document.getElementById('cookieAccept')?.addEventListener('click', () => {
      try { localStorage.setItem('abcd_cookie_consent', 'accepted'); } catch (e) {}
      cookieBanner.remove();
    });

    document.getElementById('cookieDecline')?.addEventListener('click', () => {
      try { localStorage.setItem('abcd_cookie_consent', 'declined'); } catch (e) {}
      cookieBanner.remove();
    });
  }
});
