document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuPanel = document.getElementById('mobile-menu');
    const menuClose = document.getElementById('mobile-menu-close');

    if (menuToggle && menuPanel) {
        // Abrir menú
        menuToggle.addEventListener('click', () => {
            menuPanel.classList.add('active'); // Añade la clase que definimos en CSS
            menuToggle.setAttribute('aria-expanded', 'true');
            menuPanel.setAttribute('aria-hidden', 'false');
        });
    }

    if (menuClose && menuPanel) {
        // Cerrar menú con el botón X
        menuClose.addEventListener('click', () => {
            menuPanel.classList.remove('active'); // Quita la clase
            menuToggle.setAttribute('aria-expanded', 'false');
            menuPanel.setAttribute('aria-hidden', 'true');
        });
    }

    // Opcional: Cerrar menú si se hace clic fuera de él (en el overlay o contenido)
    // document.addEventListener('click', (event) => {
    //     if (menuPanel && menuPanel.classList.contains('active') &&
    //         !menuPanel.contains(event.target) && !menuToggle.contains(event.target)) {
    //         menuPanel.classList.remove('active');
    //         menuToggle.setAttribute('aria-expanded', 'false');
    //         menuPanel.setAttribute('aria-hidden', 'true');
    //     }
    // });

    // Opcional: Cerrar menú al hacer clic en un enlace del menú
    if (menuPanel) {
        const menuLinks = menuPanel.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuPanel.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuPanel.setAttribute('aria-hidden', 'true');
            });
        });
    }
});