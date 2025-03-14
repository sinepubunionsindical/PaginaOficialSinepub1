// Función para descargar el PDF con datos llenados y no editable
async function downloadFilledPDF() {
    const url = 'Afiliacion.pdf'; // Ruta del PDF base
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    
    // Hacer que el PDF no sea editable
    pdfDoc.getForm().flatten();
    
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Afiliacion_Llenado.pdf';
    link.click();
}

downloadButton.addEventListener('click', downloadFilledPDF);
