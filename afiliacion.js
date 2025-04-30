/* ───────────────────────── afiliacion.js ─────────────────────────
   • Visor pdf.js “capado” (sin descargar / imprimir / open file)
   • El afiliado solo llena campos y pulsa “Descargar Formulario Lleno”
   • El PDF final se a-p-l-a-n-a → NO editable
   • Se descarga localmente y se envía al backend
   ──────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const btn    = document.getElementById('downloadPdf');
  const iframe = document.getElementById('pdfViewer');

  /* ─── 1. Capar la interfaz ─────────────────────────────────── */
  iframe.addEventListener('load', () => {
    const vw  = iframe.contentWindow;
    const doc = iframe.contentDocument || vw.document;

    const blockCSS = `
      #sidebarContainer, #secondaryToolbar, #download, #openFile,
      #print, #viewBookmark, #viewFind, #presentationMode,
      #viewOutline, #firstPage, #lastPage, #zoomOut, #zoomIn,
      #zoomSelectContainer, .toolbarButtonSpacer {
        display: none !important;
      }
    `;
    doc.head.appendChild(Object.assign(doc.createElement('style'), { textContent: blockCSS }));

    /* Bloquea atajos Ctrl+P / Ctrl+S / Ctrl+O */
    doc.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && ['p', 's', 'o'].includes(e.key.toLowerCase())) {
        e.preventDefault(); e.stopPropagation();
      }
    }, true);
  });

  /* ─── 2. Descarga + envío ──────────────────────────────────── */
  btn.addEventListener('click', async () => {
    try {
      toggleBtn(true);
      alert('⏳ Procesando formulario…');

      const vw = iframe.contentWindow;
      await vw.PDFViewerApplication.initializedPromise;

      if (!camposCompletos(vw.document)) {
        toggleBtn(false);
        return alert('⚠️ Completa todos los campos obligatorios.');
      }

      /* 2-A. Bytes con campos rellenos */
      let arrayBuffer;
      const pdfProxy = vw.PDFViewerApplication.pdfDocument;

      if (typeof pdfProxy.saveDocument === 'function') {
        arrayBuffer = await pdfProxy.saveDocument();          // ✔ pdf.js ≥3.2
      } else {
        // Fallback universal: usa la API download() que devuelve un Blob
        const blob = await vw.PDFViewerApplication.download();
        arrayBuffer = await blob.arrayBuffer();
      }

      /* 2-B. Aplanar con pdf-lib */
      const pdfDoc   = await PDFLib.PDFDocument.load(arrayBuffer);  // <- aquí estaba el error
      pdfDoc.getForm().flatten();
      const flattenedBytes = await pdfDoc.save({ useObjectStreams: true });
      const blobFinal      = new Blob([flattenedBytes], { type: 'application/pdf' });

      const nombre = `FormularioAfiliacion_${new Date()
                        .toISOString().slice(0,19).replace(/[:T]/g,'_')}.pdf`;

      /* 2-C. Descarga local */
      descargaLocal(blobFinal, nombre);

      /* 2-D. Envío al backend */
      await subirBackend(blobFinal, nombre);

      alert('✅ Formulario descargado y enviado con éxito.');
    } catch (err) {
      console.error(err);
      alert('❌ Error al procesar el formulario.');
    } finally {
      toggleBtn(false);
    }
  });

  /* ─── Utilidades ───────────────────────────────────────────── */
  function toggleBtn(bloquear) {
    btn.textContent = bloquear ? 'Procesando…' : 'Descargar Formulario Lleno';
    btn.disabled = bloquear;
  }

  function descargaLocal(blob, nombre) {
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement('a'), { href:url, download:nombre }).click();
    URL.revokeObjectURL(url);
  }

  async function subirBackend(blob, nombre) {
    const fd = new FormData();
    fd.append('pdf', blob, nombre);
    fd.append('timestamp', new Date().toISOString());

    const res  = await fetch(API_ENDPOINTS.enviarPDFLleno, {
      method : 'POST',
      headers: { 'ngrok-skip-browser-warning': 'true' },
      body   : fd
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Upload failed');
  }

  function camposCompletos(doc) {
    return [...doc.querySelectorAll('input, textarea, select')]
      .every(el => !el.offsetParent || el.type === 'hidden'
                || ['button','submit'].includes(el.type)
                || el.value.trim());
  }
});
