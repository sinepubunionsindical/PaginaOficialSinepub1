import { PDFDocument } from "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.16.0/pdf-lib.min.js";

document.getElementById("formulario-afiliacion").addEventListener("submit", async function (event) {
    event.preventDefault(); // ❌ Evita que la página se recargue
    console.log("Formulario enviado, capturando datos...");

    // Capturar datos del formulario con nombres EXACTOS del PDF
    let formData = {
        nombre_apellidos: document.getElementById("nombre_apellidos").value,
        numero_identificacion: document.getElementById("numero_identificacion").value,
        fecha_nacimiento: document.getElementById("fecha_nacimiento").value,
        profesion_oficio: document.getElementById("profesion_oficio").value,
        telefono: document.getElementById("telefono").value,
        correo_electronico: document.getElementById("correo_electronico").value,
        direccion_correspondencia: document.getElementById("direccion_correspondencia").value,
        departamento_municipio: document.getElementById("departamento_municipio").value,
        area_institucion: document.getElementById("area_institucion").value,
        empleo: document.getElementById("empleo").value,
        fecha_afiliacion: document.getElementById("fecha_afiliacion").value,
        yo_nombre: document.getElementById("yo_nombre").value,
        cedula_ciudadania: document.getElementById("cedula_ciudadania").value,
        cedula_expedida: document.getElementById("cedula_expedida").value,
        empleo_autorizacion: document.getElementById("empleo_autorizacion").value,
    };

    try {
        let response = await fetch("Afiliacion.pdf");
        if (!response.ok) throw new Error("No se pudo cargar el PDF");

        let pdfBytes = await response.arrayBuffer();
        let pdfDoc = await PDFDocument.load(pdfBytes);
        let form = pdfDoc.getForm();

        // Rellenar los campos del PDF validando que existan
        Object.keys(formData).forEach((key) => {
            let field = form.getTextField(key);
            if (field) {
                field.setText(formData[key] || "");
            }
        });

        // Guardar el PDF modificado
        let pdfBytesModified = await pdfDoc.save();
        let pdfBlob = new Blob([pdfBytesModified], { type: "application/pdf" });
        let pdfUrl = URL.createObjectURL(pdfBlob);
        
        // 🚀 Descargar automáticamente el PDF
        let a = document.createElement("a");
        a.href = pdfUrl;
        a.download = `Afiliacion_${formData.nombre_apellidos}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        console.log("PDF generado y descargado correctamente.");
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        alert("Hubo un problema al procesar el formulario.");
    }
});