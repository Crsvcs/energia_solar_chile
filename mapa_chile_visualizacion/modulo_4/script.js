const slides = document.querySelectorAll('.slide');

const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let currentSlide = 0;

function showSlide(index) {

    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    slides[index].classList.add('active');
}

nextBtn.addEventListener('click', () => {

    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
});

prevBtn.addEventListener('click', () => {

    currentSlide--;

    if (currentSlide < 0) {
        currentSlide = 0;
    }

    showSlide(currentSlide);
});


const helpBtn = document.getElementById('helpBtn');

helpBtn.addEventListener('click', () => {
    alert('Usa las flechas para avanzar entre las pantallas del módulo.');
});


const homeBtn = document.getElementById('homeBtn');

homeBtn.addEventListener('click', () => {
    window.location.href = '../index.html';
});