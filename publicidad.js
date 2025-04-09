// JavaScript para la página de publicidad

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const registrarBtn = document.getElementById('registrar-publicidad');
    const cancelarBtn = document.getElementById('cancelar-registro');
    const formularioSlide = document.getElementById('slide-registro');
    const formulario = document.getElementById('formulario-publicidad');
    const slides = document.querySelectorAll('.slide');
    const navLinks = document.querySelectorAll('.slider-nav a');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');

    // Variable para mantener el índice del slide actual
    let currentSlide = 0;

    // Inicializar la página mostrando el primer slide
    function initPage() {
        // Aplicar fade-in al cargar
        document.body.classList.remove('fade-out');
        document.body.classList.add('fade-in');

        // Asegurarse de que el primer slide esté activo
        updateSlide(0);

        // Inicializar los puntos de navegación
        updateSliderDots();
    }

    // Función para actualizar el slide activo
    function updateSlide(slideIndex) {
        // Asegurar que el índice esté dentro de los límites
        if (slideIndex < 0) {
            slideIndex = slides.length - 1;
        } else if (slideIndex >= slides.length) {
            slideIndex = 0;
        }

        // Ocultar todos los slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Mostrar el slide correspondiente
        slides[slideIndex].classList.add('active');

        // Actualizar el índice actual
        currentSlide = slideIndex;

        // Actualizar los enlaces de navegación
        updateNavLinks(slideIndex);

        // Actualizar los puntos de navegación
        updateSliderDots();
    }

    // Función para actualizar los enlaces de navegación
    function updateNavLinks(slideIndex) {
        // Quitar la clase active de todos los enlaces
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Agregar la clase active al enlace correspondiente
        // Los data-slide comienzan en 1, pero los índices de los slides comienzan en 0
        const activeLink = Array.from(navLinks).find(link => {
            return parseInt(link.getAttribute('data-slide')) === slideIndex + 1;
        });

        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Mostrar el formulario cuando se hace clic en "Registrar Publicidad"
    if (registrarBtn) {
        registrarBtn.addEventListener('click', function() {
            // Ocultar todos los slides
            slides.forEach(slide => {
                slide.classList.remove('active');
            });

            // Mostrar el slide del formulario
            formularioSlide.style.display = 'block';
            formularioSlide.classList.add('active');

            // Quitar la clase active de todos los enlaces de navegación
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
        });
    }

    // Ocultar el formulario cuando se hace clic en "Cancelar"
    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', function() {
            // Ocultar el slide del formulario
            formularioSlide.style.display = 'none';
            formularioSlide.classList.remove('active');

            // Mostrar el primer slide (Inicio)
            updateSlide(0);
        });
    }

    // Manejar el envío del formulario
    if (formulario) {
        formulario.addEventListener('submit', function(event) {
            event.preventDefault();

            // Mostrar indicador de carga
            const submitBtn = formulario.querySelector('.boton-guardar');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            // Recopilar datos del formulario
            const formData = new FormData(formulario);
            const formDataObj = {};

            // Procesar todos los campos excepto la imagen
            formData.forEach((value, key) => {
                if (key !== 'imagen') {
                    formDataObj[key] = value;
                }
            });

            // Procesar la imagen si existe
            const imagenInput = document.getElementById('imagen');
            if (imagenInput.files && imagenInput.files[0]) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    // Agregar la imagen como base64
                    formDataObj['imagen_base64'] = e.target.result;

                    // Enviar datos al backend
                    enviarDatosAlBackend(formDataObj, submitBtn, originalBtnText);
                };

                reader.readAsDataURL(imagenInput.files[0]);
            } else {
                // Enviar datos sin imagen
                enviarDatosAlBackend(formDataObj, submitBtn, originalBtnText);
            }
        });
    }

    // Función para enviar datos al backend
    function enviarDatosAlBackend(datos, submitBtn, originalBtnText) {
        // URL del backend (ajustar según configuración)
        const backendUrl = 'http://localhost:8000/api/publicidad';

        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }

            // Mostrar mensaje de éxito
            alert('¡Gracias por registrar tu publicidad! Tu solicitud ha sido enviada para aprobación. Recibirás un correo de confirmación pronto.');

            // Resetear el formulario
            formulario.reset();

            // Restaurar botón
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;

            // Ocultar el slide del formulario y volver al inicio
            formularioSlide.style.display = 'none';
            formularioSlide.classList.remove('active');
            updateSlide(0);
        })
        .catch(error => {
            // Mostrar error
            alert('Error al enviar la publicidad: ' + error.message);
            console.error('Error:', error);

            // Restaurar botón
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
    }

    // Configurar los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            // Obtener el índice del slide desde el atributo data-slide
            const slideIndex = parseInt(this.getAttribute('data-slide')) - 1;

            // Actualizar el slide
            updateSlide(slideIndex);
        });
    });

    // Configurar los botones de navegación prev/next
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            updateSlide(currentSlide - 1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function() {
            updateSlide(currentSlide + 1);
        });
    }

    // Función para actualizar los puntos de navegación (ahora vacía ya que los hemos ocultado)
    function updateSliderDots() {
        // No hacemos nada ya que los dots están ocultos
        return;
    }

    // Inicializar la página
    initPage();

    // Exponer la función para que slider.js pueda llamarla si es necesario
    window.updatePublicidadSliderDots = updateSliderDots;
});
