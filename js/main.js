(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     Reveal au scroll — fade pur, cascade de délais, une seule fois
     ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.style.transitionDuration = (el.dataset.duration || 800) + "ms";
          el.style.transitionDelay = (el.dataset.delay || 0) + "ms";
          el.classList.add("is-visible");
          io.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     Hero jour / nuit — selon l'heure locale (18h–7h = nuit)
     ------------------------------------------------------------------ */
  var hour = new Date().getHours();
  var isNight = hour >= 18 || hour < 7;
  document.documentElement.classList.toggle("is-night", isNight);

  /* ------------------------------------------------------------------
     Focus trap générique pour panneaux / lightbox
     ------------------------------------------------------------------ */
  function trapFocus(container) {
    var focusables = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, iframe, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return function () {};
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    function onKeydown(e) {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    container.addEventListener("keydown", onKeydown);
    return function () { container.removeEventListener("keydown", onKeydown); };
  }

  var openOverlaysCount = 0;
  function lockBody() {
    openOverlaysCount++;
    document.body.classList.add("offcanvas-open");
  }
  function unlockBody() {
    openOverlaysCount = Math.max(0, openOverlaysCount - 1);
    if (openOverlaysCount === 0) document.body.classList.remove("offcanvas-open");
  }

  /* ------------------------------------------------------------------
     Off-canvas générique (nav + réservation)
     ------------------------------------------------------------------ */
  function createOffcanvas(panel, triggers, closeSelector, opts) {
    opts = opts || {};
    var releaseTrap = null;
    var lastFocused = null;

    function open() {
      lastFocused = document.activeElement;
      panel.classList.add("is-open");
      lockBody();
      releaseTrap = trapFocus(panel);
      var closeBtn = panel.querySelector(closeSelector);
      if (closeBtn) closeBtn.focus();
      if (opts.onOpen) opts.onOpen();
      document.addEventListener("keydown", onKeydown);
    }
    function close() {
      panel.classList.remove("is-open");
      unlockBody();
      if (releaseTrap) releaseTrap();
      document.removeEventListener("keydown", onKeydown);
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }
    function onKeydown(e) {
      if (e.key === "Escape") close();
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", open);
    });
    panel.querySelectorAll(closeSelector).forEach(function (btn) {
      btn.addEventListener("click", close);
    });
    panel.querySelectorAll("[data-close-nav], [data-close-booking]").forEach(function (link) {
      link.addEventListener("click", close);
    });

    return { open: open, close: close };
  }

  var navPanel = document.getElementById("nav-panel");
  var navToggle = document.getElementById("nav-toggle");
  var navOffcanvas = createOffcanvas(navPanel, [navToggle], "[data-close-nav]", {
    onOpen: function () { navToggle.setAttribute("aria-expanded", "true"); },
  });
  var _navClose = navOffcanvas.close;
  navOffcanvas.close = function () {
    _navClose();
    navToggle.setAttribute("aria-expanded", "false");
  };
  navPanel.querySelectorAll("[data-close-nav]").forEach(function (el) {
    el.addEventListener("click", navOffcanvas.close);
  });

  var bookingPanel = document.getElementById("booking-panel");
  var bookingTriggers = Array.prototype.slice.call(document.querySelectorAll("[data-open-booking]"));
  var bookingLoaded = false;
  var bookingOffcanvas = createOffcanvas(bookingPanel, bookingTriggers, "[data-close-booking]", {
    onOpen: function () {
      if (bookingLoaded) return;
      bookingLoaded = true;
      var wrap = document.getElementById("booking-iframe-wrap");
      var iframe = document.createElement("iframe");
      iframe.title = "Foocha — book a table";
      iframe.src = "https://www.foocha.be/bookings";
      iframe.addEventListener("load", function () {
        var loading = wrap.querySelector(".offcanvas__loading");
        if (loading) loading.remove();
      });
      wrap.appendChild(iframe);
    },
  });

  /* ------------------------------------------------------------------
     Lightbox menu
     ------------------------------------------------------------------ */
  var lightbox = document.getElementById("menu-lightbox");
  var lightboxImgs = Array.prototype.slice.call(lightbox.querySelectorAll("img"));
  var lightboxCount = document.getElementById("lightbox-count");
  var lightboxTriggers = Array.prototype.slice.call(document.querySelectorAll("[data-open-lightbox]"));
  var currentIndex = 0;
  var releaseLightboxTrap = null;
  var lastFocusedBeforeLightbox = null;

  function showIndex(i) {
    currentIndex = (i + lightboxImgs.length) % lightboxImgs.length;
    lightboxImgs.forEach(function (img, idx) {
      img.classList.toggle("is-active", idx === currentIndex);
    });
    lightboxCount.textContent = (currentIndex + 1) + " / " + lightboxImgs.length;
  }

  function openLightbox() {
    if (navPanel.classList.contains("is-open")) navOffcanvas.close();
    lastFocusedBeforeLightbox = document.activeElement;
    showIndex(0);
    lightbox.classList.add("is-open");
    lockBody();
    releaseLightboxTrap = trapFocus(lightbox);
    document.addEventListener("keydown", onLightboxKeydown);
    var closeBtn = lightbox.querySelector("[data-close-lightbox]");
    if (closeBtn) closeBtn.focus();
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    unlockBody();
    if (releaseLightboxTrap) releaseLightboxTrap();
    document.removeEventListener("keydown", onLightboxKeydown);
    if (lastFocusedBeforeLightbox && lastFocusedBeforeLightbox.focus) lastFocusedBeforeLightbox.focus();
  }
  function onLightboxKeydown(e) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showIndex(currentIndex + 1);
    if (e.key === "ArrowLeft") showIndex(currentIndex - 1);
  }

  lightboxTriggers.forEach(function (t) { t.addEventListener("click", openLightbox); });
  lightbox.querySelector("[data-close-lightbox]").addEventListener("click", closeLightbox);
  lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", function () { showIndex(currentIndex - 1); });
  lightbox.querySelector("[data-lightbox-next]").addEventListener("click", function () { showIndex(currentIndex + 1); });

  /* ------------------------------------------------------------------
     FAQ accordéon
     ------------------------------------------------------------------ */
  document.querySelectorAll(".faq-item__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
    });
  });
})();
