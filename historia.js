document.addEventListener('DOMContentLoaded', function () {

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

    function showSection(section) {
        historiaSection.classList.add('hidden');
        fundadoresSliderSection.classList.add('hidden');
        incorporacionSliderSection.classList.add('hidden');

        section.classList.remove('hidden');
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
