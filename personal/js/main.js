// Main application logic

/**
 * Main application class
 */
class App {
  constructor() {
    this.init();
  }

  init() {
    console.log('Portfolio website initialized');

    // Add any global event listeners or initialization code here
    this.setupExternalLinks();
    this.setupImageLoading();
    this.setupEmailProtection();
  }

  /**
   * Setup email protection to prevent harvesting
   */
  setupEmailProtection() {
    document.querySelectorAll('.email-protected').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const email = `${el.dataset.u}@${el.dataset.d}`;
        window.location.href = `mailto:${email}`;
      });
    });
  }

  /**
   * Ensure external links open in new tab and have proper security attributes
   */
  setupExternalLinks() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
      // Ensure security attributes are set
      if (!link.hasAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  /**
   * Setup lazy loading for images
   */
  setupImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    // Check if browser supports lazy loading
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports lazy loading
      images.forEach(img => {
        img.src = img.src;
      });
    } else {
      // Fallback for browsers that don't support lazy loading
      this.lazyLoadImages(images);
    }
  }

  /**
   * Fallback lazy loading implementation using Intersection Observer
   */
  lazyLoadImages(images) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new App();
  });
} else {
  new App();
}

// Handle page visibility changes (optional performance optimization)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, pause any animations or timers if needed
  } else {
    // Page is visible again
  }
});

// Log errors to console (for debugging)
window.addEventListener('error', (e) => {
  console.error('Error occurred:', e.error);
});
