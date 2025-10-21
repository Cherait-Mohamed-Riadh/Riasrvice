/* ==========================================================================
   Ria Websites Academy - JavaScript Functionality
   Professional Marketing Website with Dark Premium Theme
   ========================================================================== */

// ==========================================================================
// Global Variables & DOM Elements
// ==========================================================================

const DOM = {
  // Navigation
  header: document.getElementById('header'),
  navToggle: document.getElementById('nav-toggle'),
  navMenu: document.getElementById('nav-menu'),
  navClose: document.getElementById('nav-close'),
  navLinks: document.querySelectorAll('.nav__link'),
  
  // Testimonials
  testimonialsWrapper: document.getElementById('testimonials-wrapper'),
  testimonialDots: document.querySelectorAll('.testimonial__dot'),
  testimonials: document.querySelectorAll('.testimonial'),
  
  // Contact Form
  contactForm: document.getElementById('contact-form'),
  formSuccess: document.getElementById('form-success'),
  
  // Scroll to Top
  scrollTop: document.getElementById('scroll-top'),
  
  // Sections for scroll spy
  sections: document.querySelectorAll('section[id]'),
  
  // Portfolio
  portfolioFilters: document.querySelectorAll('.filter__btn'),
  portfolioCards: document.querySelectorAll('.portfolio__card'),
  portfolioModal: document.getElementById('portfolio-modal')
};

// New Elements (dynamic / optional)
DOM.studentSliderTrack = document.getElementById('student-slider-track');
DOM.studentSliderDots = document.getElementById('student-slider-dots');
// Quote form removed

// Global state
const state = {
  currentTestimonial: 0,
  testimonialInterval: null,
  isFormSubmitting: false,
  countersStarted: false,
  studentSlideIndex: 0
};

// Formspree Integration
// To change the endpoint in the future, update the FORMSPREE_ENDPOINT value below
// with your new Formspree form ID URL (e.g., https://formspree.io/f/xxxxxx).
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xvgwndyp';

// ==========================================================================
// Utility Functions
// ==========================================================================

/**
 * Debounce function to limit the rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately
 * @returns {Function} Debounced function
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

/**
 * Smooth scroll to element
 * @param {HTMLElement} element - Target element
 * @param {number} offset - Offset from top
 */
function smoothScrollTo(element, offset = 80) {
  const elementPosition = element.offsetTop - offset;
  window.scrollTo({
    top: elementPosition,
    behavior: 'smooth'
  });
}

/**
 * Add class with animation delay
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class to add
 * @param {number} delay - Delay in milliseconds
 */
function addClassWithDelay(element, className, delay = 0) {
  setTimeout(() => {
    element.classList.add(className);
  }, delay);
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} threshold - Threshold percentage (0-1)
 * @returns {boolean} Is element visible
 */
function isElementVisible(element, threshold = 0.1) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const visible = (
    rect.top >= -rect.height * threshold &&
    rect.left >= -rect.width * threshold &&
    rect.bottom <= windowHeight + rect.height * threshold &&
    rect.right <= windowWidth + rect.width * threshold
  );
  
  return visible;
}

// ==========================================================================
// Navigation Functions
// ==========================================================================

/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
  DOM.navMenu.classList.toggle('show');
  document.body.classList.toggle('menu-open');
}

/**
 * Close mobile navigation menu
 */
function closeMobileMenu() {
  DOM.navMenu.classList.remove('show');
  document.body.classList.remove('menu-open');
}

/**
 * Handle navigation link clicks
 * @param {Event} e - Click event
 */
function handleNavLinkClick(e) {
  const href = e.currentTarget.getAttribute('href') || '';
  if (!href || href === '#') return;

  try {
    const url = new URL(href, window.location.href);
    const isSamePage = url.pathname === window.location.pathname && !!url.hash;

    if (isSamePage) {
      const targetSection = document.querySelector(url.hash);
      if (targetSection) {
        e.preventDefault();
        smoothScrollTo(targetSection);
        closeMobileMenu();
      }
    } else {
      // Cross-page navigation: allow default behavior
    }
  } catch (err) {
    // Fallback for non-standard hrefs
    if (href.startsWith('#')) {
      const targetSection = document.querySelector(href);
      if (targetSection) {
        e.preventDefault();
        smoothScrollTo(targetSection);
        closeMobileMenu();
      }
    }
  }
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink() {
  let current = '';
  
  DOM.sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  DOM.navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/**
 * Handle header scroll effect
 */
function handleHeaderScroll() {
  const y = window.scrollY;
  if (y >= 10) DOM.header.classList.add('scrolled');
  else DOM.header.classList.remove('scrolled');
}

// ==========================================================================
// Testimonials Functionality
// ==========================================================================

/**
 * Show specific testimonial
 * @param {number} index - Testimonial index
 */
function showTestimonial(index) {
  if (index < 0 || index >= DOM.testimonials.length) return;
  
  // Hide all testimonials
  DOM.testimonials.forEach(testimonial => {
    testimonial.classList.remove('active');
    testimonial.setAttribute('aria-hidden', 'true');
  });
  
  // Remove active class from all dots
  DOM.testimonialDots.forEach(dot => {
    dot.classList.remove('active');
    dot.setAttribute('aria-pressed', 'false');
  });
  
  // Show selected testimonial
  DOM.testimonials[index].classList.add('active');
  DOM.testimonials[index].setAttribute('aria-hidden', 'false');
  DOM.testimonialDots[index].classList.add('active');
  DOM.testimonialDots[index].setAttribute('aria-pressed', 'true');
  
  state.currentTestimonial = index;
}

/**
 * Go to next testimonial
 */
function nextTestimonial() {
  const nextIndex = (state.currentTestimonial + 1) % DOM.testimonials.length;
  showTestimonial(nextIndex);
}

/**
 * Go to previous testimonial
 */
function prevTestimonial() {
  const prevIndex = (state.currentTestimonial - 1 + DOM.testimonials.length) % DOM.testimonials.length;
  showTestimonial(prevIndex);
}

/**
 * Start testimonials auto-rotation
 */
function startTestimonialsRotation() {
  if (state.testimonialInterval) {
    clearInterval(state.testimonialInterval);
  }
  state.testimonialInterval = setInterval(nextTestimonial, 7000); // Change every 7 seconds for more reading time
}

/**
 * Stop testimonials auto-rotation
 */
function stopTestimonialsRotation() {
  if (state.testimonialInterval) {
    clearInterval(state.testimonialInterval);
    state.testimonialInterval = null;
  }
}

/**
 * Pause testimonials on hover
 */
function pauseTestimonialsOnHover() {
  const testimonialsContainer = document.querySelector('.testimonials__container');
  if (testimonialsContainer) {
    testimonialsContainer.addEventListener('mouseenter', stopTestimonialsRotation);
    testimonialsContainer.addEventListener('mouseleave', startTestimonialsRotation);
  }
}

/**
 * Initialize image loading with fallbacks
 */
function initializeImageLoading() {
  const avatarImages = document.querySelectorAll('.testimonial__avatar-img, .avatar-img');
  
  avatarImages.forEach(img => {
    img.addEventListener('load', () => {
      img.setAttribute('data-loaded', 'true');
    });
    
    img.addEventListener('error', () => {
      const fallback = img.nextElementSibling;
      if (fallback && fallback.classList.contains('testimonial__avatar-fallback', 'avatar-fallback')) {
        img.style.display = 'none';
        fallback.style.opacity = '1';
      }
    });
  });
}

/**
 * Initialize WhatsApp button interactions
 */
function initializeWhatsAppButton() {
  const whatsappBtn = document.querySelector('.whatsapp-sticky');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      trackEvent('WhatsApp Click', 'Contact', 'Sticky Button');
    });
  }
}

