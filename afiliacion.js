// Script para manejar el formulario de afiliación

document.addEventListener('DOMContentLoaded', function() {
    // Botón para descargar el PDF
    const downloadBtn = document.getElementById("downloadPdf");
    
    if (downloadBtn) {
        downloadBtn.addEventListener("click", async function () {
            const pdfViewer = document.getElementById("pdfViewer");
        
            if (!pdfViewer) {
                alert("No se pudo acceder al formulario PDF. Recarga la página e intenta de nuevo.");
                return;
            }
        
            try {
                downloadBtn.textContent = "Procesando...";
                downloadBtn.disabled = true;
        
                alert("✅ Tu formulario se descargará correctamente y se enviará a las directivas para proceso de análisis.");
        
                // Capturar imagen del iframe usando html2canvas
                const iframeDocument = pdfViewer.contentDocument || pdfViewer.contentWindow.document;
                const iframeBody = iframeDocument.body;
        
                const canvas = await html2canvas(iframeBody, {
                    scale: 2,
                    useCORS: true
                });
        
                const imgData = canvas.toDataURL("image/png");
        
                // Crear el PDF usando jsPDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: "portrait",
                    unit: "px",
                    format: [canvas.width, canvas.height]
                });
        
                pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
                const pdfBlob = pdf.output("blob");
        
                // Descargar localmente
                const fileName = `FormularioAfiliacion_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "_")}.pdf`;
                const link = document.createElement("a");
                link.href = URL.createObjectURL(pdfBlob);
                link.download = fileName;
                link.click();
        
                // Enviar al backend
                const formData = new FormData();
                formData.append("pdf", pdfBlob, fileName);
                formData.append("timestamp", new Date().toISOString());
                
                const response = await fetch(API_ENDPOINTS.enviarPDFLleno, {
                    method: "POST",
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    },
                    body: formData
                });
              
        
                const result = await response.json();
        
                if (!result.success) {
                    throw new Error(result.error || "No se pudo enviar el formulario.");
                }
        
            } catch (err) {
                console.error("Error:", err);
                alert("❌ Ocurrió un error al procesar el formulario.");
            } finally {
                downloadBtn.textContent = "Descargar Formulario Lleno";
                downloadBtn.disabled = false;
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

