async function verificarConexionBackend() {
    const backendUrl = window.API_ENDPOINTS?.base || window.BACKEND_URL || 'http://localhost:8000';

    try {
        const response = await fetch(`${backendUrl}/api/ping`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'User-Agent': 'sinepub-client'
            }
        });

        if (!response.ok) throw new Error("Respuesta inválida");

        const data = await response.json();
        return data?.status === 'ok';

    } catch (error) {
        console.warn('🔴 No hay conexión con el backend:', error.message);
        return false;
    }
}

function showDataConsentPopup() {
    console.log("📊 Mostrando popup de consentimiento de datos...");

    const existingPopup = document.getElementById("data-consent-popup");
    if (existingPopup) {
        console.log("📊 Popup de consentimiento ya está abierto.");
        return;
    }

    const popup = document.createElement("div");
    popup.id = "data-consent-popup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "white";
    popup.style.padding = "30px";
    popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    popup.style.zIndex = "10000";
    popup.style.borderRadius = "8px";
    popup.style.textAlign = "left";
    popup.style.maxWidth = "600px";
    popup.style.width = "90%";

    popup.innerHTML = `
        <h3 style="color: #0249aa; text-align: center;">Consentimiento para el Tratamiento de Datos Personales</h3>
        <p>Estimado usuario, para acceder al servicio de chat y verificar su afiliación al sindicato SINEPUB HUV, necesitamos recopilar y procesar ciertos datos personales:</p>
        <ul style="margin-left: 20px;">
            <li>Número de cédula (para verificar su afiliación)</li>
            <li>Nombre completo (proporcionado por nuestro sistema)</li>
            <li>Correo electrónico (si decide completar su perfil)</li>
            <li>Foto de perfil (opcional al completar su perfil)</li>
        </ul>
        <p>Estos datos serán utilizados exclusivamente para:</p>
        <ul style="margin-left: 20px;">
            <li>Verificar su afiliación al sindicato</li>
            <li>Personalizar su experiencia en la plataforma</li>
            <li>Brindarle acceso a servicios exclusivos para afiliados</li>
        </ul>
        <p>
            Sus datos serán tratados conforme a la Ley 1581 de 2012 (Habeas Data) y nuestras 
            <a href="#" id="open-privacy-policy" style="color: #0249aa; font-weight: bold;">Políticas de Privacidad</a>.
        </p>
        <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
            <button id="consent-accept-btn" style="background-color: #35a9aa; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Aceptar y Continuar</button>
            <button id="consent-cancel-btn" style="background-color: #f44336; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Cancelar</button>
        </div>
    `;

    document.body.appendChild(popup);

    document.getElementById("consent-accept-btn").addEventListener("click", function() {
        popup.remove();
        showAuthenticationPopup(); // Esto ya estaba en tu flujo
    });

    document.getElementById("consent-cancel-btn").addEventListener("click", function() {
        popup.remove();
        console.log("📊 Usuario canceló el consentimiento de datos");
    });

    // 🎯 NUEVO: Mostrar ventana emergente de políticas de privacidad
    document.getElementById("open-privacy-policy").addEventListener("click", function (e) {
        e.preventDefault();
        mostrarPopupPoliticasPrivacidad(); // Función que falta definir abajo
    });
}

