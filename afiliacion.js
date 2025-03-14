document.getElementById("downloadPdf").addEventListener("click", function() {
    const pdfViewer = document.getElementById("pdfViewer");

    if (pdfViewer) {
        pdfViewer.contentWindow.focus();
        pdfViewer.contentWindow.print(); // Simula Ctrl+P y permite guardar el PDF con datos
    } else {
        console.error("No se pudo acceder al visor de PDF.");
    }
});
