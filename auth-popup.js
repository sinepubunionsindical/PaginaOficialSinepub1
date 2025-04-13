// --- START OF FILE auth-popup.js ---
// Combined Authentication, Profile, Chat Activation, and Floating Button Logic

// --- Global Variables ---
let aiChatInstance = null; // For AIChat
let chatInitialized = false; // Track if chat UI/listeners are set up
let intentosRestantesPassword = 3; // Password attempts counter
let cedulaVerificada = null; // Store verified cedula temporarily

// --- Configuration & API ---

// Function to safely get Backend URL
function getBackendUrl() {
    if (window.API_ENDPOINTS && window.API_ENDPOINTS.base) {
        // console.log(" Using URL from API_ENDPOINTS:", window.API_ENDPOINTS.base);
        return window.API_ENDPOINTS.base;
    }
    if (window.BACKEND_URL) {
        // console.log(" Using BACKEND_URL global:", window.BACKEND_URL);
        return window.BACKEND_URL;
    }
    const localUrl = "http://localhost:8000"; // Default fallback
    // console.warn(" Using default fallback URL:", localUrl);
    return localUrl;
}

// Placeholder for API Endpoints if config.js isn't loaded yet
if (typeof window.API_ENDPOINTS === 'undefined') {
    console.warn("API_ENDPOINTS not defined. Using default structure.");
    window.API_ENDPOINTS = {
        base: getBackendUrl(), // Use the function to determine base
        verificarCedula: `${getBackendUrl()}/api/verificar_cedula`,
        validarCodigo: `${getBackendUrl()}/api/validar_codigo`, // Endpoint from chatbot-access.js logic
        obtenerPerfil: `${getBackendUrl()}/obtener_perfil`,
        actualizarPerfil: `${getBackendUrl()}/actualizar_perfil`,
        validarPerfil: `${getBackendUrl()}/validar_perfil`
        // Add other endpoints as needed
    };
} else {
    // Ensure base URL is consistent if API_ENDPOINTS exists
    window.API_ENDPOINTS.base = getBackendUrl();
}


// --- Authentication Flow ---

// 1. Show Initial Cedula Popup
function showAuthPopup() {
    console.log(" Attempting to show authentication popup...");
    closeExistingPopups(); // Close any lingering popups first

    const popup = document.createElement("div");
    popup.id = "auth-popup"; // Use a consistent ID
    popup.className = "auth-popup-common"; // Common style class
    popup.style.display = 'block'; // Ensure it's visible

    popup.innerHTML = `
        <h3>Acceso Restringido, Solo Afiliados</h3>
        <p>Ingrese su número de cédula para verificar</p>
        <input type="text" id="cedula-input" placeholder="Número de Cédula" style="width: 80%; padding: 10px; margin-bottom: 10px;">
        <div style="margin-top: 15px;">
            <button id="verificar-cedula-btn" class="popup-button primary">Verificar</button>
            <button id="cerrar-popup-btn" class="popup-button secondary">Cerrar</button>
        </div>
    `;

    document.body.appendChild(popup);
    console.log(" Authentication popup added to DOM.");
    applyPopupStyles(popup); // Apply common styles

    // Add event listeners
    document.getElementById('verificar-cedula-btn').addEventListener('click', () => {
        const cedula = document.getElementById('cedula-input').value;
        verifyCedula(cedula);
    });

    document.getElementById('cerrar-popup-btn').addEventListener('click', closeAuthPopup);

    document.getElementById('cedula-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const cedula = document.getElementById('cedula-input').value;
            verifyCedula(cedula);
        }
    });
}

// 2. Verify Cedula (Handles potential dynamic loading of publicidad.js)
function verifyCedula(cedula) {
    console.log("Verifying cedula:", cedula);
    if (!cedula || !/^\d+$/.test(cedula)) {
        mostrarError("Por favor ingrese un número de cédula válido.");
        return;
    }

    cedulaVerificada = cedula; // Store cedula for later use
    localStorage.setItem("cedula", cedula); // Keep storing for potential use by publicidad.js

    // --- Logic to call publicidad.js ---
    // This part assumes publicidad.js defines window.verificarCedulaPublicidad
    // and potentially loads config.js if needed.
    if (typeof window.verificarCedulaPublicidad === 'function') {
        console.log("Calling window.verificarCedulaPublicidad...");
        // The callback 'handleVerificacionResult' will be called by verificarCedulaPublicidad
        window.verificarCedulaPublicidad(cedula, handleVerificacionResult);
    } else {
        console.warn("window.verificarCedulaPublicidad not found. Attempting to load publicidad.js");
        // Attempt to load config.js first (optional, if needed by publicidad.js)
        const loadConfigIfNeeded = new Promise((resolve, reject) => {
            if (!window.API_ENDPOINTS) {
                const configScript = document.createElement('script');
                configScript.src = 'config.js';
                configScript.onload = resolve;
                configScript.onerror = reject;
                document.head.appendChild(configScript);
            } else {
                resolve();
            }
        });

        loadConfigIfNeeded.then(() => {
            // Then load publicidad.js
            const script = document.createElement('script');
            script.src = 'publicidad.js';
            script.onload = function() {
                if (typeof window.verificarCedulaPublicidad === 'function') {
                    console.log("publicidad.js loaded, calling window.verificarCedulaPublicidad...");
                    window.verificarCedulaPublicidad(cedula, handleVerificacionResult);
                } else {
                    console.error("Failed to load or find verificarCedulaPublicidad function in publicidad.js");
                    mostrarError("Error interno al verificar la cédula (P01). Contacte soporte.");
                    // Fallback: Try direct server verification if publicidad.js fails
                    // verificarCedulaEnServidor(cedula); // Removed as per original flow relying on publicidad.js
                }
            };
            script.onerror = function() {
                 console.error("Error loading publicidad.js");
                 mostrarError("Error interno al verificar la cédula (P02). Contacte soporte.");
                 // Fallback: Try direct server verification if publicidad.js fails
                 // verificarCedulaEnServidor(cedula); // Removed as per original flow relying on publicidad.js
            };
            document.head.appendChild(script);
        }).catch(() => {
             console.error("Error loading config.js (dependency for publicidad.js?)");
             mostrarError("Error interno al verificar la cédula (C01). Contacte soporte.");
        });
    }
}

// 3. Handle Result from Cedula Verification (Callback for publicidad.js)
function handleVerificacionResult(result) {
    console.log("Handling verification result:", result);
    closeAuthPopup(); // Close cedula input popup

    if (result && result.valid) {
        console.log("Cedula valid. Storing user data and showing password popup.");
        // Store basic info received from publicidad.js verification
        localStorage.setItem("afiliado", "si"); // Mark as potentially affiliated
        localStorage.setItem("nombre", result.nombre || '');
        localStorage.setItem("cargo", result.cargo || '');
        // If a secret code is passed, store it (though password check uses backend now)
        if(result.codigo_secreto) {
            localStorage.setItem("codigo_secreto", result.codigo_secreto);
        }

        // Proceed to password verification step
        mostrarPopupContrasena(result.nombre, result.cargo);
    } else {
        console.log("Cedula invalid or not affiliated.");
        localStorage.setItem("afiliado", "no");
        mostrarPopupErrorCedula(); // Show specific error for cedula failure
    }
}

