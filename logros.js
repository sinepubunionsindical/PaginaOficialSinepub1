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
    // --- INICIO: Lógica Fullscreen para Rejilla de Imágenes ---

    const gridImagesWrappers = document.querySelectorAll('.logros-section .grid-imagenes .img-wrapper');
    const overlay = document.getElementById('fullscreen-overlay');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const closeButton = document.querySelector('.close-fullscreen');

    // Verificar si los elementos existen antes de añadir listeners
    if (gridImagesWrappers.length > 0 && overlay && fullscreenImage && closeButton) {

        gridImagesWrappers.forEach(wrapper => {
            wrapper.addEventListener('click', () => {
                // Encontrar la imagen DENTRO del wrapper clickeado
                const imageInside = wrapper.querySelector('img');
                if (imageInside && imageInside.src) {
                    // Poner el src de la imagen clickeada en la imagen del overlay
                    fullscreenImage.src = imageInside.src;
                    // Mostrar el overlay quitando la clase 'hidden'
                    overlay.classList.remove('hidden');
                }
            });

             // Añadir cursor pointer a los wrappers para indicar interactividad en móvil
            wrapper.style.cursor = 'pointer'; 
        });

        // Función para cerrar el overlay
        const closeOverlay = () => {
            overlay.classList.add('hidden');
            // Opcional: Limpiar el src para liberar memoria después de la transición
            setTimeout(() => {
                fullscreenImage.src = ''; 
            }, 300); // Debe coincidir con la duración de la transición CSS
        };

        // Cerrar al hacer clic en el botón X
        closeButton.addEventListener('click', (e) => {
             e.stopPropagation(); // Evita que el clic se propague al overlay
             closeOverlay();
        });

        // Cerrar al hacer clic en el fondo del overlay (no en la imagen)
        overlay.addEventListener('click', (event) => {
            // Si el clic fue directamente en el overlay (el fondo)
            if (event.target === overlay) {
                closeOverlay();
            }
        });

        // Cerrar con la tecla Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !overlay.classList.contains('hidden')) {
                closeOverlay();
            }
        });

    } else {
        console.warn("Elementos para la funcionalidad fullscreen de la rejilla no encontrados.");
    }

    // --- FIN: Lógica Fullscreen ---
});