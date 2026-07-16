document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".gs-reveal", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power4.out",
      delay: 0.2,
    });

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

    gsap.from(".section-title", {
      scrollTrigger: {
        trigger: ".title-section",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(".insight-card", {
      scrollTrigger: {
        trigger: ".insights-section",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      y: 60,
      opacity: 0,
      rotation: 2,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.2)",
    });

    const tiltElements = document.querySelectorAll(".js-tilt");

    tiltElements.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        gsap.to(el, {
          rotateX: rotateX,
          rotateY: rotateY,
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
  }
});