// 4. Show Password Popup
async function mostrarPopupContrasena(nombre, cargo) {
    console.log(`Showing password popup for ${nombre}`);
    closeExistingPopups();
    intentosRestantesPassword = 3; // Reset attempts counter

    const popup = document.createElement("div");
    popup.id = "auth-popup"; // Re-use the ID
    popup.className = "auth-popup-common";
    popup.style.display = 'block';

    popup.innerHTML = `
        <h3>Verificación Adicional</h3>
        <p>${nombre || 'Usuario'}, por favor ingresa tu contraseña maestra para continuar.</p>
        <input type="password" id="input-contrasena" placeholder="Contraseña Maestra" style="width: 80%; padding: 10px; margin-bottom: 10px;">
        <p id="password-error-msg" style="color: red; font-size: 0.9em; min-height: 1.2em;"></p>
        <div style="margin-top: 15px;">
            <button id="verificar-contrasena-btn" class="popup-button primary">Verificar</button>
            <button id="cancelar-contrasena-btn" class="popup-button secondary">Cancelar</button>
        </div>
    `;

    document.body.appendChild(popup);
    applyPopupStyles(popup);

    const verifyBtn = document.getElementById("verificar-contrasena-btn");
    const cancelBtn = document.getElementById("cancelar-contrasena-btn");
    const passwordInput = document.getElementById("input-contrasena");
    const errorMsgElement = document.getElementById("password-error-msg");

    const handleVerification = async () => {
        const contrasena = passwordInput.value;
        const cedula = cedulaVerificada || localStorage.getItem("cedula"); // Use stored cedula

        if (!contrasena) {
            errorMsgElement.textContent = "Por favor ingresa la contraseña.";
            return;
        }
        if (!cedula) {
            console.error("No cedula available for password verification!");
            mostrarError("Error interno (C02). No se pudo verificar la contraseña. Recarga la página.");
            closeAuthPopup();
            return;
        }

        verifyBtn.disabled = true;
        cancelBtn.disabled = true;
        verifyBtn.textContent = "Verificando...";
        errorMsgElement.textContent = ""; // Clear previous errors

        try {
            const response = await fetch(`${window.API_ENDPOINTS.validarCodigo}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cedula: cedula, codigo: contrasena }) // Send cedula and password
            });

            // Check if response is JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                 const textResponse = await response.text();
                 console.error("Password validation response not JSON:", textResponse);
                 throw new Error(`Respuesta inesperada del servidor (${response.status})`);
            }

            const data = await response.json();

            if (data.valid) {
                console.log("Password correct.");
                closeAuthPopup();
                localStorage.setItem("afiliado_autenticado", "true"); // Mark as fully authenticated
                // Proceed to Welcome/Profile check
                mostrarPopupBienvenida(nombre, cargo);
                 // Run profile check in background *after* showing welcome
                comprobarPerfilUsuarioEnBackground(cedula);
            } else {
                console.log("Password incorrect.");
                manejarIntentoFallidoPassword(errorMsgElement);
                 // Re-enable buttons after failure
                 verifyBtn.disabled = false;
                 cancelBtn.disabled = false;
                 verifyBtn.textContent = "Verificar";
            }
        } catch (error) {
            console.error("Error verifying password:", error);
            errorMsgElement.textContent = `Error de conexión: ${error.message}. Intenta de nuevo.`;
            // Re-enable buttons after error
            verifyBtn.disabled = false;
            cancelBtn.disabled = false;
            verifyBtn.textContent = "Verificar";
        }
    };

    verifyBtn.addEventListener("click", handleVerification);
    cancelBtn.addEventListener("click", closeAuthPopup);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleVerification();
    });
}

// 4b. Handle Incorrect Password Attempts
function manejarIntentoFallidoPassword(errorMsgElement) {
    intentosRestantesPassword--;
    if (intentosRestantesPassword <= 0) {
        console.log("Max password attempts reached. Blocking access.");
        localStorage.setItem("acceso_bloqueado", "true"); // Mark as blocked
        localStorage.setItem("afiliado", "no"); // Ensure treated as non-affiliated
        closeAuthPopup();
        mostrarError("Acceso bloqueado por múltiples intentos fallidos de contraseña. Contacta al administrador.");
        bloquearBotonInicial(); // Block the initial "Acceder" button
    } else {
         errorMsgElement.textContent = `Contraseña incorrecta. ${intentosRestantesPassword} ${intentosRestantesPassword > 1 ? 'intentos restantes' : 'intento restante'}.`;
    }
}

// 5. Show Welcome Popup (After successful password)
function mostrarPopupBienvenida(nombre, cargo) {
    console.log("Showing Welcome Popup");
    closeExistingPopups();

    const popup = document.createElement("div");
    popup.id = "popup-bienvenida"; // Specific ID for welcome
    popup.className = "auth-popup-common"; // Use common style class
    popup.style.background = "#d4edda"; // Light green background
    popup.style.color = "#155724"; // Dark green text
    popup.style.border = "1px solid #c3e6cb";
    popup.style.width = "500px";
    popup.style.display = 'block';

    // Construct message carefully
    let mensajeHTML = `
        <h2 style="color: #155724; font-size: 24px;">¡Verificación Exitosa!</h2>
        <p style="font-size: 1.1em;">Bienvenido/a, <strong>${nombre || 'Afiliado'}</strong> (${cargo || 'Miembro'})</p>
        <hr style="border-top: 1px solid #c3e6cb; margin: 15px 0;">
        <p>Como afiliado autenticado, ahora tienes acceso completo a las funciones, incluyendo el asistente virtual Elektra.</p>
        <p>Además, ¡puedes publicar tu publicidad en nuestro sitio web sin costo!</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; border: 1px solid #dee2e6;">
            <p style="margin-bottom: 10px; font-weight: bold;">¿Deseas completar o revisar tu perfil ahora?</p>
            <p style="font-size: 0.9em; margin-bottom: 15px;">Mantener tu perfil actualizado mejora tu experiencia y nos ayuda a comunicarnos mejor.</p>
            <button id="completar-perfil-btn" class="popup-button primary" style="margin-right: 10px;">Sí, revisar perfil</button>
            <button id="omitir-perfil-btn" class="popup-button secondary">No, continuar</button>
        </div>
    `;


    popup.innerHTML = mensajeHTML;

    document.body.appendChild(popup);
    applyPopupStyles(popup); // Apply common styles

    // Add listeners for profile options
    document.getElementById("completar-perfil-btn").addEventListener("click", () => {
        console.log("User chose to complete/review profile.");
        closeAuthPopup(); // Close welcome popup
        verificarPerfilUsuario(); // Start profile check/completion flow
    });

    document.getElementById("omitir-perfil-btn").addEventListener("click", () => {
        console.log("User chose to skip profile review.");
        closeAuthPopup(); // Close welcome popup
        finalizarAutenticacionYMostrarBotonFlotante(); // Directly show the floating button
    });
}

// --- Profile Management ---

// 6. Check Profile Status (Called after Welcome Popup choice or background check)
function verificarPerfilUsuario() {
    const cedula = cedulaVerificada || localStorage.getItem("cedula");
    const nombre = localStorage.getItem("nombre");
    const perfilCompletoLocal = localStorage.getItem("perfil_completo") === "true";

    console.log(" Verifying user profile status for cedula:", cedula);
    console.log(" Local profile complete status:", perfilCompletoLocal);

    if (!cedula) {
        console.error("Cannot verify profile without cedula.");
        mostrarError("Error interno (P03). No se pudo verificar el perfil.");
        finalizarAutenticacionYMostrarBotonFlotante(); // Fallback: show button anyway
        return;
    }

    // If localStorage says complete, trust it for now and show button.
    // Background check might update details later.
    if (perfilCompletoLocal) {
        console.log(" Profile marked complete in localStorage. Proceeding.");
        finalizarAutenticacionYMostrarBotonFlotante();
        // Optional: could still trigger a silent background check here if needed
        // comprobarPerfilUsuarioEnBackground(cedula);
        return;
    }

    // If not marked complete locally, check the backend definitively
    console.log(" Checking profile status with backend...");
    fetch(`${window.API_ENDPOINTS.obtenerPerfil}/${cedula}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    })
    .then(response => {
        console.log(" Profile fetch response status:", response.status);
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        // Check content type before parsing
         const contentType = response.headers.get('content-type');
         if (!contentType || !contentType.includes('application/json')) {
             return response.text().then(text => {
                 console.error(" Response for profile fetch is not JSON:", contentType);
                 console.error(" Content:", text.substring(0, 500));
                 throw new Error('Respuesta del servidor no es JSON válida');
             });
         }
        return response.json();
    })
    .then(data => {
        console.log(" Profile data from backend:", data);
        if (data.perfil_completo) {
            console.log(" Backend confirms profile is complete.");
            localStorage.setItem('perfil_completo', 'true');
            // Update local storage with potentially newer data
            if (data.datos) {
                if (data.datos.nombre) localStorage.setItem('nombre', data.datos.nombre);
                if (data.datos.correo) {
                    localStorage.setItem('correo', data.datos.correo);
                    localStorage.setItem('email', data.datos.correo); // Keep email consistent
                }
                if (data.datos.foto_ruta) localStorage.setItem('foto_ruta', data.datos.foto_ruta);
            }
            finalizarAutenticacionYMostrarBotonFlotante(); // Show float button
        } else {
            console.log(" Backend indicates profile is incomplete. Showing form.");
            // Get potentially updated name from backend data if available
            const currentName = (data.datos && data.datos.nombre) ? data.datos.nombre : nombre;
            mostrarFormularioCompletarPerfil(cedula, currentName);
        }
    })
    .catch(error => {
        console.error('Error fetching profile data:', error);
        mostrarError(`Error al verificar tu perfil: ${error.message}. Se mostrará el formulario por defecto.`);
        // Fallback: Show the form anyway if backend check fails
        mostrarFormularioCompletarPerfil(cedula, nombre);
    });
}

// 7. Show Profile Completion Form
function mostrarFormularioCompletarPerfil(cedula, nombre) {
    console.log(" Displaying profile completion form.");
    closeExistingPopups();

    const popup = document.createElement("div");
    popup.id = "auth-popup"; // Re-use ID
    popup.className = "auth-popup-common";
    popup.style.width = "450px"; // Slightly wider for form
    popup.style.maxHeight = "80vh"; // Prevent excessive height
    popup.style.overflowY = "auto"; // Add scroll if needed
    popup.style.display = 'block';

    // Retrieve existing data from localStorage if available
    const correoLocal = localStorage.getItem("correo") || localStorage.getItem("email") || '';
    const nombreLocal = nombre || localStorage.getItem("nombre") || '';
    const fotoLocal = localStorage.getItem("foto_ruta") || ''; // Get existing photo path

    popup.innerHTML = `
        <h3>Completa Tu Perfil</h3>
        <p>Por favor, verifica o completa la siguiente información:</p>

        <div id="profile-form-content" style="text-align: left; padding: 0 20px;">
            <div style="margin-bottom: 15px;">
                <label for="profile-nombre" style="display: block; margin-bottom: 5px; font-weight: bold;">Nombre completo:</label>
                <input type="text" id="profile-nombre" value="${nombreLocal}" placeholder="Tu nombre completo" required style="width: 100%; padding: 8px;">
            </div>

            <div style="margin-bottom: 15px;">
                <label for="profile-correo" style="display: block; margin-bottom: 5px; font-weight: bold;">Correo electrónico:</label>
                <input type="email" id="profile-correo" value="${correoLocal}" placeholder="tu@correo.com" required style="width: 100%; padding: 8px;">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Foto de perfil (Opcional):</label>
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 15px;">
                     <img id="user-photo-preview" src="${fotoLocal}" alt="Vista previa" style="width: 80px; height: 80px; border-radius: 50%; border: 1px solid #ccc; object-fit: cover; ${fotoLocal ? '' : 'display: none;'}">
                    <input type="file" id="user-photo-input" accept="image/*" style="display: block; flex-grow: 1;">
                </div>
                <small style="display: block; margin-top: 5px; color: #6c757d;">Sube una nueva foto si deseas cambiarla.</small>
            </div>

             <p id="profile-save-error-msg" style="color: red; font-size: 0.9em; min-height: 1.2em; text-align: center;"></p>

            <div style="text-align: center; margin-top: 25px;">
                <button id="guardar-perfil-btn" class="popup-button primary" style="margin-right: 10px;">Guardar Perfil</button>
                <button id="cancelar-perfil-btn" class="popup-button secondary">Cancelar</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);
    applyPopupStyles(popup);

    const guardarBtn = document.getElementById('guardar-perfil-btn');
    const cancelarBtn = document.getElementById('cancelar-perfil-btn');
    const fotoInput = document.getElementById('user-photo-input');
    const fotoPreview = document.getElementById('user-photo-preview');
    const errorMsgElement = document.getElementById('profile-save-error-msg');

    // Event listener for photo preview
    fotoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Basic validation (optional: add size check)
            if (!file.type.startsWith('image/')) {
                errorMsgElement.textContent = 'Por favor selecciona un archivo de imagen válido.';
                fotoInput.value = ''; // Clear the invalid file
                return;
            }
            errorMsgElement.textContent = ''; // Clear error
            const reader = new FileReader();
            reader.onload = function(event) {
                fotoPreview.src = event.target.result;
                fotoPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Event listener for saving profile
    guardarBtn.addEventListener('click', () => {
        const nombreValue = document.getElementById('profile-nombre').value.trim();
        const correoValue = document.getElementById('profile-correo').value.trim();
        const fotoFile = fotoInput.files[0]; // Get the file object if a new one was selected
        let fotoBase64 = null; // Will hold base64 data if new photo is uploaded

        errorMsgElement.textContent = ''; // Clear previous errors

        if (!nombreValue || !correoValue) {
            errorMsgElement.textContent = 'Nombre y correo son obligatorios.';
            return;
        }
        // Basic email format validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoValue)) {
             errorMsgElement.textContent = 'Formato de correo electrónico inválido.';
             return;
        }

        // Disable buttons during save
        guardarBtn.disabled = true;
        cancelarBtn.disabled = true;
        guardarBtn.textContent = 'Guardando...';

        // Process photo if a new one was selected
        const processPhotoPromise = new Promise((resolve) => {
            if (fotoFile) {
                 const reader = new FileReader();
                 reader.onloadend = function() {
                     fotoBase64 = reader.result; // Get base64 string
                     resolve();
                 };
                 reader.onerror = function() {
                     console.error("Error reading file for profile photo.");
                     errorMsgElement.textContent = 'Error al procesar la imagen.';
                     resolve(); // Resolve anyway to proceed without photo
                 };
                 reader.readAsDataURL(fotoFile);
            } else {
                resolve(); // No new photo selected
            }
        });

        // After photo is processed (or if none), save data
        processPhotoPromise.then(() => {
            guardarPerfilUsuario(cedula, nombreValue, correoValue, fotoBase64, guardarBtn, cancelarBtn, errorMsgElement);
        });
    });

    // Event listener for cancel
    cancelarBtn.addEventListener('click', () => {
        console.log("User cancelled profile completion.");
        closeAuthPopup();
        finalizarAutenticacionYMostrarBotonFlotante(); // Show float button as they cancelled
    });
}

// 8. Save Profile Data to Backend
function guardarPerfilUsuario(cedula, nombre, correo, fotoBase64, guardarBtn, cancelarBtn, errorMsgElement) {
    const originalBtnText = 'Guardar Perfil';

    const datos = {
        cedula: cedula,
        nombre: nombre,
        correo: correo,
        // Send base64 string only if a new photo was successfully read
        foto: fotoBase64
    };

    console.log(" Sending profile data to backend:", { ...datos, foto: fotoBase64 ? '(Base64 Image Data)' : null });

    fetch(`${window.API_ENDPOINTS.actualizarPerfil}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        // Check for non-OK status first
        if (!response.ok) {
             // Try to parse error from backend if JSON, otherwise use status text
             return response.json().catch(() => null).then(errorData => {
                 const errorMsg = (errorData && errorData.error) ? errorData.error : `Error HTTP ${response.status}: ${response.statusText}`;
                 throw new Error(errorMsg);
             });
        }
        // Check content type for OK response
         const contentType = response.headers.get('content-type');
         if (!contentType || !contentType.includes('application/json')) {
              return response.text().then(text => {
                  console.error(" Response for profile update is not JSON:", contentType);
                  console.error(" Content:", text.substring(0, 500));
                  throw new Error('Respuesta del servidor no es JSON válida tras guardar perfil');
              });
         }
        return response.json();
    })
    .then(data => {
        console.log("Profile update response:", data);
        if (data.success) {
            console.log("Profile updated successfully!");
            // Update localStorage with saved data
            localStorage.setItem('nombre', nombre);
            localStorage.setItem('correo', correo);
            localStorage.setItem('email', correo); // Consistent key
            localStorage.setItem('perfil_completo', 'true'); // Mark as complete
            if (data.foto_url) { // Backend should return the *URL* of the saved photo
                localStorage.setItem('foto_ruta', data.foto_url);
                 console.log("Stored new photo URL:", data.foto_url);
            }

            closeAuthPopup(); // Close the form
            finalizarAutenticacionYMostrarBotonFlotante(); // Show the float button
        } else {
            // Handle specific error message from backend if provided
            throw new Error(data.error || data.mensaje || 'Error desconocido al guardar el perfil.');
        }
    })
    .catch(error => {
        console.error('Error saving profile:', error);
        errorMsgElement.textContent = `Error al guardar: ${error.message}`;
        // Re-enable buttons on error
        if (guardarBtn) {
            guardarBtn.disabled = false;
            guardarBtn.textContent = originalBtnText;
        }
        if (cancelarBtn) {
            cancelarBtn.disabled = false;
        }
    });
}

