/* --- Menu Mobile --- */
lucide.createIcons();

const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');

if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('hidden');
    });
}

/* --- Voltar ao Topo --- */
const goToTopBtn = document.getElementById('goToTop');
const heroSection = document.getElementById('heroSection');

if (goToTopBtn && heroSection) {
    goToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* --- Observador Topo --- */
function setupGoToTopObserver() {
    const footer = document.querySelector('footer');
    const goToTopBtn = document.getElementById('goToTop');

    if (!footer || !goToTopBtn) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                goToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'scale-90');
                goToTopBtn.classList.add('opacity-100', 'scale-100');
            } else {
                goToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'scale-90');
                goToTopBtn.classList.remove('opacity-100', 'scale-100');
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(footer);
}

/* --- Animação Título --- */
window.animateHeadlineLetters = function () {
    const headline = document.getElementById('heroHeadline');
    if (!headline) return;

    const text = headline.textContent;
    headline.innerHTML = '';

    const letters = text.split('').map((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.classList.add('letter-animated');

        if (char === ' ') {
            span.style.marginRight = '0.5rem';
        }

        setTimeout(() => {
            span.classList.add('animate');
        }, 1000 + (index * 50));

        return span;
    });

    letters.forEach(letter => headline.appendChild(letter));
}

/* --- Animação Código --- */
function startCodeTypingAnimation() {
    const codeContainer = document.getElementById('codeContainer');
    if (!codeContainer) return;

    const codeLines = [
        { text: '// Sistema de Design Figma', className: 'text-sm text-gray-400 font-geist-mono mb-2' },
        {
            text: '',
            className: 'text-sm leading-relaxed font-geist-mono',
            html: '<span class="text-blue-400">const</span> <span class="text-yellow-300">componentes</span> <span class="text-white">= {</span>'
        },
        { text: '  botao: "cta-principal",', className: 'text-sm leading-relaxed font-geist-mono ml-4 text-green-400' },
        { text: '  cartao: "container-glass",', className: 'text-sm leading-relaxed font-geist-mono ml-4 text-green-400' },
        { text: '  tipografia: "fontes-do-sistema"', className: 'text-sm leading-relaxed font-geist-mono ml-4 text-green-400' },
        { text: '};', className: 'text-sm leading-relaxed font-geist-mono text-white' },
        { text: '// Protótipos interativos', className: 'text-sm leading-relaxed font-geist-mono mt-2 text-gray-500' },
        {
            text: '',
            className: 'text-sm leading-relaxed font-geist-mono',
            html: '<span class="text-blue-400">function</span> <span class="text-yellow-300">criarPrototipo()</span> <span class="text-white">{</span>'
        },
        { text: '  return testesDeUsuario;', className: 'text-sm leading-relaxed font-geist-mono ml-4' },
        { text: '}', className: 'text-sm leading-relaxed font-geist-mono text-white' }
    ];

    let currentLine = 0;
    const typingSpeed = 80;
    const lineDelay = 400;

    function typeLine() {
        if (currentLine >= codeLines.length) return;

        const line = codeLines[currentLine];
        const lineElement = document.createElement('div');
        lineElement.className = line.className;

        if (line.html) {
            lineElement.innerHTML = line.html;
            codeContainer.appendChild(lineElement);
            currentLine++;
            setTimeout(typeLine, lineDelay);
        } else {
            lineElement.classList.add('typing-line');
            codeContainer.appendChild(lineElement);

            let charIndex = 0;
            function typeChar() {
                if (charIndex < line.text.length) {
                    lineElement.textContent = line.text.substring(0, charIndex + 1);
                    charIndex++;
                    setTimeout(typeChar, typingSpeed);
                } else {
                    lineElement.classList.remove('typing-line');
                    lineElement.classList.add('typed');
                    currentLine++;
                    setTimeout(typeLine, lineDelay);
                }
            }

            lineElement.style.opacity = '1';
            lineElement.style.borderRight = '2px solid #10B981';
            typeChar();
        }
    }

    setTimeout(typeLine, 1000);
}

/* --- Observador Código --- */
function setupCodeAnimationObserver() {
    const codeContainer = document.getElementById('codeContainer');
    if (!codeContainer) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.children.length === 0) {
                startCodeTypingAnimation();
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px'
    });

    observer.observe(codeContainer);
}

/* --- Status Indicator --- */
const statusIndicator = document.getElementById('statusIndicator');
let lastScrollY = window.scrollY;
let ticking = false;

