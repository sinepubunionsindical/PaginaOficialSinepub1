document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const headerNav = document.querySelector('.header-titles-nav ul');
    const mobileMenuContainer = document.createElement('div');
    const hamburgerButton = document.createElement('button');

    const belowHeaderNav = document.querySelector('.below-header-nav-container');
    const sliderNav = document.querySelector('.below-header-nav .slider-nav ul');
    const secondaryNavMobileContainer = document.createElement('div');
    const secondaryNavButton = document.createElement('button');
    const secondaryNavDropdown = document.createElement('div');

    // --- NUEVO: Elemento Overlay ---
    const mobileMenuOverlay = document.createElement('div'); // Crear el overlay

    let isMobileMenuSetup = false;
    let isSecondaryNavSetup = false;

    function setupMobileMenu() {
        if (!header || !headerNav || isMobileMenuSetup) return;

        // --- Crear Botón Hamburguesa (sin cambios) ---
        hamburgerButton.id = 'hamburger-button';
        hamburgerButton.innerHTML = '☰';
        hamburgerButton.setAttribute('aria-label', 'Abrir menú de navegación');
        // Asegurarse de que el botón esté DENTRO del header o donde tenga sentido visualmente
        const headerContainer = header.querySelector('.container.header-titles-container');
        if (headerContainer) {
            headerContainer.appendChild(hamburgerButton); 
        } else {
            header.appendChild(hamburgerButton); // Fallback
        } 

        // --- Crear Contenedor del Menú Móvil (sin cambios) ---
        mobileMenuContainer.className = 'mobile-menu';
        mobileMenuContainer.setAttribute('aria-hidden', 'true');

        // --- NUEVO: Configurar y añadir Overlay ---
        mobileMenuOverlay.id = 'mobile-menu-overlay';
        mobileMenuOverlay.classList.add('mobile-menu-overlay'); // Añadir clase para CSS
        document.body.appendChild(mobileMenuOverlay); // Añadir al body

        // --- Clonar items de navegación originales (sin cambios) ---
        const mobileNavList = headerNav.cloneNode(true);
        mobileMenuContainer.appendChild(mobileNavList);
        
        // --- INICIO: Marcar enlace activo en menú hamburguesa ---
        try {
            const currentPagePath = window.location.pathname;
            const currentHref = window.location.href;
            const mobileLinks = mobileNavList.querySelectorAll('ul > li > a:not(.dropdown-toggle-mobile)'); 

            mobileLinks.forEach(link => {
                const linkUrl = new URL(link.href, window.location.origin); // Obtener URL completa
                const linkPath = linkUrl.pathname;
                const linkHref = linkUrl.href;

                // Buscar el enlace original correspondiente en el headerNav
                 // Usamos getAttribute('href') porque link.href podría estar ya resuelto a la URL completa
                 const originalLink = headerNav.querySelector(`a[href="${link.getAttribute('href')}"]`); 

                let isActive = false;

                // Criterio 1: El enlace original tenía la clase 'active' (más fiable)
                if (originalLink && originalLink.classList.contains('active')) {
                    isActive = true;
                } 
                // Criterio 2: Comparación de HREF (para casos donde 'active' no esté en el original)
                else if (linkHref === currentHref) {
                     isActive = true;
                 }
                // Criterio 3: Comparación de Path (maneja index.html vs /)
                 else if (
                    (currentPagePath === '/' || currentPagePath.endsWith('/index.html')) && 
                    (linkPath === '/' || linkPath.endsWith('/index.html'))
                 ) {
                     isActive = true;
                 } 
                // Criterio 4: Comparación exacta de path (para otras páginas)
                 else if (currentPagePath !== '/' && !currentPagePath.endsWith('/index.html') && linkPath === currentPagePath) {
                    isActive = true;
                }

                if (isActive) {
                    link.classList.add('active-mobile'); 
                    // Opcional: añadir la clase también al LI padre si quieres estilizarlo
                    link.closest('li')?.classList.add('active-item');
                }
            });
        } catch (e) {
            console.error("Error al marcar enlace activo en menú móvil:", e);
        }
        // --- FIN: Marcar enlace activo en menú hamburguesa ---


        // --- Adaptar Submenús (sin cambios en la lógica interna, solo sigue aquí) ---
        mobileNavList.querySelectorAll('.menu-item-redes-sociales, .menu-item-colaboradores').forEach(item => {
            // ... (código existente para adaptar submenús) ...
            const originalToggle = item.querySelector('.dropdown-toggle');
            const originalDropdown = item.querySelector('.dropdown-menu');
            if (!originalToggle || !originalDropdown) return;

            const mobileToggle = document.createElement('button'); 
            mobileToggle.className = 'dropdown-toggle-mobile';
            mobileToggle.textContent = originalToggle.textContent;
            mobileToggle.setAttribute('aria-expanded', 'false');

            const mobileSubmenu = document.createElement('div');
            mobileSubmenu.className = originalDropdown.classList.contains('dropdown-menu-redes-sociales')
                ? 'dropdown-menu-redes-sociales-mobile mobile-submenu'
                : 'dropdown-menu-colaboradores-mobile mobile-submenu';
            mobileSubmenu.innerHTML = originalDropdown.innerHTML;

            if (mobileSubmenu.classList.contains('dropdown-menu-redes-sociales-mobile')) {
                mobileSubmenu.querySelector('h2')?.remove(); 
                mobileSubmenu.querySelector('p')?.remove(); 
                const redesContainer = mobileSubmenu.querySelector('.redes-sociales-header');
                if (redesContainer) {
                    redesContainer.className = 'redes-sociales-header-mobile'; 
                     redesContainer.querySelectorAll('img').forEach(img => {
                        if(!img.alt) img.alt = img.src.includes('facebook') ? 'Facebook' : 'WhatsApp';
                     });
                }
            } else if (mobileSubmenu.classList.contains('dropdown-menu-colaboradores-mobile')) {
                 mobileSubmenu.querySelector('h2')?.remove(); 
                 mobileSubmenu.querySelector('p')?.remove(); 
                 mobileSubmenu.querySelectorAll('.colaborador').forEach(colab => {
                     colab.className = 'colaborador-mobile'; 
                     const infoDiv = colab.querySelector('.info-colaborador');
                     if (infoDiv) {
                         infoDiv.className = 'info-colaborador-mobile'; 
                         infoDiv.querySelectorAll('a').forEach(a => {
                            a.target = '_blank'; 
                            a.onclick = (e) => e.stopPropagation(); 
                         });
                     }
                 });
            }

            mobileSubmenu.style.display = 'none'; 

            mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = mobileSubmenu.style.display === 'block';
                mobileSubmenu.style.display = isOpen ? 'none' : 'block';
                mobileToggle.setAttribute('aria-expanded', !isOpen);
            });

            const parentLi = item.closest('li');
             if (parentLi) {
                 parentLi.innerHTML = ''; 
                 parentLi.appendChild(mobileToggle);
                 parentLi.appendChild(mobileSubmenu);
             }
        });
        // --- Fin Adaptar Submenús ---

        // --- Añadir al Body (sin cambios) ---
        document.body.appendChild(mobileMenuContainer); 

        // --- Listener Botón Hamburguesa (MODIFICADO) ---
        hamburgerButton.addEventListener('click', () => {
            const isCurrentlyOpen = mobileMenuContainer.classList.contains('open');
            if (isCurrentlyOpen) {
                closeMobileMenu(); // Llama a la función centralizada para cerrar
            } else {
                openMobileMenu(); // Llama a la función centralizada para abrir
            }
        });


        // --- Listener Enlaces del Menú ---
        mobileMenuContainer.querySelectorAll('ul > li > a:not(.dropdown-toggle-mobile)').forEach(link => {
            if (!link.closest('.mobile-submenu')) { 
                link.addEventListener('click', (e) => {
                   // Prevenir cierre si es solo un ancla en la misma página
                   if (link.getAttribute('href') === '#') {
                       e.preventDefault(); 
                   } else {
                       // Retraso mínimo para permitir que la navegación inicie antes de cerrar visualmente
                       setTimeout(closeMobileMenu, 50); 
                   }
                });
            }
       });

        // --- Listener Clic Fuera / Overlay (MODIFICADO) ---
        // Usamos el overlay para detectar clics fuera
        mobileMenuOverlay.addEventListener('click', () => {
            // Solo cierra si el menú está actualmente abierto
            if (mobileMenuContainer.classList.contains('open')) {
                closeMobileMenu(); 
            }
        });

        isMobileMenuSetup = true; 
    }

        // --- NUEVAS: Funciones para Abrir y Cerrar Menú ---
        function openMobileMenu() {
            mobileMenuContainer.classList.add('open');
            mobileMenuContainer.setAttribute('aria-hidden', 'false');
            hamburgerButton.innerHTML = '✕';
            hamburgerButton.classList.add('menu-open'); // Añadir clase para estilo ROJO
            hamburgerButton.setAttribute('aria-label', 'Cerrar menú de navegación');
            document.body.classList.add('mobile-menu-is-open'); // Activar overlay/dimming
        }

        function closeMobileMenu() {
            mobileMenuContainer.classList.remove('open');
            mobileMenuContainer.setAttribute('aria-hidden', 'true');
            hamburgerButton.innerHTML = '☰';
            hamburgerButton.classList.remove('menu-open'); // QUITAR clase para estilo VERDE
            hamburgerButton.setAttribute('aria-label', 'Abrir menú de navegación');
            document.body.classList.remove('mobile-menu-is-open'); // Desactivar overlay
            deselectCollaborator(); // Deseleccionar colaborador al cerrar
       }

    function setupSecondaryNavMobile() {
        if (!belowHeaderNav || !sliderNav || isSecondaryNavSetup) return;

        secondaryNavMobileContainer.id = 'secondary-nav-mobile';

        // --- Configurar Botón Principal (sin cambios) ---
        secondaryNavButton.id = 'secondary-nav-button';
        secondaryNavButton.type = 'button'; 
        secondaryNavButton.setAttribute('aria-haspopup', 'listbox');
        secondaryNavButton.setAttribute('aria-expanded', 'false');

        // --- Configurar Dropdown (sin cambios) ---
        secondaryNavDropdown.className = 'secondary-nav-dropdown';
        secondaryNavDropdown.setAttribute('role', 'listbox');

        // --- Llenar botón y dropdown (sin cambios en la lógica interna) ---
        const originalLinks = sliderNav.querySelectorAll('li a');
        let foundActive = false; // Para asegurar que el botón tenga el texto correcto al inicio

        originalLinks.forEach(link => {
            const mobileLink = document.createElement('a');
            mobileLink.href = link.href; // Copiar href original (puede ser útil)
            mobileLink.textContent = link.textContent;

            // ⬇⬇⬇ NUEVO: Copiar ID y estilos si existen
            if (link.id) {
                mobileLink.id = link.id; 
                mobileLink.style.display = link.style.display; 
            }
            // Asegurarse de que data-slide exista antes de copiarlo
            if(link.dataset.slide) {
                 mobileLink.dataset.slideTarget = link.dataset.slide;
             } else {
                 // Si no hay data-slide, usar el texto como fallback (o generar un id)
                 mobileLink.dataset.slideTarget = link.textContent.toLowerCase().replace(/\s+/g, '-');
             }
            mobileLink.setAttribute('role', 'option');

            // Añadir clase 'active-mobile' si el original tiene 'active'
            if (link.classList.contains('active')) {
                mobileLink.classList.add('active-mobile');
                secondaryNavButton.textContent = link.textContent; // Texto correcto al inicio
                foundActive = true;
            }

            mobileLink.addEventListener('click', (e) => {
                e.preventDefault();
                secondaryNavButton.textContent = mobileLink.textContent; 
                secondaryNavDropdown.classList.remove('open'); 
                secondaryNavButton.classList.remove('open');
                secondaryNavButton.setAttribute('aria-expanded', 'false');

                 // Marcar este como activo y desmarcar otros
                 secondaryNavDropdown.querySelectorAll('a').forEach(a => a.classList.remove('active-mobile'));
                 mobileLink.classList.add('active-mobile');

                // Simular clic en el original SÓLO si existe y tiene data-slide
                 // Y si no es un enlace directo a un archivo (como PDF)
                 if (mobileLink.dataset.slideTarget && !link.href.endsWith('.pdf')) { // Evitar click en PDF
                     const originalTargetLink = sliderNav.querySelector(`a[data-slide="${mobileLink.dataset.slideTarget}"]`);
                     if (originalTargetLink) {
                         originalTargetLink.click(); 
                     }
                 } else if (link.href.endsWith('.pdf')) {
                     // Si es un PDF, abrirlo en nueva pestaña
                     window.open(link.href, '_blank');
                 }
                 // Podrías añadir lógica para otros tipos de enlaces si es necesario
            });
            secondaryNavDropdown.appendChild(mobileLink);
        });
        
         // Si no se encontró un 'active' original, poner el texto del primer link en el botón
        if (!foundActive && originalLinks.length > 0) {
            secondaryNavButton.textContent = originalLinks[0].textContent;
        }


        // --- Event Listener abrir/cerrar dropdown (sin cambios) ---
        secondaryNavButton.addEventListener('click', () => {
            const isOpen = secondaryNavDropdown.classList.toggle('open');
            secondaryNavButton.classList.toggle('open');
            secondaryNavButton.setAttribute('aria-expanded', isOpen);
        });

        // --- Agregar ESTATUTOS manualmente si existe y está oculto ---
        const estatutosOriginal = document.querySelector('#estatutos-link');
        if (estatutosOriginal) {
            const estatutosLinkMobile = document.createElement('a');
            estatutosLinkMobile.href = estatutosOriginal.href;
            estatutosLinkMobile.textContent = 'Estatutos';
            estatutosLinkMobile.id = 'estatutos-link-mobile'; // Útil para mostrarlo después
            estatutosLinkMobile.style.display = 'none'; // Oculto inicialmente
            estatutosLinkMobile.setAttribute('role', 'option');
            
            estatutosLinkMobile.addEventListener('click', (e) => {
                e.preventDefault();
                // Abre en nueva pestaña (si es PDF)
                window.open(estatutosLinkMobile.href, '_blank');
                secondaryNavDropdown.classList.remove('open'); 
                secondaryNavButton.classList.remove('open');
                secondaryNavButton.setAttribute('aria-expanded', 'false');
            });

            secondaryNavDropdown.appendChild(estatutosLinkMobile);
        }
         // --- Cerrar dropdown al hacer clic fuera (sin cambios) ---
         document.addEventListener('click', (event) => {
            if (!secondaryNavMobileContainer.contains(event.target) && secondaryNavDropdown.classList.contains('open')) {
                secondaryNavDropdown.classList.remove('open');
                secondaryNavButton.classList.remove('open');
                secondaryNavButton.setAttribute('aria-expanded', 'false');
            }
        });

        // --- Añadir elementos al DOM (sin cambios) ---
        secondaryNavMobileContainer.appendChild(secondaryNavButton);
        secondaryNavMobileContainer.appendChild(secondaryNavDropdown);
        if(sliderNav.parentNode) {
             sliderNav.parentNode.insertBefore(secondaryNavMobileContainer, sliderNav);
        } else {
            belowHeaderNav.appendChild(secondaryNavMobileContainer); 
        }

        isSecondaryNavSetup = true; 
    }

    // --- Lógica de Ejecución y Limpieza (MODIFICADO para quitar overlay) ---
    function applyMobileLayout() {
        const isMobile = window.innerWidth <= 768;
        
        // Limpiar elementos específicos de móvil si estamos en escritorio
        if (!isMobile) {
            if (hamburgerButton && hamburgerButton.parentNode) {
                hamburgerButton.remove(); 
            }
            if (mobileMenuContainer && mobileMenuContainer.parentNode) {
                mobileMenuContainer.remove();
            }
            // Quitar overlay al pasar a escritorio
            if (mobileMenuOverlay && mobileMenuOverlay.parentNode) {
                 mobileMenuOverlay.remove();
            }
            // Quitar clase del body si quedó por error
             document.body.classList.remove('mobile-menu-is-open'); 

            if (secondaryNavMobileContainer && secondaryNavMobileContainer.parentNode) {
                secondaryNavMobileContainer.remove();
            }
             if(headerNav) headerNav.style.display = ''; 
             if(sliderNav) sliderNav.style.display = ''; 

            isMobileMenuSetup = false; 
            isSecondaryNavSetup = false;
             collaboratorsData = []; 
             collaboratorButtonsContainer = null;
             collaboratorInfoContainer = null;
        } else {
            // Configurar elementos móviles si estamos en móvil
            if (!isMobileMenuSetup) setupMobileMenu(); 
            if (!isSecondaryNavSetup && belowHeaderNav && sliderNav) setupSecondaryNavMobile(); 
            // Ocultar elementos de escritorio (CSS debería manejar esto principalmente)
            if(headerNav) headerNav.style.display = 'none';
            if(sliderNav) sliderNav.style.display = 'none';
        }
    }

    applyMobileLayout();
    window.addEventListener('resize', applyMobileLayout);

     // --- Observador (sin cambios en la lógica interna, sólo sigue aquí) ---
     const sliderElement = document.querySelector('.slider');
     if (sliderElement && typeof(MutationObserver) !== 'undefined') {
         const observer = new MutationObserver(mutations => {
             mutations.forEach(mutation => {
                 if ((mutation.type === 'childList' || mutation.type === 'attributes') && mutation.attributeName === 'class') { // Más específico
                     const activeSlide = sliderElement.querySelector('.slide.active');
                     if (activeSlide && activeSlide.id) {
                         const activeSlideIdPart = activeSlide.id.split('-').slice(1).join('-'); // Manejar IDs como 'slide-fundador-1'
                         const correspondingMobileLink = secondaryNavDropdown.querySelector(`a[data-slide-target="${activeSlideIdPart}"]`);
                         if (correspondingMobileLink) {
                             secondaryNavButton.textContent = correspondingMobileLink.textContent; 
                             secondaryNavDropdown.querySelectorAll('a').forEach(a => a.classList.remove('active-mobile'));
                             correspondingMobileLink.classList.add('active-mobile');
                         }
                     }
                 }
             });
         });
         observer.observe(sliderElement, { subtree: true, attributes: true, attributeFilter: ['class'] });
     }
});