// NUEVA FUNCIÓN: Popup para mostrar las Políticas de Privacidad
function mostrarPopupPoliticasPrivacidad() {
    const existingModal = document.getElementById("privacy-policy-popup");
    if (existingModal) return;

    const modal = document.createElement("div");
    modal.id = "privacy-policy-popup";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    modal.style.zIndex = "10001";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";

    const content = document.createElement("div");
    content.style.background = "#fff";
    content.style.padding = "25px";
    content.style.maxWidth = "700px";
    content.style.width = "90%";
    content.style.borderRadius = "8px";
    content.style.overflowY = "auto";
    content.style.maxHeight = "80vh";
    content.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
    content.innerHTML = `
        <h2 style="color: #0249aa; text-align:center;">Políticas de Privacidad</h2>
        <div id="contenido-politica-privacidad">
            <!-- Aquí insertas el contenido que me vas a mandar -->
            <p><em>Cargando contenido...</em></p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
            <button id="cerrar-privacidad" style="background: #0249aa; color: white; padding: 10px 20px; border: none; border-radius: 5px;">Cerrar</button>
        </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    document.getElementById("cerrar-privacidad").addEventListener("click", () => {
        modal.remove();
    });

    // 🔄 Cargar contenido (te lo agrego apenas me lo mandes)
    const contenido = document.getElementById("contenido-politica-privacidad");
    if (contenido) {
        contenido.innerHTML = `
            <p><strong>Ejemplo temporal:</strong> Estas políticas explican cómo usamos, almacenamos y protegemos sus datos personales conforme a la Ley 1581 de 2012. [Aquí se cargará el contenido completo que me vas a mandar.]</p>
        `;
    }
}


// Función para mostrar el Popup de autenticación (renombrada la original)
function showAuthenticationPopup() {
    console.log(" Intentando mostrar el popup de autenticación...");
    console.trace('Traza de la llamada a showAuthenticationPopup');

    try {
        const existingPopup = document.getElementById("auth-popup");
        if (existingPopup) {
            console.log(" Popup ya está abierto.");
            return;
        }

        console.log('Creando nuevo popup de autenticación...');

        const popup = document.createElement("div");
        popup.id = "auth-popup";
        popup.style.position = "fixed";
        popup.style.top = "50%";
        popup.style.left = "50%";
        popup.style.transform = "translate(-50%, -50%)";
        popup.style.background = "white";
        popup.style.padding = "20px";
        popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
        popup.style.zIndex = "10000";
        popup.style.borderRadius = "8px";
        popup.style.textAlign = "center";

        popup.innerHTML = `
            <h3>Acceso Restringido, Solo Afiliados</h3>
            <p>Ingrese su número de cédula para continuar</p>
            <input type="text" id="cedula-input" placeholder="Cédula">
            <button id="verificar-cedula-btn">Verificar</button>
            <button id="cerrar-popup-btn">Cerrar</button>
        `;

        document.body.appendChild(popup);
        console.log(" Popup de autenticación añadido al DOM.");

        // Agregar event listeners a los botones
        document.getElementById('verificar-cedula-btn').addEventListener('click', function() {
            const cedula = document.getElementById('cedula-input').value;
            verifyCedula(cedula);
        });

        document.getElementById('cerrar-popup-btn').addEventListener('click', function() {
            document.getElementById('auth-popup').remove();
        });

        // Permitir enviar con Enter
        document.getElementById('cedula-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const cedula = document.getElementById('cedula-input').value;
                verifyCedula(cedula);
            }
        });
    } catch (error) {
        console.error('Error al crear el popup:', error);
    }
}

// Función para mostrar el Popup de autenticación - punto de entrada original
function showAuthPopup() {
    // Ahora muestra primero el popup de consentimiento
    showDataConsentPopup();
}

// Verificación de cédula
function verifyCedula(cedula) {
    console.log("Verificando cédula:", cedula);

    if (!cedula) {
        alert("Por favor ingrese un número de cédula válido");
        return;
    }

    // Guardar cédula en localStorage para que publicidad.js pueda accederla
    localStorage.setItem("cedula", cedula);

    // Verificar si config.js está cargado
    if (!window.API_ENDPOINTS) {
        // Cargar config.js primero
        const configScript = document.createElement('script');
        configScript.src = 'config.js';
        configScript.onload = function() {
            // Después cargar publicidad.js
            const script = document.createElement('script');
            script.src = 'publicidad.js';
            script.onload = function() {
                window.verificarCedulaPublicidad(cedula, handleVerificacionResult);
            };
            document.head.appendChild(script);
        };
        document.head.appendChild(configScript);
    } else if (typeof window.verificarCedulaPublicidad === 'undefined') {
        // Si config.js ya está cargado pero publicidad.js no
        const script = document.createElement('script');
        script.src = 'publicidad.js';
        script.onload = function() {
            window.verificarCedulaPublicidad(cedula, handleVerificacionResult);
        };
        document.head.appendChild(script);
    } else {
        // Si ambos scripts ya están cargados
        window.verificarCedulaPublicidad(cedula, handleVerificacionResult);
    }
}

// Callback para manejar el resultado de la verificación
function handleVerificacionResult(result) {
    if (result.valid) {
        let mensajeBienvenida = `<h2>Bienvenido al Sindicato</h2>
                                <p>Nombre: ${result.nombre}</p>
                                <p>Cargo: ${result.cargo}</p>`;
        mostrarPopupContrasena(result.nombre, result.cargo, mensajeBienvenida);
    } else {
        
    }
}

// Función para cerrar el popup de autenticación
function closeAuthPopup() {
    const authPopup = document.getElementById("auth-popup");
    if (authPopup) {
        authPopup.remove();
    }
}

// Función para mostrar el popup de contraseña
function mostrarPopupContrasena(nombre, cargo, mensajeBienvenida) {
    const popupContrasena = document.createElement("div");
    popupContrasena.id = "popup-contrasena";
    popupContrasena.style.position = "fixed";
    popupContrasena.style.top = "50%";
    popupContrasena.style.left = "50%";
    popupContrasena.style.transform = "translate(-50%, -50%)";
    popupContrasena.style.background = "#ffffff";
    popupContrasena.style.color = "#000000";
    popupContrasena.style.padding = "25px";
    popupContrasena.style.borderRadius = "10px";
    popupContrasena.style.textAlign = "center";
    popupContrasena.style.width = "400px";
    popupContrasena.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
    popupContrasena.style.zIndex = "10000";

    popupContrasena.innerHTML = `
        <h3> Verificación Adicional</h3>
        <p>${nombre}, por favor ingresa la contraseña maestra para continuar.</p>
        <input type="password" id="input-contrasena" placeholder="Contraseña">
        <br><br>
        <button id="verificar-contrasena">Verificar</button>
        <button id="cancelar-contrasena">Cancelar</button>
    `;

    document.body.appendChild(popupContrasena);

    let intentosRestantes = 2;

    document.getElementById("verificar-contrasena").addEventListener("click", async () => {
        const contrasena = document.getElementById("input-contrasena").value;
        const codigoSecreto = localStorage.getItem("codigo_secreto");
        const cedula = localStorage.getItem("cedula");

        if (contrasena === codigoSecreto) {
            popupContrasena.remove();
            localStorage.setItem("afiliado_autenticado", "true");

            console.log("🔍 Verificando estado del perfil en el backend para cédula:", cedula);

            try {
                // Mostrar indicador de carga      
                const loadingPopup = document.createElement("div");
                loadingPopup.id = "loading-popup";
                loadingPopup.style.position = "fixed";
                loadingPopup.style.top = "50%";
                loadingPopup.style.left = "50%";
                loadingPopup.style.transform = "translate(-50%, -50%)";
                loadingPopup.style.background = "rgba(255, 255, 255, 0.9)";
                loadingPopup.style.padding = "20px";
                loadingPopup.style.borderRadius = "10px";
                loadingPopup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
                loadingPopup.style.zIndex = "10001";
                loadingPopup.style.textAlign = "center";
                loadingPopup.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #35a9aa; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                        <p style="margin-top: 10px;">Verificando tu perfil...</p>
                    </div>
                    <style>
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    </style>
                `;
                document.getElementById("auth-popup")?.remove(); // ✅ Oculta popup de cédula si aún está presente
                document.body.appendChild(loadingPopup);

                const verificarPerfil = async () => {
                    try {
                        const perfilResponse = await fetch(`${getBackendUrl()}/api/perfil/${cedula}`, {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'ngrok-skip-browser-warning': 'true', // Para evitar la página de advertencia de ngrok
                                'User-Agent': 'sinepub-client' // Identificar la solicitud
                            }
                        });
                
                        if (!perfilResponse.ok) throw new Error("Error al obtener perfil");
                
                        const perfilData = await perfilResponse.json();
                        console.log("📊 Datos recibidos de /api/perfil:", perfilData);
                
                        const perfilCompletoBackend = perfilData.perfil_completo === true;
                        const perfilCompletoLocal = localStorage.getItem("perfil_completo") === "true";
                        
                        if (perfilCompletoBackend || perfilCompletoLocal) {
                            console.log("✅ Perfil marcado como completo en backend o localStorage.");
                            localStorage.setItem('perfil_completo', 'true');
                            localStorage.setItem('afiliado', 'yes');
                        
                            const datos = perfilData.datos || {};
                            if (datos.nombre) localStorage.setItem('nombre', datos.nombre);
                            if (datos.correo) {
                                localStorage.setItem('correo', datos.correo);
                                localStorage.setItem('email', datos.correo);
                            }
                            if (datos.foto && datos.foto.backend_path) {
                                localStorage.setItem('foto_ruta', datos.foto.backend_path);
                            }
                        
                            document.getElementById("loading-popup")?.remove();
                            mostrarPopupBienvenidaPersonalizado();
                            return;
                        }
                        
                        // Si no está completo ni en backend ni en localStorage
                        document.getElementById("loading-popup")?.remove();
                        mostrarFormularioCompletarPerfilObligatorio(cedula, nombre);                   
                
                    } catch (error) {
                        console.error("❌ Error al verificar el perfil:", error);
                
                        // ✅ CRÍTICO: limpia el popup incluso en error
                        document.getElementById("loading-popup")?.remove();
                
                        if (localStorage.getItem("perfil_completo") === "true") {
                            mostrarPopupBienvenidaPersonalizado();
                            return;
                        }
                
                        mostrarFormularioCompletarPerfilObligatorio(cedula, nombre);
                    }
                };
                

                await verificarPerfil();

            } catch (error) {
                console.error("❌ Error crítico al verificar el perfil:", error);
                document.getElementById("loading-popup")?.remove();
                mostrarFormularioCompletarPerfilObligatorio(cedula, nombre);
            }

        } else {
            intentosRestantes--;
            popupContrasena.remove();

            if (intentosRestantes > 0) {
                alert(` Contraseña incorrecta. Te queda ${intentosRestantes} intento.`);
                mostrarPopupContrasena(nombre, cargo, mensajeBienvenida);
            } else {
                alert(" No eres afiliado al sindicato. Recuerda que la suplantación de identidad tiene consecuencias penales.");
                bloquearBoton();
            }
        }
    });

    document.getElementById("cancelar-contrasena").addEventListener("click", function () {
        popupContrasena.remove();
    });
}


