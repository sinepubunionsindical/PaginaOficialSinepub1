// Variables globales
let chatInitialized = false;
let aiChatInstance = null;

// Función para crear el botón flotante del chat
function createChatButton() {
    // Verificar si ya existe el botón
    if (document.getElementById('chat-float-button')) {
        return;
    }

    // Crear el botón flotante
    const chatButton = document.createElement('div');
    chatButton.id = 'chat-float-button';
    chatButton.className = 'chat-float-button minimized';
    chatButton.innerHTML = '💬';
    chatButton.title = 'Abrir chat con Elektra';

    // Agregar el botón al DOM
    document.body.appendChild(chatButton);

    // Agregar evento de clic
    chatButton.addEventListener('click', toggleChat);

    console.log('Botón flotante de chat creado');
    // 👇 Mostrar panel al crear el botón (inicia abierto)
    mostrarPanelEstadisticasUsuario();
    const linkAfiliacion = document.getElementById("afiliacion-link");
    if (linkAfiliacion) linkAfiliacion.style.display = "none";
    return chatButton;
}

// Función para alternar la visibilidad del chat
function toggleChat() {
    const chatContainer = document.getElementById('chatbot-container');
    const chatButton = document.getElementById('chat-float-button');
    const aiVideoContainer = document.getElementById('ai-video-container');

    if (!chatContainer) {
        console.error('No se encontró el contenedor del chat');
        return;
    }

    // Si el chat está oculto, mostrarlo
    if (chatContainer.style.display === 'none') {
        chatContainer.style.display = 'block';
        chatButton.classList.remove('minimized');
        chatButton.innerHTML = '🔽';
        chatButton.title = 'Minimizar chat';

        // Mostrar el contenedor de video
        const aiVideoContainer = document.getElementById('ai-video-container');
        if (aiVideoContainer) {
            aiVideoContainer.style.display = 'block';
            console.log('Mostrando contenedor de video en toggleChat');

            // Asegurarse de que el video se reproduzca
            const videoElement = document.getElementById('ai-avatar');
            if (videoElement) {
                videoElement.play().catch(error => {
                    console.warn('Error al reproducir el video en toggleChat:', error);
                });
            }
        } else {
            console.warn('No se encontró el contenedor de video en toggleChat');
        }

        // Inicializar el chat si aún no se ha hecho
        if (!chatInitialized) {
            initializeChat();
        }
    } else {
        // Si el chat está visible, ocultarlo
        chatContainer.style.display = 'none';
        chatButton.classList.add('minimized');
        chatButton.innerHTML = '💬';
        chatButton.title = 'Abrir chat con Elektra';

        // Ocultar el contenedor de video
        const aiVideoContainer = document.getElementById('ai-video-container');
        if (aiVideoContainer) {
            aiVideoContainer.style.display = 'none';
            console.log('Ocultando contenedor de video en toggleChat');
        }
    }
}

