// Importar ROLE_CONTEXTS
let ROLE_CONTEXTS;

// Cargar ROLE_CONTEXTS de manera asíncrona
fetch('role-contexts.js')
    .then(response => response.text())
    .then(text => {
        // Extraer el objeto ROLE_CONTEXTS del texto del archivo
        const startMarker = 'export const ROLE_CONTEXTS = {';
        const endMarker = '};';
        const start = text.indexOf(startMarker) + startMarker.length;
        const end = text.indexOf(endMarker, start) + endMarker.length - 1;
        const contextText = text.substring(start, end);

        // Evaluar el texto para obtener el objeto
        ROLE_CONTEXTS = new Function(`return {${contextText}}`)();
        console.log('ROLE_CONTEXTS cargado correctamente:', ROLE_CONTEXTS);
    })
    .catch(error => {
        console.error('Error al cargar ROLE_CONTEXTS:', error);
        // Definir un objeto por defecto en caso de error
        ROLE_CONTEXTS = {
            Presidenciales: 'Eres el presidente del sindicato SINEPUB HUV.',
            Afiliado: 'Eres un asistente especializado en atender consultas de afiliados al SINEPUB HUV.',
            NoAfiliado: 'Eres un asistente informativo para personas no afiliadas al SINEPUB HUV.',
            JuntaDirectiva: 'Eres un asistente especializado para miembros de la Junta Directiva del SINEPUB HUV.'
        };
    });

// Definir la clase AIChat globalmente
class AIChat {
    constructor() {
        this.conversationHistory = [];
        this.currentRole = null;
        this.videoElement = null;
        this.videos = {
            idle: '1.mp4',    // Video de espera
            speaking: '2.mp4' // Video de habla
        };

        // Precargar los videos
        this.preloadVideos();
    }

    preloadVideos() {
        // Precargar el video de espera
        const preloadIdle = new Image();
        preloadIdle.src = this.videos.idle;

        // Precargar el video de habla
        const preloadSpeaking = new Image();
        preloadSpeaking.src = this.videos.speaking;

        console.log('Videos precargados');
    }
    getRoleContext() {
        return ROLE_CONTEXTS[this.currentRole] || "Eres un asistente general del sindicato SINEPUB HUV";
    }
    async initialize(roleType) {
        this.currentRole = roleType;
        console.log(`Inicializando chat con rol: ${roleType}`);

        // Asegurarse de que el contenedor de video esté visible
        const aiVideoContainer = document.getElementById('ai-video-container');
        if (aiVideoContainer) {
            aiVideoContainer.style.display = 'block';
            console.log('Mostrando contenedor de video en initialize');
        } else {
            console.warn('No se encontró el contenedor de video en initialize');
        }

        // Obtener los elementos de video
        const idleVideo = document.getElementById('idle-video');
        const speakingVideo = document.getElementById('speaking-video');

        if (idleVideo && speakingVideo) {
            console.log('Videos encontrados en el DOM');

            // Asegurarse de que los videos estén configurados correctamente
            idleVideo.muted = true;
            idleVideo.loop = true;
            idleVideo.autoplay = true;
            idleVideo.playsInline = true;

            speakingVideo.muted = true;
            speakingVideo.loop = true;
            speakingVideo.autoplay = true;
            speakingVideo.playsInline = true;

            // Asegurarse de que el video de espera esté activo
            idleVideo.classList.add('active');
            speakingVideo.classList.remove('active');

            // Intentar reproducir el video de espera
            try {
                await idleVideo.play();
                console.log('Video de espera reproducido correctamente en initialize');
            } catch (error) {
                console.warn('Error al reproducir el video de espera en initialize:', error);
                // Intentar reproducir de nuevo después de un breve retraso
                setTimeout(() => {
                    idleVideo.play().catch(e => {
                        console.warn('Segundo intento fallido:', e);
                    });
                }, 1000);
            }

            console.log('Videos inicializados correctamente');
        } else {
            console.error('No se encontraron los elementos de video en el DOM');
        }

        return true;
    }

