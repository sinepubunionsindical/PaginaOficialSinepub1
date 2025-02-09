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
    const apiUrl = "https://script.google.com/macros/s/AKfycbyZfE8qnEZoXNq6Kdq9osrl5NNs_AlE5AB-zh8h9erF25Xx2K5S0FwXhI-dHmW3PgIs/exec";
    
    // Usamos un servidor proxy para evitar el problema de CORS
    const proxyUrl = "https://corsproxy.io/?";
    const finalUrl = proxyUrl + encodeURIComponent(apiUrl);

    fetch(finalUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula })
    })
    .then(response => response.json())
    .then(data => {
        console.log("📡 Respuesta de la API:", data);
        if (data.acceso) {
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
    document.getElementById("chatbot-container").style.display = "block";
    document.getElementById("chatbot-widget").setAttribute("agent-id", "JymHy3hDeRPTfG29L13s");
    alert("Acceso concedido. Iniciando IA de Eleven Labs...");
}
