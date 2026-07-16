document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Native smooth scrolling is enabled site-wide via CSS (scroll-behavior: smooth in header_footer.css).
  const reduceMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  const splitElements = document.querySelectorAll(".split-text");
  splitElements.forEach((el) => {
    const text = el.innerHTML;
    const lines = text.split("<br>");
    el.innerHTML = "";

    lines.forEach((line) => {
      const lineDiv = document.createElement("div");
      lineDiv.style.overflow = "hidden";
      lineDiv.style.display = "block";

      const words = line.split(/\s+/);
      words.forEach((word) => {
        if (word.trim() === "") return;
        const wordSpan = document.createElement("span");
        wordSpan.style.display = "inline-block";
        wordSpan.style.whiteSpace = "nowrap";

        word.split("").forEach((char) => {
          const charSpan = document.createElement("span");
          charSpan.textContent = char;
          charSpan.style.display = "inline-block";
          charSpan.style.transform = "translateY(110%)";
          charSpan.classList.add("anim-char");
          wordSpan.appendChild(charSpan);
        });

        lineDiv.appendChild(wordSpan);
        lineDiv.appendChild(document.createTextNode(" "));
      });

      el.appendChild(lineDiv);
    });
  });

  gsap.to(".hero-section .anim-char", {
    translateY: "0%",
    duration: 1.1,
    stagger: 0.015,
    ease: "power4.out",
    delay: 0.2,
  });

  // Every hero slide's own heading (even the ones without .split-text/.anim-char) animates in.
  document.querySelectorAll(".hero-slide .hero-text-left h1:not(.split-text)").forEach((h1) => {
    gsap.set(h1, { opacity: 0, y: 50 });
  });
  gsap.to(".hero-slide.active .hero-text-left h1:not(.split-text)", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power4.out",
    delay: 0.25,
  });

  gsap.from(".hero-text-right", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.4,
  });

  // Ken-Burns style entrance for the active slide's background/video
  gsap.fromTo(
    ".hero-slide.active .slide-bg, .hero-slide.active .slide-bg-video",
    { scale: 1.12, opacity: 0.6 },
    { scale: 1, opacity: 1, duration: 1.6, ease: "power2.out" }
  );

  document.querySelectorAll("section").forEach((section) => {
    const chars = section.querySelectorAll(".anim-char");
    if (chars.length > 0) {
      gsap.to(chars, {
        translateY: "0%",
        duration: 1,
        stagger: 0.012,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }
  });

  gsap.from(".service-card", {
    opacity: 0,
    y: 60,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: { trigger: ".services-grid", start: "top 75%" },
  });

  gsap.from(".insight-card", {
    opacity: 0,
    y: 50,
    duration: 0.9,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".insights-grid", start: "top 75%" },
  });

  document.querySelectorAll(".stat-number").forEach((stat) => {
    const targetVal = parseInt(stat.getAttribute("data-val"));
    const formatText = stat.textContent;
    const hasPlus = formatText.includes("+");
    const hasPercent = formatText.includes("%");
    const countObj = { value: 0 };

    gsap.to(countObj, {
      value: targetVal,
      duration: 2.2,
      ease: "power3.out",
      scrollTrigger: { trigger: ".snapshot-section", start: "top 80%" },
      onUpdate: () => {
        let formatted = Math.floor(countObj.value);
        if (targetVal === 6500) {
          formatted = formatted.toLocaleString();
        }
        stat.textContent = formatted + (hasPlus ? "+" : hasPercent ? "%" : "");
      },
    });
  });

  document.querySelectorAll(".service-card img").forEach((img) => {
    gsap.fromTo(
      img,
      { scale: 1 },
      {
        scale: 1.05,
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });

  gsap.fromTo(
    ".insights-section",
    { backgroundPosition: "50% 10%" },
    {
      backgroundPosition: "50% 40%",
      ease: "none",
      scrollTrigger: {
        trigger: ".insights-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    },
  );

  const sliderContainer = document.querySelector(".services-slider-container");
  const sliderGrid = document.getElementById("services-slider");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  if (sliderContainer && sliderGrid && prevBtn && nextBtn) {
    const updateActiveCard = () => {
      const containerRect = sliderContainer.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      let closestCard = null;
      let minDistance = Infinity;
      const cards = Array.from(sliderGrid.children);

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - containerCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestCard = card;
        }
      });

      cards.forEach((card) => {
        if (card === closestCard) {
          card.classList.add("active");
        } else {
          card.classList.remove("active");
        }
      });
    };

    let scrollTimeout;
    sliderContainer.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        updateActiveCard();
      }, 50);
    });

    const cards = Array.from(sliderGrid.children);
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        cards.forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
      });
    });

    sliderGrid.addEventListener("mouseleave", () => {
      updateActiveCard();
    });

    nextBtn.addEventListener("click", () => {
      const cardWidth = sliderGrid.children[0].offsetWidth;
      const gap = parseFloat(window.getComputedStyle(sliderGrid).gap) || 27;
      sliderContainer.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
      setTimeout(updateActiveCard, 450);
    });

    prevBtn.addEventListener("click", () => {
      const cardWidth = sliderGrid.children[0].offsetWidth;
      const gap = parseFloat(window.getComputedStyle(sliderGrid).gap) || 27;
      sliderContainer.scrollBy({
        left: -(cardWidth + gap),
        behavior: "smooth",
      });
      setTimeout(updateActiveCard, 450);
    });

    setTimeout(updateActiveCard, 100);
  }

  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".pagination .dot");
  const playBtn = document.querySelector(".play-btn");
  const playIcon = playBtn ? playBtn.querySelector("img") : null;

  let currentSlide = 0;
  let slideInterval;
  let isPlaying = false;

  function goToSlide(index) {
    if (!slides.length) return;

    const currentVideo = slides[currentSlide].querySelector("video");
    if (currentVideo) {
      currentVideo.pause();
    }

    slides[currentSlide].classList.remove("active");
    if (dots[currentSlide]) dots[currentSlide].classList.remove("active");

    currentSlide = index;

    slides[currentSlide].classList.add("active");
    if (dots[currentSlide]) dots[currentSlide].classList.add("active");

    const newVideo = slides[currentSlide].querySelector("video");
    if (newVideo && isPlaying) {
      newVideo.currentTime = 0;
      newVideo.play();
    }

    if (typeof gsap !== "undefined") {
      const activeSlide = slides[currentSlide];
      const heading = activeSlide.querySelector(".hero-text-left h1");
      const sub = activeSlide.querySelector(".hero-text-right");
      const bg = activeSlide.querySelector(".slide-bg, .slide-bg-video");

      if (heading) {
        gsap.fromTo(heading, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, ease: "power4.out" });
      }
      if (sub) {
        gsap.fromTo(sub, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.15 });
      }
      if (bg) {
        gsap.fromTo(bg, { scale: 1.12, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 1.6, ease: "power2.out" });
      }
    }
  }

  function nextSlide() {
    if (!slides.length) return;
    let nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
  }

  function togglePlay() {
    if (!slides.length) return;
    const currentVideo = slides[currentSlide].querySelector("video");

    if (isPlaying) {
      clearInterval(slideInterval);
      if (currentVideo) currentVideo.pause();
      isPlaying = false;
      if (playIcon) playIcon.src = "icons/play.svg";
    } else {
      slideInterval = setInterval(nextSlide, 5000);
      if (currentVideo) currentVideo.play();
      isPlaying = true;
      if (playIcon) playIcon.src = "icons/pause.svg";
    }
  }

  if (playBtn) {
    playBtn.addEventListener("click", togglePlay);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (isPlaying) {
        togglePlay();
      }
      goToSlide(index);
    });
  });

  if (typeof gsap !== "undefined") {
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
