/* ==========================================================================
   Ria Websites Academy - JavaScript Functionality
   Professional Marketing Website with Dark Premium Theme
   ========================================================================== */
// Moved to assets/js/script.js
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

// Global state
const state = {
  currentTestimonial: 0,
  testimonialInterval: null,
  isFormSubmitting: false
};

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
  e.preventDefault();
  const targetId = e.target.getAttribute('href');
  const targetSection = document.querySelector(targetId);
  
  if (targetSection) {
    smoothScrollTo(targetSection);
    closeMobileMenu();
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
  });
  
  // Remove active class from all dots
  DOM.testimonialDots.forEach(dot => {
    dot.classList.remove('active');
  });
  
  // Show selected testimonial
  DOM.testimonials[index].classList.add('active');
  DOM.testimonialDots[index].classList.add('active');
  
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
 * Start testimonials auto-rotation
 */
function startTestimonialsRotation() {
  state.testimonialInterval = setInterval(nextTestimonial, 5000); // Change every 5 seconds
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
 * Handle testimonial dot clicks
 * @param {Event} e - Click event
 */
function handleTestimonialDotClick(e) {
  const slideIndex = parseInt(e.target.getAttribute('data-slide'));
  showTestimonial(slideIndex);
  
  // Restart auto-rotation
  stopTestimonialsRotation();
  startTestimonialsRotation();
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
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Please enter a valid name (letters and spaces only, minimum 2 characters)'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    required: false,
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number'
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
  // Simulate API call delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate success (replace with actual API call)
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      if (success) {
        resolve({ success: true, message: 'Form submitted successfully!' });
      } else {
        reject(new Error('Submission failed. Please try again.'));
      }
    }, 2000); // 2 second delay
  });
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
    
    await submitFormData(formData);
    
    showFormSuccess();
    resetForm();
    
    // TODO: Replace this simulation with actual backend integration
    // Example fetch request:
    /*
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const result = await response.json();
    */
    
  } catch (error) {
    console.error('Form submission error:', error);
    
    // Show error message to user
    const errorElement = document.createElement('div');
    errorElement.className = 'form__error show';
    errorElement.textContent = 'Something went wrong. Please try again or contact us directly.';
    DOM.contactForm.appendChild(errorElement);
    
    setTimeout(() => {
      errorElement.remove();
    }, 5000);
    
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
        // Filter cards
        DOM.portfolioCards.forEach(card => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.style.display = show ? '' : 'none';
        });
        trackEvent('Portfolio Filter', 'Engagement', filter);
      });
    });
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
    }
  }
}

/**
 * Initialize scroll animations
 */
function initializeScrollAnimations() {
  // IntersectionObserver-based reveals
  const revealElements = document.querySelectorAll('.reveal, .service__card, .portfolio__card, .stat');
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
    
    // Initialize first filter state (ensure all visible)
    if (DOM.portfolioFilters.length) {
      DOM.portfolioFilters[0].click();
    }
    
    // Initial scroll handler call
    handleHeaderScroll();
    updateActiveNavLink();
    handleScrollTopVisibility();
    
    console.log('Ria Websites Academy - Website initialized successfully');
  } catch (error) {
    console.error('Initialization error:', error);
  }
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
  
  if (e.target.matches('.portfolio__link')) {
    trackEvent('Portfolio View', 'Engagement', 'Project Details');
  }
  
  if (e.target.matches('.social__link')) {
    trackEvent('Social Click', 'External Link', e.target.getAttribute('aria-label'));
  }
});

// ==========================================================================
// Start Application
// ==========================================================================

// Initialize the application
init();

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { init, RiaWebsites: window.RiaWebsites };
}