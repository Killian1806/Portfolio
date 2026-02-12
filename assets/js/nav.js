// Navigation avec détection du scroll optimisée
const navItems = document.querySelectorAll('.nav-item');
const indicator = document.querySelector('.indicator');
const sections = document.querySelectorAll('section');

//  Calcule la position exacte de l'item pour l'indicateur

function getIndicatorPosition(item) {
    const navbar = document.querySelector('.navbar');
    const navbarRect = navbar.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    
    const isMobile = window.innerWidth <= 768; 
    
    if (isMobile) {
        return itemRect.left - navbarRect.left;
    } else {
        return itemRect.top - navbarRect.top;
    }
}

//  Active un nav-item et déplace l'indicateur

function activateNavItem(item) {
    if (!item) return;

    // Retirer la classe active de tous les items
    navItems.forEach(nav => nav.classList.remove('active'));
    
    // Ajouter la classe active à l'item sélectionné
    item.classList.add('active');
    
    // Déplacer l'indicateur
    const position = getIndicatorPosition(item);
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        indicator.style.top = ''; // Reset top pour le mobile
        indicator.style.left = position + 'px';
    } else {
        indicator.style.left = ''; // Reset left pour le desktop
        indicator.style.top = position + 'px';
    }
}


//  Configuration de l'Intersection Observer (ScrollSpy)

const observerOptions = {
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            const targetNavItem = document.querySelector(`.nav-item[href="#${id}"]`);
            
            if (targetNavItem) {
                activateNavItem(targetNavItem);
            }
        }
    });
}, observerOptions);

// On attache l'observeur à chaque section
sections.forEach(section => observer.observe(section));


//  Event listener pour les clics sur la navigation (Smooth Scroll)

navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


//   Gestion du redimensionnement

window.addEventListener('resize', () => {
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        activateNavItem(activeItem);
    }
});


window.addEventListener('load', () => {
    // L'Intersection Observer fera le travail automatiquement au chargement, 
    const activeItem = document.querySelector('.nav-item.active') || document.querySelector('.nav-item');
    if (activeItem) {
        activateNavItem(activeItem);
    }
});