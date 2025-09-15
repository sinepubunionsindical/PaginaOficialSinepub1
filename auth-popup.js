async function verificarConexionBackend() {
    const backendUrl = window.API_ENDPOINTS?.base || window.BACKEND_URL || 'http://localhost:8000';

    try {
        const response = await fetch(`${backendUrl}/api/ping`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'User-Agent': 'sinepub-client'
            }
        });

        if (!response.ok) throw new Error("Respuesta inválida");

        const data = await response.json();
        return data?.status === 'ok';

    } catch (error) {
        console.warn('🔴 No hay conexión con el backend:', error.message);
        return false;
    }
}

function showDataConsentPopup() {
    console.log("📊 Mostrando popup de consentimiento de datos...");

    const existingPopup = document.getElementById("data-consent-popup");
    if (existingPopup) {
        console.log("📊 Popup de consentimiento ya está abierto.");
        return;
    }

    const popup = document.createElement("div");
    popup.id = "data-consent-popup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "white";
    popup.style.padding = "30px";
    popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    popup.style.zIndex = "10000";
    popup.style.borderRadius = "8px";
    popup.style.textAlign = "left";
    popup.style.maxWidth = "600px";
    popup.style.width = "90%";

    popup.innerHTML = `
        <h3 style="color: #0249aa; text-align: center;">Consentimiento para el Tratamiento de Datos Personales</h3>
        <p>Estimado usuario, para acceder al servicio de chat y verificar su afiliación al sindicato SINEPUB HUV, necesitamos recopilar y procesar ciertos datos personales:</p>
        <ul style="margin-left: 20px;">
            <li>Número de cédula (para verificar su afiliación)</li>
            <li>Nombre completo (proporcionado por nuestro sistema)</li>
            <li>Correo electrónico (si decide completar su perfil)</li>
            <li>Foto de perfil (opcional al completar su perfil)</li>
        </ul>
        <p>Estos datos serán utilizados exclusivamente para:</p>
        <ul style="margin-left: 20px;">
            <li>Verificar su afiliación al sindicato</li>
            <li>Personalizar su experiencia en la plataforma</li>
            <li>Brindarle acceso a servicios exclusivos para afiliados</li>
        </ul>
        <p>
            Sus datos serán tratados conforme a la Ley 1581 de 2012 (Habeas Data) y nuestras 
            <a href="#" id="open-privacy-policy" style="color: #0249aa; font-weight: bold;">Políticas de Privacidad</a>.
        </p>
        <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
            <button id="consent-accept-btn" style="background-color: #35a9aa; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Aceptar y Continuar</button>
            <button id="consent-cancel-btn" style="background-color: #f44336; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Cancelar</button>
        </div>
    `;

    document.body.appendChild(popup);

    document.getElementById("consent-accept-btn").addEventListener("click", function() {
        popup.remove();
        showAuthenticationPopup(); // Esto ya estaba en tu flujo
    });

    document.getElementById("consent-cancel-btn").addEventListener("click", function() {
        popup.remove();
        console.log("📊 Usuario canceló el consentimiento de datos");
    });

    // 🎯 NUEVO: Mostrar ventana emergente de políticas de privacidad
    document.getElementById("open-privacy-policy").addEventListener("click", function (e) {
        e.preventDefault();
        mostrarPopupPoliticasPrivacidad(); // Función que falta definir abajo
    });
}

