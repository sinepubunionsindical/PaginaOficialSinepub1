// Script para verificar automáticamente el perfil del usuario

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Profile-Checker: DOMContentLoaded");
    verificarEstadoUsuarioAlCargar();
});

// También intentar ejecutar al final de la carga si el DOMContentLoaded ya pasó
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log("🚀 Profile-Checker: Estado ya completo/interactivo");
    // Usar setTimeout para dar tiempo a otros scripts (como config.js) a cargar
    setTimeout(verificarEstadoUsuarioAlCargar, 150);
}

function verificarEstadoUsuarioAlCargar() {
    console.log("🧐 Profile-Checker: Ejecutando verificación de estado...");
    // Verificar si hay cédula guardada pero no perfil completo
    const cedula = localStorage.getItem("cedula");
    const perfilCompleto = localStorage.getItem("perfil_completo");
    
    console.log("   - Cédula en localStorage:", cedula);
    console.log("   - Perfil completo en localStorage:", perfilCompleto);
    
    if (perfilCompleto === "true") {
        console.log("✅ Profile-Checker: Perfil completo detectado en localStorage.");
        // Perfil ya completo, solo asegurar UI correcta
        actualizarUIParaPerfilCompleto();
        return; // No necesitamos consultar backend
    } 
    
    if (cedula) { // Si hay cédula pero perfil no está marcado como completo
        console.log("🔄 Profile-Checker: Cédula encontrada pero perfil no completo en localStorage. Verificando con backend...");
        verificarPerfilEnBackend(cedula);
    } else {
        console.log("👤 Profile-Checker: Sin cédula ni perfil completo en localStorage. Estado inicial.");
        
        if (!window.location.pathname.includes('publicidad.html')) {
            console.log("   - En index/otras, configurando UI inicial...");
            const initialContainer = document.getElementById('boton-flotante'); // <-- CONTENEDOR INICIAL
            const chatContainer = document.getElementById('chatbot-container');
            const videoContainer = document.getElementById('ai-video-container');
            const realFloatingButton = document.querySelector('.chat-flotante'); // <-- Asumiendo que crearBotonFlotante usa esta clase
            
            if (initialContainer) {
                 console.log("      - Contenedor inicial (#boton-flotante) ENCONTRADO.");
                 initialContainer.style.display = 'block'; // <-- MOSTRAR el contenedor inicial
                 console.log(`      - Estilo display aplicado a #boton-flotante: ${initialContainer.style.display}`);
            } else {
                 console.error("      - ¡ERROR! No se encontró el contenedor inicial con id='boton-flotante'.");
            }
            
            if (chatContainer) chatContainer.style.display = 'none';
            if (videoContainer) videoContainer.style.display = 'none';
            if (realFloatingButton) realFloatingButton.style.display = 'none'; // Ocultar el flotante real si existe
            
        } else {
            console.log("   - En publicidad.html, no se muestra botón de chat inicial.");
        }
    }
}

