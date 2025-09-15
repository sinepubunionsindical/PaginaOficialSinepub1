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
const BACKEND_URL = 'https://c23d43923842.ngrok-free.app';

// Modo de depuración - cambia a true para usar localhost en lugar de ngrok
// Si hay problemas con ngrok, cambiar a true
const DEBUG_MODE = false;
const LOCAL_URL = 'http://localhost:8000';

// URL efectiva a usar
const EFFECTIVE_URL = DEBUG_MODE ? LOCAL_URL : BACKEND_URL;

// Funciones para APIs específicas
const API_ENDPOINTS = {
  base: EFFECTIVE_URL,
  publicidad: `${EFFECTIVE_URL}/api/publicidad`,
  verificarCedula: `${EFFECTIVE_URL}/api/verificar_cedula`,
  perfil: (cedula) => `${EFFECTIVE_URL}/api/perfil/${cedula}`,
  perfilFoto: (cedula) => `${EFFECTIVE_URL}/api/perfil_foto_base64/${cedula}`,
  perfilActualizar: `${EFFECTIVE_URL}/api/perfil/actualizar`,
  like: (id) => `${EFFECTIVE_URL}/api/like/${id}`,
  comentar: (id) => `${EFFECTIVE_URL}/api/comentar/${id}`,
  comentarios: (id) => `${EFFECTIVE_URL}/api/comentarios/${id}`,
  yaComento: (id, cedula) => `${EFFECTIVE_URL}/api/ya_comento/${id}/${cedula}`,
  enviarPDFLleno: `${EFFECTIVE_URL}/api/enviar_pdf_lleno`
};


// Exportar las claves y URLs para uso en otros archivos
window.API_KEYS = API_KEYS;
window.BACKEND_URL = EFFECTIVE_URL;
window.API_ENDPOINTS = API_ENDPOINTS;

