document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const preloader = document.querySelector('.preloader');

    const revealHeader = () => {
        document.body.classList.remove('loading');
        if (preloader) {
            preloader.style.display = 'none';
        }
        if (navbar) {
            navbar.style.opacity = '1';
            navbar.style.transform = 'translateX(-50%) translateY(0)';
            navbar.style.visibility = 'visible';
        }
    };

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

    // PRELOADER TIMELINE
    if (window.gsap && document.querySelector('.loader-logo')) {
        const mainTimeline = gsap.timeline({
            onComplete: revealHeader
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
            .from('.navbar', {
                y: -120,
                opacity: 0,
                duration: 0.9,
                ease: 'power3.out'
            }, '-=0.4');
    } else {
        revealHeader();
    }
});