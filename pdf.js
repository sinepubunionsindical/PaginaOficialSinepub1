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
  // Visores embebidos en slides
  if (document.getElementById("pdf-viewer-slide7")) {
    loadSecurePDFMulti("pdf-viewer-slide7", "Concepto_disponibilidad_empleado.pdf");
  }
  if (document.getElementById("pdf-viewer-slide8")) {
    loadSecurePDFMulti("pdf-viewer-slide8", "producto_del_acuerdo_nacional.pdf");
  }

  // Cierre del modal por botón X
  const closeModalBtn = document.getElementById("close-pdf-modal");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      document.getElementById("modal-pdf-viewer").classList.add("hidden");
    });
  }

  // Cierre con tecla ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.getElementById("modal-pdf-viewer").classList.add("hidden");
    }
  });

  // Interceptar links si ya están en el DOM al cargar
  const acuerdoLink = document.getElementById("acuerdo-colectivo-link");
  if (acuerdoLink) {
    acuerdoLink.addEventListener("click", e => {
      e.preventDefault();
      openSecurePDFModal("https://trainheartx.github.io/sinepub-website1/RESOLUCION.pdf");
    });
  }

  // REVISAR si el link de Estatutos fue insertado dinámicamente
  const estatutosLink = document.getElementById("estatutos-link");
  if (estatutosLink) {
    // Asegurar que sea visible y clickeable
    estatutosLink.style.pointerEvents = "auto";

    estatutosLink.addEventListener("click", e => {
      e.preventDefault();
      openSecurePDFModal("https://trainheartx.github.io/sinepub-website1/Estatutos.pdf");
    });
  }

  // También capturar eventos dinámicos por seguridad
  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "estatutos-link") {
      e.preventDefault();
      openSecurePDFModal("https://trainheartx.github.io/sinepub-website1/Estatutos.pdf");
    }
  });
});

// Función para mostrar modal con PDF
function openSecurePDFModal(url) {
  const modal = document.getElementById("modal-pdf-viewer");
  const container = document.getElementById("modal-pdf-container");

  container.innerHTML = '<div class="loading-overlay">Cargando documento...</div>';
  modal.classList.remove("hidden");

  pdfjsLib.getDocument(url).promise.then(pdf => {
    container.innerHTML = '';
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
