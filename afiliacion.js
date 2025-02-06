import { PDFDocument } from "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.16.0/pdf-lib.min.js";

document.getElementById("formulario-afiliacion").addEventListener("submit", async function (event) {
    event.preventDefault(); // ❌ Evita que la página se recargue
    console.log("Formulario enviado, capturando datos...");

    // Capturar datos del formulario
    let formData = {
        nombre: document.getElementById("nombre_apellidos").value,
        identificacion: document.getElementById("numero_identificacion").value,
        fechaNacimiento: document.getElementById("fecha_nacimiento").value,
        profesion: document.getElementById("profesion_oficio").value,
        telefono: document.getElementById("telefono").value,
        correo: document.getElementById("correo_electronico").value,
        direccion: document.getElementById("direccion_correspondencia").value,
        departamento: document.getElementById("departamento_municipio").value,
        area: document.getElementById("area_institucion").value,
        empleo: document.getElementById("empleo").value,
        fechaAfiliacion: document.getElementById("fecha_afiliacion").value,
        yoNombre: document.getElementById("yo_nombre").value,
        cedulaCiudadania: document.getElementById("cedula_ciudadania").value,
        cedulaExpedida: document.getElementById("cedula_expedida").value,
        empleoAutorizacion: document.getElementById("empleo_autorizacion").value,
    };

    try {
        let response = await fetch("Afiliacion.pdf");
        if (!response.ok) throw new Error("No se pudo cargar el PDF");

        let pdfBytes = await response.arrayBuffer();
        let pdfDoc = await PDFDocument.load(pdfBytes);
        let form = pdfDoc.getForm();

        // Rellenar los campos del PDF
        Object.keys(formData).forEach((key) => {
            if (form.getTextField(key)) {
                form.getTextField(key).setText(formData[key]);
            }
        });

        let pdfBytesModified = await pdfDoc.save();

        // 🚀 Descargar automáticamente el PDF con los datos llenados
        let pdfBlob = new Blob([pdfBytesModified], { type: "application/pdf" });
        let pdfUrl = URL.createObjectURL(pdfBlob);
        let a = document.createElement("a");
        a.href = pdfUrl;
        a.download = `Afiliacion_${formData.nombre}.pdf`;
        a.click();

        // 🚀 Enviar el PDF por EmailJS
        enviarCorreo(formData, pdfBytesModified);

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al procesar el formulario.");
    }
});

// ✅ Función para enviar el formulario y PDF por EmailJS
function enviarCorreo(formData, pdfBytes) {
    emailjs.init("Dsr_zUrOMrG-9X9gh"); // 🔥 Reemplaza con tu Public Key de EmailJS

    let pdfBase64 = btoa(
        new Uint8Array(pdfBytes).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );

    let emailParams = {
        to_email: "sinepubunionsindical@gmail.com",
        subject: `Afiliación - ${formData.nombre} (${formData.identificacion})`,
        message: `
            Nombre: ${formData.nombre}\n
            Número de Identificación: ${formData.identificacion}\n
            Fecha de Nacimiento: ${formData.fechaNacimiento}\n
            Profesión u Oficio: ${formData.profesion}\n
            Teléfono: ${formData.telefono}\n
            Correo Electrónico: ${formData.correo}\n
            Dirección: ${formData.direccion}\n
            Departamento y Municipio: ${formData.departamento}\n
            Área de la Institución: ${formData.area}\n
            Empleo: ${formData.empleo}\n
            Fecha de Afiliación: ${formData.fechaAfiliacion}\n
            ---------------------------\n
            Autorización de Descuento:\n
            Yo, ${formData.yoNombre}, identificado con cédula de ciudadanía número ${formData.cedulaCiudadania}, expedida en ${formData.cedulaExpedida}, autorizo el descuento del 1% de mi salario como aporte sindical en favor de SINEPUB HUV.
        `,
        attachment: pdfBase64
    };

    emailjs.send("service_2ov6wkg", "template_okt0ro7", emailParams)
        .then(() => {
            alert("Formulario enviado correctamente.");
        })
        .catch(error => console.error("Error al enviar correo:", error));
}