// Función para inicializar el chat
function initializeChat() {
    if (chatInitialized) {
        return;
    }

    const chatContainer = document.getElementById('chatbot-container');
    if (!chatContainer) {
        console.error('No se encontró el contenedor del chat');
        return;
    }

    // Configurar la interfaz del chat
    chatContainer.innerHTML = `
        <div class="elektra-chat-interface">
            <div class="chat-header">
                <h3>ELEKTRA - Asistente Virtual</h3>
                <button class="close-chat">×</button>
            </div>
            <div id="chat-messages" class="chat-messages"></div>
            <div class="chat-input-container">
                <input type="text" id="user-input" placeholder="Escribe tu mensaje aquí...">
                <button id="send-message">Enviar</button>
            </div>
        </div>
    `;

    // El contenedor de video ya existe en el HTML, no necesitamos crearlo
    console.log('Usando el contenedor de video existente en el HTML');

    // Agregar eventos a los botones
    const closeButton = chatContainer.querySelector('.close-chat');
    const sendButton = chatContainer.querySelector('#send-message');
    const userInput = chatContainer.querySelector('#user-input');

    if (closeButton) {
        closeButton.addEventListener('click', function() {
            // Ocultar el chat y mostrar el botón flotante
            chatContainer.style.display = 'none';
            const chatButton = document.getElementById('chat-float-button');
            if (chatButton) {
                chatButton.classList.add('minimized');
                chatButton.innerHTML = '💬';
                chatButton.title = 'Abrir chat con Elektra';
            }

            // Ocultar el contenedor de video
            const aiVideoContainer = document.getElementById('ai-video-container');
            if (aiVideoContainer) {
                aiVideoContainer.style.display = 'none';
            }
        });
    }
    
    
    function addCustomMessage(htmlContent, id = null) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
    
        const wrapper = document.createElement('div');
        wrapper.className = 'message ai-message';
        if (id) wrapper.id = id;
        wrapper.innerHTML = htmlContent;
    
        chatMessages.appendChild(wrapper);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    let chatInicializadoConPerfil = false;
    if (sendButton && userInput) {
        // Función para enviar mensaje
        const sendMessage = async function() {
            const message = userInput.value.trim();
            if (!message) return;
        
            // ⛔ Desactivar botón para evitar clics múltiples
            sendButton.disabled = true;
            userInput.disabled = true;
            userInput.value = ''
        
            try {
                // Inicializar AIChat si no existe
                if (!aiChatInstance) {
                    aiChatInstance = new AIChat();
                }
        
                // Verificar si es el primer mensaje (se hace el init)
                if (!chatInicializadoConPerfil) {
                    const cedula = localStorage.getItem("cedula");
                    if (cedula) {
                        const initRes = await fetch(`${window.BACKEND_URL}/ia-init`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "ngrok-skip-browser-warning": "true",
                                "User-Agent": "sinepub-client"
                            },
                            body: JSON.stringify({ cedula })
                        });
        
                        const initData = await initRes.json();
        
                        if (initRes.ok && initData.mensaje_sistema) {
                            console.log("📡 Mensaje inicial cargado desde backend:", initData.mensaje_sistema);
                        
                            // Mostrar spinner antes del mensaje de bienvenida
                            const loadingIdInit = 'ia-loading-init';
                            addCustomMessage(`
                                <div class="ai-loading-container">
                                    <div class="ai-icon">🤖</div>
                                    <div class="spinner"></div>
                                    <div class="ai-text">Cargando información de tu perfil...</div>
                                </div>
                            `, loadingIdInit);
                        
                            // Procesar mensaje de bienvenida del sistema
                            const respuestaInicial = await aiChatInstance.processMessage(initData.mensaje_sistema);
                        
                            removeMessageById(loadingIdInit);
                            addMessage(respuestaInicial, 'ai');
                        
                            chatInicializadoConPerfil = true;

                            // 🧹 Limpiar campo de entrada
                            userInput.value = '';

                            // ✅ Reactivar controles
                            sendButton.disabled = false;
                            userInput.disabled = false;
                            userInput.focus();

                            // ⛔ Finalizar ejecución, no se envía el mensaje del usuario
                            return;
                        }                        
                    }
                }
                
                
                // ✅ Mostrar el mensaje del usuario SOLO después del init exitoso
                addMessage(message, 'user');
                userInput.value = '';
        
                const loadingId = 'ai-loading-message';
                addCustomMessage(`
                    <div class="ai-loading-container">
                        <div class="ai-icon">🤖</div>
                        <div class="spinner"></div>
                        <div class="ai-text">Pensando...</div>
                    </div>
                `, loadingId);
                
        
                const respuestaFinal = await aiChatInstance.processMessage(message);
                removeMessageById(loadingId);
                addMessage(respuestaFinal, 'ai');                
        
            } catch (error) {
                console.error('❌ Error en sendMessage:', error);
                removeMessageById('ai-loading-message');
                addMessage('Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo.', 'ai');
            } finally {
                // ✅ Reactivar controles
                // 🧹 Limpiar campo de entrada
                userInput.value = ''
                sendButton.disabled = false;
                userInput.disabled = false;
                userInput.focus();
            }
        };
        
        

        // Agregar eventos para enviar mensajes
        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Mostrar mensaje de bienvenida
    addMessage('¡Hola! Soy Elektra, tu asistente virtual. ¿En qué puedo ayudarte hoy?', 'ai');

    chatInitialized = true;
    console.log('Chat inicializado correctamente');
}

