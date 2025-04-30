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

                const iframe = pdfViewer;
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                // ✅ Validar campos
                if (!validarCamposFormulario(iframeDoc)) {
                    alert("⚠️ Por favor, llena todos los campos antes de continuar.");
                    downloadBtn.textContent = "Descargar Formulario Lleno";
                    downloadBtn.disabled = false;
                    return;
                }

                // ✅ Forzar pérdida de foco y permitir actualización visual
                iframeDoc.activeElement?.blur();
                await new Promise(r => setTimeout(r, 300));

                // ✅ Captura visual con html2canvas
                const canvas = await html2canvas(iframeDoc.body, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: "#ffffff"
                });

                const imgData = canvas.toDataURL("image/png");

                // ✅ Generar PDF con jsPDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: "portrait",
                    unit: "px",
                    format: [canvas.width, canvas.height]
                });

                pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
                const pdfBlob = pdf.output("blob");

                // ✅ Descargar localmente
                const fileName = `FormularioAfiliacion_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "_")}.pdf`;
                const link = document.createElement("a");
                link.href = URL.createObjectURL(pdfBlob);
                link.download = fileName;
                link.click();

                // ✅ Enviar al backend
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

// ✅ Valida que todos los campos visibles estén llenos
function validarCamposFormulario(iframeDoc) {
    const campos = iframeDoc.querySelectorAll("input, textarea, select");
    for (const campo of campos) {
        const esVisible = campo.offsetParent !== null && campo.type !== "hidden";
        if (esVisible && campo.type !== "button" && campo.type !== "submit") {
            if (!campo.value.trim()) {
                return false;
            }
        }
    }
    return true;
}
