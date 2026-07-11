document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Parallax Background for Hero (Kept as scrub because parallax needs it)
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

    // Animate Title Section ON ENTER (No Scrub)
    gsap.from(".section-title", {
      scrollTrigger: {
        trigger: ".title-section",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });

    // Animate Insight Cards ON ENTER (Staggered effect)
    gsap.from(".insight-card", {
      scrollTrigger: {
        trigger: ".insights-section",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out",
    });
  }
});
