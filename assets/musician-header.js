/**
 * Musician Header
 * Handles sticky header, transparent-to-solid transition, smooth scroll, and active nav states
 */

(function() {
  'use strict';

  const header = document.querySelector('.header--musician');
  const heroSection = document.querySelector('#hero');
  const mobileToggle = document.querySelector('.header__mobile-toggle');
  const mobileMenu = document.querySelector('.header__mobile-menu');
  const mobileClose = document.querySelector('.header__mobile-close');
  const layoutMode = document.body.dataset.layout;

  if (!header) return;

  /**
   * Handle sticky header transparency based on scroll position
   */
  let scrollTimeout;
  function initHeaderTransparency() {
    function handleScroll() {
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        requestAnimationFrame(() => {
          if (window.scrollY < 100) {
            header.classList.add('header--transparent');
            header.classList.remove('header--scrolled');
            header.classList.remove('scrolled');
          } else {
            header.classList.remove('header--transparent');
            header.classList.add('header--scrolled');
            header.classList.add('scrolled');
          }
        });
      }, 50);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /**
   * Handle smooth scrolling for anchor links in one-page mode
   */
  function initSmoothScroll() {
    if (layoutMode !== 'onepage') return;

    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();
          
          if (mobileMenu && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
          }

          const headerHeight = header.offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Handle active nav state based on scroll position in one-page mode
   */
  function initActiveNavStates() {
    if (layoutMode !== 'onepage') return;

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link, .header__mobile-nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const sectionId = entry.target.id;
            
            requestAnimationFrame(() => {
              navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${sectionId}`) {
                  link.classList.add('active');
                } else {
                  link.classList.remove('active');
                }
              });
            });
          }
        });
      },
      { threshold: [0, 0.3, 0.7], rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach(section => observer.observe(section));
  }

  /**
   * Handle mobile menu toggle
   */
  function initMobileMenu() {
    if (!mobileToggle || !mobileMenu || !mobileClose) return;

    mobileToggle.addEventListener('click', openMobileMenu);
    mobileClose.addEventListener('click', closeMobileMenu);

    mobileMenu.addEventListener('click', function(e) {
      if (e.target === mobileMenu) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    requestAnimationFrame(() => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
      mobileClose.focus();
    });
  }

  function closeMobileMenu() {
    requestAnimationFrame(() => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
      mobileToggle.focus();
    });
  }

  /**
   * Initialize all header functionality
   */
  function init() {
    initHeaderTransparency();
    initSmoothScroll();
    initActiveNavStates();
    initMobileMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
