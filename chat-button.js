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

    if (sendButton && userInput) {
        // Función para enviar mensaje
        const sendMessage = async function() {
            const message = userInput.value.trim();
            if (!message) return;

            // Mostrar el mensaje del usuario
            addMessage(message, 'user');
            userInput.value = '';

            try {
                // Procesar el mensaje con la IA
                if (!aiChatInstance) {
                    // Crear instancia de AIChat si no existe
                    aiChatInstance = new AIChat();
                    await aiChatInstance.initialize('Afiliado'); // Por defecto como afiliado
                }

                // Asegurarse de que el contenedor de video esté visible
                const aiVideoContainer = document.getElementById('ai-video-container');
                if (aiVideoContainer) {
                    aiVideoContainer.style.display = 'block';
                    console.log('Asegurando que el contenedor de video esté visible al enviar mensaje');
                }

                // Obtener respuesta de la IA
                const response = await aiChatInstance.processMessage(message);

                // Mostrar la respuesta
                addMessage(response, 'ai');

                // La respuesta ya se reproduce con voz en processMessage
                // No necesitamos llamar a speakResponse aquí para evitar duplicación
            } catch (error) {
                console.error('Error al procesar el mensaje:', error);
                addMessage('Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo.', 'ai');
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
function addMessage(text, type) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) {
        console.error('No se encontró el contenedor de mensajes');
        return;
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = text;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
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
