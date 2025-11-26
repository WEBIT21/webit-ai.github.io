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
document.querySelectorAll('.service-card-minimal, .infogerance-card, .pilier-card, .faq-item').forEach((el, index) => {
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
    contactForm.addEventListener('submit', function(e) {
        const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ef4444';
                
                // Retirer la bordure rouge après 3 secondes
                setTimeout(() => {
                    input.style.borderColor = '#d1d5db';
                }, 3000);
            } else {
                input.style.borderColor = '#d1d5db';
            }
        });
        
        // Validation email
        const emailInput = contactForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                isValid = false;
                emailInput.style.borderColor = '#ef4444';
                alert('Veuillez entrer une adresse email valide.');
                e.preventDefault();
                return;
            }
        }
        
        if (!isValid) {
            e.preventDefault();
            alert('Veuillez remplir tous les champs obligatoires.');
        }
    });
    
    // Retirer la bordure rouge quand l'utilisateur tape
    contactForm.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#d1d5db';
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
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
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