// Nueva función para mostrar el popup de bienvenida simple (sin opciones de completar/omitir)
function mostrarPopupBienvenidaSimple(mensaje) {
    console.log("✅ Mostrando popup de bienvenida simple...");
    
    const popupBienvenida = document.createElement("div");
    popupBienvenida.id = "popup-bienvenida";
    popupBienvenida.style.position = "fixed";
    popupBienvenida.style.top = "50%";
    popupBienvenida.style.left = "50%";
    popupBienvenida.style.transform = "translate(-50%, -50%)";
    popupBienvenida.style.background = "#35a9aa"; // Verde aguamarina
    popupBienvenida.style.color = "#0249aa"; // Azul para el texto
    popupBienvenida.style.padding = "30px";
    popupBienvenida.style.borderRadius = "10px";
    popupBienvenida.style.textAlign = "center";
    popupBienvenida.style.width = "500px";
    popupBienvenida.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
    popupBienvenida.style.zIndex = "10000";

    popupBienvenida.innerHTML = `
        <h2>Acceso Verificado</h2>
        ${mensaje}
        <p>¡Bienvenido de nuevo! Ahora puedes usar nuestro asistente virtual.</p>
        <button id="aceptar-btn" style="
            background-color: #0249aa;
            color: white;
            font-size: 16px;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease-in-out;">
            Aceptar
        </button>
    `;

    document.body.appendChild(popupBienvenida);

    // Evento para el botón de aceptar
    const botonAceptar = document.getElementById("aceptar-btn");
    botonAceptar.addEventListener("mouseenter", function() {
        this.style.backgroundColor = "#03306b";
    });
    
    botonAceptar.addEventListener("mouseleave", function() {
        this.style.backgroundColor = "#0249aa";
    });
    
    botonAceptar.addEventListener("click", function() {
        popupBienvenida.remove();
        // Activar el chatbot directamente
        mostrarPopupBienvenidaPersonalizado();
    });

    // Ocultar el popup de autenticación si aún existe
    const authPopup = document.getElementById("auth-popup");
    if (authPopup) {
        authPopup.remove();
    }
}

