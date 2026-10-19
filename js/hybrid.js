(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- reveal au scroll ---- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- nav mobile (simple toggle, pas d'off-canvas plein écran) ---- */
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- focus trap générique ---- */
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
  function lockBody() { openOverlaysCount++; document.body.classList.add("offcanvas-open"); }
  function unlockBody() { openOverlaysCount = Math.max(0, openOverlaysCount - 1); if (openOverlaysCount === 0) document.body.classList.remove("offcanvas-open"); }

  /* ---- off-canvas réservation ---- */
  var bookingPanel = document.getElementById("booking-panel");
  var bookingTriggers = Array.prototype.slice.call(document.querySelectorAll("[data-open-booking]"));
  var bookingLoaded = false;
  var releaseBookingTrap = null;
  var lastFocusedBooking = null;

  function openBooking(e) {
    if (e) e.preventDefault();
    lastFocusedBooking = document.activeElement;
    bookingPanel.classList.add("is-open");
    lockBody();
    releaseBookingTrap = trapFocus(bookingPanel);
    var closeBtn = bookingPanel.querySelector("[data-close-booking]");
    if (closeBtn) closeBtn.focus();
    document.addEventListener("keydown", onBookingKeydown);
    if (!bookingLoaded) {
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
    }
  }
  function closeBooking() {
    bookingPanel.classList.remove("is-open");
    unlockBody();
    if (releaseBookingTrap) releaseBookingTrap();
    document.removeEventListener("keydown", onBookingKeydown);
    if (lastFocusedBooking && lastFocusedBooking.focus) lastFocusedBooking.focus();
  }
  function onBookingKeydown(e) { if (e.key === "Escape") closeBooking(); }

  bookingTriggers.forEach(function (t) { t.addEventListener("click", openBooking); });
  bookingPanel.querySelectorAll("[data-close-booking]").forEach(function (btn) {
    btn.addEventListener("click", closeBooking);
  });

  /* ---- lightbox menu ---- */
  var lightbox = document.getElementById("menu-lightbox");
  var lightboxImgs = Array.prototype.slice.call(lightbox.querySelectorAll("img"));
  var lightboxCount = document.getElementById("lightbox-count");
  var lightboxTriggers = Array.prototype.slice.call(document.querySelectorAll("[data-open-lightbox]"));
  var currentIndex = 0;
  var releaseLightboxTrap = null;
  var lastFocusedLightbox = null;

  function showIndex(i) {
    currentIndex = (i + lightboxImgs.length) % lightboxImgs.length;
    lightboxImgs.forEach(function (img, idx) { img.classList.toggle("is-active", idx === currentIndex); });
    lightboxCount.textContent = (currentIndex + 1) + " / " + lightboxImgs.length;
  }
  function openLightbox(e) {
    if (e) e.preventDefault();
    lastFocusedLightbox = document.activeElement;
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
    if (lastFocusedLightbox && lastFocusedLightbox.focus) lastFocusedLightbox.focus();
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

  /* ---- FAQ accordéon ---- */
  document.querySelectorAll(".faq-item__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
    });
  });
})();
