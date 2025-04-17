// Script para manejar el formulario de afiliación

document.addEventListener('DOMContentLoaded', function() {
    // Botón para descargar el PDF
    const downloadBtn = document.getElementById("downloadPdf");
    
    if (downloadBtn) {
        downloadBtn.addEventListener("click", async function() {
            const pdfViewer = document.getElementById("pdfViewer");

            if (pdfViewer) {
                try {
                    // Mostrar mensaje de carga
                    downloadBtn.textContent = "Procesando...";
                    downloadBtn.disabled = true;
                    
                    // Intentar obtener el contenido del PDF
                    const pdfData = await capturarDatosPDF();
                    
                    // Preguntar al usuario si desea recibir una copia por correo
                    if (confirm("¿Deseas recibir una copia del formulario por correo electrónico?")) {
                        // Solicitar correo electrónico
                        const email = prompt("Por favor, ingresa tu correo electrónico:", "");
                        
                        if (email && email.includes('@')) {
                            // Enviar formulario por correo
                            try {
                                const resultado = await window.enviarFormularioAfiliacion(pdfData, email);
                                if (resultado.success) {
                                    alert(`El formulario ha sido enviado a ${email}. Verifica tu bandeja de entrada.`);
                                } else if (resultado.error) {
                                    throw new Error(resultado.error);
                                }
                            } catch (error) {
                                console.error("Error al enviar por correo:", error);
                                alert("No se pudo enviar el formulario por correo. Intenta más tarde.");
                            }
                        } else if (email) {
                            alert("Correo electrónico no válido. No se enviará el formulario por correo.");
                        }
                    }
                    
                    // Simular descarga (independientemente del envío por correo)
                    pdfViewer.contentWindow.focus();
                    pdfViewer.contentWindow.print(); // Simula Ctrl+P y permite guardar el PDF con datos
                    
                } catch (error) {
                    console.error("Error en el proceso:", error);
                    alert("Ocurrió un error al procesar el formulario. Intenta de nuevo.");
                } finally {
                    // Restaurar el botón
                    downloadBtn.textContent = "Descargar Formulario Lleno";
                    downloadBtn.disabled = false;
                }
            } else {
                console.error("No se pudo acceder al visor de PDF.");
                alert("No se pudo acceder al formulario PDF. Recarga la página e intenta de nuevo.");
            }
        });
    }
});

// Función para capturar los datos del PDF
async function capturarDatosPDF() {
    // Implementación básica que captura la URL del PDF actual
    // En una implementación real, esto podría extraer los datos del formulario PDF
    const pdfViewer = document.getElementById("pdfViewer");
    if (!pdfViewer) throw new Error("No se encontró el visor de PDF");
    
    // Capturar la URL actual del PDF (este es un placeholder)
    // En una implementación real, se extraerían los datos reales del formulario
    return {
        url: pdfViewer.src,
        timestamp: new Date().toISOString(),
        // Aquí podrían ir campos adicionales extraídos del formulario
    };
}