// Función para mostrar el formulario de completar perfil obligatorio (sin opción de omitir)
function mostrarFormularioCompletarPerfilObligatorio(cedula, nombre) {
    console.log("📝 Mostrando formulario obligatorio para completar perfil");
    
    const existingPopup = document.getElementById("auth-popup");
    if (existingPopup) {
        existingPopup.remove();
    }
    
    const popup = document.createElement("div");
    popup.id = "auth-popup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "white";
    popup.style.padding = "20px";
    popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    popup.style.zIndex = "10000";
    popup.style.borderRadius = "8px";
    popup.style.width = "400px";
    popup.style.textAlign = "center";

    popup.innerHTML = `
        <h3>Completa tu perfil para continuar</h3>
        <p>Para brindarte una mejor experiencia y un acceso completo, necesitamos que completes tu perfil. Estos datos se guardan de forma segura en nuestro servidor.</p>
        
        <div id="profile-panel">
            <div style="margin-bottom: 15px;">
                <label for="nombre">Nombre completo:</label>
                <input type="text" id="nombre" value="${nombre || ''}" placeholder="Tu nombre completo" required>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label for="correo">Correo electrónico:</label>
                <input type="email" id="correo" placeholder="tu@correo.com" required>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label for="telefono">Número de teléfono (opcional):</label>
                <input type="tel" id="telefono" placeholder="Tu número de teléfono">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label>Foto de perfil:</label>
                <div style="display: flex; align-items: center; justify-content: center; margin-top: 10px;">
                    <img id="user-photo-preview" src="" alt="Foto de perfil" style="width: 100px; height: 100px; border-radius: 50%; border: 1px solid #ccc; object-fit: cover; display: none;">
                    <input type="file" id="user-photo" accept="image/*" style="display: block; margin: 10px auto;">
                </div>
            </div>
            
            <button id="guardar-perfil-btn">Guardar Perfil</button>
        </div>
    `;

    document.body.appendChild(popup);
    
    // Obtener correo de localStorage si existe
    const correo = localStorage.getItem("correo");
    if (correo) {
        document.getElementById('correo').value = correo;
    }
    
    // Obtener teléfono de localStorage si existe
    const telefono = localStorage.getItem("telefono");
    if (telefono) {
        document.getElementById('telefono').value = telefono;
    }
    
    // Evento para previsualizar la imagen seleccionada
    document.getElementById('user-photo').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.getElementById('user-photo-preview');
                preview.src = event.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Evento para guardar el perfil
    let guardarBtn = document.getElementById('guardar-perfil-btn');
    
    if (guardarBtn) {
        // Clonar para limpiar listeners
        const newGuardarBtn = guardarBtn.cloneNode(true);
        guardarBtn.parentNode.replaceChild(newGuardarBtn, guardarBtn);
        guardarBtn = newGuardarBtn;
        
        guardarBtn.addEventListener('click', function() {
            // Validación de campos obligatorios
            const nombreValue = document.getElementById('nombre').value;
            const correoValue = document.getElementById('correo').value;
            
            if (!nombreValue || !correoValue) {
                alert('Por favor completa los campos obligatorios: Nombre y Correo electrónico');
                return;
            }
            
            // Deshabilitar botón mientras se guarda
            guardarBtn.disabled = true;
            guardarBtn.textContent = 'Guardando...';
            
            const telefonoValue = document.getElementById('telefono').value;
            const fotoPreview = document.getElementById('user-photo-preview');
            const fotoValue = fotoPreview.style.display !== 'none' ? fotoPreview.src : '';
            
            // Guardar en localStorage para uso temporal
            if (telefonoValue) {
                localStorage.setItem('telefono', telefonoValue);
            }
            
            // Enviar datos al backend
            const datos = {
                cedula: cedula,
                nombre: nombreValue,
                correo: correoValue,
                telefono: telefonoValue,
                foto: fotoValue
            };
            
            fetch(`${getBackendUrl()}/actualizar_perfil`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datos)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Actualizar localStorage con todos los datos
                    localStorage.setItem('nombre', nombreValue);
                    localStorage.setItem('correo', correoValue);
                    localStorage.setItem('email', correoValue);
                    localStorage.setItem('perfil_completo', 'true');
                    localStorage.setItem('afiliado', 'yes');
                    if (telefonoValue) {
                        localStorage.setItem('telefono', telefonoValue);
                    }
                    if (data.foto_url) {
                        localStorage.setItem('foto_ruta', data.foto_url);
                    }
                    
                    // Cerrar el popup del formulario
                    popup.remove();
                    
                    // Mostrar mensaje de éxito y activar chatbot
                    const mensajeExito = `
                        <h2>¡Perfil Completado!</h2>
                        <p>Gracias por completar tu perfil. Ahora puedes disfrutar de todos los beneficios.</p>
                    `;
                    mostrarPopupBienvenidaSimple(mensajeExito);
                } else {
                    throw new Error(data.error || 'Error al actualizar el perfil');
                }
            })
            .catch(error => {
                console.error('Error al actualizar perfil:', error);
                alert('Ha ocurrido un error al actualizar tu perfil. Por favor intenta nuevamente.');
                guardarBtn.disabled = false;
                guardarBtn.textContent = 'Guardar Perfil';
            });
        });
    }
}

// Función para bloquear el botón en caso de acceso denegado
function bloquearBoton() {
    const chatButton = document.getElementById("chatbot-button");
    if (chatButton) {
        chatButton.style.backgroundColor = "red";
        chatButton.style.color = "white";
        chatButton.style.cursor = "not-allowed";
        chatButton.innerText = " No eres afiliado al sindicato";
        chatButton.disabled = true;

        // Guardar en LocalStorage que falló la validación
        localStorage.setItem("afiliado", "no");
    }
}

// Función para activar el chatbot después de cerrar el popup
function activarChatbot() {
    console.log(" 🎙️ Activando chatbot con IA desde auth-popup.js...");

    const botonChat = document.getElementById("chatbot-button");
    const linkEstatutos = document.getElementById("estatutos-link");
    const linkEstatutosMobile = document.getElementById("estatutos-link-mobile");
    const linkModulos = document.getElementById("modulos-link");
    const linkAfiliacion = document.getElementById("afiliacion-link");
    const videoContainer = document.getElementById("ai-video-container");
    const contenedorChatbot = document.getElementById("chatbot-container");
    const botonFlotante = document.getElementById("boton-flotante");

    // Ocultar botón y mostrar/ocultar enlaces
    if (botonChat) {
        botonChat.style.display = "none";
        console.log(" Botón de chat original ocultado");
    }
    
    if (linkEstatutos) linkEstatutos.style.display = "inline";
    if (linkEstatutosMobile) linkEstatutosMobile.style.display = "block";
    if (linkModulos) linkModulos.style.display = "inline";
    if (linkAfiliacion) linkAfiliacion.style.display = "none";

    // En lugar de configurar el contenedor chatbot directamente, usamos createChatButton
    try {
        console.log(" Creando botón flotante de chat con createChatButton()...");
        // Verificar si la función existe en el ámbito global
        if (typeof window.createChatButton === 'function') {
            window.createChatButton();
            console.log(" Botón de chat creado correctamente");
        } else {
            console.error(" La función createChatButton no está disponible globalmente");
            // Fallback a crearBotonFlotante nativo
            crearBotonFlotante();
        }
    } catch (error) {
        console.error(" Error al crear el botón de chat:", error);
        // Fallback a crearBotonFlotante nativo
        crearBotonFlotante();
    }
}