    async processMessage(message) {
        try {
            console.log('Procesando mensaje:', message);

            // Asegurarse de que el contenedor de video esté visible
            const aiVideoContainer = document.getElementById('ai-video-container');
            if (aiVideoContainer) {
                aiVideoContainer.style.display = 'block';
                console.log('Mostrando contenedor de video en processMessage');
            }

            // Obtener los elementos de video
            const idleVideo = document.getElementById('idle-video');
            const speakingVideo = document.getElementById('speaking-video');

            // Asegurarse de que el video esté en modo de espera
            if (idleVideo && speakingVideo) {
                try {
                    console.log('Asegurando que el video de espera esté activo');

                    // Asegurarse de que el video de espera esté reproduciéndose
                    if (idleVideo.paused) {
                        idleVideo.play().catch(error => {
                            console.warn('Error al reproducir el video de espera:', error);
                        });
                    }

                    // Aplicar la transición si es necesario
                    if (!idleVideo.classList.contains('active')) {
                        speakingVideo.classList.remove('active');
                        idleVideo.classList.add('active');
                        console.log('Transición al video de espera aplicada');
                    }
                } catch (error) {
                    console.warn('Error al cambiar al video de espera:', error);
                }
            } else {
                console.warn('No se encontraron los elementos de video');
            }

            // Preparar el contexto del rol actual
            const roleContext = this.getRoleContext();
            console.log('Usando contexto de rol:', this.currentRole);

            // Preparar el mensaje para la API
            // Construir el historial de conversación en formato de texto (para el modelo alternativo)
            let conversationText = `${roleContext}\n\n`;

            // Añadir historial de conversación previo
            if (this.conversationHistory.length > 0) {
                for (const msg of this.conversationHistory) {
                    if (msg.role === "user") {
                        conversationText += `Usuario: ${msg.content}\n`;
                    } else {
                        conversationText += `Asistente: ${msg.content}\n`;
                    }
                }
                conversationText += "\n";
            }

            // Añadir el mensaje actual
            conversationText += `Usuario: ${message}\n\nAsistente: `;

            console.log('Texto de conversación preparado:', conversationText.substring(0, 200) + '...');

            try {
                // Establecer un timeout para la solicitud
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos de timeout

                console.log('Enviando solicitud al modelo Qwen2.5-72B-Instruct...');

                try {
                    // Preparar los mensajes en el formato esperado por la API de chat completions
                    const chatMessages = [];

                    // Añadir el contexto del rol como un mensaje del sistema
                    chatMessages.push({
                        role: "system",
                        content: roleContext
                    });

                    // Añadir el historial de conversación previo
                    for (const msg of this.conversationHistory) {
                        chatMessages.push({
                            role: msg.role,
                            content: msg.content
                        });
                    }

                    // Añadir el mensaje actual del usuario
                    chatMessages.push({
                        role: "user",
                        content: message
                    });

                    console.log('Mensajes preparados:', JSON.stringify(chatMessages).substring(0, 200) + '...');

                    // Formato para la API de chat completions con el proveedor hyperbolic
                    const chatCompletionRequest = {
                        model: "Qwen/Qwen2.5-72B-Instruct",
                        messages: chatMessages,
                        temperature: 0.5,
                        max_tokens: 2048,
                        top_p: 0.7,
                        stream: false // No usamos streaming en el navegador por simplicidad
                    };

                    const response = await fetch('https://api.hyperbolic.ai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + (window.API_KEYS ? window.API_KEYS.HYPERBOLIC_TOKEN : ''),
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(chatCompletionRequest),
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId); // Limpiar el timeout si la solicitud se completa

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.warn(`Error en la respuesta de la API: ${response.status} ${response.statusText}`);
                        console.warn('Detalles del error:', errorText);

                        // Si el error es de autenticación o modelo no disponible, intentar con un modelo alternativo
                        console.log('Intentando con modelo alternativo en Hugging Face...');

                        const alternativeResponse = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer ' + (window.API_KEYS ? window.API_KEYS.HUGGINGFACE_TOKEN : ''),
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                inputs: conversationText,
                                parameters: {
                                    temperature: 0.7,
                                    max_new_tokens: 1024,
                                    top_p: 0.9,
                                    do_sample: true,
                                    return_full_text: false
                                }
                            })
                        });

                        if (!alternativeResponse.ok) {
                            throw new Error(`Error en ambos modelos: Qwen (${response.status}) y Mistral (${alternativeResponse.status})`);
                        }

