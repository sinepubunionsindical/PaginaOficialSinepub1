const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevButton = document.querySelector('.prev-slide');
const nextButton = document.querySelector('.next-slide');
const navLinks = document.querySelectorAll('.slider-nav a');
const sliderDotsContainer = document.querySelector('.slider-dots'); // Seleccionamos el contenedor de dots
const moduleDotsContainer = document.querySelector('.modulos-nav'); // Contenedor de dots de módulos
const sliderContainerElement = document.querySelector('.slider-container');
let currentSlide = 0;
let autoplayInterval; // Variable para almacenar el intervalo del autoplay
let inactivityTimeout; // Variable para el timeout de inactividad
const inactivityTime = 90000; // 90 segundos en milisegundos


// Función para generar dots dinámicamente según la cantidad de módulos
function createModuleDots() {
    moduleDotsContainer.innerHTML = ''; // Limpiar dots previos
    
    const moduleSlides = document.querySelectorAll(".slide[id^='slide-7'], .slide[id^='slide-8']"); // Detectar módulos de formación
    moduleSlides.forEach((slide, index) => {
        const dot = document.createElement('span');
        dot.classList.add('slider-dot');
        dot.dataset.slideIndex = index + 7; // Ajuste para alinearlo con los slides
        
        if (index === 0) {
            dot.classList.add('active'); // Activar el primer módulo por defecto
        }
        
        dot.addEventListener('click', function () {
            const slideIndex = parseInt(this.dataset.slideIndex);
            updateSlide(slideIndex - 1); // Ajuste para usar updateSlide en lugar de scrollIntoView
            stopAutoplay();
            resetInactivityTimer();
            
            document.querySelectorAll('.modulos-nav .slider-dot').forEach(d => d.classList.remove('active'));
            this.classList.add('active');
        });
        
        moduleDotsContainer.appendChild(dot);
    });
    moduleDotsContainer.style.display = 'none'; // Ocultar inicialmente los dots de módulos
}

// Ajuste para permitir navegación entre los módulos sin ocultar otros slides
function setupModuleNavigation() {
    const moduleSlides = document.querySelectorAll(".slide[id^='slide-7'], .slide[id^='slide-8']");
    moduleSlides.forEach(slide => {
        slide.style.display = 'block'; // Asegurar que todos los módulos sean visibles
    });
}

// Llamar a las funciones para generar dots y mantener los módulos visibles
createModuleDots();
setupModuleNavigation();

document.addEventListener("DOMContentLoaded", function () {
    const menuColaboradores = document.querySelector(".menu-item-colaboradores");
    const dropdownColaboradores = document.querySelector(".dropdown-menu-colaboradores");
    const infoColaboradores = document.querySelectorAll(".info-colaborador");
    const headerMenu = document.querySelector(".header-titles-nav"); // Todo el menú del header

    if (menuColaboradores && dropdownColaboradores) {
        let isHovering = false;

        const showDropdown = () => {
            dropdownColaboradores.style.display = "block";
            dropdownColaboradores.style.opacity = "1";
            isHovering = true;
        };

        const hideDropdown = () => {
            setTimeout(() => {
                if (!isHovering) {
                    dropdownColaboradores.style.opacity = "0";
                    dropdownColaboradores.style.display = "none";
                }
            }, 100);
        };

        menuColaboradores.addEventListener("mouseenter", showDropdown);
        dropdownColaboradores.addEventListener("mouseenter", () => isHovering = true);
        menuColaboradores.addEventListener("mouseleave", () => {
            isHovering = false;
            hideDropdown();
        });

        dropdownColaboradores.addEventListener("mouseleave", () => {
            isHovering = false;
            hideDropdown();
        });

        // Evita que el menú desaparezca cuando el mouse pasa entre los cuadros emergentes
        infoColaboradores.forEach(info => {
            info.addEventListener("mouseenter", () => isHovering = true);
            info.addEventListener("mouseleave", () => {
                isHovering = false;
                hideDropdown();
            });
        });

        // 🔥 Si el mouse entra a otro ítem del menú, se oculta el cuadro emergente de colaboradores
        headerMenu.addEventListener("mouseenter", (event) => {
            if (!menuColaboradores.contains(event.target) && !dropdownColaboradores.contains(event.target)) {
                isHovering = false;
                hideDropdown();
            }
        });
    }
});

// Función para actualizar el slider y la navegación 
function updateSlide(slideIndex) {
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === slideIndex);
    });

    currentSlide = slideIndex;
    // Event listeners para los links de navegación - MODIFICADO PARA LEER DATA-SLIDE
    navLinks.forEach((link, index) => {
      link.classList.remove('active'); // ¡NUEVA LÍNEA! Remover 'active' de *todos* los links antes de seleccionar uno nuevo
      link.addEventListener('click', (event) => {
        event.preventDefault(); // Evitamos el comportamiento default del enlace
        const slideIndex = parseInt(link.dataset.slide); // ¡Leer data-slide del enlace clickeado!
        updateSlide(slideIndex - 1);    // Actualizamos el slider, ajustando el índice a base 0 (¡IMPORTANTE: restamos 1 aquí!)
        stopAutoplay(); // ¡DETENER autoplay al interactuar con la navegación!
        resetInactivityTimer(); // Reiniciar el timer de inactividad
  });
});

    if (slideIndex >= 1 && slideIndex <= 4) { // Slides de "Noticias" (slides 2 a 5)
        navLinks[1].classList.add('active'); // Activar link "Noticias" (índice 1)
        moduleDotsContainer.style.display = 'none';
    } else if (slideIndex === 5) {           // Slide de "Afiliación" (slide 6)
        navLinks[2].classList.add('active'); // Activar link "Afiliación" (índice 2)
        moduleDotsContainer.style.display = 'none';
    } else if (slideIndex === 6 || slideIndex === 7) {
        navLinks[3].classList.add('active');
        moduleDotsContainer.style.display = 'flex'; // Mostrar dots de módulos
        document.querySelectorAll('.modulos-nav .slider-dot').forEach(dot => dot.classList.remove('active'));
        let activeDot = document.querySelector(`.modulos-nav .slider-dot[data-slide-index='${slideIndex}']`);
        if (!activeDot) {
            activeDot = document.querySelector(`.modulos-nav .slider-dot[data-slide-index='6']`); // 🔹 Asegura que el primer dot (slide-7) esté activo
        }
        if (activeDot) {
            activeDot.classList.add('active');
        }
    } else {
        navLinks[0].classList.add('active');
        moduleDotsContainer.style.display = 'none';
    }
    updateDots(slideIndex);
}

