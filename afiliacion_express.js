// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    // Elemento contenedor donde se renderizará el visor
    const viewerElement = document.getElementById('pdf-express-viewer');
    // Botón externo para la descarga
    const downloadButton = document.getElementById('downloadPdf');

    // Verifica si el contenedor existe antes de intentar cargar el visor
    if (!viewerElement) {
        console.error("El contenedor <div id='pdf-express-viewer'> no se encontró en el DOM.");
        return;
    }

    // --- Configuración de PDF.js Express ---
    WebViewer({
        // Ruta a las librerías de PDF.js Express (extraídas del CDN o descargadas)
        // Si usas el CDN como en el HTML, esta es la ruta relativa estándar.
        path: 'https://cdn.jsdelivr.net/npm/@pdftron/webviewer@latest/public',
        // ¡IMPORTANTE! Reemplaza esto con tu clave de licencia de PDF.js Express
        licenseKey: 'TU_LICENSE_KEY', // Obtén tu clave en https://www.pdfjs.express/
        // Documento PDF inicial a cargar (asegúrate que la ruta sea correcta desde donde se sirve la página HTML)
        initialDoc: './Afiliacion.pdf', // Ruta relativa al archivo PDF
    }, viewerElement) // El segundo argumento es el elemento donde se montará el visor
    .then(instance => {
        // --- El visor se ha cargado ---
        console.log('PDF.js Express cargado correctamente.');

        // Accede a la instancia del documento para futuras operaciones si es necesario
        const { documentViewer, annotationManager } = instance.Core;

        // --- Personalización de la UI ---

        // 1. Desactivar elementos de la UI (botones de descarga, impresión, etc.)
        instance.UI.disableElements([
            'downloadButton',
            'printButton',
            'saveAsButton', // Puede que necesites otros IDs dependiendo de tu versión/configuración
            // 'contextMenuPopup', // Descomentar si quieres deshabilitar todo el menú contextual
            // Agrega aquí otros IDs de elementos que quieras ocultar/desactivar
            // Puedes inspeccionar el DOM del visor para encontrar los 'data-element'
        ]);

        // 2. Bloquear el clic derecho específicamente sobre el área del visor
        //    Esto complementa la desactivación del menú contextual si es necesario.
        viewerElement.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            console.log('Clic derecho bloqueado sobre el visor.');
            // Opcional: Mostrar un mensaje personalizado
            // alert('El clic derecho está deshabilitado en esta área.');
        });

        // --- Funcionalidad del Botón Externo de Descarga ---

        // Verifica si el botón de descarga externo existe
        if (downloadButton) {
            downloadButton.addEventListener('click', () => {
                console.log('Intentando descargar PDF con datos...');
                // Utiliza el método de la instancia para descargar el PDF actual
                // includeAnnotations: true es crucial para incluir los datos del formulario
                instance.downloadPdf({
                    includeAnnotations: true, // Asegura que los datos del formulario se incluyan
                    filename: 'Afiliacion_SINEPUB_Completado.pdf' // Nombre sugerido para el archivo descargado
                }).then(() => {
                    console.log('Descarga iniciada.');
                }).catch(error => {
                    console.error('Error al intentar descargar el PDF:', error);
                    alert('Hubo un problema al generar el PDF para descargar.');
                });
            });
        } else {
            console.warn('El botón con id="downloadPdf" no se encontró. La descarga externa no funcionará.');
        }

        // --- Otras configuraciones posibles ---

        // Ejemplo: Escuchar cambios en los campos del formulario
        annotationManager.addEventListener('annotationChanged', (annotations, action) => {
            if (action === 'add' || action === 'modify') {
                annotations.forEach(annot => {
                    // Los campos de formulario son un tipo de anotación (Widget)
                    if (annot instanceof instance.Core.Annotations.WidgetAnnotation) {
                        console.log(`Campo modificado: ${annot.fieldName}, Nuevo valor: ${annot.fieldValue}`);
                        // Aquí podrías añadir lógica adicional, como validaciones en tiempo real
                    }
                });
            }
        });

        // Evento cuando el documento está completamente cargado en el visor
        documentViewer.addEventListener('documentLoaded', () => {
            console.log('Documento PDF cargado en el visor.');
            // Aquí puedes realizar acciones específicas después de que el PDF se muestre
            // Por ejemplo, ajustar el zoom inicial, ir a una página específica, etc.
            // instance.UI.setZoomLevel('page-width');
        });

    })
    .catch(error => {
        // Manejo de errores si PDF.js Express no puede inicializarse
        console.error('Error al inicializar PDF.js Express:', error);
        viewerElement.innerHTML = '<p style="color: red; padding: 20px;">Error al cargar el visor de PDF. Verifica la configuración y la clave de licencia.</p>';
        // Oculta o deshabilita el botón de descarga si el visor falla
        if (downloadButton) {
            downloadButton.disabled = true;
            downloadButton.style.cursor = 'not-allowed';
            downloadButton.style.opacity = '0.5';
        }
    });
});