// Función para crear el botón flotante de chat si no existe
function crearBotonFlotante() {
    // --- Añadir verificación de página ---
    if (window.location.pathname.includes('publicidad.html')) {
        console.log(" No se crea/muestra botón flotante en publicidad.html");
        // Asegurar que esté oculto si ya existe
        let botonExistente = document.getElementById("boton-flotante");
        if (botonExistente) botonExistente.style.display = 'none';
        return; // Salir de la función
    }
    // --- Fin verificación ---
    
    // Verificar si ya existe
    let botonFlotante = document.getElementById("boton-flotante");
    
    if (!botonFlotante) {
        botonFlotante = document.createElement("div");
        botonFlotante.id = "boton-flotante";
        botonFlotante.className = "chat-flotante";
        botonFlotante.innerHTML = `
            <div class="chat-icon">
                <img src="images/chat-icon.png" alt="Chat" width="40">
            </div>
            <span>Hablar con Elektra</span>
        `;
        
        // Estilos básicos
        botonFlotante.style.position = "fixed";
        botonFlotante.style.bottom = "20px";
        botonFlotante.style.right = "20px";
        botonFlotante.style.backgroundColor = "#35a9aa";
        botonFlotante.style.color = "white";
        botonFlotante.style.padding = "10px 15px";
        botonFlotante.style.borderRadius = "25px";
        botonFlotante.style.display = "flex";
        botonFlotante.style.alignItems = "center";
        botonFlotante.style.gap = "10px";
        botonFlotante.style.cursor = "pointer";
        botonFlotante.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
        botonFlotante.style.zIndex = "9999";
        
        document.body.appendChild(botonFlotante);
        
        // Agregar evento para reabrir el chat
        botonFlotante.addEventListener('click', () => {
            console.log(" Botón flotante real clickeado, activando chatbot...");
            // Ocultar ESTE botón flotante real
            botonFlotante.style.display = "none"; 
            // Llamar a activarChatbot para mostrar el contenedor del chat y el video
            activarChatbot(); 
        });
    }
    
    // Asegurarse de que el botón esté visible si se acaba de crear o ya existía
    botonFlotante.style.display = "flex";
    return botonFlotante;
}

// Inicializar el botón de chat cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function() {
    console.log('Inicializando botón de chat desde auth-popup.js...');
    const chatButton = document.getElementById("chatbot-button");

    // Revisar si el usuario ya falló antes y bloquear botón
    if (localStorage.getItem("afiliado") === "no") {
        console.log('Usuario bloqueado por intentos previos');
        bloquearBoton();
    }

    if (chatButton) {
        console.log('Agregando event listener al botón de chat');
        chatButton.addEventListener("click", function() {
            console.log('Botón de chat clickeado');
            showAuthPopup();
        });
    } else {
        console.error('Botón de chat no encontrado en el DOM');
    }
});

document.addEventListener("DOMContentLoaded", async function() {
    console.log('Inicializando botón de chat desde auth-popup.js...');
    const chatButton = document.getElementById("chatbot-button");

    const conexionActiva = await verificarConexionBackend();

    if (!conexionActiva) {
        console.warn("❌ Servidor backend inactivo. Desactivando botón.");
        if (chatButton) {
            chatButton.disabled = true;
            chatButton.style.backgroundColor = "#888";
            chatButton.style.color = "#fff";
            chatButton.style.cursor = "not-allowed";
            chatButton.innerHTML = "⛔ Servidor inactivo";
            chatButton.title = "No se pudo conectar al servidor. Intenta más tarde.";
        }
        localStorage.setItem("backend_inactivo", "true");
        return;
    } else {
        localStorage.setItem("backend_inactivo", "false");
    }

    // Revisar si el usuario ya falló antes y bloquear botón
    if (localStorage.getItem("afiliado") === "no") {
        console.log('Usuario bloqueado por intentos previos');
        bloquearBoton();
    }

    if (chatButton) {
        console.log('Agregando event listener al botón de chat');
        chatButton.addEventListener("click", function() {
            console.log('Botón de chat clickeado');
            showAuthPopup();
        });
    } else {
        console.error('Botón de chat no encontrado en el DOM');
    }
});

// También intentar inicializar inmediatamente por si el DOM ya está cargado
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('DOM ya cargado, inicializando inmediatamente desde auth-popup.js');
    setTimeout(function() {
        const chatButton = document.getElementById("chatbot-button");
        if (chatButton) {
            console.log('Botón de chat encontrado, agregando event listener');
            chatButton.addEventListener("click", showAuthPopup);
        } else {
            console.error('Botón de chat no encontrado en el DOM (inicialización inmediata)');
        }

        // Comprobar si tenemos cédula guardada pero no perfil completo
        const cedula = localStorage.getItem("cedula");
        const perfilCompleto = localStorage.getItem("perfil_completo");
        
        if (cedula && perfilCompleto !== "true") {
            console.log(" Cédula encontrada pero perfil no marcado como completo, verificando con el backend...");
            // Verificar si el perfil ya existe en el backend
            comprobarPerfilUsuarioEnBackground(cedula);
        }
    }, 100);
}