/**
 * Handle testimonial dot clicks
 * @param {Event} e - Click event
 */
function handleTestimonialDotClick(e) {
  const slideIndex = Number(e.currentTarget.getAttribute('data-slide'));
  showTestimonial(slideIndex);
  
  // Restart auto-rotation
  stopTestimonialsRotation();
  startTestimonialsRotation();
}

/**
 * Keyboard navigation for testimonials
 */
function initTestimonialsKeyboardNav() {
  const wrapper = DOM.testimonialsWrapper;
  if (!wrapper) return;
  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      stopTestimonialsRotation();
      nextTestimonial();
      startTestimonialsRotation();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stopTestimonialsRotation();
      prevTestimonial();
      startTestimonialsRotation();
    }
  });
}

/**
 * Touch swipe support for testimonials (mobile)
 */
function initTestimonialsSwipe() {
  const wrapper = DOM.testimonialsWrapper;
  if (!wrapper) return;
  let startX = 0;
  wrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  wrapper.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const delta = endX - startX;
    if (Math.abs(delta) > 40) {
      stopTestimonialsRotation();
      if (delta < 0) nextTestimonial(); else prevTestimonial();
      startTestimonialsRotation();
    }
  });
}

// ==========================================================================
// Form Validation & Submission
// ==========================================================================

/**
 * Form validation rules
 */
const validationRules = {
  name: {
    required: true,
    minLength: 2,
    // Allow any Unicode letters and spaces to support names in Arabic and other languages
    pattern: /^[\p{L}\s]+$/u,
    message: 'Please enter a valid name (letters and spaces only, minimum 2 characters)'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    required: false,
    // Accept international formats like +213 540306187, allow spaces and hyphens
    pattern: /^[\+]?[0-9\s\-]{7,15}$/,
    message: ''
  },
  service: {
    required: true,
    message: 'Please select a service'
  },
  message: {
    required: true,
    minLength: 10,
    message: 'Please provide project details (minimum 10 characters)'
  }
};

/**
 * Validate individual field
 * @param {HTMLElement} field - Form field element
 * @returns {boolean} Is field valid
 */
function validateField(field) {
  const fieldName = field.name;
  const fieldValue = field.value.trim();
  const rules = validationRules[fieldName];
  const errorElement = document.getElementById(`${fieldName}-error`);
  
  if (!rules) return true;
  
  // Clear previous error
  errorElement.textContent = '';
  errorElement.classList.remove('show');
  field.classList.remove('error');
  
  // Required validation
  if (rules.required && !fieldValue) {
    showFieldError(field, errorElement, 'This field is required');
    return false;
  }
  
  // Skip further validation if field is empty and not required
  if (!fieldValue && !rules.required) {
    return true;
  }
  
  // Pattern validation
  if (rules.pattern && !rules.pattern.test(fieldValue)) {
    showFieldError(field, errorElement, rules.message);
    return false;
  }
  
  // Minimum length validation
  if (rules.minLength && fieldValue.length < rules.minLength) {
    showFieldError(field, errorElement, rules.message);
    return false;
  }
  
  return true;
}

/**
 * Show field error
 * @param {HTMLElement} field - Form field
 * @param {HTMLElement} errorElement - Error display element
 * @param {string} message - Error message
 */
function showFieldError(field, errorElement, message) {
  field.classList.add('error');
  errorElement.textContent = message;
  errorElement.classList.add('show');
}

/**
 * Validate entire form
 * @returns {boolean} Is form valid
 */
function validateForm() {
  const fields = DOM.contactForm.querySelectorAll('input, select, textarea');
  let isValid = true;
  
  fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });
  
  return isValid;
}

/**
 * Show form success message
 */
function showFormSuccess() {
  DOM.formSuccess.classList.add('show');
  setTimeout(() => {
    DOM.formSuccess.classList.remove('show');
  }, 5000);
}

/**
 * Reset form to initial state
 */
function resetForm() {
  DOM.contactForm.reset();
  
  // Clear all errors
  const errorElements = DOM.contactForm.querySelectorAll('.form__error');
  errorElements.forEach(error => {
    error.classList.remove('show');
    error.textContent = '';
  });
  
  // Remove error classes from fields
  const fields = DOM.contactForm.querySelectorAll('input, select, textarea');
  fields.forEach(field => {
    field.classList.remove('error');
  });
  
  // Reset button state
  const submitButton = DOM.contactForm.querySelector('button[type="submit"]');
  submitButton.classList.remove('loading');
  state.isFormSubmitting = false;
}

/**
 * Simulate form submission (replace with actual backend integration)
 * @param {FormData} formData - Form data
 * @returns {Promise} Submission promise
 */
async function submitFormData(formData) {
  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: formData
  });
  let data = null;
  try {
    data = await response.json();
  } catch (_) {
    // ignore JSON parse errors; we'll rely on response.ok
  }
  if (!response.ok) {
    const errorMessage = (data && Array.isArray(data.errors))
      ? data.errors.map(e => e.message).join(', ')
      : 'Submission failed. Please try again.';
    throw new Error(errorMessage);
  }
  return data || { success: true };
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
async function handleFormSubmit(e) {
  e.preventDefault();
  
  if (state.isFormSubmitting) return;
  
  const isValid = validateForm();
  if (!isValid) return;
  
  state.isFormSubmitting = true;
  const submitButton = DOM.contactForm.querySelector('button[type="submit"]');
  submitButton.classList.add('loading');
  
  try {
    const formData = new FormData(DOM.contactForm);
    
    // Log form data for debugging (remove in production)
    console.log('Form submission data:', {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      message: formData.get('message')
    });
    // Ensure a #form-status element exists
    let statusEl = document.getElementById('form-status');
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.id = 'form-status';
      DOM.contactForm.appendChild(statusEl);
    }
    statusEl.textContent = '';
    statusEl.className = '';

    await submitFormData(formData);

    // Success UI updates
    showFormSuccess();
    statusEl.textContent = 'تم إرسال رسالتك بنجاح. سنعود إليك قريبًا.';
    statusEl.className = 'form__success show';
    resetForm();

  } catch (error) {
    console.error('Form submission error:', error);
    // Show error message to user in #form-status
    let statusEl = document.getElementById('form-status');
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.id = 'form-status';
      DOM.contactForm.appendChild(statusEl);
    }
    statusEl.textContent = 'حدث خطأ أثناء الإرسال. تحقق من اتصالك وحاول مرة أخرى.';
    statusEl.className = 'form__error show';

    submitButton.classList.remove('loading');
    state.isFormSubmitting = false;
  }
}

// ==========================================================================
// Scroll Effects
// ==========================================================================

/**
 * Handle scroll to top button visibility
 */
function handleScrollTopVisibility() {
  if (window.scrollY > 300) {
    DOM.scrollTop.classList.add('show');
  } else {
    DOM.scrollTop.classList.remove('show');
  }
}

/**
 * Scroll to top functionality
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/**
 * Animate elements on scroll (fade in animation)
 */
