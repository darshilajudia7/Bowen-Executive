document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. SCROLLBAR & LENIS SMOOTH MOTION INIT
    // ==========================================================================
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis;

    if (!reduceMotionQuery.matches && typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 0.35,
            easing: (t) => 1 - Math.pow(1 - t, 3),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothWheel: true,
            syncTouch: true,
            touchMultiplier: 1.5,
            wheelMultiplier: 1.1,
            infinite: false,
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
    } else {
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    // ==========================================================================
    // 2. TEXT SPLITTING ANIMATION REVEALS
    // ==========================================================================
    const splitElements = document.querySelectorAll('.split-text');
    splitElements.forEach(el => {
        const text = el.innerHTML;
        const lines = text.split('<br>');
        el.innerHTML = '';

        lines.forEach((line) => {
            const lineDiv = document.createElement('div');
            lineDiv.style.overflow = 'hidden';
            lineDiv.style.display = 'block';

            const words = line.split(/\s+/);
            words.forEach(word => {
                if (word.trim() === '') return;
                const wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.whiteSpace = 'nowrap';

                word.split('').forEach(char => {
                    const charSpan = document.createElement('span');
                    charSpan.textContent = char;
                    charSpan.style.display = 'inline-block';
                    charSpan.style.transform = 'translateY(110%)';
                    charSpan.classList.add('anim-char');
                    wordSpan.appendChild(charSpan);
                });

                lineDiv.appendChild(wordSpan);
                lineDiv.appendChild(document.createTextNode(' '));
            });

            el.appendChild(lineDiv);
        });
    });

    // ==========================================================================
    // 3. INITIAL PRELOADER TIMELINE & MENU SHOWCASE
    // ==========================================================================
    const navbar = document.querySelector('.navbar');
    const preloader = document.querySelector('.preloader');

    if (window.gsap && document.querySelector('.loader-logo')) {
        gsap.set(navbar, { xPercent: -50, x: 0 });

        const mainTimeline = gsap.timeline({
            onComplete: () => {
                document.body.classList.remove('loading');
                if (preloader) preloader.style.display = 'none';

                // Trigger structural hero typography reveals once screen clears
                gsap.to('.hero-section .anim-char', { translateY: '0%', duration: 1.1, stagger: 0.015, ease: 'power4.out', delay: 0.2 });
                gsap.from('.hero-text-right', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 });
            }
        });

        mainTimeline.to('.loader-logo', {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out'
        })
            .to('.loader-logo', {
                scale: 1.05,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.inOut',
                delay: 0.2
            })
            .to('.preloader', {
                y: '-100%',
                duration: 1,
                ease: 'power4.inOut'
            })
            .fromTo(navbar,
                { y: -150, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.5, ease: 'expo.out' },
                '-=0.6'
            );
    } else {
        document.body.classList.remove('loading');
        if (preloader) preloader.style.display = 'none';
        if (navbar) {
            navbar.style.opacity = '1';
            navbar.style.transform = 'translateX(-50%)';
        }
    }

    // ==========================================================================
    // 4. MOBILE DRAWER NAVIGATION INTERACTION
    // ==========================================================================
    const hamburger = document.querySelector('.hamburger');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileClose = document.querySelector('.mobile-nav-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (hamburger && mobileOverlay && mobileClose) {
        const openMenu = () => {
            mobileOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';

            if (window.gsap) {
                gsap.to(mobileLinks, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power3.out',
                    overwrite: 'auto'
                });
            }
        };

        const closeMenu = () => {
            if (window.gsap) {
                gsap.to(mobileLinks, {
                    opacity: 0,
                    y: 30,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: 'power3.in',
                    onComplete: () => {
                        mobileOverlay.classList.remove('open');
                        document.body.style.overflow = '';
                    }
                });
            } else {
                mobileOverlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        };

        hamburger.addEventListener('click', openMenu);
        mobileClose.addEventListener('click', closeMenu);
        mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    // ==========================================================================
    // 5. SERVICES MEGA-MENU OVERLAY INTERACTIONS & CAROUSEL
    // ==========================================================================
    const dropdownOverlay = document.querySelector('.services-dropdown-overlay');
    const dropdownTrigger = document.querySelector('.dropdown > a');
    const dropdownClose = document.querySelector('.dropdown-close');
    const innerServicesLink = document.querySelector('.inner-dropdown-close');

    const closeDropdown = () => {
        if (dropdownOverlay) {
            dropdownOverlay.classList.remove('open');
            document.body.style.overflow = '';
            if (dropdownTrigger) dropdownTrigger.classList.remove('active');
        }
    };

    if (dropdownTrigger && dropdownOverlay) {
        dropdownTrigger.addEventListener('click', (event) => {
            event.preventDefault();
            if (dropdownOverlay.classList.contains('open')) {
                closeDropdown();
            } else {
                dropdownOverlay.classList.add('open');
                document.body.style.overflow = 'hidden';
                dropdownTrigger.classList.add('active');
            }
        });
    }

    if (dropdownClose) dropdownClose.addEventListener('click', closeDropdown);
    if (innerServicesLink) {
        innerServicesLink.addEventListener('click', (event) => {
            event.preventDefault();
            closeDropdown();
        });
    }

    if (dropdownOverlay) {
        dropdownOverlay.addEventListener('click', (event) => {
            if (event.target === dropdownOverlay) closeDropdown();
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeDropdown();
    });

    // Mega-Menu Carousel Slider Control
    const ddCards = document.querySelector('.dropdown-cards');
    const ddArrowLeft = document.querySelector('.dd-arrow-btn[aria-label="Previous"]');
    const ddArrowRight = document.querySelector('.dd-arrow-btn[aria-label="Next"]');

    if (ddCards && ddArrowLeft && ddArrowRight) {
        ddArrowRight.addEventListener('click', () => {
            const cardElement = ddCards.querySelector('.dd-card');
            if (cardElement) {
                const cardWidth = cardElement.offsetWidth + 27;
                if (window.gsap) {
                    gsap.to(ddCards, { scrollLeft: ddCards.scrollLeft + cardWidth, duration: 0.6, ease: "power2.out" });
                } else {
                    ddCards.scrollBy({ left: cardWidth, behavior: 'smooth' });
                }
            }
        });

        ddArrowLeft.addEventListener('click', () => {
            const cardElement = ddCards.querySelector('.dd-card');
            if (cardElement) {
                const cardWidth = cardElement.offsetWidth + 27;
                if (window.gsap) {
                    gsap.to(ddCards, { scrollLeft: ddCards.scrollLeft - cardWidth, duration: 0.6, ease: "power2.out" });
                } else {
                    ddCards.scrollBy({ left: -cardWidth, behavior: 'smooth' });
                }
            }
        });
    }

    // ==========================================================================
    // 6. GENERAL SCROLL GSAP ANIMATION RIGGING
    // ==========================================================================
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        document.querySelectorAll('section').forEach(section => {
            const chars = section.querySelectorAll('.anim-char');
            if (chars.length > 0) {
                gsap.to(chars, {
                    translateY: '0%', duration: 1, stagger: 0.012, ease: 'power4.out',
                    scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' }
                });
            }
        });

        gsap.from('.service-card', {
            opacity: 0, y: 60, duration: 1, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: '.services-grid', start: 'top 75%' }
        });

        gsap.from('.insight-card', {
            opacity: 0, y: 50, duration: 0.9, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: '.insights-grid', start: 'top 75%' }
        });

        document.querySelectorAll('.service-card img').forEach(img => {
            gsap.fromTo(img,
                { scale: 1 },
                { scale: 1.05, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } }
            );
        });

        gsap.fromTo('.insights-section',
            { backgroundPosition: '50% 10%' },
            { backgroundPosition: '50% 40%', ease: 'none', scrollTrigger: { trigger: '.insights-section', start: 'top bottom', end: 'bottom top', scrub: true } }
        );

        // Core dynamic counter configurations
        document.querySelectorAll('.stat-number').forEach(stat => {
            const targetVal = parseInt(stat.getAttribute('data-val'));
            const formatText = stat.textContent;
            const hasPlus = formatText.includes('+');
            const hasPercent = formatText.includes('%');
            const countObj = { value: 0 };

            gsap.to(countObj, {
                value: targetVal, duration: 2.2, ease: 'power3.out',
                scrollTrigger: { trigger: '.snapshot-section', start: 'top 80%' },
                onUpdate: () => {
                    let formatted = Math.floor(countObj.value);
                    if (targetVal === 6500) { formatted = formatted.toLocaleString(); }
                    stat.textContent = formatted + (hasPlus ? '+' : hasPercent ? '%' : '');
                }
            });
        });

        // Footer Content Components Trigger
        gsap.from(".contact-banner", {
            scrollTrigger: {
                trigger: ".contact-banner-wrapper",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 60, opacity: 0, duration: 1, ease: "power3.out"
        });

        gsap.from(".nick-img", {
            scrollTrigger: { trigger: ".contact-banner-wrapper", start: "top 85%" },
            x: 80, opacity: 0, duration: 1.2, delay: 0.2, ease: "power3.out"
        });

        gsap.from(".footer-col", {
            scrollTrigger: { trigger: ".footer-content-wrapper", start: "top 85%" },
            y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power2.out"
        });

        gsap.from(".footer-bottom", {
            scrollTrigger: { trigger: ".footer-bottom", start: "top 95%" },
            opacity: 0, duration: 1, ease: "power2.out"
        });
    }

    // ==========================================================================
    // 7. BODY INPAGE SERVICES GRID CAROUSEL SLIDERS
    // ==========================================================================
    const sliderContainer = document.querySelector('.services-slider-container');
    const sliderGrid = document.getElementById('services-slider');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (sliderContainer && sliderGrid && prevBtn && nextBtn) {
        const updateActiveCard = () => {
            const containerRect = sliderContainer.getBoundingClientRect();
            const containerCenter = containerRect.left + containerRect.width / 2;
            let closestCard = null;
            let minDistance = Infinity;
            const cards = Array.from(sliderGrid.children);

            cards.forEach(card => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distance = Math.abs(cardCenter - containerCenter);
                if (distance < minDistance) { minDistance = distance; closestCard = card; }
            });

            cards.forEach(card => {
                if (card === closestCard) { card.classList.add('active'); }
                else { card.classList.remove('active'); }
            });
        };

        let scrollTimeout;
        sliderContainer.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateActiveCard, 50);
        });

        const cards = Array.from(sliderGrid.children);
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });

        sliderGrid.addEventListener('mouseleave', updateActiveCard);

        nextBtn.addEventListener('click', () => {
            const cardWidth = sliderGrid.children[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(sliderGrid).gap) || 27;
            sliderContainer.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
            setTimeout(updateActiveCard, 450);
        });

        prevBtn.addEventListener('click', () => {
            const cardWidth = sliderGrid.children[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(sliderGrid).gap) || 27;
            sliderContainer.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
            setTimeout(updateActiveCard, 450);
        });

        setTimeout(updateActiveCard, 100);
    }

    // ==========================================================================
    // 8. HERO SLIDESHOW MULTIMEDIA ROTATION RIG
    // ==========================================================================
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.pagination .dot');
    const playBtn = document.querySelector('.play-btn');
    const playIcon = playBtn ? playBtn.querySelector('img') : null;

    let currentSlide = 0;
    let slideInterval;
    let isPlaying = false;

    function goToSlide(index) {
        const currentVideo = slides[currentSlide].querySelector('video');
        if (currentVideo) currentVideo.pause();

        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        currentSlide = index;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');

        const newVideo = slides[currentSlide].querySelector('video');
        if (newVideo && isPlaying) {
            newVideo.currentTime = 0;
            newVideo.play();
        }
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
    }

    function togglePlay() {
        const currentVideo = slides[currentSlide].querySelector('video');

        if (isPlaying) {
            clearInterval(slideInterval);
            if (currentVideo) currentVideo.pause();
            isPlaying = false;
            if (playIcon) playIcon.src = 'icons/play.svg';
        } else {
            slideInterval = setInterval(nextSlide, 5000);
            if (currentVideo) currentVideo.play();
            isPlaying = true;
            if (playIcon) playIcon.src = 'icons/pause.svg';
        }
    }

    if (playBtn) playBtn.addEventListener('click', togglePlay);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (isPlaying) togglePlay();
            goToSlide(index);
        });
    });
});