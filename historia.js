document.addEventListener('DOMContentLoaded', function() {

    const inicioSecundarioLink = document.getElementById('inicio-secundario-link');
    const historiaSecundariaLink = document.getElementById('historia-secundaria-link');
    const fundadoresSecundarioLink = document.getElementById('fundadores-secundario-link');

    const historiaSection = document.getElementById('historia-sinepub');
    const fundadoresSliderSection = document.getElementById('fundadores-slider-section');
    const fundadoresSlider = document.getElementById('fundadores-slider');
    const fundadoresSlides = fundadoresSlider.querySelectorAll('.slide');
    const prevButtonFundadores = document.querySelector('.prev-slide-fundadores');
    const nextButtonFundadores = document.querySelector('.next-slide-fundadores');

    let currentFundadorSlide = 0;


    function showFundadoresSliderSection() {
        fundadoresSliderSection.classList.remove('hidden');
    }

    function hideFundadoresSliderSection() {
        fundadoresSliderSection.classList.add('hidden');
    }

    function showHistoriaSection() {
        historiaSection.classList.remove('hidden');
    }

    function hideHistoriaSection() {
        historiaSection.classList.add('hidden');
    }

    function updateFundadorSlide(slideIndex) { // Mantiene la funcionalidad del slider de fundadores
        fundadoresSlides.forEach((slide, index) => {
            if (index === slideIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        currentFundadorSlide = slideIndex;
    }

    function deactivateSecondaryNavLinks() {
        historiaSecundariaLink.classList.remove('active');
        fundadoresSecundarioLink.classList.remove('active');
        incorporacionSecundarioLink.classList.remove('active');
    }


    // Event listeners para las flechas del slider de fundadores - SIN CAMBIOS
    prevButtonFundadores.addEventListener('click', () => {
        let slideIndex = currentFundadorSlide - 1;
        if (slideIndex < 0) {
            slideIndex = fundadoresSlides.length - 1;
        }
        updateFundadorSlide(slideIndex);
    });

    nextButtonFundadores.addEventListener('click', () => {
        let slideIndex = currentFundadorSlide + 1;
        if (slideIndex >= fundadoresSlides.length) {
            slideIndex = 0;
        }
        updateFundadorSlide(slideIndex);
    });


    // Inicialización al cargar la página historia.html - REVISADO Y AJUSTADO
    showHistoriaSection(); // Mostrar SECCIÓN de Historia INICIALMENTE
    hideFundadoresSliderSection(); // Ocultar SECCIÓN del Slider de Fundadores INICIALMENTE
    historiaSecundariaLink.classList.add('active'); // Activar "Historia" en nav secundaria INICIALMENTE
    fundadoresSecundarioLink.classList.remove('active'); // Desactivar "Fundadores" en nav secundaria INICIALMENTE


    // Event listener para el link "Fundadores" en la navegación secundaria - REVISADO Y AJUSTADO
    fundadoresSecundarioLink.addEventListener('click', (event) => {
        event.preventDefault();
        showFundadoresSliderSection(); // Mostrar SECCIÓN del Slider de Fundadores al hacer clic en "Fundadores"
        hideHistoriaSection(); // Ocultar SECCIÓN de Historia al hacer clic en "Fundadores"
        hideIncorporacionSliderSection();
        deactivateSecondaryNavLinks();
        fundadoresSecundarioLink.classList.add('active');
    });

    // Event listener para el link "Historia" en la navegación secundaria - REVISADO Y AJUSTADO
    historiaSecundariaLink.addEventListener('click', (event) => {
        event.preventDefault();
        hideFundadoresSliderSection(); // Ocultar SECCIÓN del Slider de Fundadores al hacer clic en "Historia"
        hideIncorporacionSliderSection();
        showHistoriaSection(); // Mostrar SECCIÓN de Historia al hacer clic en "Historia"
        deactivateSecondaryNavLinks();
        historiaSecundariaLink.classList.add('active');
    });

    // Event listener para el link "Inicio" en la navegación secundaria - SIN CAMBIOS
    inicioSecundarioLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'index.html'; // Redirigir a index.html
    });

        // 🔥 Nuevo Slider Incorporación 2017
        const incorporacionSecundarioLink = document.getElementById('incorporacion-secundario-link');
        const incorporacionSliderSection = document.getElementById('incorporacion-slider-section');
        const incorporacionSlider = document.getElementById('incorporacion-slider');
        const incorporacionSlides = incorporacionSlider.querySelectorAll('.slide');
        const prevButtonIncorporacion = document.querySelector('.prev-slide-incorporacion');
        const nextButtonIncorporacion = document.querySelector('.next-slide-incorporacion');
    
        let currentIncorporacionSlide = 0;
    
        function showIncorporacionSliderSection() {
            incorporacionSliderSection.classList.remove('hidden');
        }
    
        function hideIncorporacionSliderSection() {
            incorporacionSliderSection.classList.add('hidden');
        }
    
        function updateIncorporacionSlide(slideIndex) {
            incorporacionSlides.forEach((slide, index) => {
                slide.classList.toggle('active', index === slideIndex);
            });
            currentIncorporacionSlide = slideIndex;
        }
    
        // 🚀 Evento para "Incorporación 2017"
        incorporacionSecundarioLink.addEventListener('click', (event) => {
            event.preventDefault();
            hideHistoriaSection();
            hideFundadoresSliderSection();
            showIncorporacionSliderSection();
            deactivateSecondaryNavLinks();
            incorporacionSecundarioLink.classList.add('active');
        });
    
        // 🔄 Flechas del slider de Incorporación 2017
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
 
});
