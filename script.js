window.addEventListener('DOMContentLoaded', () => {
    console.log('Script cargado correctamente');

    const pages = document.querySelectorAll('.page');
    const indicatorsContainer = document.getElementById('indicators');
    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    // Crear puntitos según la cantidad de páginas
    pages.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = document.querySelectorAll('.indicator');

    function updatePages() {
        console.log('Actualizando páginas... Índice actual:', currentIndex);

        pages.forEach((page, index) => {
            if (index < currentIndex) {
                page.style.transition = "transform 0.8s ease, opacity 0.8s ease";
                page.style.transform = "translateX(-80%) scale(0.9) rotateY(-45deg)";
                page.style.opacity = 0;
                page.style.zIndex = index;
            } else if (index === currentIndex) {
                page.style.transition = isDragging ? "none" : "transform 0.8s ease, opacity 0.8s ease";
                page.style.transform = `translateX(0) scale(1) rotateY(0deg)`;
                page.style.opacity = 1;
                page.style.zIndex = pages.length;
            } else {
                page.style.transition = "transform 0.8s ease, opacity 0.8s ease";
                page.style.transform = "translateX(80%) scale(0.9) rotateY(45deg)";
                page.style.opacity = 0;
                page.style.zIndex = index;
            }
        });

        // Actualizar puntitos indicadores
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    document.getElementById('prev').addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updatePages();
        }
    });

    document.getElementById('next').addEventListener('click', () => {
        if (currentIndex < pages.length - 1) {
            currentIndex++;
            updatePages();
        }
    });

    // Control por gestos táctiles (Móvil)
    window.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        currentX = startX;
        isDragging = true;
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

        if (diff < -50 && currentIndex < pages.length - 1) { // Deslizar hacia la izquierda (siguiente)
            currentIndex++;
        } else if (diff > 50 && currentIndex > 0) { // Deslizar hacia la derecha (anterior)
            currentIndex--;
        }
        
        updatePages();
    });

    updatePages();
});
