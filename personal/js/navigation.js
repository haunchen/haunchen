// Navigation functionality

class Navigation {
  constructor() {
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
    this.intersectingSection = '';
    this.init();
  }

  init() {
    // Set up intersection observer for sections
    this.setupIntersectionObserver();

    // Set up scroll listener
    this.setupScrollListener();

    // Set up nav link clicks
    this.setupNavLinkClicks();
  }

  setupIntersectionObserver() {
    const options = {
      rootMargin: '-40% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          this.intersectingSection = id === 'hero' ? '' : `#${id}`;
        }
      });
    }, options);

    // Observe all sections
    this.sections.forEach(section => {
      observer.observe(section);
    });
  }

  setupScrollListener() {
    const handleScroll = () => {
      // Check if at bottom of page
      const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 5;

      if (atBottom) {
        // If at bottom, always highlight "Contact"
        this.setActiveLink('#contact');
      } else {
        // Otherwise, use the intersecting section
        this.setActiveLink(this.intersectingSection);
      }
    };

    // Use throttle to improve performance
    window.addEventListener('scroll', throttle(handleScroll, 100));

    // Initial check
    handleScroll();
  }

  setupNavLinkClicks() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        smoothScrollTo(targetId);
      });
    });
  }

  setActiveLink(href) {
    this.navLinks.forEach(link => {
      if (link.getAttribute('href') === href) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
  });
} else {
  new Navigation();
}
