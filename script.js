document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    });
  });

  // Sticky Header Scroll Effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    });
  }

  // Contact Form Validation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');
      const subject = document.getElementById('subject');
      const message = document.getElementById('message');
      
      // Simple validation logic
      if (!name.value.trim()) {
        isValid = false;
        showError(name, 'Name is required');
      } else {
        removeError(name);
      }

      if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) {
        isValid = false;
        showError(email, 'Valid email is required');
      } else {
        removeError(email);
      }

      if (!phone.value.trim()) {
        isValid = false;
        showError(phone, 'Phone is required');
      } else {
        removeError(phone);
      }

      if (!subject.value.trim()) {
        isValid = false;
        showError(subject, 'Subject is required');
      } else {
        removeError(subject);
      }

      if (!message.value.trim()) {
        isValid = false;
        showError(message, 'Message is required');
      } else {
        removeError(message);
      }

      if (isValid) {
        // Show success message
        const formStatus = document.getElementById('formStatus');
        formStatus.textContent = 'Thank you for your message! We will get back to you soon.';
        formStatus.style.color = '#10B981'; // Green
        formStatus.style.display = 'block';
        contactForm.reset();
        
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 5000);
      }
    });
  }

  function showError(input, message) {
    const formGroup = input.parentElement;
    let errorMsg = formGroup.querySelector('.error-message');
    if (!errorMsg) {
      errorMsg = document.createElement('small');
      errorMsg.className = 'error-message';
      errorMsg.style.color = '#EF4444'; // Red
      errorMsg.style.marginTop = '0.5rem';
      errorMsg.style.display = 'block';
      formGroup.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
    input.style.borderColor = '#EF4444';
  }

  function removeError(input) {
    const formGroup = input.parentElement;
    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.remove();
    }
    input.style.borderColor = '#e2e8f0';
  }
});
