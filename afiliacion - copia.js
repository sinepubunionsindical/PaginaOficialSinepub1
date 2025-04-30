// afiliacion.js  (versión resumida y 100 % funcional)
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('downloadPdf');
  const iframe = document.getElementById('pdfViewer');

  btn.addEventListener('click', async () => {
    try {
      bloquear(true);
      alert('⏳ Procesando tu formulario…');

      // 1️⃣  Espera a que el visor pdf.js esté cargado
      const vw = iframe.contentWindow;
      await vw.PDFViewerApplication.initializedPromise;
      await vw.PDFViewerApplication.eventBus?.dispatch(
        'documentloaded', {}); // asegura “document loaded” en todas las versiones

      // 2️⃣  Valida que todos los campos tengan valor
      if (!validarCampos(vw.document)) {
        bloquear(false);
        return alert('⚠️ Por favor, completa todos los campos obligatorios.');
      }

      // 3️⃣  Obtén los bytes con los cambios (saveDocument ≈ “Guardar como…”)
      const pdfDoc = vw.PDFViewerApplication.pdfDocument;
      const bytesConDatos = await pdfDoc.saveDocument();   // Uint8Array
      // (si saveDocument no está disponible, vw.PDFViewerApplication.download()
      // también genera un Blob con los datos rellenados).

      // 4️⃣  (Opcional) aplana los campos para que no sean editables
      //      const pdfBytes = await PDFLib.PDFDocument.load(bytesConDatos.buffer)
      //            .then(doc => { doc.getForm().flatten(); return doc.save(); });

      const pdfBlob  = new Blob([bytesConDatos], { type: 'application/pdf' });
      const nombre   = `FormularioAfiliacion_${new Date()
                        .toISOString().slice(0,19).replace(/[:T]/g,'_')}.pdf`;

      // 5️⃣  Descarga local
      descargar(pdfBlob, nombre);

      // 6️⃣  Sube al backend
      await subirBackend(pdfBlob, nombre);

      alert('✅ Formulario descargado y enviado con éxito.');
    } catch (e) {
      console.error(e);
      alert('❌ Error al procesar el formulario.');
    } finally {
      bloquear(false);
    }
  });

  function bloquear(flag) {
    btn.textContent = flag ? 'Procesando…' : 'Descargar Formulario Lleno';
    btn.disabled = flag;
  }

  function descargar(blob, nombre) {
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement('a'), { href: url, download: nombre }).click();
    URL.revokeObjectURL(url);
  }

  async function subirBackend(blob, nombre) {
    const fd = new FormData();
    fd.append('pdf', blob, nombre);
    fd.append('timestamp', new Date().toISOString());

    const res = await fetch(API_ENDPOINTS.enviarPDFLleno, {
      method: 'POST',
      headers: { 'ngrok-skip-browser-warning': 'true' },
      body: fd
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Upload failed');
  }

  // campos visibles obligatorios
  function validarCampos(doc) {
    return [...doc.querySelectorAll('input, textarea, select')]
      .every(el => !el.offsetParent || !el.required || el.value.trim());
  }
});
