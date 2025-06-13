// Contenido para el NUEVO noticia-urgente.js

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // --- Cargar el HTML del modal desde el archivo externo (sin cambios) ---
        const response = await fetch('noticia-urgente.html');
        if (!response.ok) {
            throw new Error(`Error al cargar noticia-urgente.html: ${response.statusText}`);
        }
        const modalHTML = await response.text();
        // Inyectar el HTML del modal al final del body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        // --- FIN: Carga de HTML ---


        // Ahora que el HTML está en la página, podemos buscar los elementos
        const noticiaContainer = document.getElementById('noticia-urgente-container');
        const cerrarBtn = document.getElementById('cerrar-noticia-urgente');
        
        // --- INICIO DE LA MEJORA ---
        // También necesitamos una referencia al 'wrapper' para distinguir el clic en el contenido del clic en el fondo.
        const noticiaWrapper = document.querySelector('.noticia-urgente-wrapper');
        // --- FIN DE LA MEJORA ---

        // 1. Validación de elementos clave
        // Se añade 'noticiaWrapper' a la validación.
        if (!noticiaContainer || !cerrarBtn || !noticiaWrapper) {
            console.warn('⚠️ Elementos del modal de noticia urgente no encontrados tras la carga. Cancelando inicialización.');
            return;
        }

        // 2. Función para mostrar el modal (sin cambios)
        const mostrarNoticia = () => {
            noticiaContainer.classList.add('active');
        };

        // 3. Función para cerrar el modal
        const cerrarNoticia = () => {
            noticiaContainer.classList.remove('active');
            // La animación de salida dura 0.8s, tras lo cual se elimina el elemento del DOM.
            setTimeout(() => {
                // Usamos 'try-catch' aquí por si el usuario hace doble clic rápido y el elemento ya fue removido.
                try {
                    noticiaContainer.remove();
                } catch (e) {
                    // No hacemos nada, el elemento ya no existe.
                }
            }, 800);
        };

        // 4. Iniciar todo con un retraso de 3 segundos (sin cambios)
        setTimeout(mostrarNoticia, 3000);

        // 5. Event listeners
        cerrarBtn.addEventListener('click', cerrarNoticia);

        // --- INICIO DE LA MEJORA: Cerrar el modal al hacer clic en el fondo ---
        noticiaContainer.addEventListener('click', (event) => {
            // Esta condición es la clave: se cierra SÓLO si el clic se hizo directamente
            // sobre el contenedor de fondo (noticiaContainer) y NO sobre uno de sus hijos
            // como el wrapper, el texto o la imagen.
            if (event.target === noticiaContainer) {
                cerrarNoticia();
            }
        });
        // --- FIN DE LA MEJORA ---

        // --- MEJORA ADICIONAL: Cerrar el modal con la tecla 'Escape' ---
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && noticiaContainer.classList.contains('active')) {
                cerrarNoticia();
            }
        });
        // --- FIN DE LA MEJORA ADICIONAL ---


    } catch (error) {
        console.error('🔥 Error crítico en noticia-urgente.js:', error);
    }
});