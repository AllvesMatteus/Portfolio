// Animação das barras de habilidades quando visíveis
const skillBars = document.querySelectorAll('.skill-bar-fill');

function animateSkillBars() {
    skillBars.forEach(bar => {
        const rect = bar.parentElement.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.75);

        if (isVisible) {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        }
    });
}

animateSkillBars();
window.addEventListener('scroll', animateSkillBars);

// Animação dos elementos ao rolar a página
const animateElements = document.querySelectorAll('.animate');

function checkScroll() {
    animateElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            element.classList.add('animated');
        }
    });
}

checkScroll();
window.addEventListener('scroll', checkScroll);

// Navbar transparente/fundo branco apenas no desktop
window.addEventListener('scroll', function () {
    if (window.innerWidth > 768) {
        const header = document.querySelector('header');
        const hero = document.getElementById('hero');
        const heroHeight = hero ? hero.offsetHeight : 0;
        if (window.scrollY > heroHeight - 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

