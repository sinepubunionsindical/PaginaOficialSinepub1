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
                    // Mostrar notificación informativa
                    alert("✅ Tu formulario se descargará correctamente y se enviará a las directivas para proceso de análisis.");

                    // Correo predefinido al que deseas enviar siempre
                    const email = "sinepubunionsindical@gmail.com"; // O reemplaza por dinámico si algún día se extrae del perfil

                    try {
                        const resultado = await window.enviarFormularioAfiliacion(pdfData, email);
                        if (!resultado.success && resultado.error) {
                            throw new Error(resultado.error);
                        }
                    } catch (error) {
                        console.error("Error al enviar por correo:", error);
                        alert("No se pudo enviar el formulario por correo. Intenta más tarde.");
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

window.enviarFormularioAfiliacion = async function(pdfData, email) {
    const response = await fetch(API_ENDPOINTS.enviarPDFLleno, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({
            ...pdfData,
            email: email
        })
    });
    return await response.json();
};

