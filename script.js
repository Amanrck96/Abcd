/**
 * A'bcd — Client-Side Logic & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    } else {
      header.style.boxShadow = 'none';
    }
  });

  // 2. Cookie Consent Banner Handling
  const cookieConsent = document.getElementById('cookieConsent');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');

  const cookieChoice = localStorage.getItem('abcd_cookie_consent');
  if (cookieChoice) {
    cookieConsent.classList.add('hidden');
  }

  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem('abcd_cookie_consent', 'accepted');
    cookieConsent.classList.add('hidden');
  });

  cookieDecline?.addEventListener('click', () => {
    localStorage.setItem('abcd_cookie_consent', 'declined');
    cookieConsent.classList.add('hidden');
  });

  // 3. Modal Helpers
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

  // 4. Modal Triggers
  document.getElementById('openContactModal')?.addEventListener('click', () => {
    openModal('contactModal');
  });

  document.getElementById('openTermsModal')?.addEventListener('click', () => {
    openModal('termsModal');
  });

  document.getElementById('openPrivacyModal')?.addEventListener('click', () => {
    openModal('privacyModal');
  });

  // Store download buttons open the download modal
  const appStoreBtn = document.getElementById('appStoreBtn');
  const googlePlayBtn = document.getElementById('googlePlayBtn');

  [appStoreBtn, googlePlayBtn].forEach((btn) => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('downloadModal');
    });
  });

  // 5. Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';

    setTimeout(() => {
      btn.textContent = 'Message Sent! ✓';
      btn.style.backgroundColor = '#16a34a';

      setTimeout(() => {
        contactForm.reset();
        btn.disabled = false;
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        closeModal(document.getElementById('contactModal'));
      }, 1500);
    }, 800);
  });
});
