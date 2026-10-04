// ============================================
// WEBIT AI - JAVASCRIPT COMPLET
// ============================================

// ============================================
// MOBILE MENU
// ============================================

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Fermer le menu mobile au clic sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignorer les liens vides ou juste "#"
        if (!href || href === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animer les cartes de services au scroll
document.querySelectorAll('.service-card-minimal, .service-row, .infogerance-card, .pilier-card, .faq-item, .questions-list li').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    fadeInObserver.observe(el);
});

// Animer les stats
document.querySelectorAll('.stat-item').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.8)';
    el.style.transition = `all 0.5s ease ${index * 0.1}s`;
    fadeInObserver.observe(el);
});

// ============================================
// SCROLL INDICATOR ANIMATION (Page d'accueil)
// ============================================

const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 200) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
    
    // Clic sur la flèche pour scroller
    scrollIndicator.addEventListener('click', () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });
}

// ============================================
// FORM VALIDATION
// ============================================

const contactForm = document.querySelector('.form-contact');
if (contactForm) {
    const statusEl = document.getElementById('contactFormStatus');
    const submitBtn = document.getElementById('contactSubmitBtn');

    // Pré-sélectionne le service si on arrive via ?service=xxx (ex: depuis services.html#starlink)
    const serviceSelect = contactForm.querySelector('select[name="service"]');
    const requestedService = new URLSearchParams(window.location.search).get('service');
    if (serviceSelect && requestedService) {
        const match = Array.from(serviceSelect.options).find(opt => opt.value === requestedService);
        if (match) serviceSelect.value = requestedService;
    }

    function showStatus(message, isError) {
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.style.display = 'block';
        statusEl.style.background = isError ? 'rgba(248, 113, 113, 0.12)' : 'rgba(74, 222, 128, 0.12)';
        statusEl.style.color = isError ? '#f87171' : '#4ade80';
        statusEl.style.border = `1px solid ${isError ? 'rgba(248, 113, 113, 0.35)' : 'rgba(74, 222, 128, 0.35)'}`;
    }

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#f87171';
                setTimeout(() => { input.style.borderColor = ''; }, 3000);
            } else {
                input.style.borderColor = '';
            }
        });

        const emailInput = contactForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                isValid = false;
                emailInput.style.borderColor = '#f87171';
            }
        }

        if (!isValid) {
            showStatus('Veuillez remplir correctement tous les champs obligatoires.', true);
            return;
        }

        const payload = Object.fromEntries(new FormData(contactForm).entries());

        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.success) {
                showStatus('✅ Message envoyé ! Nous vous répondrons sous 24h ouvrées.', false);
                contactForm.reset();
            } else {
                throw new Error(data.error || 'Échec de l\'envoi');
            }
        } catch (err) {
            showStatus('❌ Une erreur est survenue. Contactez-nous directement à contact@webit-ai.com ou au +33 6 15 19 76 25.', true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer le message';
        }
    });

    // Retirer la bordure rouge quand l'utilisateur tape
    contactForm.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '';
            }
        });
    });
}

// ============================================
// ANIMATION COMPTEUR STATS (Progressive count)
// ============================================

function animateCounter(element) {
    const target = element.innerText;
    const isPlus = target.includes('+');
    const number = parseInt(target.replace(/\D/g, ''));
    const duration = 2000; // 2 secondes
    const steps = 60;
    const increment = number / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            element.innerText = number + (isPlus ? '+' : '');
            clearInterval(timer);
        } else {
            element.innerText = Math.floor(current) + (isPlus ? '+' : '');
        }
    }, duration / steps);
}

// Observer pour déclencher l'animation des compteurs
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber) {
                animateCounter(statNumber);
                entry.target.classList.add('counted');
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// ============================================
// HIGHLIGHT NAVIGATION ACTIVE (au scroll)
// ============================================

const sections = document.querySelectorAll('section[id]');
const navLinksArray = document.querySelectorAll('.nav-links a');

function highlightNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinksArray.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNav);

// ============================================
// PARALLAX EFFECT (Hero backgrounds)
// ============================================

const heroSections = document.querySelectorAll('.hero-fullscreen, .page-hero');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    heroSections.forEach(hero => {
        const rect = hero.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    });
});

// ============================================
// HERO VIDÉO (page d'accueil) — reduced-motion + filet de secours autoplay
// ============================================

(function () {
    const heroVideo = document.querySelector('.hero-video');
    if (!heroVideo) return;

    const reduceMotionQuery = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

    function syncMotion() {
        if (reduceMotionQuery && reduceMotionQuery.matches) {
            heroVideo.pause();
        } else {
            const p = heroVideo.play();
            if (p && p.catch) p.catch(() => armClickFallback());
        }
    }

    function armClickFallback() {
        const resume = () => {
            heroVideo.play().catch(() => {});
            document.removeEventListener('click', resume);
            document.removeEventListener('touchstart', resume);
        };
        document.addEventListener('click', resume, { once: true });
        document.addEventListener('touchstart', resume, { once: true });
    }

    syncMotion();
    if (reduceMotionQuery) {
        reduceMotionQuery.addEventListener
            ? reduceMotionQuery.addEventListener('change', syncMotion)
            : reduceMotionQuery.addListener(syncMotion);
    }
})();

// ============================================
// LAZY LOADING IMAGES (si vous ajoutez des images)
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// PREVENT ORPHAN WORDS (Typographie)
// ============================================

function preventOrphans() {
    const elements = document.querySelectorAll('h1, h2, h3, p');
    elements.forEach(el => {
        const html = el.innerHTML;
        const words = html.trim().split(' ');
        if (words.length > 3) {
            const lastTwo = words.slice(-2).join('&nbsp;');
            const rest = words.slice(0, -2).join(' ');
            el.innerHTML = rest + ' ' + lastTwo;
        }
    });
}

