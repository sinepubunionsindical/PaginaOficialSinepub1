// JavaScript para la página de publicidad (Versión Fusionada - Base: CORREGIDO ENVÍO + Slider Funcional)

document.addEventListener('DOMContentLoaded', function() {
    // --- Elementos del DOM (Combinados y verificados) ---
    const backendApiUrl = window.API_ENDPOINTS?.publicidad; // URL para cargar/enviar anuncios
    // ¡IMPORTANTE! La URL para 'like' probablemente sea diferente (ej: window.API_ENDPOINTS?.like)
    // La función darLike actual usa backendApiUrl y fallará o necesitará ajuste.

    if (!backendApiUrl) {
        console.error("❌ Error crítico: window.API_ENDPOINTS.publicidad no está definido. Verifica config.js.");
        alert("Error de configuración. No se puede comunicar con el backend para cargar/registrar anuncios.");
        // Deshabilitar funcionalidad que dependa del backend aquí si es necesario
    }

    const registrarBtn = document.getElementById('registrar-publicidad');
    const cancelarBtn = document.getElementById('cancelar-registro'); // Para cerrar modal
    const formularioContainer = document.getElementById('formulario-container'); // Contenedor modal
    const formulario = document.getElementById('formulario-publicidad'); // Formulario en sí
    const anunciosContainer = document.querySelector('.anuncios-container'); // Donde se muestran los anuncios
    const modalCerrarBtn = document.getElementById('btn-cerrar'); // Botón 'X' del modal (si existe)

    // --- Elementos del Slider (Verificados) ---
    const slides = document.querySelectorAll('.slide');
    const navLinks = document.querySelectorAll('.slider-nav a'); // Enlaces de navegación (ej: 1, 2, 3)
    const prevButton = document.querySelector('.prev-slide'); // Botón Anterior
    const nextButton = document.querySelector('.next-slide'); // Botón Siguiente

    // Variable para mantener el índice del slide actual
    let currentSlide = 0;

    // Ocultar formulario modal al inicio
    if (formularioContainer) {
        formularioContainer.style.display = 'none';
    } else {
        console.warn("⚠️ Contenedor del formulario ('formulario-container') no encontrado.");
    }

    // --- Funciones de Autenticación y Modal (Base: Versión 1 - Corregida) ---

    // Verificar si el usuario está autenticado (localStorage) y configurar botón registro
    function configurarBotonRegistro() {
        const registrarBtn = document.getElementById('registrar-publicidad');
        if (registrarBtn) {
            const isUserAuth = localStorage.getItem("afiliado") === "yes";
            const isProfileComplete = localStorage.getItem("perfil_completo") === "true";
            console.log("🔧 configurarBotonRegistro: Verificando estado (localStorage):");
            console.log(`   - afiliado: ${localStorage.getItem("afiliado")}, perfil_completo: ${localStorage.getItem("perfil_completo")}`);
            // Considerar si 'cedula' es un requisito estricto adicional
            // const hasCedula = localStorage.getItem("cedula") !== null;
            const isAuthenticated = isUserAuth || isProfileComplete; // Lógica mantenida de v1

            // Limpiar listeners previos para evitar duplicados
            registrarBtn.removeEventListener('click', mostrarFormularioRegistro);
            registrarBtn.removeEventListener('click', mostrarMensajeAutenticacion);

            if (!isAuthenticated) {
                registrarBtn.classList.add('boton-deshabilitado');
                registrarBtn.disabled = true;
                registrarBtn.title = "Debes ser afiliado al sindicato para registrar publicidad";
                registrarBtn.innerHTML = "Registrar Publicidad (Solo Afiliados)";
                registrarBtn.addEventListener('click', mostrarMensajeAutenticacion); // Asigna listener de alerta
                console.log("🔒 Botón de registro deshabilitado (localStorage).");
            } else {
                registrarBtn.classList.remove('boton-deshabilitado');
                registrarBtn.disabled = false;
                registrarBtn.innerHTML = "Registrar Publicidad";
                registrarBtn.title = ""; // Limpiar tooltip
                registrarBtn.addEventListener('click', mostrarFormularioRegistro); // Asigna listener de mostrar form
                console.log("🔓 Botón de registro habilitado (localStorage).");
            }
        } else {
            console.error("❌ Botón de registro ('registrar-publicidad') no encontrado.");
        }
    }

    // Muestra el modal del formulario
    function mostrarFormularioRegistro(e) {
        e.preventDefault(); // Prevenir comportamiento por defecto del botón/enlace
        console.log("📝 Mostrando formulario modal...");
        if (formularioContainer) {
            limpiarFormulario(); // Limpiar antes de mostrar
            configurarBotonesEmail(); // Reconfigurar botones de email cada vez que se abre
            formularioContainer.style.display = 'block'; // Mostrar el modal
        } else {
            console.error("❌ Contenedor del formulario ('formulario-container') no encontrado al intentar mostrar.");
        }
    }

    // Muestra alerta si se intenta registrar sin ser afiliado/perfil completo
    function mostrarMensajeAutenticacion(e) {
        e.preventDefault();
        console.log("⚠️ Intento de registro sin autenticación (localStorage).");
        alert("Debes ser afiliado al sindicato para registrar publicidad. Por favor, accede desde la página principal o completa tu perfil.");
        return false;
    }

    // Cierra el modal del formulario
    function cerrarModalFormulario() {
        if (formularioContainer) {
            formularioContainer.style.display = 'none';
        }
    }

    // Configura los listeners para cerrar el modal (Botón X y Cancelar)
    function setupModalCloseListeners() {
        if (modalCerrarBtn) {
            modalCerrarBtn.addEventListener('click', cerrarModalFormulario);
        } else {
             console.warn("⚠️ Botón de cierre del modal ('btn-cerrar') no encontrado.");
        }
        if (cancelarBtn) {
            cancelarBtn.addEventListener('click', cerrarModalFormulario);
        } else {
            console.warn("⚠️ Botón de cancelar registro ('cancelar-registro') no encontrado.");
        }
        // Opcional: cerrar al hacer clic fuera del modal
        // window.addEventListener('click', (event) => {
        //     if (event.target === formularioContainer) {
        //         cerrarModalFormulario();
        //     }
        // });
    }


    // --- Funciones del Slider (Base: Versión 1 - Funcionalidad Confirmada) ---

    /**
     * Actualiza el slide visible y los indicadores de navegación.
     * @param {number} slideIndex - El índice del slide a mostrar (0-based).
     */
    function updateSlide(slideIndex) {
        if (slides.length === 0) {
            console.warn("⚠️ No se encontraron elementos '.slide' para el slider.");
            return;
        }

        // Asegurar que el índice esté dentro de los límites [0, slides.length - 1]
        // Forma concisa usando módulo:
        currentSlide = (slideIndex + slides.length) % slides.length;
        // Forma explícita:
        // if (slideIndex < 0) {
        //     currentSlide = slides.length - 1;
        // } else if (slideIndex >= slides.length) {
        //     currentSlide = 0;
        // } else {
        //     currentSlide = slideIndex;
        // }
        console.log(`🔄 Actualizando al slide índice: ${currentSlide}`);

        // Ocultar todos los slides y mostrar solo el activo
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Actualizar los enlaces/puntos de navegación
        updateNavLinks(currentSlide);
        updateSliderDots(); // Aunque esté vacía, la llamamos por si se implementa en el futuro
    }

    /**
     * Actualiza el estado visual (clase 'active') de los enlaces de navegación del slider.
     * @param {number} activeIndex - El índice del slide actualmente activo (0-based).
     */
    function updateNavLinks(activeIndex) {
        if (navLinks.length === 0) return; // No hacer nada si no hay enlaces

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Los data-slide suelen ser 1-based, comparamos con activeIndex + 1
            const slideNumber = parseInt(link.getAttribute('data-slide'));
            if (slideNumber === activeIndex + 1) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Configura los event listeners para la navegación del slider (botones prev/next y enlaces).
     */
    function setupSliderNavListeners() {
        // Configurar los enlaces de navegación (ej: 1, 2, 3)
        navLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const slideIndex = parseInt(this.getAttribute('data-slide')) - 1; // Convertir a 0-based
                if (!isNaN(slideIndex)) {
                    updateSlide(slideIndex);
                }
            });
        });

        // Configurar los botones de navegación prev/next
        if (prevButton) {
            prevButton.addEventListener('click', function(event) {
                event.preventDefault(); // Prevenir si son enlaces <a>
                updateSlide(currentSlide - 1);
            });
        } else {
             console.warn("⚠️ Botón 'prev-slide' no encontrado.");
        }

        if (nextButton) {
            nextButton.addEventListener('click', function(event) {
                event.preventDefault(); // Prevenir si son enlaces <a>
                updateSlide(currentSlide + 1);
            });
        } else {
             console.warn("⚠️ Botón 'next-slide' no encontrado.");
        }
    }

    /**
     * Actualiza los puntos/dots de navegación del slider (si existieran).
     * Esta función se mantiene vacía si los dots están ocultos o no implementados.
     * Si se añaden dots en HTML/CSS, aquí iría la lógica para marcar el activo.
     */
    function updateSliderDots() {
        // console.log("⚪ updateSliderDots: No implementado (dots ocultos/inexistentes).");
        // Ejemplo si hubiera dots:
        // const dots = document.querySelectorAll('.slider-dot');
        // if (dots.length > 0) {
        //     dots.forEach((dot, index) => {
        //         dot.classList.toggle('active', index === currentSlide);
        //     });
        // }
        return; // No hacer nada por ahora
    }


    // --- Funciones del Formulario (Base: Versión 1 - CORREGIDO ENVÍO) ---

    // Configura la lógica de los botones para usar email del perfil o uno diferente
    function configurarBotonesEmail() {
        const btnEmailPerfil = document.getElementById('usar-email-perfil');
        const btnEmailDiferente = document.getElementById('usar-email-diferente');
        const emailInput = document.getElementById('email');

        if (btnEmailPerfil && btnEmailDiferente && emailInput) {
            const emailGuardado = localStorage.getItem("email");

            // Limpiar listeners previos clonando y reemplazando los botones
            // Esto es importante si la función se llama múltiples veces (ej, al abrir modal)
            const newBtnEmailPerfil = btnEmailPerfil.cloneNode(true);
            const newBtnEmailDiferente = btnEmailDiferente.cloneNode(true);
            btnEmailPerfil.parentNode.replaceChild(newBtnEmailPerfil, btnEmailPerfil);
            btnEmailDiferente.parentNode.replaceChild(newBtnEmailDiferente, btnEmailDiferente);

            // Lógica inicial de visibilidad y valor
            if (emailGuardado) {
                emailInput.value = emailGuardado;
                emailInput.readOnly = false; // Permitir editar por si acaso
                newBtnEmailDiferente.style.display = 'inline-block'; // Mostrar "Usar otro"
                newBtnEmailPerfil.style.display = 'none'; // Ocultar "Usar perfil" (ya está puesto)
            } else {
                emailInput.value = '';
                emailInput.readOnly = false;
                newBtnEmailDiferente.style.display = 'none'; // Ocultar "Usar otro"
                newBtnEmailPerfil.style.display = 'none'; // Ocultar "Usar perfil" (no hay)
            }

            // Añadir listeners a los NUEVOS botones
            newBtnEmailPerfil.addEventListener('click', function() {
                const emailPerfil = localStorage.getItem("email");
                if (emailPerfil) {
                    emailInput.value = emailPerfil;
                    newBtnEmailDiferente.style.display = 'inline-block';
                    newBtnEmailPerfil.style.display = 'none';
                } else {
                    alert("No tienes un email guardado en tu perfil. Por favor, actualiza tu perfil primero.");
                    emailInput.focus();
                }
            });

            newBtnEmailDiferente.addEventListener('click', function() {
                emailInput.value = '';
                emailInput.readOnly = false;
                emailInput.focus();
                // Mostrar "Usar perfil" solo si existe un email guardado
                newBtnEmailPerfil.style.display = localStorage.getItem("email") ? 'inline-block' : 'none';
                newBtnEmailDiferente.style.display = 'none';
            });
        } else {
             console.warn("⚠️ No se encontraron todos los elementos para configurar botones de email (usar-email-perfil, usar-email-diferente, email).");
        }
    }

    /**
     * Limpia los campos del formulario y la vista previa de la imagen.
     */
    function limpiarFormulario() {
        const formToReset = document.getElementById('formulario-publicidad');
        if (formToReset) {
            formToReset.reset(); // Resetea campos a sus valores por defecto HTML
            // Limpiar específicamente campos que reset() podría no vaciar bien
            const emailInput = document.getElementById('email');
            const telefonoInput = document.getElementById('telefono');
            if(emailInput) emailInput.value = '';
            if(telefonoInput) telefonoInput.value = '';

            // Limpiar la vista previa de la imagen (si existe)
            const previewContainer = document.getElementById('imagen-preview-container');
            const placeholder = document.querySelector('.imagen-placeholder'); // Asumiendo que existe
            if (previewContainer) previewContainer.innerHTML = ''; // Limpiar contenedor
            if (placeholder) placeholder.style.display = 'block'; // Mostrar placeholder de nuevo
             // Resetear también el input file mismo
            const imagenInput = document.getElementById('imagen');
            if (imagenInput) imagenInput.value = null;

             console.log("🧹 Formulario limpiado.");
             // Reconfigurar botones de email por si el localStorage cambió mientras estaba abierto
             // configurarBotonesEmail(); // Opcional, depende de si quieres que se actualice al limpiar
        } else {
             console.warn("⚠️ Formulario ('formulario-publicidad') no encontrado al intentar limpiar.");
        }
    }

    /**
     * Lee un archivo de imagen y devuelve una promesa que resuelve con la cadena Base64 (Data URL).
     * @param {File} file - El archivo de imagen.
     * @returns {Promise<string>} - Promesa con el Data URL Base64.
     */
    function leerImagenComoBase64(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                return reject(new Error('No se proporcionó archivo.'));
            }
            // Validación de tipo y tamaño
            if (!file.type.startsWith('image/')) {
                return reject(new Error('El archivo seleccionado no es una imagen válida.'));
            }
            const maxSizeMB = 5; // Aumentado a 5MB como ejemplo
            if (file.size > maxSizeMB * 1024 * 1024) {
                 return reject(new Error(`La imagen supera el tamaño máximo de ${maxSizeMB}MB.`));
            }

            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result); // Resuelve con el Data URL
            reader.onerror = (error) => reject(new Error("Error al leer el archivo: " + error));
            reader.readAsDataURL(file); // Inicia la lectura
        });
    }

    /**
     * Añade el listener para el envío del formulario. Prepara y envía los datos al backend.
     */
    function inicializarFormularioPublicidad() {
        if (!formulario) {
            console.error('❌ Formulario ("formulario-publicidad") no encontrado. No se puede inicializar.');
            return;
        }

        formulario.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevenir envío HTML normal
            console.log('📨 Formulario enviado. Procesando...');

            const submitBtn = document.getElementById('btn-guardar'); // Botón de Guardar/Enviar
            const originalBtnText = submitBtn?.innerHTML || "Guardar Publicidad";
            if(submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
                submitBtn.disabled = true;
            }

            // Remover mensajes previos de éxito/error
            const prevMsg = formularioContainer?.querySelector('.mensaje-temporal');
            if(prevMsg) prevMsg.remove();

            try {
                // 1. Validar Autenticación (localStorage) ANTES de procesar
                const isUserAuth = localStorage.getItem("afiliado") === "yes";
                const isProfileComplete = localStorage.getItem("perfil_completo") === "true";
                 if (!isUserAuth && !isProfileComplete) {
                    alert("Debes ser un afiliado para registrar publicidad.");
                    throw new Error("Intento de envío sin autenticación (localStorage)");
                 }

                // 2. Recolectar Datos del Formulario
                const formData = new FormData(formulario);
                const nombreUsuario = localStorage.getItem("nombre") || 'Afiliado'; // Tomar de localStorage
                const emailContacto = formData.get('email')?.trim();
                const telefonoContacto = formData.get('telefono')?.trim();
                const categoria = formData.get('categoria');
                const titulo = formData.get('titulo')?.trim();
                const descripcion = formData.get('descripcion')?.trim();

                // 3. Validación de Campos Requeridos (Frontend)
                 if (!titulo || !descripcion || !emailContacto || !categoria) {
                    alert("Por favor, completa todos los campos obligatorios: Título, Descripción, Categoría y Email de contacto.");
                    throw new Error("Campos obligatorios faltantes");
                 }
                 // Validación simple de email (opcional)
                 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailContacto)) {
                    alert("Por favor, introduce un email de contacto válido.");
                    throw new Error("Email inválido");
                 }

                // 4. Preparar Objeto de Datos para el Backend (estructura de v1 corregida)
                const datosParaEnviar = {
                    nombre: nombreUsuario,
                    contacto: {
                        email: emailContacto,
                        telefono: telefonoContacto || null // Enviar null si está vacío
                    },
                    categoria: categoria,
                    titulo: titulo,
                    descripcion: descripcion,
                    imagen_base64: null // Inicializar
                };

                // 5. Procesar Imagen (si existe)
                const imagenInput = document.getElementById('imagen');
                if (imagenInput?.files?.[0]) {
                    try {
                        datosParaEnviar.imagen_base64 = await leerImagenComoBase64(imagenInput.files[0]);
                        console.log("🖼️ Imagen procesada a Base64.");
                    } catch (imgError) {
                        console.error("Error procesando imagen:", imgError);
                        alert(`Error al procesar la imagen: ${imgError.message}. Intenta sin imagen o con otra.`);
                        throw imgError; // Relanzar para que lo capture el catch principal
                    }
                }

                // 6. Enviar Datos al Backend
                console.log("➡️ Datos a enviar:", datosParaEnviar);
                if (!backendApiUrl) throw new Error("URL del backend no configurada.");

                await enviarPublicidadBackend(datosParaEnviar, backendApiUrl);

                // 7. Éxito (si enviarPublicidadBackend no lanzó error)
                mostrarMensajeExito("¡Solicitud enviada! Tu anuncio está pendiente de aprobación.");
                cerrarModalFormulario(); // Cerrar modal en éxito

            } catch (error) {
                console.error('🚨 Error durante el procesamiento/envío del formulario:', error);
                // Mostrar mensaje de error si no es una de las validaciones ya alertadas
                if (error.message !== "Intento de envío sin autenticación (localStorage)" &&
                    error.message !== "Campos obligatorios faltantes" &&
                    error.message !== "Email inválido" &&
                    !error.message.startsWith("La imagen supera"))
                {
                     mostrarMensajeError(error.message || 'Ocurrió un error inesperado.');
                }
            } finally {
                // Siempre restaurar el botón de envío
                if (submitBtn) {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
                 console.log('✅ Procesamiento del formulario finalizado.');
            }
        });
         console.log("👍 Listener de envío del formulario inicializado.");
    }

    /**
     * Envía los datos de publicidad al endpoint del backend.
     * @param {object} datos - El objeto con los datos estructurados para enviar.
     * @param {string} urlDestino - La URL del endpoint POST /api/publicidad.
     */
    async function enviarPublicidadBackend(datos, urlDestino) {
        try {
            console.log(`📞 Enviando datos a POST ${urlDestino}`);
            const response = await fetch(urlDestino, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Indicar que esperamos JSON
                },
                body: JSON.stringify(datos) // Enviar el objeto como JSON
            });

            // Intentar leer la respuesta JSON incluso si no es OK, puede contener detalles del error
            const responseData = await response.json().catch(() => ({})); // Objeto vacío si falla el parseo

            if (!response.ok) {
                console.error(`Error ${response.status} del backend:`, responseData);
                // Usar el mensaje de error del backend si existe, si no, un mensaje genérico
                const errorMessage = responseData.detail || responseData.message || `Error HTTP ${response.status} al guardar la publicidad.`;
                throw new Error(errorMessage);
            }

            // Éxito en la comunicación con el backend
            console.log("✅ Respuesta exitosa del backend:", responseData);
            // La lógica de éxito (mensaje, cerrar modal) se maneja fuera de esta función
            // en el listener del formulario, después de que esta promesa se resuelva.

        } catch (error) {
            console.error("🚨 Error en enviarPublicidadBackend:", error);
            // Relanzar el error para que sea capturado por el listener del formulario
            // y muestre el mensaje de error al usuario.
            throw error;
        }
    }

    // --- Funciones de Mensajes (Base: Versión 1) ---
    function mostrarMensajeExito(texto = "Operación realizada con éxito.") {
        if (!formularioContainer) return;
        // Remover mensaje previo
        const prevMsg = formularioContainer.querySelector('.mensaje-temporal');
        if(prevMsg) prevMsg.remove();

        const mensajeExito = document.createElement('div');
        mensajeExito.className = 'mensaje-exito mensaje-temporal'; // Clase para estilo y para buscar/remover
        mensajeExito.innerHTML = `<h4>✅ Éxito</h4><p>${texto}</p>`;
        // Aplicar estilos básicos inline (mejor en CSS)
        mensajeExito.style.backgroundColor = '#d4edda';
        mensajeExito.style.color = '#155724';
        mensajeExito.style.border = '1px solid #c3e6cb';
        mensajeExito.style.padding = '1rem';
        mensajeExito.style.margin = '1rem 0';
        mensajeExito.style.borderRadius = '5px';

        // Insertar DESPUÉS del formulario, dentro del contenedor del modal
        formulario?.insertAdjacentElement('afterend', mensajeExito);
        // O añadir al final del contenedor si el formulario no existe
        // formularioContainer.appendChild(mensajeExito);

        setTimeout(() => { mensajeExito.remove(); }, 5000); // Auto-cerrar después de 5 segundos
    }

    function mostrarMensajeError(mensaje = "Error al procesar la solicitud.") {
         if (!formularioContainer) return;
         const prevMsg = formularioContainer.querySelector('.mensaje-temporal');
         if(prevMsg) prevMsg.remove();

        const mensajeError = document.createElement('div');
        mensajeError.className = 'mensaje-error mensaje-temporal';
        mensajeError.innerHTML = `<h4>❌ Error</h4><p>${mensaje}</p>`;
        mensajeError.style.backgroundColor = '#f8d7da';
        mensajeError.style.color = '#721c24';
        mensajeError.style.border = '1px solid #f5c6cb';
        mensajeError.style.padding = '1rem';
        mensajeError.style.margin = '1rem 0';
        mensajeError.style.borderRadius = '5px';

        formulario?.insertAdjacentElement('afterend', mensajeError);
        // formularioContainer.appendChild(mensajeError);

        setTimeout(() => { mensajeError.remove(); }, 7000); // Dar un poco más de tiempo para leer errores
    }


    // --- Funciones de Carga y Like de Anuncios (Base: Versión 1 - ¡REVISAR URL LIKE!) ---

    /**
     * Carga los anuncios aprobados desde el backend y los muestra.
     */
    async function cargarAnuncios() {
        console.log(`📞 Cargando anuncios desde GET ${backendApiUrl}...`);
        if (!anunciosContainer) {
             console.error("❌ No se encontró el contenedor '.anuncios-container'. No se pueden mostrar anuncios.");
             return;
        }
        if (!backendApiUrl) {
            anunciosContainer.innerHTML = '<p class="error-mensaje">Error: URL del backend no configurada para cargar anuncios.</p>';
            return;
        }

        anunciosContainer.innerHTML = `<p class="cargando-mensaje"><i class="fas fa-spinner fa-spin"></i> Cargando anuncios...</p>`; // Feedback visual

        try {
            const response = await fetch(backendApiUrl); // GET /api/publicidad
            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status} al obtener anuncios.`);
            }
            const data = await response.json();

            // Asumiendo que la respuesta es { anuncios: [...] } o similar
            const anuncios = data.anuncios || (Array.isArray(data) ? data : []); // Ser flexible con la respuesta

            // Filtrar para mostrar solo los aprobados
            const anunciosAprobados = anuncios.filter(a => a.aprobado === true);
            console.log(`✅ Anuncios recibidos: ${anuncios.length} total, ${anunciosAprobados.length} aprobados.`);

            actualizarVistaAnuncios(anunciosAprobados);

        } catch (error) {
            console.error("🚨 Error al cargar anuncios:", error);
            anunciosContainer.innerHTML = `<p class="error-mensaje">⚠️ No se pudieron cargar los anuncios. Intenta recargar la página.</p>`;
        }
    }

    /**
     * Renderiza los anuncios aprobados en el contenedor HTML.
     * @param {Array} anunciosAprobados - Array de objetos de anuncio aprobados.
     */
    function actualizarVistaAnuncios(anunciosAprobados) {
        if (!anunciosContainer) return;

        if (!anunciosAprobados || anunciosAprobados.length === 0) {
            anunciosContainer.innerHTML = `<p class="info-mensaje">✨ De momento no hay anuncios publicados. ¡Sé el primero en registrar uno! ✨</p>`;
            return;
        }

        // Generar HTML para cada anuncio
        anunciosContainer.innerHTML = anunciosAprobados.map(anuncio => {
            // Proporcionar valores por defecto si alguna propiedad falta
            const id = anuncio.id || `temp_${Math.random().toString(36).substring(2)}`;
            const imagenSrc = anuncio.imagen_base64 || 'images/placeholder-anuncio.png'; // Placeholder local
            const titulo = anuncio.titulo || 'Anuncio';
            const descripcion = anuncio.descripcion || 'Sin descripción.';
            const categoria = anuncio.categoria || 'General';
            const likes = anuncio.likes || 0;

            return `
            <div class="anuncio-card" data-id="${id}">
                <img src="${imagenSrc}" alt="Imagen de ${titulo}" class="anuncio-imagen" onerror="this.onerror=null; this.src='images/placeholder-anuncio.png';">
                <div class="anuncio-content">
                    <h3>${titulo}</h3>
                    <p>${descripcion}</p>
                    <div class="anuncio-footer">
                        <span class="categoria"><i class="fas fa-tag"></i> ${categoria}</span>
                        <button class="like-button" data-anuncio-id="${id}" title="Me gusta">
                            <i class="fas fa-thumbs-up"></i>
                            <span class="likes-count">${likes}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        }).join('');

        // Añadir listeners a los botones de like DESPUÉS de crear el HTML
        setupLikeButtonListeners();
    }

    /**
     * Añade event listeners a todos los botones de like presentes en la página.
     */
    function setupLikeButtonListeners() {
        const likeButtons = document.querySelectorAll('.like-button');
        likeButtons.forEach(button => {
            // Remover listener previo si existiera (por si se llama varias veces)
            button.replaceWith(button.cloneNode(true));
        });
        // Volver a seleccionar los botones clonados y añadir listener
        document.querySelectorAll('.like-button').forEach(button => {
             button.addEventListener('click', handleLikeClick);
        });
    }

    /**
     * Manejador de evento para el clic en el botón de like.
     */
    async function handleLikeClick(event) {
        const button = event.currentTarget;
        const anuncioId = button.dataset.anuncioId; // Obtener ID desde data-attribute
        if (!anuncioId) {
            console.error("❌ No se encontró anuncioId en el botón de like.");
            return;
        }
        await darLike(anuncioId); // Llamar a la función que interactúa con el backend
    }


    /**
     * Envía una solicitud para dar "like" a un anuncio.
     * ¡¡¡ ADVERTENCIA: LA URL USADA AQUÍ ES PROBABLEMENTE INCORRECTA !!!
     * Debería usar un endpoint específico para likes, ej: /api/like/{anuncioId}
     * @param {string} anuncioId - El ID del anuncio al que dar like.
     */
    async function darLike(anuncioId) {
        // --- !! ALERTA DE CONFIGURACIÓN !! ---
        // Esta URL probablemente está mal. Necesitas un endpoint POST /api/like/{id}
        // const urlLikeCorrecta = `${window.API_ENDPOINTS?.like}/${anuncioId}`; // Ejemplo de cómo podría ser
        const urlLikeIncorrecta = `${backendApiUrl}/like/${anuncioId}`; // URL incorrecta usada en v1
        const likeEndpoint = window.API_ENDPOINTS?.like; // Intentar obtener endpoint de like
        const urlLike = likeEndpoint ? `${likeEndpoint}/${anuncioId}` : null;

        if (!urlLike) {
             console.warn(`⚠️ Funcionalidad 'Like' deshabilitada: window.API_ENDPOINTS.like no está definido en config.js.`);
             alert("La función de 'Me gusta' no está configurada correctamente.");
             return; // Detener si no hay URL correcta
        }
        console.log(`👍 Intentando dar like a ${anuncioId} en ${urlLike}`);


        const button = document.querySelector(`.like-button[data-anuncio-id="${anuncioId}"]`);
        const likesCountSpan = button?.querySelector('.likes-count');
        if (!button || !likesCountSpan) {
            console.error(`❌ No se encontró el botón o contador de likes para el anuncio ${anuncioId}`);
            return;
        }

        const originalButtonState = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        try {
            const response = await fetch(urlLike, { // Usar la URL correcta (si está definida)
                method: 'POST',
                headers: {
                    // 'Content-Type': 'application/json', // No necesario si no hay body
                    'Accept': 'application/json'
                }
                // body: JSON.stringify({ userId: '...' }) // Si necesitas enviar quién dio like
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.detail || data.message || `Error ${response.status} al dar like.`);
            }

            // Éxito - Actualizar contador y feedback visual
            likesCountSpan.textContent = data.likes !== undefined ? data.likes : parseInt(likesCountSpan.textContent || '0') + 1; // Actualizar contador
            button.classList.add('liked-animation'); // Añadir clase para animación CSS

            console.log(`✅ Like registrado para ${anuncioId}. Nueva cuenta: ${likesCountSpan.textContent}`);

            // Quitar animación y restaurar botón después de un tiempo
            setTimeout(() => {
                button.classList.remove('liked-animation');
                // Restaurar icono y contador (ya actualizado)
                button.innerHTML = `<i class="fas fa-thumbs-up"></i> <span class="likes-count">${likesCountSpan.textContent}</span>`;
                button.disabled = false;
            }, 1000); // Duración de la animación

        } catch (error) {
            console.error(`🚨 Error al dar like al anuncio ${anuncioId}:`, error);
            alert(`No se pudo registrar el 'Me gusta'. ${error.message}`);
            // Restaurar botón a su estado original en caso de error
            button.innerHTML = originalButtonState;
            button.disabled = false;
        }
    }


    // --- Inicialización de la Página y Listeners Globales ---

    function initPage() {
        console.log("🚀 Inicializando página de publicidad (Versión Fusionada)...");
        // Aplicar fade-in al cargar (si se usa CSS para ello)
        document.body.classList.add('fade-in'); // Asegurar que esté visible

        // Slider: Mostrar el primer slide y configurar navegación
        if(slides.length > 0) {
            updateSlide(0); // Mostrar slide inicial
            setupSliderNavListeners(); // Configurar botones y enlaces
        } else {
            console.warn(" Módulo Slider no inicializado: no se encontraron slides.");
        }

        // Formulario: Configurar listeners de envío y botones de email
        inicializarFormularioPublicidad();
        configurarBotonesEmail(); // Configurar inicialmente

        // Modal: Configurar botones de cierre
        setupModalCloseListeners();

        // Autenticación: Configurar el botón de registro basado en localStorage
        configurarBotonRegistro();

        // Anuncios: Cargar los anuncios existentes del backend
        cargarAnuncios();

        console.log("👍 Página de publicidad inicializada.");
    }

    // Listener para cambios en localStorage (ej: login/logout en otra pestaña)
    window.addEventListener('storage', function(e) {
        // Reaccionar si cambia el estado de afiliado, perfil o datos relevantes
        if (e.key === 'afiliado' || e.key === 'nombre' || e.key === 'perfil_completo' || e.key === 'email') {
            console.log(`📣 Storage cambió ('${e.key}'). Reconfigurando componentes...`);
            configurarBotonRegistro(); // Actualizar estado del botón principal
            // Si el modal está abierto, podríamos querer actualizar los botones de email
            if (formularioContainer?.style.display === 'block') {
                 configurarBotonesEmail(); // Reconfigurar botones de email dentro del modal
            }
        }
    });

    // Exponer funciones globalmente SOLO si son necesarias desde fuera (ej: onclick en HTML o desde otros scripts)
    // 'darLike' ya no necesita ser global porque usamos addEventListener
    // window.darLike = darLike; // Ya no es necesario con setupLikeButtonListeners
    window.configurarBotonRegistro = configurarBotonRegistro; // Necesario para auth-popup.js u otros
    // window.updatePublicidadSliderDots = updateSliderDots; // No parece necesario globalmente

    // --- Ejecución Inicial ---
    initPage();

}); // Fin de DOMContentLoaded

