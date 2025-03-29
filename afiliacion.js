document.addEventListener("DOMContentLoaded", () => {
    const embed = document.getElementById("pdfEmbed");
    const downloadBtn = document.getElementById("downloadPdf");
  
    // 🚫 Desactivar clic derecho (en desktop principalmente)
    embed.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  
    // 🖨️ Descargar mediante impresión (mantiene los campos llenos)
    downloadBtn.addEventListener("click", () => {
      embed.focus();
      embed.contentWindow?.print(); // fallback si es iframe, pero embed no siempre lo soporta
      window.print(); // alternativa si contentWindow no funciona
    });
  });
  