// NUEVA FUNCIÓN: Popup para mostrar las Políticas de Privacidad
function mostrarPopupPoliticasPrivacidad() {
    const existingModal = document.getElementById("privacy-policy-popup");
    if (existingModal) return;

    const modal = document.createElement("div");
    modal.id = "privacy-policy-popup";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    modal.style.zIndex = "10001";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";

    const content = document.createElement("div");
    content.style.background = "#fff";
    content.style.padding = "35px";
    content.style.maxWidth = "800px";
    content.style.width = "90%";
    content.style.borderRadius = "8px";
    content.style.overflowY = "auto";
    content.style.maxHeight = "90vh";
    content.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
    content.innerHTML = `
        <h2 style="color: #0249aa; text-align:center;">Tratamiento de Datos y Políticas de Privacidad</h2>
        <div style="text-align: left; font-size: 14px; line-height: 1.5; max-height: 60vh; overflow-y: auto;">
            <pre style="
                white-space: pre-wrap;
                font-family: 'Segoe UI', 'Arial', sans-serif;
                font-size: 15px;
                line-height: 1.7;
                color: #333;
                background-color: #fdfdfd;
                border: 1px solid #ddd;
                border-radius: 6px;
                padding: 25px;
                overflow-y: auto;
                max-height: 60vh;
                box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
                scrollbar-width: thin;

                /* 👇 NUEVOS estilos añadidos 👇 */
                width: 100%;
                box-sizing: border-box;
                margin: 0;
            ">A continuación, se encuentra la política de privacidad y de tratamiento de datos personales que ha adoptado SINEPUB HUV, aplicando y cumpliendo las obligaciones de la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas que regulan la materia.
Con esta política, se busca garantizar los derechos a la privacidad, la intimidad y el buen nombre en el tratamiento de sus Datos Personales y, en consecuencia, todas las actuaciones de SINEPUB HUV se basarán en los principios de legalidad, finalidad, libertad, veracidad,  calidad, transparencia, acceso y circulación restringida, seguridad y confidencialidad.
En este sentido, todas los afiliados que en el ejercicio de las actividades de la Organización Sindical, suministren cualquier tipo de información o Dato Personal, tendrán el derecho a que sus Datos Personales sean tratados conforme se establece en la presente política y, en especial, podrán conocer sus Datos Personales, actualizarlos y rectificarlos, en caso de que los mismos se encuentren errados o sean imprecisos.
La recolección de sus datos tiene por finalidad la prestación de un mejor servicio y, en especial, que se puedan generar mecanismos más idóneos de comunicación, de tal manera que se pueda brindar toda la información relacionada con las actividades que desarrolla SINEPUB HUV y que se le pueda compartir noticias de interés, informes sobre las gestiones que se realizan en el desarrollo de sus funciones o de sus procesos y, ante todo, mejorar cada día en la calidad de nuestra atención.
Esta política aplica para todas las actividades que desarrolla SINEPUB HUV, tanto electrónica como físicamente, por lo que será aplicable a toda relación que se pueda desarrollar actualmente y en el futuro.
Si en algún momento requiere que se actualice su información, se ajuste o incluso, desea que sea eliminada, no dude en contactarse con la Organización Sindical a través del siguiente https://www.sinepub-huv.com, pues siempre se estará atentos a atender y garantizar su derecho de habeas data.




Responsable


El responsable de sus datos es SINEPUB HUV, identificada con NIT. 901434349-6.
Está ubicada en la Calle 5 No. 36-08 Piso 7°, Hospital Universitario del Valle “Evaristo García”, San Fernando, Cali.
Para ejercer sus derechos de habeas data puede escribir al correo electrónico: sinepubhuv@gmail.com o comunicarse al teléfono (602) 6206000 ext: 1835.  Se está muy atentos a recibir cualquier solicitud que tengan.


Titular de los Datos Personales y aceptación de la política de privacidad Términos del documento


Lo primero que debe tener claro es que el titular de sus datos personales es usted, por tanto, tiene derecho a brindar, de forma libre y voluntaria, la autorización o no, para el uso de los mismos, conforme a la política de SINEPUB HUV. Para su conocimiento, al aceptar esta política, está aceptando el uso de sus datos por parte de SINEPUB HUV para con sus afiliados a la Organización sindical, siempre limitados a los términos y condiciones previstos en esta política y cualquier modificación posterior que haya sobre la misma.
La declaración de aceptación que hace de la política es la siguiente:
“Al aceptar esta política, estoy aceptando como Titular de mis Datos Personales el Tratamiento de estos por parte de SINEPUB HUV, con la finalidad de prestar un mejor servicio y, en especial, cumplir con las funciones y obligaciones. Acepto que mis Datos Personales se usarán para fines de verificar la afiliación a la Organización Sindical, así como el envío de notificaciones, informes sobre estado del proceso o proyecto, noticias de interés, informes sobre las gestiones que se realizan, y diferente información relacionada con las actividades que se desarrollan. Lo anterior, sin perjuicio de que yo manifieste expresamente, a través de los medios establecidos para ello por parte de SINEPUB HUV, que se eliminen, rectifiquen o supriman mis Datos Personales de sus Bases de Datos”.
Dato Personal: Es cualquier información vinculada o que pueda asociarse a una o varias personas naturales.
Dato Privado: Es el dato que por su naturaleza íntima o reservada solo es relevante para el Titular del dato.
Dato Público: Son los datos relativos al estado civil, profesión u oficio y a la calidad de comerciante o de servidor público de una persona. Estos datos pueden ser obtenidos y ofrecidos sin reserva alguna y sin importar si hacen alusión a información general, privada o personal.
Dato Semiprivado: Es el dato que no es íntimo, reservado, ni público, cuyo conocimiento o divulgación puede interesar no solo a su Titular sino a cierto sector o grupo de personas o a la política en general, como el dato financiero y crediticio de actividad comercial.
Dato Sensible: Son los datos que afectan la intimidad del Titular o cuyo uso indebido puede generar su discriminación, tales como aquellos que revelen el origen racial o étnico, la orientación política, orientación sexual, las convicciones religiosas o filosóficas, la pertenencia a sindicatos, organizaciones sociales, de derechos humanos o que promueva intereses de cualquier partido político, entre otros.
Autorización: Es el consentimiento previo, expreso e informado del Titular para que SINEPUB HUV lleve a cabo el Tratamiento de sus Datos Personales.
Base de Datos: Es el conjunto organizado de Datos Personales que sea objeto de Tratamiento.
Encargado del Tratamiento: Es la persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, realice el Tratamiento de sus Datos Personales, bajo los términos y condiciones previstos en la presente política.
Responsable del Tratamiento: SINEPUB HUV por sí mismo o en asocio con otros, es el que decide sobre la Base de Datos y/o el Tratamiento de los Datos Personales, bajo los términos y condiciones previstos en la presente política.
Titular: Es usted, la persona natural cuyos Datos Personales está suministrando a SINEPUB HUV y serán objeto del tratamiento establecido en la presente política.
Tratamiento: Es cualquier operación o conjunto de operaciones sobre sus Datos Personales, tales como la recolección, almacenamiento, uso, circulación o supresión.
Autorización


SINEPUB HUV solicita la autorización escrita a todo afiliad@ a la organización sindical del cual realice el tratamiento de Datos Personales, para que sus datos puedan ser tratados de conformidad con la finalidad establecida para cada caso y en cumplimiento de las normas que regulan la materia, pero, principalmente, buscando la protección y la garantía del derecho constitucional al Habeas Data.
En todo caso, si decide navegar por la página web, solicitar y/o adquirir servicios de forma electrónica y/o física y acceder a la plataforma digital, medios en los que se requiere brindar sus datos personales, con el suministro de dichos datos, está aceptando de forma tácita el tratamiento de sus Datos Personales, conforme a la presente política.


Tratamiento


La información contenida en las bases de datos de SINEPUB HUV es sometida a distintas formas de tratamiento, tales como: recolección,  actualización, procesamiento,  o supresión, entre otras, todo lo anterior en cumplimiento de las finalidades y los objetivos establecidos en la presente Política de Tratamiento de Datos Personales.
Derechos del titular


Usted, como titular de los Datos Personales, tiene derecho a:
Conocer, actualizar, rectificar y solicitar la eliminación de sus Datos Personales de la Base de Datos de SINEPUB HUV.
Ser informado de los usos que se le están dando a sus Datos Personales.
Presentar quejas y reclamos ante las entidades correspondientes y ante SINPUB HUV.
Recibir respuesta a sus inquietudes y solicitudes, de una manera clara, completa y oportuna.
Revocar la autorización suministrada a SINEPUB HUV.
Los demás establecidos por la Ley.
Deberes de SINEPUB HUV


Según el artículo 17 de la Ley 1581 de 2012, SINEPUB HUV como responsable del tratamiento de sus Datos Personales, debe cumplir con los siguientes deberes:
Garantizarle, en todo tiempo, el pleno y efectivo ejercicio del derecho de Habeas Data.
Solicitar su autorización, como se hace en la presente política, y conservar una copia de la autorización que otorga frente a la misma.
Informarle sobre la finalidad de la recolección de sus Datos Personales y los derechos que tiene en virtud de ello.
Conservar la información bajo las condiciones de seguridad necesarias para impedir su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.
Garantizar que la información que se suministre al Encargado del Tratamiento sea veraz, completa, exacta, actualizada, comprobable y comprensible.
Actualizar su información, comunicando de forma oportuna al Encargado del Tratamiento, todas las novedades respecto de los datos que previamente le hayamos suministrado y adoptar las demás medidas necesarias para que la información suministrada se mantenga actualizada. Por ello lo invitamos siempre, a actualizar sus datos a través del presente link https://www.sinepu-huv.com.
Rectificar su información cuando sea incorrecta y comunicar lo pertinente al Encargado del Tratamiento. Si observa que se tiene información incorrecta, por favor informe tal situación a través de este link https://www.sinepu-huv.com, para que se pueda tener toda la información de forma correcta.
Suministrar al Encargado del Tratamiento, según el caso, únicamente datos cuyo Tratamiento esté previamente autorizado.
Exigir al Encargado del Tratamiento, en todo momento, el respeto a las condiciones de seguridad y privacidad de la información del Titular.
Tramitar las consultas y reclamos formulados. Por ello, si tiene alguna queja o reclamo, por favor accede al siguiente link https://www.sinepu-huv.com, para que se pueda atenderlo en el menor tiempo posible.
Adoptar un manual interno de políticas y procedimientos para el adecuado tratamiento de los Datos Personales.
Informar al Encargado del Tratamiento cuando determinada información se encuentra en discusión por parte del Titular, una vez se haya presentado la reclamación y no haya finalizado el trámite respectivo.
Informar, cuando así lo solicite, sobre el uso dado a sus Datos Personales.
Informar a la Autoridad de protección de datos cuando se presenten violaciones a los códigos de seguridad y existan riesgos en la administración de la información de los Titulares.


Cómo ejercer sus derechos de Habeas Data ante SINEPUB HUV


Además de hacer las solicitudes, quejas y reclamos en los links dispuestos en la presente política, podrá ejercer sus derechos, a través de los siguientes medios:
Electrónicamente en los siguiente link: https://www.sinepu-huv.com.
Mediante una comunicación enviada a través de correo electrónico a sinepubhuv@gmail.com  o a través de correo certificado físico dirigido al domicilio de l Organización Sindicaal.
En dicha solicitud, debe incluir:


Sus Datos Personales: Nombre, teléfono, dirección y datos de contacto.
Debe identificarse como Titular de los Datos Personales.
Debe describir de forma detallada los hechos que dan lugar a su solicitud.
Debe adjuntar los documentos que se requieran, dependiendo del tipo de solicitud que se trate.
Una vez recibida la solicitud completa, SINEPUB HUV incluirá en su Base de Datos una frase que dice “reclamo en trámite” y el motivo del mismo, en un término no mayor a dos (2) días hábiles. Dicha frase deberá mantenerse hasta que su solicitud sea decidida.
El término máximo para responder su solicitud será de diez (10) días hábiles contados a partir del día siguiente a la fecha en que SINEPUB HUV reciba su solicitud de forma completa. Cuando para SINEPUB HUV no fuere posible atender su solicitud dentro de dicho término, le informaremos los motivos de la demora y la fecha en que se responderá su solicitud, la cual en ningún caso podrá superar los cinco (5) días hábiles siguientes al vencimiento del primer término.
SINEPUB HUV podrá solicitar ampliación de la información enviada o información adicional. Si transcurridos dos (2) meses calendario desde la fecha del requerimiento de información adicional por parte de SINEPUB HUV, sin que se presente la misma, se entenderá que ha desistido de su solicitud.
Solo podrá presentar una queja ante la Superintendencia de Industria y Comercio una vez haya agotado el trámite de solicitud ante SINEPUB HUV como Responsable o Encargado del Tratamiento de sus Datos Personales.
Cualquier inquietud o información adicional, por favor contacte a SINEPUB HUV, por los medios informados en la presente política.</pre>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <button id="cerrar-privacidad" style="background: #0249aa; color: white; padding: 10px 20px; border: none; border-radius: 5px;">Cerrar</button>
                    </div>
                `;

                modal.appendChild(content);
                document.body.appendChild(modal);

                document.getElementById("cerrar-privacidad").addEventListener("click", () => {
                    modal.remove();
                });
            }