function updateStatusIndicator() {
    if (!statusIndicator) return;

    const scrollY = window.scrollY;
    const scrollProgress = Math.min(scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1);

    setTimeout(() => {
        if (statusIndicator) statusIndicator.style.opacity = '1';
    }, 1800);

    if (scrollY > 100) {
        const translateY = -scrollY * 0.1;
        const scale = Math.max(0.9, 1 - scrollProgress * 0.1);

        statusIndicator.style.transform = `translateY(calc(-50% + ${translateY}px)) scale(${scale})`;

        const glowIntensity = Math.sin(scrollProgress * Math.PI) * 0.3;
        statusIndicator.style.filter = `drop-shadow(0 0 ${20 + glowIntensity * 20}px rgba(34, 197, 94, ${0.3 + glowIntensity}))`;
    } else {
        statusIndicator.style.transform = 'translateY(-50%) scale(1)';
        statusIndicator.style.filter = 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.3))';
    }

    lastScrollY = scrollY;
    ticking = false;
}

/* --- Navegação Suave --- */
function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateStatusIndicator);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

if (statusIndicator) {
    statusIndicator.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

/* --- Animação Timeline --- */
let timelineAnimated = false;

function setupTimelineAnimation() {
    const container = document.getElementById('timeline-container');
    const progressLine = document.getElementById('timeline-progress-line');
    const items = Array.from(document.querySelectorAll('[data-timeline-item]')).sort((a, b) => {
        return parseInt(a.getAttribute('data-timeline-item')) - parseInt(b.getAttribute('data-timeline-item'));
    });

    if (!container || !progressLine) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !timelineAnimated) {
                animateTimeline();
            }
        });
    }, { threshold: 0.1 });

    window.animateTimeline = async function (force = false) {
        if (timelineAnimated && !force) return;
        timelineAnimated = true;

        const resetItem = (it) => {
            const logo = it.querySelector('.flex-shrink-0');
            const card = it.querySelector('.flex-1');
            it.classList.add('opacity-0');
            if (logo) {
                logo.classList.remove('animate-scale-in');
                logo.style.opacity = '0';
            }
            if (card) {
                card.classList.remove('animate-slide-right');
                card.style.opacity = '0';
            }
        };

        if (force) {
            progressLine.style.transition = 'none';
            progressLine.style.height = '0';
            items.forEach(resetItem);
            await new Promise(r => setTimeout(r, 50));
            progressLine.style.transition = 'height 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
            items.forEach(resetItem);
        }

        const animateStep = async (index, height) => {
            const it = items[index];
            const logo = it.querySelector('.flex-shrink-0');
            const card = it.querySelector('.flex-1');

            progressLine.style.height = height;
            await new Promise(r => setTimeout(r, 250));

            it.classList.remove('opacity-0');
            if (logo) {
                logo.style.opacity = '';
                logo.classList.add('animate-scale-in');
                await new Promise(r => setTimeout(r, 150));
            }

            if (card) {
                card.style.opacity = '';
                card.classList.add('animate-slide-right');
                await new Promise(r => setTimeout(r, 200));
            }
        };

        await animateStep(0, '15%');
        await animateStep(1, '55%');
        await animateStep(2, '100%');
    }

    observer.observe(container);
}

/* --- Disparo de Animações --- */
window.triggerSectionAnimations = function (sectionId, instant = false) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    if (sectionId === 'education') {
        if (window.animateTimeline) window.animateTimeline(true);
    }

    if (sectionId === 'heroSection') {
        if (window.animateHeadlineLetters) window.animateHeadlineLetters();
    }
    if (sectionId === 'skills') {
        const bars = section.querySelectorAll('.h-full.bg-gradient-to-r');
        bars.forEach(bar => {
            const width = bar.style.width || bar.getAttribute('data-width');
            if (width) {
                bar.style.width = '0%';
                bar.offsetHeight;
                bar.style.transition = instant ? 'none' : 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
                bar.style.width = width;
            }
        });
    }

    if (sectionId === 'projects') {
        if (window.filterProjects) window.filterProjects('all');
    }
    const revealElements = section.querySelectorAll('.reveal-on-scroll');
    const animatedElements = section.querySelectorAll('.animate-slide-up, .animate-scale-in, .animate-fade-in');

    revealElements.forEach(el => {
        el.classList.remove('revealed');
        el.style.opacity = '0';
        el.style.transition = 'none';
    });

    animatedElements.forEach(el => {
        el.style.animation = 'none';
        el.classList.add('opacity-0');
    });


    requestAnimationFrame(() => {
        section.offsetHeight;

        revealElements.forEach(el => {
            el.style.transition = '';
            if (instant) {
                el.style.transitionDelay = '0s';
                el.style.transitionDuration = '0s';
            }
            el.classList.add('revealed');
            el.style.opacity = '';
        });

        animatedElements.forEach(el => {
            el.style.animation = '';
            if (instant) {
                el.style.animationDelay = '0s';
                el.style.animationDuration = '0s';
            }
            el.classList.remove('opacity-0');
        });
    });
};

/* --- Observador Reveal --- */
function setupGeneralReveal() {
    const animatedElements = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                if (!entry.target.closest('section')) observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(el => observer.observe(el));
}

/* --- Filtro de Projetos --- */
let currentVisibleCount = 6;
let currentProjectCategory = 'all';

