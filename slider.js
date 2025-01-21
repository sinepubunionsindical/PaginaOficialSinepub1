// Selecciona todos los elementos con la clase.slide
const slides = document.querySelectorAll('.slide');

// Inicializa el índice de la diapositiva actual
let currentSlide = 0;

// Agrega la clase 'active' a la primera diapositiva inicialmente
slides[currentSlide].classList.add('active');

// Función para cambiar la diapositiva actual
function cambiarDiapositiva() {
  // Elimina la clase 'active' de la diapositiva actual
  slides[currentSlide].classList.remove('active');

  // Avanza al siguiente índice, o vuelve al principio si es necesario
  currentSlide = (currentSlide + 1) % slides.length;

  // Agrega la clase 'active' a la nueva diapositiva
  slides[currentSlide].classList.add('active');
}

// Llama a la función de cambio de diapositiva cada 5 segundos
setInterval(cambiarDiapositiva, 5000);