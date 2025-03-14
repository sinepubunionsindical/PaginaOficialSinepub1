document.getElementById("downloadPdf").addEventListener("click", function() {
    const pdfViewer = document.getElementById("pdfViewer");

    if (pdfViewer) {
        const pdfUrl = pdfViewer.src;

        // Simular la descarga del archivo dirAectamente desde la URL que está en el visor
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "Afiliacion_Lleno.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        console.error("No se encontró el visor de PDF.");
    }
});