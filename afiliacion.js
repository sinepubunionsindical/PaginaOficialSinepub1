document.addEventListener("DOMContentLoaded", () => {
    const iframe = document.getElementById("pdfIframe");
    const downloadBtn = document.getElementById("downloadPdf");
  
    // 🔒 Bloquear clic derecho (dentro del iframe)
    iframe.addEventListener("load", () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.addEventListener("contextmenu", (e) => e.preventDefault());
      } catch (e) {
        console.warn("No se pudo bloquear clic derecho dentro del iframe.");
      }
    });
  
    // 📥 Descargar simulando impresión
    downloadBtn.addEventListener("click", () => {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } else {
        alert("No se pudo acceder al formulario.");
      }
    });
  });
  