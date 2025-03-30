        document.addEventListener('DOMContentLoaded', function () {
        const miembroNombre = document.getElementById('miembro-nombre');
        const miembroCargo = document.getElementById('miembro-cargo');
            // Aplicar fade-in al cargar
            document.body.classList.remove('fade-out');
            document.body.classList.add('fade-in'); // Aseguramos que la clase fade-in se aplica correctamente al cargar la página
        
            // Interceptar clics en enlaces para aplicar fade-out
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
    
    // NUEVOS: Para Ubicación, Celular y Descripción
    const listaCargos = document.querySelector('.lista-cargos');
    const miembroFoto = document.getElementById('miembro-foto');
    const miembroUbicacion = document.getElementById('miembro-ubicacion');
    const miembroCelular = document.getElementById('miembro-celular');
    const miembroDescripcion = document.getElementById('miembro-descripcion');
    const miembroInfoContainer = document.querySelector('.miembro-info'); 
    const juntaContainer = document.querySelector('.junta-directiva-container'); 

    // ***** LÍNEA MOVIDA AQUÍ *****
    const cargosListItems = listaCargos.querySelectorAll('li'); 
    // ****************************

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
            ubicacion: "Sala de Médicas Hombres.",
            celular: "3188846015",
            descripcion: `
                <p>Velará por el cumplimiento de la carrera administrativa, promoviendo reuniones con la Comisión de Personal y supervisando la Evaluación del Desempeño Laboral.</p>

                <p>Realizará veeduría en el hospital y participará en comisiones para garantizar transparencia, equidad y eficiencia en la gestión del talento humano.</p>
            `
        },
        "secretaria-reclamos": {
            nombre: "Patricia Salazar Morales",
            cargo: "Secretaria de Reclamos y Solución de Conflictos",
            foto: "images/junta7.jpg",
            ubicacion: "Sala de Médicas Mujeres",
            celular: "3147373069",
            descripcion: `
                <p>Velará por el cumplimiento de la Ley de Acoso Laboral, promoviendo la formación de los afiliados para identificar, prevenir y corregir conductas de agresión u hostigamiento.</p>

                <p>Fomentará el liderazgo consciente y responsable, contribuyendo a una sociedad más justa y democrática.</p>
            `
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
            }, 500); // 🔹 300ms para suavizar la animación
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
    
    // --- NUEVO: Variable para el Select Móvil ---
    let mobileSelectElement = null; 

        // --- Función Crear Dropdown Móvil (EXISTENTE, pero ahora solo se llama condicionalmente) ---
        function createMobileDropdown() {
            // Verificar si ya existe para evitar duplicados en resize (aunque lo manejaremos mejor)
            if (document.getElementById('junta-directiva-select-container')) return; 
    
            const selectContainer = document.createElement('div');
            selectContainer.id = 'junta-directiva-select-container'; 
            selectContainer.classList.add('junta-select-container-mobile'); // Clase clave para CSS
    
            const selectLabel = document.createElement('label');
            selectLabel.htmlFor = 'junta-directiva-select';
            selectLabel.textContent = 'Seleccionar Cargo:';
            selectLabel.classList.add('sr-only');
    
            // Guardar referencia al select creado
            mobileSelectElement = document.createElement('select'); 
            mobileSelectElement.id = 'junta-directiva-select';
            mobileSelectElement.name = 'cargo_junta';
    
            let activeCargoFound = null;
            cargosListItems.forEach(item => {
                const option = document.createElement('option');
                option.value = item.dataset.cargo;
                option.textContent = item.textContent;
                mobileSelectElement.appendChild(option); // Usar la variable
                if (item.classList.contains('active')) {
                    option.selected = true;
                    activeCargoFound = item.dataset.cargo;
                }
            });
    
            if (!activeCargoFound && mobileSelectElement.options.length > 0) {
                 mobileSelectElement.options[0].selected = true;
                 activeCargoFound = mobileSelectElement.options[0].value;
            }
    
            mobileSelectElement.addEventListener('change', function() {
                const cargoSeleccionado = this.value;
                if (cargoSeleccionado) {
                    actualizarVistaMiembro(cargoSeleccionado);
                    syncActiveState(cargoSeleccionado);
                }
            });
    
            selectContainer.appendChild(selectLabel);
            selectContainer.appendChild(mobileSelectElement); // Usar la variable
            
            const vistaDinamica = document.querySelector('.junta-directiva-vista-dinamica');
            if (vistaDinamica) {
                juntaContainer.insertBefore(selectContainer, vistaDinamica);
            } else {
                juntaContainer.appendChild(selectContainer); 
            }
            
            return activeCargoFound; 
        }

        // --- NUEVO: Función para quitar Dropdown Móvil ---
        function removeMobileDropdown() {
        const selectContainer = document.getElementById('junta-directiva-select-container');
        if (selectContainer) {
            selectContainer.remove(); // Eliminar del DOM
            mobileSelectElement = null; // Limpiar referencia
        }
    }

        // --- Función Sincronizar Estado (MODIFICADA para usar la variable mobileSelectElement) ---
        function syncActiveState(activeCargo) {
            // Actualizar lista (siempre)
            cargosListItems.forEach(li => {
                li.classList.toggle('active', li.dataset.cargo === activeCargo);
            });
            // Actualizar select SOLO SI EXISTE
            if (mobileSelectElement) { 
                mobileSelectElement.value = activeCargo;
            }
        }
        
        // --- NUEVO: Función para manejar el layout (Desktop/Mobile) ---
        function handleLayout() {
            const isMobileView = window.innerWidth <= 768; // O tu breakpoint
            const selectContainerExists = !!document.getElementById('junta-directiva-select-container');
    
            if (isMobileView) {
                // Si estamos en móvil y el select NO existe, crearlo
                if (!selectContainerExists) {
                    const initialActive = createMobileDropdown();
                     // Asegurar que la vista se actualice con el valor inicial del select recién creado
                     if(initialActive) {
                         actualizarVistaMiembro(initialActive);
                         syncActiveState(initialActive); // Sincroniza la lista oculta también
                     }
                }
                // Asegurar que la lista esté oculta (CSS se encarga principalmente, pero doble check)
                 if(listaCargos) listaCargos.style.display = 'none';
    
            } else {
                // Si estamos en escritorio y el select SÍ existe, quitarlo
                if (selectContainerExists) {
                    removeMobileDropdown();
                }
                 // Asegurar que la lista esté visible (CSS debe hacerlo, pero JS confirma)
                 if(listaCargos) listaCargos.style.display = ''; // Restablecer display
    
                 // Al volver a escritorio, asegurarse de que el miembro activo en la lista
                 // sea el que se muestra
                 const activeLi = listaCargos.querySelector('li.active');
                 if (activeLi) {
                     actualizarVistaMiembro(activeLi.dataset.cargo);
                 } else if (cargosListItems.length > 0) {
                     // Si ninguno está activo (raro), activar el primero
                     const firstCargo = cargosListItems[0].dataset.cargo;
                     actualizarVistaMiembro(firstCargo);
                     syncActiveState(firstCargo);
                 }
            }
        }

    // --- Inicialización y Listener de Resize ---
    handleLayout(); // Ejecutar al cargar para establecer el estado inicial
    window.addEventListener('resize', handleLayout); // Ejecutar al cambiar tamaño de ventana
});