window.filterProjects = function (category) {
    currentProjectCategory = category;
    currentVisibleCount = 6;

    const buttons = document.querySelectorAll('.project-filter-btn');
    buttons.forEach(btn => {
        btn.className = 'project-filter-btn px-5 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300';

        const btnCategory = btn.dataset.category || (btn.getAttribute('onclick') ? btn.getAttribute('onclick').match(/'([^']+)'/)[1] : '');
        if (btnCategory === category) {
            btn.className = 'project-filter-btn px-5 py-2 rounded-full bg-white text-black text-xs font-semibold transition-all duration-300 active-filter';
        }
    });

    updateProjectVisibility();
};

function updateProjectVisibility() {
    const cards = document.querySelectorAll('.project-card');
    const filteredCards = Array.from(cards).filter(card =>
        currentProjectCategory === 'all' || card.getAttribute('data-category') === currentProjectCategory
    );

    cards.forEach(card => card.classList.add('hidden'));

    filteredCards.forEach((card, index) => {
        if (index < currentVisibleCount) {
            card.classList.remove('hidden');
            if (card.style.opacity !== '1') {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transition = 'opacity 0.4s ease-out';
                }, 10);
            }
        }
    });

    const loadMoreContainer = document.getElementById('load-more-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadMoreSpan = loadMoreBtn ? loadMoreBtn.querySelector('span') : null;
    const loadMoreIcon = loadMoreBtn ? loadMoreBtn.querySelector('svg') : null;

    if (loadMoreContainer && loadMoreBtn && loadMoreSpan && loadMoreIcon) {
        if (filteredCards.length > currentVisibleCount) {
            loadMoreContainer.classList.remove('hidden');
            loadMoreSpan.setAttribute('data-i18n', 'projects_load_more');
            loadMoreIcon.style.transform = 'rotate(0deg)';
        } else if (filteredCards.length > 6) {
            loadMoreContainer.classList.remove('hidden');
            loadMoreSpan.setAttribute('data-i18n', 'projects_hide');
            loadMoreIcon.style.transform = 'rotate(180deg)';
        } else {
            loadMoreContainer.classList.add('hidden');
        }

        if (window.updateContent) window.updateContent();
    }
}

window.loadMoreProjects = function () {
    const cards = document.querySelectorAll('.project-card');
    const filteredCards = Array.from(cards).filter(card =>
        currentProjectCategory === 'all' || card.getAttribute('data-category') === currentProjectCategory
    );

    if (currentVisibleCount >= filteredCards.length) {
        currentVisibleCount = 6;
        updateProjectVisibility();

        const projectSection = document.getElementById('projects');
        if (projectSection) {
            projectSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else {

        currentVisibleCount += 3;
        updateProjectVisibility();
    }
};

/* --- Inicialização --- */
document.addEventListener('DOMContentLoaded', () => {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProjects);
    }

    document.querySelectorAll('.project-filter-btn').forEach(btn => {
        const category = btn.dataset.category || (btn.getAttribute('onclick') ? btn.getAttribute('onclick').match(/'([^']+)'/)[1] : '');
        if (category) {
            btn.addEventListener('click', () => filterProjects(category));
        }
    });

    filterProjects('all');


    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    const deviceModal = document.getElementById('apple-device-modal');
    const closeDeviceBtn = document.getElementById('closeAppleAlert');

    if (deviceModal && closeDeviceBtn) {

        if (!localStorage.getItem('hasSeenDeviceAlert')) {
            setTimeout(() => {
                deviceModal.classList.add('show');
            }, 2000);
        }

        closeDeviceBtn.addEventListener('click', () => {
            deviceModal.classList.remove('show');
            localStorage.setItem('hasSeenDeviceAlert', 'true');
            setTimeout(() => {
                deviceModal.style.display = 'none';
            }, 300);
        });


        window.addEventListener('languageChanged', () => {
            deviceModal.style.display = 'flex';
            setTimeout(() => {
                deviceModal.classList.add('show');
            }, 50);
        });
    }

    setTimeout(() => {
        window.animateHeadlineLetters();
        setupCodeAnimationObserver();
        setupTimelineAnimation();
        setupGeneralReveal();
        setupGoToTopObserver();
    }, 100);

    const heroVideo = document.getElementById('hero-video');

    if (heroVideo) {
        window.resetHeroVideo = function () {
            heroVideo.pause();
            heroVideo.currentTime = 0;

            setTimeout(() => {
                heroVideo.play().catch(err => {
                    console.log("Autoplay bloqueado pelo navegador", err);
                });
            }, 100);
        };

        if (heroVideo.readyState >= 2) {
            heroVideo.play().catch(() => { });
        } else {
            heroVideo.addEventListener('loadedmetadata', () => {
                heroVideo.play().catch(() => { });
            });
        }
    }
});

/* --- Redirecionamento --- */
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};