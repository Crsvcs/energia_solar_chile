/* ══════════════════════════════════════════════
   PANELÍN IA — GEMINI API (archivo compartido)
   Usado en todos los módulos del proyecto.
══════════════════════════════════════════════ */

const GEMINI_KEY = 'AIzaSyDFmISx_YgvgqIeM4tddn29bFdjVRe6KOY';

const GEMINI_SYSTEM = `Eres Panelín, un panel solar simpático y divertido que ayuda a niños de educación básica a aprender sobre energía eléctrica y energía solar en Chile. Responde siempre de forma muy simple, amigable y breve (máximo 3 oraciones cortas). Usa palabras que un niño de 8 años pueda entender fácilmente. Si la pregunta no tiene relación con energía eléctrica o solar, responde amablemente diciendo que solo puedes hablar de esos temas.`;

/* Sonido suave (fallback si no está cargado interaccion_web.js) */
function _panelinClik() {
    if (typeof reproducirClik === 'function') { reproducirClik(); return; }
    try {
        const ctx  = new (window.AudioContext || window.webkitAudioContext)();
        const t    = ctx.currentTime;
        const osc  = ctx.createOscillator();
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

function abrirModalIA() {
    _panelinClik();
    document.getElementById('modalIA').classList.add('abierto');
    setTimeout(() => document.getElementById('modalIAInput').focus(), 100);
}

function cerrarModalIA() {
    _panelinClik();
    document.getElementById('modalIA').classList.remove('abierto');
    document.getElementById('modalIAGlobo').textContent =
        '¡Hola! Soy Panelín 🌞 ¿Tienes alguna duda sobre la energía eléctrica o solar? ¡Escribe tu pregunta!';
    document.getElementById('modalIAInput').value = '';
    document.getElementById('modalIABtn').disabled = false;
}

async function enviarPreguntaIA() {
    const input    = document.getElementById('modalIAInput');
    const globo    = document.getElementById('modalIAGlobo');
    const btn      = document.getElementById('modalIABtn');
    const pregunta = input.value.trim();
    if (!pregunta) return;

    input.value  = '';
    btn.disabled = true;
    globo.innerHTML = 'Pensando<span class="modal-ia-cargando">...</span>';

    try {
        const mensajeCompleto = GEMINI_SYSTEM + '\n\nPregunta del niño: ' + pregunta;
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: mensajeCompleto }] }],
                    generationConfig: { maxOutputTokens: 200, temperature: 0.7 }
                })
            }
        );
        const data = await res.json();
        if (data.error) {
            globo.textContent = '⚠️ Error: ' + data.error.message;
            btn.disabled = false;
            return;
        }
        const respuesta = data.candidates?.[0]?.content?.parts?.[0]?.text
                       || '¡Ups! No pude responder. ¿Lo intentamos de nuevo?';
        escribirTextoModalIA(respuesta);
    } catch(e) {
        globo.textContent = '⚠️ Error de conexión. Revisa internet e intenta de nuevo.';
    }
    btn.disabled = false;
}

function escribirTextoModalIA(texto) {
    const globo = document.getElementById('modalIAGlobo');
    globo.textContent = '';
    let i = 0;
    function tick() {
        if (i < texto.length) {
            globo.textContent = texto.slice(0, i + 1);
            i++;
            setTimeout(tick, 18);
        }
    }
    tick();
}

/* Cerrar modal al hacer clic fuera del contenido */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalIA');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) cerrarModalIA();
        });
    }
});
