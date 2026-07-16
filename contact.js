document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".hero-section", {
      backgroundPosition: "50% 100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.from(".hero-anim h1, .hero-anim p", {
      y: 60,
      opacity: 0,
      rotationX: -25,
      transformOrigin: "0% 50% -50",
      duration: 1.2,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.1,
    });

    gsap.from(".title-section h2", {
      scrollTrigger: {
        trigger: ".title-section",
        start: "top 90%",
        end: "top 50%",
        scrub: 1,
      },
      y: 30,
      opacity: 0,
      scale: 0.98,
      transformOrigin: "left center",
    });

    gsap.from(".form-section .info-anim > div", {
      scrollTrigger: {
        trigger: ".form-section",
        start: "top 75%",
      },
      x: -40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    });

    gsap.from(".custom-form .row, .custom-form .mb-4, .custom-form .text-end", {
      scrollTrigger: {
        trigger: ".custom-form",
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.2)",
    });
  }
});
