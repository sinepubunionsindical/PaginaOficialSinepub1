import { PDFDocument } from "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.16.0/pdf-lib.min.js";

document.getElementById("formulario-afiliacion").addEventListener("submit", async function (event) {
    event.preventDefault(); // ❌ Evita que la página se recargue

    console.log("Formulario enviado, capturando datos...");

    // Capturar datos del formulario
    let nombre = document.getElementById("nombre_apellidos").value;
    let identificacion = document.getElementById("numero_identificacion").value;
    let fechaNacimiento = document.getElementById("fecha_nacimiento").value;
    let profesion = document.getElementById("profesion_oficio").value;
    let telefono = document.getElementById("telefono").value;
    let correo = document.getElementById("correo_electronico").value;
    let direccion = document.getElementById("direccion_correspondencia").value;
    let departamento = document.getElementById("departamento_municipio").value;
    let area = document.getElementById("area_institucion").value;
    let empleo = document.getElementById("empleo").value;
    let fechaAfiliacion = document.getElementById("fecha_afiliacion").value;

    let yoNombre = document.getElementById("yo_nombre").value;
    let cedulaCiudadania = document.getElementById("cedula_ciudadania").value;
    let cedulaExpedida = document.getElementById("cedula_expedida").value;
    let empleoAutorizacion = document.getElementById("empleo_autorizacion").value;

    // 🚀 Cargar y modificar el PDF de Afiliación
    try {
        let response = await fetch("Afiliacion.pdf");
        if (!response.ok) throw new Error("No se pudo cargar el PDF");

        let pdfBytes = await response.arrayBuffer();
        let pdfDoc = await PDFDocument.load(pdfBytes);
        let form = pdfDoc.getForm();

        // Rellenar los campos del PDF
        form.getTextField("nombre_apellidos").setText(nombre);
        form.getTextField("numero_identificacion").setText(identificacion);
        form.getTextField("fecha_nacimiento").setText(fechaNacimiento);
        form.getTextField("profesion_oficio").setText(profesion);
        form.getTextField("telefono").setText(telefono);
        form.getTextField("correo_electronico").setText(correo);
        form.getTextField("direccion_correspondencia").setText(direccion);
        form.getTextField("departamento_municipio").setText(departamento);
        form.getTextField("area_institucion").setText(area);
        form.getTextField("empleo").setText(empleo);
        form.getTextField("fecha_afiliacion").setText(fechaAfiliacion);
        form.getTextField("yo_nombre").setText(yoNombre);
        form.getTextField("cedula_ciudadania").setText(cedulaCiudadania);
        form.getTextField("cedula_expedida").setText(cedulaExpedida);
        form.getTextField("empleo_autorizacion").setText(empleoAutorizacion);

        let pdfBytesModified = await pdfDoc.save();

        // 🚀 Crear un Blob para descargar el PDF
        let pdfBlob = new Blob([pdfBytesModified], { type: "application/pdf" });
        let pdfUrl = URL.createObjectURL(pdfBlob);

        // 🚀 Descargar automáticamente el PDF con los datos llenados
        let a = document.createElement("a");
        a.href = pdfUrl;
        a.download = `Afiliacion_${nombre}.pdf`;
        a.click();

        // 🚀 Enviar el PDF por correo
        enviarCorreo(nombre, identificacion, pdfBlob);

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al procesar el formulario.");
    }
});

// ✅ Función para enviar el PDF por correo
function enviarCorreo(nombre, identificacion, pdfBlob) {
    let formData = new FormData();
    formData.append("to", "sinepubhuv@gmail.com");
    formData.append("subject", `Afiliación - ${nombre} (${identificacion})`);
    formData.append("message", `
        Nombre: ${nombre}\n
        Número de Identificación: ${identificacion}\n
        Fecha de Nacimiento: ${fechaNacimiento}\n
        Profesión u Oficio: ${profesion}\n
        Teléfono: ${telefono}\n
        Correo Electrónico: ${correo}\n
        Dirección: ${direccion}\n
        Departamento y Municipio: ${departamento}\n
        Área de la Institución: ${area}\n
        Empleo: ${empleo}\n
        Fecha de Afiliación: ${fechaAfiliacion}\n
        ---------------------------\n
        Autorización de Descuento:\n
        Yo, ${yoNombre}, identificado con cédula de ciudadanía número ${cedulaCiudadania}, expedida en ${cedulaExpedida}, autorizo el descuento del 1% de mi salario como aporte sindical en favor de SINEPUB HUV.
    `);
    formData.append("attachment", pdfBlob, `Afiliacion_${nombre}.pdf`);

    fetch("https://tu-servidor.com/enviar-correo", {
        method: "POST",
        body: formData
    }).then(response => {
        if (response.ok) {
            alert("Formulario enviado correctamente.");
        } else {
            alert("Error al enviar el formulario.");
        }
    }).catch(error => console.error("Error:", error));
}
