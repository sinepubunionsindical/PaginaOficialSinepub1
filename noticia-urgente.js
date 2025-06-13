// Contenido para el NUEVO noticia-urgente.js

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // --- INICIO: Cargar el HTML del modal desde el archivo externo ---
        const response = await fetch('noticia-urgente.html');
        if (!response.ok) {
            throw new Error(`Error al cargar noticia-urgente.html: ${response.statusText}`);
        }
        const modalHTML = await response.text();
        // Inyectar el HTML del modal al final del body de la página actual
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        // --- FIN: Carga de HTML ---


        // Ahora que el HTML está en la página, podemos buscar los elementos
        const noticiaContainer = document.getElementById('noticia-urgente-container');
        const cerrarBtn = document.getElementById('cerrar-noticia-urgente');

        // 1. Validación de elementos clave
        if (!noticiaContainer || !cerrarBtn) {
            console.warn('⚠️ Elementos del modal de noticia urgente no encontrados tras la carga. Cancelando inicialización.');
            return;
        }

        // 2. Función para mostrar el modal
        const mostrarNoticia = () => {
            noticiaContainer.classList.add('active');
        };

        // 3. Función para cerrar el modal
        const cerrarNoticia = () => {
            noticiaContainer.classList.remove('active');
            setTimeout(() => {
                noticiaContainer.remove();
            }, 800);
        };

        // 4. Iniciar todo con un retraso de 3 segundos
        setTimeout(mostrarNoticia, 3000);

        // 5. Event listener para el botón de cierre
        cerrarBtn.addEventListener('click', cerrarNoticia);

    } catch (error) {
        console.error('🔥 Error crítico en noticia-urgente.js:', error);
    }
});