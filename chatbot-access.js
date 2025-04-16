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

// ✅ Verificación de cédula
function verifyCedula() {
    console.log("🛠 Redirigiendo a la función de verificación en auth-popup.js");
    
    // Obtener el valor de la cédula
    const cedula = document.getElementById("cedula-input").value;
    
    // Verificar si la función existe en el ámbito global (window)
    if (typeof window.verifyCedula === 'function') {
        window.verifyCedula(cedula);
    } else {
        console.error("❌ La función verifyCedula no está disponible globalmente. Asegúrate de que auth-popup.js se cargue antes que chatbot-access.js");
        alert("Error al cargar el sistema de verificación. Por favor, recarga la página.");
    }
}

// ✅ Función corregida para mostrar el popup
function mostrarPopupBienvenida(mensaje) {
    console.log("✅ Acceso concedido. Mostrando popup de bienvenida...");

    const popupBienvenida = document.createElement("div");
    popupBienvenida.id = "popup-bienvenida";
    popupBienvenida.style.position = "fixed";
    popupBienvenida.style.top = "50%";
    popupBienvenida.style.left = "50%";
    popupBienvenida.style.transform = "translate(-50%, -50%)";
    popupBienvenida.style.background = "#35a9aa"; // Verde aguamarina
    popupBienvenida.style.color = "#0249aa"; // Azul para el texto
    popupBienvenida.style.padding = "30px";
    popupBienvenida.style.borderRadius = "10px";
    popupBienvenida.style.textAlign = "center";
    popupBienvenida.style.width = "500px";  // 🔥 Aumenté el ancho
    popupBienvenida.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
    popupBienvenida.style.zIndex = "10000";

    popupBienvenida.innerHTML = `
        ${mensaje}
        <button id="cerrar-popup" style="
            background-color: red;
            color: white;
            font-size: 16px;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease-in-out;">
            Aceptar
        </button>
    `;

    document.body.appendChild(popupBienvenida);

    // 🔹 Alineación a la izquierda de los ítems de la lista
    const lista = popupBienvenida.querySelector("ul");
    if (lista) {
        lista.style.textAlign = "left";  // ✅ Texto alineado a la izquierda
        lista.style.marginLeft = "20px"; // 🔥 Desplaza la lista un poco a la derecha
        lista.style.paddingLeft = "15px"; // 🔹 Pequeño padding para mejor alineación
    }

    // 🔹 Evento para cambiar el color del botón en hover
    const botonAceptar = document.getElementById("cerrar-popup");
    botonAceptar.addEventListener("mouseenter", function () {
        this.style.backgroundColor = "green";
        this.style.color = "black"; // ✅ Letras negras en hover
    });

    botonAceptar.addEventListener("mouseleave", function () {
        this.style.backgroundColor = "red";
        this.style.color = "white"; // ✅ Restauramos el color original
    });

    botonAceptar.addEventListener("click", function () {
        popupBienvenida.remove();
        activarChatbot();
    });

    // Ocultar el popup de autenticación si aún existe
    const authPopup = document.getElementById("auth-popup");
    if (authPopup) {
        authPopup.remove();
    }
}


function mostrarPopupError() {
    console.log("🚨 Mostrando popup de error...");

    const popupError = document.createElement("div");
    popupError.id = "popup-error";
    popupError.style.position = "fixed";
    popupError.style.top = "50%";
    popupError.style.left = "50%";
    popupError.style.transform = "translate(-50%, -50%)";
    popupError.style.background = "#35a9aa";
    popupError.style.color = "white"; // Texto en blanco
    popupError.style.padding = "25px";
    popupError.style.borderRadius = "10px";
    popupError.style.textAlign = "center";
    popupError.style.width = "420px";
    popupError.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
    popupError.style.zIndex = "10000";

    popupError.innerHTML = `
        <h2 style="color: white; font-size: 22px; margin-bottom: 15px;">❌ Cédula Incorrecta</h2>
        <p>No estás afiliado a nuestro sindicato. Pero no te preocupes, puedes afiliarte llenando nuestro formulario en línea:</p>
        <p><strong>1️⃣ Llena el formulario en la sección de afiliación.</strong></p>
        <p><strong>2️⃣ Descárgalo, agrégale tu huella y llévalo al sindicato en el séptimo piso.</strong></p>
        <button id="cerrar-popup-error" style="
            background-color: gray;
            color: white;
            font-size: 16px;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease-in-out;">
            Aceptar
        </button>
    `;

    document.body.appendChild(popupError);

    // Evento para cerrar el popup
    document.getElementById("cerrar-popup-error").addEventListener("click", function () {
        popupError.remove();
    });

    // Ocultar el popup de autenticación
    document.getElementById("auth-popup").remove();
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


