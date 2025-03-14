document.getElementById("downloadPdf").addEventListener("click", function() {
    const pdfViewer = document.getElementById("pdfViewer"); // ID del visor de PDF
    const pdfUrl = pdfViewer.src; // Obtener la URL del PDF cargado en el visor

    if (!pdfUrl) {
        console.error("No se pudo obtener la URL del PDF.");
        return;
    }

    // Crear un enlace para forzar la descarga
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Afiliacion_Lleno.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
