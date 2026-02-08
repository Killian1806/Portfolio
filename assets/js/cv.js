// Script pour le bouton CV flottant
        const cvFloatBtn = document.getElementById('cvFloatBtn');
        const cvPopup = document.getElementById('cvPopup');

        if (cvFloatBtn && cvPopup) {
            cvFloatBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                cvPopup.classList.toggle('active');
            });

            // Fermer le popup en cliquant en dehors
            document.addEventListener('click', (e) => {
                if (!cvPopup.contains(e.target) && !cvFloatBtn.contains(e.target)) {
                    cvPopup.classList.remove('active');
                }
            });

            // Empêcher la fermeture en cliquant dans le popup
            cvPopup.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }