document.getElementById("downloadPdf").addEventListener("click", async function() {
    try {
        const pdfFrame = document.getElementById("pdf-viewer");
        const pdfUrl = pdfFrame.src;

        const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);

        // 🔹 🔥 "Aplanar" los datos para hacerlos NO editables
        pdfDoc.getForm().flatten();

        // 🔹 🔥 Guardar el PDF ya modificado
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Afiliacion_Llenado.pdf";
        link.click();

    } catch (error) {
        console.error("Error al guardar el PDF lleno y no editable: ", error);
    }
});
