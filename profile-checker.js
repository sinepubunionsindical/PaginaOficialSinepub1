// Script para verificar automáticamente el perfil del usuario

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Profile-Checker: DOMContentLoaded");
    verificarEstadoUsuarioAlCargar();
});

// También intentar ejecutar al final de la carga si el DOMContentLoaded ya pasó
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log("🚀 Profile-Checker: Estado ya completo/interactivo");
    setTimeout(verificarEstadoUsuarioAlCargar, 150);
}

function verificarEstadoUsuarioAlCargar() {
    console.log("🧐 Profile-Checker: Ejecutando verificación de estado...");
    
    // Primero verificar si está bloqueado
    if (localStorage.getItem("acceso_bloqueado") === "true") {
        console.log("🚫 Usuario bloqueado, mostrando UI de bloqueo");
        mostrarUIBloqueada();
        return;
    }

    // Verificar si ya está autenticado
    const estaAutenticado = localStorage.getItem("afiliado_autenticado") === "true";
    
    if (!estaAutenticado) {
        console.log("👤 Usuario no autenticado, mostrando UI inicial");
        mostrarUIInicial();
        return;
    }

    // Si llegamos aquí, el usuario está autenticado
    console.log("✅ Usuario autenticado, verificando estado del perfil");
    verificarPerfilEnBackend();
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
    
    fetch(`${backendUrl}/api/obtener_perfil`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cedula: cedula })
    })
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
            actualizarUIParaPerfilCompleto();
        } else {
            console.log("⚠️ Perfil incompleto, mostrando formulario");
            mostrarFormularioCompletarPerfil();
        }
    })
    .catch(error => {
        console.error("❌ Error verificando perfil:", error);
        mostrarUIInicial();
    });
}

function mostrarUIBloqueada() {
    const chatButton = document.getElementById("chatbot-button");
    if (chatButton) {
        chatButton.style.backgroundColor = "red";
        chatButton.style.color = "white";
        chatButton.style.cursor = "not-allowed";
        chatButton.innerText = "❌ No eres afiliado al sindicato";
        chatButton.disabled = true;
    }
}

function mostrarUIInicial() {
    if (window.location.pathname.includes('publicidad.html')) {
        console.log("📄 En página de publicidad, ocultando botón de publicar");
        const publicarBtn = document.getElementById('publicar-btn');
        if (publicarBtn) publicarBtn.style.display = 'none';
        return;
    }

    const initialContainer = document.getElementById('boton-flotante');
    const chatContainer = document.getElementById('chatbot-container');
    const videoContainer = document.getElementById('ai-video-container');
    const realFloatingButton = document.querySelector('.chat-flotante');
    
    if (initialContainer) initialContainer.style.display = 'block';
    if (chatContainer) chatContainer.style.display = 'none';
    if (videoContainer) videoContainer.style.display = 'none';
    if (realFloatingButton) realFloatingButton.style.display = 'none';
}

function actualizarUIParaPerfilCompleto() {
    if (window.location.pathname.includes('publicidad.html')) {
        console.log("📄 En página de publicidad, habilitando botón de publicar");
        const publicarBtn = document.getElementById('publicar-btn');
        if (publicarBtn) publicarBtn.style.display = 'block';
        return;
    }

    const initialContainer = document.getElementById('boton-flotante');
    const chatContainer = document.getElementById('chatbot-container');
    
    if (initialContainer) initialContainer.style.display = 'none';
    if (chatContainer) {
        chatContainer.style.display = 'block';
        // Asegurar que el botón flotante esté visible
        const floatingButton = document.querySelector('.chat-flotante');
        if (floatingButton) floatingButton.style.display = 'block';
    }
}
