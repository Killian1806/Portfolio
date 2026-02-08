const modal = document.getElementById("legal-modal");
const span = document.querySelector(".close-modal");
const openButtons = document.querySelectorAll("#open-legal, .open-legal-from-form");

// Ouvrir la modal pour chaque bouton trouvé
openButtons.forEach(btn => {
    btn.onclick = function(e) {
        e.preventDefault();
        modal.style.display = "flex"; 
    }
});

// Fermer avec la croix
if (span) {
    span.onclick = function() {
        modal.style.display = "none";
    }
}

// Fermer en cliquant à côté (version corrigée)
window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});