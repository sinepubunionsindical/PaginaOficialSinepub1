// Función para mostrar el Popup de autenticación
function showAuthPopup() {
    console.log("🔐 Intentando mostrar el popup...");
    console.trace('Traza de la llamada a showAuthPopup');

    try {
        const existingPopup = document.getElementById("auth-popup");
        if (existingPopup) {
            console.log("⚠ Popup ya está abierto.");
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
        console.log("✅ Popup de autenticación añadido al DOM.");

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

// Verificación de cédula
function verifyCedula(cedula) {
    console.log("Verificando cédula:", cedula);

    if (!cedula) {
        alert("Por favor ingrese un número de cédula válido");
        return;
    }

    // NUEVO: Guardar cédula en localStorage
    localStorage.setItem("cedula", cedula);

    // Reemplazar JsonBin con nuestra API
    const backendUrl = window.API_ENDPOINTS ? window.API_ENDPOINTS.afiliados : "http://localhost:8000/api/afiliados";
    
    console.log("🔄 Consultando API de afiliados:", backendUrl);

    fetch(backendUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        console.log("📡 Estado de respuesta:", response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("📡 Respuesta de API de afiliados:", data);
        
        if (!data || !data.afiliados) {
            throw new Error("Estructura de datos inválida: falta la propiedad 'afiliados'");
        }

        const afiliados = data.afiliados;
        if (!Array.isArray(afiliados)) {
            throw new Error("Formato incorrecto: 'afiliados' no es un array");
        }
        
        console.log(`📋 Se encontraron ${afiliados.length} afiliados en total`);
        const afiliado = afiliados.find(persona => persona.cedula === cedula);
        console.log("🔍 Búsqueda de afiliado:", afiliado ? "Encontrado" : "No encontrado");

        if (afiliado) {
            const nombre = afiliado.nombre;
            const cargo = afiliado.cargo;
            let mensajeBienvenida = `<h2>Bienvenido al Sindicato</h2>`;

            if (cargo !== "Afiliado") {
                mensajeBienvenida += `
                    <p>Hola <strong>${nombre}</strong>, un placer volverte a saludar.</p>
                    <p>Como <strong>${cargo}</strong> de SINEPUB HUV, tienes un papel fundamental en la representación y defensa de nuestros afiliados.</p>
                    <p><strong>Te invitamos a utilizar la Inteligencia Artificial para:</strong></p>
                    <ul>
                        <li>📑 Acceder rápidamente a documentos y acuerdos.</li>
                        <li>📌 Consultar normativas y estatutos.</li>
                        <li>🤝 Obtener información clave sobre negociaciones sindicales.</li>
                    </ul>
                    <p><strong>Ademas tienes acceso a los estatutos y modulos de información, nos preocupamos por tu evolución</strong></p>`;
            } else {
                mensajeBienvenida += `
                    <p>Hola <strong>${nombre}</strong>, bienvenido a nuestra comunidad sindical.</p>
                    <p><strong>Como afiliado, puedes aprovechar la Inteligencia Artificial para:</strong></p>
                    <ul>
                        <li>🔍 Consultar beneficios del sindicato.</li>
                        <li>📚 Revisar los estatutos y normativas.</li>
                        <li>🎓 Informarte sobre la carrera administrativa y crecimiento profesional.</li>
                        <li>📝 Conocer los acuerdos colectivos recientes.</li>
                    </ul>
                    <p><strong>Ademas tienes acceso a los estatutos y modulos de información, nos preocupamos por tu evolución</strong></p>
                    <p>¡Tu participación es clave para fortalecer nuestra organización!</p>`;
            }
            console.log("🟢 Mensaje de bienvenida generado:", mensajeBienvenida);
            mostrarPopupContrasena(nombre, cargo, mensajeBienvenida);
        } else {
            localStorage.setItem("afiliado", "no");
            bloquearBoton();
            mostrarPopupError();
        }
    })
    .catch(error => {
        console.error("🚨 Error en la verificación de cédula:", error);
        alert(`⚠ Ocurrió un error al verificar la cédula: ${error.message}`);
    });
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
        <h3>🔐 Verificación Adicional</h3>
        <p>${nombre}, por favor ingresa la contraseña maestra para continuar.</p>
        <input type="password" id="input-contrasena" placeholder="Contraseña">
        <br><br>
        <button id="verificar-contrasena">Verificar</button>
        <button id="cancelar-contrasena">Cancelar</button>
    `;

    document.body.appendChild(popupContrasena);

    let intentosRestantes = 2;

    document.getElementById("verificar-contrasena").addEventListener("click", function() {
        const contrasena = document.getElementById("input-contrasena").value;

        // Validar código mediante el backend en lugar de comparar directamente
        const validarUrl = window.API_ENDPOINTS ? `${window.API_ENDPOINTS.validarCodigo}/${contrasena}` : `http://localhost:8000/api/validar-codigo/${contrasena}`;
        
        console.log("🔄 Validando código con el backend:", validarUrl);
        
        fetch(validarUrl)
            .then(response => response.json())
            .then(data => {
                if (data.valid) {
                    popupContrasena.remove();
                    mostrarPopupBienvenida(mensajeBienvenida);
                    // Guardar datos del usuario para el chat
                    if (window.setUserData) {
                        window.setUserData(nombre, cargo);
                    }
                } else {
                    intentosRestantes--;
                    popupContrasena.remove();

                    if (intentosRestantes > 0) {
                        alert(`❌ Contraseña incorrecta. Te queda ${intentosRestantes} intento.`);
                        mostrarPopupContrasena(nombre, cargo, mensajeBienvenida);
                    } else {
                        alert("❌ No eres afiliado al sindicato. Recuerda que la suplantación de identidad tiene consecuencias penales.");
                        mostrarPopupError();
                        bloquearBoton();
                    }
                }
            })
            .catch(error => {
                console.error("🚨 Error al validar código:", error);
                alert("⚠ Ocurrió un error al validar la contraseña. Por favor, intenta nuevamente.");
                popupContrasena.remove();
                mostrarPopupContrasena(nombre, cargo, mensajeBienvenida);
            });
    });

    document.getElementById("cancelar-contrasena").addEventListener("click", function() {
        popupContrasena.remove();
    });
}

// Función para mostrar el popup de bienvenida
function mostrarPopupBienvenida(mensaje) {
    console.log("✅ Acceso concedido. Mostrando popup de bienvenida...");

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
        ${mensaje}
        <button id="cerrar-popup" style="
            background-color: red;
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

    // Alineación a la izquierda de los ítems de la lista
    const lista = popupBienvenida.querySelector("ul");
    if (lista) {
        lista.style.textAlign = "left";
        lista.style.marginLeft = "20px";
        lista.style.paddingLeft = "15px";
    }

    // Evento para cambiar el color del botón en hover
    const botonAceptar = document.getElementById("cerrar-popup");
    botonAceptar.addEventListener("mouseenter", function () {
        this.style.backgroundColor = "green";
        this.style.color = "black";
    });

    botonAceptar.addEventListener("mouseleave", function () {
        this.style.backgroundColor = "red";
        this.style.color = "white";
    });

    botonAceptar.addEventListener("click", function () {
        popupBienvenida.remove();

        // Guardar en localStorage que el usuario está autenticado
        localStorage.setItem("afiliado", "yes");

        // Extraer nombre y cargo del usuario del mensaje
        let nombre = "Usuario";
        let cargo = "Afiliado";

        // Intentar extraer el nombre del mensaje
        const nombreMatch = mensaje.match(/<strong>([^<]+)<\/strong>/);
        if (nombreMatch && nombreMatch[1]) {
            nombre = nombreMatch[1];
            localStorage.setItem("nombre", nombre);
        }

        // Intentar extraer el cargo del mensaje
        const cargoMatch = mensaje.match(/Como <strong>([^<]+)<\/strong>/);
        if (cargoMatch && cargoMatch[1]) {
            cargo = cargoMatch[1];
            localStorage.setItem("cargo", cargo);
        }
        
        // NUEVO: Verificar si el usuario ya existe en el backend y solicitar foto/email si es necesario
        const cedula = localStorage.getItem("cedula");
        if (cedula) {
            verificarPerfilUsuario(cedula, nombre, cargo);
        } else {
            // Si no tenemos la cédula almacenada, continuar con activación normal
            // Activar el chat con el nuevo sistema de botón flotante
            if (window.activateChatAfterAuth) {
                window.activateChatAfterAuth(nombre, cargo);
            } else {
                console.error("La función activateChatAfterAuth no está disponible");
                // Fallback al método antiguo
                activarChatbot();
            }
        }
    });

    // Ocultar el popup de autenticación si aún existe
    const authPopup = document.getElementById("auth-popup");
    if (authPopup) {
        authPopup.remove();
    }
}

// NUEVA FUNCIÓN: Verificar si el usuario necesita completar su perfil
function verificarPerfilUsuario(cedula, nombre, cargo) {
    console.log("🔍 Verificando perfil de usuario en el backend...");
    console.log("🔑 Datos: Cédula:", cedula, "Nombre:", nombre, "Cargo:", cargo);
    
    // URL del backend
    const backendUrl = window.API_ENDPOINTS ? window.API_ENDPOINTS.usuario + "/" + cedula : "http://localhost:8000/api/usuario/" + cedula;
    console.log("🌐 URL de verificación de perfil:", backendUrl);
    
    // Solicitar datos del usuario
    fetch(backendUrl)
        .then(response => {
            console.log("📡 Status respuesta perfil:", response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("📡 Datos del usuario recibidos:", data);
            
            if (data.status === "pendiente" || !data.foto_ruta || !data.email) {
                console.log("⚠️ Perfil incompleto o pendiente, mostrando formulario...");
                // Usuario no existe o falta información, mostrar formulario
                mostrarFormularioCompletarPerfil(cedula, nombre, cargo);
            } else {
                console.log("✅ Perfil completo, activando chat...");
                // Usuario existe y tiene toda la información, activar chat
                if (window.activateChatAfterAuth) {
                    window.activateChatAfterAuth(nombre, cargo);
                } else {
                    activarChatbot();
                }
            }
        })
        .catch(error => {
            console.error("🚨 Error al verificar perfil:", error);
            console.log("⚠️ Continuando con activación normal debido al error");
            // En caso de error, continuar con activación normal
            if (window.activateChatAfterAuth) {
                window.activateChatAfterAuth(nombre, cargo);
            } else {
                activarChatbot();
            }
        });
}

// NUEVA FUNCIÓN: Mostrar formulario para completar perfil
function mostrarFormularioCompletarPerfil(cedula, nombre, cargo) {
    console.log("📝 Mostrando formulario para completar perfil...");
    
    // Crear popup para el formulario
    const popupPerfil = document.createElement("div");
    popupPerfil.id = "popup-perfil";
    popupPerfil.style.position = "fixed";
    popupPerfil.style.top = "50%";
    popupPerfil.style.left = "50%";
    popupPerfil.style.transform = "translate(-50%, -50%)";
    popupPerfil.style.background = "#ffffff";
    popupPerfil.style.color = "#333333";
    popupPerfil.style.padding = "30px";
    popupPerfil.style.borderRadius = "10px";
    popupPerfil.style.width = "500px";
    popupPerfil.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
    popupPerfil.style.zIndex = "10000";
    
    popupPerfil.innerHTML = `
        <h2 style="color: #0249aa; text-align: center;">Completa tu perfil</h2>
        <p style="text-align: center;">Para mejorar tu experiencia, necesitamos algunos datos adicionales:</p>
        
        <form id="perfil-form" style="margin-top: 20px;">
            <div style="margin-bottom: 15px;">
                <label for="user-email" style="display: block; margin-bottom: 5px; font-weight: bold;">Correo electrónico:</label>
                <input type="email" id="user-email" placeholder="tu@email.com" 
                       style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" required>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label for="user-photo" style="display: block; margin-bottom: 5px; font-weight: bold;">Foto de perfil:</label>
                <input type="file" id="user-photo" accept="image/*" 
                       style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                <p style="font-size: 12px; color: #666; margin-top: 5px;">Una foto de perfil nos ayuda a personalizar tu experiencia.</p>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                <button type="button" id="skip-perfil" 
                        style="padding: 10px 15px; border: none; border-radius: 5px; background-color: #cccccc; cursor: pointer;">
                    Omitir
                </button>
                <button type="submit" id="guardar-perfil" 
                        style="padding: 10px 15px; border: none; border-radius: 5px; background-color: #0249aa; color: white; cursor: pointer;">
                    Guardar perfil
                </button>
            </div>
        </form>
    `;
    
    document.body.appendChild(popupPerfil);
    
    // Manejar envío del formulario
    document.getElementById("perfil-form").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const email = document.getElementById("user-email").value;
        const fileInput = document.getElementById("user-photo");
        
        // Preparar datos del usuario
        const userData = {
            cedula: cedula,
            nombre: nombre,
            cargo: cargo,
            email: email,
            fecha_registro: new Date().toISOString()
        };
        
        // Si hay foto, procesarla
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                userData.foto_base64 = e.target.result;
                enviarDatosUsuario(userData, popupPerfil);
            };
            
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            // Enviar sin foto
            enviarDatosUsuario(userData, popupPerfil);
        }
    });
    
    // Manejar botón de omitir
    document.getElementById("skip-perfil").addEventListener("click", function() {
        popupPerfil.remove();
        
        // Activar chat
        if (window.activateChatAfterAuth) {
            window.activateChatAfterAuth(nombre, cargo);
        } else {
            activarChatbot();
        }
    });
}

