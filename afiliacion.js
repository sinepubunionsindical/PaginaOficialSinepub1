document.addEventListener("DOMContentLoaded", () => {
    const iframe = document.getElementById("pdfIframe");
    const downloadBtn = document.getElementById("downloadPdf");
  
    // 🔒 Desactivar clic derecho en visor
    iframe.addEventListener("load", () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.addEventListener("contextmenu", (e) => e.preventDefault());
      } catch (e) {
        console.warn("No se pudo bloquear el clic derecho dentro del iframe (restricciones de seguridad).");
      }
    });
  
    // 📥 Descargar el formulario usando print
    downloadBtn.addEventListener("click", () => {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } else {
        alert("No se pudo acceder al formulario para imprimir.");
      }
    });
  });
  