function animateOnScroll() {
  const animatedElements = document.querySelectorAll('.service__card, .portfolio__card, .stat');
  
  animatedElements.forEach((element, index) => {
    if (isElementVisible(element, 0.1) && !element.classList.contains('animated')) {
      setTimeout(() => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Trigger animation
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        });
        
        element.classList.add('animated');
      }, index * 100); // Stagger animation
    }
  });
}

// ==========================================================================
// Counters & Accordion
// ==========================================================================

/** Animate number counters when section enters viewport */
function initializeCounters() {
  if (state.countersStarted) return;
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const startCounter = (el) => {
    const target = parseInt(el.getAttribute('data-to')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400; // ms
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = `${value}${progress === 1 ? suffix : ''}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('[data-counter]').forEach(startCounter);
        state.countersStarted = true;
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) io.observe(statsSection);
}

/** Enhance <details> accordion with smooth scroll into view */
function initializeAccordion() {
  document.querySelectorAll('.accordion__item').forEach(details => {
    details.addEventListener('toggle', () => {
      if (details.open) {
        setTimeout(() => {
          details.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    });
  });
}

// ==========================================================================
// Event Listeners Setup
// ==========================================================================

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
  // Navigation events
  if (DOM.navToggle) {
    DOM.navToggle.addEventListener('click', toggleMobileMenu);
  }
  
  if (DOM.navClose) {
    DOM.navClose.addEventListener('click', closeMobileMenu);
  }
  
  // Navigation link clicks
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', handleNavLinkClick);
  });
  
  // Testimonial dot clicks
  DOM.testimonialDots.forEach(dot => {
    dot.addEventListener('click', handleTestimonialDotClick);
  });
  
  // Form submission
  if (DOM.contactForm) {
    DOM.contactForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time field validation
    const formFields = DOM.contactForm.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', debounce(() => validateField(field), 500));
    });
  }
  
  // Scroll to top button
  if (DOM.scrollTop) {
    DOM.scrollTop.addEventListener('click', scrollToTop);
  }

  // Portfolio filters
  if (DOM.portfolioFilters.length) {
    DOM.portfolioFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        // Toggle active state
        DOM.portfolioFilters.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        // Filter cards (support multi-category in data-category, space-separated)
        DOM.portfolioCards.forEach(card => {
          const categories = (card.dataset.category || '').split(/\s+/).filter(Boolean);
          const show = filter === 'all' || categories.includes(filter);
          card.style.display = show ? '' : 'none';
        });
        // Update sizing state based on visible cards (home & all-projects pages)
        updatePortfolioSizing();
        trackEvent('Portfolio Filter', 'Engagement', filter);
      });
    });
    // Initial sizing state on load
    updatePortfolioSizing();
  }

  // Portfolio quick view modal
  document.addEventListener('click', (e) => {
    if (e.target.matches('.portfolio__quickview')) {
      e.preventDefault();
      const card = e.target.closest('.portfolio__card');
      openPortfolioModalFromCard(card);
    }
    if (e.target.matches('[data-close="modal"]')) {
      closePortfolioModal();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.portfolioModal?.classList.contains('show')) {
      closePortfolioModal();
    }
  });
  
  // Scroll events (debounced for performance)
  const debouncedScrollHandler = debounce(() => {
    handleHeaderScroll();
    updateActiveNavLink();
    handleScrollTopVisibility();
    animateOnScroll();
  }, 10);
  
  window.addEventListener('scroll', debouncedScrollHandler);
  
  // Resize events
  const debouncedResizeHandler = debounce(() => {
    // Handle responsive adjustments if needed
    if (window.innerWidth > 720) {
      closeMobileMenu();
    }
  }, 250);
  
  window.addEventListener('resize', debouncedResizeHandler);
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!DOM.navMenu.contains(e.target) && !DOM.navToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });
  
  // Handle escape key for mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  
  // Prevent scroll when mobile menu is open
  document.addEventListener('touchmove', (e) => {
    if (document.body.classList.contains('menu-open')) {
      e.preventDefault();
    }
  }, { passive: false });

  // Track video plays in video testimonials
  const videos = Array.from(document.querySelectorAll('.video__media video'));
  videos.forEach(v => {
    const media = v.closest('.video__media');
    const overlay = media?.querySelector('.video__play');

    // Overlay click -> play video
    if (overlay) {
      overlay.addEventListener('click', () => {
        // Pause others
        videos.forEach(o => { if (o !== v) { o.pause(); o.controls = true; const over = o.closest('.video__media')?.querySelector('.video__play'); if (over) over.style.opacity = ''; } });
        v.play();
        v.controls = true;
        overlay.style.opacity = '0';
      });
    }

    // When playing, pause others and hide overlay
    v.addEventListener('play', () => {
      const card = v.closest('.video__card');
      const who = card?.querySelector('.video__title')?.textContent?.trim() || 'Client';
      trackEvent('Video Testimonial Play', 'Engagement', who);
      videos.forEach(o => { if (o !== v) { o.pause(); } });
      if (overlay) overlay.style.opacity = '0';
    });

    // Show overlay when paused/ended
    const showOverlay = () => { if (overlay) overlay.style.opacity = ''; };
    v.addEventListener('pause', showOverlay);
    v.addEventListener('ended', showOverlay);
  });
}

// ==========================================================================
// Initialization
// ==========================================================================

/**
 * Initialize testimonials functionality
 */
function initializeTestimonials() {
  if (DOM.testimonials.length > 0) {
    showTestimonial(0); // Show first testimonial
    startTestimonialsRotation();
    
    // Pause rotation on hover
    if (DOM.testimonialsWrapper) {
      DOM.testimonialsWrapper.addEventListener('mouseenter', stopTestimonialsRotation);
      DOM.testimonialsWrapper.addEventListener('mouseleave', startTestimonialsRotation);
      // Arrow controls
      const prevBtn = document.querySelector('.testimonial__arrow--prev');
      const nextBtn = document.querySelector('.testimonial__arrow--next');
      if (prevBtn) prevBtn.addEventListener('click', () => { stopTestimonialsRotation(); prevTestimonial(); startTestimonialsRotation(); });
      if (nextBtn) nextBtn.addEventListener('click', () => { stopTestimonialsRotation(); nextTestimonial(); startTestimonialsRotation(); });
    }

    // Keyboard and swipe interactions
    initTestimonialsKeyboardNav();
    initTestimonialsSwipe();
  }
}

/**
 * Initialize scroll animations
 */
function initializeScrollAnimations() {
  // IntersectionObserver-based reveals
  const revealElements = document.querySelectorAll('.reveal, .service__card, .portfolio__card, .participant__card, .stat');
  revealElements.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => io.observe(el));
}

/**
 * Initialize performance optimizations
 */
function initializePerformanceOptimizations() {
  // Lazy load images when they come into viewport
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  }
}

// ==========================================================================
// Portfolio Helpers
// ==========================================================================

/**
 * Update sizing state for portfolio grids on home page (#portfolio)
 * and all-projects page (#all-projects). Adds 'compact' when visible cards
 * are 2 or fewer to reduce visual emptiness.
 */
function updatePortfolioSizing() {
  const grids = [];
  const homeGrid = document.querySelector('#portfolio .portfolio__grid');
  if (homeGrid) grids.push(homeGrid);
  const allGrid = document.querySelector('#all-projects .portfolio__grid');
  if (allGrid) grids.push(allGrid);

  if (!grids.length) return;

  // Determine visible cards globally per grid (each grid owns its cards in that DOM scope)
  grids.forEach(grid => {
    const cards = Array.from(grid.querySelectorAll('.portfolio__card'));
    const visible = cards.filter(c => c.style.display !== 'none');
    if (visible.length <= 2) grid.classList.add('compact'); else grid.classList.remove('compact');
  });
}

/**
 * Populate and open the portfolio quick view modal from a card element
 * @param {HTMLElement} card 
 */
function openPortfolioModalFromCard(card) {
  if (!card || !DOM.portfolioModal) return;
  const title = card.querySelector('.portfolio__title')?.textContent?.trim() || 'Project';
  const description = card.querySelector('.portfolio__description')?.textContent?.trim() || '';
  const tags = Array.from(card.querySelectorAll('.portfolio__tags .tag')).map(t => t.textContent.trim());
  const metrics = Array.from(card.querySelectorAll('.portfolio__metrics li')).map(li => li.textContent.trim());
  const url = card.getAttribute('data-case-url') || '#';
  
  // Fill modal
  const titleEl = DOM.portfolioModal.querySelector('.modal__title');
  const descEl = DOM.portfolioModal.querySelector('.modal__description');
  const tagsEl = DOM.portfolioModal.querySelector('.modal__tags');
  const metricsEl = DOM.portfolioModal.querySelector('.modal__metrics');
  const visitBtn = DOM.portfolioModal.querySelector('.modal__visit');
  
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = description;
  if (tagsEl) {
    tagsEl.innerHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');
  }
  if (metricsEl) {
    metricsEl.innerHTML = metrics.map(m => `<li>${m}</li>`).join('');
  }
  if (visitBtn) {
    visitBtn.href = url;
  }
  
  // Show modal
  DOM.portfolioModal.classList.add('show');
  DOM.portfolioModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  trackEvent('Portfolio Quick View', 'Engagement', title);
}

/** Close portfolio modal */
function closePortfolioModal() {
  if (!DOM.portfolioModal) return;
  DOM.portfolioModal.classList.remove('show');
  DOM.portfolioModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * Main initialization function
 */
function init() {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
    return;
  }
  
  try {
    initializeEventListeners();
    initializeTestimonials();
    initializeScrollAnimations();
    initializePerformanceOptimizations();
  initializeCounters();
  initializeAccordion();
    
    // Initialize auto-testimonials
    startTestimonialsRotation();
    pauseTestimonialsOnHover();
    
    // Initialize image loading handlers
    initializeImageLoading();
    
    // Initialize WhatsApp sticky button animation
    initializeWhatsAppButton();
    
    // Initialize first filter state (ensure all visible)
    if (DOM.portfolioFilters.length) {
      DOM.portfolioFilters[0].click();
    }
    
    // Initial scroll handler call
    handleHeaderScroll();
    updateActiveNavLink();
    handleScrollTopVisibility();

  // Sticky CTA disabled
    
    console.log('Ria Websites Academy - Website initialized successfully');
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// ==========================================================================
// Global Sticky CTA
// ==========================================================================
function injectGlobalStickyCTA(){
  // Disabled per request: no global sticky CTA buttons
  const existing = document.querySelector('.global-cta-sticky');
  if (existing) existing.remove();
}

// ==========================================================================
// Utility Functions for External Integration
// ==========================================================================

/**
 * Public API for external integrations
 */
window.RiaWebsites = {
  // Navigation
  scrollToSection: (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) smoothScrollTo(section);
  },
  
  // Testimonials
  showTestimonial: showTestimonial,
  nextTestimonial: nextTestimonial,
  
  // Form
  validateForm: validateForm,
  resetForm: resetForm,
  
  // Utility
  debounce: debounce,
  isElementVisible: isElementVisible
};

// ==========================================================================
// Error Handling & Analytics
// ==========================================================================

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
  console.error('JavaScript error:', event.error);
  
  // TODO: Send error to analytics/monitoring service
  // Example: sendErrorToAnalytics(event.error);
});

/**
 * Track user interactions for analytics
 * @param {string} action - Action name
 * @param {string} category - Category
 * @param {string} label - Label
 */
function trackEvent(action, category = 'User Interaction', label = '') {
  // TODO: Integrate with analytics service (Google Analytics, etc.)
  console.log('Analytics Event:', { action, category, label });
  
  // Example Google Analytics 4 integration:
  /*
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
  */
}

// Add click tracking to important buttons
document.addEventListener('click', (e) => {
  if (e.target.matches('.btn--primary')) {
    trackEvent('CTA Click', 'Conversion', e.target.textContent.trim());
  }
  // Floating CTA removed
  
  if (e.target.matches('.portfolio__link')) {
    trackEvent('Portfolio View', 'Engagement', 'Project Details');
  }
  
  if (e.target.closest('.participant__link-area')) {
    const card = e.target.closest('.participant__card');
    const name = card?.querySelector('.participant__name')?.textContent?.trim() || 'Participant';
    trackEvent('Participant Portfolio', 'External Link', name);
  }
  
  if (e.target.matches('.social__link')) {
    trackEvent('Social Click', 'External Link', e.target.getAttribute('aria-label'));
  }
  if (e.target.closest && e.target.closest('.blog__link')) {
    const card = e.target.closest('.blog__card');
    const title = card?.querySelector('.blog__title')?.textContent?.trim() || 'Blog Post';
    trackEvent('Blog Read More', 'Engagement', title);
  }
});

// ==========================================================================
// Chatbot Functionality
// ==========================================================================

class ChatBot {
  constructor() {
    this.isOpen = false;
    this.messageCount = 0;
    this.initializeElements();
    this.initializeResponses();
    this.bindEvents();
    this.showWelcomeNotification();
  }

  initializeElements() {
    this.toggle = document.getElementById('chatbot-toggle');
    this.window = document.getElementById('chatbot-window');
    this.messages = document.getElementById('chatbot-messages');
    this.input = document.getElementById('chatbot-input');
    this.sendBtn = document.getElementById('chatbot-send');
    this.notification = document.getElementById('chatbot-notification');
    this.quickActions = document.querySelectorAll('.quick-action');
  }

  initializeResponses() {
    this.responses = {
      services: {
        keywords: ['service','services','خدمات','تطوير','website','web','application','app','mobile','development','design','ui','ux','marketing','seo','store','ecommerce','digital'],
        response: `Our core services:\n\n🌐 Web Development (custom, fast, SEO-ready)\n📱 Mobile Apps (iOS / Android / Cross‑platform)\n� E‑Commerce & Payment Integration\n� UI / UX Design & Prototyping\n⚙️ Custom Software & APIs\n� Growth & Performance Optimization\n�️ Security & Maintenance\n\nNeed details or pricing for any of these? Just ask.`
      },
      pricing: {
        keywords: ['price','pricing','cost','budget','كم','سعر','أسعار','تكلفة','money','فلوس','دينار','quote','estimate'],
        response: `Pricing guidance (ranges – final quote depends on scope):\n\n💻 Business Website: 50k–120k DZD\n🛒 E‑Commerce: 150k–280k DZD\n📱 Mobile App (MVP): 200k–450k DZD\n⚙️ Custom Platform / SaaS: 250k–600k+ DZD\n🎨 Brand / UI Kit: 15k–60k DZD\n\nIncluded: planning, QA, deployment, 30‑day warranty. Ask for a free tailored quote.`
      },
      portfolio: {
        keywords: ['portfolio','projects','work','examples','case','study','أعمال','مشاريع','معرض','نماذج'],
        response: `We’ve delivered 150+ successful projects:\n\n✅ Corporate & Institutional Sites\n✅ Learning & Medical Apps\n✅ Booking & Service Platforms\n✅ E‑Commerce & Marketplaces\n✅ Analytics & Dashboards\n✅ Custom Internal Systems\n\nBrowse the Portfolio section above or ask about a specific industry.`
      },
      contact: {
        keywords: ['contact','email','phone','reach','talk','support','تواصل','اتصال','ايميل','رقم','واتساب'],
        response: `You can reach us via:\n\n📧 Email: riaacademy.dz@gmail.com\n💬 WhatsApp: click the green floating button\n📸 Instagram: @riaacademy_official\n▶️ YouTube: RiaAcademy\n📍 Location: Algiers (serving clients worldwide)\n🕒 Typical reply: under 24h (faster on WhatsApp)\n\nSend your project brief and we’ll follow up with clear next steps.`
      },
      timeline: {
        keywords: ['time','timeline','duration','schedule','deadline','مدة','وقت','متى','كم يستغرق'],
        response: `Typical delivery timelines:\n\n⚡ Landing Page: 1–2 weeks\n� Corporate Website: 3–6 weeks\n🛒 E‑Commerce: 6–10 weeks\n📱 Mobile App MVP: 8–14 weeks\n🧩 Custom Platform: 10–16+ weeks\n\nFast‑track available (reduce 10–30%) with dedicated team.`
      },
      support: {
        keywords: ['support','maintenance','help','issue','bug','مشكلة','دعم','صيانة','trouble','error'],
        response: `Support & maintenance tiers:\n\n� Basic: 30‑day warranty & bug fixes\n� Standard: security patches, content updates, monitoring\n� Premium: 24/7 SLA, performance tuning, feature iteration\n\nAll tiers include secure backups & version tracking.`
      },
      technology: {
        keywords: ['tech','technology','stack','framework','react','vue','node','laravel','django','database','تقنية','برمجة','لغة','framework','ووردبريس','wordpress','javascript'],
        response: `Primary stack:\n\nFrontend: React, Next.js, Vue, TypeScript\nBackend: Node.js, Laravel, Django, FastAPI\nMobile: Flutter, React Native\nDB: PostgreSQL, MongoDB, MySQL\nCloud: AWS, GCP, Vercel\nDevOps: Docker, CI/CD, GitHub Actions\nSecurity: HTTPS, RBAC, audits, monitoring\n\nWe select based on scalability & maintainability.`
      },
      payment: {
        keywords: ['payment','pay','methods','plan','تقسيط','دفع','فيزا','بطاقة','bank','transfer'],
        response: `Payment options:\n\n💳 Card / Stripe\n🏦 Bank transfer\n💰 Local cash (where applicable)\n🪙 Crypto (USDT / ETH / BTC on request)\n📅 Milestone / installment for larger scopes\n\nStandard: 50% upfront, remainder on approved delivery.`
      },
      location: {
        keywords: ['location','where','city','algeria','الجزائر','جزائر','موقع','عنوان'],
        response: `We’re based in Algiers 🇩� and work remotely with clients across Algeria, MENA, Europe & North America.`
      },
      greeting: {
        keywords: ['hello','hi','hey','مرحبا','اهلا','السلام','good morning','good evening','morning','evening'],
        response: 'Welcome to Ria Academy! 😊 I can help with services, pricing, timeline, technology, or a proposal. What would you like to know?'
      },
      guarantee: {
        keywords: ['guarantee','warranty','ضمان','refund','استرجاع','كفالة'],
        response: `Quality & assurance:\n\n✅ Structured delivery process\n✅ Transparent milestones & demos\n✅ 30‑day post‑launch warranty\n✅ Performance & security checklist\n✅ Optional SLA for long‑term evolution` 
      },
      default: `Thanks! 👌 I didn’t find an exact match. Ask about: services, pricing, timeline, tech stack, portfolio, or support. Try being more specific (e.g. "e‑commerce pricing" or "mobile app timeline").`
    };
    this.allKeywords = Object.entries(this.responses).flatMap(([k,v]) => (v.keywords||[]).map(kw => ({category:k, kw})));
  }

  bindEvents() {
    this.toggle.addEventListener('click', () => this.toggleChat());
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    
    this.quickActions.forEach(action => {
      action.addEventListener('click', () => {
        const actionType = action.dataset.action;
        this.handleQuickAction(actionType);
      });
    });

    // إغلاق الشات عند النقر خارجه
    document.addEventListener('click', (e) => {
      if (this.isOpen && !e.target.closest('.chatbot-container')) {
        this.closeChat();
      }
    });
  }

  showWelcomeNotification() {
    // إظهار إشعار بعد 3 ثوان
    setTimeout(() => {
      this.notification.textContent = '💬';
      this.notification.classList.remove('hidden');
    }, 3000);

    // إضافة رسالة ترحيبية بعد 5 ثوان إذا لم يفتح المستخدم الشات
    setTimeout(() => {
      if (!this.isOpen && this.messageCount === 0) {
        this.notification.textContent = '👋';
        // إضافة أنيميشن إضافي للفت الانتباه
        this.toggle.style.animation = 'chatbot-pulse 1s infinite';
      }
    }, 5000);
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.isOpen = true;
    this.window.classList.add('show');
    this.toggle.classList.add('active');
    this.notification.classList.add('hidden');
    this.input.focus();
    
    // إضافة رسالة ترحيب إذا لم تكن موجودة
    if (this.messageCount === 0) {
      setTimeout(() => {
        this.addMessage('Welcome! Ask anything about services, pricing, timelines, technology, or how to start your project. 😊', 'bot');
      }, 500);
    }
  }

  closeChat() {
    this.isOpen = false;
    this.window.classList.remove('show');
    this.toggle.classList.remove('active');
  }

  sendMessage() {
    const message = this.input.value.trim();
    if (!message) return;

    this.addMessage(message, 'user');
    this.input.value = '';
    this.sendBtn.disabled = true;

    // إظهار مؤشر الكتابة
    this.showTypingIndicator();

    // معالجة الرد
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateResponse(message);
      this.addMessage(response, 'bot');
      this.sendBtn.disabled = false;
    }, 1500 + Math.random() * 1000);
  }

  addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const now = new Date();
    const time = now.toLocaleTimeString('ar-DZ', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${text}</p>
      </div>
      <div class="message-time">${time}</div>
    `;

    this.messages.appendChild(messageDiv);
    this.messages.scrollTop = this.messages.scrollHeight;
    this.messageCount++;

    // إضافة أنيميشن
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
      messageDiv.style.transition = 'all 0.3s ease';
      messageDiv.style.opacity = '1';
      messageDiv.style.transform = 'translateY(0)';
    });
  }

  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <span>Typing...</span>
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    this.messages.appendChild(typingDiv);
    this.messages.scrollTop = this.messages.scrollHeight;
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  generateResponse(message) {
    const txt = message.toLowerCase();
    // Direct keyword match
    for (const [cat,data] of Object.entries(this.responses)) {
      if (data.keywords && data.keywords.some(k => txt.includes(k))) {
        return data.response;
      }
    }
    // Fuzzy match
    let best = {score:0, cat:null};
    const tokens = txt.split(/\s+|[,.;:!?]+/).filter(Boolean);
    tokens.forEach(t => {
      this.allKeywords.forEach(({category, kw}) => {
        const s = this.fuzzyScore(t, kw);
        if (s > best.score) best = {score:s, cat:category};
      });
    });
    if (best.cat && best.score > 0.55) return this.responses[best.cat].response;
    // Small talk
    if (/thank|شكرا/.test(txt)) return 'You’re welcome! Happy to help. 😊';
    if (/how are you|كيف حالك/.test(txt)) return 'All good here 🤖 Ready to support your project goals.';
    if (/your name|اسمك|who are you/.test(txt)) return 'I’m the Ria Academy AI Assistant ready to answer project questions instantly.';
    if (/demo|prototype|تجربة|عينة/.test(txt)) return 'We can provide a prototype or wireframe before full development for alignment.';
    if (/why|لماذا|ليش/.test(txt)) return 'We combine 150+ deliveries, measurable results, clear process, performance & security focus, and ongoing partnership.';
    return this.responses.default;
  }

  fuzzyScore(a,b){
    if(a===b) return 1;
    if(Math.abs(a.length-b.length) > Math.max(4,b.length*0.6)) return 0;
    const sa=new Set(a), sb=new Set(b); let inter=0; sa.forEach(ch=>{ if(sb.has(ch)) inter++; });
    const union = sa.size + sb.size - inter; const j = inter/union;
    const lenFactor = 1 - (Math.abs(a.length - b.length)/Math.max(a.length,b.length));
    return j*0.7 + lenFactor*0.3;
  }

  handleQuickAction(action) {
    let message = '';
    switch(action) {
      case 'services':
        message = 'What services do you offer?';
        break;
      case 'pricing':
        message = 'What are your pricing ranges?';
        break;
      case 'portfolio':
        message = 'Show me examples of your previous work.';
        break;
      case 'contact':
        message = 'How can I contact you?';
        break;
    }
    
    if (message) {
      this.input.value = message;
      this.sendMessage();
    }
  }
}

