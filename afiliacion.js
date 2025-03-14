document.getElementById("downloadPdf").addEventListener("click", async function() {
    try {
        // Obtener el visor de PDF
        const pdfFrame = document.getElementById("pdf-viewer"); 
        const pdfUrl = pdfFrame.src; // Obtener la URL del PDF en el visor
        
        // Obtener los datos actuales del PDF (tal como se visualizan)
        const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);

        // Asegurar que el PDF mantenga los datos llenados y eliminar campos editables
        pdfDoc.getForm().flatten();

        // Guardar el PDF modificado
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Afiliacion_Llenado.pdf";
        link.click();
    } catch (error) {
        console.error("Error al descargar el PDF con datos: ", error);
    }
});
