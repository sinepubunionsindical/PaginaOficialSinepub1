const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevButton = document.querySelector('.prev-slide');
const nextButton = document.querySelector('.next-slide');
let currentSlide = 0;

prevButton.addEventListener('click', () => {
    currentSlide--;
    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    updateSlide();
});

nextButton.addEventListener('click', () => {
    currentSlide++;
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    updateSlide();
});

function updateSlide() {
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}

// Inicializar el slider
updateSlide();