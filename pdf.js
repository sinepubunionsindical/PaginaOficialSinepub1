// Configurar PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

function loadSecurePDF(canvasId, url) {
  const canvas = document.getElementById(canvasId);
  const loading = canvas.nextElementSibling;

  if (!canvas) return;

  canvas.oncontextmenu = () => false;

  pdfjsLib.getDocument(url).promise
    .then(pdf => pdf.getPage(1))
    .then(page => {
      const viewport = page.getViewport({ scale: window.devicePixelRatio || 1 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      return page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    })
    .then(() => {
      if (loading) loading.style.display = "none";
    })
    .catch(err => {
      console.error("Error al cargar el PDF:", err);
      if (loading) loading.textContent = "Error al cargar el documento";
    });
}

// Cargar PDFs al iniciar
document.addEventListener("DOMContentLoaded", () => {
  loadSecurePDF("pdf-canvas-slide7", "Concepto_disponibilidad_empleado.pdf");
  loadSecurePDF("pdf-canvas-slide8", "producto_del_acuerdo_nacional.pdf");
});