// 9. Final Step After Auth/Profile: Show Floating Button
function finalizarAutenticacionYMostrarBotonFlotante() {
    console.log("Authentication and profile check complete. Displaying floating chat button.");

    // Hide the initial large access button if it's still somehow visible
    const initialAccessButton = document.getElementById("chatbot-button"); // Assuming this is the ID
    if (initialAccessButton) {
        initialAccessButton.style.display = "none";
    }

    // Show relevant links (if they exist)
    const linkEstatutos = document.getElementById("estatutos-link");
    const linkEstatutosMobile = document.getElementById("estatutos-link-mobile");
    const linkModulos = document.getElementById("modulos-link");
    const linkAfiliacion = document.getElementById("afiliacion-link");

    if (linkEstatutos) linkEstatutos.style.display = "inline";
    if (linkEstatutosMobile) linkEstatutosMobile.style.display = "block";
    if (linkModulos) linkModulos.style.display = "inline";
    if (linkAfiliacion) linkAfiliacion.style.display = "none"; // Hide affiliation link for logged-in users

    // Create or ensure the floating button is visible
    crearBotonFlotante();

    // Optional: Show a temporary success notification near the button
    showTemporaryNotification(`¡Hola ${localStorage.getItem('nombre') || 'Afiliado'}! Haz clic aquí para chatear.`);
}

