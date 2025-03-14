document.getElementById("downloadPdf").addEventListener("click", async function() {
    try {
        const existingPdfBytes = await fetch("Afiliacion.pdf").then(res => res.arrayBuffer());
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
        const pdfBytes = await pdfDoc.save();
        pdfDoc.getForm().flatten(); // Convertir a PDF no editable
        
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Afiliacion_Lleno.pdf";
        link.click();
    } catch (error) {
        console.error("Error al procesar el PDF: ", error);
    }
});