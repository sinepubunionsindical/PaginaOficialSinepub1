// Script para manejar el formulario de afiliación v2
document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadPdf');
    if (!downloadBtn) return;
  
    downloadBtn.addEventListener('click', async () => {
      const iframe = document.getElementById('pdfViewer');
      if (!iframe) return alert('💥 No se encontró el visor PDF.');
  
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  
      /* 1️⃣ Validar campos visibles */
      if (!validarCamposFormulario(iframeDoc)) {
        return alert('⚠️ Completa todos los campos antes de continuar.');
      }
  
      try {
        bloqueaBoton(true);
        alert('✅ Procesando… tu formulario será enviado a las directivas.');
  
        /* 2️⃣ Obtener bytes del PDF original (url del visor) */
        const pdfUrl = iframe.contentWindow.PDFViewerApplication.url;
        const originalBytes = await fetch(pdfUrl).then(r => r.arrayBuffer());
  
        /* 3️⃣ Usar pdf-lib para rellenar y “aplanar” */
        const pdfDoc = await PDFLib.PDFDocument.load(originalBytes, {
          ignoreEncryption: true,
        });
        const form = pdfDoc.getForm();
  
        // Mapeo automático: html name === AcroForm fieldName
        const inputs = iframeDoc.querySelectorAll(
          'input, select, textarea'
        );
  
        inputs.forEach(el => {
          const name = el.name || el.getAttribute('data-element-name');
          if (!name) return;
          const field = form.getFieldMaybe(name);
          if (!field) return;
  
          switch (field.constructor.name) {
            case 'PDFTextField':
              field.setText(el.value);
              break;
            case 'PDFCheckBox':
              el.checked ? field.check() : field.uncheck();
              break;
            case 'PDFDropdown':
            case 'PDFOptionList':
              field.select(el.value);
              break;
            case 'PDFRadioGroup':
              field.select(el.value);
              break;
            default:
              console.warn('Campo no gestionado:', name);
          }
        });
  
        form.flatten();               // 👈 convierte campos en dibujo (no editables)
        const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
  
        /* 4️⃣ Descarga local */
        const fileName = `FormularioAfiliacion_${new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[:T]/g, '_')}.pdf`;
  
        descargarBlob(pdfBlob, fileName);
  
        /* 5️⃣ Envía al backend */
        await subirAlBackend(pdfBlob, fileName);
  
        alert('📨 Formulario enviado con éxito.');
      } catch (e) {
        console.error(e);
        alert('❌ Error al procesar el formulario.');
      } finally {
        bloqueaBoton(false);
      }
    });
  });
  
  /* ----------------- utilidades ----------------- */
  
  function validarCamposFormulario(doc) {
    return [...doc.querySelectorAll('input, textarea, select')].every(c => {
      const visible = c.offsetParent !== null && c.type !== 'hidden';
      return !visible || ['button', 'submit'].includes(c.type) || c.value.trim();
    });
  }
  
  function descargarBlob(blob, nombre) {
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: nombre,
    });
    a.click();
    URL.revokeObjectURL(url);
  }
  
  async function subirAlBackend(blob, nombre) {
    const formData = new FormData();
    formData.append('pdf', blob, nombre);
    formData.append('timestamp', new Date().toISOString());
  
    const res = await fetch(API_ENDPOINTS.enviarPDFLleno, {
      method: 'POST',
      headers: { 'ngrok-skip-browser-warning': 'true' },
      body: formData,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'upload failed');
  }
  
  function bloqueaBoton(bloquear) {
    const b = document.getElementById('downloadPdf');
    b.textContent = bloquear ? 'Procesando…' : 'Descargar Formulario Lleno';
    b.disabled = bloquear;
  }
  