// --- Funciones Globales (Evitar si es posible) ---
// La función limpiarFormulario está ahora definida DENTRO de DOMContentLoaded,
// lo cual es mejor práctica. Si alguna parte externa la necesitaba globalmente,
// tendría que ser expuesta explícitamente (ej: window.limpiarFormularioPublicidad = limpiarFormulario;)
// pero es preferible refactorizar para no depender de globales.
// Ya no definimos limpiarFormularioGlobal() aquí.

// Exponer la función de verificación globalmente
window.verificarCedulaPublicidad = async function(cedula, callback) {
    try {
        // Determinar la URL base del API según el ambiente
        let backendUrl;
        if (window.API_ENDPOINTS?.verificarCedula) {
            backendUrl = window.API_ENDPOINTS.verificarCedula;
        } else {
            // Si estamos en producción, usar la URL de producción
            backendUrl = window.location.hostname === 'localhost' 
                ? "http://localhost:8000/api/verificar_cedula"
                : "https://tudominio.com/api/verificar_cedula"; // Reemplaza con tu URL de producción
        }
        
        const url = `${backendUrl}/${cedula}`;
        console.log("🔍 Intentando verificar cédula en:", url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Incluir cookies si es necesario
        });

        // Verificar el tipo de contenido antes de intentar parsear JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Respuesta no es JSON:', contentType);
            console.error('URL utilizada:', url);
            throw new Error('El servidor no respondió con JSON válido');
        }

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Respuesta del servidor:", data);

        // Guardar datos en localStorage
        if (data.valid) {
            localStorage.setItem("afiliado", "yes");
            localStorage.setItem("nombre", data.nombre);
            localStorage.setItem("cargo", data.cargo);
            localStorage.setItem("codigo_secreto", data.codigo_secreto);
        } else {
            localStorage.setItem("afiliado", "no");
        }

        // Ejecutar el callback con el resultado
        if (callback) {
            callback(data);
        }

        return data;
    } catch (error) {
        console.error("❌ Error al verificar cédula:", error);
        console.error("URL completa:", url);
        console.error("Ambiente:", window.location.hostname);
        
        if (callback) {
            callback({ 
                valid: false, 
                error: error.message,
                details: "Error de conexión con el servidor. Por favor, intente más tarde."
            });
        }
        throw error;
    }
};

