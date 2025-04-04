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
  // Solo si estás en una página donde existen esos contenedores
  if (document.getElementById("pdf-viewer-slide7")) {
    loadSecurePDFMulti("pdf-viewer-slide7", "Concepto_disponibilidad_empleado.pdf");
  }

  if (document.getElementById("pdf-viewer-slide8")) {
    loadSecurePDFMulti("pdf-viewer-slide8", "producto_del_acuerdo_nacional.pdf");
  }
});
function openSecurePDFModal(url) {
  const overlay = document.getElementById("fullscreen-pdf-viewer");
  const container = document.getElementById("secure-pdf-container");
  overlay.classList.remove("hidden");
  container.innerHTML = '<div class="loading-overlay">Cargando documento...</div>';

  pdfjsLib.getDocument(url).promise.then(pdf => {
    container.innerHTML = ''; // Limpiar loader
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const canvas = document.createElement("canvas");
      canvas.className = "pdf-canvas";
      canvas.oncontextmenu = () => false;
      container.appendChild(canvas);

      pdf.getPage(pageNum).then(page => {
        const viewport = page.getViewport({ scale: window.devicePixelRatio || 1.5 });
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

// Cierre del visor
document.getElementById("close-pdf-viewer").addEventListener("click", () => {
  document.getElementById("fullscreen-pdf-viewer").classList.add("hidden");
});

// Interceptar clics de los links
document.getElementById("estatutos-link").addEventListener("click", e => {
  e.preventDefault();
  openSecurePDFModal("Estatutos.pdf");
});
document.getElementById("acuerdo-colectivo-link").addEventListener("click", e => {
  e.preventDefault();
  openSecurePDFModal("RESOLUCION.pdf");
});
