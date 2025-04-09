// Archivo de configuración para tokens y claves de API
// NOTA: En un entorno de producción, estas claves deberían estar en variables de entorno del servidor
// y nunca expuestas en el código del cliente

const API_KEYS = {
    // Usar una clave vacía para desarrollo local
    // En producción, estas claves deberían ser proporcionadas por el backend
    HUGGINGFACE_TOKEN: "YOUR_HUGGINGFACE_TOKEN", // Reemplazar con tu token en desarrollo local
    HYPERBOLIC_TOKEN: "YOUR_HYPERBOLIC_TOKEN"    // Reemplazar con tu token en desarrollo local
};

// URL de backend centralizada usando ngrok
const BACKEND_URL = 'https://d01c-2800-484-8786-7d00-a958-9ef1-7e9c-89b9.ngrok-free.app';

// Modo de depuración - cambia a true para usar localhost en lugar de ngrok
const DEBUG_MODE = true;
const LOCAL_URL = 'http://localhost:8000';

// URL efectiva a usar
const EFFECTIVE_URL = DEBUG_MODE ? LOCAL_URL : BACKEND_URL;

// Funciones para APIs específicas
const API_ENDPOINTS = {
    publicidad: `${EFFECTIVE_URL}/api/publicidad`,
    usuario: `${EFFECTIVE_URL}/api/usuario`,
    meGusta: `${EFFECTIVE_URL}/api/me-gusta`,
    afiliacion: `${EFFECTIVE_URL}/api/afiliacion`,
    afiliados: `${EFFECTIVE_URL}/api/afiliados`,
    validarCodigo: `${EFFECTIVE_URL}/api/validar-codigo`
};

// Función para enviar formulario de afiliación por correo
async function enviarFormularioAfiliacion(pdfData, emailDestino) {
    try {
        const response = await fetch(API_ENDPOINTS.afiliacion, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pdf_data: pdfData,
                email: emailDestino || 'daniel.rr93g@gmail.com' // Email por defecto
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al enviar formulario de afiliación:', error);
        return { error: error.message };
    }
}

// Exportar las claves y URLs para uso en otros archivos
window.API_KEYS = API_KEYS;
window.BACKEND_URL = BACKEND_URL;
window.API_ENDPOINTS = API_ENDPOINTS;
window.enviarFormularioAfiliacion = enviarFormularioAfiliacion;
