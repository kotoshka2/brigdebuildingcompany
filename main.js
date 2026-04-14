/* ============================================
   MAIN.JS — GSAP Animations & Interactions
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

/* ---------- Header Scroll Effect ---------- */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
});

/* ---------- Mobile Nav Toggle ---------- */
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav__link, .mobile-nav__cta');

function toggleMobileNav() {
    const isOpen = mobileNav.classList.toggle('open');
    burger.classList.toggle('active', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
}

function closeMobileNav() {
    mobileNav.classList.remove('open');
    burger.classList.remove('active');
    document.body.classList.remove('nav-open');
}

burger.addEventListener('click', toggleMobileNav);
mobileNavOverlay.addEventListener('click', closeMobileNav);
mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileNav));

/* ---------- Hero Entrance ---------- */
const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTL
    .from('.hero__tag', { y: 30, opacity: 0, duration: 0.8, delay: 0.3 })
    .from('.hero__title', { y: 50, opacity: 0, duration: 1 }, '-=0.5')
    .from('.hero__subtitle', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero__actions .btn', { y: 20, opacity: 0, duration: 0.6, stagger: 0.15 }, '-=0.4')
    .from('.hero__scroll-hint', { opacity: 0, duration: 0.8 }, '-=0.3');

/* ---------- Advantage Cards: Scroll Appear ---------- */
const advantageCards = document.querySelectorAll('.advantage-card');

advantageCards.forEach((card, i) => {
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.12,
        ease: 'power3.out',
        onStart: () => card.classList.add('visible'),
    });
});

/* ---------- Counting Numbers ---------- */
const counters = document.querySelectorAll('[data-count]');

counters.forEach((el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);

    ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
            gsap.to(el, {
                innerText: target,
                duration: 2,
                snap: { innerText: 1 },
                ease: 'power2.out',
                onUpdate: function () {
                    el.textContent = Math.round(parseFloat(el.textContent)).toLocaleString('ru-RU');
                },
            });
        },
    });
});

/* ---------- Bridge Animation (ScrollTrigger Pinned) ---------- */
const bridgeLayers = [
    { selector: '.bridge-foundations', label: '01 — Фундамент', stage: 1 },
    { selector: '.bridge-towers', label: '02 — Пилоны', stage: 2 },
    { selector: '.bridge-cables', label: '03 — Тросы', stage: 3 },
    { selector: '.bridge-suspenders', label: '04 — Подвесы', stage: 4 },
    { selector: '.bridge-deck', label: '05 — Полотно', stage: 5 },
    { selector: '.bridge-railings', label: '06 — Ограждения', stage: 6 },
];

const phaseEl = document.getElementById('bridge-phase');
const stageEls = document.querySelectorAll('.bridge__stage');

// Compute actual path lengths and assign strokeDasharray correctly
bridgeLayers.forEach((layer) => {
    const group = document.querySelector(layer.selector);
    if (!group) return;
    const elements = group.querySelectorAll('rect, line, path, polygon, circle, ellipse');
    elements.forEach((el) => {
        let len;
        try {
            len = el.getTotalLength ? el.getTotalLength() : 1000;
        } catch {
            len = 1000;
        }
        el.style.strokeDasharray = len;
        el.style.strokeDashoffset = len;
    });
});

const isMobile = window.innerWidth <= 768;
const bridgeScrollEnd = isMobile ? '+=1500' : '+=3000';

const bridgeTL = gsap.timeline({
    scrollTrigger: {
        trigger: '.bridge',
        start: 'top top',
        end: bridgeScrollEnd,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
    },
});

bridgeLayers.forEach((layer, i) => {
    const group = document.querySelector(layer.selector);
    if (!group) return;
    const elements = group.querySelectorAll('rect, line, path, polygon, circle, ellipse');

    bridgeTL.to(
        elements,
        {
            strokeDashoffset: 0,
            duration: 1,
            stagger: 0.08,
            ease: 'none',
            onStart: () => {
                phaseEl.textContent = layer.label;
                stageEls.forEach((el) => el.classList.remove('active'));
                // Activate current and all previous stages
                for (let j = 0; j <= i; j++) {
                    const stEl = document.querySelector(`.bridge__stage[data-stage="${j + 1}"]`);
                    if (stEl) stEl.classList.add('active');
                }
            },
        },
        i > 0 ? `+=0.2` : 0
    );
});

/* ---------- Project Cards: Scroll Appear + Parallax ---------- */
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach((card, i) => {
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power3.out',
        onStart: () => card.classList.add('visible'),
    });

    // Parallax on inner image
    const img = card.querySelector('.project-card__img');
    if (img && img.getAttribute('src')) {
        gsap.to(img, {
            y: -30,
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
        });
    }
});

/* ---------- Contact Section Appear ---------- */
gsap.from('.contact__info', {
    scrollTrigger: {
        trigger: '.contact',
        start: 'top 75%',
    },
    x: -50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
});

gsap.from('.contact__form', {
    scrollTrigger: {
        trigger: '.contact',
        start: 'top 75%',
    },
    x: 50,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    ease: 'power3.out',
});

/* ---------- Contact Form Handler ---------- */
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Отправлено ✓';
    btn.style.background = '#2ecc71';
    btn.style.borderColor = '#2ecc71';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
        contactForm.reset();
    }, 3000);
});

/* ---------- Smooth Anchors ---------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ---------- Resize Handler ---------- */
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