// Función para mostrar el Popup de autenticación (renombrada la original)
function showAuthenticationPopup() {
    console.log(" Intentando mostrar el popup de autenticación...");
    console.trace('Traza de la llamada a showAuthenticationPopup');

    try {
        const existingPopup = document.getElementById("auth-popup");
        if (existingPopup) {
            console.log(" Popup ya está abierto.");
            return;
        }

        console.log('Creando nuevo popup de autenticación...');

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
            <button id="verificar-cedula-btn">Verificar</button>
            <button id="cerrar-popup-btn">Cerrar</button>
        `;

        document.body.appendChild(popup);
        console.log(" Popup de autenticación añadido al DOM.");

        // Agregar event listeners a los botones
        document.getElementById('verificar-cedula-btn').addEventListener('click', function() {
            const cedula = document.getElementById('cedula-input').value;
            verifyCedula(cedula);
        });

        document.getElementById('cerrar-popup-btn').addEventListener('click', function() {
            document.getElementById('auth-popup').remove();
        });

        // Permitir enviar con Enter
        document.getElementById('cedula-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const cedula = document.getElementById('cedula-input').value;
                verifyCedula(cedula);
            }
        });
    } catch (error) {
        console.error('Error al crear el popup:', error);
    }
}

// Función para mostrar el Popup de autenticación - punto de entrada original
function showAuthPopup() {
    // Ahora muestra primero el popup de consentimiento
    showDataConsentPopup();
}

// Verificación de cédula
function verifyCedula(cedula) {
    console.log("Verificando cédula:", cedula);

    if (!cedula) {
        alert("Por favor ingrese un número de cédula válido");
        return;
    }

    // Guardar cédula en localStorage para que publicidad.js pueda accederla
    localStorage.setItem("cedula", cedula);

    // Verificar si config.js está cargado
    if (!window.API_ENDPOINTS) {
        // Cargar config.js primero
        const configScript = document.createElement('script');
        configScript.src = 'config.js';
        configScript.onload = function() {
            // Después cargar publicidad.js
            const script = document.createElement('script');
            script.src = 'publicidad.js';
            script.onload = function() {
                window.verificarCedulaPublicidad(cedula, handleVerificacionResult);
            };
            document.head.appendChild(script);
        };
        document.head.appendChild(configScript);
    } else if (typeof window.verificarCedulaPublicidad === 'undefined') {
        // Si config.js ya está cargado pero publicidad.js no
        const script = document.createElement('script');
        script.src = 'publicidad.js';
        script.onload = function() {
            window.verificarCedulaPublicidad(cedula, handleVerificacionResult);
        };
        document.head.appendChild(script);
    } else {
        // Si ambos scripts ya están cargados
        window.verificarCedulaPublicidad(cedula, handleVerificacionResult);
    }
}

// Callback para manejar el resultado de la verificación
function handleVerificacionResult(result) {
    if (result.valid) {
        let mensajeBienvenida = `<h2>Bienvenido al Sindicato</h2>
                                <p>Nombre: ${result.nombre}</p>
                                <p>Cargo: ${result.cargo}</p>`;
        mostrarPopupContrasena(result.nombre, result.cargo, mensajeBienvenida);
    } else {
        
    }
}

// Función para cerrar el popup de autenticación
function closeAuthPopup() {
    const authPopup = document.getElementById("auth-popup");
    if (authPopup) {
        authPopup.remove();
    }
}

// Función para mostrar el popup de contraseña
function mostrarPopupContrasena(nombre, cargo, mensajeBienvenida) {
    const popupContrasena = document.createElement("div");
    popupContrasena.id = "popup-contrasena";
    popupContrasena.style.position = "fixed";
    popupContrasena.style.top = "50%";
    popupContrasena.style.left = "50%";
    popupContrasena.style.transform = "translate(-50%, -50%)";
    popupContrasena.style.background = "#ffffff";
    popupContrasena.style.color = "#000000";
    popupContrasena.style.padding = "25px";
    popupContrasena.style.borderRadius = "10px";
    popupContrasena.style.textAlign = "center";
    popupContrasena.style.width = "400px";
    popupContrasena.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
    popupContrasena.style.zIndex = "10000";

    popupContrasena.innerHTML = `
        <h3> Verificación Adicional</h3>
        <p>${nombre}, por favor ingresa la contraseña maestra para continuar.</p>
        <input type="password" id="input-contrasena" placeholder="Contraseña">
        <br><br>
        <button id="verificar-contrasena">Verificar</button>
        <button id="cancelar-contrasena">Cancelar</button>
    `;

    document.body.appendChild(popupContrasena);

    let intentosRestantes = 2;

    document.getElementById("verificar-contrasena").addEventListener("click", async () => {
        const contrasena = document.getElementById("input-contrasena").value;
        const codigoSecreto = localStorage.getItem("codigo_secreto");
        const cedula = localStorage.getItem("cedula");

        if (contrasena === codigoSecreto) {
            popupContrasena.remove();
            localStorage.setItem("afiliado_autenticado", "true");

            console.log("🔍 Verificando estado del perfil en el backend para cédula:", cedula);

            try {
                // Mostrar indicador de carga      
                const loadingPopup = document.createElement("div");
                loadingPopup.id = "loading-popup";
                loadingPopup.style.position = "fixed";
                loadingPopup.style.top = "50%";
                loadingPopup.style.left = "50%";
                loadingPopup.style.transform = "translate(-50%, -50%)";
                loadingPopup.style.background = "rgba(255, 255, 255, 0.9)";
                loadingPopup.style.padding = "20px";
                loadingPopup.style.borderRadius = "10px";
                loadingPopup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
                loadingPopup.style.zIndex = "10001";
                loadingPopup.style.textAlign = "center";
                loadingPopup.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #35a9aa; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                        <p style="margin-top: 10px;">Verificando tu perfil...</p>
                    </div>
                    <style>
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    </style>
                `;
                document.getElementById("auth-popup")?.remove(); // ✅ Oculta popup de cédula si aún está presente
                document.body.appendChild(loadingPopup);

                const verificarPerfil = async () => {
                    try {
                        const perfilResponse = await fetch(window.API_ENDPOINTS.perfil(cedula), {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'ngrok-skip-browser-warning': 'true', // Para evitar la página de advertencia de ngrok
                                'User-Agent': 'sinepub-client' // Identificar la solicitud
                            }
                        });
                
                        if (!perfilResponse.ok) throw new Error("Error al obtener perfil");
                
                        const perfilData = await perfilResponse.json();
                        console.log("📊 Datos recibidos de /api/perfil:", perfilData);
                
                        const perfilCompletoBackend = perfilData.perfil_completo === true;
                        const perfilCompletoLocal = localStorage.getItem("perfil_completo") === "true";
                        
                        if (perfilCompletoBackend) {
                            console.log("✅ Perfil marcado como completo en backend o localStorage.");
                            localStorage.setItem('perfil_completo', 'true');
                            localStorage.setItem('afiliado', 'yes');
                        
                            const datos = perfilData.datos || {};
                            if (datos.nombre) localStorage.setItem('nombre', datos.nombre);
                            if (datos.correo && typeof datos.correo === "string" && datos.correo.includes("@")) {
                                localStorage.setItem('correo', datos.correo.trim());
                                console.log("📧 Correo guardado correctamente:", datos.correo);
                            } else {
                                console.warn("⚠️ Correo del backend no es válido o no está presente:", datos.correo);
                            }                            
                            if (datos.foto && datos.foto.backend_path) {
                                localStorage.setItem('foto_ruta', datos.foto.backend_path);
                            }
                        
                            document.getElementById("loading-popup")?.remove();
                            setTimeout(() => {
                                mostrarPopupBienvenidaPersonalizado();
                            }, 100); // o 200ms si querés asegurar sincronía
                            return;
                        }
                        
                        // Si no está completo ni en backend ni en localStorage
                        document.getElementById("loading-popup")?.remove();
                        const correo = perfilData.datos?.correo || "";
                        const telefono = perfilData.datos?.telefono || "";
                        mostrarFormularioCompletarPerfilObligatorio(cedula, nombre, correo, telefono);
                
                    } catch (error) {
                        console.error("❌ Error al verificar el perfil:", error);
                
                        // ✅ CRÍTICO: limpia el popup incluso en error
                        document.getElementById("loading-popup")?.remove();
                
                        if (localStorage.getItem("perfil_completo") === "true") {
                            mostrarPopupBienvenidaPersonalizado();
                            return;
                        }
                        const correo = perfilData.datos?.correo || "";
                        const telefono = perfilData.datos?.telefono || "";
                        mostrarFormularioCompletarPerfilObligatorio(cedula, nombre, correo, telefono);
                    }
                };
                

                await verificarPerfil();

            } catch (error) {
                console.error("❌ Error crítico al verificar el perfil:", error);
                document.getElementById("loading-popup")?.remove();
                const correo = perfilData.datos?.correo || "";
                const telefono = perfilData.datos?.telefono || "";
                mostrarFormularioCompletarPerfilObligatorio(cedula, nombre, correo, telefono);
            }

        } else {
            intentosRestantes--;
            popupContrasena.remove();

            if (intentosRestantes > 0) {
                alert(` Contraseña incorrecta. Te queda ${intentosRestantes} intento.`);
                mostrarPopupContrasena(nombre, cargo, mensajeBienvenida);
            } else {
                alert(" No eres afiliado al sindicato. Recuerda que la suplantación de identidad tiene consecuencias penales.");
                bloquearBoton();
            }
        }
    });

    document.getElementById("cancelar-contrasena").addEventListener("click", function () {
        popupContrasena.remove();
    });
}