// Función para agregar un mensaje al chat
function addMessage(text, type, customId = null) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) {
        console.error('No se encontró el contenedor de mensajes');
        return;
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = text;

    if (customId) {
        messageDiv.id = customId; // Para poder eliminarlo luego
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeMessageById(messageId) {
    const message = document.getElementById(messageId);
    if (message) {
        message.remove();
    }
}

// Función para activar el chat después de la autenticación
function activateChatAfterAuth(nombre, cargo) {
    // Crear el botón flotante si no existe
    const chatButton = createChatButton();

    // Ocultar el botón de acceso original
    const originalButton = document.getElementById('chatbot-button');
    if (originalButton) {
        originalButton.style.display = 'none';
    }

    // Mostrar enlaces adicionales si es necesario
    const linkEstatutos = document.getElementById('estatutos-link');
    const linkEstatutosMobile = document.getElementById('estatutos-link-mobile');
    const linkModulos = document.getElementById('modulos-link');

    if (linkEstatutos) linkEstatutos.style.display = 'inline';
    if (linkEstatutosMobile) linkEstatutosMobile.style.display = 'block';
    if (linkModulos) linkModulos.style.display = 'inline';

    // Preparar el contenedor del chat
    const chatContainer = document.getElementById('chatbot-container');
    if (chatContainer) {
        chatContainer.style.display = 'none'; // Inicialmente oculto
    }

    // Guardar información del usuario
    if (window.setUserData) {
        window.setUserData(nombre, cargo);
    }

    // Mostrar notificación de éxito
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '80px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#35a9aa';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9998';
    notification.textContent = `¡Hola ${nombre}! Haz clic en el botón de chat para hablar con Elektra.`;

    document.body.appendChild(notification);

    // Eliminar la notificación después de 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);

    console.log(`Chat activado para ${nombre} (${cargo})`);
}

function mostrarPanelEstadisticasUsuario() {
    // Evitar duplicados
    if (document.getElementById('user-stats-panel')) return;

    const nombre = localStorage.getItem('nombre') || 'Usuario';
    const cargo = localStorage.getItem('cargo') || 'Afiliado';
    const foto = localStorage.getItem('foto') || '';
    // Obtener cédula para consultar perfil real
    const cedula = localStorage.getItem('cedula');
    
    
    // Validar que la cédula esté y exista el backend
    if (cedula && window.API_ENDPOINTS?.perfil) {
        fetch(window.API_ENDPOINTS.perfil.replace('{cedula}', cedula), {    
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'User-Agent': 'sinepub-client'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data?.datos?.total_publicidades !== undefined) {
                const contador = document.getElementById('contador-publicidades');
                if (contador) {
                    contador.textContent = data.datos.total_publicidades;
                }
            }
            // ✅ NUEVO BLOQUE: total de comentarios desde perfil
            if (data?.datos?.total_comentarios !== undefined) {
                const contadorComentarios = document.getElementById('contador-comentarios');
                if (contadorComentarios) {
                    contadorComentarios.textContent = data.datos.total_comentarios;
                }
            }
            // ✅ NUEVO BLOQUE - Sincroniza teléfono desde backend
            if (data?.datos?.telefono) {
                localStorage.setItem('telefono', data.datos.telefono);
                console.log("📞 Teléfono sincronizado:", data.datos.telefono);
            }
        })
        .catch(error => {
            console.warn('No se pudo cargar el contador de publicidades:', error);
        });
        
    }

    const panel = document.createElement('div');
    panel.id = 'user-stats-panel';
    panel.style.position = 'fixed';
    panel.style.top = '60px';
    panel.style.left = '20px';
    panel.style.width = '300px';
    panel.style.background = 'white';
    panel.style.borderRadius = '20px';
    panel.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
    panel.style.padding = '20px';
    panel.style.zIndex = '9999';
    panel.style.transition = 'transform 0.5s ease-in-out';
    panel.style.transform = 'translateX(-120%)';

    // Solo animar apertura si nunca ha sido abierto
    const haSidoAbierto = localStorage.getItem('statsPanelAbierto') === 'true';

    // HTML interno del panel
    panel.innerHTML = `
        <div style="text-align: center;">
            ${foto ? `<img src="${foto}" alt="Foto de perfil" style="width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 4px solid #0249aa;">` : ''}
            <h3 style="margin: 10px 0 0; color: #0249aa;">${nombre}</h3>
            <p style="margin: 0; font-weight: bold; color: #35a9aa;">${cargo}</p>
        </div>

        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">

        <h4 style="text-align: center; color: #0249aa;">📊 Actividad en nuestro portal</h4>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
            <div style="background: #e0ecff; padding: 10px 15px; border-radius: 8px; color: #0249aa; font-weight: bold;">
                Publicidades: <span id="contador-publicidades">0</span>
            </div>
            <div style="background: #f1e0ff; padding: 10px 15px; border-radius: 8px; color: #6b1e87; font-weight: bold;">
                Solicitudes: <span id="contador-solicitudes">0</span>
            </div>
            <div style="background: #fff4de; padding: 10px 15px; border-radius: 8px; color: #b06c00; font-weight: bold;">
                Comentarios: <span id="contador-comentarios">0</span>
            </div>
        </div>
        <!-- ========================================================== -->
        <!--  PASO 1: AÑADE EL BOTÓN 'EDITAR PERFIL' AQUÍ               -->
        <!-- ========================================================== -->
        <div style="text-align: center; margin-top: 20px;">
            <button id="edit-profile-btn" style="background: #e9e9e9; border: 1px solid #ccc; color: #333; padding: 8px 15px; border-radius: 20px; cursor: pointer; font-weight: bold;">
                ✏️ Editar Perfil
            </button>
        </div>
        <!-- ========================================================== -->
        <button id="minimizar-panel-btn" style="
            position: absolute;
            top: -10px;
            right: -10px;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background: #0249aa;
            color: white;
            font-size: 20px;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        " title="Minimizar stats">−</button>
    `;
    
    document.body.appendChild(panel);

    // Botón flotante para restaurar
    let toggleStatsBtn = document.getElementById('stats-float-button');
    if (!toggleStatsBtn) {
        toggleStatsBtn = document.createElement('div');
        toggleStatsBtn.id = 'stats-float-button';
        toggleStatsBtn.innerHTML = '👤';
        toggleStatsBtn.style.position = 'fixed';
        toggleStatsBtn.style.top = '100px';
        toggleStatsBtn.style.left = '20px';
        toggleStatsBtn.style.width = '45px';
        toggleStatsBtn.style.height = '45px';
        toggleStatsBtn.style.borderRadius = '50%';
        toggleStatsBtn.style.background = '#35a9aa';
        toggleStatsBtn.style.color = 'white';
        toggleStatsBtn.style.display = 'none';
        toggleStatsBtn.style.alignItems = 'center';
        toggleStatsBtn.style.justifyContent = 'center';
        toggleStatsBtn.style.textAlign = 'center';
        toggleStatsBtn.style.fontSize = '24px';
        toggleStatsBtn.style.cursor = 'pointer';
        toggleStatsBtn.style.zIndex = '9999';
        toggleStatsBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        toggleStatsBtn.title = 'Mostrar estadísticas';

        document.body.appendChild(toggleStatsBtn);

        toggleStatsBtn.addEventListener('click', () => {
            localStorage.setItem('statsPanelMinimizado', 'false'); // Reset al mostrar
            localStorage.setItem('statsPanelAbierto', 'true');
            mostrarPanelEstadisticasUsuario();
            toggleStatsBtn.style.display = 'none';
        });
    }

    document.getElementById('minimizar-panel-btn').addEventListener('click', () => {
        panel.style.transform = 'translateX(-120%)';
        localStorage.setItem('statsPanelAbierto', 'true');
        localStorage.setItem('statsPanelMinimizado', 'true');

        setTimeout(() => {
            panel.remove();
        }, 400);

        toggleStatsBtn.style.display = 'flex';
    });

    // ==========================================================
    //  PASO 2: AÑADE EL LISTENER PARA EL NUEVO BOTÓN AQUÍ      
    // ==========================================================
    document.getElementById('edit-profile-btn').addEventListener('click', abrirModalEditarPerfil);
    // ==========================================================
    
    // Mostrar el panel si no ha sido abierto nunca
    if (!haSidoAbierto || localStorage.getItem('statsPanelMinimizado') !== 'true') {
        setTimeout(() => {
            panel.style.transform = 'translateX(0)';
        }, 100);
    } else {
        // Minimizado desde el inicio
        panel.remove();
        toggleStatsBtn.style.display = 'flex';
    }
}
// ====================================================================
//  BLOQUE COMPLETO Y AUTOSUFICIENTE PARA EDICIÓN DE PERFIL
//  (Pega esto al final de tu archivo chat-button.js)
// ====================================================================

// Variable para almacenar la imagen nueva en formato Base64
let nuevaImagenBase64 = null;

/**
 * Inyecta los estilos CSS para el modal en el <head> del documento.
 * Solo lo hace una vez.
 */
function injectModalStyles() {
    // Si los estilos ya existen, no hacer nada.
    if (document.getElementById('edit-profile-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'edit-profile-modal-styles';
    style.innerHTML = `
        .profile-modal-container {
            display: none; position: fixed; z-index: 10000; left: 0; top: 0;
            width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6);
            justify-content: center; align-items: center;
        }
        .profile-modal-content {
            background-color: #fefefe; margin: auto; padding: 25px 30px; border: 1px solid #888;
            width: 90%; max-width: 450px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            position: relative; animation: modal-fade-in 0.3s;
        }
        @keyframes modal-fade-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .profile-modal-close {
            color: #aaa; position: absolute; top: 10px; right: 20px; font-size: 28px; font-weight: bold;
        }
        .profile-modal-close:hover, .profile-modal-close:focus {
            color: black; text-decoration: none; cursor: pointer;
        }
        #edit-profile-form .form-group { margin-bottom: 15px; }
        #edit-profile-form label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }
        #edit-profile-form input[type="text"],
        #edit-profile-form input[type="email"],
        #edit-profile-form input[type="tel"] {
            width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;
        }
        #edit-profile-form .form-buttons { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        #edit-profile-form .btn-guardar, #edit-profile-form .btn-cancelar {
            padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;
        }
        #edit-profile-form .btn-guardar { background-color: #0249aa; color: white; }
        #edit-profile-form .btn-cancelar { background-color: #ccc; color: #333; }
        .profile-photo-upload { text-align: center; }
        .photo-container { position: relative; width: 120px; height: 120px; margin: 0 auto; }
        #profile-photo-preview {
            width: 100%; height: 100%; border-radius: 50%;
            object-fit: cover; border: 4px solid #ddd;
        }
        #profile-photo-input { display: none; }
        .photo-edit-button {
            position: absolute; bottom: 0; right: 0;
            background-color: #0249aa; color: white;
            width: 35px; height: 35px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 18px; cursor: pointer;
            border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: background-color 0.2s;
        }
        .photo-edit-button:hover { background-color: #013a8a; }
    `;
    document.head.appendChild(style);
}


/**
 * Crea el HTML del modal y lo añade al <body>.
 * Solo lo hace una vez.
 */
function createEditProfileModal() {
    // Si el modal ya existe, no hacer nada.
    if (document.getElementById('edit-profile-modal')) return;

    const modalHTML = `
        <div class="profile-modal-content">
            <span class="profile-modal-close">×</span>
            <h2>Editar Mi Perfil</h2>
            <p>Actualiza tu información personal y foto de perfil.</p>
            
            <form id="edit-profile-form">
                <div class="form-group profile-photo-upload">
                    <label>Foto de Perfil:</label>
                    <div class="photo-container">
                        <img id="profile-photo-preview" src="/images/avatar-placeholder.png" alt="Vista previa">
                        <label for="profile-photo-input" class="photo-edit-button">✏️</label>
                        <input type="file" id="profile-photo-input" accept="image/png, image/jpeg">
                    </div>
                </div>
                <div class="form-group">
                    <label for="profile-nombre">Nombre Completo:</label>
                    <input type="text" id="profile-nombre" required>
                </div>
                <div class="form-group">
                    <label for="profile-email">Correo Electrónico:</label>
                    <input type="email" id="profile-email" required>
                </div>
                <div class="form-group">
                    <label for="profile-telefono">Teléfono:</label>
                    <input type="tel" id="profile-telefono" required>
                </div>
                <div class="form-buttons">
                    <button type="submit" class="btn-guardar">Guardar Cambios</button>
                    <button type="button" class="btn-cancelar">Cancelar</button>
                </div>
            </form>
        </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.id = 'edit-profile-modal';
    modalContainer.className = 'profile-modal-container';
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
}

/**
 * Función principal que se llama al hacer clic en "Editar Perfil".
 * Se asegura de que el modal y sus estilos existan antes de abrirlo.
 */
function abrirModalEditarPerfil() {
    // 1. Crear el modal y sus estilos si no existen
    injectModalStyles();
    createEditProfileModal();

    // 2. Obtener referencia al modal (ahora sabemos que existe)
    const modal = document.getElementById('edit-profile-modal');
    if (!modal) return;

    // 3. Resetear y rellenar datos
    nuevaImagenBase64 = null;
    document.getElementById('profile-nombre').value = localStorage.getItem('nombre') || '';
    document.getElementById('profile-email').value = localStorage.getItem('correo') || '';
    document.getElementById('profile-telefono').value = localStorage.getItem('telefono') || '';
    const fotoPreview = document.getElementById('profile-photo-preview');
    fotoPreview.src = localStorage.getItem('foto') || '/images/avatar-placeholder.png';
    // Manejar error si la foto del localStorage no carga
    fotoPreview.onerror = () => { fotoPreview.src = '/images/avatar-placeholder.png'; };


    // 4. Mostrar el modal
    modal.style.display = 'flex';

    // 5. Configurar listeners del modal
    const form = document.getElementById('edit-profile-form');
    const closeModalBtn = modal.querySelector('.profile-modal-close');
    const cancelBtn = modal.querySelector('.btn-cancelar');
    const photoInput = document.getElementById('profile-photo-input');

    form.onsubmit = handleProfileUpdate;
    photoInput.onchange = handlePhotoPreview;
    closeModalBtn.onclick = cerrarModalEditarPerfil;
    cancelBtn.onclick = cerrarModalEditarPerfil;
}

function cerrarModalEditarPerfil() {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function handlePhotoPreview(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen (PNG, JPG).');
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        alert('La imagen es demasiado grande. El tamaño máximo es 2MB.');
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('profile-photo-preview').src = e.target.result;
        nuevaImagenBase64 = e.target.result;
    }
    reader.readAsDataURL(file);
}

async function handleProfileUpdate(event) {
    event.preventDefault();
    const nombre = document.getElementById('profile-nombre').value;
    const email = document.getElementById('profile-email').value;
    const telefono = document.getElementById('profile-telefono').value;
    const cedula = localStorage.getItem('cedula');

    if (!cedula) {
        alert("Error: No se pudo verificar tu identidad. Inicia sesión de nuevo.");
        return;
    }

    const payload = { cedula, nombre, email, telefono };
    if (nuevaImagenBase64) {
        payload.imagen_base64 = nuevaImagenBase64;
    }

    const submitButton = document.querySelector('#edit-profile-form .btn-guardar');
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';

    try {
        const response = await fetch(window.API_ENDPOINTS.actualizarPerfil, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // ===== INICIO DE LA CORRECCIÓN =====
                'ngrok-skip-browser-warning': 'true',
                'User-Agent': 'sinepub-client'
                // ====== FIN DE LA CORRECCIÓN ======
            },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error en el servidor');

        // --- ÉXITO: Actualizar localStorage y la UI (CON CACHE BUSTING) ---
        localStorage.setItem('nombre', result.datos.nombre);
        localStorage.setItem('email', result.datos.email);
        localStorage.setItem('telefono', result.datos.telefono);
        
        // El backend debe devolver la nueva URL de la foto
        if (result.datos.foto && !result.datos.foto.includes('placeholder')) {
            // 1. Crear el parámetro de cache busting
            const cacheBuster = `?t=${new Date().getTime()}`;
            const nuevaFotoUrl = result.datos.foto + cacheBuster;

            // 2. Guardar la nueva URL completa en localStorage
            localStorage.setItem('foto', nuevaFotoUrl);

            // 3. Actualizar visualmente el panel de estadísticas con la nueva URL
            const panel = document.getElementById('user-stats-panel');
            if (panel) {
                panel.querySelector('h3').textContent = result.datos.nombre;
                const imgElement = panel.querySelector('img');
                if (imgElement) {
                    imgElement.src = nuevaFotoUrl;
                }
            }
        } else {
             // Si no hay foto, solo actualizamos el nombre en el panel
             const panel = document.getElementById('user-stats-panel');
             if (panel) {
                panel.querySelector('h3').textContent = result.datos.nombre;
             }
        }

        alert('¡Perfil actualizado con éxito!');
        cerrarModalEditarPerfil();

    } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        alert(`No se pudo actualizar el perfil: ${error.message}`);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Guardar Cambios';
    }
}
// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario ya está autenticado
    const isAuthenticated = localStorage.getItem('afiliado') === 'yes';

    if (isAuthenticated) {
        // Si ya está autenticado, activar el chat directamente
        const nombre = localStorage.getItem('nombre') || 'Usuario';
        const cargo = localStorage.getItem('cargo') || 'Afiliado';
        activateChatAfterAuth(nombre, cargo);
    }
});

// Exponer funciones globalmente
window.createChatButton = createChatButton;
window.toggleChat = toggleChat;
window.initializeChat = initializeChat;
window.addMessage = addMessage;
window.activateChatAfterAuth = activateChatAfterAuth;
