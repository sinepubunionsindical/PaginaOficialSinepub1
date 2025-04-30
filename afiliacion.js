// Script para manejar el formulario de afiliación

document.addEventListener('DOMContentLoaded', function() {
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

                // Capturar visual del iframe
                const iframe = pdfViewer;
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                // Esperar un pequeño tiempo por si hay campos activos (delay corto)
                await new Promise(r => setTimeout(r, 500));

                // html2canvas sobre el body del iframe (asegura incluir annotationLayer si existe)
                const canvas = await html2canvas(iframeDoc.body, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: "#ffffff"
                });

                const imgData = canvas.toDataURL("image/png");

                // Generar PDF visual con jsPDF
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
