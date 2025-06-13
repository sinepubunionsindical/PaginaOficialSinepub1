document.addEventListener('DOMContentLoaded', function () { // INICIO DOMContentLoaded

    // --- SELECCIÓN DE ELEMENTOS ---
    // Seleccionamos elementos esenciales DESPUÉS de que el DOM esté listo
    const listaCargosSource = document.querySelector('.lista-cargos'); // Usado solo para obtener datos iniciales
    const miembroFoto = document.getElementById('miembro-foto');
    const miembroNombre = document.getElementById('miembro-nombre');
    const miembroCargo = document.getElementById('miembro-cargo');
    const miembroDescripcion = document.getElementById('miembro-descripcion');
    const miembroInfoContainer = document.querySelector('.miembro-info'); 
    const juntaContainer = document.querySelector('.junta-directiva-container'); 

    // --- VERIFICACIÓN CRÍTICA ---
    if (!listaCargosSource || !miembroFoto || !miembroNombre || !miembroCargo || !miembroDescripcion || !miembroInfoContainer || !juntaContainer) {
        console.error("Error Crítico: Faltan elementos HTML esenciales para la Junta Directiva.");
        return; 
    }
    
    // Obtener los datos de los LI una sola vez para poblar el select
    const cargosListItemsData = Array.from(listaCargosSource.querySelectorAll('li')).map(li => ({
        value: li.dataset.cargo,
        text: li.textContent,
        isActive: li.classList.contains('active') // Guardar si estaba activo originalmente
    }));

    // --- LÓGICA FADE IN / FADE OUT (Sin cambios) ---
    document.body.classList.remove('fade-out');
    document.body.classList.add('fade-in'); 
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Verifica si es un enlace interno, no un ancla (#) y no abre en nueva pestaña
            const isInternal = href && !href.startsWith('#') && !link.hasAttribute('target');
  
            if (isInternal) {
                e.preventDefault(); // Prevenir navegación inmediata
                document.body.classList.remove('fade-in');
                document.body.classList.add('fade-out');
                
                // Usamos 'transitionend' para asegurarnos de que la transición haya terminado antes de navegar
                document.body.addEventListener('transitionend', function onTransitionEnd() {
                    // Eliminar el listener para evitar múltiples invocaciones
                    document.body.removeEventListener('transitionend', onTransitionEnd);
                    
                    // Ahora podemos hacer la navegación después de que termine la transición
                    setTimeout(() => {
                        window.location.href = href;
                    }, 600); // tiempo del fade (asegurarse de que coincida con la duración del fade-out en CSS)
                });
      // NOTA: La llamada a initSlider() estaba DENTRO del listener de click,
      // lo cual no tiene sentido. Se movió fuera del forEach pero dentro del DOMContentLoaded.
  }
});
});

    // Datos de la Junta Directiva con campos extra
    const juntaDirectivaData = {
        presidente: {
            nombre: "Jenny Patricia Ricaurte Zuluaga",
            cargo: "Presidente",
            foto: "images/junta1.jpg",
            descripcion: `
                <p>Como líder sindical y representante legal de SINEPUB HUV, mi compromiso es brindar siempre asesoramiento y orientación de manera clara y coherente, priorizando en todo momento el bienestar y la defensa de los derechos de los empleados públicos y trabajadores que representan.</p>

                <p>Nuestra organización juega un papel clave en mantener una comunicación abierta y constante con la administración, los servicios del HUV, los entes de control y las instituciones estatales. A través del diálogo y la negociación, trabajamos dentro de los límites establecidos por la ley y los acuerdos colectivos, siempre aplicando el principio de la prevalencia de la realidad sobre las formalidades, tal como lo establecen las relaciones laborales.</p>
            `
        },
        vicepresidente: {
            nombre: "Luis Fernando Van Pacheco Agredo",
            cargo: "Vicepresidente",
            foto: "images/junta2.jpg",
            descripcion: `
                <p>Tengo el honor de servir como Vicepresidente de la Organización Sindical SINEPUB HUV. Mi formación médica y mi liderazgo son la base de mi compromiso con nuestra organización, siempre buscando proponer acciones que fortalezcan nuestro propósito y que nos permitan avanzar en las deliberaciones de la Junta Directiva.</p>

                <p>Como vicepresidente, mi prioridad es trabajar en conjunto con cada uno de ustedes para llegar a los acuerdos y resoluciones que sean necesarios para garantizar la buena marcha del Sindicato. Cada acción que propongo tiene como objetivo mantener el liderazgo de nuestra organización, asegurando que sigamos siendo una fuerza firme y unida en la defensa de los derechos de los empleados públicos y trabajadores del Hospital Universitario de Valle.</p>
            `
        },
        tesorera: {
            nombre: "Leidy Cecilia Hernández Acevedo",
            cargo: "Tesorera (E) - Secretaria de Humanización y DDHH",
            foto: "images/junta3.jpg",
            descripcion: `
                <p>Mi experiencia y formación me han permitido aportar a la organización sindical una orientación centrada en el manejo adecuado de las relaciones dentro del grupo, con el fin de fomentar un ambiente colectivo incluyente, basado en el respeto y la sana convivencia.</p>

                <p>Busco que trabajemos en unidad, sin divisiones, para que, como Junta Directiva, podamos llegar a consensos que beneficien nuestro trabajo sindical y, en última instancia, los intereses y beneficios de todos nuestros afiliados.</p>
            `
        },
        fiscal: {
            nombre: "Edith Medina Conde",
            cargo: "Fiscal",
            foto: "images/junta4.jpg",
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
            descripcion: `
                <p>Mi formación y experiencia en el área de salud ocupacional me permiten identificar riesgos potenciales, promover buenas prácticas y garantizar que los afiliados estén protegidos tanto física como mentalmente.</p>

                <p>Como Secretario de Salud Ocupacional, estaré siempre dispuesto a escuchar sus preocupaciones, a trabajar de la mano con las autoridades competentes y a impulsar iniciativas que mejoren nuestra calidad de vida en el trabajo. La prevención y el cuidado son la clave para un entorno laboral sano, y juntos podemos seguir construyendo un futuro más seguro y saludable para todos.</p>
            `
        },
        "secretaria-carrera-administrativa": {
            nombre: "Martha Cecilia Solarte Caicedo",
            cargo: "Secretaria de Carrera Administrativa",
            foto: "images/junta6.jpg",
            descripcion: `
                <p>Velará por el cumplimiento de la carrera administrativa, promoviendo reuniones con la Comisión de Personal y supervisando la Evaluación del Desempeño Laboral.</p>

                <p>Realizará veeduría en el hospital y participará en comisiones para garantizar transparencia, equidad y eficiencia en la gestión del talento humano.</p>
            `
        },
        "secretaria-reclamos": {
            nombre: "Patricia Salazar Morales",
            cargo: "Secretaria de Reclamos y Solución de Conflictos",
            foto: "images/junta7.jpg",
            descripcion: `
                <p>Velará por el cumplimiento de la Ley de Acoso Laboral, promoviendo la formación de los afiliados para identificar, prevenir y corregir conductas de agresión u hostigamiento.</p>

                <p>Fomentará el liderazgo consciente y responsable, contribuyendo a una sociedad más justa y democrática.</p>
            `
        },
        "secretaria-general": {
            nombre: "Leydy Yohana González Ulabarry",
            cargo: "Secretaria General",
            foto: "images/junta8.jpg",
            descripcion: `
                <p>Es un honor para mí servir como Secretaria General de la Organización Sindical SINEPUBHUV. Mi liderazgo y compromiso me han permitido brindar apoyo en todas las gestiones administrativas de nuestra organización, siempre enfocados en lograr el éxito y el crecimiento continuo de nuestra comunidad sindical.</p>

                <p>Nuestra misión es clara y firme: defender los derechos laborales de nuestros compañeros, garantizar condiciones de trabajo dignas y, por encima de todo, procurar el bienestar de cada uno de ustedes. En este camino, no hay lugar para la complacencia, ya que sabemos que nuestra fuerza radica en la unidad y en la firmeza con que realicemos nuestras acciones.</p>
            `
        },
    };

    // --- FUNCIÓN ACTUALIZAR VISTA MIEMBRO (Sin cambios) ---
    function actualizarVistaMiembro(cargo) {
        const miembro = juntaDirectivaData[cargo];
        if (!miembroInfoContainer) return; 
        miembroInfoContainer.classList.remove('show');
        setTimeout(() => { 
            if (miembro) {
                miembroFoto.src = miembro.foto;
                miembroNombre.textContent = miembro.nombre;
                miembroCargo.textContent = miembro.cargo;
                miembroDescripcion.innerHTML = miembro.descripcion || "<p>Descripción no disponible.</p>";
            } else {
                miembroFoto.src = "images/placeholder-miembro.jpg";
                miembroNombre.textContent = "Selecciona un cargo";
                miembroCargo.textContent = "";
                miembroDescripcion.innerHTML = ""; 
            }
            miembroInfoContainer.classList.add('show');
        }, 300); 
    }
    
    // --- FUNCIÓN PARA CREAR Y CONFIGURAR EL SELECT ---
    function setupMemberSelector() {
        // Verificar si ya existe (por si acaso)
        if (document.getElementById('junta-directiva-select-container')) return; 

        // Crear contenedor y select
        const selectContainer = document.createElement('div');
        selectContainer.id = 'junta-directiva-select-container'; 
        selectContainer.classList.add('junta-select-container'); // Clase más genérica

        const selectLabel = document.createElement('label');
        selectLabel.htmlFor = 'junta-directiva-select';
        selectLabel.textContent = 'Seleccionar Cargo Sindical:';
        selectLabel.classList.add('sr-only'); // Oculto visualmente

        const selectElement = document.createElement('select'); 
        selectElement.id = 'junta-directiva-select';
        selectElement.name = 'cargo_junta';

        let initialActiveCargo = null;

        // Poblar con opciones usando los datos extraídos
        cargosListItemsData.forEach(itemData => { 
            const option = document.createElement('option');
            option.value = itemData.value;
            option.textContent = itemData.text;
            selectElement.appendChild(option); 
            // Marcar como seleccionado si era el activo original
            if (itemData.isActive) {
                option.selected = true;
                initialActiveCargo = itemData.value;
            }
        });

        // Si ningún item original era activo, seleccionar el primero
        if (!initialActiveCargo && selectElement.options.length > 0) {
             selectElement.options[0].selected = true;
             initialActiveCargo = selectElement.options[0].value;
        }

        // Añadir listener para actualizar la vista cuando cambia el select
        selectElement.addEventListener('change', function() {
            actualizarVistaMiembro(this.value);
            // Ya no se necesita syncActiveState porque no hay lista visible que sincronizar
        });

        // Ensamblar y añadir al DOM
        selectContainer.appendChild(selectLabel);
        selectContainer.appendChild(selectElement); 
        
        // Insertar ANTES de la vista dinámica
        const vistaDinamica = document.querySelector('.junta-directiva-vista-dinamica');
        if (juntaContainer && vistaDinamica) { 
            juntaContainer.insertBefore(selectContainer, vistaDinamica);
        } else if (juntaContainer) {
            console.warn("Vista dinámica no encontrada, añadiendo select al final.");
            juntaContainer.appendChild(selectContainer); 
        }
        
        // Devolver el cargo inicial para mostrarlo
        return initialActiveCargo; 
    }

    // --- INICIALIZACIÓN ---
    // 1. Configurar el selector dropdown
    const cargoInicial = setupMemberSelector(); 
    
    // 2. Mostrar la información del miembro inicial seleccionado
    if (cargoInicial) {
        actualizarVistaMiembro(cargoInicial);
    } else {
        // Fallback si algo falló en la creación o no había opciones
        actualizarVistaMiembro(null); // Mostrar placeholders
    }

    // Ya NO necesitamos handleLayout ni el listener de resize para esto

}); // <-- FIN DEL DOMContentLoaded