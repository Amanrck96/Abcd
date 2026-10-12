/**
 * A’bcd — All ’Bout Creativity and Designs
 * A Community Initiative by AAREN INTPRO
 * Client-Side Logic, Modal Controllers, Form Handlers & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Toast Notification Helper
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  const showToast = (message, duration = 3500) => {
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

  // 3. Membership Modal Triggers ("BECOME A MEMBER" / "JOIN THE COMMUNITY" / "JOIN A'BCD")
  document.querySelectorAll('.open-membership-modal').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('membershipModal');
    });
  });

  // 4. Contact Modal Triggers ("GET IN TOUCH" / "Contact Us")
  const contactTriggers = [
    document.getElementById('navContactTrigger'),
    document.getElementById('finalContactBtn'),
    document.getElementById('openContactModal')
  ];

  contactTriggers.forEach((btn) => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('contactModal');
    });
  });

  // 5. Legal Modals
  document.getElementById('openTermsModal')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('termsModal');
  });

  document.getElementById('openPrivacyModal')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('privacyModal');
  });

  // 6. Smooth Scroll for "DISCOVER A'BCD"
  document.getElementById('heroSecondaryBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('community');
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });

  // 7. Membership Form Interactive Submission (Modal & Dedicated Page)
  const handleMembershipSubmit = (form, isModal = false) => {
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span>Submitting Application...</span>';

      setTimeout(() => {
        btn.innerHTML = '<span>Application Received ✓</span>';
        btn.style.backgroundColor = '#81663F';
        showToast('Welcome to A’bcd. Your application has been submitted to the curation committee.');

        setTimeout(() => {
          form.reset();
          btn.disabled = false;
          btn.innerHTML = originalText;
          btn.style.backgroundColor = '';
          if (isModal) {
            closeModal(document.getElementById('membershipModal'));
          }
        }, 1600);
      }, 700);
    });
  };

  handleMembershipSubmit(document.getElementById('membershipForm'), true);
  handleMembershipSubmit(document.getElementById('pageMembershipForm'), false);

  // 8. Contact Form Interactive Submission (Modal & Dedicated Page)
  const handleContactSubmit = (form, isModal = false) => {
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span>Transmitting Message...</span>';

      setTimeout(() => {
        btn.innerHTML = '<span>Message Dispatched ✓</span>';
        btn.style.backgroundColor = '#81663F';
        showToast('Thank you. A’bcd community team will connect with you shortly.');

        setTimeout(() => {
          form.reset();
          btn.disabled = false;
          btn.innerHTML = originalText;
          btn.style.backgroundColor = '';
          if (isModal) {
            closeModal(document.getElementById('contactModal'));
          }
        }, 1600);
      }, 600);
    });
  };

  handleContactSubmit(document.getElementById('contactForm'), true);
  handleContactSubmit(document.getElementById('pageContactForm'), false);

  // 9. Store Direct Links Feedback
  document.querySelectorAll('.download-link-ios, .store-badge-pill[href*="apple"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast('Opening iOS App Store for A’bcd...');
    });
  });

  document.querySelectorAll('.download-link-android, .store-badge-pill[href*="google"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast('Opening Google Play Store for A’bcd...');
    });
  });

  // 10. Scroll Reveal Animations (IntersectionObserver)
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
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // 11. Header Elevation on Scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      header.style.boxShadow = '0 4px 20px rgba(18, 17, 16, 0.08)';
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
    } else {
      header.style.boxShadow = 'none';
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.96)';
    }
  });

  // 12. Cookie Consent Handling
  const cookieConsent = document.getElementById('cookieConsent');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');

  const cookieChoice = localStorage.getItem('abcd_community_cookie_consent');
  if (cookieChoice) {
    cookieConsent?.classList.add('hidden');
  }

  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem('abcd_community_cookie_consent', 'accepted');
    cookieConsent?.classList.add('hidden');
    showToast('Preferences recorded');
  });

  cookieDecline?.addEventListener('click', () => {
    localStorage.setItem('abcd_community_cookie_consent', 'declined');
    cookieConsent?.classList.add('hidden');
    showToast('Preferences recorded');
  });
});
