/**
 * BOWEN EXECUTIVE — GLOBAL ANIMATIONS (animations.js)
 *
 * Shared utility:
 * - IntersectionObserver scroll reveals for .webp images & content blocks
 * - GSAP ScrollTrigger section-entry animations (uniform pattern)
 * - 3D mouse-tilt for .js-tilt elements
 *
 * Loaded on every page alongside header_footer.js
 */
document.addEventListener("DOMContentLoaded", () => {
  if (!("IntersectionObserver" in window)) return;

  // ─── Selectors ────────────────────────────────────────────────────────────
  const GSAP_HANDLED =
    ".gs-reveal, .gs-reveal-up, .gs-title-reveal, .js-3d-entrance";

  const isGsapHandled = (el) =>
    el.matches(GSAP_HANDLED) || !!el.closest(GSAP_HANDLED);

  const isSvg = (img) => /\.svg(\?.*)?$/i.test(img.getAttribute("src") || "");
  const isWebp = (img) => /\.webp(\?.*)?$/i.test(img.getAttribute("src") || "");

  const IMAGE_WRAPPERS =
    ".service-img-wrapper, .dd-card-img, .img-wrapper, .image-container, .nick-img";
  const CONTENT_WRAPPERS =
    ".service-info, .dd-card-body, .card-content, .contact-info, .text-content";

  const imageTargets = new Set();
  const contentTargets = new Set();

  // Collect image wrappers containing .webp
  document.querySelectorAll(IMAGE_WRAPPERS).forEach((el) => {
    const img = el.querySelector("img");
    const bg = el.style.backgroundImage || "";
    const hasWebp = (img && isWebp(img) && !isSvg(img)) || /\.webp/i.test(bg);
    if (hasWebp) imageTargets.add(el);
  });

  // Collect standalone .webp images not already inside a known wrapper
  document.querySelectorAll("img").forEach((img) => {
    if (isSvg(img) || !isWebp(img)) return;
    const wrapper = img.closest(IMAGE_WRAPPERS);
    imageTargets.add(wrapper || img);
  });

  // Content wrappers
  document.querySelectorAll(CONTENT_WRAPPERS).forEach((el) => {
    contentTargets.add(el);
  });

  // Apply reveal classes (skip GSAP-handled elements)
  const applyClass = (set, className) => {
    set.forEach((el) => {
      if (!el || isGsapHandled(el)) return;
      el.classList.add(className);
    });
  };

  applyClass(imageTargets, "reveal-img");
  applyClass(contentTargets, "reveal-content");

  // IntersectionObserver
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  document.querySelectorAll(".reveal-img, .reveal-content").forEach((el) =>
    io.observe(el)
  );

  // ─── GSAP SECTION-ENTRY ANIMATIONS ────────────────────────────────────────
  // Uniform pattern used on every page. Each section fades + translates in
  // as the user scrolls to it.
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    /**
     * sectionReveal(targets, triggerEl, options)
     * Standard entrance: fade up from translateY offset.
     */
    const sectionReveal = (targets, trigger, opts = {}) => {
      const elements = document.querySelectorAll(targets);
      if (!elements.length) return;

      gsap.from(elements, {
        opacity: 0,
        y: opts.y ?? 50,
        duration: opts.duration ?? 0.9,
        stagger: opts.stagger ?? 0.12,
        ease: opts.ease ?? "power3.out",
        scrollTrigger: {
          trigger: trigger || elements[0],
          start: opts.start ?? "top 82%",
          toggleActions: "play none none none",
        },
      });
    };

    // --- Services section (index page) ---
    sectionReveal(".services-header h2", ".services-section", { y: 40, duration: 0.8 });
    sectionReveal(".service-card", ".services-grid", {
      y: 60,
      stagger: 0.15,
      duration: 1,
    });

    // --- Snapshot / stats section ---
    sectionReveal(".snapshot-left h2", ".snapshot-section", { y: 40, duration: 0.8 });
    sectionReveal(".stat", ".snapshot-section", {
      y: 40,
      stagger: 0.15,
      duration: 0.8,
    });

    // --- Insights section ---
    sectionReveal(".insights-header", ".insights-section", { y: 40, duration: 0.7 });
    sectionReveal(".insight-card", ".insights-grid", {
      y: 60,
      stagger: 0.1,
      duration: 0.9,
    });

    // --- About / text sections (about, service pages) ---
    sectionReveal(".text-section", ".about-section", {
      y: 40,
      stagger: 0.12,
      duration: 0.9,
    });

    // --- Market / map section ---
    sectionReveal(".text-group", ".market-section", { y: 40, duration: 0.8 });
    sectionReveal(".map-wrapper", ".market-section", {
      y: 50,
      duration: 1,
      start: "top 85%",
    });

    // --- Sectors section ---
    sectionReveal(".sectors-header h2", ".sectors-section", { y: 40, duration: 0.8 });
    sectionReveal(".sector-card", ".sectors-grid", {
      y: 60,
      stagger: 0.15,
      duration: 1,
    });

    // --- Contact form section ---
    sectionReveal(".info-anim > div", ".form-section", {
      y: 40,
      stagger: 0.15,
      duration: 0.9,
    });
    sectionReveal(".custom-form .row, .custom-form .mb-4, .custom-form .text-end",
      ".custom-form", {
        y: 30,
        stagger: 0.12,
        duration: 0.8,
      }
    );

    // --- Civil Insight cards ---
    sectionReveal(".insight-card", ".insights-section", {
      y: 60,
      stagger: 0.12,
      duration: 0.9,
    });

    // --- Title sections (civil_inside, contact) ---
    sectionReveal(".title-section .section-title, .title-section h2", ".title-section", {
      y: 30,
      duration: 0.8,
    });

    // ─── 3D MOUSE TILT for .js-tilt elements ────────────────────────────────
    document.querySelectorAll(".js-tilt").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -12;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12;

        gsap.to(el, {
          rotateX,
          rotateY,
          transformPerspective: 1000,
          ease: "power2.out",
          duration: 0.4,
        });
      });

      el.addEventListener("mouseleave", () => {
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          ease: "elastic.out(1, 0.4)",
          duration: 1.2,
        });
      });
    });

    ScrollTrigger.refresh();
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }
});
