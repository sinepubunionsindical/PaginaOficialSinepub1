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
            ubicacion: "Médico del área de Hospitalización Sala de Hemato Oncología - 6° Piso",
            celular: "311 3470591",
            descripcion: `
                <p>Tengo el honor de servir como Vicepresidente de la Organización Sindical SINEPUB HUV. Mi formación médica y mi liderazgo son la base de mi compromiso con nuestra organización, siempre buscando proponer acciones que fortalezcan nuestro propósito y que nos permitan avanzar en las deliberaciones de la Junta Directiva.</p>

                <p>Como vicepresidente, mi prioridad es trabajar en conjunto con cada uno de ustedes para llegar a los acuerdos y resoluciones que sean necesarios para garantizar la buena marcha del Sindicato. Cada acción que propongo tiene como objetivo mantener el liderazgo de nuestra organización, asegurando que sigamos siendo una fuerza firme y unida en la defensa de los derechos de los empleados públicos y trabajadores del Hospital Universitario de Valle.</p>
            `
        },
        tesorera: {
            nombre: "Leidy Cecilia Hernández Acevedo",
            cargo: "Tesorera (E) - Secretaria de Humanización y DDHH",
            foto: "images/junta3.jpg",
            ubicacion: "Área de Hospitalización Unidad de Quemados - 2° Piso",
            celular: "317 5027871",
            descripcion: `
                <p>Mi experiencia y formación me han permitido aportar a la organización sindical una orientación centrada en el manejo adecuado de las relaciones dentro del grupo, con el fin de fomentar un ambiente colectivo incluyente, basado en el respeto y la sana convivencia.</p>

                <p>Busco que trabajemos en unidad, sin divisiones, para que, como Junta Directiva, podamos llegar a consensos que beneficien nuestro trabajo sindical y, en última instancia, los intereses y beneficios de todos nuestros afiliados.</p>
            `
        },
        fiscal: {
            nombre: "Edith Medina Conde",
            cargo: "Fiscal",
            foto: "images/junta4.jpg",
            ubicacion: "CIRENA - 5° Piso",
            celular: "321 5480580",
            descripcion: `
                <p>Tengo el honor de ocupar el cargo de Fiscal en la Organización Sindical SINEPUBHUV. Mi formación y sentido de responsabilidad me han permitido desempeñar esta función con el compromiso de realizar una correcta veeduría sobre el funcionamiento de nuestro sindicato, siempre guiado por el principio de la coherencia.</p>

                <p>En mi rol, me esfuerzo por asegurarme de que las necesidades, los proyectos y las acciones que nuestra organización lleva a cabo estén alineadas con los intereses de nuestros afiliados. Cada decisión y cada acción tomada busca siempre la defensa de los derechos y el bienestar de los empleados públicos y trabajadores del HUV, los cuales forman el corazón de nuestra comunidad sindical.</p>

                <p>Como Fiscal, mi misión es garantizar la transparencia, la legalidad y la justicia en todas las actividades que emprendemos, con el objetivo de fortalecer nuestra organización y consolidar la confianza de todos nuestros miembros. Mi compromiso es ser una garantía imparcial de los valores que nos unen, asegurando que cada paso que demos sea siempre en beneficio de tod@s l@s afiliad@s.</p>
            `
        },
        "secretario-salud-ocupacional": {
            nombre: "Luis Carlos Calderón",
            cargo: "Secretario de Salud Ocupacional",
            foto: "images/junta5.jpg",
            ubicacion: "Consulta Externa – Otorrinolaringología - 3° Piso",
            celular: "320 5966054",
            descripcion: `
                <p>Mi formación y experiencia en el área de salud ocupacional me permiten identificar riesgos potenciales, promover buenas prácticas y garantizar que los afiliados estén protegidos tanto física como mentalmente.</p>

                <p>Como Secretario de Salud Ocupacional, estaré siempre dispuesto a escuchar sus preocupaciones, a trabajar de la mano con las autoridades competentes y a impulsar iniciativas que mejoren nuestra calidad de vida en el trabajo. La prevención y el cuidado son la clave para un entorno laboral sano, y juntos podemos seguir construyendo un futuro más seguro y saludable para todos.</p>
            `
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
            ubicacion: "Área de Hospitalización Sala de Hemato Oncología - 6° Piso",
            celular: "318 8954129",
            descripcion: `
                <p>Es un honor para mí servir como Secretaria General de la Organización Sindical SINEPUBHUV. Mi liderazgo y compromiso me han permitido brindar apoyo en todas las gestiones administrativas de nuestra organización, siempre enfocados en lograr el éxito y el crecimiento continuo de nuestra comunidad sindical.</p>

                <p>Nuestra misión es clara y firme: defender los derechos laborales de nuestros compañeros, garantizar condiciones de trabajo dignas y, por encima de todo, procurar el bienestar de cada uno de ustedes. En este camino, no hay lugar para la complacencia, ya que sabemos que nuestra fuerza radica en la unidad y en la firmeza con que realicemos nuestras acciones.</p>
            `
        },
    };

    function actualizarVistaMiembro(cargo) {
        const miembro = juntaDirectivaData[cargo];
        const miembroInfo = document.querySelector('.miembro-info'); // 🔹 Seleccionar el nuevo contenedor
    
        if (miembro) {
            // 🔹 Ocultar temporalmente la información antes de actualizar
            miembroInfo.classList.remove('show');
    
            setTimeout(() => { // 🔹 Retraso para que la transición sea fluida
                miembroFoto.src = miembro.foto;
                miembroNombre.textContent = miembro.nombre;
                miembroCargo.textContent = miembro.cargo;
                miembroUbicacion.textContent = miembro.ubicacion || "N/D";
                miembroCelular.textContent = miembro.celular || "N/D";
                miembroDescripcion.innerHTML = miembro.descripcion || "Descripción no disponible";
    
                // 🔹 Volver a mostrar con el efecto fade-in
                miembroInfo.classList.add('show');
            }, 300); // 🔹 300ms para suavizar la animación
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