// Exponer funciones globalmente
window.showAuthPopup = showAuthPopup;
window.verifyCedula = verifyCedula;
window.mostrarPopupContrasena = mostrarPopupContrasena;
window.mostrarPopupBienvenidaSimple = mostrarPopupBienvenidaSimple;
window.mostrarFormularioCompletarPerfilObligatorio = mostrarFormularioCompletarPerfilObligatorio;
window.bloquearBoton = bloquearBoton;
window.activarChatbot = activarChatbot;
window.verificarPerfilUsuario = verificarPerfilUsuario;

// Función para mostrar el formulario de perfil
function mostrarFormularioPerfil(cedula, nombre) {
    console.log(" Mostrando formulario de perfil para cédula:", cedula);
    
    // Guardar datos en localStorage
    localStorage.setItem("cedula", cedula);
    if (nombre) {
        localStorage.setItem("nombre", nombre);
    }
    
    // Cerrar el popup actual si existe
    const existingPopup = document.getElementById("auth-popup");
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Crear el nuevo popup de perfil
    const popup = document.createElement("div");
    popup.id = "auth-popup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "white";
    popup.style.padding = "20px";
    popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    popup.style.zIndex = "10000";
    popup.style.borderRadius = "8px";
    popup.style.width = "400px";
    popup.style.textAlign = "center";

    popup.innerHTML = `
        <h3>Completa tu perfil</h3>
        <p>Por favor completa la siguiente información para continuar:</p>
        
        <div id="profile-panel">
            <div style="margin-bottom: 15px;">
                <label for="nombre-perfil">Nombre:</label>
                <input type="text" id="nombre-perfil" name="nombre" required value="${nombre}"> 
            </div>
            <div>
                <label for="correo-perfil">Correo Electrónico:</label>
                <input type="email" id="correo-perfil" name="correo" required>
            </div>
            <div style="margin-bottom: 15px;">
                <label>Foto de perfil:</label>
                <div style="display: flex; align-items: center; justify-content: center; margin-top: 10px;">
                    <img id="user-photo-preview" src="" alt="Foto de perfil" style="width: 100px; height: 100px; border-radius: 50%; border: 1px solid #ccc; object-fit: cover; display: none;">
                    <input type="file" id="user-photo" accept="image/*" style="display: block; margin: 10px auto;">
                </div>
            </div>
            <button id="guardar-perfil-btn">Guardar Perfil</button>
            <button id="cancelar-perfil-btn">Cancelar</button>
        </div>
    `;

    document.body.appendChild(popup);
    
    // Obtener correo de localStorage si existe
    const correo = localStorage.getItem("correo");
    if (correo) {
        document.getElementById('correo-perfil').value = correo;
    }
    
    // Evento para previsualizar la imagen seleccionada
    document.getElementById('user-photo').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.getElementById('user-photo-preview');
                preview.src = event.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Evento para guardar el perfil
    let guardarBtn = document.getElementById('guardar-perfil-btn');
    let cancelarBtn = document.getElementById('cancelar-perfil-btn');
    
    if (guardarBtn) {
        // --- CLONAR PARA LIMPIAR LISTENERS ---
        const newGuardarBtn = guardarBtn.cloneNode(true);
        guardarBtn.parentNode.replaceChild(newGuardarBtn, guardarBtn);
        guardarBtn = newGuardarBtn; // Actualizar la referencia
        // --- FIN CLONADO ---
        
        guardarBtn.addEventListener('click', function() {
            // Deshabilitar botones
            guardarBtn.disabled = true;
            guardarBtn.textContent = 'Guardando...';
            if(cancelarBtn) cancelarBtn.disabled = true;
            
            const nombreValue = document.getElementById('nombre-perfil').value;
            const correoValue = document.getElementById('correo-perfil').value;
            const fotoPreview = document.getElementById('user-photo-preview');
            const fotoValue = fotoPreview.style.display !== 'none' ? fotoPreview.src : '';
            
            // Pasar la referencia correcta del botón
            guardarPerfilUsuario(cedula, nombreValue, correoValue, fotoValue, guardarBtn, cancelarBtn);
        });
    }
    
    // Evento para cancelar (podría necesitar clonado similar si la función se llama múltiples veces)
    if (cancelarBtn) {
        // Opcional: Clonar y reemplazar cancelarBtn si es necesario
        // const newCancelarBtn = cancelarBtn.cloneNode(true);
        // cancelarBtn.parentNode.replaceChild(newCancelarBtn, cancelarBtn);
        // cancelarBtn = newCancelarBtn;
        
        cancelarBtn.addEventListener('click', function() {
            closeAuthPopup();
        });
    }
}

// Función para mostrar mensajes de error
function mostrarError(mensaje) {
    console.error(" Error:", mensaje);
    alert(mensaje);
}

