/* ═══════════════════════════════════════════════
   modulo2.js — Módulo 2: Energía Solar
═══════════════════════════════════════════════ */

/* ── SONIDOS ─────────── */

function reproducirClik() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, t);
        osc.frequency.exponentialRampToValueAtTime(340, t + 0.065);
        gain.gain.setValueAtTime(0.20, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.start(t); osc.stop(t + 0.09);
    } catch(e) {}
}

function reproducirClikFlecha(n) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        if (n >= 0) {
            osc.frequency.setValueAtTime(320, t);
            osc.frequency.exponentialRampToValueAtTime(700, t + 0.075);
        } else {
            osc.frequency.setValueAtTime(700, t);
            osc.frequency.exponentialRampToValueAtTime(320, t + 0.075);
        }
        gain.gain.setValueAtTime(0.26, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        osc.start(t); osc.stop(t + 0.1);
    } catch(e) {}
}

function reproducirTriunfo() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const t = ctx.currentTime;
        const notas = [
            { freq: 523.25, start: 0.00, dur: 0.15, vol: 0.38 },
            { freq: 659.25, start: 0.13, dur: 0.15, vol: 0.38 },
            { freq: 783.99, start: 0.26, dur: 0.15, vol: 0.38 },
            { freq: 523.25, start: 0.41, dur: 0.09, vol: 0.30 },
            { freq: 659.25, start: 0.50, dur: 0.09, vol: 0.30 },
            { freq: 1046.50, start: 0.60, dur: 0.65, vol: 0.42 },
            { freq: 1318.51, start: 0.60, dur: 0.65, vol: 0.18 }
        ];
        notas.forEach(({ freq, start, dur, vol }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + start);
            gain.gain.setValueAtTime(0, t + start);
            gain.gain.linearRampToValueAtTime(vol, t + start + 0.025);
            gain.gain.setValueAtTime(vol, t + start + dur - 0.05);
            gain.gain.linearRampToValueAtTime(0, t + start + dur);
            osc.start(t + start); osc.stop(t + start + dur + 0.05);
        });
    } catch(e) {}
}

/* ── MÁQUINA DE ESCRIBIR ─────────────────────── */

let typewriterTimer = null;
let escribiendo = false;