function verificarPerfilEnBackend(cedula) {
    console.log("🔍 Comprobando perfil en backend para cédula:", cedula);
    
    // Función para obtener la URL del backend
    function getBackendUrl() {
        // Verificar primero si hay una URL base definida en window.API_ENDPOINTS
        if (window.API_ENDPOINTS && window.API_ENDPOINTS.base) {
            console.log("📡 Usando API_ENDPOINTS.base:", window.API_ENDPOINTS.base);
            return window.API_ENDPOINTS.base;
        }
        
        // Si no hay base pero hay URL de publicidad, extraer la base de ella
        if (window.API_ENDPOINTS && window.API_ENDPOINTS.publicidad) {
            // Extraer la base quitando "/api/publicidad" del final
            const url = window.API_ENDPOINTS.publicidad;
            const baseUrl = url.replace(/\/api\/publicidad$/, '');
            console.log("📡 Extrayendo base de API_ENDPOINTS.publicidad:", baseUrl);
            return baseUrl;
        }
        
        // Usar la URL de ngrok desde config.js si está disponible
        if (window.BACKEND_URL) {
            console.log("📡 Usando BACKEND_URL global:", window.BACKEND_URL);
            return window.BACKEND_URL;
        }
        
        // Usar una URL definida localmente como respaldo
        const urlNgrok = "https://d01c-2800-484-8786-7d00-a958-9ef1-7e9c-89b9.ngrok-free.app";
        console.log("📡 Usando URL de respaldo:", urlNgrok);
        
        // Valor por defecto como última opción
        return urlNgrok;
    }
    
    fetch(`${getBackendUrl()}/obtener_perfil`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cedula: cedula })
    })
    .then(response => {
        console.log("📡 Status respuesta obtención perfil:", response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        
        // Verificar que la respuesta sea JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            return response.text().then(text => {
                console.error("⚠️ Respuesta no es JSON:", contentType);
                console.error("Contenido recibido (primeros 500 caracteres):", text.substring(0, 500) + "...");
                throw new Error('La respuesta del servidor no es JSON válido');
            });
        }
        
        return response.json();
    })
    .then(data => {
        console.log("📡 Profile-Checker: Datos de perfil recibidos:", data);
        
        if (data.perfil_completo) {
            console.log("✅ Profile-Checker: Perfil completo confirmado por backend.");
            
            // Guardar información en localStorage
            localStorage.setItem('perfil_completo', 'true');
            
            // Guardar los datos del usuario en localStorage
            if (data.datos) {
                if (data.datos.nombre) {
                    localStorage.setItem('nombre', data.datos.nombre);
                    console.log("✅ Nombre guardado en localStorage:", data.datos.nombre);
                }
                
                if (data.datos.correo) {
                    localStorage.setItem('correo', data.datos.correo);
                    localStorage.setItem('email', data.datos.correo);
                    console.log("✅ Correo guardado en localStorage:", data.datos.correo);
                }
                
                if (data.datos.foto_ruta) {
                    localStorage.setItem('foto_ruta', data.datos.foto_ruta);
                    console.log("✅ Ruta de foto guardada en localStorage:", data.datos.foto_ruta);
                }
            }
            
            console.log("   - Datos guardados en localStorage.");
            
            // Asegurar UI correcta
            actualizarUIParaPerfilCompleto();
            
        } else {
            console.log("❌ Profile-Checker: Perfil incompleto según el backend.");
            // Aquí podríamos opcionalmente forzar la aparición del popup de completar perfil si es necesario
            // o simplemente dejar la UI como está (con botón inicial visible)
            const initialContainer = document.getElementById('boton-flotante');
            if (initialContainer) initialContainer.style.display = 'block';
        }
    })
    .catch(error => {
        console.error("❌ Profile-Checker: Error al verificar perfil con el backend:", error);
        // En caso de error, mantener estado inicial
        const initialContainer = document.getElementById('boton-flotante');
        if (initialContainer) initialContainer.style.display = 'block';
    });
}

// Función para actualizar UI cuando el perfil está completo
function actualizarUIParaPerfilCompleto() {
    console.log("⚙️ Profile-Checker: Actualizando UI para perfil completo...");
    
    if (!window.location.pathname.includes('publicidad.html')) {
        // --- Lógica para INDEX.HTML y otras páginas --- 
        console.log("   - Ejecutando UI para index/otras...");
        const initialContainer = document.getElementById('boton-flotante'); // <-- CONTENEDOR INICIAL
        
        if (initialContainer) {
            initialContainer.style.display = 'none'; // <-- OCULTAR el contenedor inicial
            console.log("      - Contenedor inicial (#boton-flotante) oculto.");
        }
        
        if (window.crearBotonFlotante) {
            window.crearBotonFlotante(); // <-- Mostrar el flotante REAL
            console.log("      - Botón flotante real asegurado.");
        } else {
            console.warn("      - Función crearBotonFlotante no disponible.");
        }
    } else {
        // --- Lógica para PUBLICIDAD.HTML --- 
        console.log("   - Ejecutando UI para publicidad.html...");
        const initialContainer = document.getElementById('boton-flotante');
        const realFloatingButton = document.querySelector('.chat-flotante'); 
        const chatContainer = document.getElementById('chatbot-container');
        const videoContainer = document.getElementById('ai-video-container');

        if (initialContainer) initialContainer.style.display = 'none';
        if (realFloatingButton) realFloatingButton.style.display = 'none'; 
        if (chatContainer) chatContainer.style.display = 'none';
        if (videoContainer) videoContainer.style.display = 'none';
        console.log("      - Contenedores/botones de chat ocultos.");

        if (window.configurarBotonRegistro) {
            console.log("      - Configurando botón de registro de publicidad...");
            window.configurarBotonRegistro();
        } else {
            console.warn("      - Función configurarBotonRegistro no disponible.");
        }
    }
} 