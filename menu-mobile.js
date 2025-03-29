document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuPanel = document.getElementById('mobile-menu');
    const menuClose = document.getElementById('mobile-menu-close');
    const menuOverlay = document.getElementById('mobile-menu-overlay'); // Obtener el overlay

    // Función para abrir el menú
    function openMenu() {
        if (menuPanel && menuToggle && menuOverlay) {
            menuPanel.classList.add('active');
            menuOverlay.classList.add('active'); // Mostrar overlay
            menuToggle.setAttribute('aria-expanded', 'true');
            menuPanel.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Evitar scroll del body
        }
    }

    // Función para cerrar el menú
    function closeMenu() {
        if (menuPanel && menuToggle && menuOverlay) {
            menuPanel.classList.remove('active');
            menuOverlay.classList.remove('active'); // Ocultar overlay
            menuToggle.setAttribute('aria-expanded', 'false');
            menuPanel.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restaurar scroll del body
        }
    }

    // Abrir menú con botón hamburguesa
    if (menuToggle) {
        menuToggle.addEventListener('click', openMenu);
    }

    // Cerrar menú con botón X
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }

    // Cerrar menú haciendo clic en el overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }

    // Cerrar menú al hacer clic en un enlace del menú
    if (menuPanel) {
        const menuLinks = menuPanel.querySelectorAll('a');
        menuLinks.forEach(link => {
            // No cerrar inmediatamente si es un enlace interno del slider
            // Dejar que el slider.js maneje el cambio de slide primero
            // El menú se cerrará de todos modos por el click en el enlace
            link.addEventListener('click', (e) => {
                // Solo cierra inmediatamente si NO es un link de slider o es un link a otra página
                // Si tiene data-slide, asumimos que slider.js lo maneja.
                 if (!link.hasAttribute('data-slide') || link.getAttribute('href') !== '#') {
                     // Podríamos querer cerrarlo siempre, incluso los data-slide,
                     // depende de la experiencia deseada.
                     // Por simplicidad, cerramos siempre:
                      closeMenu();
                 } else {
                     // Si es data-slide y href="#" es para slider, cerrar también
                      closeMenu();
                 }


                // Podríamos necesitar un pequeño retraso si el cambio de slide es lento
                // setTimeout(closeMenu, 150); // Descomentar si es necesario retrasar
            });
        });
    }

    // --- Código existente para botones "Leer más/menos" ---
    document.querySelectorAll('.toggle-details-btn').forEach(button => {
        button.addEventListener('click', () => {
            const container = button.closest('.collapsible-text');
            // const content = container.querySelector('.collapsible-content'); // No se usa 'content' aquí
            const isExpanded = container.classList.contains('expanded');

            if (isExpanded) {
                container.classList.remove('expanded');
                button.textContent = 'Leer más';
                button.setAttribute('aria-expanded', 'false');
            } else {
                container.classList.add('expanded');
                button.textContent = 'Leer menos';
                button.setAttribute('aria-expanded', 'true');
            }
        });
    });
    // --- Fin código botones ---
});