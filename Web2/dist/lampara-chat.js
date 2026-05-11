/* ── lampara-chat.js ── */

// ⚠️ PON AQUÍ TU API KEY (solo en tu computador, nunca la compartas)
const GEMINI_API_KEY = 'TU_API_KEY_AQUI';

const SYSTEM_PROMPT = `Eres Lumina, una asistente educativa simpática y amigable para niños de primaria.
Solo puedes responder preguntas sobre estos temas:
- Electricidad (qué es, cómo funciona, voltaje, corriente, circuitos)
- Energía solar (paneles solares, cómo se genera, por qué es renovable)
- Energía en general (tipos de energía, ahorro energético)

Si el niño pregunta sobre CUALQUIER otro tema, responde amablemente que solo puedes ayudar con temas de electricidad y energía solar, y anímalo a preguntar algo sobre esos temas.

Reglas importantes:
- Usa lenguaje simple y divertido, apropiado para niños de 8 a 12 años
- Respuestas cortas (máximo 3 oraciones)
- Usa emojis relacionados con electricidad ⚡💡☀️🔋
- Nunca hables de política, violencia, sexo, ni ningún tema inapropiado
- Si detectas lenguaje inapropiado, responde con amabilidad que ese lenguaje no es adecuado`;

// ── Historial de conversación ──────────────────────────────
let historial = [];

// ── Crear el HTML del chat al cargar ──────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const html = `
    <div class="chat-overlay" id="chatOverlay">
      <div class="chat-panel">
        <div class="chat-header">
          <span class="chat-header-icono">💡</span>
          <div class="chat-header-texto">
            <h3>LUMINA — ASISTENTE SOLAR</h3>
            <p>Solo respondo sobre electricidad y energía ⚡</p>
          </div>
          <button class="chat-cerrar" onclick="cerrarChat()" title="Cerrar">✕</button>
        </div>
        <div class="chat-mensajes" id="chatMensajes">
          <div class="msg-ia">
            ¡Hola! Soy <strong>Lumina</strong> ⚡ Puedo responder tus preguntas sobre electricidad y energía solar. ¡Pregúntame lo que quieras sobre esos temas! ☀️
          </div>
        </div>
        <div class="chat-aviso">Solo respondo preguntas de electricidad y energía solar 💡</div>
        <div class="chat-input-area">
          <textarea
            class="chat-input"
            id="chatInput"
            placeholder="Escribe tu pregunta aquí..."
            rows="1"
            onkeydown="chatKeyDown(event)"
            oninput="ajustarAltura(this)"
          ></textarea>
          <button class="chat-enviar" id="chatEnviar" onclick="enviarMensaje()">➤</button>
        </div>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
});

// ── Abrir chat ─────────────────────────────────────────────
function abrirChat() {
    document.getElementById('chatOverlay').classList.add('activo');
    setTimeout(() => {
        document.getElementById('chatInput')?.focus();
    }, 100);
}

// ── Cerrar chat ────────────────────────────────────────────
function cerrarChat() {
    document.getElementById('chatOverlay').classList.remove('activo');
}

// Cerrar al hacer click fuera del panel
document.addEventListener('click', function (e) {
    const overlay = document.getElementById('chatOverlay');
    if (overlay && e.target === overlay) cerrarChat();
});

// ── Enter para enviar (Shift+Enter para nueva línea) ───────
function chatKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensaje();
    }
}

// ── Ajustar altura del textarea ────────────────────────────
function ajustarAltura(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 80) + 'px';
}

// ── Enviar mensaje ─────────────────────────────────────────
async function enviarMensaje() {
    const input = document.getElementById('chatInput');
    const btnEnviar = document.getElementById('chatEnviar');
    const texto = input.value.trim();

    if (!texto) return;

    // Mostrar mensaje del usuario
    agregarMensaje(texto, 'usuario');
    input.value = '';
    input.style.height = 'auto';
    btnEnviar.disabled = true;

    // Agregar al historial
    historial.push({ role: 'user', parts: [{ text: texto }] });

    // Mostrar indicador de carga
    const idCargando = mostrarCargando();

    try {
        const respuesta = await llamarGemini(texto);
        quitarCargando(idCargando);
        agregarMensaje(respuesta, 'ia');
        historial.push({ role: 'model', parts: [{ text: respuesta }] });

        // Limitar historial a últimos 10 mensajes para no pasarnos de tokens
        if (historial.length > 10) {
            historial = historial.slice(historial.length - 10);
        }
    } catch (err) {
        quitarCargando(idCargando);
        agregarMensaje('Ups, tuve un problema para responder. ¡Intenta de nuevo! ⚡', 'ia');
        console.error('Error Gemini:', err);
    }

    btnEnviar.disabled = false;
    input.focus();
}

// ── Llamar a Gemini API ────────────────────────────────────
async function llamarGemini(pregunta) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const body = {
        system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: historial,
        generationConfig: {
            maxOutputTokens: 150,
            temperature: 0.7
        },
        safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' }
        ]
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || 'Error de API');
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar una respuesta.';
}

// ── Helpers de mensajes ────────────────────────────────────
function agregarMensaje(texto, tipo) {
    const contenedor = document.getElementById('chatMensajes');
    const div = document.createElement('div');
    div.className = tipo === 'usuario' ? 'msg-usuario' : 'msg-ia';
    div.textContent = texto;
    contenedor.appendChild(div);
    contenedor.scrollTop = contenedor.scrollHeight;
}

function mostrarCargando() {
    const contenedor = document.getElementById('chatMensajes');
    const id = 'cargando-' + Date.now();
    const div = document.createElement('div');
    div.className = 'msg-cargando';
    div.id = id;
    div.innerHTML = `
      Pensando
      <span class="punto"></span>
      <span class="punto"></span>
      <span class="punto"></span>`;
    contenedor.appendChild(div);
    contenedor.scrollTop = contenedor.scrollHeight;
    return id;
}

function quitarCargando(id) {
    document.getElementById(id)?.remove();
}
