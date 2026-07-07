document.addEventListener('DOMContentLoaded', () => {

    //  SMOOTH SCROLLING 
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    //  TEXT SPLITTING 
    const splitElements = document.querySelectorAll('.split-text');
    splitElements.forEach(el => {
        const text = el.innerHTML;
        const lines = text.split('<br>');
        el.innerHTML = '';

        lines.forEach((line) => {
            const lineDiv = document.createElement('div');
            lineDiv.style.overflow = 'hidden';
            lineDiv.style.display = 'block';
            lineDiv.classList.add('line-wrapper');

            const words = line.split(/\s+/);
            words.forEach(word => {
                if (word.trim() === '') return;
                const wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.whiteSpace = 'nowrap';
                wordSpan.classList.add('word-wrapper');

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

    //  PRELOADER & TIMELINE 
    const mainTimeline = gsap.timeline({
        onComplete: () => {
            document.body.classList.remove('loading');
            ScrollTrigger.refresh();
        }
    });

    mainTimeline.to('.loader-logo', { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' })
        .to('.loader-logo', { scale: 1.05, opacity: 0, duration: 0.6, ease: 'power3.inOut', delay: 0.2 })
        .to('.preloader', { y: '-100%', duration: 1, ease: 'power4.inOut' })
        .from('.navbar', { y: -120, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
        .to('.hero-section .anim-char', { translateY: '0%', duration: 1.1, stagger: 0.015, ease: 'power4.out' }, '-=0.7')
        .from('.hero-text-right', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.8')
        .from('.hero-bottom', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.7');

    //  SCROLL ANIMATIONS 
    document.querySelectorAll('section').forEach(section => {
        const chars = section.querySelectorAll('.anim-char');
        if (chars.length > 0) {
            gsap.to(chars, {
                translateY: '0%', duration: 1, stagger: 0.012, ease: 'power4.out',
                scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' }
            });
        }
    });

    const nickChars = document.querySelectorAll('.contact-banner .anim-char');
    if (nickChars.length > 0) {
        gsap.to(nickChars, {
            translateY: '0%', duration: 1, stagger: 0.015, ease: 'power4.out',
            scrollTrigger: { trigger: '.contact-banner', start: 'top 85%' }
        });
    }

    gsap.from('.service-card', {
        opacity: 0, y: 60, duration: 1, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.services-grid', start: 'top 75%' }
    });

    gsap.from('.insight-card', {
        opacity: 0, y: 50, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.insights-grid', start: 'top 75%' }
    });

    //  DYNAMIC COUNTERS & PARALLAX 
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

    //  SERVICES SLIDER 
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
            scrollTimeout = setTimeout(() => { updateActiveCard(); }, 50);
        });

        const cards = Array.from(sliderGrid.children);
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });

        sliderGrid.addEventListener('mouseleave', () => { updateActiveCard(); });

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
});