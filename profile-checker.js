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
    const cedula = localStorage.getItem("cedula") || window.cedulaAutenticada;
    
    if (!cedula) {
        console.error("❌ No hay cédula autenticada en memoria o localStorage");
        mostrarUIInicial();
        return;
    }
    
    console.log("🔍 Verificando perfil para cédula:", cedula);
    
    // Corregir la URL para que apunte al endpoint correcto
    fetch(`${backendUrl}/obtener_perfil/${cedula}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        
        if (data.success && data.perfil_completo) {
            console.log("✅ Perfil completo confirmado por backend:", data);
            
            // Guardar información importante en localStorage
            localStorage.setItem("perfil_completo", "true");
            if (data.datos) {
                if (data.datos.nombre) localStorage.setItem("nombre", data.datos.nombre);
                if (data.datos.correo) localStorage.setItem("correo", data.datos.correo);
                if (data.datos.foto) localStorage.setItem("foto", data.datos.foto);
            }
            
            actualizarUIParaPerfilCompleto();
        } else {
            console.log("⚠️ Perfil incompleto, mostrando formulario");
            localStorage.setItem("perfil_completo", "false");
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
        // No mostramos el chatContainer directamente, mejor activamos el chatbot mediante el botón
        const chatButton = document.getElementById("chatbot-button");
        if (chatButton) {
            console.log("🎙️ Activando chatbot mediante botón original");
            setTimeout(() => chatButton.click(), 100); // Pequeño delay para asegurar que todo esté listo
        } else {
            console.warn("⚠️ Botón de chatbot no encontrado");
            chatContainer.style.display = 'block';
        }
        
        // Asegurar que el botón flotante esté visible
        const floatingButton = document.querySelector('.chat-flotante');
        if (floatingButton) floatingButton.style.display = 'block';
    }
}

// Función para obtener URL del backend desde config.js
function getBackendUrl() {
    if (window.BACKEND_URL) {
        return window.BACKEND_URL;
    }
    if (window.API_ENDPOINTS && window.API_ENDPOINTS.base) {
        return window.API_ENDPOINTS.base;
    }
    // Fallback a la URL por defecto
    return 'https://ffa8-2800-484-8786-7d00-5963-3db4-73c3-1a5c.ngrok-free.app';
}