// NUEVA FUNCIÓN: Enviar datos del usuario al backend
function enviarDatosUsuario(userData, popupElement) {
    console.log("📤 Enviando datos de usuario al backend...", userData);
    
    // URL del backend
    const backendUrl = window.API_ENDPOINTS ? window.API_ENDPOINTS.usuario : "http://localhost:8000/api/usuario";
    
    // Enviar datos al backend
    fetch(backendUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("📡 Respuesta del backend:", data);
        
        if (data.success) {
            // Guardar email en localStorage
            localStorage.setItem("email", userData.email);
            
            // Cerrar popup
            popupElement.remove();
            
            // Mostrar mensaje de éxito
            alert("✅ Perfil actualizado correctamente");
            
            // Activar chat
            if (window.activateChatAfterAuth) {
                window.activateChatAfterAuth(userData.nombre, userData.cargo);
            } else {
                activarChatbot();
            }
        } else {
            alert("❌ Error al actualizar perfil: " + (data.error || "Error desconocido"));
        }
    })
    .catch(error => {
        console.error("🚨 Error al enviar datos:", error);
        alert("❌ Error al actualizar perfil. Por favor, intenta de nuevo.");
    });
}

// Función para mostrar el popup de error
function mostrarPopupError() {
    console.log("🚨 Mostrando popup de error...");

    const popupError = document.createElement("div");
    popupError.id = "popup-error";
    popupError.style.position = "fixed";
    popupError.style.top = "50%";
    popupError.style.left = "50%";
    popupError.style.transform = "translate(-50%, -50%)";
    popupError.style.background = "#35a9aa";
    popupError.style.color = "white";
    popupError.style.padding = "25px";
    popupError.style.borderRadius = "10px";
    popupError.style.textAlign = "center";
    popupError.style.width = "420px";
    popupError.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
    popupError.style.zIndex = "10000";

    popupError.innerHTML = `
        <h2 style="color: white; font-size: 22px; margin-bottom: 15px;">❌ Cédula Incorrecta</h2>
        <p>No estás afiliado a nuestro sindicato. Pero no te preocupes, puedes afiliarte llenando nuestro formulario en línea:</p>
        <p><strong>1️⃣ Llena el formulario en la sección de afiliación.</strong></p>
        <p><strong>2️⃣ Descárgalo, agrégale tu huella y llévalo al sindicato en el séptimo piso.</strong></p>
        <button id="cerrar-popup-error" style="
            background-color: gray;
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

    document.body.appendChild(popupError);

    // Evento para cerrar el popup
    document.getElementById("cerrar-popup-error").addEventListener("click", function () {
        popupError.remove();
    });

    // Ocultar el popup de autenticación si aún existe
    const authPopup = document.getElementById("auth-popup");
    if (authPopup) {
        authPopup.remove();
    }
}

// Función para bloquear el botón en caso de acceso denegado
function bloquearBoton() {
    const chatButton = document.getElementById("chatbot-button");
    if (chatButton) {
        chatButton.style.backgroundColor = "red";
        chatButton.style.color = "white";
        chatButton.style.cursor = "not-allowed";
        chatButton.innerText = "❌ No eres afiliado al sindicato";
        chatButton.disabled = true;

        // Guardar en LocalStorage que falló la validación
        localStorage.setItem("afiliado", "no");
    }
}

// Función para activar el chatbot después de cerrar el popup
function activarChatbot() {
    console.log("🎙️ Activando chatbot con IA...");

    const botonChat = document.getElementById("chatbot-button");
    const linkEstatutos = document.getElementById("estatutos-link");
    const linkEstatutosMobile = document.getElementById("estatutos-link-mobile");
    const linkModulos = document.getElementById("modulos-link");
    const linkAfiliacion = document.getElementById("afiliacion-link");
    const botonFlotante = document.getElementById("boton-flotante");
    const contenedorChatbot = document.getElementById("chatbot-container");

    // Ocultar botón y mostrar/ocultar enlaces
    if (botonChat) botonChat.style.display = "none";
    if (linkEstatutos) linkEstatutos.style.display = "inline";
    if (linkEstatutosMobile) linkEstatutosMobile.style.display = "block";
    if (linkModulos) linkModulos.style.display = "inline";
    if (linkAfiliacion) linkAfiliacion.style.display = "none";

    // Mostrar y configurar el contenedor del chatbot
    if (contenedorChatbot) {
        contenedorChatbot.style.display = "block";
        contenedorChatbot.innerHTML = `
            <div class="elektra-chat-interface">
                <div class="chat-header">
                    <img src="images/HUV.jpg" alt="Elektra Avatar" class="elektra-avatar">
                    <h3>ELEKTRA - Asistente Virtual</h3>
                    <button class="close-chat">×</button>
                </div>
                <div id="chat-messages" class="chat-messages"></div>
                <div class="chat-input-container">
                    <input type="text" id="user-input" placeholder="Escribe tu mensaje aquí...">
                    <button id="send-message">
                        Enviar
                    </button>
                </div>
            </div>
        `;

        // Inicializar el chat
        if (window.inicializarChatIA) {
            window.inicializarChatIA();
        } else {
            console.error("La función inicializarChatIA no está disponible");
            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'message ai-message';
                errorMsg.textContent = 'Lo siento, hubo un error al inicializar el chat. Por favor, recarga la página.';
                chatMessages.appendChild(errorMsg);
            }
        }

        // Agregar funcionalidad al botón de cerrar
        const closeButton = contenedorChatbot.querySelector('.close-chat');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                contenedorChatbot.style.display = "none";
                if (botonFlotante) {
                    botonFlotante.style.display = "block";
                }
            });
        }
    } else {
        console.error("No se encontró el contenedor del chatbot");
    }
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
    }, 100);
}

// Exponer funciones globalmente
window.showAuthPopup = showAuthPopup;
window.verifyCedula = verifyCedula;
window.mostrarPopupContrasena = mostrarPopupContrasena;
window.mostrarPopupBienvenida = mostrarPopupBienvenida;
window.mostrarPopupError = mostrarPopupError;
window.bloquearBoton = bloquearBoton;
window.activarChatbot = activarChatbot;
