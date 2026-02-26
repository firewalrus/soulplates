/* ===========================
   Soulplates - Interactions
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Smooth Scroll (Lenis) ---
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // --- Sticky Navigation with backdrop change ---
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // --- Mobile Hamburger Menu ---
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight + 20;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // --- Scroll-triggered Fade-in Animations (Intersection Observer) ---
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    // Fallback: show everything
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- Hover States for Cards ---
  // Handled via CSS transitions, no JS needed

  // --- Marquee pause on reduced-motion preference ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    document.querySelectorAll('.marquee-row').forEach(row => {
      row.style.animationPlayState = 'paused';
    });
  }

  // --- Waitlist Form → Google Forms (fetch) ---
  const waitlistForm = document.getElementById('waitlist-form');
  const waitlistSuccess = document.getElementById('waitlist-success');

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('waitlist-email').value;

      // Submit to Google Forms silently in the background
      const body = new URLSearchParams();
      body.append('entry.1073329250', email);

      fetch('https://docs.google.com/forms/d/e/1FAIpQLSfVUldKBY6rtKJuGF0T_8oMj4D6CVyQYYax6KyiJRkBxmexpg/formResponse', {
        method: 'POST',
        mode: 'no-cors',
        body
      }).catch((err) => console.warn('Form submission error:', err));

      // Animate the transition
      waitlistForm.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      waitlistForm.style.opacity = '0';
      waitlistForm.style.transform = 'translateY(-10px)';

      setTimeout(() => {
        waitlistForm.style.display = 'none';
        if (waitlistSuccess) {
          waitlistSuccess.style.display = 'block';
          waitlistSuccess.offsetHeight;
          waitlistSuccess.classList.add('visible');
        }
      }, 400);
    });
  }

  // --- How It Works Interactive ---
  const hiwSteps = document.querySelectorAll('.hiw-step');
  const hiwImages = document.querySelectorAll('.hiw-mockup-image');
  const hiwPrev = document.querySelector('.hiw-btn--prev');
  const hiwNext = document.querySelector('.hiw-btn--next');
  const hiwMobileTitle = document.querySelector('.hiw-mobile-title');
  const hiwMobileDesc = document.querySelector('.hiw-mobile-desc');

  if (hiwSteps.length && hiwImages.length) {
    let currentStep = 0;
    const totalSteps = hiwSteps.length;

    const stepsData = Array.from(hiwSteps).map(step => ({
      title: step.querySelector('h3').textContent,
      desc: step.querySelector('p').textContent,
    }));

    function updateButtons() {
      if (hiwPrev) {
        hiwPrev.disabled = currentStep === 0;
        hiwPrev.classList.toggle('hiw-btn--disabled', currentStep === 0);
      }
      if (hiwNext) {
        hiwNext.disabled = currentStep === totalSteps - 1;
        hiwNext.classList.toggle('hiw-btn--disabled', currentStep === totalSteps - 1);
      }
    }

    function activateStep(index) {
      currentStep = index;

      hiwSteps.forEach((s, i) => s.classList.toggle('active', i === index));
      hiwImages.forEach((img, i) => img.classList.toggle('active', i === index));

      if (hiwMobileTitle) hiwMobileTitle.textContent = stepsData[index].title;
      if (hiwMobileDesc) hiwMobileDesc.textContent = stepsData[index].desc;

      updateButtons();
    }

    // Initialize with step 0
    activateStep(0);

    // Desktop: click on step item
    hiwSteps.forEach((step, i) => {
      step.addEventListener('click', () => activateStep(i));
    });

    // Mobile: previous button
    if (hiwPrev) {
      hiwPrev.addEventListener('click', () => {
        if (currentStep > 0) activateStep(currentStep - 1);
      });
    }

    // Mobile: next button
    if (hiwNext) {
      hiwNext.addEventListener('click', () => {
        if (currentStep < totalSteps - 1) activateStep(currentStep + 1);
      });
    }
  }

  // --- Hero Card Overlay Sequence ---
  const heroCards = document.querySelectorAll('.hero-float-card[data-reveal-order]');

  if (heroCards.length) {
    const heroSection = document.getElementById('hero');
    const heroMobileQuery = window.matchMedia('(max-width: 809px)');
    const isHeroMobile = () => heroMobileQuery.matches;

    // Sort cards by their reveal order so timing is consistent.
    const orderedCards = Array.from(heroCards).sort((a, b) => {
      const aOrder = parseInt(a.dataset.revealOrder || '0', 10);
      const bOrder = parseInt(b.dataset.revealOrder || '0', 10);
      return aOrder - bOrder;
    });

    let sequenceRunning = false;
    let sequenceCompleted = false;
    let previousBodyOverflow = '';
    let previousHtmlOverflow = '';
    let lastScrollY = window.scrollY || 0;

    function hideHeroCards() {
      // Only hide cards for the mobile overlay sequence;
      // on desktop/tablet they should always be visible.
      if (!isHeroMobile()) {
        orderedCards.forEach(card => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
          card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        return;
      }

      orderedCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px) scale(0.9)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      });
    }

    function lockScroll() {
      previousBodyOverflow = document.body.style.overflow || '';
      previousHtmlOverflow = document.documentElement.style.overflow || '';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    function unlockScroll() {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    }

    function resetHeroSequence() {
      sequenceRunning = false;
      sequenceCompleted = false;
      heroSection.classList.remove('hero-overlay-active');
      hideHeroCards();
      unlockScroll();
    }

    hideHeroCards();

    // Ensure z-index stacking so later cards appear "on top"
    orderedCards.forEach((card, index) => {
      card.style.zIndex = String(10 + index);
    });

    function startHeroSequence() {
      if (sequenceRunning || sequenceCompleted || !isHeroMobile()) return;

      sequenceRunning = true;
      lockScroll();
      heroSection.classList.add('hero-overlay-active');

      const baseDelay = 100;
      const stepDelay = 260; // faster cadence so all cards appear while hero is visible

      orderedCards.forEach((card, index) => {
        const delay = baseDelay + index * stepDelay;
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, delay);
      });

      const totalDuration = baseDelay + orderedCards.length * stepDelay + 200;
      setTimeout(() => {
        unlockScroll();
        sequenceRunning = false;
        sequenceCompleted = true;
      }, totalDuration);
    }

    function reverseHeroSequence() {
      if (sequenceRunning || !sequenceCompleted || !isHeroMobile()) return;

      sequenceRunning = true;

      const baseDelay = 80;
      const stepDelay = 160;
      const reversed = [...orderedCards].reverse();

      reversed.forEach((card, index) => {
        const delay = baseDelay + index * stepDelay;
        setTimeout(() => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(24px) scale(0.9)';
        }, delay);
      });

      const totalDuration = baseDelay + reversed.length * stepDelay + 260;
      setTimeout(() => {
        heroSection.classList.remove('hero-overlay-active');
        sequenceRunning = false;
        sequenceCompleted = false;
      }, totalDuration);
    }

    function handleHeroScroll() {
      const currentY = window.scrollY || 0;
      const scrollingUp = currentY < lastScrollY;
      lastScrollY = currentY;

      if (!isHeroMobile()) {
        // Desktop / tablet: keep hero static with all cards visible.
        sequenceRunning = false;
        sequenceCompleted = false;
        unlockScroll();
        heroSection.classList.remove('hero-overlay-active');

        orderedCards.forEach(card => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
          card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        return;
      }

      const viewportHeight = window.innerHeight;
      const heroRect = heroSection.getBoundingClientRect();

      // Trigger sequence a bit earlier in the scroll so the blur/cards
      // start sooner as you approach the end of the hero.
      const forwardTrigger =
        heroRect.bottom <= viewportHeight * 1.05 &&
        heroRect.bottom >= viewportHeight * 0.5;

      // Reverse trigger: while scrolling back up, with hero visible again.
      const heroVisible = heroRect.bottom > 0 && heroRect.top < viewportHeight;

      if (!sequenceCompleted && !sequenceRunning && !scrollingUp && forwardTrigger) {
        startHeroSequence();
      }

      if (sequenceCompleted && !sequenceRunning && scrollingUp && heroVisible) {
        reverseHeroSequence();
      }
    }

    window.addEventListener('scroll', handleHeroScroll, { passive: true });
    handleHeroScroll();
  }
});
