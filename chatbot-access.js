document.addEventListener("DOMContentLoaded", function () {
    const chatButton = document.getElementById("chatbot-button");

    if (chatButton) {
        console.log("✅ Botón detectado en el DOM."); // Verificar si se encuentra el botón
        chatButton.addEventListener("click", function () {
            console.log("🛠 Se hizo clic en el botón del chatbot."); // Verificar si se ejecuta el evento
            showAuthPopup();
        });
    } else {
        console.error("❌ No se encontró el botón con id 'chatbot-button'.");
    }
});

function showAuthPopup() {
    console.log("🛠 Intentando mostrar el popup..."); // Verificar en consola

    const existingPopup = document.getElementById("auth-popup");
    if (existingPopup) {
        console.log("⚠ Popup ya está abierto.");
        return;
    }

    const popup = document.createElement("div");
    popup.id = "auth-popup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "white";
    popup.style.padding = "20px";
    popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    popup.style.zIndex = "10000"; // Asegurar que esté por encima de todo

    popup.innerHTML = `
        <h3>Acceso Restringido</h3>
        <p>Ingrese su número de cédula para continuar</p>
        <input type="text" id="cedula-input" placeholder="Cédula">
        <button onclick="verifyCedula()">Verificar</button>
        <button onclick="document.getElementById('auth-popup').remove()">Cerrar</button>
    `;

    document.body.appendChild(popup);
    console.log("✅ Popup añadido al DOM."); // Verificar si realmente se insertó
}

function verifyCedula() {
    const cedula = document.getElementById("cedula-input").value;
    const jsonBinUrl = "https://api.jsonbin.io/v3/b/67a87a39e41b4d34e4870c44";
    const apiKey = "$2a$10$Z828YxzIHQXkevNBQmzlIuLXVpdJQafXGR.aTqC8N05u0DNuMp.wS";

    fetch(jsonBinUrl, {
        method: "GET",
        headers: {
            "X-Master-Key": apiKey,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("📡 Respuesta de JSONBin:", data);
        const cedulas = data.record.cedulas;
        if (cedulas.includes(cedula)) {
            iniciarChatbot();
        } else {
            alert("❌ Acceso denegado. No puede volver a intentarlo.");
            document.getElementById("auth-popup").remove();
        }
    })
    .catch(error => {
        console.error("🚨 Error en la verificación de cédula:", error);
        alert("⚠ Ocurrió un error al verificar la cédula.");
    });
}

function iniciarChatbot() {
    console.log("✅ Acceso concedido. Iniciando IA de Eleven Labs...");
    
    // Ocultar el popup
    document.getElementById("auth-popup").remove();
    
    // Ocultar el botón inicial
    document.getElementById("chatbot-button").style.display = "none";
    
    // Crear el contenedor para el chatbot
    const chatbotContainer = document.createElement("div");
    chatbotContainer.id = "boton-flotante";
    chatbotContainer.innerHTML = `
        <elevenlabs-convai agent-id="JymHy3hDeRPTfG29L13s"></elevenlabs-convai>
        <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
    `;
    document.body.appendChild(chatbotContainer);
}