// Nueva función para mostrar el popup de bienvenida simple (sin opciones de completar/omitir)
function mostrarPopupBienvenidaSimple(mensaje) {
    console.log("✅ Mostrando popup de bienvenida simple...");
    
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
    popupBienvenida.style.width = "500px";
    popupBienvenida.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
    popupBienvenida.style.zIndex = "10000";

    popupBienvenida.innerHTML = `
        <h2>Acceso Verificado</h2>
        ${mensaje}
        <p>¡Bienvenido de nuevo! Ahora puedes usar nuestro asistente virtual.</p>
        <button id="aceptar-btn" style="
            background-color: #0249aa;
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

    // Evento para el botón de aceptar
    const botonAceptar = document.getElementById("aceptar-btn");
    botonAceptar.addEventListener("mouseenter", function() {
        this.style.backgroundColor = "#03306b";
    });
    
    botonAceptar.addEventListener("mouseleave", function() {
        this.style.backgroundColor = "#0249aa";
    });
    
    botonAceptar.addEventListener("click", function() {
        popupBienvenida.remove();
        // Activar el chatbot directamente
        mostrarPopupBienvenidaPersonalizado();
    });

    // Ocultar el popup de autenticación si aún existe
    const authPopup = document.getElementById("auth-popup");
    if (authPopup) {
        authPopup.remove();
    }
}

// Función para mostrar el formulario de completar perfil obligatorio (sin opción de omitir)
function mostrarFormularioCompletarPerfilObligatorio(cedula, nombre, correo = "", telefono = ""){

    console.log("📝 Mostrando formulario obligatorio para completar perfil");
    
    const existingPopup = document.getElementById("auth-popup");
    if (existingPopup) {
        existingPopup.remove();
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
    popup.style.width = "400px";
    popup.style.textAlign = "center";

    popup.innerHTML = `
        <h3>Completa tu perfil para continuar</h3>
        <p>Para brindarte una mejor experiencia y un acceso completo, necesitamos que completes tu perfil. Estos datos se guardan de forma segura en nuestro servidor.</p>
        
        <div id="profile-panel">
            <div style="margin-bottom: 15px;">
                <label for="nombre">Nombre completo:</label>
                <input type="text" id="nombre-perfil" name="nombre" required value="${nombre}">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label for="correo">Correo electrónico:</label>
                 <input type="email" id="correo" value="${correo}" placeholder="tu@correo.com" required>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label for="telefono">Número de teléfono (opcional):</label>
                <input type="tel" id="telefono" value="${telefono}" placeholder="Tu número de teléfono">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label>Foto de perfil:</label>
                <div style="display: flex; align-items: center; justify-content: center; margin-top: 10px;">
                    <img id="user-photo-preview" src="" alt="Foto de perfil" style="width: 100px; height: 100px; border-radius: 50%; border: 1px solid #ccc; object-fit: cover; display: none;">
                    <input type="file" id="user-photo" accept="image/*" style="display: block; margin: 10px auto;">
                </div>
            </div>
            
            <button id="guardar-perfil-btn">Guardar Perfil</button>
        </div>
    `;

    document.body.appendChild(popup);
    
    // Obtener correo de localStorage si existe
    if (!document.getElementById('correo').value && localStorage.getItem("correo")) {
        document.getElementById('correo').value = localStorage.getItem("correo");
    }
    if (!document.getElementById('telefono').value && localStorage.getItem("telefono")) {
        document.getElementById('telefono').value = localStorage.getItem("telefono");
    }
    
    
    // Evento para previsualizar la imagen seleccionada
    document.getElementById('user-photo').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.getElementById('user-photo-preview');
                preview.src = event.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Evento para guardar el perfil
    let guardarBtn = document.getElementById('guardar-perfil-btn');
    
    if (guardarBtn) {
        // Clonar para limpiar listeners
        const newGuardarBtn = guardarBtn.cloneNode(true);
        guardarBtn.parentNode.replaceChild(newGuardarBtn, guardarBtn);
        guardarBtn = newGuardarBtn;
        
        guardarBtn.addEventListener('click', function() {
            // Validación de campos obligatorios
            const nombreValue = document.getElementById('nombre-perfil').value;
            const correoValue = document.getElementById('correo').value;
            
            if (!nombreValue || !correoValue) {
                alert('Por favor completa los campos obligatorios: Nombre y Correo electrónico');
                return;
            }
            
            // Deshabilitar botón mientras se guarda
            guardarBtn.disabled = true;
            guardarBtn.textContent = 'Guardando...';
            
            const telefonoValue = document.getElementById('telefono').value;
            const fotoPreview = document.getElementById('user-photo-preview');
            const fotoValue = fotoPreview.style.display !== 'none' ? fotoPreview.src : '';
            
            // Guardar en localStorage para uso temporal
            if (telefonoValue) {
                localStorage.setItem('telefono', telefonoValue);
            }
            
            // Enviar datos al backend
            const datos = {
                cedula: cedula,
                nombre: nombreValue,
                correo: correoValue,
                telefono: telefonoValue,
                foto: fotoValue
            };
            
            fetch(window.API_ENDPOINTS.perfilActualizar, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datos)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Actualizar localStorage con todos los datos
                    localStorage.setItem('nombre', nombreValue);
                    localStorage.setItem('correo', correoValue);
                    localStorage.setItem('perfil_completo', 'true');
                    localStorage.setItem('afiliado', 'yes');
                    if (telefonoValue) {
                        localStorage.setItem('telefono', telefonoValue);
                    }
                    if (data.foto_url) {
                        localStorage.setItem('foto_ruta', data.foto_url);
                    }
                    
                    // Cerrar el popup del formulario
                    popup.remove();
                    
                    // Mostrar mensaje de éxito y activar chatbot
                    const mensajeExito = `
                        <h2>¡Perfil Completado!</h2>
                        <p>Gracias por completar tu perfil. Ahora puedes disfrutar de todos los beneficios.</p>
                    `;
                    mostrarPopupBienvenidaSimple(mensajeExito);
                } else {
                    throw new Error(data.error || 'Error al actualizar el perfil');
                }
            })
            .catch(error => {
                console.error('Error al actualizar perfil:', error);
                alert('Ha ocurrido un error al actualizar tu perfil. Por favor intenta nuevamente.');
                guardarBtn.disabled = false;
                guardarBtn.textContent = 'Guardar Perfil';
            });
        });
    }
}
// Función para bloquear el botón en caso de acceso denegado
function bloquearBoton() {
    const chatButton = document.getElementById("chatbot-button");
    if (chatButton) {
        chatButton.style.backgroundColor = "red";
        chatButton.style.color = "white";
        chatButton.style.cursor = "not-allowed";
        chatButton.innerText = " No eres afiliado al sindicato";
        chatButton.disabled = true;

        // Guardar en LocalStorage que falló la validación
        localStorage.setItem("afiliado", "no");
    }
}

// Función para activar el chatbot después de cerrar el popup
function activarChatbot() {
    console.log(" 🎙️ Activando chatbot con IA desde auth-popup.js...");

    const botonChat = document.getElementById("chatbot-button");
    const linkEstatutos = document.getElementById("estatutos-link");
    const linkEstatutosMobile = document.getElementById("estatutos-link-mobile");
    const linkModulos = document.getElementById("modulos-link");
    const linkAfiliacion = document.getElementById("afiliacion-link");
    const videoContainer = document.getElementById("ai-video-container");
    const contenedorChatbot = document.getElementById("chatbot-container");
    const botonFlotante = document.getElementById("boton-flotante");

    // Ocultar botón y mostrar/ocultar enlaces
    if (botonChat) {
        botonChat.style.display = "none";
        console.log(" Botón de chat original ocultado");
    }
    
    if (linkEstatutos) linkEstatutos.style.display = "inline";
    if (linkEstatutosMobile) linkEstatutosMobile.style.display = "block"; 
    if (linkModulos) linkModulos.style.display = "inline";
    if (linkAfiliacion) linkAfiliacion.style.display = "none";
    
    // En lugar de configurar el contenedor chatbot directamente, usamos createChatButton
    try {
        console.log(" Creando botón flotante de chat con createChatButton()...");
        // Verificar si la función existe en el ámbito global
        if (typeof window.createChatButton === 'function') {
            window.createChatButton();
            console.log(" Botón de chat creado correctamente");
        } else {
            console.error(" La función createChatButton no está disponible globalmente");
            // Fallback a crearBotonFlotante nativo
            crearBotonFlotante();
            // ✅ Reconstruye menú móvil si estás en móvil
                if (window.innerWidth <= 768) {
                    setupMobileMenu();
                } 
        }
      
    } catch (error) {
        console.error(" Error al crear el botón de chat:", error);
        // Fallback a crearBotonFlotante nativo
        crearBotonFlotante();
    }
}

// Función para crear el botón flotante de chat si no existe
function crearBotonFlotante() {
    // --- Añadir verificación de página ---
    if (window.location.pathname.includes('publicidad.html')) {
        console.log(" No se crea/muestra botón flotante en publicidad.html");
        // Asegurar que esté oculto si ya existe
        let botonExistente = document.getElementById("boton-flotante");
        if (botonExistente) botonExistente.style.display = 'none';
        return; // Salir de la función
    }
    // --- Fin verificación ---
    
    // Verificar si ya existe
    let botonFlotante = document.getElementById("boton-flotante");
    
    if (!botonFlotante) {
        botonFlotante = document.createElement("div");
        botonFlotante.id = "boton-flotante";
        botonFlotante.className = "chat-flotante";
        botonFlotante.innerHTML = `
            <div class="chat-icon">
                <img src="images/chat-icon.png" alt="Chat" width="40">
            </div>
            <span>Hablar con Elektra</span>
        `;
        
        // Estilos básicos
        botonFlotante.style.position = "fixed";
        botonFlotante.style.bottom = "20px";
        botonFlotante.style.right = "20px";
        botonFlotante.style.backgroundColor = "#35a9aa";
        botonFlotante.style.color = "white";
        botonFlotante.style.padding = "10px 15px";
        botonFlotante.style.borderRadius = "25px";
        botonFlotante.style.display = "flex";
        botonFlotante.style.alignItems = "center";
        botonFlotante.style.gap = "10px";
        botonFlotante.style.cursor = "pointer";
        botonFlotante.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
        botonFlotante.style.zIndex = "9999";
        
        document.body.appendChild(botonFlotante);
        
        // Agregar evento para reabrir el chat
        botonFlotante.addEventListener('click', () => {
            console.log(" Botón flotante real clickeado, activando chatbot...");
            // Ocultar ESTE botón flotante real
            botonFlotante.style.display = "none"; 
            // Llamar a activarChatbot para mostrar el contenedor del chat y el video
            activarChatbot(); 
        });
    }
    
    // Asegurarse de que el botón esté visible si se acaba de crear o ya existía
    botonFlotante.style.display = "flex";
    return botonFlotante;
}

// Inicializar el botón de chat cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function() {
    console.log('Inicializando botón de chat desde auth-popup.js...');
    const chatButton = document.getElementById("chatbot-button");

    // Revisar si el usuario ya falló antes y bloquear botón
    if (localStorage.getItem("afiliado") === "no") {
        console.log('Usuario bloqueado por intentos previos');
        bloquearBoton();
    }

    if (chatButton) {
        console.log('Agregando event listener al botón de chat');
        chatButton.addEventListener("click", function() {
            console.log('Botón de chat clickeado');
            showAuthPopup();
        });
    } else {
        console.error('Botón de chat no encontrado en el DOM');
    }
});

document.addEventListener("DOMContentLoaded", async function() {
    console.log('Inicializando botón de chat desde auth-popup.js...');
    const chatButton = document.getElementById("chatbot-button");

    const conexionActiva = await verificarConexionBackend();

    if (!conexionActiva) {
        console.warn("❌ Servidor backend inactivo. Desactivando botón.");
        if (chatButton) {
            chatButton.disabled = true;
            chatButton.style.backgroundColor = "#888";
            chatButton.style.color = "#fff";
            chatButton.style.cursor = "not-allowed";
            chatButton.innerHTML = "⛔ Servidor inactivo";
            chatButton.title = "No se pudo conectar al servidor. Intenta más tarde.";
        }
        localStorage.setItem("backend_inactivo", "true");
        return;
    } else {
        localStorage.setItem("backend_inactivo", "false");
    }

    // Revisar si el usuario ya falló antes y bloquear botón
    if (localStorage.getItem("afiliado") === "no") {
        console.log('Usuario bloqueado por intentos previos');
        bloquearBoton();
    }

    if (chatButton) {
        console.log('Agregando event listener al botón de chat');
        chatButton.addEventListener("click", function() {
            console.log('Botón de chat clickeado');
            showAuthPopup();
        });
    } else {
        console.error('Botón de chat no encontrado en el DOM');
    }
});

// También intentar inicializar inmediatamente por si el DOM ya está cargado
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('DOM ya cargado, inicializando inmediatamente desde auth-popup.js');
    setTimeout(function() {
        const chatButton = document.getElementById("chatbot-button");
        if (chatButton) {
            console.log('Botón de chat encontrado, agregando event listener');
            chatButton.addEventListener("click", showAuthPopup);
        } else {
            console.error('Botón de chat no encontrado en el DOM (inicialización inmediata)');
        }

        // Comprobar si tenemos cédula guardada pero no perfil completo
        const cedula = localStorage.getItem("cedula");
        const perfilCompleto = localStorage.getItem("perfil_completo");
        
        if (cedula && perfilCompleto !== "true") {
            console.log(" Cédula encontrada pero perfil no marcado como completo, verificando con el backend...");
            // Verificar si el perfil ya existe en el backend
            comprobarPerfilUsuarioEnBackground(cedula);
        }
    }, 100);
}

// Inicializador unico del estado de la UI segun autenticacion
function initAuthUIState() {
    const isAuthed = localStorage.getItem('afiliado_autenticado') === 'true';

    const authBtnContainer = document.getElementById('boton-flotante');
    const chatContainer = document.getElementById('chatbot-container');
    const videoContainer = document.getElementById('ai-video-container');

    // Detectar boton flotante creado por chat-button.js o fallback local
    let floatingButton = document.getElementById('chat-float-button') || document.querySelector('.chat-flotante');

    const linkEstatutos = document.getElementById('estatutos-link');
    const linkEstatutosMobile = document.getElementById('estatutos-link-mobile');
    const linkModulos = document.getElementById('modulos-link');
    const linkAfiliacion = document.getElementById('afiliacion-link');

    if (isAuthed) {
        if (authBtnContainer) authBtnContainer.style.display = 'none';
        if (chatContainer) chatContainer.style.display = 'block';
        if (videoContainer) videoContainer.style.display = 'block';

        // Asegurar boton flotante real
        if (!floatingButton) {
            if (typeof window.createChatButton === 'function') {
                floatingButton = window.createChatButton();
            } else if (typeof window.crearBotonFlotante === 'function') {
                floatingButton = window.crearBotonFlotante();
            }
        }
        if (floatingButton) floatingButton.style.display = 'flex';

        // Links visibles para afiliados
        if (linkEstatutos) linkEstatutos.style.display = 'inline';
        if (linkEstatutosMobile) linkEstatutosMobile.style.display = 'block';
        if (linkModulos) linkModulos.style.display = 'inline';
        if (linkAfiliacion) linkAfiliacion.style.display = 'none';
    } else {
        if (authBtnContainer) authBtnContainer.style.display = 'block';
        if (chatContainer) chatContainer.style.display = 'none';
        if (videoContainer) videoContainer.style.display = 'none';

        // Ocultar boton flotante si existe
        if (floatingButton) floatingButton.style.display = 'none';

        // Estado de links para no afiliados
        if (linkEstatutos) linkEstatutos.style.display = 'none';
        if (linkEstatutosMobile) linkEstatutosMobile.style.display = 'none';
        if (linkModulos) linkModulos.style.display = 'none';
        if (linkAfiliacion) linkAfiliacion.style.display = 'inline';
    }
}

// Exponer funciones globalmente
window.showAuthPopup = showAuthPopup;
window.verifyCedula = verifyCedula;
window.mostrarPopupContrasena = mostrarPopupContrasena;
window.mostrarPopupBienvenidaSimple = mostrarPopupBienvenidaSimple;
window.mostrarFormularioCompletarPerfilObligatorio = mostrarFormularioCompletarPerfilObligatorio;
window.bloquearBoton = bloquearBoton;
window.activarChatbot = activarChatbot;
window.verificarPerfilUsuario = verificarPerfilUsuario;

// Inicializacion unica al cargar el DOM (consolida duplicados)
document.addEventListener('DOMContentLoaded', async () => {
    const chatButton = document.getElementById('chatbot-button');
    const conexionActiva = await verificarConexionBackend();
    localStorage.setItem('backend_inactivo', conexionActiva ? 'false' : 'true');

    if (!conexionActiva && chatButton) {
        chatButton.disabled = true;
        chatButton.style.backgroundColor = '#888';
        chatButton.style.color = '#fff';
        chatButton.style.cursor = 'not-allowed';
        chatButton.innerHTML = 'Servidor inactivo';
        chatButton.title = 'No se pudo conectar al servidor. Intenta mas tarde.';
    }

    // Levantar la UI correcta segun localStorage
    initAuthUIState();

    // Click del boton principal para abrir autenticacion
    if (chatButton) {
        chatButton.addEventListener('click', () => {
            showAuthPopup();
        });
    }
});


// Función para mostrar mensajes de error
function mostrarError(mensaje) {
    console.error(" Error:", mensaje);
    alert(mensaje);
}

// Función auxiliar para obtener la URL del backend
function getBackendUrl() {
    // Primero intentar usar la URL de config.js
    if (window.API_ENDPOINTS && window.API_ENDPOINTS.base) {
        console.log(" Usando URL desde API_ENDPOINTS:", window.API_ENDPOINTS.base);
        return window.API_ENDPOINTS.base;
    }
    
    // Segundo intento: usar BACKEND_URL global
    if (window.BACKEND_URL) {
        console.log(" Usando BACKEND_URL global:", window.BACKEND_URL);
        return window.BACKEND_URL;
    }
    
    // Si nada funciona, usar localhost como última opción
    const localUrl = "http://localhost:8000";
    console.log(" Usando URL local:", localUrl);
    return localUrl;
}

function verificarPerfilEnBackend() {
    const cedula = window.cedulaAutenticada;
    
    if (!cedula) {
        console.error("❌ No hay cédula autenticada en memoria");
        mostrarUIInicial();
        return;
    }
    
    console.log("🔍 Verificando perfil para cédula en memoria");
    
    fetch(window.API_ENDPOINTS.perfil(cedula))
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            
            if (data.perfil_completo) {
                console.log("✅ Perfil completo confirmado por backend");
                mostrarPopupBienvenidaPersonalizado(); // O activarChatbot()
            } else {
                console.log("⚠️ Perfil incompleto, mostrando formulario");
            }
        })
        .catch(error => {
            console.error("❌ Error verificando perfil:", error);
            mostrarUIInicial();
        });
}

function enviarDatosPerfil(datos) {
    
    console.log(" Enviando datos de perfil:", {...datos, foto: datos.foto ? '(Base64 imagen)' : null});

    fetch(window.API_ENDPOINTS.perfilActualizar, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log("✅ Perfil actualizado correctamente");
            actualizarUIParaPerfilCompleto();
        } else {
            throw new Error(data.mensaje || "Error actualizando perfil");
        }
    })
    .catch(error => {
        console.error("❌ Error:", error);
        alert("Error actualizando perfil: " + error.message);
    });
}

// Nueva función para mostrar el popup de bienvenida personalizado con foto
async function mostrarPopupBienvenidaPersonalizado() {
    console.log("👋 Mostrando popup de bienvenida personalizado");

    const cedula = localStorage.getItem("cedula");
    let nombre = localStorage.getItem("nombre") || "Usuario";
    let fotoPublica = "";

    try {
        const response = await fetch(window.API_ENDPOINTS.perfilFoto(cedula), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'User-Agent': 'sinepub-client'
            }
        });        
        if (response.ok) {
            const data = await response.json();
            fotoPublica = data.foto_base64;
            localStorage.setItem("foto", fotoPublica); // opcional
        } else {
            console.warn("⚠️ No se pudo cargar la foto desde el backend");
        }
    } catch (error) {
        console.error("❌ Error al obtener la foto base64:", error);
    }

    // Crear el popup
    const popupBienvenida = document.createElement("div");
    popupBienvenida.id = "popup-bienvenida-personalizado";
    popupBienvenida.style.position = "fixed";
    popupBienvenida.style.top = "50%";
    popupBienvenida.style.left = "50%";
    popupBienvenida.style.transform = "translate(-50%, -50%)";
    popupBienvenida.style.background = "#35a9aa";
    popupBienvenida.style.color = "#0249aa";
    popupBienvenida.style.padding = "30px";
    popupBienvenida.style.borderRadius = "10px";
    popupBienvenida.style.textAlign = "center";
    popupBienvenida.style.width = "420px";
    popupBienvenida.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
    popupBienvenida.style.zIndex = "10000";

    // Contenido del popup
    popupBienvenida.innerHTML = `
        <h2 style="margin-top: 0; color: #0249aa;">¡Bienvenido de nuevo!</h2>
        ${fotoPublica ? `<img src="${fotoPublica}" alt="Foto de perfil" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 10px auto; display: block; border: 3px solid #0249aa;">` : ''}
        <h3 style="margin: 15px 0; color: #0249aa;">¡Hola ${nombre}!</h3>
        <p style="margin-bottom: 20px; color: #0249aa;">Estamos contentos de verte nuevamente. ¿Deseas acceder al sistema?</p>
        <button id="continuar-btn" style="
            background-color: #0249aa;
            color: white;
            font-size: 16px;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease-in-out;">
            Sí, ingresar ahora
        </button>
    `;

    document.body.appendChild(popupBienvenida);

    const continuarBtn = document.getElementById("continuar-btn");
    continuarBtn.addEventListener("mouseenter", () => {
        continuarBtn.style.backgroundColor = "#35a9aa";
        continuarBtn.style.color = "#0249aa";
    });
    continuarBtn.addEventListener("mouseleave", () => {
        continuarBtn.style.backgroundColor = "#0249aa";
        continuarBtn.style.color = "white";
    });
    continuarBtn.addEventListener("click", () => {
        popupBienvenida.remove();
        document.getElementById("auth-popup")?.remove();
        // Reconstituir UI y opcionalmente abrir chat
        initAuthUIState();
        // activarChatbot(); // opcional si quieres auto-abrir chat
    });
}

