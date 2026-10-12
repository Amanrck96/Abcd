/**
 * A'bcd — Client-Side Logic, Animations & Download Handlers
 * A Venture by Aaren Intpro
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Toast Notification Helper
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  const showToast = (message, duration = 3000) => {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotification.classList.add('active');
    
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('active');
    }, duration);
  };

  // 2. Modal Controller
  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = (modal) => {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  // Close modals on close button or click outside
  document.querySelectorAll('.modal-overlay').forEach((modal) => {
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn?.addEventListener('click', () => closeModal(modal));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach((modal) => {
        closeModal(modal);
      });
    }
  });

  // 3. Modal Triggers
  document.getElementById('openContactModal')?.addEventListener('click', () => {
    openModal('contactModal');
  });

  document.getElementById('openTermsModal')?.addEventListener('click', () => {
    openModal('termsModal');
  });

  document.getElementById('openPrivacyModal')?.addEventListener('click', () => {
    openModal('privacyModal');
  });

  document.querySelectorAll('.open-download-modal').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('downloadModal');
    });
  });

  document.getElementById('quickScanBtn')?.addEventListener('click', () => {
    openModal('downloadModal');
  });

  // 4. Download Trigger Handling (Desktop & Mobile device awareness)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = /Android/.test(navigator.userAgent);

  const handleDownloadAction = (source = 'button') => {
    if (isIOS) {
      showToast('Opening iOS App Store...');
      setTimeout(() => {
        window.open('https://apps.apple.com', '_blank');
      }, 400);
    } else if (isAndroid) {
      showToast('Opening Google Play Store...');
      setTimeout(() => {
        window.open('https://play.google.com/store', '_blank');
      }, 400);
    } else {
      // Desktop: Open the comprehensive download modal with QR scan & links
      openModal('downloadModal');
      showToast('Scan QR code with your phone or select your store');
    }
  };

  // Connect download buttons
  document.querySelectorAll('.download-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // If user clicked an anchor with hash #download on desktop, let smooth scroll happen or open modal
      const source = btn.getAttribute('data-source') || 'cta';
      if (window.innerWidth <= 768) {
        e.preventDefault();
        handleDownloadAction(source);
      } else {
        // On desktop, clicking "BE PART OF A’BCD" opens download modal if desired or scrolls smoothly
        // If it's a hero primary CTA or header, we can open the modal directly for instant download experience!
        if (source === 'hero-primary' || source === 'header-nav') {
          e.preventDefault();
          openModal('downloadModal');
        }
      }
    });
  });

  // Store direct links feedback
  const iosButtons = document.querySelectorAll('.download-btn-ios, .download-link-ios, .modal-download-ios');
  iosButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast('Connecting to Apple App Store...');
    });
  });

  const androidButtons = document.querySelectorAll('.download-btn-android, .download-link-android, .modal-download-android');
  androidButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast('Connecting to Google Play Store...');
    });
  });

  // 5. Scroll Reveal & Intersection Observer Animations
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // 6. Stats Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimatedStats = false;

  const animateCounters = () => {
    if (hasAnimatedStats) return;
    hasAnimatedStats = true;

    statNumbers.forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 1600; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing: easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = ease * target;

        if (isDecimal) {
          counter.textContent = currentVal.toFixed(1);
        } else {
          counter.textContent = Math.floor(currentVal);
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = isDecimal ? target.toFixed(1) : target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const statsSection = document.getElementById('stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  }

  // 7. Header Elevation on Scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      header.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.08)';
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
    } else {
      header.style.boxShadow = 'none';
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.94)';
    }
  });

  // 8. Cookie Consent Handling
  const cookieConsent = document.getElementById('cookieConsent');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');

  const cookieChoice = localStorage.getItem('abcd_cookie_consent');
  if (cookieChoice) {
    cookieConsent?.classList.add('hidden');
  }

  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem('abcd_cookie_consent', 'accepted');
    cookieConsent?.classList.add('hidden');
    showToast('Preferences saved');
  });

  cookieDecline?.addEventListener('click', () => {
    localStorage.setItem('abcd_cookie_consent', 'declined');
    cookieConsent?.classList.add('hidden');
    showToast('Preferences saved');
  });

  // 9. Contact Form Interactive Submission
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Transmitting...';

    setTimeout(() => {
      btn.textContent = 'Inquiry Sent! ✓';
      btn.style.backgroundColor = '#16a34a';
      showToast('Thank you. A’bcd editorial team will connect shortly.');

      setTimeout(() => {
        contactForm.reset();
        btn.disabled = false;
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        closeModal(document.getElementById('contactModal'));
      }, 1600);
    }, 700);
  });
});
