/* ═══════════════════════════════════════════════
   interaccion_mod3.js — Lógica y Textos del Módulo 3
═══════════════════════════════════════════════ */

/* ── MÁQUINA DE ESCRIBIR ── */
let typewriterTimer = null;
let escribiendo = false;

function escribirTexto(elementId, texto, velocidad = 28) {
    escribiendo = true;
    
    // Si ya había alguien escribiendo, lo detenemos
    if (typewriterTimer) { 
        clearTimeout(typewriterTimer); 
        typewriterTimer = null; 
    }
    
    const el = document.getElementById(elementId);
    if (!el) {
        console.error("No se encontró el globo:", elementId);
        escribiendo = false;
        return;
    }
    
    let i = 0;
    function tick() {
        if (i < texto.length) {
            // Saltamos las etiquetas HTML para que se aplique la negrita de golpe
            if (texto.charAt(i) === '<') {
                let fin = texto.indexOf('>', i);
                if (fin !== -1) i = fin;
            }
            el.innerHTML = texto.slice(0, i + 1).replace(/\n/g, '<br>') + '<span class="cursor">_</span>';
            i++;
            typewriterTimer = setTimeout(tick, velocidad);
        } else {
            el.innerHTML = texto.replace(/\n/g, '<br>') + '<span class="cursor parpadeando">_</span>';
            typewriterTimer = null;
            escribiendo = false;
        }
    }
    
    // Iniciar escritura
    el.innerHTML = ""; 
    tick();
}

/* ── TEXTOS DE LOS GLOBOS ────────────────────── */
const textosMod3 = [
    "Usa las <b>flechas</b>  ← y →para moverte por las páginas, la <b>casita 🏠</b> para volver a los módulos y la <b>ampolleta 💡</b> si tienes alguna duda.",
    "¡Hola! Soy un <b>Fotón</b>. Mi trabajo es viajar desde el sol hasta la tierra para entregarte energía.",
    "Cuando muchos de nosotros chocamos contra un <b>panel solar</b>, ¡sucede algo mágico!",
    "¡Haz la prueba tú mismo! Haz clic en el <b>Sol</b> para enviarnos hacia el panel.",
    "¿Notaste que cuando los <b>fotones</b> chocan con el panel, los <b>electrones</b> empiezan a correr por el cable?\n¡Ese viaje de energía es lo que enciende las luces de tu casa!",
    "Esa energía puede viajar por cables o guardarse en <b>baterías 🔋</b> para usarla cuando el sol se esconda.",
    "¡Excelente! Ahora eres un experto en el viaje de la luz.\n¡Ganaste tu <b>copa del Módulo 3 🏆</b>!"
];

const idsGlobos = [
    "globoSlide1",
    "globoSlide2",
    "globoSlide3",
    "globoSlide4",
    "globoSlide5",
    "globoSlide6",
    "globoFinal"
];

/* ── NAVEGACIÓN Y FLECHAS ────────────────────── */
let slideActual = 0;

function actualizarFlechas() {
    const total = document.querySelectorAll(".slide").length;
    const flechaIzq = document.getElementById("flechaIzquierda");
    const flechaDer = document.getElementById("flechaDerecha");
    
    if(flechaIzq) flechaIzq.style.visibility = (slideActual === 0) ? "hidden" : "visible";
    if(flechaDer) {
        flechaDer.style.visibility = "visible";
        if (slideActual === total - 1) {
            flechaDer.classList.add('pulso-final');
        } else {
            flechaDer.classList.remove('pulso-final');
        }
    }
}

function cambiarSlide(n) {
    if (escribiendo) return; // Bloquea las flechas si Panelín está hablando
    
    try { reproducirClikFlecha(n); } catch(e) {}

    const slides = document.querySelectorAll(".slide");

    // Si estamos al final y apretamos derecha, volvemos a los módulos
    if (slideActual === slides.length - 1 && n === 1) {
        window.location.href = 'modulos.html';
        return;
    }

    // Cambiar la clase activa
    slides[slideActual].classList.remove("activo");
    slideActual = Math.max(0, Math.min(slideActual + n, slides.length - 1));
    slides[slideActual].classList.add("activo");

    // Lanzar el texto del globo actual
    escribirTexto(idsGlobos[slideActual], textosMod3[slideActual]);

    // Efectos de victoria si llegamos a la última lámina
    if (slideActual === slides.length - 1) {
        const actual = parseInt(localStorage.getItem('modulos_desbloqueados') || '1');
        if (actual < 4) localStorage.setItem('modulos_desbloqueados', '4');
        localStorage.setItem('copa_modulo_3', 'true');
        try { reproducirTriunfo(); } catch(e) {}
        actualizarPlacaVictoria();
    }

    actualizarFlechas();
}

/* ── EFECTOS DE SONIDO ───────────────────────── */
function reproducirClikFlecha(n) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n >= 0 ? 320 : 700, t);
        osc.frequency.exponentialRampToValueAtTime(n >= 0 ? 700 : 320, t + 0.075);
        gain.gain.setValueAtTime(0.26, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        osc.start(t); osc.stop(t + 0.1);
    } catch(e) {}
}

function reproducirTriunfo() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const t = ctx.currentTime;
        const notas = [ { freq: 523.25, start: 0.00 }, { freq: 659.25, start: 0.13 }, { freq: 783.99, start: 0.26 }, { freq: 1046.50, start: 0.60 } ];
        notas.forEach(({ freq, start }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + start);
            gain.gain.setValueAtTime(0.3, t + start);
            gain.gain.exponentialRampToValueAtTime(0.001, t + start + 0.5);
            osc.start(t + start); osc.stop(t + start + 0.6);
        });
    } catch(e) {}
}

/* ── PLACA DE VICTORIA ───────────────────────── */
function actualizarPlacaVictoria() {
    const contenedor = document.getElementById('placaVicSlots');
    if (!contenedor) return;
    const ganadas = [
        localStorage.getItem('copa_modulo_1') === 'true',
        localStorage.getItem('copa_modulo_2') === 'true',
        localStorage.getItem('copa_modulo_3') === 'true',
        localStorage.getItem('copa_modulo_4') === 'true',
        localStorage.getItem('copa_desafio')  === 'true',
        localStorage.getItem('copa_desafio')  === 'true'
    ];
    contenedor.innerHTML = ganadas.map(g => `<span class="placa-vic-slot${g ? ' ganada' : ''}">🏆</span>`).join('');
    const totalEl = document.getElementById('placaVicTotal');
    if (totalEl) totalEl.textContent = ganadas.filter(Boolean).length + ' / 6';
}

/* ── INICIO DE LA LÁMINA (A PRUEBA DE BALAS) ─── */
function iniciarModulo() {
    actualizarFlechas();
    escribirTexto(idsGlobos[0], textosMod3[0]);
}

// Revisa si el navegador ya terminó de cargar todo de forma flash
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarModulo);
} else {
    iniciarModulo();
}