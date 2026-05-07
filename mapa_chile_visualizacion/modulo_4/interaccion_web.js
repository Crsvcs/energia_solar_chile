let slideActual = 0;

function actualizarFlechas() {

    let total = document.querySelectorAll(".slide").length;

    document.getElementById("flechaIzquierda").style.visibility =
        (slideActual === 0) ? "hidden" : "visible";

    document.getElementById("flechaDerecha").style.visibility =
        (slideActual === total - 1) ? "hidden" : "visible";
}

function cambiarSlide(n) {

    let slides = document.querySelectorAll(".slide");

    slides[slideActual].classList.remove("activo");

    slideActual += n;

    if (slideActual < 0) {
        slideActual = 0;
    }

    if (slideActual >= slides.length) {
        slideActual = slides.length - 1;
    }

    slides[slideActual].classList.add("activo");

    actualizarFlechas();
}

document.addEventListener("DOMContentLoaded", actualizarFlechas);