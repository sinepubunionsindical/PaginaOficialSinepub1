document.addEventListener("DOMContentLoaded", () => {
    const iframe = document.getElementById("pdfIframe");
    const downloadBtn = document.getElementById("downloadPdf");
  
    // 🔒 Desactivar clic derecho en el visor
    iframe.addEventListener("load", () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.addEventListener("contextmenu", (e) => e.preventDefault());
      } catch (e) {
        console.warn("No se pudo bloquear el clic derecho dentro del iframe.");
      }
    });
  
    // 📥 Validación antes de permitir descarga
    downloadBtn.addEventListener("click", async () => {
      try {
        const response = await fetch("Afiliacion.pdf");
        const arrayBuffer = await response.arrayBuffer();
  
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        const form = pdfDoc.getForm();
        const fields = form.getFields();
  
        let camposVacios = [];
  
        fields.forEach(field => {
          const name = field.getName();
          const value = field.getText ? field.getText() : "";
          if (!value || value.trim() === "") {
            camposVacios.push(name);
          }
        });
  
        if (camposVacios.length > 0) {
          alert("Por favor completa todos los campos del formulario antes de descargar.\nCampos incompletos:\n- " + camposVacios.join("\n- "));
          return;
        }
  
        // ✅ Si todo está lleno, permitir impresión
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (err) {
        console.error("Error validando el formulario:", err);
        alert("No se pudo validar el formulario. Intenta nuevamente o verifica que el PDF esté accesible.");
      }
    });
  });
  