// --- Floating Chat Button & Chat Interface Management ---

// 10. Create/Show Floating Chat Button
function crearBotonFlotante() {
    // Do not create/show on publicidad.html
    if (window.location.pathname.includes('publicidad.html')) {
        console.log("Not creating floating button on publicidad.html");
        let existingButton = document.getElementById("boton-flotante");
        if (existingButton) existingButton.style.display = 'none'; // Ensure it's hidden
        return null;
    }

    let botonFlotante = document.getElementById("boton-flotante");

    if (!botonFlotante) {
        console.log("Creating floating chat button (#boton-flotante)...");
        botonFlotante = document.createElement("div");
        botonFlotante.id = "boton-flotante";
        // Add class for styling and state management (e.g., 'minimized')
        botonFlotante.className = "chat-flotante minimized";
        botonFlotante.innerHTML = `
            <div class="chat-icon" style="line-height: 0;">
                <img src="images/chat-icon.png" alt="Chat" width="35" height="35">
            </div>
            <span class="chat-text">Elektra</span>
        `;
        botonFlotante.title = 'Abrir chat con Elektra';

        // Apply styles directly (or use CSS)
        Object.assign(botonFlotante.style, {
            position: "fixed",
            bottom: "25px",
            right: "25px",
            backgroundColor: "#35a9aa", // Teal color
            color: "white",
            padding: "8px 15px",
            borderRadius: "25px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: "9998", // Below popups but above content
            transition: "transform 0.2s ease-out, box-shadow 0.2s ease",
        });

         // Hover effect (optional)
         botonFlotante.addEventListener('mouseenter', () => {
             botonFlotante.style.transform = 'scale(1.05)';
             botonFlotante.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
         });
         botonFlotante.addEventListener('mouseleave', () => {
              botonFlotante.style.transform = 'scale(1)';
              botonFlotante.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
         });


        document.body.appendChild(botonFlotante);

        // Add the crucial click listener to toggle the chat interface
        botonFlotante.addEventListener('click', toggleChat);

    } else {
         console.log("Floating button already exists.");
    }

    // Ensure it's visible
    botonFlotante.style.display = "flex";
    // Ensure it starts minimized visually
    updateFloatingButtonVisualState(true); // true = minimized

    return botonFlotante;
}

