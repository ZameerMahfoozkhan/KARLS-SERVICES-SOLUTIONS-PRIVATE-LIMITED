/**
 * KARLS SERVICES - HOME APPLIANCE REPAIR WEBSITE
 * Vanilla JavaScript: Mobile Menu, FAQ Accordion, WhatsApp Form, Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Sticky Navigation Bar & Header State ---
  const siteHeader = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 2. Mobile Navigation Toggle ---
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mainNav = document.querySelector('.main-navigation');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && mainNav) {
    const toggleMenu = () => {
      const isOpen = mainNav.classList.toggle('is-open');
      hamburgerBtn.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburgerBtn.addEventListener('click', toggleMenu);

    // Close when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('is-open')) {
          toggleMenu();
        }
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (
        mainNav.classList.contains('is-open') &&
        !mainNav.contains(e.target) &&
        !hamburgerBtn.contains(e.target)
      ) {
        toggleMenu();
      }
    });
  }

  // --- 3. Interactive FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');

    if (btn && answer) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Optional: Close other open accordion items
        faqItems.forEach((other) => {
          if (other !== item && other.classList.contains('active')) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-question-btn');
            const otherAns = other.querySelector('.faq-answer');
            if (otherAns) otherAns.style.maxHeight = null;
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // --- 4. Interactive Services Category Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card[data-category]');

  if (filterBtns.length > 0 && serviceCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter') || 'all';

        serviceCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.classList.remove('is-hidden');
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }

  // --- 5. Contact Page: WhatsApp Enquiry Form Handler ---
  const enquiryForm = document.getElementById('whatsappEnquiryForm');
  if (enquiryForm) {
    // Check URL parameters to pre-select appliance if navigated from service card
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
      const applianceSelect = document.getElementById('applianceSelect');
      if (applianceSelect) {
        for (let i = 0; i < applianceSelect.options.length; i++) {
          if (
            applianceSelect.options[i].value.toLowerCase() === serviceParam.toLowerCase() ||
            applianceSelect.options[i].text.toLowerCase().includes(serviceParam.toLowerCase())
          ) {
            applianceSelect.selectedIndex = i;
            break;
          }
        }
      }
    }

    // Input elements
    const fullNameInput = document.getElementById('fullName');
    const mobileInput = document.getElementById('mobileNumber');
    const applianceInput = document.getElementById('applianceSelect');
    const locationInput = document.getElementById('serviceLocation');
    const problemInput = document.getElementById('problemDescription');
    const formNotice = document.getElementById('formStatusNotice');

    // Validation helper
    const validateField = (input, isValid, errorMsg) => {
      const errorElem = input.nextElementSibling;
      if (!isValid) {
        input.classList.add('is-invalid');
        if (errorElem && errorElem.classList.contains('form-error-msg')) {
          errorElem.textContent = errorMsg;
        }
        return false;
      } else {
        input.classList.remove('is-invalid');
        return true;
      }
    };

    // Real-time mobile input formatting (digits only)
    mobileInput?.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });

    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;

      // Validate Name
      const nameVal = fullNameInput?.value.trim() || '';
      if (nameVal.length < 2) {
        validateField(fullNameInput, false, 'Please enter your full name (minimum 2 letters).');
        isFormValid = false;
      } else {
        validateField(fullNameInput, true);
      }

      // Validate Mobile Number (10 digits)
      const mobileVal = mobileInput?.value.trim() || '';
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(mobileVal)) {
        validateField(mobileInput, false, 'Please enter a valid 10-digit mobile number.');
        isFormValid = false;
      } else {
        validateField(mobileInput, true);
      }

      // Validate Appliance
      const applianceVal = applianceInput?.value || '';
      if (!applianceVal) {
        validateField(applianceInput, false, 'Please select the appliance requiring repair.');
        isFormValid = false;
      } else {
        validateField(applianceInput, true);
      }

      // Validate Location
      const locationVal = locationInput?.value.trim() || '';
      if (locationVal.length < 2) {
        validateField(locationInput, false, 'Please enter your service location or area in Lucknow.');
        isFormValid = false;
      } else {
        validateField(locationInput, true);
      }

      // Validate Problem Description
      const problemVal = problemInput?.value.trim() || '';
      if (problemVal.length < 5) {
        validateField(problemInput, false, 'Please describe the appliance problem briefly.');
        isFormValid = false;
      } else {
        validateField(problemInput, true);
      }

      if (!isFormValid) {
        return;
      }

      // Exact formatted WhatsApp message for Climnexa Sales & Services:
      const formattedMessage =
`Hello CLIMNEXA SALES & SERVICES,

I would like to enquire about appliance sales / service / maintenance.

Name: ${nameVal}
Mobile: ${mobileVal}
Service Required: ${applianceVal}
Location: ${locationVal}
Details / Problem: ${problemVal}

Please contact me regarding the service.

Thank you.`;

      // Official WhatsApp URL
      const whatsappBaseUrl = 'https://wa.me/919580659559';
      const fullUrl = `${whatsappBaseUrl}?text=${encodeURIComponent(formattedMessage)}`;

      // Display transparent status notice (does not claim enquiry is already received)
      if (formNotice) {
        formNotice.style.display = 'block';
        formNotice.innerHTML = `
          <div style="background-color: #E8F9EE; border: 1px solid #25D366; border-radius: 8px; padding: 1rem; color: #146C37; margin-top: 1rem;">
            <strong><i class="fa-brands fa-whatsapp"></i> Opening WhatsApp...</strong><br>
            Your enquiry details have been prepared. Please review and tap <strong>"Send"</strong> inside WhatsApp to transmit your enquiry directly to our team.
          </div>
        `;
      }

      // Open WhatsApp in a new tab/window
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // --- 5. Scroll Animations with IntersectionObserver ---
  const revealElements = document.querySelectorAll('.reveal-fade-up');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // --- 6. Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 90;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    });
  });
});