// ==========================================================================
// 3D Model Loader
// ==========================================================================

function init3DModel() {
  const canvas = document.getElementById('threejs-canvas');
  if (!canvas) {
    console.log('Canvas not found');
    return;
  }

  console.log('Initializing 3D model...');

  // Check if Three.js is loaded
  if (typeof THREE === 'undefined') {
    console.error('Three.js not loaded');
    return;
  }

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    antialias: true, 
    alpha: true 
  });

  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  // Photorealistic rendering settings
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.autoUpdate = true;
  renderer.shadowMap.needsUpdate = true;
  renderer.xr = renderer.xr || {};
  renderer.debug = renderer.debug || {};
  renderer.debug.checkShaderErrors = false;
  renderer.info = renderer.info || {};
  renderer.gammaFactor = 2.2;
  renderer.dithering = true;
  
  // Enhanced lighting setup
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x202020, 0.6);
  hemiLight.position.set(0, 10, 0);
  scene.add(hemiLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
  directionalLight.position.set(8, 12, 6);
  directionalLight.target.position.set(0, 0, 0);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 60;
  directionalLight.shadow.bias = -0.0005;
  directionalLight.shadow.normalBias = 0.02;
  directionalLight.shadow.radius = 2;
  scene.add(directionalLight);
  scene.add(directionalLight.target);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
  rimLight.position.set(-6, 6, -6);
  scene.add(rimLight);
  
  // Ground with soft shadows
  const groundGeometry = new THREE.PlaneGeometry(50, 50);
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.25 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.25;
  ground.receiveShadow = true;
  scene.add(ground);

  // Try to load an HDRI environment for realistic reflections/lighting
  try {
    if (typeof THREE.RGBELoader !== 'undefined') {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();

      new THREE.RGBELoader()
        // You can place an HDR in assets, this is a neutral studio fallback online
        .setDataType(THREE.UnsignedByteType)
        .load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr', (hdrTexture) => {
          const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;
          scene.environment = envMap;
          scene.background = null; // keep transparent background for the site
          hdrTexture.dispose();
          pmremGenerator.dispose();
        }, undefined, (e) => {
          console.warn('HDRI load failed, continuing without environment', e);
        });
    } else {
      console.warn('RGBELoader not available; skipping HDRI.');
    }
  } catch (e) {
    console.warn('HDRI setup error:', e);
  }

  // Create detailed computer model
  function createDetailedComputer() {
    console.log('Creating detailed computer model...');
    const computerGroup = new THREE.Group();
    
    // Monitor Frame (more realistic proportions)
    const monitorFrameGeometry = new THREE.BoxGeometry(5, 3.5, 0.4);
    const monitorFrameMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0a0a0a,
      metalness: 0.6,
      roughness: 0.35
    });
    const monitorFrame = new THREE.Mesh(monitorFrameGeometry, monitorFrameMaterial);
    monitorFrame.position.set(0, 1.5, 0);
    monitorFrame.castShadow = true;
    monitorFrame.receiveShadow = true;
    computerGroup.add(monitorFrame);
    
    // Screen (realistic black screen with slight glow)
    const screenGeometry = new THREE.BoxGeometry(4.6, 3.1, 0.1);
    const screenMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x000000,
      emissive: 0x001100,
      emissiveIntensity: 0.05,
      metalness: 0.1,
      roughness: 0.4
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1.5, 0.25);
    computerGroup.add(screen);
    // Apply a realistic UI texture to the screen
    try {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('images/Tech Stack.png', (tex) => {
        if (tex) {
          if ('encoding' in tex) tex.encoding = THREE.sRGBEncoding;
          if (renderer && renderer.capabilities && renderer.capabilities.getMaxAnisotropy) {
            tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          }
          screenMaterial.map = tex;
          screenMaterial.emissiveIntensity = 0.25;
          screenMaterial.envMapIntensity = 1.0;
          screenMaterial.needsUpdate = true;
        }
      }, undefined, () => {/* ignore texture errors */});
    } catch (e) { /* noop */ }
    
    // Monitor Stand (more realistic)
    const standNeckGeometry = new THREE.CylinderGeometry(0.2, 0.25, 1.2, 12);
    const standMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      metalness: 0.5,
      roughness: 0.5
    });
    const standNeck = new THREE.Mesh(standNeckGeometry, standMaterial);
    standNeck.position.set(0, 0.1, 0);
    standNeck.castShadow = true;
    standNeck.receiveShadow = true;
    computerGroup.add(standNeck);
    
    // Monitor Base (heavier, more stable look)
    const baseGeometry = new THREE.CylinderGeometry(1.2, 1.5, 0.3, 16);
    const base = new THREE.Mesh(baseGeometry, standMaterial);
    base.position.set(0, -0.65, 0);
    base.castShadow = true;
    base.receiveShadow = true;
    computerGroup.add(base);
    
    // Keyboard (more detailed)
    const keyboardGeometry = new THREE.BoxGeometry(4.5, 0.2, 1.8);
    const keyboardMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2a2a2a,
      metalness: 0.2,
      roughness: 0.7
    });
    const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
    keyboard.position.set(0, -0.7, 2.2);
    keyboard.castShadow = true;
    keyboard.receiveShadow = true;
    computerGroup.add(keyboard);
    
    // Keyboard Keys (more realistic layout)
    const keyColors = [0x404040, 0x454545, 0x383838];
    for (let row = 0; row < 5; row++) {
      const keysInRow = row === 0 ? 14 : (row === 1 ? 13 : 12);
      for (let col = 0; col < keysInRow; col++) {
        const keyGeometry = new THREE.BoxGeometry(0.18, 0.08, 0.18);
        const keyMaterial = new THREE.MeshStandardMaterial({ 
          color: keyColors[Math.floor(Math.random() * keyColors.length)],
          metalness: 0.1,
          roughness: 0.5
        });
        const key = new THREE.Mesh(keyGeometry, keyMaterial);
        const offsetX = (keysInRow - 1) * 0.1;
        key.position.set(
          (col * 0.2) - offsetX + (row * 0.05),
          -0.61,
          2.2 + (row - 2) * 0.22
        );
        key.castShadow = true;
        computerGroup.add(key);
      }
    }
    
    // Spacebar (special key)
    const spacebarGeometry = new THREE.BoxGeometry(2.5, 0.08, 0.18);
    const spacebarMaterial = new THREE.MeshStandardMaterial({ color: 0x505050, metalness: 0.2, roughness: 0.4 });
    const spacebar = new THREE.Mesh(spacebarGeometry, spacebarMaterial);
    spacebar.position.set(0, -0.61, 2.64);
    spacebar.castShadow = true;
    computerGroup.add(spacebar);
    
    // Mouse (more detailed)
    const mouseBodyGeometry = new THREE.BoxGeometry(0.8, 0.12, 1.4);
    const mouseMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0f0f0f,
      metalness: 0.4,
      roughness: 0.4
    });
    const mouseBody = new THREE.Mesh(mouseBodyGeometry, mouseMaterial);
    mouseBody.position.set(3.5, -0.68, 2.2);
    mouseBody.castShadow = true;
    mouseBody.receiveShadow = true;
    computerGroup.add(mouseBody);
    
    // Mouse buttons
    const leftButtonGeometry = new THREE.BoxGeometry(0.35, 0.05, 0.6);
    const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.2, roughness: 0.35 });
    const leftButton = new THREE.Mesh(leftButtonGeometry, buttonMaterial);
    leftButton.position.set(3.3, -0.61, 1.9);
    computerGroup.add(leftButton);
    
    const rightButton = new THREE.Mesh(leftButtonGeometry, buttonMaterial);
    rightButton.position.set(3.7, -0.61, 1.9);
    computerGroup.add(rightButton);
    
    // Mouse scroll wheel
    const scrollWheelGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 12);
    const scrollWheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.1, roughness: 0.3 });
    const scrollWheel = new THREE.Mesh(scrollWheelGeometry, scrollWheelMaterial);
    scrollWheel.position.set(3.5, -0.6, 1.9);
    scrollWheel.rotateZ(Math.PI / 2);
    computerGroup.add(scrollWheel);
    
    // CPU Tower (more realistic)
    const cpuGeometry = new THREE.BoxGeometry(1.2, 3.5, 2.5);
    const cpuMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0d0d0d,
      metalness: 0.4,
      roughness: 0.5
    });
    const cpu = new THREE.Mesh(cpuGeometry, cpuMaterial);
    cpu.position.set(-4.5, 0.25, 0);
    cpu.castShadow = true;
    cpu.receiveShadow = true;
    computerGroup.add(cpu);
    
    // CPU Front Panel
    const frontPanelGeometry = new THREE.BoxGeometry(0.05, 3.4, 2.4);
    const frontPanelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      metalness: 0.4,
      roughness: 0.4
    });
    const frontPanel = new THREE.Mesh(frontPanelGeometry, frontPanelMaterial);
    frontPanel.position.set(-3.88, 0.25, 0);
    computerGroup.add(frontPanel);
    
    // Power Button (glowing)
    const powerButtonGeometry = new THREE.CircleGeometry(0.12, 16);
    const powerButtonMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf97316,
      emissive: 0xf97316,
      emissiveIntensity: 0.7,
      metalness: 0.3,
      roughness: 0.35
    });
    const powerButton = new THREE.Mesh(powerButtonGeometry, powerButtonMaterial);
    powerButton.position.set(-3.87, 1.2, 0.8);
    powerButton.rotateY(Math.PI / 2);
    computerGroup.add(powerButton);
    
    // USB Ports
    for (let i = 0; i < 2; i++) {
      const usbGeometry = new THREE.BoxGeometry(0.02, 0.08, 0.3);
      const usbMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.1, roughness: 0.5 });
      const usb = new THREE.Mesh(usbGeometry, usbMaterial);
      usb.position.set(-3.87, 0.5 - (i * 0.2), -0.5);
      computerGroup.add(usb);
    }
    
    // CD/DVD Drive
    const driveGeometry = new THREE.BoxGeometry(0.03, 0.15, 1.8);
    const driveMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.3, roughness: 0.4 });
    const drive = new THREE.Mesh(driveGeometry, driveMaterial);
    drive.position.set(-3.87, -0.3, 0);
    computerGroup.add(drive);
    
    // Ventilation Grilles
    for (let i = 0; i < 8; i++) {
      const grillGeometry = new THREE.BoxGeometry(0.02, 0.05, 1.8);
      const grillMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.2, roughness: 0.5 });
      const grill = new THREE.Mesh(grillGeometry, grillMaterial);
      grill.position.set(-5.12, 1.5 - (i * 0.3), 0);
      computerGroup.add(grill);
    }
    
    // Cables (more realistic)
    const cablePoints = [
      new THREE.Vector3(-3.8, -0.5, 0.5),
      new THREE.Vector3(-2, -0.5, 0.5),
      new THREE.Vector3(-1, 0, 0.2),
      new THREE.Vector3(0, 0.5, 0)
    ];
    
    const cableCurve = new THREE.CatmullRomCurve3(cablePoints);
    const cableGeometry = new THREE.TubeGeometry(cableCurve, 20, 0.03, 8, false);
    const cableMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.1, roughness: 0.6 });
    const cable = new THREE.Mesh(cableGeometry, cableMaterial);
    computerGroup.add(cable);
    
    // Scale up the entire model significantly
    computerGroup.scale.set(0.9, 0.9, 0.9);
    computerGroup.position.set(0, -0.8, 0);
    // Boost reflections on PBR materials
    computerGroup.traverse((obj) => {
      if (obj && obj.isMesh && obj.material && obj.material.isMeshStandardMaterial) {
        obj.material.envMapIntensity = 1.0;
      }
    });
    scene.add(computerGroup);
    return { group: computerGroup, floatingElements: [] };
  }

  // Start with detailed computer
  let modelData = null;
  let model = null;

  // Attempt to load external GLB model if available, else fallback to procedural
  try {
    if (typeof THREE.GLTFLoader !== 'undefined') {
      const loader = new THREE.GLTFLoader();
      loader.load(
        'model/personal_computer.glb',
        (gltf) => {
          model = gltf.scene;
          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.castShadow = true;
              obj.receiveShadow = true;
              if (obj.material && obj.material.isMeshStandardMaterial) {
                obj.material.envMapIntensity = 1.0;
              }
            }
          });
          model.scale.set(0.8, 0.8, 0.8);
          model.position.set(0, -1.0, 0);
          scene.add(model);
        },
        undefined,
        () => {
          // Fallback to procedural model
          modelData = createDetailedComputer();
          model = modelData.group;
        }
      );
    } else {
      // No GLTFLoader available - fallback
      modelData = createDetailedComputer();
      model = modelData.group;
    }
  } catch (e) {
    console.warn('GLB load error, using fallback model', e);
    modelData = createDetailedComputer();
    model = modelData.group;
  }
  
  // Hide loading indicator
  const loadingIndicator = document.getElementById('model-loading');
  if (loadingIndicator) {
    setTimeout(() => {
      loadingIndicator.style.display = 'none';
    }, 1000);
  }

  // Camera position
  camera.position.set(4, 3, 6);
  camera.lookAt(0, 0, 0);

  // Enhanced Mouse and Touch interaction
  let isInteracting = false;
  let previousMousePosition = { x: 0, y: 0 };
  let rotationVelocity = { x: 0, y: 0 };
  let targetRotation = { x: 0, y: 0 };
  let currentRotation = { x: 0, y: 0 };
  let autoRotate = true;
  let lastInteractionTime = Date.now();

  // Mouse Events
  function onMouseDown(event) {
    isInteracting = true;
    autoRotate = false;
    lastInteractionTime = Date.now();
    const rect = canvas.getBoundingClientRect();
    previousMousePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    canvas.style.cursor = 'grabbing';
  }

  function onMouseMove(event) {
    if (!isInteracting) {
      canvas.style.cursor = 'grab';
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const currentMousePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    const deltaMove = {
      x: currentMousePosition.x - previousMousePosition.x,
      y: currentMousePosition.y - previousMousePosition.y
    };

    targetRotation.y += deltaMove.x * 0.01;
    targetRotation.x += deltaMove.y * 0.01;

    previousMousePosition = currentMousePosition;
  }

  function onMouseUp() {
    isInteracting = false;
    canvas.style.cursor = 'grab';
    setTimeout(() => {
      if (Date.now() - lastInteractionTime > 3000) {
        autoRotate = true;
      }
    }, 3000);
  }

  // Touch Events
  function onTouchStart(event) {
    event.preventDefault();
    if (event.touches.length === 1) {
      isInteracting = true;
      autoRotate = false;
      lastInteractionTime = Date.now();
      const rect = canvas.getBoundingClientRect();
      previousMousePosition = {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    }
  }

  function onTouchMove(event) {
    event.preventDefault();
    if (!isInteracting || event.touches.length !== 1) return;

    const rect = canvas.getBoundingClientRect();
    const currentTouchPosition = {
      x: event.touches[0].clientX - rect.left,
      y: event.touches[0].clientY - rect.top
    };

    const deltaMove = {
      x: currentTouchPosition.x - previousMousePosition.x,
      y: currentTouchPosition.y - previousMousePosition.y
    };

    targetRotation.y += deltaMove.x * 0.01;
    targetRotation.x += deltaMove.y * 0.01;

    previousMousePosition = currentTouchPosition;
  }

  function onTouchEnd(event) {
    event.preventDefault();
    isInteracting = false;
    setTimeout(() => {
      if (Date.now() - lastInteractionTime > 3000) {
        autoRotate = true;
      }
    }, 3000);
  }

  // Add event listeners
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mouseleave', onMouseUp);
  
  // Touch events
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  canvas.addEventListener('touchend', onTouchEnd, { passive: false });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    if (model) {
      // Auto rotation when not interacting
      if (autoRotate && Date.now() - lastInteractionTime > 3000) {
        targetRotation.y += 0.003;
      }

      // Smooth rotation interpolation
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
      
      model.rotation.x = currentRotation.x;
      model.rotation.y = currentRotation.y;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Handle window resize
  function onWindowResize() {
    if (!canvas.parentElement) return;
    
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', onWindowResize);
  
  // Initial resize after a short delay
  setTimeout(onWindowResize, 100);
  
  console.log('3D computer model initialized with touch and mouse controls');
}

// ==========================================================================
// Start Application
// ==========================================================================

// Initialize the application
init();

// Initialize 3D Model with multiple attempts
function initialize3DModel() {
  if (typeof THREE !== 'undefined') {
    init3DModel();
  } else {
    console.log('Three.js not loaded yet, retrying...');
    setTimeout(initialize3DModel, 500);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initialize3DModel();
});

// Also try after window load
window.addEventListener('load', () => {
  setTimeout(() => {
    if (document.getElementById('threejs-canvas') && !document.querySelector('#threejs-canvas canvas')) {
      console.log('Retrying 3D model initialization...');
      initialize3DModel();
    }
  }, 1000);
});

// ==========================================================================
// FAQ Categories Functionality
// ==========================================================================

function initFAQCategories() {
  const categoryButtons = document.querySelectorAll('.faq__category');
  const faqGroups = document.querySelectorAll('.faq__group');
  
  if (categoryButtons.length === 0) return;
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      
      // Update active button
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Show/hide FAQ groups
      faqGroups.forEach(group => {
        if (group.dataset.group === category) {
          group.style.display = 'block';
          // Close all accordion items in hidden groups
          const otherGroups = document.querySelectorAll(`.faq__group:not([data-group="${category}"])`);
          otherGroups.forEach(otherGroup => {
            const details = otherGroup.querySelectorAll('details[open]');
            details.forEach(detail => detail.removeAttribute('open'));
          });
        } else {
          group.style.display = 'none';
        }
      });
    });
  });
}

