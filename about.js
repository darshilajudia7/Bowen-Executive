document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Parallax Background
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

    gsap.utils.toArray(".text-section").forEach((section) => {
      const title = section.querySelector(".section-title");
      const paragraphs = section.querySelectorAll(".text-content p");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      if (title) {
        tl.from(title, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      }

      if (paragraphs.length) {
        tl.from(
          paragraphs,
          {
            y: 24,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.12,
          },
          title ? "-=0.35" : 0,
        );
      }
    });

    gsap.fromTo(
      ".image-frame-container",
      {
        clipPath: "inset(12% round 12px)",
        scale: 1.08,
        opacity: 0,
      },
      {
        clipPath: "inset(0% round 12px)",
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".image-frame-container",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    gsap.fromTo(
      ".image-bg-1",
      { scale: 1.15 },
      {
        scale: 1,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".image-frame-container",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    const images = gsap.utils.toArray(".image-overlay");

    const imageTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".image-frame-container",
        start: "center center",
        end: "+=1500",
        pin: true,
        scrub: true,
        anticipatePin: 1,
      },
    });

    for (let i = 1; i < images.length; i++) {
      imageTl.to(images[i], {
        opacity: 1,
        duration: 1,
        ease: "none",
      });
    }

    const marketTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".market-section",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    marketTl
      .from(".market-section .text-group", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      })
      .from(
        ".market-section .map-wrapper",
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.3",
      );

    ScrollTrigger.refresh();
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }
});
