window.addEventListener('DOMContentLoaded', () => {
    console.log('Script cargado correctamente');

    const pages = document.querySelectorAll('.page');
    const indicatorsContainer = document.getElementById('indicators');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const logoBackground = document.querySelector('.logo-background');
    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let hideTimeout;

    // Crear puntitos según la cantidad de páginas + uno extra para ver el logo
    pages.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');
        indicatorsContainer.appendChild(indicator);
    });

    // Añadimos un puntito adicional para mostrar el logo
    const finalIndicator = document.createElement('div');
    finalIndicator.classList.add('indicator', 'transparent-indicator');
    indicatorsContainer.appendChild(finalIndicator);

    const indicators = document.querySelectorAll('.indicator');

    function updatePages() {
        pages.forEach((page, index) => {
            if (index < currentIndex) {
                page.style.transition = "transform 1.2s ease, opacity 1.2s ease";
                page.style.transform = "translateX(-80%) scale(0.9) rotateY(-45deg)";
                page.style.opacity = 0;
                page.style.zIndex = index;
            } else if (index === currentIndex) {
                page.style.transition = isDragging ? "none" : "transform 1.2s ease, opacity 1.2s ease";
                page.style.transform = `translateX(0) scale(1) rotateY(0deg)`;
                page.style.opacity = 1;
                page.style.zIndex = pages.length;
            } else {
                page.style.transition = "transform 1.2s ease, opacity 1.2s ease";
                page.style.transform = "translateX(80%) scale(0.9) rotateY(45deg)";
                page.style.opacity = 0;
                page.style.zIndex = index;
            }
        });

        // Cuando llegamos al último punto, se ocultan todas las páginas
        if (currentIndex === pages.length) {
            pages.forEach(page => page.style.opacity = 0);
        }

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });

        showIndicatorsTemporarily();
    }

    function showIndicatorsTemporarily() {
        clearTimeout(hideTimeout);
        indicatorsContainer.style.opacity = "1";

        hideTimeout = setTimeout(() => {
            indicatorsContainer.style.opacity = "0";
        }, 2000); // Se ocultan después de 2 segundos de inactividad
    }

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updatePages();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < pages.length) { // Permitimos llegar al nuevo puntito
                currentIndex++;
                updatePages();
            }
        });
    }

    // Control por gestos táctiles (Móvil)
    window.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        currentX = startX;
        isDragging = true;
        showIndicatorsTemporarily();
    });

    window.addEventListener('touchmove', (e) => {
        if (isDragging) {
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;

            // Deslizar la página actual en tiempo real mientras se arrastra
            pages[currentIndex].style.transition = "none";
            pages[currentIndex].style.transform = `translateX(${diff}px) scale(1) rotateY(0deg)`;
        }
    });

    window.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;
        isDragging = false;

        if (diff < -50 && currentIndex < pages.length) { // Deslizar hacia la izquierda (siguiente)
            currentIndex++;
        } else if (diff > 50 && currentIndex > 0) { // Deslizar hacia la derecha (anterior)
            currentIndex--;
        }
        
        updatePages();
    });

    updatePages();
});