// Event listeners para las flechas (prev/next)
prevButton.addEventListener('click', () => {
    let slideIndex = currentSlide - 1;
    if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    }
    updateSlide(slideIndex);
    stopAutoplay(); // ¡DETENER autoplay al interactuar con la navegación!
    resetInactivityTimer(); // Reiniciar el timer de inactividad
});

nextButton.addEventListener('click', () => {
    let slideIndex = currentSlide + 1;
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }
    updateSlide(slideIndex);
    stopAutoplay(); // ¡DETENER autoplay al interactuar con la navegación!
    resetInactivityTimer(); // Reiniciar el timer de inactividad  
});


// Función para crear los dots de navegación
function createNavigationDots() {
    const numberOfDots = 4; // ¡Creamos 4 dots (para las 4 noticias)
    for (let i = 0; i < numberOfDots; i++) {
        const dot = document.createElement('span');
        dot.classList.add('slider-dot');
        dot.dataset.slideIndex = i + 1; // ¡Dots apuntan a slides 2, 3, 4, 5 (Noticias)! (índices 1, 2, 3, 4)
        if (i === 0) {       // ¡Añadimos la clase 'active' al PRIMER dot (índice 0) al crearse!
            dot.classList.add('active');
        }
        dot.addEventListener('click', (event) => {
            const slideIndex = parseInt(event.target.dataset.slideIndex);
            updateSlide(slideIndex);
            stopAutoplay(); // ¡DETENER autoplay al interactuar con los dots!
            resetInactivityTimer(); // Reiniciar el timer de inactividad
        });
        sliderDotsContainer.appendChild(dot);
    }
}

// Función para actualizar el dot activo (¡¡¡¡¡ESTA FUNCIÓN DEBE ESTAR FUERA DE updateSlide()!!!!!)
function updateDots(slideIndex) {
    if (slideIndex >= 1 && slideIndex <= 4) { // ¡Mostrar dots solo en slides 2 a 5 (Noticias)!
        sliderDotsContainer.style.display = 'flex'; // Mostrar el contenedor de dots
        const dots = sliderDotsContainer.querySelectorAll('.slider-dot');
        // Ajustamos el índice para que el primer dot se active en la primera slide de noticias (slide-2, index 1)
        const dotIndexToActivate = slideIndex - 1; 
        dots.forEach((dot, index) => {
            if (index === dotIndexToActivate) {
                dot.classList.add('active'); // Añadimos la clase 'active' al dot activo
            } else {
                dot.classList.remove('active'); // Removemos la clase 'active' de los demás dots
            }
        });
    } else {
        sliderDotsContainer.style.display = 'none'; // Ocultar dots en otras slides (Inicio, Afiliación)
    }
}

// Función para iniciar el autoplay
function startAutoplay() {
  autoplayInterval = setInterval(() => {
      let nextSlideIndex;
      if (currentSlide >= 0 && currentSlide <= 1) { // Si estamos en Noticias (slides 2-5)
          nextSlideIndex = currentSlide + 1;
          if (nextSlideIndex > 1) { // Si llegamos al último slide de Noticias (slide 5)
              nextSlideIndex = 0;     // Volver al primer slide de Noticias (slide 2, índice 1)
          }
      } else {
          nextSlideIndex = 1; // Si no estamos en Noticias, ir al primer slide de Noticias (slide 2, índice 1)
      }
      updateSlide(nextSlideIndex); // Actualizar al siguiente slide de Noticias (o al primero si no estábamos en Noticias)
  }, 5000);
}

// Función para detener el autoplay
function stopAutoplay() {
  clearInterval(autoplayInterval);
  clearTimeout(inactivityTimeout); // ¡LIMPIAR el timeout existente al detener el autoplay!
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimeout); // ¡LIMPIAR timeout anterior para evitar múltiples timeouts!
  inactivityTimeout = setTimeout(startAutoplay, inactivityTime); // Iniciar timeout de 90 segundos
}

// Event listeners para RESETER el timer de inactividad con CUALQUIER interacción del usuario en la PÁGINA
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('mousedown', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('touchstart', resetInactivityTimer); // Para dispositivos táctiles


// Inicialización
createNavigationDots(); // Creamos los dots al cargar la página
updateSlide(0);
startAutoplay(); // ¡INICIAR el autoplay al cargar la página!
resetInactivityTimer(); // ¡INICIAR el timer de inactividad al cargar la página!
