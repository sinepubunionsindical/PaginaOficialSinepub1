pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

function loadSecurePDFMulti(containerId, url) {
  const container = document.getElementById(containerId);
  container.innerHTML = '<div class="loading-overlay">Cargando documento...</div>';

  pdfjsLib.getDocument(url).promise.then(pdf => {
    container.innerHTML = ''; // Limpia el mensaje de carga

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const canvas = document.createElement("canvas");
      canvas.id = `pdf-page-${pageNum}`;
      canvas.className = "pdf-canvas";
      canvas.oncontextmenu = () => false;
      container.appendChild(canvas);

      pdf.getPage(pageNum).then(page => {
        const viewport = page.getViewport({ scale: window.devicePixelRatio || 1 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        page.render({
          canvasContext: canvas.getContext("2d"),
          viewport
        });
      });
    }
  }).catch(err => {
    console.error("Error al cargar PDF:", err);
    container.innerHTML = '<div class="loading-overlay">Error al cargar el documento</div>';
  });
}
document.addEventListener("DOMContentLoaded", () => {
  loadSecurePDFMulti("pdf-viewer-slide7", "Concepto_disponibilidad_empleado.pdf");
  loadSecurePDFMulti("pdf-viewer-slide8", "producto_del_acuerdo_nacional.pdf");
});