// Appliquer après le chargement
window.addEventListener('load', preventOrphans);

// ============================================
// BACK TO TOP BUTTON (optionnel)
// ============================================

// Créer le bouton
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '↑';
backToTopButton.className = 'back-to-top';
backToTopButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb 0%, #60a5fa 100%);
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    z-index: 999;
`;

document.body.appendChild(backToTopButton);

// Afficher/cacher le bouton
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.visibility = 'visible';
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
    }
});

// Scroll to top au clic
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Effet hover
backToTopButton.addEventListener('mouseenter', () => {
    backToTopButton.style.transform = 'translateY(-5px)';
    backToTopButton.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
});

backToTopButton.addEventListener('mouseleave', () => {
    backToTopButton.style.transform = 'translateY(0)';
    backToTopButton.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
});

// ============================================
// CONSOLE MESSAGE (Signature)
// ============================================

console.log('%c Webit AI ', 'color: #2563eb; font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #2563eb, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%c Expert Infrastructure IT ', 'color: #1a1a1a; font-size: 14px;');
console.log('%c 🚀 Site développé avec passion ', 'color: #6b7280; font-size: 12px;');

// ============================================
// PERFORMANCE MONITORING (optionnel)
// ============================================

window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page chargée en ${pageLoadTime}ms`);
    }
});

// ============================================
// DÉTECTION JAVASCRIPT ACTIVÉ
// ============================================

document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

// ============================================
// GALAXIE DES SERVICES (page Services)
// ============================================

const galaxyStars = document.getElementById('galaxyStars');
if (galaxyStars) {
    const starCount = 70;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('span');
        star.className = 'galaxy-star';
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.opacity = (Math.random() * 0.5 + 0.2).toFixed(2);
        star.style.animationDelay = `${(Math.random() * 3.5).toFixed(2)}s`;
        galaxyStars.appendChild(star);
    }
}

const galaxyModalOverlay = document.getElementById('galaxyModalOverlay');
const galaxyModal = document.getElementById('galaxyModal');
const galaxyModalContent = document.getElementById('galaxyModalContent');
const galaxyModalClose = document.getElementById('galaxyModalClose');

function openGalaxyService(targetId) {
    const details = document.getElementById(targetId);
    if (!details || details.tagName !== 'DETAILS' || !galaxyModalOverlay) return;

    const iconHTML = details.querySelector('.service-detail-icon')?.innerHTML || '';
    const badgeHTML = details.querySelector('.service-badge')?.outerHTML || '';
    const titleHTML = details.querySelector('.service-detail-summary-text h2')?.innerHTML || '';
    const leadHTML = details.querySelector('.service-detail-summary-text p')?.innerHTML || '';
    const bodyHTML = details.querySelector('.service-detail-body')?.innerHTML || '';

    galaxyModalContent.innerHTML = `
        ${badgeHTML}
        <div class="galaxy-modal-header">
            <div class="service-detail-icon">${iconHTML}</div>
            <div class="service-detail-summary-text">
                <h2>${titleHTML}</h2>
                <p>${leadHTML}</p>
            </div>
        </div>
        <div class="service-detail-body">${bodyHTML}</div>
    `;

    galaxyModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeGalaxyModal() {
    if (!galaxyModalOverlay) return;
    galaxyModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Arrivée depuis un lien externe avec une ancre (ex: index.html -> services.html#securite) :
// la liste détaillée est masquée (display:none), on ouvre donc directement la modale correspondante.
if (window.location.hash) {
    const hashTargetId = window.location.hash.slice(1);
    if (document.getElementById(hashTargetId)?.tagName === 'DETAILS') {
        openGalaxyService(hashTargetId);
        document.querySelector('.services-galaxy')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

document.querySelectorAll('.galaxy-orb').forEach(orb => {
    orb.addEventListener('click', (e) => {
        const targetId = orb.getAttribute('data-target');
        if (document.getElementById(targetId)) {
            e.preventDefault();
            openGalaxyService(targetId);
        }
    });
});

if (galaxyModalClose) {
    galaxyModalClose.addEventListener('click', closeGalaxyModal);
}

if (galaxyModalOverlay) {
    galaxyModalOverlay.addEventListener('click', (e) => {
        if (e.target === galaxyModalOverlay) closeGalaxyModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && galaxyModalOverlay?.classList.contains('active')) {
        closeGalaxyModal();
    }
});

// Liens internes (ex: vers un autre service) dans le contenu de la modale :
// on bascule vers ce service plutôt que de naviguer vers l'ancre masquée.
if (galaxyModalContent) {
    galaxyModalContent.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const targetId = link.getAttribute('href').slice(1);
        if (document.getElementById(targetId)) {
            e.preventDefault();
            openGalaxyService(targetId);
        }
    });
}

// ============================================
// OFFRES D'INFOGÉRANCE — détail dépliable
// ============================================

document.querySelectorAll('.infogerance-card-toggle').forEach(btn => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    const label = btn.querySelector('.infogerance-card-toggle-label');

    btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        if (panel) panel.classList.toggle('open', !expanded);
        if (label) label.textContent = expanded ? 'Voir le détail' : 'Masquer le détail';
    });
});

// ============================================
// SCHÉMA SI (page Infogérance) — apparition légère au scroll
// ============================================

const siShowcase = document.querySelector('.si-cards');
if (siShowcase && 'IntersectionObserver' in window) {
    const siObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                siShowcase.classList.add('is-visible');
                siObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    siObserver.observe(siShowcase);
}
