document.addEventListener("DOMContentLoaded", () => {
  if (!("IntersectionObserver" in window)) return;

  const GSAP_HANDLED =
    ".gs-reveal, .gs-reveal-up, .gs-title-reveal, .js-3d-entrance";

  const isGsapHandled = (el) =>
    el.matches(GSAP_HANDLED) || !!el.closest(GSAP_HANDLED);

  const isSvg = (img) => /\.svg(\?.*)?$/i.test(img.getAttribute("src") || "");
  const isWebp = (img) => /\.webp(\?.*)?$/i.test(img.getAttribute("src") || "");

  const IMAGE_WRAPPERS =
    ".service-img-wrapper, .dd-card-img, .img-wrapper, .insight-img, .nick-img";

  const CONTENT_WRAPPERS =
    ".service-info, .dd-card-body, .card-content, .contact-info, .text-content";

  const imageTargets = new Set();
  const contentTargets = new Set();

  //  Explicit known wrappers that hold a .webp <img> or webp background-image
  document.querySelectorAll(IMAGE_WRAPPERS).forEach((el) => {
    const img = el.querySelector("img");
    const bg = el.style.backgroundImage || "";
    const hasWebp = (img && isWebp(img) && !isSvg(img)) || /\.webp/i.test(bg);
    if (hasWebp) imageTargets.add(el);
  });

  // Any other .webp <img> not already caught above (skips .svg entirely)
  document.querySelectorAll("img").forEach((img) => {
    if (isSvg(img) || !isWebp(img)) return;
    const wrapper = img.closest(IMAGE_WRAPPERS);
    imageTargets.add(wrapper || img);
  });

  // Content-only wrappers paired with the image cards
  document.querySelectorAll(CONTENT_WRAPPERS).forEach((el) => {
    contentTargets.add(el);
  });

  const applyClass = (set, className) => {
    set.forEach((el) => {
      if (!el || isGsapHandled(el)) return;
      el.classList.add(className);
    });
  };

  applyClass(imageTargets, "reveal-img");
  applyClass(contentTargets, "reveal-content");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
  );

  document
    .querySelectorAll(".reveal-img, .reveal-content")
    .forEach((el) => io.observe(el));
});
