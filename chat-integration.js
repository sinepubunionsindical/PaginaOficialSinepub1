
// Definir la clase AIChat globalmente
class AIChat {
    constructor() {
        this.conversationHistory = [];
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
    
    async processMessage(message) {
        try {
            console.log('Procesando mensaje:', message);
    
            const aiVideoContainer = document.getElementById('ai-video-container');
            if (aiVideoContainer) aiVideoContainer.style.display = 'block';
    
            const idleVideo = document.getElementById('idle-video');
            const speakingVideo = document.getElementById('speaking-video');
            if (idleVideo && speakingVideo) {
                idleVideo.classList.add('active');
                speakingVideo.classList.remove('active');
                if (idleVideo.paused) idleVideo.play().catch(e => console.warn('Video idle:', e));
            }
    
            // Enviar al backend local
            const response = await fetch(`${window.BACKEND_URL}/ia`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true"
                },
                body: JSON.stringify({ prompt: message })
            });
    
            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
    
            const data = await response.json();
            const aiResponse = data.respuesta || "No hubo respuesta de la IA.";
    
            // Actualizar historial
            this.conversationHistory.push(
                { role: "user", content: message },
                { role: "assistant", content: aiResponse }
            );
    
            // Limitar historial
            if (this.conversationHistory.length > 10) {
                this.conversationHistory = this.conversationHistory.slice(-10);
            }
    
            this.speakResponse(aiResponse);
            return aiResponse;
    
        } catch (error) {
            console.error("Error al consultar la IA local:", error);
            const fallbackResponse = "No se pudo establecer conexión con el servidor de IA. Por favor, verifica tu conexión a internet e intenta de nuevo.";
            this.speakResponse(fallbackResponse);
            return fallbackResponse;
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
