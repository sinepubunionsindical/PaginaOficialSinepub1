document.addEventListener('DOMContentLoaded', function () {
    
    // Aplicar fade-in al cargar
    document.body.classList.remove('fade-out');
    document.body.classList.add('fade-in');

    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const isInternal = href && !href.startsWith('#') && !link.hasAttribute('target');

            if (isInternal) {
                e.preventDefault();
                document.body.classList.remove('fade-in');
                document.body.classList.add('fade-out');
                document.body.addEventListener('transitionend', function onTransitionEnd() {
                    document.body.removeEventListener('transitionend', onTransitionEnd);
                    setTimeout(() => {
                        window.location.href = href;
                    }, 400);
                });
            }
        });
    });
    
    // 🎯 SECCIONES Y BOTONES
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

    const incorporacionSlides = document.querySelectorAll('#incorporacion-slider-section .slide');

    let currentFundadorSlide = 0;
    let currentIncorporacionSlide = 0;
    // Desactivar thumbnails y slides al inicio
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active-thumb'));
    incorporacionSlides.forEach(slide => {
    slide.classList.remove('active');
    slide.style.display = 'none';
    });
    function showSection(sectionToShow) {
        const sections = [historiaSection, fundadoresSliderSection, incorporacionSliderSection];
    
        // Paso 1: Fade-out de todas
        sections.forEach(sec => {
            sec.classList.remove('active');
            sec.classList.add('fade-section');
        });
    
        // Paso 2: Esperar fade-out y aplicar fade-in
        setTimeout(() => {
            sections.forEach(sec => sec.classList.add('hidden'));
    
            sectionToShow.classList.remove('hidden');
    
            // 🔥 Forzar reflow después de mostrarla
            void sectionToShow.offsetWidth;
    
            // Activar transición de entrada
            sectionToShow.classList.add('active');
    
            // Reiniciar slide si aplica
            if (sectionToShow === fundadoresSliderSection) {
                updateFundadorSlide(0);
            } else if (sectionToShow === incorporacionSliderSection) {
                updateIncorporacionSlide(0);
            }
        }, 400); // 400ms debe coincidir con transición en .fade-section
    }
    
 

    function deactivateSecondaryNavLinks() {
        historiaSecundariaLink.classList.remove('active');
        fundadoresSecundarioLink.classList.remove('active');
        incorporacionSecundarioLink.classList.remove('active');
    }

    function activarSubtituloSecundario(sectionId) {
        deactivateSecondaryNavLinks();
        switch (sectionId) {
            case 'historia': historiaSecundariaLink.classList.add('active'); break;
            case 'fundadores': fundadoresSecundarioLink.classList.add('active'); break;
            case 'incorporacion': incorporacionSecundarioLink.classList.add('active'); break;
        }
    }

    function updateFundadorSlide(index) {
        fundadoresSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        currentFundadorSlide = index;
    }

    function updateIncorporacionSlide(newIndex) {
        const currentSlide = incorporacionSlides[currentIncorporacionSlide];
        const nextSlide = incorporacionSlides[newIndex];
    
        if (currentSlide === nextSlide) return;
    
        // Paso 1: Fade-out del actual
        currentSlide.classList.remove('active');
        currentSlide.classList.add('fade-section');
    
        // Paso 2: Esperar que desaparezca y aplicar fade-in al nuevo
        setTimeout(() => {
            currentSlide.classList.remove('fade-section');
    
            // Ocultar el anterior
            currentSlide.classList.remove('active');
    
            // Mostrar el nuevo
            nextSlide.classList.remove('fade-section');
            nextSlide.classList.add('active');
    
            // Forzar reflow para que el fade-in se active
            void nextSlide.offsetWidth;
            nextSlide.classList.add('active');
    
            // Actualizar índice global
            currentIncorporacionSlide = newIndex;
        }, 400); // debe coincidir con el tiempo de .fade-section
    }

    // Navegación Fundadores
    prevButtonFundadores.addEventListener('click', () => {
        let idx = currentFundadorSlide - 1;
        if (idx < 0) idx = fundadoresSlides.length - 1;
        updateFundadorSlide(idx);
        activarSubtituloSecundario('fundadores');
    });

    nextButtonFundadores.addEventListener('click', () => {
        let idx = currentFundadorSlide + 1;
        if (idx >= fundadoresSlides.length) idx = 0;
        updateFundadorSlide(idx);
        activarSubtituloSecundario('fundadores');
    });


    // Enlaces menú secundario
    historiaSecundariaLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(historiaSection);
        activarSubtituloSecundario('historia');
    });

    fundadoresSecundarioLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(fundadoresSliderSection);
        activarSubtituloSecundario('fundadores');
    });

    incorporacionSecundarioLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(incorporacionSliderSection);
        activarSubtituloSecundario('incorporacion');
    });
    // Al cargar, ocultar todos los slides y thumbnails activos
    incorporacionSlides.forEach(slide => {
        slide.classList.remove('active');
        slide.style.display = 'none';
    });
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active-thumb'));
    currentIncorporacionSlide = -1; // 🔥 Esto es CLAVE
  

    const thumbnails = document.querySelectorAll('.thumbnail');
    const placeholder = document.getElementById('placeholder-incorporacion');
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            if (index === currentIncorporacionSlide) return; // si ya está activo, salir
    
            // 🔥 Ocultar el placeholder
            document.getElementById('placeholder-incorporacion')?.classList.add('hidden');
    
            // 🔄 Desactivar el slide actual (si existe)
            if (currentIncorporacionSlide >= 0) {
                const currentSlide = incorporacionSlides[currentIncorporacionSlide];
                currentSlide.classList.remove('active');
                currentSlide.style.opacity = '0';
    
                setTimeout(() => {
                    currentSlide.style.display = 'none';
                }, 400);
            }
    
            // 🆕 Mostrar el nuevo slide con fade-in
            const newSlide = incorporacionSlides[index];
            newSlide.style.display = 'block';
            void newSlide.offsetWidth; // trigger reflow
            newSlide.classList.add('active');
            newSlide.style.opacity = '1';
    
            // 🎯 Actualizar miniaturas
            thumbnails.forEach(t => t.classList.remove('active-thumb'));
            thumb.classList.add('active-thumb');
    
            // 🔁 Actualizar el índice actual
            currentIncorporacionSlide = index;
    
            // ▶️ Si es video, reiniciar
            if (index === 8) {
                const video = newSlide.querySelector('video');
                if (video) {
                    video.currentTime = 0;
                    video.pause(); // Si querés que inicie pausado
                    video.style.opacity = '0';
                    void video.offsetWidth;
                    video.style.opacity = '1';
                }
            }
        });
    });
    
    // ✅ Inicialización inicial
    showSection(historiaSection);
    activarSubtituloSecundario('historia');
});