// 11. Toggle Chat Interface Visibility (Called by floating button click)
function toggleChat() {
    const chatContainer = document.getElementById("chatbot-container");
    const videoContainer = document.getElementById("ai-video-container");
    const floatButton = document.getElementById("boton-flotante");

    if (!chatContainer) {
        console.error("Chat container #chatbot-container not found!");
        // Attempt to create it dynamically? Or just error out.
        // For now, error out. It should exist in the HTML.
        mostrarError("Error: No se encontró el contenedor del chat (CH01).");
        return;
    }
    if (!floatButton) {
         console.error("Floating button #boton-flotante not found!");
         return; // Should not happen if called from the button itself
    }

    const isCurrentlyHidden = chatContainer.style.display === 'none' || chatContainer.style.display === '';

    if (isCurrentlyHidden) {
        console.log("Opening chat...");
        // Show chat and video
        chatContainer.style.display = 'block';
        if (videoContainer) {
            videoContainer.style.display = 'block'; // Or 'flex' depending on its CSS
             console.log("Showing video container.");
             // Attempt to play video if exists
             const videoElement = document.getElementById('ai-avatar'); // Assuming this ID for the video tag
             if (videoElement && typeof videoElement.play === 'function') {
                 videoElement.play().catch(error => console.warn('Video autoplay prevented:', error));
             }
        } else {
            console.warn("#ai-video-container not found.");
        }

        // Update floating button appearance to 'minimize' state
        updateFloatingButtonVisualState(false); // false = not minimized (open)

        // Initialize chat UI and AI Instance IF NOT ALREADY INITIALIZED
        if (!chatInitialized) {
            activarChatbot(); // This will set up the UI *and* call inicializarChatIA
        }

    } else {
        console.log("Closing chat...");
        // Hide chat and video
        chatContainer.style.display = 'none';
        if (videoContainer) {
            videoContainer.style.display = 'none';
             console.log("Hiding video container.");
        }

        // Update floating button appearance back to 'minimized' state
        updateFloatingButtonVisualState(true); // true = minimized
    }
}

// Helper to update floating button text/icon
function updateFloatingButtonVisualState(minimized) {
     const floatButton = document.getElementById("boton-flotante");
     if (!floatButton) return;

     const iconDiv = floatButton.querySelector('.chat-icon');
     const textSpan = floatButton.querySelector('.chat-text');

     if (minimized) {
         if (iconDiv) iconDiv.innerHTML = '<img src="images/chat-icon.png" alt="Chat" width="35" height="35">';
         if (textSpan) textSpan.textContent = "Elektra";
         floatButton.title = 'Abrir chat con Elektra';
         floatButton.classList.add('minimized');
         floatButton.classList.remove('open');
     } else {
         // Use a minimize icon (e.g., underscore or down arrow)
         if (iconDiv) iconDiv.innerHTML = '🔽'; // Example minimize icon
         if (textSpan) textSpan.textContent = "Minimizar";
         floatButton.title = 'Minimizar chat';
         floatButton.classList.remove('minimized');
         floatButton.classList.add('open');
     }
}


// 12. Activate Chatbot Interface (Called by toggleChat when opening)
async function activarChatbot() {
    console.log("🎙️ Activating chatbot interface elements...");

    const contenedorChatbot = document.getElementById("chatbot-container");

    if (!contenedorChatbot) {
        console.error("CRITICAL: #chatbot-container not found during activation!");
        return;
    }

    // Check if UI is already populated (to avoid rebuilding unnecessarily)
    if (contenedorChatbot.querySelector('.elektra-chat-interface')) {
        console.log("Chat interface already exists.");
        // Ensure AI is initialized if it wasn't
        if (!aiChatInstance) {
            await inicializarChatIA();
        }
        chatInitialized = true; // Mark as initialized
        return;
    }

    // --- Build the Chat UI inside #chatbot-container ---
    contenedorChatbot.innerHTML = `
        <div class="elektra-chat-interface">
            <div class="chat-header">
                <img src="images/HUV.jpg" alt="Elektra Avatar" class="elektra-avatar">
                <h3>ELEKTRA - Asistente Virtual</h3>
                <!-- Minimize button now handled by the main floating button -->
                <button class="close-chat" title="Cerrar Chat">×</button>
            </div>
            <div id="chat-messages" class="chat-messages">
                <!-- Messages will be added here -->
            </div>
            <div class="chat-input-container">
                <input type="text" id="user-input" placeholder="Escribe tu mensaje..." autocomplete="off">
                <button id="send-message" title="Enviar Mensaje">
                    <img src="images/send-icon.png" alt="Enviar" width="20"> <!-- Example using an icon -->
                </button>
            </div>
        </div>
    `;
    console.log("Chat UI injected into #chatbot-container.");

    // --- Add Event Listeners for the new UI elements ---
    const closeButton = contenedorChatbot.querySelector('.close-chat');
    if (closeButton) {
        closeButton.addEventListener('click', toggleChat); // Use toggleChat to close/minimize
    } else {
        console.error("Close button not found in chat UI!");
    }

    // Initialize AI and message handling
    try {
        await inicializarChatIA(); // This function now handles message listeners too
        console.log('Chat AI and listeners initialized successfully.');
        chatInitialized = true; // Mark as fully initialized
    } catch (error) {
        console.error('Error during AI initialization:', error);
        mostrarMensajeIA('Lo siento, hubo un error al inicializar el chat. Por favor, intenta recargar la página.');
    }
}


