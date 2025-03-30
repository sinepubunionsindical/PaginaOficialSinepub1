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

    let isMobileMenuSetup = false;
    let isSecondaryNavSetup = false;

    function setupMobileMenu() {
        if (!header || !headerNav || isMobileMenuSetup) return;

        // Crear Botón Hamburguesa
        hamburgerButton.id = 'hamburger-button';
        hamburgerButton.innerHTML = '☰'; // Icono hamburguesa
        hamburgerButton.setAttribute('aria-label', 'Abrir menú de navegación');
        header.appendChild(hamburgerButton); // Añadir al header

        // Crear Contenedor del Menú Móvil
        mobileMenuContainer.className = 'mobile-menu';
        mobileMenuContainer.setAttribute('aria-hidden', 'true');

        // Clonar items de navegación originales al menú móvil
        const mobileNavList = headerNav.cloneNode(true); // Clonar la lista UL
        mobileMenuContainer.appendChild(mobileNavList);

        // --- Adaptar Submenús (Redes Sociales y Colaboradores) ---
        mobileNavList.querySelectorAll('.menu-item-redes-sociales, .menu-item-colaboradores').forEach(item => {
            const originalToggle = item.querySelector('.dropdown-toggle');
            const originalDropdown = item.querySelector('.dropdown-menu');
            if (!originalToggle || !originalDropdown) return;

            const mobileToggle = document.createElement('button'); // Usar botón para accesibilidad
            mobileToggle.className = 'dropdown-toggle-mobile';
            mobileToggle.textContent = originalToggle.textContent;
            mobileToggle.setAttribute('aria-expanded', 'false');

            const mobileSubmenu = document.createElement('div');
            mobileSubmenu.className = originalDropdown.classList.contains('dropdown-menu-redes-sociales')
                ? 'dropdown-menu-redes-sociales-mobile mobile-submenu'
                : 'dropdown-menu-colaboradores-mobile mobile-submenu';

             // Clonar contenido del submenú original al nuevo div
            mobileSubmenu.innerHTML = originalDropdown.innerHTML;

             // Simplificar estructura para móvil si es necesario (ej. quitar divs extra)
            if (mobileSubmenu.classList.contains('dropdown-menu-redes-sociales-mobile')) {
                mobileSubmenu.querySelector('h2')?.remove(); // Quitar h2
                mobileSubmenu.querySelector('p')?.remove(); // Quitar p
                const redesContainer = mobileSubmenu.querySelector('.redes-sociales-header');
                if (redesContainer) {
                    redesContainer.className = 'redes-sociales-header-mobile'; // Cambiar clase si es necesario
                     // Podrías añadir texto alternativo a las imágenes aquí si no lo tienen
                     redesContainer.querySelectorAll('img').forEach(img => {
                        if(!img.alt) img.alt = img.src.includes('facebook') ? 'Facebook' : 'WhatsApp';
                     });
                }

            } else if (mobileSubmenu.classList.contains('dropdown-menu-colaboradores-mobile')) {
                 mobileSubmenu.querySelector('h2')?.remove(); // Quitar h2
                 mobileSubmenu.querySelector('p')?.remove(); // Quitar p
                 mobileSubmenu.querySelectorAll('.colaborador').forEach(colab => {
                     colab.className = 'colaborador-mobile'; // Cambiar clase
                     const infoDiv = colab.querySelector('.info-colaborador');
                     if (infoDiv) {
                         infoDiv.className = 'info-colaborador-mobile'; // Cambiar clase
                         // Hacer links clickables directamente si es necesario
                         infoDiv.querySelectorAll('a').forEach(a => {
                            a.target = '_blank'; // Abrir en nueva pestaña en móvil
                            a.onclick = (e) => e.stopPropagation(); // Evitar que cierre el menú
                         });
                     }
                 });
            }

            mobileSubmenu.style.display = 'none'; // Asegurar que esté oculto inicialmente

            // Evento para mostrar/ocultar submenú
            mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = mobileSubmenu.style.display === 'block';
                mobileSubmenu.style.display = isOpen ? 'none' : 'block';
                mobileToggle.setAttribute('aria-expanded', !isOpen);
                // Opcional: Cerrar otros submenús abiertos
            });

            // Reemplazar el LI original con el nuevo toggle y submenú
            const parentLi = item.closest('li');
             if (parentLi) {
                 parentLi.innerHTML = ''; // Limpiar LI
                 parentLi.appendChild(mobileToggle);
                 parentLi.appendChild(mobileSubmenu);
             }

        });
         // --- Fin Adaptar Submenús ---


        document.body.appendChild(mobileMenuContainer); // Añadir al body para que se superponga

        // Event Listener para el Botón Hamburguesa
        hamburgerButton.addEventListener('click', () => {
            const isOpen = mobileMenuContainer.classList.contains('open');
            mobileMenuContainer.classList.toggle('open');
            mobileMenuContainer.setAttribute('aria-hidden', isOpen);
            hamburgerButton.innerHTML = isOpen ? '☰' : '✕'; // Cambiar icono
            hamburgerButton.setAttribute('aria-label', isOpen ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
        });

        // Opcional: Cerrar menú al hacer clic en un enlace (si no es un toggle de submenú)
        mobileMenuContainer.querySelectorAll('a:not(.dropdown-toggle-mobile)').forEach(link => {
             // Evitar que los enlaces dentro de los submenús cierren el menú principal
            if (!link.closest('.mobile-submenu')) {
                link.addEventListener('click', () => {
                    mobileMenuContainer.classList.remove('open');
                    mobileMenuContainer.setAttribute('aria-hidden', 'true');
                    hamburgerButton.innerHTML = '☰';
                     hamburgerButton.setAttribute('aria-label', 'Abrir menú de navegación');
                });
            }
        });

        // Opcional: Cerrar menú al hacer clic fuera
        document.addEventListener('click', (event) => {
            if (!mobileMenuContainer.contains(event.target) && !hamburgerButton.contains(event.target) && mobileMenuContainer.classList.contains('open')) {
                mobileMenuContainer.classList.remove('open');
                 mobileMenuContainer.setAttribute('aria-hidden', 'true');
                hamburgerButton.innerHTML = '☰';
                hamburgerButton.setAttribute('aria-label', 'Abrir menú de navegación');
            }
        });

        isMobileMenuSetup = true; // Marcar como configurado
    }

    function setupSecondaryNavMobile() {
        if (!belowHeaderNav || !sliderNav || isSecondaryNavSetup) return;

        secondaryNavMobileContainer.id = 'secondary-nav-mobile';

        // Configurar Botón Principal del Dropdown
        secondaryNavButton.id = 'secondary-nav-button';
        secondaryNavButton.type = 'button'; // Importante para accesibilidad
        secondaryNavButton.setAttribute('aria-haspopup', 'listbox');
        secondaryNavButton.setAttribute('aria-expanded', 'false');

        // Configurar Dropdown
        secondaryNavDropdown.className = 'secondary-nav-dropdown';
        secondaryNavDropdown.setAttribute('role', 'listbox');

        // Llenar botón y dropdown con las opciones originales
        const originalLinks = sliderNav.querySelectorAll('li a');
        let firstLink = true;

        originalLinks.forEach(link => {
            if (firstLink) {
                secondaryNavButton.textContent = link.textContent; // Texto inicial del botón
                firstLink = false;
            }

            const mobileLink = document.createElement('a');
            mobileLink.href = '#'; // Evitar navegación real, JS se encarga
            mobileLink.textContent = link.textContent;
            mobileLink.dataset.slideTarget = link.dataset.slide; // Guardar el target del slide
             mobileLink.setAttribute('role', 'option');

            // Añadir clase 'active-mobile' si el original tiene 'active'
            if (link.classList.contains('active')) {
                mobileLink.classList.add('active-mobile');
                secondaryNavButton.textContent = link.textContent; // Asegurar texto correcto al inicio
            }

            mobileLink.addEventListener('click', (e) => {
                e.preventDefault();
                secondaryNavButton.textContent = mobileLink.textContent; // Actualizar texto del botón
                secondaryNavDropdown.classList.remove('open'); // Cerrar dropdown
                secondaryNavButton.classList.remove('open');
                secondaryNavButton.setAttribute('aria-expanded', 'false');

                 // Remover clase activa de otros links móviles
                 secondaryNavDropdown.querySelectorAll('a').forEach(a => a.classList.remove('active-mobile'));
                 // Añadir clase activa al link clickeado
                 mobileLink.classList.add('active-mobile');

                // Simular clic en el enlace original oculto para activar el slider.js
                const originalTargetLink = sliderNav.querySelector(`a[data-slide="${mobileLink.dataset.slideTarget}"]`);
                if (originalTargetLink) {
                    originalTargetLink.click(); // Esto debería activar tu slider.js existente
                }
            });
            secondaryNavDropdown.appendChild(mobileLink);
        });

        // Event Listener para abrir/cerrar el dropdown
        secondaryNavButton.addEventListener('click', () => {
            const isOpen = secondaryNavDropdown.classList.toggle('open');
            secondaryNavButton.classList.toggle('open');
            secondaryNavButton.setAttribute('aria-expanded', isOpen);
        });

         // Opcional: Cerrar dropdown al hacer clic fuera
         document.addEventListener('click', (event) => {
            if (!secondaryNavMobileContainer.contains(event.target) && secondaryNavDropdown.classList.contains('open')) {
                secondaryNavDropdown.classList.remove('open');
                secondaryNavButton.classList.remove('open');
                secondaryNavButton.setAttribute('aria-expanded', 'false');
            }
        });

        // Añadir elementos al DOM
        secondaryNavMobileContainer.appendChild(secondaryNavButton);
        secondaryNavMobileContainer.appendChild(secondaryNavDropdown);
        // Insertar ANTES del ul original (que se ocultará con CSS)
        if(sliderNav.parentNode) {
             sliderNav.parentNode.insertBefore(secondaryNavMobileContainer, sliderNav);
        } else {
            belowHeaderNav.appendChild(secondaryNavMobileContainer); // Fallback
        }


        isSecondaryNavSetup = true; // Marcar como configurado
    }

    // --- Lógica de Ejecución y Limpieza ---
    function applyMobileLayout() {
        if (window.innerWidth <= 768) {
            setupMobileMenu();
            setupSecondaryNavMobile();
            // Ocultar elementos de escritorio si es necesario (aunque CSS ya lo hace)
             if(headerNav) headerNav.style.display = 'none';
             if(sliderNav) sliderNav.style.display = 'none';
        } else {
            // Pantalla grande: Asegurarse de que los menús móviles estén ocultos y los originales visibles
            if (hamburgerButton && hamburgerButton.parentNode) {
                hamburgerButton.parentNode.removeChild(hamburgerButton);
            }
            if (mobileMenuContainer && mobileMenuContainer.parentNode) {
                mobileMenuContainer.parentNode.removeChild(mobileMenuContainer);
            }
             if (secondaryNavMobileContainer && secondaryNavMobileContainer.parentNode) {
                secondaryNavMobileContainer.parentNode.removeChild(secondaryNavMobileContainer);
            }
             // Mostrar elementos de escritorio
             if(headerNav) headerNav.style.display = ''; // Reestablecer display
             if(sliderNav) sliderNav.style.display = ''; // Reestablecer display

            isMobileMenuSetup = false; // Resetear flags para re-setup si la ventana cambia de tamaño
            isSecondaryNavSetup = false;
        }
    }

    // Ejecutar al cargar y al cambiar tamaño de ventana
    applyMobileLayout();
    window.addEventListener('resize', applyMobileLayout);

     // --- Observador para actualizar el botón secundario si el slider cambia externamente ---
     // Esto es importante si algo más (como los dots) cambia el slide
     const sliderElement = document.querySelector('.slider');
     if (sliderElement && typeof(MutationObserver) !== 'undefined') {
         const observer = new MutationObserver(mutations => {
             mutations.forEach(mutation => {
                 if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    // Buscar el slide activo actual
                    const activeSlide = sliderElement.querySelector('.slide.active');
                     if (activeSlide && activeSlide.id) {
                         const activeSlideNum = activeSlide.id.split('-')[1];
                         const correspondingMobileLink = secondaryNavDropdown.querySelector(`a[data-slide-target="${activeSlideNum}"]`);
                         if (correspondingMobileLink) {
                             secondaryNavButton.textContent = correspondingMobileLink.textContent; // Actualizar texto
                              // Actualizar clase activa en el dropdown móvil
                             secondaryNavDropdown.querySelectorAll('a').forEach(a => a.classList.remove('active-mobile'));
                             correspondingMobileLink.classList.add('active-mobile');
                         }
                     }
                 }
             });
         });

         // Observar cambios en los atributos de los hijos (para detectar cambio de clase 'active')
         observer.observe(sliderElement, { attributes: true, subtree: true, attributeFilter: ['class'] });
     }


});