// Animation functionality

class ScrollAnimations {
  constructor() {
    this.sections = document.querySelectorAll('.fade-in-section');
    this.init();
  }

  init() {
    // Set up intersection observer for fade-in animations
    this.setupFadeInObserver();
  }

  setupFadeInObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once animated, we can stop observing
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all fade-in sections
    this.sections.forEach(section => {
      observer.observe(section);
    });
  }
}

// Back to Top Button functionality
class BackToTopButton {
  constructor() {
    this.button = document.getElementById('backToTop');
    if (!this.button) return;

    this.init();
  }

  init() {
    // Show/hide button based on scroll position
    this.setupScrollListener();

    // Handle button click
    this.setupClickListener();
  }

  setupScrollListener() {
    const handleScroll = () => {
      if (hasScrolledPast(300)) {
        this.button.classList.add('show');
      } else {
        this.button.classList.remove('show');
      }
    };

    // Use throttle to improve performance
    window.addEventListener('scroll', throttle(handleScroll, 200));

    // Initial check
    handleScroll();
  }

  setupClickListener() {
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
    new BackToTopButton();
  });
} else {
  new ScrollAnimations();
  new BackToTopButton();
}
