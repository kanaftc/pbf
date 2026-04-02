/**
 * ATMOS TECHNICS - Main JavaScript
 * Plombier & Chauffagiste certifié à Bruxelles
 */

(function() {
  'use strict';

  // --------------------------------------------------------------------------
  // DOM Ready
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initMobileMenu();
    initStickyHeader();
    initDropdowns();
    initFaqAccordion();
    initSmoothScroll();
    initFormValidation();
    initLazyLoading();
  }

  // --------------------------------------------------------------------------
  // Mobile Menu
  // --------------------------------------------------------------------------
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('is-open');
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close menu on link click
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
        document.body.style.overflow = '';
        menuToggle.focus();
      }
    });
  }

  // --------------------------------------------------------------------------
  // Sticky Header
  // --------------------------------------------------------------------------
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
      const scrollY = window.scrollY;

      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScrollY = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // Dropdown Menus (Mobile)
  // --------------------------------------------------------------------------
  function initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.nav-item.has-dropdown > .nav-link');

    dropdownToggles.forEach(function(toggle) {
      toggle.addEventListener('click', function(e) {
        // Only prevent default on mobile
        if (window.innerWidth < 769) {
          e.preventDefault();
          const parent = this.parentElement;
          const isOpen = parent.classList.contains('is-open');

          // Close all other dropdowns
          document.querySelectorAll('.nav-item.has-dropdown').forEach(function(item) {
            item.classList.remove('is-open');
          });

          // Toggle current dropdown
          if (!isOpen) {
            parent.classList.add('is-open');
          }
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // FAQ Accordion
  // --------------------------------------------------------------------------
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (!question || !answer) return;

      // Set initial ARIA attributes
      const answerId = 'faq-answer-' + Math.random().toString(36).substr(2, 9);
      answer.id = answerId;
      question.setAttribute('aria-expanded', 'false');
      question.setAttribute('aria-controls', answerId);

      question.addEventListener('click', function() {
        const isOpen = item.classList.contains('is-open');

        // Close all other FAQ items (optional - remove for independent toggles)
        faqItems.forEach(function(otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('is-open');
            otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        item.classList.toggle('is-open');
        this.setAttribute('aria-expanded', !isOpen);
      });

      // Keyboard support
      question.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Smooth Scroll for Anchor Links
  // --------------------------------------------------------------------------
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerHeight = document.querySelector('.site-header').offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without scrolling
        history.pushState(null, null, href);
      });
    });
  }

  // --------------------------------------------------------------------------
  // Form Validation
  // --------------------------------------------------------------------------
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
        form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(function(field) {
          field.classList.remove('is-invalid');
        });

        // Validate each required field
        requiredFields.forEach(function(field) {
          if (!validateField(field)) {
            isValid = false;
            showFieldError(field);
          }
        });

        // Validate email format
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(function(field) {
          if (field.value && !isValidEmail(field.value)) {
            isValid = false;
            showFieldError(field, 'Veuillez entrer une adresse email valide.');
          }
        });

        // Validate phone format (Belgian)
        const phoneFields = form.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(function(field) {
          if (field.value && !isValidBelgianPhone(field.value)) {
            isValid = false;
            showFieldError(field, 'Veuillez entrer un numéro de téléphone valide.');
          }
        });

        if (!isValid) {
          e.preventDefault();
          // Focus first invalid field
          const firstInvalid = form.querySelector('.is-invalid');
          if (firstInvalid) {
            firstInvalid.focus();
          }
        }
      });

      // Real-time validation
      const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
      inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
          if (this.hasAttribute('required') && !validateField(this)) {
            showFieldError(this);
          } else {
            clearFieldError(this);
          }
        });
      });
    });
  }

  function validateField(field) {
    if (field.type === 'checkbox') {
      return field.checked;
    }
    return field.value.trim() !== '';
  }

  function showFieldError(field, message) {
    field.classList.add('is-invalid');

    const errorMessage = message || 'Ce champ est requis.';
    const errorElement = document.createElement('span');
    errorElement.className = 'form-error';
    errorElement.textContent = errorMessage;
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.style.display = 'block';

    field.parentNode.appendChild(errorElement);
  }

  function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const error = field.parentNode.querySelector('.form-error');
    if (error) {
      error.remove();
    }
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function isValidBelgianPhone(phone) {
    // Accept Belgian formats: +32..., 0032..., 04..., 02..., etc.
    const cleaned = phone.replace(/[\s\-\.()]/g, '');
    const re = /^(\+32|0032|0)[1-9][0-9]{7,8}$/;
    return re.test(cleaned);
  }

  // --------------------------------------------------------------------------
  // Lazy Loading Images (Native with fallback)
  // --------------------------------------------------------------------------
  function initLazyLoading() {
    // Native lazy loading is supported in modern browsers
    // This adds a fallback for older browsers
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      lazyImages.forEach(function(img) {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    } else {
      // Fallback for browsers without native support
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');

      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
              }
              img.classList.add('loaded');
              imageObserver.unobserve(img);
            }
          });
        }, {
          rootMargin: '50px 0px'
        });

        lazyImages.forEach(function(img) {
          imageObserver.observe(img);
        });
      } else {
        // Final fallback: load all images immediately
        lazyImages.forEach(function(img) {
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
        });
      }
    }
  }

  // --------------------------------------------------------------------------
  // Utility: Track Phone Clicks (for analytics)
  // --------------------------------------------------------------------------
  window.trackPhoneClick = function() {
    if (typeof gtag === 'function') {
      gtag('event', 'click', {
        'event_category': 'Contact',
        'event_label': 'Phone Call',
        'value': 1
      });
    }
  };

  // --------------------------------------------------------------------------
  // Utility: Track Form Submissions (for analytics)
  // --------------------------------------------------------------------------
  window.trackFormSubmission = function(formName) {
    if (typeof gtag === 'function') {
      gtag('event', 'submit', {
        'event_category': 'Form',
        'event_label': formName,
        'value': 1
      });
    }
  };

})();