// 13. Initialize AI Instance and Message Handling (Called by activarChatbot)
async function inicializarChatIA() {
    console.log("Initializing AIChat instance and message listeners...");
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages'); // Get message container reference

    if (!userInput || !sendButton || !chatMessages) {
        console.error("Chat input/button/messages container not found during AI init!");
        chatInitialized = false; // Mark as not initialized
        return; // Stop initialization
    }

    // Create AIChat instance if it doesn't exist
    if (!aiChatInstance) {
        try {
            // Ensure AIChat class is available (assuming it's loaded globally or via import)
            if (typeof AIChat === 'undefined') {
                 throw new Error("AIChat class is not defined. Make sure aichat.js is loaded.");
            }

            aiChatInstance = new AIChat();
            console.log("AIChat instance created.");

            // --- Determine User Role ---
            const nombreUsuario = localStorage.getItem('nombre');
            const cargoUsuario = localStorage.getItem('cargo');
            console.log(`Determining chat role for: Name=${nombreUsuario}, Cargo=${cargoUsuario}`);

            let roleType = 'Afiliado'; // Default to 'Afiliado' for authenticated users
            if (cargoUsuario) {
                if (cargoUsuario.toLowerCase().includes('presidente')) {
                    roleType = 'Presidenciales';
                } else if (cargoUsuario.toLowerCase().includes('directiv')) { // Catches 'Directivo', 'Directiva'
                    roleType = 'JuntaDirectiva';
                }
                // No 'NoAfiliado' needed here as this runs post-authentication
            } else {
                console.warn("No specific cargo found in localStorage, using default 'Afiliado' role.");
            }
            console.log(`Assigned chat role: ${roleType}`);
            // --- End Role Determination ---

            // Initialize the AIChat instance with the determined role
            await aiChatInstance.initialize(roleType);
            console.log("AIChat initialized with role:", roleType);

        } catch (error) {
            console.error('FATAL: Error initializing AIChat:', error);
            mostrarMensajeIA(`Error crítico al iniciar el asistente (${error.message}). Intenta recargar.`);
            // Prevent further interaction if core AI fails
            if (userInput) userInput.disabled = true;
            if (sendButton) sendButton.disabled = true;
            chatInitialized = false; // Mark initialization failed
            aiChatInstance = null; // Discard faulty instance
            return; // Stop further setup
        }
    } else {
        console.log("AIChat instance already exists.");
    }

    // --- Add Message Sending Logic and Listeners ---
    async function enviarMensajeUsuario() {
        const mensaje = userInput.value.trim();
        if (!mensaje) return; // Ignore empty messages

        // Disable input while processing
        userInput.disabled = true;
        sendButton.disabled = true;

        mostrarMensajeUsuario(mensaje); // Display user's message
        userInput.value = ''; // Clear input field immediately

        try {
            // Ensure AI instance is ready
            if (!aiChatInstance) {
                 throw new Error("AI instance is not available.");
            }
            // Process message using the AIChat instance
            const respuesta = await aiChatInstance.processMessage(mensaje);

            // Display AI's response
            mostrarMensajeIA(respuesta);

        } catch (error) {
            console.error("Error processing message:", error);
            mostrarMensajeIA(`Lo siento, hubo un error al procesar tu mensaje: ${error.message}. Por favor, intenta de nuevo.`);
        } finally {
             // Re-enable input
             userInput.disabled = false;
             sendButton.disabled = false;
             userInput.focus(); // Focus back on input
        }
    }

    // Remove existing listeners before adding new ones (safety measure)
    const newSendButton = sendButton.cloneNode(true);
    sendButton.parentNode.replaceChild(newSendButton, sendButton);
    newSendButton.addEventListener('click', enviarMensajeUsuario);

    const newUserInput = userInput.cloneNode(true);
    userInput.parentNode.replaceChild(newUserInput, userInput);
    newUserInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Send on Enter (not Shift+Enter)
             e.preventDefault(); // Prevent newline in input
             enviarMensajeUsuario();
        }
    });

    console.log("Message listeners attached.");

    // --- Display Initial Welcome Message (only if messages are empty) ---
    if (chatMessages.children.length === 0) {
         mostrarMensajeIA("¡Hola! Soy Elektra, tu asistente virtual sindical. ¿En qué puedo ayudarte hoy?");
    }
}

// 14a. Display User Message in Chat
function mostrarMensajeUsuario(mensaje) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message'; // Use CSS classes
    messageDiv.textContent = mensaje;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
}

// 14b. Display AI Message in Chat
function mostrarMensajeIA(mensaje) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message'; // Use CSS classes

    // Basic Markdown interpretation (optional, enhance as needed)
    // Replace **text** with <strong>text</strong>
    mensaje = mensaje.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace *text* with <em>text</em>
    mensaje = mensaje.replace(/\*(.*?)\*/g, '<em>$1</em>');
     // Replace ```text``` with <code>text</code> (simple code block)
    mensaje = mensaje.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
    // Replace `text` with <code>text</code> (inline code)
    mensaje = mensaje.replace(/`(.*?)`/g, '<code>$1</code>');
    // Convert newlines to <br> tags
    mensaje = mensaje.replace(/\n/g, '<br>');

    messageDiv.innerHTML = mensaje; // Use innerHTML to render formatting

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
}


// --- Error Handling & Blocking ---

// General Error Alert
function mostrarError(mensaje) {
    console.error("Displaying Error:", mensaje);
    // Avoid alert() if possible, maybe use a dedicated error div?
    // For now, using alert as per original structure.
    alert(`❌ Error: ${mensaje}`);
}

// Specific Error Popup for Incorrect Cedula
function mostrarPopupErrorCedula() {
    console.log("🚨 Showing specific Cedula Error Popup...");
    closeExistingPopups();

    const popup = document.createElement("div");
    popup.id = "auth-popup"; // Reuse ID
    popup.className = "auth-popup-common error-popup"; // Add error class
    popup.style.background = "#f8d7da"; // Light red
    popup.style.color = "#721c24"; // Dark red
    popup.style.border = "1px solid #f5c6cb";
    popup.style.width = "420px";
    popup.style.display = 'block';

    popup.innerHTML = `
        <h2 style="color: #721c24; font-size: 22px; margin-bottom: 15px;">❌ Cédula Incorrecta o No Afiliado</h2>
        <p>El número de cédula ingresado no se encuentra registrado en nuestro sistema de afiliados.</p>
        <p><strong>Si aún no eres afiliado:</strong></p>
        <ol style="text-align: left; margin-left: 30px; margin-bottom: 15px;">
            <li>Visita la sección de 'Afiliación' en nuestro sitio web.</li>
            <li>Completa el formulario en línea.</li>
            <li>Descárgalo, imprime, añade tu huella y firma.</li>
            <li>Entrégalo personalmente en la oficina del sindicato (usualmente 7mo piso).</li>
        </ol>
        <p><strong>Si crees que esto es un error, por favor contacta al sindicato.</strong></p>
        <div style="margin-top: 20px;">
            <button id="cerrar-popup-error-btn" class="popup-button secondary">Aceptar</button>
        </div>
    `;

    document.body.appendChild(popup);
    applyPopupStyles(popup);

    document.getElementById("cerrar-popup-error-btn").addEventListener("click", closeAuthPopup);

    // Also block the initial button just in case
    bloquearBotonInicial();
}

