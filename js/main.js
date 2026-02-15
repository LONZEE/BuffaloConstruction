/* ================================================
   BUFFALO CONSTRUCTION — Main JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==================== PRELOADER ====================
  const preloader = document.getElementById('preloader');

  function hidePreloader() {
    if (preloader) {
      preloader.classList.add('loaded');
    }
  }

  // Hide after delay once page loads
  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 2500);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 2500));
  }

  // Fallback: always hide after 3.5s no matter what
  setTimeout(hidePreloader, 3500);


  // ==================== NAVBAR SCROLL ====================
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollCenter = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollCenter >= top && scrollCenter < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  function handleScroll() {
    if (!navbar) return;
    const scrollY = window.scrollY;

    // Navbar background
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (backToTop) {
      if (scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Active nav link
    updateActiveNavLink();
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check


  // ==================== MOBILE MENU ====================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .btn-mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }


  // ==================== SMOOTH SCROLL ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight : 80;
        const targetPos = target.offsetTop - offset;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });


  // ==================== BACK TO TOP ====================
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ==================== HERO SLIDESHOW ====================
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;

  function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  if (slides.length > 1) {
    setInterval(nextSlide, 5000);
  }


  // ==================== SCROLL ANIMATIONS ====================
  // Add js-loaded class so CSS knows JS is working (progressive enhancement)
  document.body.classList.add('js-loaded');

  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.05
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => scrollObserver.observe(el));

  // Safety fallback: reveal everything after 4 seconds in case observer fails
  setTimeout(() => {
    animatedElements.forEach(el => el.classList.add('animated'));
  }, 4000);


  // ==================== COUNTER ANIMATION ====================
  const counters = document.querySelectorAll('.stat-number, .float-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (!target) return;

        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const value = Math.floor(eased * target);
      el.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(tick);
  }


  // ==================== PROJECT FILTER ====================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  // ==================== TESTIMONIALS SLIDER ====================
  const track = document.getElementById('testimonialTrack');
  const testCards = track ? track.querySelectorAll('.testimonial-card') : [];
  const dotsContainer = document.getElementById('testDots');
  const prevBtn = document.getElementById('testPrev');
  const nextBtn = document.getElementById('testNext');
  let currentTestimonial = 0;
  let testimonialInterval;

  function initTestimonials() {
    if (!track || testCards.length === 0) return;

    // Create dots
    testCards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('test-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToTestimonial(i));
      dotsContainer.appendChild(dot);
    });

    prevBtn.addEventListener('click', () => {
      goToTestimonial(currentTestimonial - 1);
    });

    nextBtn.addEventListener('click', () => {
      goToTestimonial(currentTestimonial + 1);
    });

    // Auto play
    startTestimonialAutoplay();

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
    track.addEventListener('mouseleave', startTestimonialAutoplay);
  }

  function goToTestimonial(index) {
    if (index < 0) index = testCards.length - 1;
    if (index >= testCards.length) index = 0;

    currentTestimonial = index;
    track.style.transform = `translateX(-${index * 100}%)`;

    // Update dots
    dotsContainer.querySelectorAll('.test-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function startTestimonialAutoplay() {
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(() => {
      goToTestimonial(currentTestimonial + 1);
    }, 6000);
  }

  initTestimonials();


  // ==================== CONTACT FORM (Web3Forms) ====================
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formResult = document.getElementById('formResult');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Update button state
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          formResult.className = 'form-result success';
          formResult.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.';
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Something went wrong');
        }
      } catch (error) {
        formResult.className = 'form-result error';
        formResult.innerHTML = '<i class="fas fa-exclamation-circle"></i> Oops! Something went wrong. Please try again or call us directly.';
      }

      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;

      // Hide the result message after 8 seconds
      setTimeout(() => {
        formResult.className = 'form-result';
        formResult.style.display = 'none';
      }, 8000);
    });
  }


  // ==================== FADE-IN-UP ANIMATION KEYFRAMES ====================
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

});
