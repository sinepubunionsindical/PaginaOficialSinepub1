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
        console.log("🛠️ Configurando botón de registro de publicidad");
        
        // Obtener la referencia al botón
        const registrarBtn = document.getElementById("registrar-publicidad");
        
        if (!registrarBtn) {
            console.error("❌ No se encontró el botón de registro (#registrar-publicidad)");
            return;
        }
        
        // Verificar si el usuario está autenticado
        const estaAutenticado = localStorage.getItem("afiliado_autenticado") === "true";
        const perfilCompleto = localStorage.getItem("perfil_completo") === "true";
        
        console.log(`🔐 Estado de autenticación: ${estaAutenticado ? 'Autenticado' : 'No autenticado'}, Perfil completo: ${perfilCompleto ? 'Sí' : 'No'}`);
        
        // Si está autenticado y tiene perfil completo, mostrar y habilitar el botón
        if (estaAutenticado && perfilCompleto) {
            registrarBtn.style.display = "block";
            registrarBtn.style.backgroundColor = "#35a9aa"; // Color normal
            registrarBtn.style.cursor = "pointer";
            registrarBtn.disabled = false;
            
            // Limpiar eventos anteriores para evitar duplicados
            registrarBtn.removeEventListener('click', mostrarFormularioRegistro);
            registrarBtn.removeEventListener('click', mostrarMensajeAutenticacion);
            
            // Asignar el evento para mostrar el formulario
            registrarBtn.addEventListener('click', mostrarFormularioRegistro);
            console.log("✅ Botón de registro habilitado y configurado");
        } else {
            // Si no está autenticado o no tiene perfil completo, mostrar como deshabilitado
            registrarBtn.style.display = "block"; 
            registrarBtn.style.backgroundColor = "#cccccc"; // Gris para indicar deshabilitado
            registrarBtn.style.cursor = "not-allowed";
            registrarBtn.disabled = false; // Mantener habilitado para mostrar mensaje de error
            
            // Limpiar eventos anteriores
            registrarBtn.removeEventListener('click', mostrarFormularioRegistro);
            registrarBtn.removeEventListener('click', mostrarMensajeAutenticacion);
            
            // Asignar el evento para mostrar mensaje de autenticación
            registrarBtn.addEventListener('click', mostrarMensajeAutenticacion);
            console.log("⚠️ Botón de registro configurado para mostrar mensaje de autenticación");
        }
    }

    // Muestra el modal del formulario
    function mostrarFormularioRegistro(e) {
        if (e) e.preventDefault();
        
        console.log("📝 Mostrando formulario de registro de publicidad");
        
        // Obtener referencia al contenedor del formulario
        const formularioContainer = document.getElementById("formulario-container");
        
        if (!formularioContainer) {
            console.error("❌ No se encontró el contenedor del formulario (#formulario-container)");
            return;
        }
        
        // Mostrar el formulario
        formularioContainer.style.display = "flex";
        
        // Configurar estilos para permitir scroll dentro del modal pero no en el fondo
        document.body.style.overflow = "hidden"; // Bloquear scroll en el fondo
        
        // Obtener el modal-content y permitir su scroll interno
        const modalContent = formularioContainer.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.maxHeight = "80vh"; // altura máxima del 80% de la ventana
            modalContent.style.overflowY = "auto"; // permitir scroll vertical
        }
        
        // Configurar listeners de cierre
        setupModalCloseListeners();
        
        console.log("✅ Formulario de registro mostrado correctamente");
    }

    // Muestra alerta si se intenta registrar sin ser afiliado/perfil completo
    function mostrarMensajeAutenticacion(e) {
        if (e) e.preventDefault();
        
        console.log("🚫 Usuario no autenticado o perfil incompleto");
        mostrarMensajeError("Debes iniciar sesión y completar tu perfil para poder publicar anuncios.");
    }

    // Cierra el modal del formulario
    function cerrarModalFormulario() {
        const formularioContainer = document.getElementById("formulario-container");
        if (formularioContainer) {
            formularioContainer.style.display = "none";
            document.body.style.overflow = "auto"; // Restaurar scroll del body
            
            // Restaurar otros estilos si es necesario
            const modalContent = formularioContainer.querySelector('.modal-content');
            if (modalContent) {
                // Limpiar estilos de scroll y altura que pudimos haber modificado
                modalContent.style.maxHeight = "";
                modalContent.style.overflowY = "";
            }
        }
    }

    // Configura los listeners para cerrar el modal (Botón X y Cancelar)
    function setupModalCloseListeners() {
        // Botón de cerrar
        const btnCerrar = document.getElementById("btn-cerrar-form");
        if (btnCerrar) {
            btnCerrar.addEventListener("click", cerrarModalFormulario);
        }
        
        // Botón de cancelar dentro del formulario
        const btnCancelar = document.getElementById("btn-cancelar-form-interno");
        if (btnCancelar) {
            btnCancelar.addEventListener("click", cerrarModalFormulario);
        }
        
        // Cerrar al hacer clic fuera del modal
        const formularioContainer = document.getElementById("formulario-container");
        if (formularioContainer) {
            // Usamos la delegación de eventos para evitar cerrar cuando se hace clic en el contenido
            formularioContainer.addEventListener("click", function(e) {
                // Verificar si el clic fue directamente en el contenedor (fuera del modal-content)
                if (e.target === formularioContainer) {
                    cerrarModalFormulario();
                }
            });
        }
        
        // Agregar manejador de tecla Escape para cerrar
        document.addEventListener("keydown", function(e) {
            if (e.key === "Escape") {
                const formularioContainer = document.getElementById("formulario-container");
                if (formularioContainer && formularioContainer.style.display !== "none") {
                    cerrarModalFormulario();
                }
            }
        });
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
        // Limpiar la previsualización de imagen
        const previewContainer = document.getElementById('imagen-preview-container');
        if (previewContainer) {
            previewContainer.style.display = 'none';
            const previewImg = previewContainer.querySelector('img');
            if (previewImg) {
                previewImg.src = '';
            }
        }
        
        // Restablecer elementos principales del formulario
        document.getElementById('titulo-anuncio').value = '';
        document.getElementById('texto-anuncio').value = '';
        
        // Conservar las opciones de selección de datos del usuario
        // pero restablecer cualquier input visible alternativo
        if (document.getElementById('usar-otro-nombre') && document.getElementById('usar-otro-nombre').checked) {
            document.getElementById('nombre-anunciante').value = '';
        }
        
        if (document.getElementById('usar-otro-correo') && document.getElementById('usar-otro-correo').checked) {
            document.getElementById('correo-anunciante').value = '';
        }
        
        if (document.getElementById('usar-otro-telefono') && document.getElementById('usar-otro-telefono').checked) {
            document.getElementById('telefono-anunciante').value = '';
        }
        
        // Restablecer selector de categoría si existe
        const categoriaSelect = document.getElementById('categoria-anuncio');
        if (categoriaSelect) {
            categoriaSelect.selectedIndex = 0;
        }
        
        // Restablecer input de archivo
        const fileInput = document.getElementById('imagen-anuncio');
        if (fileInput) {
            fileInput.value = '';
        }
        
        console.log("🧹 Formulario limpiado exitosamente, manteniendo datos de usuario");
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
     * Inicializa el formulario de publicidad.
     */
    function inicializarFormularioPublicidad() {
        // Obtener elementos importantes
        const formularioPublicidad = document.getElementById("formulario-publicidad");
        
        if (!formularioPublicidad) {
            console.error("❌ No se encontró el formulario de publicidad");
            return; // Salir temprano si no se encuentra el formulario
        }
        
        console.log("📝 Inicializando formulario de publicidad...");
        
        const descripcionTextarea = document.getElementById("descripcion");
        const contadorCaracteres = document.getElementById("descripcion-contador");
        const imagenInput = document.getElementById("imagen");
        const imagenPreview = document.getElementById("preview");
        const imagenPlaceholder = document.getElementById("imagen-placeholder-text");
        const eliminarImagenBtn = document.getElementById("eliminar-imagen");
        
        // Configurar contador de caracteres para descripción
        if (descripcionTextarea && contadorCaracteres) {
            const maxCaracteres = parseInt(descripcionTextarea.getAttribute("maxlength") || "500");
            
            descripcionTextarea.addEventListener("input", function() {
                const caracteresRestantes = maxCaracteres - this.value.length;
                contadorCaracteres.textContent = `${caracteresRestantes} caracteres restantes`;
                
                // Cambiar color si queda poco espacio
                if (caracteresRestantes < 50) {
                    contadorCaracteres.style.color = "red";
                } else {
                    contadorCaracteres.style.color = "";
                }
            });
        }
        
        // Configurar previsualización de imagen
        if (imagenInput && imagenPreview && imagenPlaceholder) {
            imagenInput.addEventListener("change", function(e) {
                const file = this.files[0];
                if (file) {
                    // Validar tamaño (5MB máximo)
                    if (file.size > 5 * 1024 * 1024) {
                        alert("La imagen es demasiado grande. El tamaño máximo es 5MB.");
                        this.value = "";
                        return;
                    }
                    
                    // Validar tipo
                    if (!file.type.match('image/jpeg') && 
                        !file.type.match('image/png') && 
                        !file.type.match('image/gif')) {
                        alert("El archivo seleccionado no es una imagen válida. Use JPG, PNG o GIF.");
                        this.value = "";
                        return;
                    }
                    
                    // Mostrar vista previa
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        imagenPreview.src = event.target.result;
                        imagenPreview.style.display = "block";
                        imagenPlaceholder.style.display = "none";
                        if (eliminarImagenBtn) eliminarImagenBtn.style.display = "inline-block";
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            // Función para eliminar imagen
            if (eliminarImagenBtn) {
                eliminarImagenBtn.addEventListener("click", function() {
                    imagenInput.value = "";
                    imagenPreview.src = "#";
                    imagenPreview.style.display = "none";
                    imagenPlaceholder.style.display = "block";
                    this.style.display = "none";
                });
            }
            
            // Configurar drag & drop
            const imagenPreviewContainer = document.getElementById("imagen-preview");
            if (imagenPreviewContainer) {
                ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
                    imagenPreviewContainer.addEventListener(eventName, preventDefaults, false);
                });
                
                function preventDefaults(e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                
                // Highlight drop area when drag over
                ["dragenter", "dragover"].forEach(eventName => {
                    imagenPreviewContainer.addEventListener(eventName, highlight, false);
                });
                
                ["dragleave", "drop"].forEach(eventName => {
                    imagenPreviewContainer.addEventListener(eventName, unhighlight, false);
                });
                
                function highlight() {
                    imagenPreviewContainer.classList.add("drag-highlight");
                }
                
                function unhighlight() {
                    imagenPreviewContainer.classList.remove("drag-highlight");
                }
                
                // Handle dropped files
                imagenPreviewContainer.addEventListener("drop", handleDrop, false);
                
                function handleDrop(e) {
                    const dt = e.dataTransfer;
                    const files = dt.files;
                    if (files.length > 0) {
                        imagenInput.files = files; // Asignar los archivos al input
                        // Disparar evento change manualmente
                        imagenInput.dispatchEvent(new Event('change'));
                    }
                }
            }
        }
        
        // Configurar envío del formulario
        if (formularioPublicidad) {
            formularioPublicidad.addEventListener("submit", async function(e) {
                e.preventDefault();
                
                // Validar campos obligatorios
                const nombre = document.getElementById("nombre").value;
                const email = document.getElementById("email").value;
                const telefono = document.getElementById("telefono").value;
                const categoria = document.getElementById("categoria").value;
                const titulo = document.getElementById("titulo").value;
                const descripcion = document.getElementById("descripcion").value;
                
                if (!nombre || !email || !telefono || !categoria || !titulo || !descripcion) {
                    alert("Por favor completa todos los campos obligatorios");
                    return;
                }
                
                // Preparar datos
                const datos = {
                    nombre: nombre,
                    correo: email,
                    telefono: telefono,
                    categoria: categoria,
                    titulo: titulo,
                    descripcion: descripcion
                };
                
                // Obtener cédula del localStorage si existe
                const cedulaGuardada = localStorage.getItem("cedula");
                if (cedulaGuardada) {
                    datos.cedula = cedulaGuardada;
                }
                
                // Leer imagen como base64 si hay una seleccionada
                if (imagenInput && imagenInput.files.length > 0) {
                    try {
                        datos.imagen_base64 = await leerImagenComoBase64(imagenInput.files[0]);
                    } catch (error) {
                        console.error("Error al leer la imagen:", error);
                        alert("Error al procesar la imagen. Por favor, intenta con otra imagen.");
                        return;
                    }
                }
                
                // Enviar datos al backend
                const backendApiUrl = window.API_ENDPOINTS?.publicidad || `${getBackendUrl()}/api/publicidad`;
                
                // Deshabilitar formulario durante envío
                const submitBtn = document.getElementById("btn-guardar");
                const cancelBtn = document.getElementById("btn-cancelar-form-interno");
                
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                }
                
                if (cancelBtn) {
                    cancelBtn.disabled = true;
                }
                
                try {
                    const resultado = await enviarPublicidadBackend(datos, backendApiUrl);
                    
                    if (resultado.success) {
                        // Limpiar formulario y cerrar modal
                        limpiarFormulario();
                        cerrarModalFormulario();
                        
                        // Mostrar mensaje de éxito
                        mostrarMensajeExito("Tu anuncio ha sido enviado y está pendiente de aprobación por la Junta Directiva.");
                    } else {
                        throw new Error(resultado.mensaje || "Error desconocido al enviar la publicidad");
                    }
                } catch (error) {
                    console.error("Error al enviar publicidad:", error);
                    mostrarMensajeError("Hubo un problema al enviar tu anuncio. Por favor intenta nuevamente.");
                } finally {
                    // Re-habilitar formulario
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Anuncio para Aprobación';
                    }
                    
                    if (cancelBtn) {
                        cancelBtn.disabled = false;
                    }
                }
            });
        }
    }

    /**
     * Envía los datos de publicidad al backend.
     * @param {Object} datos - Los datos a enviar.
     * @param {string} urlDestino - La URL del endpoint.
     * @returns {Promise<Object>} - La respuesta del servidor.
     */
    async function enviarPublicidadBackend(datos, urlDestino) {
        console.log(`📤 Enviando datos de publicidad a ${urlDestino}...`);
        
        try {
            const response = await fetch(urlDestino, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true', // Para evitar la página de advertencia de ngrok
                    'User-Agent': 'sinepub-client' // Identificar la solicitud
                },
                body: JSON.stringify(datos)
            });

            if (!response.ok) {
                throw new Error(`500: Error al procesar la solicitud de publicidad`);
            }

            // Parsear la respuesta como JSON
            const data = await response.json();
            console.log(`✅ Publicidad enviada con éxito:`, data);
            return data;
        } catch (error) {
            console.error(`❌ Error al enviar publicidad:`, error);
            return {
                success: false,
                mensaje: error.message || "Error al enviar la publicidad"
            };
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
     * Carga los anuncios desde el backend.
     */
    async function cargarAnuncios() {
        try {
            const backendApiUrl = window.API_ENDPOINTS?.publicidad || `${getBackendUrl()}/api/publicidad`;
            console.log(`📞 Cargando anuncios desde GET ${backendApiUrl}...`);

            const response = await fetch(backendApiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'User-Agent': 'sinepub-client'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const anuncios = data.anuncios || [];
            
            // Agrupar anuncios por categoría
            const anunciosPorCategoria = {
                asistencia: [],
                comercio: [],
                servicios: [],
                educacion: []
            };

            // Filtrar anuncios aprobados y agruparlos por categoría
            anuncios.forEach(anuncio => {
                if (anuncio.aprobado) {
                    const categoria = anuncio.categoria?.toLowerCase().trim() || 'asistencia';
                    if (categoria in anunciosPorCategoria) {
                        anunciosPorCategoria[categoria].push(anuncio);
                    }
                }
            });

            // Actualizar cada sección con sus anuncios correspondientes
            Object.entries(anunciosPorCategoria).forEach(([categoria, anunciosCategoria]) => {
                const container = document.getElementById(`anuncios-${categoria}`);
                if (container) {
                    if (anunciosCategoria.length > 0) {
                        container.innerHTML = anunciosCategoria.map(anuncio => {
                            // Preparar la URL de la imagen
                            let imagenSrc = '';
                            if (anuncio.imagen_ruta) {
                                imagenSrc = anuncio.imagen_ruta.startsWith('/') ? anuncio.imagen_ruta : '/' + anuncio.imagen_ruta;
                            } else {
                                imagenSrc = '/images/placeholder-anuncio.png';
                            }

                            // Formatear la fecha
                            const fecha = new Date(anuncio.fecha_creacion);
                            const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });

                            // Preparar la foto de perfil
                            const fotoPerfil = anuncio.foto_perfil || '/images/avatar-placeholder.png';

                            return `
                                <div class="anuncio-card">
                                    <div class="anuncio-header">
                                        <div class="anuncio-perfil">
                                            <img src="${fotoPerfil}" alt="Foto de perfil" class="perfil-imagen"
                                                 onerror="this.onerror=null; this.src='/images/avatar-placeholder.png';">
                                            <div class="perfil-info">
                                                <h4>${anuncio.nombre || 'Anónimo'}</h4>
                                                <span class="fecha-publicacion">${fechaFormateada}</span>
                                            </div>
                                        </div>
                                        <div class="categoria-badge ${categoria}">
                                            <i class="fas fa-tag"></i> ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                                        </div>
                                    </div>

                                    <div class="anuncio-imagen-container">
                                        <img src="${imagenSrc}" alt="${anuncio.titulo}" class="anuncio-imagen"
                                             onerror="this.onerror=null; this.src='/images/placeholder-anuncio.png';">
                                    </div>

                                    <div class="anuncio-contenido">
                                        <h3 class="anuncio-titulo">${anuncio.titulo}</h3>
                                        <p class="anuncio-descripcion">${anuncio.descripcion}</p>
                                        
                                        <div class="anuncio-footer">
                                            <div class="anuncio-stats">
                                                <button class="like-button" onclick="darLike('${anuncio.id}')" title="Me gusta">
                                                    <i class="fas fa-heart"></i>
                                                    <span class="likes-count">${anuncio.likes || 0}</span>
                                                </button>
                                            </div>
                                            <div class="anuncio-contacto">
                                                ${anuncio.telefono ? `
                                                    <a href="tel:${anuncio.telefono}" class="contacto-btn">
                                                        <i class="fas fa-phone"></i> Llamar
                                                    </a>` : ''
                                                }
                                                ${anuncio.email ? `
                                                    <a href="mailto:${anuncio.email}" class="contacto-btn">
                                                        <i class="fas fa-envelope"></i> Email
                                                    </a>` : ''
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('');

                        // Añadir estilos CSS
                        if (!document.getElementById('anuncios-custom-styles')) {
                            const styles = document.createElement('style');
                            styles.id = 'anuncios-custom-styles';
                            styles.textContent = `
                                .anuncio-card {
                                    background: white;
                                    border-radius: 12px;
                                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                                    margin-bottom: 25px;
                                    overflow: hidden;
                                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                                }

                                .anuncio-card:hover {
                                    transform: translateY(-5px);
                                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                                }

                                .anuncio-header {
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    padding: 15px;
                                    border-bottom: 1px solid #f0f0f0;
                                }

                                .anuncio-perfil {
                                    display: flex;
                                    align-items: center;
                                    gap: 12px;
                                }

                                .perfil-imagen {
                                    width: 45px;
                                    height: 45px;
                                    border-radius: 50%;
                                    object-fit: cover;
                                    border: 2px solid #35a9aa;
                                }

                                .perfil-info h4 {
                                    margin: 0;
                                    font-size: 16px;
                                    color: #2c3e50;
                                }

                                .fecha-publicacion {
                                    font-size: 12px;
                                    color: #7f8c8d;
                                }

                                .categoria-badge {
                                    padding: 6px 12px;
                                    border-radius: 20px;
                                    font-size: 13px;
                                    font-weight: 500;
                                }

                                .categoria-badge.asistencia { background: #e8f5e9; color: #2e7d32; }
                                .categoria-badge.comercio { background: #e3f2fd; color: #1565c0; }
                                .categoria-badge.servicios { background: #fff3e0; color: #ef6c00; }
                                .categoria-badge.educacion { background: #f3e5f5; color: #7b1fa2; }

                                .anuncio-imagen-container {
                                    position: relative;
                                    width: 100%;
                                    height: 250px;
                                    overflow: hidden;
                                }

                                .anuncio-imagen {
                                    width: 100%;
                                    height: 100%;
                                    object-fit: cover;
                                    transition: transform 0.3s ease;
                                }

                                .anuncio-imagen:hover {
                                    transform: scale(1.05);
                                }

                                .anuncio-contenido {
                                    padding: 20px;
                                }

                                .anuncio-titulo {
                                    margin: 0 0 15px 0;
                                    font-size: 20px;
                                    color: #2c3e50;
                                }

                                .anuncio-descripcion {
                                    color: #34495e;
                                    line-height: 1.6;
                                    margin-bottom: 20px;
                                }

                                .anuncio-footer {
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    margin-top: 20px;
                                    padding-top: 15px;
                                    border-top: 1px solid #f0f0f0;
                                }

                                .like-button {
                                    background: none;
                                    border: none;
                                    color: #e74c3c;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    gap: 5px;
                                    padding: 5px 10px;
                                    transition: transform 0.2s ease;
                                }

                                .like-button:hover {
                                    transform: scale(1.1);
                                }

                                .anuncio-contacto {
                                    display: flex;
                                    gap: 10px;
                                }

                                .contacto-btn {
                                    display: inline-flex;
                                    align-items: center;
                                    gap: 5px;
                                    padding: 8px 15px;
                                    border-radius: 20px;
                                    text-decoration: none;
                                    font-size: 14px;
                                    transition: all 0.3s ease;
                                }

                                .contacto-btn:first-child {
                                    background: #35a9aa;
                                    color: white;
                                }

                                .contacto-btn:last-child {
                                    background: #f0f0f0;
                                    color: #2c3e50;
                                }

                                .contacto-btn:hover {
                                    transform: translateY(-2px);
                                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                                }
                            `;
                            document.head.appendChild(styles);
                        }

                    } else {
                        container.innerHTML = `
                            <div class="anuncio-vacio">
                                <i class="fas fa-inbox"></i>
                                <p>Actualmente no hay anuncios publicados en esta categoría.</p>
                            </div>
                        `;
                    }
                }
            });

        } catch (error) {
            console.error(`🚨 Error al cargar anuncios:`, error);
            const categorias = ['asistencia', 'comercio', 'servicios', 'educacion'];
            categorias.forEach(categoria => {
                const container = document.getElementById(`anuncios-${categoria}`);
                if (container) {
                    container.innerHTML = `<p class="anuncio-error">No se pudieron cargar los anuncios. Servidor inactivo.</p>`;
                }
            });
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

        // Generar HTML para cada anuncio con diseño mejorado
        anunciosContainer.innerHTML = anunciosAprobados.map(anuncio => {
            // Proporcionar valores por defecto si alguna propiedad falta
            const id = anuncio.id || `temp_${Math.random().toString(36).substring(2)}`;
            
            // Verificar y preparar la URL de la imagen
            let imagenSrc = '';
            if (anuncio.imagen_ruta) {
                // Asegurarse de que la ruta comience con '/'
                imagenSrc = anuncio.imagen_ruta.startsWith('/') ? anuncio.imagen_ruta : '/' + anuncio.imagen_ruta;
            } else if (anuncio.imagen_base64) {
                imagenSrc = anuncio.imagen_base64;
            } else {
                // Asegurarse de que el placeholder también tenga la ruta correcta
                imagenSrc = '/images/placeholder-anuncio.png';
            }
            
            const titulo = anuncio.titulo || 'Anuncio';
            const descripcion = anuncio.descripcion || 'Sin descripción.';
            const categoriaOriginal = anuncio.categoria ? anuncio.categoria.toLowerCase().trim() : '';
            const categoriasValidas = ["asistencia", "comercio", "servicios", "educacion"];
            const categoria = categoriasValidas.includes(categoriaOriginal) ? categoriaOriginal : 'educacion';
            const likes = anuncio.likes || 0;
            const nombre = anuncio.nombre || 'Anónimo';
            
            // Buscar la foto de perfil o usar un placeholder
            let fotoPerfil = '/images/avatar-placeholder.png'; // Placeholder por defecto
            
            // Si hay foto de perfil en el anuncio, usar la ruta de GitHub
            if (anuncio.foto_perfil) {
                if (typeof anuncio.foto_perfil === 'object' && anuncio.foto_perfil.github_path) {
                    fotoPerfil = anuncio.foto_perfil.github_path;
                } else if (typeof anuncio.foto_perfil === 'string') {
                    fotoPerfil = anuncio.foto_perfil;
                }
            }
            
            // Fecha de publicación formateada
            const fechaPublicacion = anuncio.fecha_creacion ? 
                new Date(anuncio.fecha_creacion).toLocaleDateString('es-ES', {
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                }) : 
                'Fecha no disponible';

            return `
            <div class="anuncio-card" data-id="${id}">
                <div class="anuncio-header">
                    <div class="anuncio-perfil">
                        <img src="${fotoPerfil}" alt="Foto de ${nombre}" class="anuncio-perfil-imagen" onerror="this.onerror=null; this.src='images/avatar-placeholder.png';">
                        <div class="anuncio-perfil-info">
                            <h4>${nombre}</h4>
                            <span class="anuncio-fecha">${fechaPublicacion}</span>
                        </div>
                    </div>
                    <span class="categoria-badge"><i class="fas fa-tag"></i> ${categoria}</span>
                </div>
                
                <h3 class="anuncio-titulo">${titulo}</h3>
                
                <div class="anuncio-imagen-container">
                    <img src="${imagenSrc}" alt="Imagen de ${titulo}" class="anuncio-imagen" onerror="this.onerror=null; this.src='/images/placeholder-anuncio.png';">
                </div>
                
                <div class="anuncio-content">
                    <p class="anuncio-descripcion">${descripcion}</p>
                    
                    <div class="anuncio-footer">
                        <button class="like-button" data-anuncio-id="${id}" title="Me gusta">
                            <i class="fas fa-thumbs-up"></i>
                            <span class="likes-count">${likes}</span>
                        </button>
                        
                        <div class="anuncio-contacto">
                            ${anuncio.telefono ? `<a href="tel:${anuncio.telefono}" class="contacto-link"><i class="fas fa-phone"></i></a>` : ''}
                            ${anuncio.email ? `<a href="mailto:${anuncio.email}" class="contacto-link"><i class="fas fa-envelope"></i></a>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            `;
        }).join('');

        // Añadir estilos CSS inline para los nuevos elementos
        const style = document.createElement('style');
        style.textContent = `
            .anuncio-card {
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                margin-bottom: 30px;
                overflow: hidden;
                background: white;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .anuncio-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
            
            .anuncio-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .anuncio-perfil {
                display: flex;
                align-items: center;
            }
            
            .anuncio-perfil-imagen {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid #35a9aa;
                margin-right: 10px;
            }
            
            .anuncio-perfil-info h4 {
                margin: 0;
                font-size: 16px;
                color: #333;
            }
            
            .anuncio-fecha {
                font-size: 12px;
                color: #888;
            }
            
            .categoria-badge {
                background: #f0f8ff;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 12px;
                color: #0249aa;
            }
            
            .anuncio-titulo {
                padding: 15px 15px 10px;
                margin: 0;
                color: #0249aa;
                font-size: 18px;
            }
            
            .anuncio-imagen-container {
                width: 100%;
                height: 250px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .anuncio-imagen {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .anuncio-content {
                padding: 15px;
            }
            
            .anuncio-descripcion {
                margin-top: 0;
                margin-bottom: 15px;
                color: #555;
                line-height: 1.5;
            }
            
            .anuncio-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 10px;
                border-top: 1px solid #f0f0f0;
            }
            
            .like-button {
                background: transparent;
                border: none;
                display: flex;
                align-items: center;
                gap: 5px;
                color: #35a9aa;
                cursor: pointer;
                padding: 5px 10px;
                border-radius: 5px;
                transition: background 0.2s ease;
            }
            
            .like-button:hover {
                background: #f0f8ff;
            }
            
            .liked-animation {
                animation: likeEffect 1s ease;
            }
            
            @keyframes likeEffect {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            .anuncio-contacto {
                display: flex;
                gap: 10px;
            }
            
            .contacto-link {
                color: #666;
                font-size: 16px;
                transition: color 0.2s ease;
            }
            
            .contacto-link:hover {
                color: #35a9aa;
            }
        `;
        
        // Eliminar estilo anterior si existe
        const existingStyle = document.getElementById('anuncios-style');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Añadir id al estilo nuevo y agregarlo al documento
        style.id = 'anuncios-style';
        document.head.appendChild(style);

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
        console.log("🚀 Inicializando página de publicidad");
        
        try {
            // Configurar los listeners del slider si existe
            if (document.querySelector('.slider-nav')) {
                setupSliderNavListeners();
                // Actualizar los indicadores del slider
                updateSliderDots();
            } else {
                console.log("⚠️ No se encontró el elemento slider-nav");
            }
            
            // Configurar el botón de registro si existe
            if (typeof configurarBotonRegistro === 'function') {
                configurarBotonRegistro();
            } else {
                console.log("⚠️ La función configurarBotonRegistro no está disponible");
            }
            
            // Inicializar el formulario si existe
            const formularioPublicidad = document.getElementById("formulario-publicidad");
            if (formularioPublicidad) {
                inicializarFormularioPublicidad();
            } else {
                console.log("⚠️ No se encontró el formulario de publicidad (#formulario-publicidad)");
            }
            
            // Cargar anuncios
            cargarAnuncios();
            
            // Configurar los botones de like después de cargar anuncios
            setTimeout(setupLikeButtonListeners, 1500);
            
            console.log("✅ Página de publicidad inicializada correctamente");
        } catch (error) {
            console.error("❌ Error al inicializar la página:", error);
        }
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

// Función para verificar cédula
async function verificarCedulaPublicidad(cedula, callback) {
    try {
        const backendUrl = window.API_ENDPOINTS?.verificarCedula;
        if (!backendUrl) {
            throw new Error("URL del backend no configurada");
        }
        
        const url = `${backendUrl}/${cedula}`;
        console.log("🔍 Intentando verificar cédula en:", url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'User-Agent': 'sinepub-client'
            }
        });

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
        if (callback) {
            callback({ valid: false, error: error.message });
        }
        throw error;
    }
}

// Función para obtener la URL del backend
function getBackendUrl() {
    // Primero intentar usar la URL desde config.js
    if (window.API_ENDPOINTS && window.API_ENDPOINTS.base) {
        return window.API_ENDPOINTS.base;
    }
    
    // Luego intentar con BACKEND_URL si está definida
    if (window.BACKEND_URL) {
        return window.BACKEND_URL;
    }
    
    // Por último, usar la URL de ngrok estática como fallback
    return 'https://61f8-2800-484-8786-7d00-5963-3db4-73c3-1a5c.ngrok-free.app';
}
