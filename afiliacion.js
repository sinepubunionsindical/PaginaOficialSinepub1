/* ───────────────────────── afiliacion.js ─────────────────────────
   • Bloquea UI del visor pdf.js (sin descargas / print / open file)
   • Permite solo llenar campos y pulsar “Descargar Formulario Lleno”
   • El PDF final se APLANA (flatten) ⇒ ya no es interactivo
   • Se descarga localmente y se envía al backend
   ──────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const btn     = document.getElementById('downloadPdf');
  const iframe  = document.getElementById('pdfViewer');

  /* ─── 1. Capar la interfaz del visor ────────────────────────── */
  iframe.addEventListener('load', () => {
    const vw  = iframe.contentWindow;
    const doc = iframe.contentDocument || vw.document;

    /* 1-A  Oculta botones y paneles innecesarios */
    const css = `
      #sidebarContainer, #secondaryToolbar, #download, #openFile,
      #print, #viewBookmark, #viewFind, #presentationMode,
      #viewOutline, #firstPage, #lastPage, #zoomOut, #zoomIn,
      #zoomSelectContainer, .toolbarButtonSpacer {
        display: none !important;
      }
    `;
    const style = doc.createElement('style');
    style.textContent = css;
    doc.head.appendChild(style);

    /* 1-B  Bloquea atajos Ctrl+P / Ctrl+S / Ctrl+O */
    doc.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) &&
          ['p', 's', 'o'].includes(e.key.toLowerCase())) {
        e.preventDefault(); e.stopPropagation();
      }
    }, true);
  });

  /* ─── 2. Click en “Descargar Formulario Lleno” ───────────────── */
  btn.addEventListener('click', async () => {
    try {
      toggleBtn(true);
      alert('⏳ Procesando tu formulario…');

      const vw = iframe.contentWindow;
      await vw.PDFViewerApplication.initializedPromise;

      /* 2-A Validación de campos */
      if (!camposCompletos(vw.document)) {
        toggleBtn(false);
        return alert('⚠️ Por favor, completa todos los campos obligatorios.');
      }

      /* 2-B Obtener bytes con datos rellenados */
      const bytesInteractivo = await vw.PDFViewerApplication
                                       .pdfDocument
                                       .saveDocument();      // Uint8Array

      /* 2-C Aplanar para volverlo NO editable */
      const pdfDoc   = await PDFLib.PDFDocument.load(bytesInteractivo.buffer);
      pdfDoc.getForm().flatten();                            // <- clave
      const pdfBytes = await pdfDoc.save({ useObjectStreams:true });
      const blob     = new Blob([pdfBytes], { type:'application/pdf' });

      const nombre = `FormularioAfiliacion_${new Date()
                      .toISOString().slice(0,19).replace(/[:T]/g,'_')}.pdf`;

      /* 2-D Descarga local y envío backend */
      descargaLocal(blob, nombre);
      await subirBackend(blob, nombre);

      alert('✅ Formulario descargado y enviado con éxito.');
    } catch (err) {
      console.error(err);
      alert('❌ Error al procesar el formulario.');
    } finally {
      toggleBtn(false);
    }
  });

  /* ─── Utilidades ────────────────────────────────────────────── */
  function toggleBtn(bloquear) {
    btn.textContent = bloquear ? 'Procesando…' : 'Descargar Formulario Lleno';
    btn.disabled = bloquear;
  }

  function descargaLocal(blob, nombre) {
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement('a'),
                  { href:url, download:nombre }).click();
    URL.revokeObjectURL(url);
  }

  async function subirBackend(blob, nombre) {
    const fd = new FormData();
    fd.append('pdf', blob, nombre);
    fd.append('timestamp', new Date().toISOString());

    const res  = await fetch(API_ENDPOINTS.enviarPDFLleno, {
      method : 'POST',
      headers: { 'ngrok-skip-browser-warning':'true' },
      body   : fd
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Upload failed');
  }

  function camposCompletos(doc) {
    return [...doc.querySelectorAll('input, textarea, select')]
      .every(el => !el.offsetParent               // no visible
                || el.type === 'hidden'
                || ['button','submit'].includes(el.type)
                || el.value.trim());
  }
});
