document.addEventListener('DOMContentLoaded', function () {
    // Aplicar fade-in al cargar
    document.body.classList.remove('fade-out');
    document.body.classList.add('fade-in'); // Aseguramos que la clase fade-in se aplica correctamente al cargar la página

    // Interceptar clics en enlaces para aplicar fade-out
    document.querySelectorAll('a[href]:not(.no-fade)').forEach(link => {
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
            }
        });
    });

    // ✅ Iniciar toda la lógica del slider una vez el DOM está listo
    initSlider();
}); // <-- CIERRE CORRECTO DEL DOMContentLoaded listener

// Definición de la función principal del Slider
function initSlider() {
    // --- Selección de Elementos ---
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const navLinks = document.querySelectorAll('.slider-nav a');
    const sliderDotsContainer = document.querySelector('.slider-dots');
    const moduleDotsContainer = document.querySelector('.modulos-nav');
    const sliderContainerElement = document.querySelector('.slider-container'); // Usado? Verificar si se usa más adelante.
    const menuColaboradores = document.querySelector(".menu-item-colaboradores");
    const dropdownColaboradores = document.querySelector(".dropdown-menu-colaboradores");
    const infoColaboradores = document.querySelectorAll(".info-colaborador");
    const headerMenu = document.querySelector(".header-titles-nav");
    const eventosDotsContainer = document.querySelector('.modulos-nav-eventos');

    // --- Variables de Estado ---
    let currentSlide = 0;
    let autoplayInterval;
    let inactivityTimeout;
    const inactivityTime = 90000; // 90 segundos

    // --- Verificar si existen elementos antes de usarlos (Buena práctica) ---
    if (!slider || !slides.length || !prevButton || !nextButton || !sliderDotsContainer || !moduleDotsContainer) {
        console.warn("Slider: No se encontraron todos los elementos necesarios. El slider no funcionará correctamente.");
        return; // Salir si falta algo esencial
    }

    // --- Lógica del Menú Colaboradores ---
    if (menuColaboradores && dropdownColaboradores && infoColaboradores.length && headerMenu) {
        let isHovering = false;

        const showDropdown = () => {
            dropdownColaboradores.style.display = "block";
            // Forzar reflow para asegurar que la transición se aplique desde display: none
            dropdownColaboradores.offsetHeight;
            dropdownColaboradores.style.opacity = "1";
            isHovering = true;
        };

        const hideDropdown = () => {
            setTimeout(() => {
                if (!isHovering) {
                    dropdownColaboradores.style.opacity = "0";
                    // Esperar que termine la transición de opacidad antes de ocultar
                    setTimeout(() => {
                        if (!isHovering) { // Doble chequeo por si el usuario volvió a entrar rápido
                            dropdownColaboradores.style.display = "none";
                        }
                    }, 300); // Ajusta este tiempo a la duración de tu transición de opacidad CSS
                }
            }, 100); // Pequeño delay antes de empezar a ocultar
        };

        menuColaboradores.addEventListener("mouseenter", showDropdown);
        dropdownColaboradores.addEventListener("mouseenter", () => isHovering = true);
        menuColaboradores.addEventListener("mouseleave", () => {
            isHovering = false;
            hideDropdown();
        });
        dropdownColaboradores.addEventListener("mouseleave", () => {
            isHovering = false;
            hideDropdown();
        });

        infoColaboradores.forEach(info => {
            info.addEventListener("mouseenter", () => isHovering = true);
            info.addEventListener("mouseleave", () => {
                isHovering = false;
                hideDropdown();
            });
        });

        headerMenu.addEventListener("mouseenter", (event) => {
            // Si el mouse entra en el header PERO NO está sobre el item "colaboradores" o su dropdown
            if (!menuColaboradores.contains(event.target) && !dropdownColaboradores.contains(event.target)) {
                isHovering = false;
                hideDropdown();
            }
        });
    } // Fin lógica menú colaboradores

    // --- Definiciones de Funciones Auxiliares (dentro de initSlider para acceso a variables) ---

    function generateDotsForCategory(container, slideClass) {
        if (!container) return;
        container.innerHTML = '';
        const targetSlides = Array.from(slides).filter(slide => slide.classList.contains(slideClass));

        targetSlides.forEach((slide) => {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            const originalIndex = Array.from(slides).indexOf(slide);
            // Buscar un título descriptivo prioritario (H2 o H3 en texto-banner)
            let slideTitle = slide.querySelector('.texto-banner h2, .texto-banner h3, h2, h3')?.textContent?.trim();
            
            // Si no hay título o es genérico, buscar h4 o el primer párrafo
            if (!slideTitle || /fotos|videos|media/i.test(slideTitle)) {
                const altTitle = slide.querySelector('h4, .texto-banner p')?.textContent?.trim();
                if (altTitle && !/fotos|videos|media/i.test(altTitle)) {
                    slideTitle = altTitle.split('.')[0]; // Tomar solo la primera frase si es un párrafo
                }
            }
            
            dot.title = slideTitle || `Slide ${originalIndex + 1}`;
            dot.dataset.slideIndex = originalIndex; // ¡CRÍTICO: Restaurar el índice para la activación!
            dot.dataset.slideTitle = dot.title; 

            dot.addEventListener('click', () => {
                updateSlide(originalIndex);
                stopAutoplay();
                resetInactivityTimer();
            });
            container.appendChild(dot);
        });
        container.style.display = 'none';
    }

    function createModuleDots() {
        generateDotsForCategory(moduleDotsContainer, 'slide-modulo');
    }

    function createEventosDots() {
        generateDotsForCategory(eventosDotsContainer, 'slide-evento');
    }

    function setupModuleNavigation() {
        // Esta función parece redundante si los slides ya son visibles por defecto.
        // Si necesitas asegurar que sean 'block', puedes hacerlo en CSS o aquí.
        // const moduleSlides = document.querySelectorAll(".slide[id^='slide-7'], .slide[id^='slide-8']");
        // moduleSlides.forEach(slide => {
        //     slide.style.display = 'block';
        // });
    }

    // --- ENLACES DIRECTOS (query/hash) ---
    function goToSlideByNumber(n) {
        // n: "6" -> data-slide="6" (click al tab)
        const link = document.querySelector(`.slider-nav a[data-slide="${n}"]`);
        if (link) {
            link.click();             // usa tu listener ya existente
            stopAutoplay();           // coherente con interacción usuario
            resetInactivityTimer();
            return true;
        }
        return false;
    }

    function openSlideFromUrl() {
        const url = new URL(window.location.href);
        // Prioridad 1: ?slide=6
        let target = url.searchParams.get('slide');

        // Prioridad 2: #afiliacion o #slide-6
        if (!target && window.location.hash) {
            const hash = window.location.hash.replace('#', '').toLowerCase();
            if (hash === 'afiliacion') target = '6';
            else if (/^slide-(\d+)$/.test(hash)) target = hash.split('-')[1];
        }

        if (target && /^\d+$/.test(target)) {
            // si no pudo clickear (por alguna razón), llama updateSlide()
            if (!goToSlideByNumber(target)) {
                const idx = parseInt(target, 10) - 1; // base 0
                if (!Number.isNaN(idx)) {
                    updateSlide(idx);
                    stopAutoplay();
                    resetInactivityTimer();
                }
            }
        }
    }

    function updateSlide(slideIndex) {
        // Asegurar que el índice esté dentro de los límites
        if (slideIndex < 0) {
            slideIndex = slides.length - 1;
        } else if (slideIndex >= slides.length) {
            slideIndex = 0;
        }

        // Cambiar el slide visualmente
        slides.forEach((slide, index) => {
            const isActive = index === slideIndex;
            slide.classList.toggle('active', isActive);

            // 🔥 Si es el slide 1 (inicio) y está activo, dale flujo normal
            if (isActive && slide.id === "slide-1") {
                slide.style.position = 'relative';
                slider.classList.add('modo-scroll');
                sliderContainerElement.classList.add('modo-scroll');
            } else {
                slide.style.position = 'absolute';
            }
        });

        currentSlide = slideIndex; // Actualizar el índice global

        // --- INICIO: Lógica Actualizada para NavLinks y Botón Móvil ---
        navLinks.forEach(link => link.classList.remove('active')); // Limpiar todos primero

        let activeNavLink = null; // Para guardar el enlace que debe estar activo

        // Determinar qué enlace secundario debe estar activo
        const activeSlide = slides[slideIndex];
        
        if (activeSlide.classList.contains('slide-noticia')) {
            activeNavLink = Array.from(navLinks).find(link => link.dataset.slide === '2');
        } else if (activeSlide.classList.contains('slide-afiliacion')) {
            activeNavLink = Array.from(navLinks).find(link => link.dataset.slide === '7');
        } else if (activeSlide.classList.contains('slide-modulo')) {
            activeNavLink = Array.from(navLinks).find(link => link.dataset.slide === '8');
        } else if (activeSlide.classList.contains('slide-evento')) {
            activeNavLink = Array.from(navLinks).find(link => link.dataset.slide === '10');
        } else {
            activeNavLink = Array.from(navLinks).find(link => link.dataset.slide === '1');
        }

        // Si no se encuentra por clase, fallback al primer link (Inicio)
        if (!activeNavLink) {
            activeNavLink = Array.from(navLinks).find(link => link.dataset.slide === '1');
        }


        // Si encontramos un enlace correspondiente, lo activamos y actualizamos el botón móvil
        if (activeNavLink) {
            activeNavLink.classList.add('active'); // Activar en la nav secundaria original

            // --- Actualizar el botón y dropdown móvil ---
            const mobileNavButton = document.getElementById('secondary-nav-button');
            const mobileDropdown = document.querySelector('.secondary-nav-dropdown');

            if (mobileNavButton) {
                mobileNavButton.textContent = activeNavLink.textContent; // ¡Actualiza el texto del botón!
            }

            if (mobileDropdown) {
                // Desactivar todos los links del dropdown móvil primero
                mobileDropdown.querySelectorAll('a').forEach(a => a.classList.remove('active-mobile'));

                // Encontrar y activar el link correspondiente en el dropdown móvil
                // Usamos activeNavLink.dataset.slide que ya sabemos que existe
                const correspondingMobileLink = mobileDropdown.querySelector(`a[data-slide-target="${activeNavLink.dataset.slide}"]`);
                if (correspondingMobileLink) {
                    correspondingMobileLink.classList.add('active-mobile'); // ¡Actualiza el activo en el dropdown!
                }
            }
            // --- Fin Actualización Móvil ---
        }
        // --- FIN: Lógica Actualizada ---


        // Actualizar dots (sin cambios en esta llamada)
        updateDots(slideIndex);
        // Ajuste especial para que slide-1 se comporte como scroll natural
        if (slideIndex === 0) {
            slider.classList.add('modo-scroll');
            sliderContainerElement.classList.add('modo-scroll'); // esta es nueva
        } else {
            slider.classList.remove('modo-scroll');
            sliderContainerElement.classList.remove('modo-scroll'); // quitar
        }

    } // Fin de la función updateSlide modificada

    function createNavigationDots() {
        generateDotsForCategory(sliderDotsContainer, 'slide-noticia');
    }

    function updateDots(slideIndex) {
        const activeSlide = slides[slideIndex];

        const updateContainer = (container, slideClass) => {
            if (!container) return;
            const dots = container.querySelectorAll('.slider-dot');
            
            dots.forEach(dot => {
                const dotIndex = parseInt(dot.dataset.slideIndex);
                // Comparación robusta
                if (dotIndex === slideIndex) {
                    dot.classList.add('active');
                    dot.setAttribute('data-active', 'true');
                } else {
                    dot.classList.remove('active');
                    dot.removeAttribute('data-active');
                }
            });
            
            // Mostrar el contenedor si el slide actual pertenece a esta categoría
            const isMatch = activeSlide.classList.contains(slideClass);
            container.style.display = isMatch ? 'flex' : 'none';
        };

        updateContainer(sliderDotsContainer, 'slide-noticia');
        updateContainer(moduleDotsContainer, 'slide-modulo');
        updateContainer(eventosDotsContainer, 'slide-evento');
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(() => {
            // Filtrar solo noticias que no estén ocultas explícitamente
            const newsSlides = Array.from(slides).filter(s => s.classList.contains('slide-noticia') && 
                window.getComputedStyle(s).display !== 'none');
            
            if (newsSlides.length === 0) return;

            const currentActiveSlide = slides[currentSlide];
            const currentIndexInNews = newsSlides.indexOf(currentActiveSlide);

            let nextSlide;
            if (currentIndexInNews === -1 || currentIndexInNews === newsSlides.length - 1) {
                nextSlide = newsSlides[0];
            } else {
                nextSlide = newsSlides[currentIndexInNews + 1];
            }

            if (nextSlide) {
                const nextIndex = Array.from(slides).indexOf(nextSlide);
                updateSlide(nextIndex);
            }
        }, 20000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
        clearTimeout(inactivityTimeout); // Limpiar también el timer de inactividad
    }

    function resetInactivityTimer() {
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(startAutoplay, inactivityTime); // Reiniciar autoplay después de inactividad
    }

    // --- Event Listeners ---

    // Flechas Prev/Next
    prevButton.addEventListener('click', () => {
        updateSlide(currentSlide - 1);
        stopAutoplay();
        resetInactivityTimer();
    });

    nextButton.addEventListener('click', () => {
        updateSlide(currentSlide + 1);
        stopAutoplay();
        resetInactivityTimer();
    });

    // Links de Navegación Principal
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            // Asegúrate que el atributo data-slide existe y es un número
            if (link.dataset.slide) {
                const slideIndexToGo = parseInt(link.dataset.slide) - 1; // Convertir a base 0
                if (!isNaN(slideIndexToGo)) {
                    updateSlide(slideIndexToGo);
                    stopAutoplay();
                    resetInactivityTimer();
                }
            }
        });
    });

    // Listeners de Inactividad Globales (para reiniciar autoplay)
    ['mousemove', 'mousedown', 'keypress', 'touchstart'].forEach(eventType => {
        document.addEventListener(eventType, resetInactivityTimer, { passive: true }); // Usar passive si no prevenimos default
    });

    // --- Inicialización del Slider ---
    createNavigationDots(); // Crear dots de noticias
    createModuleDots();     // Crear dots de módulos
    createEventosDots();    // Eventos
    setupModuleNavigation(); // Configurar navegación de módulos (si es necesario)
    updateSlide(0);         // Mostrar el slide inicial (índice 0)
    startAutoplay();        // Iniciar autoplay (ciclará noticias)
    openSlideFromUrl();     // si la URL trae ?slide=6 o #afiliacion / #slide-6, ir allí
    resetInactivityTimer(); // Iniciar el contador de inactividad
    initPremiumLightbox();  // Lógica de vista previa premium

    function initPremiumLightbox() {
        const lightbox = document.getElementById('premium-lightbox');
        const content = lightbox.querySelector('.lightbox-content');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        const mediaItems = document.querySelectorAll('.media-item');

        let currentIndex = -1;
        let currentGalleryItems = [];

        mediaItems.forEach(item => {
            item.addEventListener('click', () => {
                // Encontrar todos los items de la misma galería (mismo slide)
                const parentSlide = item.closest('.slide');
                currentGalleryItems = Array.from(parentSlide.querySelectorAll('.media-item'));
                currentIndex = currentGalleryItems.indexOf(item);

                openLightbox(item);
            });
        });

        function openLightbox(item) {
            const type = item.dataset.type;
            const src = type === 'img' ? item.querySelector('img').src : item.querySelector('video').src;

            content.innerHTML = '';
            if (type === 'img') {
                const img = document.createElement('img');
                img.src = src;
                content.appendChild(img);
            } else {
                const video = document.createElement('video');
                video.src = src;
                video.controls = true;
                video.autoplay = true;
                content.appendChild(video);
            }

            lightbox.classList.add('active');
            stopAutoplay(); // Detener el slider mientras se ve la galería
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            content.innerHTML = ''; // Limpiar para detener videos
            resetInactivityTimer();
        }

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
            openLightbox(currentGalleryItems[currentIndex]);
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % currentGalleryItems.length;
            openLightbox(currentGalleryItems[currentIndex]);
        });

        // Soporte para teclado
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });
    }

} // <-- CIERRE CORRECTO DE LA FUNCIÓN initSlider

window.addEventListener('hashchange', () => {
    // Re-ejecuta la apertura por hash cuando cambie #afiliacion o #slide-6
    if (typeof initSlider === 'function') {
        // Si quieres que funcione sin recargar, encuentra y “simula” un click
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (hash === 'afiliacion') {
            const link = document.querySelector(`.slider-nav a[data-slide="6"]`);
            if (link) link.click();
        } else if (/^slide-(\d+)$/.test(hash)) {
            const n = hash.split('-')[1];
            const link = document.querySelector(`.slider-nav a[data-slide="${n}"]`);
            if (link) link.click();
        }
    }
});

