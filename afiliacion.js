document.getElementById("downloadPdf").addEventListener("click", async function() {
    try {
        const pdfFrame = document.getElementById("pdf-viewer");
        
        // 🔹 Capturar la imagen del visor PDF
        const canvas = await html2canvas(pdfFrame, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        // 🔹 Crear un nuevo PDF sin formularios
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: [canvas.width, canvas.height] 
        });

        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save("Afiliacion_Llenado.pdf");

    } catch (error) {
        console.error("Error al procesar el PDF:", error);
    }
});
