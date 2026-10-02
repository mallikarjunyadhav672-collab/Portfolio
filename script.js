(function () {
  "use strict";

  var header = document.getElementById("header");
  var navToggle = document.getElementById("nav-toggle");
  var navMenu = document.getElementById("nav-menu");
  var navLinks = document.querySelectorAll(".nav-link");
  var backToTop = document.getElementById("back-to-top");
  var yearEl = document.getElementById("year");
  var contactForm = document.getElementById("contact-form");
  var typedRole = document.getElementById("typed-role");

  var roles = [
    "B.Tech Final-Year Student",
    "Web Developer",
    "ML & Data Analytics Enthusiast",
  ];
  var roleIndex = 0;
  var charIndex = 0;
  var isDeleting = false;

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var sections = document.querySelectorAll("section[id]");

  /* Active nav link on scroll */
  function updateActiveNav() {
    if (!sections || !sections.length || !navLinks.length) return;
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute("id");
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      }
    });
  }

  /* Sticky header shadow */
  function onScroll() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 40);
    }
    if (backToTop) {
      backToTop.classList.toggle("show", window.scrollY > 500);
    }
    updateActiveNav();
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile menu */
  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("menu-open", open);
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  /* Smooth scroll with offset for fixed header (works on file://) */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var headerOffset = header ? header.offsetHeight : 68;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* Back to top */
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = entry.target.getAttribute("data-delay");
            if (delay) {
              entry.target.style.transitionDelay = delay + "ms";
            }
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* Typing effect for hero role */
  function typeRole() {
    if (!typedRole) return;
    var current = roles[roleIndex];

    if (!isDeleting) {
      typedRole.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeRole, 2200);
        return;
      }
    } else {
      typedRole.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    var speed = isDeleting ? 40 : 70;
    setTimeout(typeRole, speed);
  }

  if (typedRole && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typeRole();
  } else if (typedRole) {
    typedRole.textContent = roles.join(" | ");
  }

  /* Contact form validation (no backend) */
  var fields = {
    name: {
      el: document.getElementById("name"),
      error: document.getElementById("error-name"),
      validate: function (v) {
        if (!v.trim()) return "Name is required.";
        if (v.trim().length < 2) return "Name must be at least 2 characters.";
        return "";
      },
    },
    email: {
      el: document.getElementById("email"),
      error: document.getElementById("error-email"),
      validate: function (v) {
        if (!v.trim()) return "Email is required.";
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(v.trim())) return "Enter a valid email address.";
        return "";
      },
    },
    subject: {
      el: document.getElementById("subject"),
      error: document.getElementById("error-subject"),
      validate: function (v) {
        if (!v.trim()) return "Subject is required.";
        if (v.trim().length < 3) return "Subject must be at least 3 characters.";
        return "";
      },
    },
    message: {
      el: document.getElementById("message"),
      error: document.getElementById("error-message"),
      validate: function (v) {
        if (!v.trim()) return "Message is required.";
        if (v.trim().length < 10) return "Message must be at least 10 characters.";
        return "";
      },
    },
  };

  function validateField(key) {
    var field = fields[key];
    if (!field.el) return true;
    var msg = field.validate(field.el.value);
    field.error.textContent = msg;
    field.el.classList.toggle("invalid", Boolean(msg));
    return !msg;
  }

  Object.keys(fields).forEach(function (key) {
    var field = fields[key];
    if (field.el) {
      field.el.addEventListener("blur", function () {
        validateField(key);
      });
      field.el.addEventListener("input", function () {
        if (field.el.classList.contains("invalid")) {
          validateField(key);
        }
      });
    }
  });

  onScroll();

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var successEl = document.getElementById("form-success");
      if (successEl) successEl.hidden = true;

      var ok = Object.keys(fields).every(function (key) {
        return validateField(key);
      });

      if (ok && successEl) {
        successEl.hidden = false;
        contactForm.reset();
        Object.keys(fields).forEach(function (key) {
          fields[key].el.classList.remove("invalid");
          fields[key].error.textContent = "";
        });
      }
    });
  }

})();
