document.addEventListener("DOMContentLoaded", () => {
  //  SECTORS SLIDER LOGIC
  const slider = document.getElementById("sectors-slider");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  if (slider && prevBtn && nextBtn) {
    const getScrollAmount = () => {
      const card = slider.querySelector(".sector-card");
      const gap = parseInt(window.getComputedStyle(slider).gap) || 0;
      return card.offsetWidth + gap;
    };

    prevBtn.addEventListener("click", () => {
      slider.scrollLeft -= getScrollAmount();
    });

    nextBtn.addEventListener("click", () => {
      slider.scrollLeft += getScrollAmount();
    });
  }

  //  GSAP ANIMATIONS
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Cinematic Hero Reveal
    gsap.from(".gs-reveal-up", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power4.out",
      delay: 0.2,
    });

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

    // Text Section Reveals
    gsap.utils.toArray(".text-section").forEach((section) => {
      const title = section.querySelector(".gs-title-reveal");
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
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power4.out",
        });
      }

      if (paragraphs.length) {
        tl.from(
          paragraphs,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
          },
          title ? "-=0.4" : 0,
        );
      }
    });

    // Stats List Reveal (Leadership page)
    if (document.querySelectorAll(".stats-list").length > 0) {
      document.querySelectorAll(".stats-list").forEach((list) => {
        const section = list.closest(".text-section");
        gsap.from(list.querySelectorAll("li"), {
          y: 16,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: section || list,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }

    // 3D Image Frame Entrance
    if (document.querySelector(".js-3d-entrance")) {
      gsap.fromTo(
        ".js-3d-entrance",
        {
          clipPath: "inset(15% round 12px)",
          scale: 0.9,
          opacity: 0,
          rotationX: 15,
          transformPerspective: 1000,
        },
        {
          clipPath: "inset(0% round 12px)",
          scale: 1,
          opacity: 1,
          rotationX: 0,
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".js-3d-entrance",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }

    // Image Sequence Pin & Scrub
    if (document.querySelector(".image-frame-container")) {
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
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      for (let i = 1; i < images.length; i++) {
        imageTl.to(images[i], { opacity: 1, duration: 1, ease: "none" });
      }
    }

    // Leadership Assessment Pin & Scrub (Leadership page)
    if (document.querySelector(".leadership-assessment-section")) {
      gsap.fromTo(
        ".leadership-assessment-section",
        { clipPath: "inset(12% round 12px)", scale: 1.08, opacity: 0 },
        {
          clipPath: "inset(0% round 12px)",
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".leadership-assessment-section",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".leadership-assessment-section .la-bg-1",
        { scale: 1.15 },
        {
          scale: 1,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".leadership-assessment-section",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.from(
        ".leadership-assessment-section .la-text-top, .leadership-assessment-section .la-text-bottom",
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".leadership-assessment-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      const laImages = gsap.utils.toArray(
        ".leadership-assessment-section .la-image-overlay",
      );

      if (laImages.length > 1) {
        const laImageTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".leadership-assessment-section",
            start: "center center",
            end: "+=1500",
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        });

        for (let i = 1; i < laImages.length; i++) {
          laImageTl.to(laImages[i], { opacity: 1, duration: 1, ease: "none" });
        }
      }
    }

    // Market Section Reveal
    if (document.querySelector(".market-section")) {
      const marketTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".market-section",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      marketTl
        .from(".market-title", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power4.out",
        })
        .from(
          ".market-desc",
          { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" },
          "-=0.5",
        )
        .from(
          ".map-wrapper",
          { y: 40, opacity: 0, scale: 0.95, duration: 1, ease: "power3.out" },
          "-=0.4",
        );
    }

    // Interactive 3D Map Hover
    const mapWrapper = document.querySelector(".js-tilt");
    if (mapWrapper) {
      mapWrapper.addEventListener("mousemove", (e) => {
        const rect = mapWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(mapWrapper.querySelector("img"), {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1200,
          ease: "power2.out",
          duration: 0.5,
        });
      });

      mapWrapper.addEventListener("mouseleave", () => {
        gsap.to(mapWrapper.querySelector("img"), {
          rotateX: 0,
          rotateY: 0,
          ease: "elastic.out(1, 0.5)",
          duration: 1.5,
        });
      });
    }

    ScrollTrigger.refresh();
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }
});
