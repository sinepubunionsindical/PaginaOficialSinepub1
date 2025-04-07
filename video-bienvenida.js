document.addEventListener('DOMContentLoaded', function () {
    try {
        const videoContainer = document.getElementById('video-bienvenida');
        const titulo = document.querySelector('.titulo-bienvenida');
        const video = document.getElementById('video-intro');
        const cerrarBtn = document.getElementById('cerrar-video');

        // Validación de elementos clave
        if (!videoContainer || !titulo || !video || !cerrarBtn) {
            console.warn('⚠️ Elementos de video de bienvenida no encontrados. Cancelando inicialización.');
            return;
        }

        // Si ya se mostró en esta sesión, no lo volvemos a mostrar
        if (sessionStorage.getItem('videoMostrado') === 'true') {
            videoContainer.style.display = 'none';
            return;
        }

        // Función para determinar si es dispositivo móvil
        const isMobile = () => window.innerWidth <= 768;

        // Ajustar comportamiento según el dispositivo
        const iniciarVideo = () => {
            videoContainer.classList.add('active');

            setTimeout(() => {
                titulo.classList.add('active');
            }, 800);

            // En móviles, asegurarse de que el video esté en modo inline
            if (isMobile()) {
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
            }

            // Intentar reproducir el video con manejo de errores
            video.play().catch((err) => {
                console.warn('🎥 Error al reproducir video:', err.message);
                // Si falla la reproducción automática, mostrar un botón de play
                if (err.name === 'NotAllowedError') {
                    if (!document.querySelector('.play-button')) {
                        const playButton = document.createElement('button');
                        playButton.innerHTML = '▶️';
                        playButton.className = 'play-button';
                        video.parentElement.appendChild(playButton);
                
                        playButton.addEventListener('click', () => {
                            video.play();
                            playButton.remove();
                        });
                    }
                }                
            });
        };

        // Retraso inicial antes de mostrar
        setTimeout(iniciarVideo, 1000);

        // Función para cerrar el video
        function cerrarVideo() {
            videoContainer.classList.remove('active');
            video.pause();
            video.currentTime = 0;

            // Remover del DOM después de animación
            setTimeout(() => {
                videoContainer.style.display = 'none';
            }, 800);

            // Marcar como mostrado para esta sesión
            sessionStorage.setItem('videoMostrado', 'true');
        }

        // Event listeners
        cerrarBtn.addEventListener('click', cerrarVideo);
        video.addEventListener('ended', cerrarVideo);

        // Manejar cambios de orientación en móviles
        window.addEventListener('orientationchange', () => {
            if (videoContainer.classList.contains('active')) {
                // Pequeño retraso para permitir que la orientación se complete
                setTimeout(() => {
                    videoContainer.style.transition = 'none';
                    // Forzar recálculo de posición
                    videoContainer.style.left = '50%';
                    videoContainer.style.transform = 'translate(-50%, -50%)';
                    setTimeout(() => {
                        videoContainer.style.transition = '';
                    }, 100);
                }, 100);
            }
        });

    } catch (error) {
        console.error('🔥 Error crítico en video-bienvenida.js:', error.message);
    }
});

