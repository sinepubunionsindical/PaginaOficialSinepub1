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

    function createModuleDots() {
        if (!moduleDotsContainer) return;
        moduleDotsContainer.innerHTML = ''; // Limpiar dots previos

        // Seleccionar slides de módulos DENTRO de esta función o pasar 'slides' como argumento
        const moduleSlides = Array.from(slides).filter(slide => slide.id.startsWith('slide-8') || slide.id.startsWith('slide-9'));

        moduleSlides.forEach((slide, index) => {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            // El índice original del slide dentro de la colección 'slides'
            const originalSlideIndex = Array.from(slides).indexOf(slide);
            dot.dataset.slideIndex = originalSlideIndex; // Usar índice base 0

            if (index === 0) {
                // No activar por defecto aquí, se maneja en updateSlide/updateDots
            }

            dot.addEventListener('click', function () {
                const slideIndexToGo = parseInt(this.dataset.slideIndex);
                updateSlide(slideIndexToGo); // El índice ya es base 0
                stopAutoplay();
                resetInactivityTimer();
                // La activación del dot se maneja en updateSlide/updateDots
            });

            moduleDotsContainer.appendChild(dot);
        });
        moduleDotsContainer.style.display = 'none'; // Ocultar inicialmente
    }
    function createEventosDots() {
        if (!eventosDotsContainer) return;
        eventosDotsContainer.innerHTML = ''; // Limpiar previos

        const eventosSlideIndices = [9, 10, 11, 12, 13, 14, 15]; // Recuerda: base 0 (slide-10 = índice 9)
        eventosSlideIndices.forEach((slideIndex) => {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            dot.dataset.slideIndex = slideIndex;
            dot.addEventListener('click', (event) => {
                const slideIndexToGo = parseInt(event.target.dataset.slideIndex);
                updateSlide(slideIndexToGo);
                stopAutoplay();
                resetInactivityTimer();
            });
            eventosDotsContainer.appendChild(dot);
        });

        eventosDotsContainer.style.display = 'none'; // Ocultar inicialmente
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
        if (slideIndex >= 1 && slideIndex <= 5 && slideIndex !== 3) { // Noticias (excluyendo slide-4 deshabilitado)
            activeNavLink = Array.from(navLinks).find(link => link.dataset.slide === '2');
        } else if (slideIndex === 6) { // Afiliación
            activeNavLink = Array.from(navLinks).find(link => link.dataset.slide === '7');
        } else if (slideIndex === 7 || slideIndex === 8) { // Módulos
            activeNavLink = Array.from(navLinks).find(link => link.dataset.slide === '8');
        } else if (slideIndex >= 9 && slideIndex <= 15) { // Eventos
            activeNavLink = Array.from(navLinks).find(link => link.dataset.slide === '10');
        } else { // Inicio u otro
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
        if (!sliderDotsContainer) return;
        sliderDotsContainer.innerHTML = ''; // Limpiar dots previos

        // Crear dots solo para los slides de noticias activos (índices 1, 2, 4, 5)
        // Se excluye índice 3 (slide-4) que está deshabilitado
        const newsSlideIndices = [1, 2, 4, 5];
        newsSlideIndices.forEach((slideIndex) => {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            dot.dataset.slideIndex = slideIndex; // Índice base 0
            // La activación se maneja en updateDots
            dot.addEventListener('click', (event) => {
                const slideIndexToGo = parseInt(event.target.dataset.slideIndex);
                updateSlide(slideIndexToGo);
                stopAutoplay();
                resetInactivityTimer();
            });
            sliderDotsContainer.appendChild(dot);
        });
        sliderDotsContainer.style.display = 'none'; // Ocultar inicialmente
    }

    function updateDots(slideIndex) {
        // Actualizar dots de Noticias
        if (sliderDotsContainer) {
            const newsDots = sliderDotsContainer.querySelectorAll('.slider-dot');
            newsDots.forEach(dot => {
                const dotIndex = parseInt(dot.dataset.slideIndex);
                console.log('dotIndex:', dotIndex, 'slideIndex:', slideIndex); // Verifica los índices
                dot.classList.toggle('active', dotIndex === slideIndex);
            });
            // Mostrar/ocultar contenedor basado en si estamos en sección noticias activas (1, 2, 4, 5)
            // Se excluye índice 3 (slide-4 deshabilitado)
            sliderDotsContainer.style.display = ((slideIndex === 1 || slideIndex === 2 || slideIndex === 4 || slideIndex === 5)) ? 'flex' : 'none';
        }

        // Actualizar dots de Módulos
        if (moduleDotsContainer) {
            const moduleDots = moduleDotsContainer.querySelectorAll('.slider-dot');
            moduleDots.forEach(dot => {
                const dotIndex = parseInt(dot.dataset.slideIndex);
                dot.classList.toggle('active', dotIndex === slideIndex);
            });
            // Mostrar/ocultar contenedor basado en si estamos en sección módulos
            moduleDotsContainer.style.display = (slideIndex === 7 || slideIndex === 8) ? 'flex' : 'none';
        }

        // Actualizar dots de Eventos
        if (eventosDotsContainer) {
            const eventosDots = eventosDotsContainer.querySelectorAll('.slider-dot');
            eventosDots.forEach(dot => {
                const dotIndex = parseInt(dot.dataset.slideIndex);
                dot.classList.toggle('active', dotIndex === slideIndex);
            });
            eventosDotsContainer.style.display = (slideIndex >= 9 && slideIndex <= 15) ? 'flex' : 'none';
        }
    }

    function startAutoplay() {
        stopAutoplay(); // Detener cualquier autoplay anterior
        autoplayInterval = setInterval(() => {
            let nextSlideIndex;
            // Autoplay cicla solo por las noticias activas (índices 1, 2, 4, 5)
            // Se salta el índice 3 (slide-4 deshabilitado)
            if (currentSlide === 1) {
                nextSlideIndex = 2; // De slide-2 a slide-3
            } else if (currentSlide === 2) {
                nextSlideIndex = 4; // De slide-3 a slide-5 (salta el 3/slide-4)
            } else if (currentSlide === 4) {
                nextSlideIndex = 5; // De slide-5 a slide-6
            } else if (currentSlide === 5) {
                nextSlideIndex = 1; // De slide-6 vuelve a slide-2
            } else {
                nextSlideIndex = 1; // Si estamos fuera de las noticias, volver a la primera activa
            }
            updateSlide(nextSlideIndex);
        }, 20000); // Cambiar slide cada 20 segundos
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

