document.addEventListener('DOMContentLoaded', function () {
    // Aplicar fade-in al cargar
    document.body.classList.remove('fade-out');
    document.body.classList.add('fade-in'); // Aseguramos que la clase fade-in se aplica correctamente al cargar la página

    // Interceptar clics en enlaces para aplicar fade-out
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Verifica si es un enlace interno, no un ancla (#) y no abre en nueva pestaña
            const isInternal = href && !href.startsWith('#') && !link.hasAttribute('target');

            if (isInternal) {
                e.preventDefault(); // Prevenir navegación inmediata
                document.body.classList.remove('fade-in');
                document.body.classList.add('fade-out');
                
                // Usamos 'transitionend' para asegurarnos de que la transición haya terminado antes de navegar
                document.body.addEventListener('transitionend', function onTransitionEnd() {
                    // Eliminar el listener para evitar múltiples invocaciones
                    document.body.removeEventListener('transitionend', onTransitionEnd);
                    
                    // Ahora podemos hacer la navegación después de que termine la transición
                    setTimeout(() => {
                        window.location.href = href;
                    }, 600); // tiempo del fade (asegurarse de que coincida con la duración del fade-out en CSS)
                });
        // NOTA: La llamada a initSlider() estaba DENTRO del listener de click,
        // lo cual no tiene sentido. Se movió fuera del forEach pero dentro del DOMContentLoaded.
    }
    });
});

    const historiaSecundariaLink = document.getElementById('historia-secundaria-link');
    const fundadoresSecundarioLink = document.getElementById('fundadores-secundario-link');
    const incorporacionSecundarioLink = document.getElementById('incorporacion-secundario-link');

    const historiaSection = document.getElementById('historia-sinepub');
    const fundadoresSliderSection = document.getElementById('fundadores-slider-section');
    const incorporacionSliderSection = document.getElementById('incorporacion-slider-section');

    const fundadoresSlider = document.getElementById('fundadores-slider');
    const fundadoresSlides = fundadoresSlider.querySelectorAll('.slide');
    const prevButtonFundadores = document.querySelector('.prev-slide-fundadores');
    const nextButtonFundadores = document.querySelector('.next-slide-fundadores');

    const incorporacionSlider = document.getElementById('incorporacion-slider');
    const incorporacionSlides = incorporacionSlider.querySelectorAll('.slide');
    const prevButtonIncorporacion = document.querySelector('.prev-slide-incorporacion');
    const nextButtonIncorporacion = document.querySelector('.next-slide-incorporacion');

    let currentFundadorSlide = 0;
    let currentIncorporacionSlide = 0;

    function showSection(sectionToShow) {
        // Ocultar las actuales con fade-out
        const sections = [historiaSection, fundadoresSliderSection, incorporacionSliderSection];
        sections.forEach(sec => {
            sec.classList.remove('active'); // Apaga fade-in
            sec.classList.add('fade-section');
        });
    
        // Mostrar con fade-in después de corto delay
        setTimeout(() => {
            sections.forEach(sec => sec.classList.add('hidden')); // Oculta completamente
            sectionToShow.classList.remove('hidden');
            requestAnimationFrame(() => {
                sectionToShow.classList.add('active'); // Activa fade-in
            });
        }, 300);
    }

    function deactivateSecondaryNavLinks() {
        historiaSecundariaLink.classList.remove('active');
        fundadoresSecundarioLink.classList.remove('active');
        incorporacionSecundarioLink.classList.remove('active');
    }

    function updateFundadorSlide(slideIndex) {
        fundadoresSlides.forEach((slide, index) => {
            slide.classList.toggle('active', index === slideIndex);
        });
        currentFundadorSlide = slideIndex;
    }

    function updateIncorporacionSlide(slideIndex) {
        incorporacionSlides.forEach((slide, index) => {
            slide.classList.toggle('active', index === slideIndex);
        });
        currentIncorporacionSlide = slideIndex;
    }

    // Flechas del slider de fundadores
    prevButtonFundadores.addEventListener('click', () => {
        let slideIndex = currentFundadorSlide - 1;
        if (slideIndex < 0) slideIndex = fundadoresSlides.length - 1;
        updateFundadorSlide(slideIndex);
    });

    nextButtonFundadores.addEventListener('click', () => {
        let slideIndex = currentFundadorSlide + 1;
        if (slideIndex >= fundadoresSlides.length) slideIndex = 0;
        updateFundadorSlide(slideIndex);
    });

    // Flechas del slider de Incorporación 2017
    prevButtonIncorporacion.addEventListener('click', () => {
        let slideIndex = currentIncorporacionSlide - 1;
        if (slideIndex < 0) slideIndex = incorporacionSlides.length - 1;
        updateIncorporacionSlide(slideIndex);
    });

    nextButtonIncorporacion.addEventListener('click', () => {
        let slideIndex = currentIncorporacionSlide + 1;
        if (slideIndex >= incorporacionSlides.length) slideIndex = 0;
        updateIncorporacionSlide(slideIndex);
    });

    // Inicializar
    showSection(historiaSection);
    historiaSecundariaLink.classList.add('active');

    // Event listeners para los botones del menú secundario
    historiaSecundariaLink.addEventListener('click', (event) => {
        event.preventDefault();
        showSection(historiaSection);
        deactivateSecondaryNavLinks();
        historiaSecundariaLink.classList.add('active');
    });

    fundadoresSecundarioLink.addEventListener('click', (event) => {
        event.preventDefault();
        showSection(fundadoresSliderSection);
        deactivateSecondaryNavLinks();
        fundadoresSecundarioLink.classList.add('active');
    });

    incorporacionSecundarioLink.addEventListener('click', (event) => {
        event.preventDefault();
        showSection(incorporacionSliderSection);
        deactivateSecondaryNavLinks();
        incorporacionSecundarioLink.classList.add('active');
    });
});
