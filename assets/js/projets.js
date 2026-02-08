// ============================================
// CAROUSEL POUR LES MODALS - carousel.js
// ============================================

class ModalCarousel {
  constructor(carouselElement) {
    this.carousel = carouselElement;
    this.track = this.carousel.querySelector('.carousel-track');
    this.slides = Array.from(this.track.children);
    this.nextButton = this.carousel.querySelector('.carousel-btn-next');
    this.prevButton = this.carousel.querySelector('.carousel-btn-prev');
    this.dotsNav = this.carousel.querySelector('.carousel-dots');
    
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    
    this.init();
  }
  
  init() {
    // Créer les dots de navigation
    this.createDots();
    
    // Événements pour les boutons
    this.nextButton.addEventListener('click', () => this.moveToSlide(this.currentIndex + 1));
    this.prevButton.addEventListener('click', () => this.moveToSlide(this.currentIndex - 1));
    
    // Événements pour les dots
    const dots = Array.from(this.dotsNav.children);
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.moveToSlide(index));
    });
    
    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
      if (this.carousel.closest('.modal').style.display === 'block') {
        if (e.key === 'ArrowRight') this.moveToSlide(this.currentIndex + 1);
        if (e.key === 'ArrowLeft') this.moveToSlide(this.currentIndex - 1);
      }
    });
    
    // Support tactile pour mobile
    this.addTouchSupport();
    
    // Ajouter le clic pour agrandir les images
    this.addImageClickHandler();
    
    // Démarrer l'autoplay
    this.startAutoPlay();
    
    // Arrêter l'autoplay au survol
    this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
  }
  
  createDots() {
    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Aller à l'image ${index + 1}`);
      this.dotsNav.appendChild(dot);
    });
  }
  
  moveToSlide(targetIndex) {
    // Gestion du bouclage
    if (targetIndex < 0) {
      targetIndex = this.slides.length - 1;
    } else if (targetIndex >= this.slides.length) {
      targetIndex = 0;
    }
    
    const targetSlide = this.slides[targetIndex];
    const amountToMove = targetSlide.offsetLeft;
    
    // Déplacer le track
    this.track.style.transform = `translateX(-${amountToMove}px)`;
    
    // Mettre à jour l'index courant
    this.currentIndex = targetIndex;
    
    // Mettre à jour l'UI
    this.updateDots();
    this.updateButtons();
  }
  
  updateDots() {
    const dots = Array.from(this.dotsNav.children);
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }
  
  updateButtons() {
    // Les boutons sont toujours actifs car on boucle
    // Mais on peut ajouter une indication visuelle
    this.prevButton.style.opacity = '1';
    this.nextButton.style.opacity = '1';
  }
  
  addTouchSupport() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.stopAutoPlay();
    });
    
    this.track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    });
    
    this.track.addEventListener('touchend', () => {
      if (!isDragging) return;
      
      const diff = startX - currentX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.moveToSlide(this.currentIndex + 1);
        } else {
          this.moveToSlide(this.currentIndex - 1);
        }
      }
      
      isDragging = false;
      this.startAutoPlay();
    });
  }
  
  addImageClickHandler() {
    // Ajouter un curseur pointer et un événement de clic à chaque image
    this.slides.forEach((slide) => {
      const img = slide.querySelector('img');
      if (img) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openLightbox(img.src, img.alt);
        });
      }
    });
  }
  
  openLightbox(imageSrc, imageAlt) {
    // Arrêter l'autoplay pendant que la lightbox est ouverte
    this.stopAutoPlay();
    
    // Créer la lightbox si elle n'existe pas
    let lightbox = document.getElementById('image-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'image-lightbox';
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <span class="lightbox-close">&times;</span>
          <img class="lightbox-image" src="" alt="">
          <div class="lightbox-caption"></div>
        </div>
      `;
      document.body.appendChild(lightbox);
      
      // Événement pour fermer la lightbox
      const closeBtn = lightbox.querySelector('.lightbox-close');
      closeBtn.addEventListener('click', () => this.closeLightbox());
      
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          this.closeLightbox();
        }
      });
      
      // Fermer avec Échap
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
          this.closeLightbox();
        }
      });
    }
    
    // Mettre à jour l'image et afficher la lightbox
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    
    lightboxImg.src = imageSrc;
    lightboxImg.alt = imageAlt;
    lightboxCaption.textContent = imageAlt;
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Animation d'entrée
    setTimeout(() => {
      lightbox.classList.add('active');
    }, 10);
  }
  
  closeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      setTimeout(() => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 300);
    }
    
    // Redémarrer l'autoplay
    this.startAutoPlay();
  }
  
  startAutoPlay(interval = 4000) {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.moveToSlide(this.currentIndex + 1);
    }, interval);
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// ============================================
// GESTION DES MODALS (mise à jour)
// ============================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Initialiser le carousel si ce n'est pas déjà fait
  const carouselElement = modal.querySelector('.modal-carousel');
  if (carouselElement && !carouselElement.carouselInstance) {
    carouselElement.carouselInstance = new ModalCarousel(carouselElement);
  } else if (carouselElement && carouselElement.carouselInstance) {
    // Réinitialiser le carousel
    carouselElement.carouselInstance.moveToSlide(0);
    carouselElement.carouselInstance.startAutoPlay();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  
  // Arrêter l'autoplay du carousel
  const carouselElement = modal.querySelector('.modal-carousel');
  if (carouselElement && carouselElement.carouselInstance) {
    carouselElement.carouselInstance.stopAutoPlay();
  }
}

// Fermer le modal en cliquant en dehors
window.addEventListener('click', function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target === modal) {
      const modalId = modal.id;
      closeModal(modalId);
    }
  });
});

// Fermer le modal avec la touche Échap
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (modal.style.display === 'block') {
        closeModal(modal.id);
      }
    });
  }
});

// Gestion des GIFs au survol
const gifElements = document.querySelectorAll('.gif-handler');

gifElements.forEach(img => {
    const card = img.closest('.project-card');
    
    card.addEventListener('mouseenter', () => {
        const hoverSrc = img.getAttribute('data-hover');
        img.src = hoverSrc;
    });

    card.addEventListener('mouseleave', () => {
        const staticSrc = img.getAttribute('data-static');
        img.src = staticSrc;
    });
});