document.getElementById("downloadPdf").addEventListener("click", async function() {
    try {
        const pdfFrame = document.getElementById("pdf-viewer");

        // 🔹 Capturar la imagen del visor PDF
        const canvas = await html2canvas(pdfFrame, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        // 🔹 Cargar el PDF original (para extraer su tamaño si es necesario)
        const existingPdfBytes = await fetch("Afiliacion.pdf").then(res => res.arrayBuffer());
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
        
        // 🔹 Crear un nuevo PDF sin formularios
        const newPdfDoc = await PDFLib.PDFDocument.create();
        const page = newPdfDoc.addPage([canvas.width, canvas.height]); // Tamaño igual al canvas
        const img = await newPdfDoc.embedPng(imgData);
        page.drawImage(img, {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        });

        // 🔹 Guardar y descargar el PDF sin formularios editables
        const pdfBytes = await newPdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Afiliacion_Lleno.pdf";
        link.click();

    } catch (error) {
        console.error("Error al procesar el PDF:", error);
    }
});