// ==========================================================================
// Enhanced FAQ Analytics
// ==========================================================================

function trackFAQInteractions() {
  const items = document.querySelectorAll('.accordion__item');
  if (!items.length) return;

  items.forEach(item => {
    const summary = item.querySelector('.accordion__summary');
    const content = item.querySelector('.accordion__content');
    if (!summary || !content) return;

    // Prepare content for animation
    content.style.overflow = 'hidden';
    content.style.transition = 'height 260ms ease';
    if (!item.hasAttribute('open')) {
      content.style.height = '0px';
    } else {
      content.style.height = content.scrollHeight + 'px';
    }

    summary.addEventListener('click', (e) => {
      // Delay default toggle effect to control animation
      e.preventDefault();
      const isOpen = item.hasAttribute('open');
      const group = item.closest('.faq__group');

      // Close other open items in same group
      if (group) {
        group.querySelectorAll('.accordion__item[open]').forEach(openItem => {
          if (openItem !== item) {
            const openContent = openItem.querySelector('.accordion__content');
            if (openContent) {
              openContent.style.height = openContent.scrollHeight + 'px';
              requestAnimationFrame(() => {
                openContent.style.height = '0px';
              });
            }
            openItem.removeAttribute('open');
          }
        });
      }

      if (isOpen) {
        // Close current
        content.style.height = content.scrollHeight + 'px';
        requestAnimationFrame(() => {
          content.style.height = '0px';
        });
        item.removeAttribute('open');
      } else {
        // Open current
        item.setAttribute('open', '');
        content.style.height = content.scrollHeight + 'px';
        // After transition, set to auto for dynamic content
        const after = () => {
          if (item.hasAttribute('open')) {
            content.style.height = 'auto';
          }
          content.removeEventListener('transitionend', after);
        };
        content.addEventListener('transitionend', after);
      }

      // Analytics (optional)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'faq_interaction', {
          event_category: 'FAQ',
          event_label: summary.textContent.trim(),
          value: 1
        });
      }
    });
  });
}

// Initialize ChatBot
document.addEventListener('DOMContentLoaded', () => {
  new ChatBot();
  initFAQCategories();
  trackFAQInteractions();
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { init, RiaWebsites: window.RiaWebsites };
}
