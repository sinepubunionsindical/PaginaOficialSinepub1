document.addEventListener("DOMContentLoaded", function () {
    const chatButton = document.getElementById("chatbot-button");

    // 🟢 Revisar si el usuario ya falló antes y bloquear botón
    if (localStorage.getItem("afiliado") === "no") {
        bloquearBoton(); // 🚫 Bloquea el botón automáticamente
    }

    if (chatButton) {
        chatButton.addEventListener("click", function () {
            showAuthPopup();
        });
    }
});

// 🔹 Función para mostrar el Popup de autenticación
function showAuthPopup() {
    console.log("🛠 Intentando mostrar el popup...");

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
    popup.style.zIndex = "10000";
    popup.style.borderRadius = "8px";
    popup.style.textAlign = "center";

    popup.innerHTML = `
        <h3>Acceso Restringido, Solo Afiliados</h3>
        <p>Ingrese su número de cédula para continuar</p>
        <input type="text" id="cedula-input" placeholder="Cédula">
        <button onclick="verifyCedula()">Verificar</button>
        <button onclick="document.getElementById('auth-popup').remove()">Cerrar</button>
    `;

    document.body.appendChild(popup);
    console.log("✅ Popup de autenticación añadido al DOM.");
}

// ✅ Verificación de cédula
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
        
        const afiliados = data.record ? data.record.afiliados : data.afiliados; 
        const afiliado = afiliados.find(persona => persona.cedula === cedula);

        if (afiliado) {
            const nombre = afiliado.nombre;
            const cargo = afiliado.cargo;
            let mensajeBienvenida = `<h2>Bienvenido al Sindicato</h2>`;

            if (cargo !== "Afiliado") {
                mensajeBienvenida += `
                    <p>Hola <strong>${nombre}</strong>, un placer volverte a saludar.</p>
                    <p>Como <strong>${cargo}</strong> de SINEPUB HUV, tienes un papel fundamental en la representación y defensa de nuestros afiliados.</p>
                    <p><strong>Te invitamos a utilizar la Inteligencia Artificial para:</strong></p>
                    <ul>
                        <li>📑 Acceder rápidamente a documentos y acuerdos.</li>
                        <li>📌 Consultar normativas y estatutos.</li>
                        <li>🤝 Obtener información clave sobre negociaciones sindicales.</li>
                    </ul>
                    <p></p>
                    <p>Gracias por tu compromiso con nuestra comunidad sindical.</p>`;
            } else {
                mensajeBienvenida += `
                    <p>Hola <strong>${nombre}</strong>, bienvenido a nuestra comunidad sindical.</p>
                    <p><strong>Como afiliado, puedes aprovechar la Inteligencia Artificial para:</strong></p>
                    <ul>
                        <li>🔍 Consultar beneficios del sindicato.</li>
                        <li>📚 Revisar los estatutos y normativas.</li>
                        <li>🎓 Informarte sobre la carrera administrativa y crecimiento profesional.</li>
                        <li>📝 Conocer los acuerdos colectivos recientes.</li>
                    </ul>
                    <p></p>
                    <p>¡Tu participación es clave para fortalecer nuestra organización!</p>`;
            }
            console.log("🟢 Mensaje de bienvenida generado:", mensajeBienvenida);
            mostrarPopupBienvenida(mensajeBienvenida);  // ✅ Asegurar que enviamos el mensaje correctamente
        } else {
            localStorage.setItem("afiliado", "no");
            bloquearBoton();
            mostrarPopupError();
        }
    })
    .catch(error => {
        console.error("🚨 Error en la verificación de cédula:", error);
        alert("⚠ Ocurrió un error al verificar la cédula.");
    });
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

// 🔹 Función para activar el chatbot después de cerrar el popup
function activarChatbot() {
    console.log("🎙️ Activando chatbot de Eleven Labs...");

    // Ocultar el botón inicial
    document.getElementById("chatbot-button").style.display = "none";
    
    // Mostrar el widget de Eleven Labs
    document.getElementById("chatbot-container").style.display = "block";
}

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
