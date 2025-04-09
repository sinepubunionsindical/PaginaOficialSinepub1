// Script para verificar automáticamente el perfil del usuario

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay cédula guardada pero no perfil completo
    const cedula = localStorage.getItem("cedula");
    const perfilCompleto = localStorage.getItem("perfil_completo");
    
    console.log("🔍 Profile-Checker inicializado");
    console.log("- Cédula en localStorage:", cedula);
    console.log("- Perfil completo en localStorage:", perfilCompleto);
    
    if (cedula && perfilCompleto !== "true") {
        console.log("🔄 Cédula encontrada pero perfil no marcado como completo, verificando con el backend...");
        verificarPerfilEnBackend(cedula);
    }
});

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
        console.log("📡 Datos de perfil recibidos:", data);
        
        if (data.perfil_completo) {
            console.log("✅ Perfil completo encontrado en el backend");
            
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
            
            console.log("✅ Datos guardados en localStorage, perfil marcado como completo");
            
            // Si estamos en la página de publicidad, reconfigurar el botón
            if (window.configurarBotonRegistro) {
                console.log("🔄 Reconfigurando botón de registro después de verificar perfil");
                window.configurarBotonRegistro();
            }
            
            // Activar chatbot si es necesario
            if (document.getElementById("chatbot-button") && window.activarChatbot) {
                window.activarChatbot();
            }
        } else {
            console.log("❌ Perfil incompleto según el backend");
        }
    })
    .catch(error => {
        console.error("❌ Error al verificar perfil con el backend:", error);
    });
} 