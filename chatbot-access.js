// Este archivo ahora solo contiene la funcionalidad del chat IA
// La autenticación se ha movido a auth-popup.js

// 🔹 Función para mostrar el Popup de autenticación
function showAuthPopup() {
    console.log("🛠 Redirigiendo a la función de autenticación en auth-popup.js");
    
    // Verificar si la función existe en el ámbito global (window)
    if (typeof window.showAuthPopup === 'function') {
        window.showAuthPopup();
    } else {
        console.error("❌ La función showAuthPopup no está disponible globalmente. Asegúrate de que auth-popup.js se cargue antes que chatbot-access.js");
        alert("Error al cargar el sistema de autenticación. Por favor, recarga la página.");
    }
}

// 🔹 Función para activar la segunda verificación de contraseña maestra
let intentosRestantes = 3;


function manejarIntentoFallido() {
    intentosRestantes--;
    if (intentosRestantes <= 0) {
        localStorage.setItem("acceso_bloqueado", "true"); // Excepción permitida para bloqueo
        bloquearBoton();
        mostrarError("Acceso bloqueado por múltiples intentos fallidos");
    } else {
        mostrarError(`Contraseña incorrecta. ${intentosRestantes} intentos restantes`);
    }
}

// 🔹 Función para activar el chatbot después de cerrar el popup
async function activarChatbot() {
    console.log("🎙️ Activando chatbot con IA...");

    const botonChat = document.getElementById("chatbot-button");
    const linkEstatutos = document.getElementById("estatutos-link");
    const linkEstatutosMobile = document.getElementById("estatutos-link-mobile");
    const linkModulos = document.getElementById("modulos-link");
    const linkAfiliacion = document.getElementById("afiliacion-link");
    // Asegurar que se cierre cualquier ventana de autenticación residual
    cerrarTodosLosPopups(); // 🔥🔥🔥


    // Ocultar botón y mostrar/ocultar enlaces
    if (botonChat) botonChat.style.display = "none";
    if (linkEstatutos) linkEstatutos.style.display = "inline";
    if (linkEstatutosMobile) linkEstatutosMobile.style.display = "block";
    if (linkModulos) linkModulos.style.display = "inline";
    if (linkAfiliacion) linkAfiliacion.style.display = "none";

    try {
        // En lugar de inicializarChatIA, usamos createChatButton
        createChatButton();
        mostrarPanelEstadisticasUsuario();
        console.log('Botón de chat creado correctamente');
    } catch (error) {
        console.error('Error al crear el botón de chat:', error);
    }
}

// Variable global para la instancia de AIChat
let aiChatInstance = null;

// 🔹 Función para bloquear el botón en caso de acceso denegado
function bloquearBoton() {
    const chatButton = document.getElementById("chatbot-button");
    if (chatButton) {
        chatButton.style.backgroundColor = "red";
        chatButton.style.color = "white";
        chatButton.style.cursor = "not-allowed";
        chatButton.innerText = "❌ No eres afiliado al sindicato";
        chatButton.disabled = true;

        // 🔴 Guardar en LocalStorage que falló la validación
        localStorage.setItem("afiliado", "no");
    }
}

function cerrarTodosLosPopups() {
    console.log("🧹 Cerrando todos los popups de autenticación...");

    const ids = [
        "auth-popup",
        "popup-contrasena",
        "data-consent-popup",
        "popup-bienvenida",
        "popup-error",
        "popup-bienvenida-personalizado",
        "popup-verificacion",
        "loading-popup"
    ];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });
}


