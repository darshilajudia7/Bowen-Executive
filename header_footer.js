document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const preloader = document.querySelector('.preloader');

    // MOBILE NAV
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

        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    const dropdownOverlay = document.querySelector('.services-dropdown-overlay');
    const dropdownTrigger = document.querySelector('.dropdown > a');
    const dropdownClose = document.querySelector('.dropdown-close');

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
            dropdownOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            dropdownTrigger.classList.add('active');
        });
    }

    if (dropdownClose && dropdownOverlay) {
        dropdownClose.addEventListener('click', closeDropdown);
    }

    if (dropdownOverlay) {
        dropdownOverlay.addEventListener('click', (event) => {
            if (event.target === dropdownOverlay) {
                closeDropdown();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeDropdown();
        }
    });

    // PRELOADER TIMELINE
    if (window.gsap && document.querySelector('.loader-logo')) {
        gsap.set(navbar, { xPercent: -50, x: 0 });

        const mainTimeline = gsap.timeline({
            onComplete: () => {
                document.body.classList.remove('loading');
                if (preloader) preloader.style.display = 'none';
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
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: 'expo.out'
                },
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

    // SCROLL ANIMATIONS
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from(".contact-banner", {
            scrollTrigger: {
                trigger: ".contact-banner-wrapper",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        gsap.from(".nick-img", {
            scrollTrigger: {
                trigger: ".contact-banner-wrapper",
                start: "top 85%",
            },
            x: 80,
            opacity: 0,
            duration: 1.2,
            delay: 0.2,
            ease: "power3.out"
        });

        gsap.from(".footer-col", {
            scrollTrigger: {
                trigger: ".footer-content-wrapper",
                start: "top 85%",
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out"
        });

        gsap.from(".footer-bottom", {
            scrollTrigger: {
                trigger: ".footer-bottom",
                start: "top 95%",
            },
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    }
});