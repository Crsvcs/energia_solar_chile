/* ── PARCHE MÓDULO 3: reemplaza cambiarSlide() y textos para este módulo ──
   Cargar DESPUÉS de interaccion_web.js en el HTML:
       <script src="interaccion_web.js"></script>
       <script src="interaccion_fix_mod3.js"></script>

   Módulo 3 tiene 6 slides simples (índices 0–5), sin estados internos.
   La flecha derecha en el último slide lleva a modulo4.html.
── */

/* ── TEXTOS DE CADA SLIDE ───────────────────── */

const textoMod3Slide1 = "Usa las flechas para avanzar, la casita para volver a los módulos y la ampolleta si tienes alguna duda.";
const textoMod3Slide2 = "Los paneles tienen celdas de silicio que atrapan la luz del sol (<b>fotones</b>). ¡Eso hace que se <b>muevan electrones</b> y se genere <b>electricidad!</b>";
const textoMod3Slide3 = "En la siguiente visualización veremos cómo la interacción entre el <b>silicio</b> y los <b>fotones</b> produce energía.";
const textoMod3Slide4 = "¿Notaste como el sol tenia que estar constantemente trabajando para que la bombilla estuviera prendida? <b>¿Como utilizamos la energia en los momentos más oscuros del día?</b>";
const textoMod3Slide5 = "¡Con <b>baterias</b>! ¡Se necesitan baterías para guardar la energía de los paneles! Ahorrar energía de sobra cuando el sol sale, y usarla cuando se esconde, es clave para un uso sustentable de la energía solar.";
const textoMod3Final  = "¡Genial! Completaste el Módulo 3 y ganaste una copa solar 🏆.\nSigue explorando el mundo de la energía.\nAprieta la flecha ➜ para continuar.";

/* Mapa de slide index → id del globo y texto */
const slidesTextos = [
    { id: "globoSlide1", texto: textoMod3Slide1 },
    { id: "globoSlide2", texto: textoMod3Slide2 },
    { id: "globoSlide3", texto: textoMod3Slide3 },
    { id: "globoSlide4", texto: textoMod3Slide4 },
    { id: "globoSlide5", texto: textoMod3Slide5 },
    { id: "globoFinal",  texto: textoMod3Final  },
];

/* ── NAVEGACIÓN SIMPLIFICADA PARA MÓDULO 3 ──── */

function cambiarSlide(n) {

    /* FIX 1: cancelar typewriter en vez de bloquear */
    if (escribiendo) {
        if (typewriterTimer) {
            clearTimeout(typewriterTimer);
            typewriterTimer = null;
        }
        escribiendo = false;
    }

    reproducirClikFlecha(n);

    let slides = document.querySelectorAll(".slide");
    let nuevaSlide = slideActual + n;

    /* Último slide: flecha derecha va al módulo 4 */
    if (slideActual === slides.length - 1 && n === 1) {
        window.location.href = 'modulo4.html';
        return;
    }

    /* FIX 2: verificar límites antes de tocar clases */
    if (nuevaSlide < 0 || nuevaSlide >= slides.length) return;

    slides[slideActual].classList.remove("activo");
    slideActual = nuevaSlide;
    slides[slideActual].classList.add("activo");

    /* Triunfo al llegar al último slide */
    if (slideActual === slides.length - 1) {
        let actual = parseInt(localStorage.getItem('modulos_desbloqueados') || '1');
        if (actual < 4) localStorage.setItem('modulos_desbloqueados', '4');
        localStorage.setItem('copa_modulo_3', 'true');
        reproducirTriunfo();
        actualizarPlacaVictoria();
    }

    /* Typewriter para el slide actual */
    const info = slidesTextos[slideActual];
    if (info) escribirTexto(info.id, info.texto);

    actualizarFlechas();
}

/* ── SOBRESCRIBIR actualizarFlechas para este módulo ── */

function actualizarFlechas() {
    let slides = document.querySelectorAll(".slide").length;
    document.getElementById("flechaIzquierda").style.visibility =
        (slideActual === 0) ? "hidden" : "visible";
    document.getElementById("flechaDerecha").style.visibility = "visible";

    const flechaDer = document.getElementById("flechaDerecha");
    if (slideActual === slides - 1) {
        flechaDer.classList.add('pulso-final');
    } else {
        flechaDer.classList.remove('pulso-final');
    }
}

/* ── INICIAR AL CARGAR LA PÁGINA ────────────── */

document.addEventListener("DOMContentLoaded", function () {
    actualizarFlechas();
        const info = slidesTextos[0];
    const el = document.getElementById(info.id);
    if (el) escribirTexto(info.id, info.texto);
});