                        console.log('Modelo alternativo respondió correctamente');
                        return alternativeResponse.json();
                    }

                    const result = await response.json();
                    console.log('Respuesta recibida:', result);

                    // Verificar la estructura de la respuesta y extraer el contenido
                    let aiResponse;

                    console.log('Analizando estructura de respuesta:', JSON.stringify(result).substring(0, 200) + '...');

                    // Diferentes formatos posibles de respuesta
                    if (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
                        // Formato de chat completions API (hyperbolic/Qwen)
                        // { choices: [{ message: { content: "texto", role: "assistant" } }] }
                        aiResponse = result.choices[0].message.content;
                    } else if (result.generated_text) {
                        // Formato de Hugging Face Inference API
                        // { generated_text: "texto" }
                        aiResponse = result.generated_text;
                    } else if (result.choices && result.choices[0] && result.choices[0].text) {
                        // Formato alternativo
                        // { choices: [{ text: "texto" }] }
                        aiResponse = result.choices[0].text;
                    } else if (typeof result === 'string') {
                        // Respuesta como string
                        aiResponse = result;
                    } else if (Array.isArray(result) && result.length > 0) {
                        // Formato de array
                        // [{ generated_text: "texto" }]
                        if (result[0].generated_text) {
                            aiResponse = result[0].generated_text;
                        } else if (result[0].message && result[0].message.content) {
                            aiResponse = result[0].message.content;
                        } else {
                            aiResponse = JSON.stringify(result[0]);
                        }
                    } else {
                        // Intentar extraer cualquier texto que parezca una respuesta
                        console.error('Estructura de respuesta inesperada:', result);
                        aiResponse = 'Lo siento, recibí una respuesta inesperada del servidor. Por favor, intenta de nuevo.';

                        // Intentar extraer alguna respuesta de la estructura
                        if (result && typeof result === 'object') {
                            const jsonStr = JSON.stringify(result);
                            if (jsonStr.includes('"content":')) {
                                const contentMatch = jsonStr.match(/"content":"([^"]+)"/);
                                if (contentMatch && contentMatch[1]) {
                                    aiResponse = contentMatch[1];
                                }
                            }
                        }
                    }

                    console.log('Respuesta extraída:', aiResponse.substring(0, 100) + '...');

                    // Actualizar historial
                    this.conversationHistory.push(
                        { role: "user", content: message },
                        { role: "assistant", content: aiResponse }
                    );

                    // Mantener historial manejable
                    if (this.conversationHistory.length > 10) {
                        this.conversationHistory = this.conversationHistory.slice(-10);
                    }

                    // Reproducir la respuesta con voz y cambiar el video
                    this.speakResponse(aiResponse);

                    return aiResponse;

                } catch (fetchError) {
                    if (fetchError.name === 'AbortError') {
                        console.error('La solicitud a la API ha excedido el tiempo de espera');
                        const timeoutResponse = 'Lo siento, la conexión con el servidor está tardando demasiado. Esto puede deberse a que el modelo está ocupado o temporalmente no disponible. Por favor, intenta de nuevo más tarde.';

                        // Actualizar historial
                        this.conversationHistory.push(
                            { role: "user", content: message },
                            { role: "assistant", content: timeoutResponse }
                        );

                        // Reproducir la respuesta con voz
                        this.speakResponse(timeoutResponse);

                        return timeoutResponse;
                    }
                    throw fetchError; // Re-lanzar otros errores
                }
            } catch (apiError) {
                console.error('Error en la llamada a la API:', apiError);

                // Respuesta de fallback para errores de API
                let fallbackResponse = 'Lo siento, estoy teniendo problemas para conectarme al servidor. Por favor, intenta de nuevo más tarde.';

                // Proporcionar mensajes más específicos según el tipo de error
                if (apiError.message && apiError.message.includes('Loading')) {
                    fallbackResponse = 'El modelo de IA está inicializándose en este momento. Esto puede tomar unos minutos si el modelo ha estado inactivo. Por favor, intenta de nuevo en un momento.';
                } else if (apiError.message && apiError.message.includes('ambos modelos')) {
                    fallbackResponse = 'Lo siento, actualmente los modelos de IA están offline o no disponibles. Esto puede deberse a mantenimiento o alta demanda. Por favor, intenta de nuevo más tarde.';
                } else if (apiError.name === 'TypeError' && apiError.message.includes('Failed to fetch')) {
                    fallbackResponse = 'No se pudo establecer conexión con el servidor de IA. Por favor, verifica tu conexión a internet e intenta de nuevo.';
                }

                // Actualizar historial con el mensaje del usuario y la respuesta de fallback
                this.conversationHistory.push(
                    { role: "user", content: message },
                    { role: "assistant", content: fallbackResponse }
                );

                // Reproducir la respuesta con voz
                this.speakResponse(fallbackResponse);

                return fallbackResponse;
            }
        } catch (error) {
            console.error('Error general en procesamiento:', error);
            const errorResponse = 'Lo siento, hubo un error en el procesamiento. Por favor, intenta de nuevo.';

            // Actualizar historial
            this.conversationHistory.push(
                { role: "user", content: message },
                { role: "assistant", content: errorResponse }
            );

            // Reproducir la respuesta con voz
            this.speakResponse(errorResponse);

            return errorResponse;
        }
    }

    async speakResponse(text) {
        console.log('Reproduciendo respuesta con TTS:', text.substring(0, 50) + '...');

        // Asegurarse de que el contenedor de video esté visible
        const aiVideoContainer = document.getElementById('ai-video-container');
        if (aiVideoContainer) {
            aiVideoContainer.style.display = 'block';
            console.log('Mostrando contenedor de video en speakResponse');
        }

        // Obtener los elementos de video
        const idleVideo = document.getElementById('idle-video');
        const speakingVideo = document.getElementById('speaking-video');

        // Cambiar al video de habla con transición suave
        if (idleVideo && speakingVideo) {
            try {
                console.log('Cambiando a video de habla con transición suave');

                // Verificar si el video de habla está cargado
                if (speakingVideo.readyState < 2) { // HAVE_CURRENT_DATA = 2
                    console.log('Video de habla no está listo, esperando a que cargue...');
                    // Esperar a que el video esté listo
                    await new Promise((resolve) => {
                        speakingVideo.addEventListener('canplay', resolve, { once: true });
                        // Timeout por si el evento nunca se dispara
                        setTimeout(resolve, 2000);
                    });
                }

                // Reiniciar el video para que comience desde el principio
                speakingVideo.currentTime = 0;

                // Reproducir el video de habla
                const playPromise = speakingVideo.play();
                if (playPromise !== undefined) {
                    await playPromise.catch(error => {
                        console.warn('Error al reproducir el video de habla:', error);
                    });
                }

                // Aplicar la transición
                idleVideo.classList.remove('active'); // Ocultar el video de espera
                speakingVideo.classList.add('active'); // Mostrar el video de habla

                console.log('Transición al video de habla completada');
            } catch (error) {
                console.warn('Error durante la transición al video de habla:', error);
            }
        } else {
            console.warn('No se encontraron los elementos de video');
        }

        // Usar Web Speech API para TTS
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';

        return new Promise((resolve) => {
            utterance.onend = () => {
                console.log('Reproducción de TTS finalizada');

                // Volver al video de espera con transición suave
                // Obtener los elementos de video
                const idleVideo = document.getElementById('idle-video');
                const speakingVideo = document.getElementById('speaking-video');

                if (idleVideo && speakingVideo) {
                    try {
                        console.log('Volviendo a video de espera con transición suave');

                        // Verificar si el video de espera está cargado
                        if (idleVideo.readyState < 2) { // HAVE_CURRENT_DATA = 2
                            console.log('Video de espera no está listo, esperando a que cargue...');
                            // Esperar a que el video esté listo (con un timeout)
                            setTimeout(() => {
                                // Continuar con la transición de todos modos después del timeout
                                continueTransition();
                            }, 1000);
                        } else {
                            continueTransition();
                        }

                        function continueTransition() {
                            // Reiniciar el video para que comience desde el principio
                            idleVideo.currentTime = 0;

                            // Reproducir el video de espera
                            idleVideo.play().catch(error => {
                                console.warn('Error al reproducir el video de espera:', error);
                            });

                            // Aplicar la transición
                            speakingVideo.classList.remove('active'); // Ocultar el video de habla
                            idleVideo.classList.add('active'); // Mostrar el video de espera

                            console.log('Transición al video de espera completada');
                        }
                    } catch (error) {
                        console.warn('Error durante la transición al video de espera:', error);
                        // Intentar aplicar la transición de todos modos
                        speakingVideo.classList.remove('active');
                        idleVideo.classList.add('active');
                    }
                } else {
                    console.warn('No se encontraron los elementos de video');
                }

                resolve();
            };

            // En caso de error, resolver la promesa después de un tiempo
            utterance.onerror = (error) => {
                console.error('Error en la síntesis de voz:', error);

                // Volver al video de espera en caso de error
                if (this.videoElement && this.videoElement.tagName === 'VIDEO') {
                    try {
                        this.videoElement.src = this.videos.idle;
                        const playPromise = this.videoElement.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(() => {});
                        }
                    } catch (videoError) {
                        console.warn('No se pudo volver al video de espera:', videoError);
                    }
                }

                resolve();
            };

            try {
                speechSynthesis.speak(utterance);
            } catch (error) {
                console.error('Error al iniciar la síntesis de voz:', error);

                // Volver al video de espera en caso de error
                if (this.videoElement && this.videoElement.tagName === 'VIDEO') {
                    try {
                        console.log('Volviendo a video de espera (error):', this.videos.idle);
                        this.videoElement.src = this.videos.idle;
                        const playPromise = this.videoElement.play();
                        if (playPromise !== undefined) {
                            playPromise.then(() => {
                                console.log('Video de espera reproducido correctamente (error)');
                            }).catch(() => {
                                // Intentar reproducir de nuevo después de un breve retraso
                                setTimeout(() => {
                                    this.videoElement.play().catch(() => {});
                                }, 500);
                            });
                        }
                    } catch (videoError) {
                        console.warn('No se pudo volver al video de espera:', videoError);
                    }
                }

                resolve(); // Resolver la promesa para no bloquear el flujo
            }
        });
    }
}
