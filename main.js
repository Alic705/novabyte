document.addEventListener('DOMContentLoaded', () => {
  // ── 1. Mobile Menu Toggle ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a, .btn-cta-mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ── 2. Navbar Scroll Effect & Active ScrollSpy ──
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link-item');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  });

  // ── 3. Scroll Reveal Animations ──
  const animateElements = document.querySelectorAll('[data-animate]');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  // ── 4. Terminal Interactive Tabs ──
  const tabAgent = document.getElementById('tabAgent');
  const tabTelemetry = document.getElementById('tabTelemetry');
  const termBodyAgent = document.getElementById('termBodyAgent');
  const termBodyTelemetry = document.getElementById('termBodyTelemetry');

  if (tabAgent && tabTelemetry && termBodyAgent && termBodyTelemetry) {
    tabAgent.addEventListener('click', () => {
      tabAgent.classList.add('active');
      tabTelemetry.classList.remove('active');
      termBodyAgent.classList.remove('d-none');
      termBodyTelemetry.classList.add('d-none');
    });

    tabTelemetry.addEventListener('click', () => {
      tabTelemetry.classList.add('active');
      tabAgent.classList.remove('active');
      termBodyTelemetry.classList.remove('d-none');
      termBodyAgent.classList.add('d-none');
    });
  }

  // ── 5. Interactive ROI Savings Calculator ──
  const calcWorkflow = document.getElementById('calcWorkflow');
  const hoursSlider = document.getElementById('hoursSlider');
  const hoursDisplay = document.getElementById('hoursDisplay');
  const rateSlider = document.getElementById('rateSlider');
  const rateDisplay = document.getElementById('rateDisplay');
  const annualSavings = document.getElementById('annualSavings');
  const hoursSaved = document.getElementById('hoursSaved');
  const paybackPeriod = document.getElementById('paybackPeriod');
  const calcCtaBtn = document.getElementById('calcCtaBtn');

  function updateCalculator() {
    if (!hoursSlider || !rateSlider || !annualSavings) return;

    const hoursPerWeek = parseFloat(hoursSlider.value);
    const hourlyRate = parseFloat(rateSlider.value);
    const workflow = calcWorkflow ? calcWorkflow.value : 'support';

    hoursDisplay.textContent = hoursPerWeek + ' hrs/wk';
    rateDisplay.textContent = '$' + hourlyRate + ' / hr';

    // Automation efficiency factors
    let efficiencyFactor = 0.70; // 70% support deflection
    let sprintCost = 14000;

    if (workflow === 'rag') {
      efficiencyFactor = 0.75;
      sprintCost = 16000;
    } else if (workflow === 'ops') {
      efficiencyFactor = 0.85;
      sprintCost = 18000;
    }

    const weeklyHoursSaved = hoursPerWeek * efficiencyFactor;
    const totalHoursSavedYear = Math.round(weeklyHoursSaved * 52);
    const grossDollarSavings = totalHoursSavedYear * hourlyRate;
    
    // Net annual savings subtracting estimated maintenance
    const netSavings = Math.max(0, grossDollarSavings - 4800);
    
    // Payback period in days
    const dailySavings = grossDollarSavings / 365;
    const paybackDays = dailySavings > 0 ? Math.round(sprintCost / dailySavings) : 60;

    annualSavings.textContent = '$' + netSavings.toLocaleString();
    hoursSaved.textContent = totalHoursSavedYear.toLocaleString() + ' hrs';
    paybackPeriod.textContent = '< ' + Math.min(paybackDays, 90) + ' Days';
  }

  if (hoursSlider && rateSlider) {
    hoursSlider.addEventListener('input', updateCalculator);
    rateSlider.addEventListener('input', updateCalculator);
    if (calcWorkflow) calcWorkflow.addEventListener('change', updateCalculator);
    updateCalculator();
  }

  if (calcCtaBtn) {
    calcCtaBtn.addEventListener('click', () => {
      const serviceSelect = document.getElementById('service');
      if (serviceSelect && calcWorkflow) {
        if (calcWorkflow.value === 'support') serviceSelect.value = 'chatbot';
        else if (calcWorkflow.value === 'rag') serviceSelect.value = 'rag';
        else if (calcWorkflow.value === 'ops') serviceSelect.value = 'automation';
      }
    });
  }

  // ── 6. Service Cards CTA Auto-select ──
  const serviceBtns = document.querySelectorAll('.service-btn[data-service]');
  serviceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetService = btn.getAttribute('data-service');
      const serviceSelect = document.getElementById('service');
      if (serviceSelect && targetService) {
        serviceSelect.value = targetService;
      }
    });
  });

  // ── 7. FAQ Accordion ──
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── 8. Back to Top Button ──
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ── 9. Contact Form Handling with Client Validation ──
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const companyInput = document.getElementById('company');
      const serviceSelect = document.getElementById('service');

      let isValid = true;

      // Validate name
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        nameInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        emailInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate company
      if (companyInput && !companyInput.value.trim()) {
        companyInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else if (companyInput) {
        companyInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate service
      if (serviceSelect && !serviceSelect.value) {
        serviceSelect.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else if (serviceSelect) {
        serviceSelect.closest('.form-group').classList.remove('has-error');
      }

      if (!isValid) return;

      // Submit feedback
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Transmitting Architecture Spec...</span><i class="bi bi-hourglass-split"></i>';
      submitBtn.disabled = true;

      // Simulate API submission
      setTimeout(() => {
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        formSuccess.style.display = 'flex';
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 8000);
      }, 1200);
    });

    // Clear error on input
    contactForm.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
    });
  }

  // ── 10. Smooth Scrolling for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