// Función auxiliar para obtener la URL del backend
function getBackendUrl() {
    // Primero intentar usar la URL de config.js
    if (window.API_ENDPOINTS && window.API_ENDPOINTS.base) {
        console.log(" Usando URL desde API_ENDPOINTS:", window.API_ENDPOINTS.base);
        return window.API_ENDPOINTS.base;
    }
    
    // Segundo intento: usar BACKEND_URL global
    if (window.BACKEND_URL) {
        console.log(" Usando BACKEND_URL global:", window.BACKEND_URL);
        return window.BACKEND_URL;
    }
    
    // Si nada funciona, usar localhost como última opción
    const localUrl = "http://localhost:8000";
    console.log(" Usando URL local:", localUrl);
    return localUrl;
}

function verificarPerfilEnBackend() {
    const backendUrl = getBackendUrl();
    const cedula = window.cedulaAutenticada;
    
    if (!cedula) {
        console.error("❌ No hay cédula autenticada en memoria");
        mostrarUIInicial();
        return;
    }
    
    console.log("🔍 Verificando perfil para cédula en memoria");
    
    fetch(`${backendUrl}/obtener_perfil/${cedula}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            
            if (data.perfil_completo) {
                console.log("✅ Perfil completo confirmado por backend");
                mostrarPopupBienvenidaPersonalizado(); // O activarChatbot()
            } else {
                console.log("⚠️ Perfil incompleto, mostrando formulario");
            }
        })
        .catch(error => {
            console.error("❌ Error verificando perfil:", error);
            mostrarUIInicial();
        });
}

function enviarDatosPerfil(datos) {
    const backendUrl = getBackendUrl();
    
    console.log(" Enviando datos de perfil:", {...datos, foto: datos.foto ? '(Base64 imagen)' : null});

    fetch(`${backendUrl}/actualizar_perfil`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log("✅ Perfil actualizado correctamente");
            actualizarUIParaPerfilCompleto();
        } else {
            throw new Error(data.mensaje || "Error actualizando perfil");
        }
    })
    .catch(error => {
        console.error("❌ Error:", error);
        alert("Error actualizando perfil: " + error.message);
    });
}

// Nueva función para mostrar el popup de bienvenida personalizado con foto
async function mostrarPopupBienvenidaPersonalizado() {
    console.log("👋 Mostrando popup de bienvenida personalizado");

    const cedula = localStorage.getItem("cedula");
    let nombre = localStorage.getItem("nombre") || "Usuario";
    let fotoPublica = "";

    try {
        const response = await fetch(`${getBackendUrl()}/api/perfil_foto_base64/${cedula}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'User-Agent': 'sinepub-client'
            }
        });        
        if (response.ok) {
            const data = await response.json();
            fotoPublica = data.foto_base64;
            localStorage.setItem("foto", fotoPublica); // opcional
        } else {
            console.warn("⚠️ No se pudo cargar la foto desde el backend");
        }
    } catch (error) {
        console.error("❌ Error al obtener la foto base64:", error);
    }

    // Crear el popup
    const popupBienvenida = document.createElement("div");
    popupBienvenida.id = "popup-bienvenida-personalizado";
    popupBienvenida.style.position = "fixed";
    popupBienvenida.style.top = "50%";
    popupBienvenida.style.left = "50%";
    popupBienvenida.style.transform = "translate(-50%, -50%)";
    popupBienvenida.style.background = "#35a9aa";
    popupBienvenida.style.color = "#0249aa";
    popupBienvenida.style.padding = "30px";
    popupBienvenida.style.borderRadius = "10px";
    popupBienvenida.style.textAlign = "center";
    popupBienvenida.style.width = "420px";
    popupBienvenida.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
    popupBienvenida.style.zIndex = "10000";

    // Contenido del popup
    popupBienvenida.innerHTML = `
        <h2 style="margin-top: 0; color: #0249aa;">¡Bienvenido de nuevo!</h2>
        ${fotoPublica ? `<img src="${fotoPublica}" alt="Foto de perfil" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 10px auto; display: block; border: 3px solid #0249aa;">` : ''}
        <h3 style="margin: 15px 0; color: #0249aa;">¡Hola ${nombre}!</h3>
        <p style="margin-bottom: 20px; color: #0249aa;">Estamos contentos de verte nuevamente. ¿Deseas acceder al sistema?</p>
        <button id="continuar-btn" style="
            background-color: #0249aa;
            color: white;
            font-size: 16px;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease-in-out;">
            Sí, ingresar ahora
        </button>
    `;

    document.body.appendChild(popupBienvenida);

    const continuarBtn = document.getElementById("continuar-btn");
    continuarBtn.addEventListener("mouseenter", () => {
        continuarBtn.style.backgroundColor = "#35a9aa";
        continuarBtn.style.color = "#0249aa";
    });
    continuarBtn.addEventListener("mouseleave", () => {
        continuarBtn.style.backgroundColor = "#0249aa";
        continuarBtn.style.color = "white";
    });
    continuarBtn.addEventListener("click", () => {
        popupBienvenida.remove();
        document.getElementById("auth-popup")?.remove();
        activarChatbot();
    });
}