function escribirTexto(elementId, texto, velocidad) {
    velocidad = velocidad || 28;
    escribiendo = true;
    if (typewriterTimer) { clearTimeout(typewriterTimer); typewriterTimer = null; }
    const el = document.getElementById(elementId);
    if (!el) return;
    let i = 0;
    function tick() {
        if (i < texto.length) {
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
    tick();
}

/* ── TEXTOS DE LOS GLOBOS ────────────────────── */

const textoGloboSlide1 = "Usa las <b>flechas ← y →</b> para moverte por las páginas, la <b>casita 🏠</b> para volver a los módulos y la <b>ampolleta 💡</b> si tienes alguna duda.";
const textoGloboSlide2 = "¡Es la energía que nos entrega el <b>Sol</b>! en forma de luz ☀️ y calor 🔥\nCon los dispositivos correctos, esa luz se <b>convierte en electricidad ⚡</b> que podemos usar en casa.";
const textoGloboSlide3 = "La energía solar <b>no contamina 🌱</b> — no produce humos ni gases dañinos.\nAdemás es <b>renovable ♻️</b>, ¡no se acaba nunca mientras exista el Sol!";
const textoGloboSlide4 = "¡Aquí tenemos un simulador! Ajusta la <b>Radiación Solar</b> y la <b>Cantidad de paneles</b> para ver cuánta energía generamos.";
const textoGloboSlide5 = "La energía solar se captura con <b>paneles solares</b>, que transforman la luz del Sol en electricidad.\nEsa energía puede usarse al instante o guardarse en <b>baterías 🔋</b> para usarla de noche.";
const textoGloboFinal  = "¡Genial! Completaste el <b>Módulo 2</b> y ganaste una <b>copa solar 🏆</b>.\nPresiona la <b>flecha →</b> para avanzar al Módulo 3.";

/* ── SIMULADOR SOLAR (Slide 4) ───────────────── */

let estadoSlide4 = 1; // 1=panelin habla, 2=puede interactuar

function resetSlide4() {
    estadoSlide4 = 1;
    document.getElementById('simulador-contenido').classList.add('difuminado');
    document.getElementById('panelinSlide4').style.display = 'flex';
}

function actualizarSimulador() {
    const rad     = parseInt(document.getElementById('slider-rad').value);
    const paneles = parseInt(document.getElementById('slider-pan').value);

    /* Actualizar textos de sliders */
    document.getElementById('val-rad').textContent = rad + ' W/m²';
    document.getElementById('val-pan').textContent = paneles + (paneles === 1 ? ' panel' : ' paneles');
    document.getElementById('label-panel').textContent = paneles + (paneles === 1 ? ' panel' : ' paneles');

    /* Zona de radiación */
    const zonaEl = document.getElementById('zona-rad');
    if (rad < 200) {
        zonaEl.textContent = '☁️ Muy nublado';
        zonaEl.className = 'slider-zona zona-nublado';
    } else if (rad < 600) {
        zonaEl.textContent = '⛅ Parcial';
        zonaEl.className = 'slider-zona zona-parcial';
    } else if (rad < 850) {
        zonaEl.textContent = '☀️ Despejado';
        zonaEl.className = 'slider-zona zona-despejado';
    } else {
        zonaEl.textContent = '🔥 Atacama';
        zonaEl.className = 'slider-zona zona-atacama';
    }

    /* Cálculos */
    const energia   = Math.round(rad * paneles * 0.18);
    const bateria   = Math.min(100, Math.round((rad / 1000) * 70 + paneles * 6));
    const encendida = energia > 40;

    document.getElementById('dato-energia').textContent = energia + ' W';
    document.getElementById('dato-bat').textContent     = bateria + '%';

    /* Visual escena */
    const iSol   = document.getElementById('icono-sol');
    const iBat   = document.getElementById('icono-bat');
    const iCasa  = document.getElementById('icono-casa');
    const fBat   = document.getElementById('flecha-bat');
    const fCasa  = document.getElementById('flecha-casa');

    /* Sol: brillo según radiación */
    iSol.style.filter = rad > 600
        ? 'drop-shadow(0 0 14px rgba(255,200,0,0.9))'
        : 'none';

    /* Batería */
    if (bateria > 70) {
        iBat.textContent = '🔋';
        iBat.classList.remove('apagado');
    } else if (bateria > 30) {
        iBat.textContent = '🪫';
        iBat.classList.remove('apagado');
    } else {
        iBat.textContent = '🔋';
        iBat.classList.add('apagado');
    }

    /* Casa */
    if (encendida) {
        iCasa.classList.add('encendida');
        fBat.classList.add('activa');
        fCasa.classList.add('activa');
    } else {
        iCasa.classList.remove('encendida');
        fBat.classList.remove('activa');
        fCasa.classList.remove('activa');
    }
}

/* ── NAVEGACIÓN ──────────────────────────────── */

let slideActual = 0;

function actualizarFlechas() {
    const total = document.querySelectorAll(".slide").length;
    document.getElementById("flechaIzquierda").style.visibility =
        (slideActual === 0) ? "hidden" : "visible";

    const flechaDer = document.getElementById("flechaDerecha");
    flechaDer.style.visibility = "visible";
    
    if (slideActual === total - 1) {
        flechaDer.classList.add('pulso-final');
    } else {
        flechaDer.classList.remove('pulso-final');
    }
}

function cambiarSlide(n) {
    if (escribiendo) return;
    reproducirClikFlecha(n);

    const slides = document.querySelectorAll(".slide");

        if (slideActual === slides.length - 1 && n === 1) {
        window.location.href = '../../Web2/modulos.html';
        return;
    }

    /* --- LÓGICA DEL SIMULADOR (Ahora está en la lámina 5, índice 4) --- */
    if (slideActual === 4) { // Cambiamos de 3 a 4
        if (n === 1 && estadoSlide4 === 1) {
            estadoSlide4 = 2;
            document.getElementById('simulador-contenido').classList.remove('difuminado');
            document.getElementById('panelinSlide5').style.display = 'none'; // ID actualizado
            actualizarSimulador();
            return;
        }
        if (n === -1 && estadoSlide4 === 2) {
            resetSlide4();
            escribirTexto("globoSlide5", textoGloboSlide4); // Escribir en el globo 5
            return;
        }
    }

    /* --- CAMBIO DE LÁMINA --- */
    slides[slideActual].classList.remove("activo");
    slideActual = Math.max(0, Math.min(slideActual + n, slides.length - 1));
    slides[slideActual].classList.add("activo");

    /* Resetear simulador si entramos a la lámina 5 (índice 4) */
    if (slideActual === 4 && estadoSlide4 === 2) {
        resetSlide4();
    }

    /* --- MÁQUINA DE ESCRIBIR (Orden actualizado) --- */
    if (slideActual === 0) escribirTexto("globoSlide1", textoGloboSlide1);
    if (slideActual === 1) escribirTexto("globoSlide2", textoGloboSlide2);
    if (slideActual === 2) escribirTexto("globoSlide3", textoGloboSlide3);
    
    // Lámina 4 (Explicación): Usa el texto que antes era de la 5
    if (slideActual === 3) escribirTexto("globoSlide4", textoGloboSlide5); 
    
    // Lámina 5 (Simulador): Usa el texto explicativo del simulador
    if (slideActual === 4 && estadoSlide4 === 1) escribirTexto("globoSlide5", textoGloboSlide4);

    /* --- FINAL Y COPA --- */
    if (slideActual === slides.length - 1) {
        const actual = parseInt(localStorage.getItem('modulos_desbloqueados') || '1');
        if (actual < 3) localStorage.setItem('modulos_desbloqueados', '3');
        localStorage.setItem('copa_modulo_2', 'true');
        reproducirTriunfo();
        actualizarPlacaVictoria();
        escribirTexto("globoFinal", textoGloboFinal);
    }

    actualizarFlechas();
}

/* También actualiza la función reset para que apunte al ID nuevo */
function resetSlide4() {
    estadoSlide4 = 1;
    document.getElementById('simulador-contenido').classList.add('difuminado');
    document.getElementById('panelinSlide5').style.display = 'flex'; // ID corregido
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
        localStorage.getItem('copa_desafio')  === 'true',
    ];
    contenedor.innerHTML = ganadas
        .map(g => `<span class="placa-vic-slot${g ? ' ganada' : ''}">🏆</span>`)
        .join('');
    const totalEl = document.getElementById('placaVicTotal');
    if (totalEl) totalEl.textContent = ganadas.filter(Boolean).length + ' / 6';
}

/* ── INICIO ──────────────────────────────────── */

document.addEventListener("DOMContentLoaded", function () {
    actualizarFlechas();
    escribirTexto("globoSlide1", textoGloboSlide1);
    actualizarSimulador();
});