document.addEventListener('DOMContentLoaded', function() {
    const listaCargos = document.querySelector('.lista-cargos');
    const miembroFoto = document.getElementById('miembro-foto');
    const miembroNombre = document.getElementById('miembro-nombre');
    const miembroCargo = document.getElementById('miembro-cargo');

    // NUEVOS: Para Ubicación, Celular y Descripción
    const miembroUbicacion = document.getElementById('miembro-ubicacion');
    const miembroCelular = document.getElementById('miembro-celular');
    const miembroDescripcion = document.getElementById('miembro-descripcion');

    const cargosListItems = listaCargos.querySelectorAll('li');

    // Datos de la Junta Directiva con campos extra
    const juntaDirectivaData = {
        presidente: {
            nombre: "Jenny Patricia Ricaurte Zuluaga",
            cargo: "Presidente",
            foto: "images/junta1.jpg",
            ubicacion: "CIAU primer piso",
            celular: "3163218579",
            descripcion: `
                <p>Como líder sindical y representante legal de SINEPUB HUV, mi compromiso es brindar siempre asesoramiento y orientación de manera clara y coherente, priorizando en todo momento el bienestar y la defensa de los derechos de los empleados públicos y trabajadores que representan.</p>

                <p>Nuestra organización juega un papel clave en mantener una comunicación abierta y constante con la administración, los servicios del HUV, los entes de control y las instituciones estatales. A través del diálogo y la negociación, trabajamos dentro de los límites establecidos por la ley y los acuerdos colectivos, siempre aplicando el principio de la prevalencia de la realidad sobre las formalidades, tal como lo establecen las relaciones laborales.</p>
            `
        },
        vicepresidente: {
            nombre: "Luis Fernando Van Pacheco Agredo",
            cargo: "Vicepresidente",
            foto: "images/junta2.jpg",
            ubicacion: "Pendiente",
            celular: "Pendiente",
            descripcion: "Información en proceso de actualización."
        },
        tesorera: {
            nombre: "Leidy Cecilia Hernández Acevedo",
            cargo: "Tesorera (E) - Secret. Humanización y DDHH",
            foto: "images/junta3.jpg",
            ubicacion: "Pendiente",
            celular: "Pendiente",
            descripcion: "Información en proceso de actualización."
        },
        fiscal: {
            nombre: "Edith Medina Conde",
            cargo: "Fiscal",
            foto: "images/junta4.jpg",
            ubicacion: "Pendiente",
            celular: "Pendiente",
            descripcion: "Información en proceso de actualización."
        },
        "secretario-salud-ocupacional": {
            nombre: "Luis Carlos Calderón",
            cargo: "Secretario Salud Ocupacional",
            foto: "images/junta5.jpg",
            ubicacion: "Pendiente",
            celular: "Pendiente",
            descripcion: "Información en proceso de actualización."
        },
        "secretaria-carrera-administrativa": {
            nombre: "Martha Cecilia Solarte Caicedo",
            cargo: "Secretaria de Carrera Administrativa",
            foto: "images/junta6.jpg",
            ubicacion: "Pendiente",
            celular: "Pendiente",
            descripcion: "Información en proceso de actualización."
        },
        "secretaria-reclamos": {
            nombre: "Patricia Salazar Morales",
            cargo: "Secretaria de Reclamos y Solución de Conflictos",
            foto: "images/junta7.jpg",
            ubicacion: "Pendiente",
            celular: "Pendiente",
            descripcion: "Información en proceso de actualización."
        },
        "secretaria-general": {
            nombre: "Leydy Yohana González Ulabarry",
            cargo: "Secretaria General",
            foto: "images/junta8.jpg",
            ubicacion: "Pendiente",
            celular: "Pendiente",
            descripcion: "Información en proceso de actualización."
        },
    };

    // Función para actualizar la vista dinámica con la información del miembro
    function actualizarVistaMiembro(cargo) {
        const miembro = juntaDirectivaData[cargo];
        if (miembro) {
            miembroFoto.src = miembro.foto;
            miembroNombre.textContent = miembro.nombre;
            miembroCargo.textContent = miembro.cargo;

            // NUEVO: mostrar ubicación, celular y descripción
            miembroUbicacion.textContent = miembro.ubicacion || "N/D";
            miembroCelular.textContent = miembro.celular || "N/D";
            // Usamos innerHTML para respetar los <p> y formato del texto
            miembroDescripcion.innerHTML = miembro.descripcion || "Descripción no disponible";
        } else {
            // Si no se encuentra información para el cargo, mostrar placeholders
            miembroFoto.src = "images/placeholder-miembro.jpg";
            miembroNombre.textContent = "Información no disponible";
            miembroCargo.textContent = "Cargo no encontrado";
            miembroUbicacion.textContent = "N/D";
            miembroCelular.textContent = "N/D";
            miembroDescripcion.textContent = "Descripción no disponible";
        }
    }

    // Event listeners para cada item de la lista de cargos
    cargosListItems.forEach(item => {
        item.addEventListener('click', function() {
            const cargoSeleccionado = this.dataset.cargo; // Obtener el cargo del atributo data-cargo
            actualizarVistaMiembro(cargoSeleccionado); // Actualizar la vista dinámica con la información del cargo
            
            // Remover la clase 'active' de todos los items y activarla solo en el item clickeado
            cargosListItems.forEach(li => li.classList.remove('active'));
            this.classList.add('active'); // Añadir clase 'active' al item clickeado
        });
    });

    // Mostrar la información del primer cargo por defecto al cargar la página (Presidente)
    actualizarVistaMiembro('presidente');
    cargosListItems[0].classList.add('active'); // Activar el primer item (Presidente) inicialmente
});