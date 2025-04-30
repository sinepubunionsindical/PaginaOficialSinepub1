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

        const pdfURL = pdfViewer.src;

        const response = await fetch(pdfURL, { mode: 'cors' });
        const pdfBlob = await response.blob();

        const timestamp = new Date().toISOString();
        const fileName = `FormularioAfiliacion_${timestamp.slice(0, 19).replace(/[:T]/g, "_")}.pdf`;

        // Descargar localmente
        const link = document.createElement("a");
        link.href = URL.createObjectURL(pdfBlob);
        link.download = fileName;
        link.click();

        // Enviar al backend
        const formData = new FormData();
        formData.append("pdf", pdfBlob, fileName);
        formData.append("timestamp", timestamp);

        const result = await fetch(API_ENDPOINTS.enviarPDFLleno, {
            method: "POST",
            headers: {
                "ngrok-skip-browser-warning": "true"
            },
            body: formData
        });

        const resultJson = await result.json();
        if (!resultJson.success) throw new Error(resultJson.error || "Fallo el envío del PDF.");

    } catch (error) {
        console.error("Error:", error);
        alert("❌ Ocurrió un error al procesar el formulario.");
    } finally {
        downloadBtn.textContent = "Descargar Formulario Lleno";
        downloadBtn.disabled = false;
    }
});
