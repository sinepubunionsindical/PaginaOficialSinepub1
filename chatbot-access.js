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
    const popup = document.createElement("div");
    popup.innerHTML = `
        <div id="auth-popup">
            <h3>Acceso Restringido</h3>
            <p>Ingrese su número de cédula para continuar</p>
            <input type="text" id="cedula-input" placeholder="Cédula">
            <button onclick="verifyCedula()">Verificar</button>
        </div>
    `;
    document.body.appendChild(popup);
}

function verifyCedula() {
    const cedula = document.getElementById("cedula-input").value;

    fetch("https://script.google.com/macros/s/AKfycbzFy5EOLdPEzyjyUs44V-FnJHYuPUV2jfNDltu7XbXi51DEX1Fy-Q-OjCnwdxdN2T9E/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula })
    })
    .then(response => response.json())
    .then(data => {
        console.log("📡 Respuesta de la API:", data); // ✅ Verificar qué devuelve la API

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
