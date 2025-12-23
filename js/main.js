/**
 * ATMOS TECHNICS - Main JavaScript
 * Plombier & Chauffagiste Bruxelles
 * Mobile-first, vanilla JS
 */

(function() {
  'use strict';

  // ==========================================================================
  // DOM Ready
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initDesktopDropdowns();
    initStickyHeader();
    initFAQAccordion();
    initSmoothScroll();
    initFormValidation();
    initLazyLoading();
  });

  // ==========================================================================
  // Desktop Dropdowns (click to toggle)
  // ==========================================================================
  function initDesktopDropdowns() {
    const dropdownLinks = document.querySelectorAll('.nav-link.has-dropdown');

    dropdownLinks.forEach(function(link) {
      const parent = link.closest('.nav-item');
      const dropdown = parent.querySelector('.dropdown');

      if (!dropdown) return;

      // Click to toggle dropdown
      link.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Close other dropdowns
        document.querySelectorAll('.nav-item.dropdown-open').forEach(function(item) {
          if (item !== parent) {
            item.classList.remove('dropdown-open');
          }
        });

        parent.classList.toggle('dropdown-open');
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav-item')) {
        document.querySelectorAll('.nav-item.dropdown-open').forEach(function(item) {
          item.classList.remove('dropdown-open');
        });
      }
    });
  }

  // ==========================================================================
  // Mobile Menu
  // ==========================================================================
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item.has-dropdown');
    const body = document.body;

    if (!menuToggle || !mobileNav) return;

    // Toggle main menu
    menuToggle.addEventListener('click', function() {
      const isActive = this.classList.toggle('active');
      mobileNav.classList.toggle('active');
      body.style.overflow = isActive ? 'hidden' : '';

      // Update ARIA
      this.setAttribute('aria-expanded', isActive);
      mobileNav.setAttribute('aria-hidden', !isActive);
    });

    // Toggle dropdown submenus
    mobileNavItems.forEach(function(item) {
      const link = item.querySelector('.mobile-nav-link');

      link.addEventListener('click', function(e) {
        // Only prevent if has dropdown
        if (item.classList.contains('has-dropdown')) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        body.style.overflow = '';
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (mobileNav.classList.contains('active') &&
          !mobileNav.contains(e.target) &&
          !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        body.style.overflow = '';
      }
    });
  }

  // ==========================================================================
  // Sticky Header
  // ==========================================================================
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    function handleScroll() {
      const currentScroll = window.pageYOffset;

      // Add/remove scrolled class for shadow
      if (currentScroll > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Optional: Hide header on scroll down, show on scroll up
      // Uncomment below if desired
      /*
      if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      */

      lastScroll = currentScroll;
    }

    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ==========================================================================
  // FAQ Accordion
  // ==========================================================================
  function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (!question || !answer) return;

      // Set initial ARIA states
      const isExpanded = item.classList.contains('active');
      question.setAttribute('aria-expanded', isExpanded);
      answer.setAttribute('aria-hidden', !isExpanded);

      question.addEventListener('click', function() {
        const wasActive = item.classList.contains('active');

        // Close all other items (optional - for accordion behavior)
        faqItems.forEach(function(otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherQuestion = otherItem.querySelector('.faq-question');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
            if (otherAnswer) otherAnswer.setAttribute('aria-hidden', 'true');
          }
        });

        // Toggle current item
        item.classList.toggle('active');
        const isNowExpanded = item.classList.contains('active');
        question.setAttribute('aria-expanded', isNowExpanded);
        answer.setAttribute('aria-hidden', !isNowExpanded);
      });

      // Keyboard support
      question.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  }

  // ==========================================================================
  // Smooth Scroll
  // ==========================================================================
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Skip if just "#" or no target
        if (href === '#' || href === '') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        // Calculate offset for sticky header
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const mobileNav = document.querySelector('.mobile-nav');
        const menuToggle = document.querySelector('.menu-toggle');
        if (mobileNav && mobileNav.classList.contains('active')) {
          mobileNav.classList.remove('active');
          menuToggle.classList.remove('active');
          document.body.style.overflow = '';
        }

        // Update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  // ==========================================================================
  // Form Validation
  // ==========================================================================
  function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        // Clear previous errors
        form.querySelectorAll('.form-error').forEach(function(error) {
          error.remove();
        });
        form.querySelectorAll('.error').forEach(function(field) {
          field.classList.remove('error');
        });

        requiredFields.forEach(function(field) {
          if (!validateField(field)) {
            isValid = false;
          }
        });

        if (!isValid) {
          e.preventDefault();
          // Focus first invalid field
          const firstError = form.querySelector('.error');
          if (firstError) {
            firstError.focus();
          }
        }
      });

      // Real-time validation on blur
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
          if (this.hasAttribute('required')) {
            validateField(this);
          }
        });

        // Clear error on input
        input.addEventListener('input', function() {
          this.classList.remove('error');
          const errorMsg = this.parentNode.querySelector('.form-error');
          if (errorMsg) errorMsg.remove();
        });
      });
    });
  }

  function validateField(field) {
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) existingError.remove();

    // Check if empty
    if (!field.value.trim()) {
      isValid = false;
      errorMessage = 'Ce champ est obligatoire';
    }
    // Email validation
    else if (field.type === 'email' && !isValidEmail(field.value)) {
      isValid = false;
      errorMessage = 'Veuillez entrer une adresse email valide';
    }
    // Phone validation
    else if (field.type === 'tel' && !isValidPhone(field.value)) {
      isValid = false;
      errorMessage = 'Veuillez entrer un numéro de téléphone valide';
    }

    if (!isValid) {
      field.classList.add('error');
      const error = document.createElement('span');
      error.className = 'form-error';
      error.textContent = errorMessage;
      error.style.cssText = 'color: #dc3545; font-size: 0.8125rem; display: block; margin-top: 4px;';
      field.parentNode.appendChild(error);
    }

    return isValid;
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function isValidPhone(phone) {
    // Belgian phone format - flexible
    const re = /^[\d\s\-\+\(\)]{9,}$/;
    return re.test(phone.replace(/\s/g, ''));
  }

  // ==========================================================================
  // Lazy Loading
  // ==========================================================================
  function initLazyLoading() {
    // Native lazy loading support check
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      lazyImages.forEach(function(img) {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    } else {
      // Fallback for browsers that don't support native lazy loading
      const lazyImages = document.querySelectorAll('img[data-src]');

      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          });
        }, {
          rootMargin: '50px 0px',
          threshold: 0.01
        });

        lazyImages.forEach(function(img) {
          imageObserver.observe(img);
        });
      } else {
        // Fallback: load all images
        lazyImages.forEach(function(img) {
          img.src = img.dataset.src;
        });
      }
    }
  }

  // ==========================================================================
  // Utility: Track Phone Clicks (Analytics)
  // ==========================================================================
  window.trackPhoneClick = function() {
    // Google Analytics event tracking
    if (typeof gtag === 'function') {
      gtag('event', 'click', {
        'event_category': 'Contact',
        'event_label': 'Phone Click',
        'value': 1
      });
    }
    // Facebook Pixel
    if (typeof fbq === 'function') {
      fbq('track', 'Contact');
    }
  };

  // ==========================================================================
  // Utility: Track Form Submissions
  // ==========================================================================
  window.trackFormSubmit = function(formName) {
    if (typeof gtag === 'function') {
      gtag('event', 'submit', {
        'event_category': 'Form',
        'event_label': formName,
        'value': 1
      });
    }
    if (typeof fbq === 'function') {
      fbq('track', 'Lead');
    }
  };

})();
