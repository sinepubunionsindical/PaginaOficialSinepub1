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
});