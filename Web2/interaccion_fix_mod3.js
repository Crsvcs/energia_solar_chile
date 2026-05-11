/* ── PARCHE MÓDULO 3: reemplaza cambiarSlide() y textos para este módulo ──
   Cargar DESPUÉS de interaccion_web.js en el HTML:
       <script src="interaccion_web.js"></script>
       <script src="interaccion_fix_mod3.js"></script>

   Módulo 3 tiene 6 slides simples (índices 0–5), sin estados internos.
   La flecha derecha en el último slide lleva a modulo4.html.
── */

/* ── TEXTOS DE CADA SLIDE ───────────────────── */
/* Textos listos para la máquina de escribir de interaccion_web.js */
const textoGloboSlide1 = "Usa las <b>flechas ← y →</b> para moverte por las páginas, la <b>casita 🏠</b> para volver a los módulos.";
const textoGloboSlide2 = "¡Hola! Soy un <b>Fotón</b>. Mi trabajo es viajar desde el sol hasta la tierra para entregarte energía.";
const textoGloboSlide3 = "Cuando muchos de nosotros chocamos contra un <b>panel solar</b>, ¡sucede algo mágico!";
const textoGloboSlide4 = "¡Haz la prueba tú mismo! Haz clic en el <b>Sol</b> para enviarnos hacia el panel.";
const textoGloboSlide5 = "¿Notaste que cuando los <b>fotones</b> chocan con el panel, los <b>electrones</b> empiezan a correr por el cable?\n¡Ese viaje de energía es lo que enciende las luces de tu casa!";
const textoGloboSlide6 = "Esa energía puede viajar por cables o guardarse en <b>baterías 🔋</b> para usarla cuando el sol se esconda.";
const textoGloboFinal  = "¡Excelente! Ahora eres un experto en el viaje de la luz.\n¡Ganaste tu <b>copa del Módulo 3 🏆</b>!";

/* Mapa de slide index → id del globo y texto (¡Corregido!) */
const slidesTextos = [
    { id: "globoSlide1", texto: textoGloboSlide1 },
    { id: "globoSlide2", texto: textoGloboSlide2 },
    { id: "globoSlide3", texto: textoGloboSlide3 },
    { id: "globoSlide4", texto: textoGloboSlide4 },
    { id: "globoSlide5", texto: textoGloboSlide5 },
    { id: "globoSlide6", texto: textoGloboSlide6 },
    { id: "globoFinal",  texto: textoGloboFinal  }
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