// Block Initial Access Button (e.g., #chatbot-button)
function bloquearBotonInicial() {
    const chatButton = document.getElementById("chatbot-button"); // ID of the initial large button
    if (chatButton) {
        console.warn("Blocking initial access button.");
        chatButton.style.backgroundColor = "#dc3545"; // Red
        chatButton.style.color = "white";
        chatButton.style.cursor = "not-allowed";
        chatButton.innerHTML = "❌ Acceso Denegado"; // Update text
        chatButton.disabled = true;
        chatButton.onclick = null; // Remove listener

        // Persist block decision
        localStorage.setItem("afiliado", "no");
        localStorage.removeItem("afiliado_autenticado"); // Ensure not marked authenticated
    } else {
         console.warn("Could not find initial access button (#chatbot-button) to block.");
    }
}


// --- Utility Functions ---

// Close any existing popup with the common ID or specific IDs
function closeExistingPopups() {
    const idsToRemove = ["auth-popup", "popup-bienvenida", "popup-error"]; // Add any other popup IDs used
    idsToRemove.forEach(id => {
        const popup = document.getElementById(id);
        if (popup) {
            console.log(`Removing existing popup: #${id}`);
            popup.remove();
        }
    });
}

// Close only the main auth/profile/error popup
function closeAuthPopup() {
    const popup = document.getElementById("auth-popup");
    if (popup) {
        console.log("Closing auth/profile/error popup.");
        popup.remove();
    }
     const welcomePopup = document.getElementById("popup-bienvenida");
     if (welcomePopup) {
          console.log("Closing welcome popup.");
          welcomePopup.remove();
     }
}

// Apply Common Styles to Popups
function applyPopupStyles(element) {
     // Base styles - apply more via CSS class 'auth-popup-common'
     Object.assign(element.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        color: "#333",
        padding: "25px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
        zIndex: "10000", // Ensure popups are on top
        border: "1px solid #ddd",
        maxWidth: "90vw", // Prevent popup from being too wide on small screens
     });

     // Add common class for CSS targeting
     element.classList.add("auth-popup-common");
}

// Show Temporary Notification (e.g., after login near float button)
function showTemporaryNotification(message, duration = 5000) {
    const notification = document.createElement('div');
    notification.id = "temp-notification";
    // Style it to appear near the float button area
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '90px', // Above the float button
        right: '25px',
        backgroundColor: 'rgba(53, 169, 170, 0.9)', // Semi-transparent teal
        color: 'white',
        padding: '10px 15px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        zIndex: '9999', // Above float button, below popups
        fontSize: '0.9em',
        opacity: '0',
        transition: 'opacity 0.5s ease-in-out',
    });
    notification.textContent = message;
    document.body.appendChild(notification);

    // Fade in
    setTimeout(() => { notification.style.opacity = '1'; }, 100);

    // Fade out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => { notification.remove(); }, 500); // Remove after fade out
    }, duration);
}


// Check profile status silently in the background (e.g., on page load if cedula exists)
function comprobarPerfilUsuarioEnBackground(cedula) {
    if (!cedula) return; // Need cedula to check

    console.log("Performing background profile check for cedula:", cedula);
    const validarUrl = `${getBackendUrl()}/validar_perfil/${cedula}`; // Use specific validation endpoint if available

    fetch(validarUrl, { headers: { 'Accept': 'application/json' }})
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.perfil_completo) {
                console.log("Background check: Profile is complete.");
                localStorage.setItem('perfil_completo', 'true');
                // Optionally update other stored data like name, email, photo URL if returned
                 if (data.datos) {
                     if (data.datos.nombre) localStorage.setItem('nombre', data.datos.nombre);
                     if (data.datos.correo) {
                         localStorage.setItem('correo', data.datos.correo);
                         localStorage.setItem('email', data.datos.correo);
                     }
                     if (data.datos.foto_ruta) localStorage.setItem('foto_ruta', data.datos.foto_ruta);
                 }
                 // If on publicidad page, maybe reconfigure button
                 if (window.configurarBotonRegistro && window.location.pathname.includes('publicidad.html')) {
                    console.log("Background check: Reconfiguring ad registration button.");
                    window.configurarBotonRegistro();
                 }
            } else {
                console.log("Background check: Profile is incomplete.");
                localStorage.setItem('perfil_completo', 'false');
                // Maybe prompt user later or show a notification?
            }
        })
        .catch(error => {
            console.warn('Background profile check failed:', error);
            // Don't necessarily mark profile as incomplete on error, just couldn't verify
        });
}

// Check and Restore Floating Button (Periodic Check)
function verificarYRestaurarChatbot() {
     // Only run if user is considered authenticated
     const isAuthenticated = localStorage.getItem("afiliado_autenticado") === "true";
     if (!isAuthenticated) return;

     // If on publicidad page, do nothing regarding the chat button
     if (window.location.pathname.includes('publicidad.html')) {
         return;
     }

     const floatButton = document.getElementById("boton-flotante");
     const chatContainer = document.getElementById("chatbot-container");

     // If neither the button nor the open chat window is visible, restore the button
     const isChatVisible = chatContainer && chatContainer.style.display !== 'none' && chatContainer.style.display !== '';
     const isButtonVisible = floatButton && floatButton.style.display !== 'none' && floatButton.style.display !== '';

     if (!isChatVisible && !isButtonVisible) {
          console.log("Chat elements missing/hidden. Restoring floating button.");
          crearBotonFlotante(); // This will create or ensure visibility
     }
}


// --- Initialization and Global Exports ---

