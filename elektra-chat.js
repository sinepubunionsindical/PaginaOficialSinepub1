let userData = {
    nombre: '',
    cargo: ''
};

function iniciarChatElektra() {
    // Evitar múltiples ventanas
    if (document.getElementById('elektra-chat-window')) return;
    
    const chatWindow = document.createElement('div');
    chatWindow.id = 'elektra-chat-window';
    chatWindow.className = 'elektra-chat-window';

    chatWindow.innerHTML = `
        <div class="chat-header">
            <span>💬 Chat con Elektra</span>
            <button class="close-chat">×</button>
        </div>
        <div class="chat-messages" id="chat-messages"></div>
        <div class="chat-input">
            <input type="text" id="user-message" placeholder="Escribe tu mensaje...">
            <button id="send-message">Enviar</button>
        </div>
    `;

    document.body.appendChild(chatWindow);

    // Agregar eventos
    document.querySelector('.close-chat').addEventListener('click', () => chatWindow.remove());
    document.getElementById('send-message').addEventListener('click', enviarMensaje);
    document.getElementById('user-message').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') enviarMensaje();
    });

    // Mostrar mensaje de bienvenida con mejor formato
    setTimeout(() => {
        mostrarMensaje("Elektra", "Hola, soy tu inteligencia artificial para facilitarte toda la gestión sindical. 🤖");
        setTimeout(() => {
            mostrarMensaje("Elektra", `Bienvenido ${userData.nombre}, veo que eres ${userData.cargo} de nuestro sindicato.`);
            if (userData.cargo !== "Afiliado") {
                mostrarMensaje("Elektra", 
                    `Como ${userData.cargo}, puedes preguntarme sobre:\n\n` +
                    `• 📑 Documentos y acuerdos\n` +
                    `• 📌 Normativas y estatutos\n` +
                    `• 🤝 Información sobre negociaciones sindicales\n` +
                    `• 📊 Estadísticas y reportes`
                );
            } else {
                mostrarMensaje("Elektra", 
                    `Como afiliado, puedes preguntarme sobre:\n\n` +
                    `• 🔍 Beneficios del sindicato\n` +
                    `• 📚 Estatutos y normativas\n` +
                    `• 🎓 Carrera administrativa y crecimiento profesional\n` +
                    `• 📝 Acuerdos colectivos recientes`
                );
            }
        }, 1000);
    }, 500);
}

function mostrarMensaje(remitente, mensaje) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${remitente.toLowerCase()}-message`;
    
    // Formatear el mensaje para preservar saltos de línea
    const mensajeFormateado = mensaje.replace(/\n/g, '<br>');
    
    messageDiv.innerHTML = `
        <span class="sender">${remitente}</span>
        <p>${mensajeFormateado}</p>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
}

function enviarMensaje() {
    const input = document.getElementById('user-message');
    const mensaje = input.value.trim();
    
    if (mensaje) {
        mostrarMensaje("Tú", mensaje);
        input.value = '';
        // Aquí posteriormente se procesará el mensaje y se generará una respuesta
        procesarMensaje(mensaje);
    }
}

function procesarMensaje(mensaje) {
    // Aquí se integrará una IA real (GPT, Claude, etc.)
    setTimeout(() => {
        mostrarMensaje("Elektra", "Estoy procesando tu consulta. Pronto implementaremos respuestas más específicas. 🔄");
    }, 1000);
}

// Función para actualizar los datos del usuario
function setUserData(nombre, cargo) {
    userData.nombre = nombre;
    userData.cargo = cargo;
}
