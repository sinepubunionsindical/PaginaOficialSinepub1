// JavaScript para la página de publicidad

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const registrarBtn = document.getElementById('registrar-publicidad');
    const cancelarBtn = document.getElementById('cancelar-registro');
    const formularioSlide = document.getElementById('slide-registro');
    const formulario = document.getElementById('formulario-publicidad');
    const slides = document.querySelectorAll('.slide');
    const navLinks = document.querySelectorAll('.slider-nav a');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');

    // Variable para mantener el índice del slide actual
    let currentSlide = 0;

    // Verificar si el usuario está autenticado y configurar el botón de registro
    function configurarBotonRegistro() {
        const registrarBtn = document.getElementById('registrar-publicidad');
        if (registrarBtn) {
            // Verificar si el usuario está autenticado
            const isUserAuth = localStorage.getItem("afiliado") === "yes";
            // Verificar si el perfil está completo
            const isProfileComplete = localStorage.getItem("perfil_completo") === "true";
            // Verificar si tiene cédula
            const hasCedula = localStorage.getItem("cedula") !== null;
            
            // --- Log de Verificación ---
            console.log("🔧 configurarBotonRegistro: Verificando estado:");
            console.log(`   - localStorage afiliado: ${localStorage.getItem("afiliado")}`);
            console.log(`   - localStorage perfil_completo: ${localStorage.getItem("perfil_completo")}`);
            console.log(`   - isUserAuth: ${isUserAuth}`);
            console.log(`   - isProfileComplete: ${isProfileComplete}`);
            // --- Fin Log ---
            
            // Si el perfil está completo o el usuario está autenticado, debemos habilitarlo
            const isAuthenticated = isUserAuth || isProfileComplete;
            
            if (!isAuthenticated) {
                // Si no está autenticado, deshabilitar el botón y agregar tooltip
                registrarBtn.classList.add('boton-deshabilitado');
                registrarBtn.disabled = true;
                registrarBtn.title = "Debes ser afiliado al sindicato para registrar publicidad";
                
                // Agregar mensaje visual al botón
                registrarBtn.innerHTML = "Registrar Publicidad (Solo Afiliados)";
                
                // Reemplazar el evento click para mostrar mensaje
                registrarBtn.removeEventListener('click', mostrarFormularioRegistro);
                registrarBtn.addEventListener('click', mostrarMensajeAutenticacion);
                
                console.log("🔒 Botón de registro deshabilitado");
            } else {
                // Si está autenticado, mantener funcionalidad normal
                console.log("🔓 Usuario autenticado, habilitando botón de registro");
                registrarBtn.classList.remove('boton-deshabilitado');
                registrarBtn.disabled = false;
                registrarBtn.innerHTML = "Registrar Publicidad";
                
                // Reemplazar eventos
                registrarBtn.removeEventListener('click', mostrarMensajeAutenticacion);
                registrarBtn.addEventListener('click', mostrarFormularioRegistro);
                
                console.log("🔓 Botón de registro habilitado");
            }
        } else {
            console.error("❌ Botón de registro no encontrado en el DOM");
        }
    }

    // Función para mostrar el formulario de registro
    function mostrarFormularioRegistro() {
        console.log("📝 Mostrando formulario de registro");
        // Ocultar todos los slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Mostrar el slide del formulario
        const formularioSlide = document.getElementById('slide-registro');
        if (formularioSlide) {
            formularioSlide.style.display = 'block';
            formularioSlide.classList.add('active');
        }

        // Quitar la clase active de todos los enlaces de navegación
        const navLinks = document.querySelectorAll('.slider-nav a');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
    }

    // Función para mostrar mensaje cuando no está autenticado
    function mostrarMensajeAutenticacion(e) {
        e.preventDefault();
        console.log("⚠️ Intento de registro sin autenticación");
        alert("Debes ser afiliado al sindicato para registrar publicidad. Por favor, accede desde la página principal.");
        return false;
    }

    // Inicializar la página mostrando el primer slide
    function initPage() {
        console.log("🚀 Inicializando página de publicidad...");
        
        // Aplicar fade-in al cargar
        document.body.classList.remove('fade-out');
        document.body.classList.add('fade-in');

        // Asegurarse de que el primer slide esté activo
        updateSlide(0);

        // Inicializar los puntos de navegación
        updateSliderDots();
        
        // Configurar el botón de registro según autenticación
        configurarBotonRegistro();
        
        // Configurar botones de email
        configurarBotonesEmail();
    }

    // Función para actualizar el slide activo
    function updateSlide(slideIndex) {
        // Asegurar que el índice esté dentro de los límites
        if (slideIndex < 0) {
            slideIndex = slides.length - 1;
        } else if (slideIndex >= slides.length) {
            slideIndex = 0;
        }

        // Ocultar todos los slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Mostrar el slide correspondiente
        slides[slideIndex].classList.add('active');

        // Actualizar el índice actual
        currentSlide = slideIndex;

        // Actualizar los enlaces de navegación
        updateNavLinks(slideIndex);

        // Actualizar los puntos de navegación
        updateSliderDots();
    }

    // Función para actualizar los enlaces de navegación
    function updateNavLinks(slideIndex) {
        // Quitar la clase active de todos los enlaces
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Agregar la clase active al enlace correspondiente
        // Los data-slide comienzan en 1, pero los índices de los slides comienzan en 0
        const activeLink = Array.from(navLinks).find(link => {
            return parseInt(link.getAttribute('data-slide')) === slideIndex + 1;
        });

        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Ocultar el formulario cuando se hace clic en "Cancelar"
    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', function() {
            // Ocultar el slide del formulario
            formularioSlide.style.display = 'none';
            formularioSlide.classList.remove('active');

            // Mostrar el primer slide (Inicio)
            updateSlide(0);
        });
    }

    // Función para inicializar el formulario de publicidad
    function inicializarFormularioPublicidad() {
        const formulario = document.getElementById('formulario-publicidad');
        const emailInput = document.getElementById('email');
        const btnEmailPerfil = document.getElementById('usar-email-perfil');
        const btnCancelar = document.getElementById('btn-cancelar');
        const btnCerrar = document.getElementById('btn-cerrar');

        // Manejar el envío del formulario
        formulario.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Mostrar indicador de carga
            const submitBtn = document.getElementById('btn-guardar');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            try {
                // Recopilar datos del formulario
                const formData = new FormData(formulario);
                const formDataObj = {};

                // Procesar todos los campos excepto la imagen
                formData.forEach((value, key) => {
                    if (key !== 'imagen') {
                        formDataObj[key] = value;
                    }
                });

                // Agregar el nombre del usuario desde el localStorage
                formDataObj.nombre = localStorage.getItem("nombre");

                // Procesar la imagen si existe
                const imagenInput = document.getElementById('imagen');
                if (imagenInput.files && imagenInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        formDataObj.imagen_base64 = e.target.result;
                        await enviarPublicidad(formDataObj);
                    };
                    reader.readAsDataURL(imagenInput.files[0]);
                } else {
                    await enviarPublicidad(formDataObj);
                }
            } catch (error) {
                console.error('Error al procesar el formulario:', error);
                mostrarNotificacion('error', 'Error al procesar el formulario');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });

        // Manejar el botón de cancelar
        btnCancelar.addEventListener('click', () => {
            limpiarFormulario();
            document.getElementById('formulario-container').style.display = 'none';
        });

        // Manejar el botón de cerrar
        btnCerrar.addEventListener('click', () => {
            limpiarFormulario();
            document.getElementById('formulario-container').style.display = 'none';
        });

        // Usar email del perfil
        btnEmailPerfil.addEventListener('click', () => {
            const emailPerfil = localStorage.getItem("email");
            if (emailPerfil) {
                emailInput.value = emailPerfil;
            }
        });
    }

    // Función para enviar datos al backend
    function enviarDatosAlBackend(datos, submitBtn, originalBtnText) {
        console.log("🔄 Iniciando envío de datos al backend");
        
        // Obtener los elementos del DOM que necesitamos manipular
        const submitButton = submitBtn;
        const originalButtonText = originalBtnText;
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
        
        // Determinar la URL del backend según el modo (debug/producción)
        const backendUrl = window.API_ENDPOINTS ? window.API_ENDPOINTS.publicidad : 'http://localhost:8000/api/publicidad';
        console.log("🔄 URL del backend:", backendUrl);
        
        // Verificar primero si el servidor está respondiendo
        fetch(backendUrl, { method: 'OPTIONS' })
            .then(response => {
                console.log("✅ Servidor backend disponible. Enviando datos...");
                enviarPublicidad(datos, backendUrl, submitButton, originalButtonText);
            })
            .catch(error => {
                console.error("🚨 Error al conectar con el servidor:", error);
                alert("No se pudo conectar con el servidor. Verifica tu conexión a internet y que el servidor esté activo.");
                // Restaurar el botón
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
    }

    // Función para enviar la publicidad al servidor
    async function enviarPublicidad(datos, backendUrl, submitButton, originalButtonText) {
        try {
            // Preparar los datos para el envío
            const datosParaEnviar = {
                nombre: datos.nombre,
                descripcion: datos.descripcion,
                fecha: new Date().toISOString(),
                estado: "pendiente",
                imagen_base64: datos.imagen_base64 || null,
                contacto: {
                    email: datos.email,
                    telefono: datos.telefono
                }
            };

            // Realizar la petición POST
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datosParaEnviar)
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData.success) {
                console.log("✅ Publicidad enviada correctamente:", responseData);
                mostrarMensajeExito();
                limpiarFormulario();
            } else {
                throw new Error(responseData.mensaje || "Error al procesar la solicitud");
            }
        } catch (error) {
            console.error("🚨 Error al enviar publicidad:", error);
            mostrarMensajeError(error.message);
        } finally {
            // Restaurar el botón
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    }

    // Función para mostrar mensaje de éxito
    function mostrarMensajeExito() {
        const mensajeExito = document.createElement('div');
        mensajeExito.className = 'mensaje-exito';
        mensajeExito.innerHTML = `
            <h3>✅ ¡Solicitud enviada correctamente!</h3>
            <p>Tu solicitud de publicidad ha sido recibida y está pendiente de aprobación.</p>
            <p>Te notificaremos cuando sea revisada.</p>
        `;
        
        document.querySelector('.formulario-container').appendChild(mensajeExito);
        
        // Remover el mensaje después de 5 segundos
        setTimeout(() => {
            mensajeExito.remove();
        }, 5000);
    }

    // Función para mostrar mensaje de error
    function mostrarMensajeError(mensaje) {
        const mensajeError = document.createElement('div');
        mensajeError.className = 'mensaje-error';
        mensajeError.innerHTML = `
            <h3>❌ Error al enviar la solicitud</h3>
            <p>${mensaje}</p>
            <p>Por favor, intenta nuevamente más tarde.</p>
        `;
        
        document.querySelector('.formulario-container').appendChild(mensajeError);
        
        // Remover el mensaje después de 5 segundos
        setTimeout(() => {
            mensajeError.remove();
        }, 5000);
    }

    // Función para limpiar el formulario
    function limpiarFormulario() {
        const formulario = document.querySelector('#formulario-publicidad');
        if (formulario) {
            formulario.reset();
            // Limpiar la vista previa de la imagen si existe
            const previewContainer = document.querySelector('#imagen-preview-container');
            if (previewContainer) {
                previewContainer.innerHTML = '';
            }
        }
    }

    // Configurar los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            // Obtener el índice del slide desde el atributo data-slide
            const slideIndex = parseInt(this.getAttribute('data-slide')) - 1;

            // Actualizar el slide
            updateSlide(slideIndex);
        });
    });

    // Configurar los botones de navegación prev/next
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            updateSlide(currentSlide - 1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function() {
            updateSlide(currentSlide + 1);
        });
    }

    // Función para actualizar los puntos de navegación (ahora vacía ya que los hemos ocultado)
    function updateSliderDots() {
        // No hacemos nada ya que los dots están ocultos
        return;
    }

    // Función para configurar los botones de email
    function configurarBotonesEmail() {
        const btnEmailPerfil = document.getElementById('usar-email-perfil');
        const btnEmailDiferente = document.getElementById('usar-email-diferente');
        const emailInput = document.getElementById('email');
        
        if (btnEmailPerfil && btnEmailDiferente && emailInput) {
            // Verificar si hay email guardado
            const emailGuardado = localStorage.getItem("email");
            
            // Inicialmente, mostrar el campo de email y ocultar el botón "usar otro"
            if (emailGuardado) {
                emailInput.value = emailGuardado;
                btnEmailDiferente.style.display = 'inline-block';
            } else {
                // Si no hay email guardado, mostrar el campo vacío
                emailInput.value = '';
                btnEmailDiferente.style.display = 'none';
            }
            
            // Manejar clic en "Usar email de mi perfil"
            btnEmailPerfil.addEventListener('click', function() {
                const emailPerfil = localStorage.getItem("email");
                if (emailPerfil) {
                    emailInput.value = emailPerfil;
                    btnEmailDiferente.style.display = 'inline-block';
                } else {
                    alert("No tienes un email guardado en tu perfil. Por favor, actualiza tu perfil primero.");
                    emailInput.focus();
                    btnEmailDiferente.style.display = 'none';
                }
            });
            
            // Manejar clic en "Usar otro email"
            btnEmailDiferente.addEventListener('click', function() {
                emailInput.value = '';
                emailInput.focus();
            });
        }
    }

    // Función para dar like a un anuncio
    async function darLike(anuncioId) {
        try {
            const button = document.querySelector(`.anuncio-card[data-id="${anuncioId}"] .like-button`);
            const likesCount = button.querySelector('.likes-count');
            
            // Deshabilitar el botón temporalmente
            button.disabled = true;
            
            const response = await fetch(`${backendUrl}/like/${anuncioId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al dar like');
            }

            const data = await response.json();
            
            // Actualizar el contador de likes
            likesCount.textContent = data.likes;
            
            // Añadir clase para animación
            button.classList.add('liked');
            
            // Remover la clase después de la animación
            setTimeout(() => {
                button.classList.remove('liked');
                button.disabled = false;
            }, 1000);

        } catch (error) {
            console.error('Error al dar like:', error);
            alert('No se pudo registrar el like');
        }
    }

    // Inicializar la página
    initPage();
    
    // Si el estado de autenticación cambia (por ejemplo, después de iniciar sesión en otra pestaña)
    window.addEventListener('storage', function(e) {
        if (e.key === 'afiliado' || e.key === 'nombre' || e.key === 'cedula') {
            console.log("📣 Storage cambió, reconfigurando botón de registro");
            configurarBotonRegistro();
        }
    });

    // Exponer la función para que slider.js pueda llamarla si es necesario
    window.updatePublicidadSliderDots = updateSliderDots;
    
    // Exponer configurarBotonRegistro globalmente para que auth-popup.js pueda llamarla
    window.configurarBotonRegistro = configurarBotonRegistro;
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    inicializarFormularioPublicidad();
});

// Configuración de la URL del backend
const backendUrl = window.API_ENDPOINTS ? window.API_ENDPOINTS.publicidad : "http://localhost:8000/api/publicidad";

// Función para enviar la publicidad al backend
async function enviarPublicidad(datos) {
    try {
        const submitButton = document.getElementById('btn-guardar');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;

        console.log("✅ Enviando datos al servidor:", datos);
        
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const responseData = await response.json();
        
        if (responseData.success) {
            console.log("✅ Publicidad registrada exitosamente");
            alert("¡Publicidad registrada exitosamente!");
            
            // Limpiar formulario y cerrar
            limpiarFormulario();
            document.getElementById('formulario-container').style.display = 'none';
            
            // Recargar los anuncios para mostrar el nuevo
            cargarAnuncios();
        } else {
            throw new Error(responseData.error || 'Error al registrar la publicidad');
        }

    } catch (error) {
        console.error("🚨 Error al enviar publicidad:", error);
        alert("Error al registrar la publicidad. Por favor, intenta nuevamente.");
    } finally {
        // Restaurar el botón
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    }
}

// Función para limpiar el formulario
function limpiarFormulario() {
    const formulario = document.getElementById('formulario-publicidad');
    formulario.reset();
    
    // Limpiar la vista previa de la imagen
    const preview = document.getElementById('preview');
    if (preview) {
        preview.style.display = 'none';
        preview.src = '';
    }
    
    // Mostrar el placeholder de la imagen
    const placeholder = document.querySelector('.imagen-placeholder');
    if (placeholder) {
        placeholder.style.display = 'block';
    }
}

// Función para cargar los anuncios existentes
async function cargarAnuncios() {
    try {
        const response = await fetch(backendUrl);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        actualizarVistaAnuncios(data.anuncios);
    } catch (error) {
        console.error("🚨 Error al cargar anuncios:", error);
    }
}

// Función para actualizar la vista de anuncios
function actualizarVistaAnuncios(anuncios) {
    const contenedorAnuncios = document.querySelector('.anuncios-container');
    if (!contenedorAnuncios) return;

    contenedorAnuncios.innerHTML = anuncios.map(anuncio => `
        <div class="anuncio-card" data-id="${anuncio.id}">
            <img src="${anuncio.imagen_base64 || 'placeholder.jpg'}" alt="${anuncio.titulo}">
            <div class="anuncio-content">
                <h3>${anuncio.titulo}</h3>
                <p>${anuncio.descripcion}</p>
                <div class="anuncio-footer">
                    <span class="categoria">${anuncio.categoria}</span>
                    <button class="like-button" onclick="darLike('${anuncio.id}')">
                        <i class="fas fa-thumbs-up"></i>
                        <span class="likes-count">${anuncio.likes || 0}</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el formulario
    inicializarFormularioPublicidad();
    
    // Cargar anuncios existentes
    cargarAnuncios();
    
    // Verificar autenticación y configurar botón de registro
    configurarBotonRegistro();
});

