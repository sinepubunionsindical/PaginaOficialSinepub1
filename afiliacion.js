document.getElementById("downloadPdf").addEventListener("click", async function() {
    try {
        const pdfViewer = document.getElementById("pdfViewer"); // ID correcto del visor
        const pdfUrl = pdfViewer.src; // Obtener la URL del PDF cargado en el visor

        if (!pdfUrl) {
            console.error("No se pudo obtener la URL del PDF.");
            return;
        }

        // Cargar el PDF desde la URL usando PDF.js
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1); // Capturar solo la primera página (se puede hacer para varias)
        
        const scale = 2; // Aumentar resolución
        const viewport = page.getViewport({ scale: scale });

        // Crear un canvas temporal para capturar la imagen del PDF
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Renderizar el PDF en el canvas
        await page.render({ canvasContext: context, viewport: viewport }).promise;

        // Convertir el canvas a una imagen
        const imageDataUrl = canvas.toDataURL("image/png");

        // Crear un nuevo PDF con la imagen renderizada
        const pdfDoc = await PDFLib.PDFDocument.create();
        const pageImage = await pdfDoc.embedPng(imageDataUrl);
        const page1 = pdfDoc.addPage([viewport.width, viewport.height]);
        page1.drawImage(pageImage, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height
        });

        // Guardar y descargar el PDF generado
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Afiliacion_Lleno.pdf";
        link.click();
    } catch (error) {
        console.error("Error al capturar y descargar el PDF:", error);
    }
});