// Initial Setup on DOM Load
document.addEventListener("DOMContentLoaded", function() {
    console.log('DOM fully loaded. Initializing auth/chat logic...');
    const initialChatButton = document.getElementById("chatbot-button"); // The large initial button

    // 1. Check for existing block/failed state
    if (localStorage.getItem("acceso_bloqueado") === "true" || localStorage.getItem("afiliado") === "no") {
        console.log('User blocked or marked as non-affiliated from previous session.');
        bloquearBotonInicial();
    }
    // 2. Check if already authenticated (e.g., page refresh)
    else if (localStorage.getItem("afiliado_autenticado") === "true") {
        console.log("User already authenticated in this session. Showing floating button.");
        finalizarAutenticacionYMostrarBotonFlotante();
        // Perform background check to ensure profile status is up-to-date
        const cedula = localStorage.getItem("cedula");
        if(cedula) {
            comprobarPerfilUsuarioEnBackground(cedula);
        }
    }
    // 3. Otherwise, attach listener to the initial button
    else if (initialChatButton) {
        console.log('Attaching click listener to initial access button (#chatbot-button).');
        // Clear existing listeners first to be safe
        const newButton = initialChatButton.cloneNode(true);
        initialChatButton.parentNode.replaceChild(newButton, initialChatButton);
        newButton.addEventListener("click", showAuthPopup);
    } else {
         console.warn('Initial access button (#chatbot-button) not found in the DOM.');
    }

    // 4. Start periodic check to ensure float button doesn't disappear
    setInterval(verificarYRestaurarChatbot, 5000); // Check every 5 seconds
});

// Add CSS Styles dynamically (or include them in your main CSS file)
function addGlobalStyles() {
     const style = document.createElement('style');
     style.textContent = `
         .auth-popup-common {
             /* Styles defined in applyPopupStyles are base */
             font-family: sans-serif;
         }
         .popup-button {
             padding: 10px 20px;
             border: none;
             border-radius: 5px;
             cursor: pointer;
             font-size: 1em;
             transition: background-color 0.2s ease, transform 0.1s ease;
         }
         .popup-button:active {
             transform: scale(0.98);
         }
         .popup-button.primary {
             background-color: #007bff; /* Blue */
             color: white;
         }
         .popup-button.primary:hover {
             background-color: #0056b3;
         }
         .popup-button.secondary {
             background-color: #6c757d; /* Gray */
             color: white;
         }
          .popup-button.secondary:hover {
             background-color: #5a6268;
         }
         .popup-button:disabled {
             background-color: #cccccc;
             cursor: not-allowed;
         }

         /* Chat Interface Specific Styles */
         #chatbot-container {
             position: fixed;
             bottom: 20px;
             right: 20px;
             width: 380px; /* Adjust width as needed */
             max-width: 90vw;
             height: 550px; /* Adjust height */
             max-height: 75vh;
             background-color: #ffffff;
             border-radius: 10px;
             box-shadow: 0 5px 15px rgba(0,0,0,0.3);
             display: none; /* Initially hidden */
             flex-direction: column;
             overflow: hidden;
             z-index: 9999; /* Above float button, below popups */
             border: 1px solid #ccc;
         }
        #ai-video-container { /* Style the video container */
            position: fixed;
            bottom: 20px; /* Adjust position relative to chat */
            right: calc(20px + 380px + 10px); /* Position left of chat */
            width: 200px; /* Example size */
            height: 200px;
            background-color: black; /* Placeholder background */
            border-radius: 50%; /* Circular maybe? */
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            display: none; /* Initially hidden */
            z-index: 9999;
        }
        #ai-video-container video { /* Style the video element itself */
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

         .elektra-chat-interface {
             display: flex;
             flex-direction: column;
             height: 100%;
             background-color: #f9f9f9;
         }
         .chat-header {
             background-color: #35a9aa; /* Teal */
             color: white;
             padding: 10px 15px;
             display: flex;
             align-items: center;
             justify-content: space-between;
             border-top-left-radius: 10px;
             border-top-right-radius: 10px;
         }
          .chat-header h3 {
              margin: 0;
              font-size: 1.1em;
              flex-grow: 1;
              text-align: center;
              margin-left: 10px; /* Space after avatar */
          }
         .elektra-avatar {
             width: 40px;
             height: 40px;
             border-radius: 50%;
             border: 2px solid white;
         }
         .close-chat {
             background: none;
             border: none;
             color: white;
             font-size: 24px;
             font-weight: bold;
             cursor: pointer;
             padding: 0 5px;
             line-height: 1;
         }
         .chat-messages {
             flex-grow: 1;
             overflow-y: auto;
             padding: 15px;
             background-color: #ffffff;
             display: flex;
             flex-direction: column;
             gap: 10px;
         }
         .message {
             padding: 8px 12px;
             border-radius: 15px;
             max-width: 80%;
             word-wrap: break-word;
             line-height: 1.4;
         }
         .user-message {
             background-color: #007bff; /* Blue */
             color: white;
             border-bottom-right-radius: 5px;
             align-self: flex-end; /* Align user messages to the right */
             margin-left: auto; /* Push to right */
         }
         .ai-message {
             background-color: #e9ecef; /* Light gray */
             color: #333;
             border-bottom-left-radius: 5px;
             align-self: flex-start; /* Align AI messages to the left */
             margin-right: auto; /* Push to left */
         }
          .ai-message strong { font-weight: bold; }
          .ai-message em { font-style: italic; }
          .ai-message code {
              background-color: #f1f1f1;
              padding: 0.1em 0.4em;
              border-radius: 3px;
              font-family: monospace;
              font-size: 0.9em;
          }
           .ai-message pre code {
              display: block;
              padding: 10px;
              overflow-x: auto;
           }

         .chat-input-container {
             display: flex;
             padding: 10px;
             border-top: 1px solid #ccc;
             background-color: #f1f1f1;
         }
         #user-input {
             flex-grow: 1;
             padding: 10px;
             border: 1px solid #ccc;
             border-radius: 20px;
             margin-right: 10px;
             resize: none; /* Prevent manual resize */
         }
         #send-message {
             background-color: #35a9aa; /* Teal */
             color: white;
             border: none;
             border-radius: 50%; /* Circular button */
             width: 40px;
             height: 40px;
             cursor: pointer;
             display: flex;
             align-items: center;
             justify-content: center;
             padding: 0; /* Remove padding for icon */
         }
         #send-message:hover {
             background-color: #2a8a8b;
         }
         #send-message:disabled {
             background-color: #cccccc;
             cursor: not-allowed;
         }
         #send-message img {
             width: 20px; /* Adjust icon size */
             height: auto;
         }
     `;
     document.head.appendChild(style);
     console.log("Global styles added for popups and chat.");
}
addGlobalStyles(); // Add styles when script loads

// Expose functions needed globally (e.g., called from HTML onclick)
window.showAuthPopup = showAuthPopup;
window.verifyCedula = verifyCedula; // May not be needed globally if only called internally
// Expose others if necessary, but internal calls don't need exposure.
window.activarChatbot = activarChatbot; // Might be needed if called externally? Keep for now.
window.inicializarChatIA = inicializarChatIA; // Keep for potential external re-init?

console.log("auth-popup.js combined script loaded and initialized.");

// --- END OF FILE auth-popup.js ---