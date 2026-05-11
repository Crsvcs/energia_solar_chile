/* ══════════════════════════════════════════════
   IA PANELÍN — GEMINI API
   → Reemplaza TU_API_KEY_AQUI con tu clave de
     Google AI Studio: aistudio.google.com
══════════════════════════════════════════════ */
const GEMINI_KEY = 'AIzaSyDFmISx_YgvgqIeM4tddn29bFdjVRe6KOY';

const GEMINI_SYSTEM = `Eres Panelín, un panel solar simpático y divertido que ayuda a niños de educación básica a aprender sobre energía eléctrica y energía solar en Chile. Responde siempre de forma muy simple, amigable y breve (máximo 3 oraciones cortas). Usa palabras que un niño de 8 años pueda entender fácilmente. Si la pregunta no tiene relación con energía eléctrica o solar, responde amablemente diciendo que solo puedes hablar de esos temas.`;

function abrirModalIA() {
    reproducirClik();
    document.getElementById('modalIA').classList.add('abierto');
    setTimeout(() => document.getElementById('modalIAInput').focus(), 100);
}

function cerrarModalIA() {
    reproducirClik();
    document.getElementById('modalIA').classList.remove('abierto');
    document.getElementById('modalIAGlobo').textContent =
        '¡Hola! Soy Panelín 🌞 ¿Tienes alguna duda sobre la energía eléctrica o solar? ¡Escribe tu pregunta!';
    document.getElementById('modalIAInput').value = '';
    document.getElementById('modalIABtn').disabled = false;
}

async function enviarPreguntaIA() {
    const input  = document.getElementById('modalIAInput');
    const globo  = document.getElementById('modalIAGlobo');
    const btn    = document.getElementById('modalIABtn');
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
    document.getElementById('modalIA').addEventListener('click', function(e) {
        if (e.target === this) cerrarModalIA();
    });
});

/* ── SONIDO DE CLICK SUAVE (botones, casillas) ── */

function reproducirClik() {
    try {
        const ctx  = new (window.AudioContext || window.webkitAudioContext)();
        const t    = ctx.currentTime;
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, t);
        osc.frequency.exponentialRampToValueAtTime(340, t + 0.065);
        gain.gain.setValueAtTime(0.20, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.start(t);
        osc.stop(t + 0.09);
    } catch(e) {}
}

/* ── SONIDO DE SWOOSH (volver a la grilla) ────── */

function reproducirSwoosh() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const t   = ctx.currentTime;

        /* Capa 1: barrido suave con ataque gradual */
        const osc1  = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(680, t);
        osc1.frequency.exponentialRampToValueAtTime(150, t + 0.28);
        gain1.gain.setValueAtTime(0, t);
        gain1.gain.linearRampToValueAtTime(0.14, t + 0.04);
        gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.30);
        osc1.start(t);
        osc1.stop(t + 0.32);

        /* Capa 2: armónico suave, entra un poco después */
        const osc2  = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(950, t + 0.03);
        osc2.frequency.exponentialRampToValueAtTime(220, t + 0.24);
        gain2.gain.setValueAtTime(0, t + 0.03);
        gain2.gain.linearRampToValueAtTime(0.07, t + 0.07);
        gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
        osc2.start(t + 0.03);
        osc2.stop(t + 0.28);
    } catch(e) {}
}

/* ── SONIDO DE FLECHA (sweep ascendente → o descendente ←) */

function reproducirClikFlecha(n) {
    try {
        const ctx  = new (window.AudioContext || window.webkitAudioContext)();
        const t    = ctx.currentTime;
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
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
        osc.start(t);
        osc.stop(t + 0.1);
    } catch(e) {}
}

/* ── SLIDE 2: Ampolleta interactiva ─────────── */

function toggleLampara() {
    reproducirClik();
    const escena   = document.getElementById('interruptorEscena');
    const ambiente = document.getElementById('luzAmbiente');
    const etiqueta = document.getElementById('intEtiqueta');
    if (!escena) return;

    const encendida = escena.classList.toggle('encendida');
    if (ambiente)  ambiente.style.opacity  = encendida ? '1' : '0';
    if (etiqueta)  etiqueta.textContent    = encendida ? '¡Apágala!' : '¡Enciende la luz!';
}

/* ── SLIDE 3: Consumo eléctrico ─────────────── */

/* Registra qué artefactos ya fueron abiertos */
const visitadosSlide3 = new Set();

function toggleInfo(id) {
    reproducirClik();
    let box = document.getElementById(id);
    if (box.style.display === "block") {
        box.style.display = "none";
    } else {
        box.style.display = "block";
        visitadosSlide3.add(id);   /* marca como visitado al abrir */
    }
}

/* ── EFECTO MÁQUINA DE ESCRIBIR (Ahora soporta Negritas) ─────────────── */

let typewriterTimer = null;
let escribiendo = false;

function escribirTexto(elementId, texto, velocidad) {
    velocidad = velocidad || 30;
    escribiendo = true;

    if (typewriterTimer) {
        clearTimeout(typewriterTimer);
        typewriterTimer = null;
    }

    const el = document.getElementById(elementId);
    if (!el) return;

    let i = 0;

    function tick() {
        if (i < texto.length) {
            // ¡NUEVO TRUCO! Si encuentra el inicio de un código HTML, lo salta completo
            if (texto.charAt(i) === '<') {
                let finEtiqueta = texto.indexOf('>', i);
                if (finEtiqueta !== -1) {
                    i = finEtiqueta;
                }
            }

            el.innerHTML = texto.slice(0, i + 1).replace(/\n/g, '<br>') +
                           '<span class="cursor">_</span>';
            i++;
            typewriterTimer = setTimeout(tick, velocidad);
        } else {
            el.innerHTML = texto.replace(/\n/g, '<br>') +
                           '<span class="cursor parpadeando">_</span>';
            typewriterTimer = null;
            escribiendo = false;
        }
    }
    tick();
}

/* Textos de todos los globos */
const textoGloboSlide1 = "Usa las <b>flechas</b>  ← y →para moverte por las páginas, la <b>casita 🏠</b> para volver a los módulos y la <b>ampolleta 💡</b> si tienes alguna duda.";

const textoGloboSlide2 = "La <b>energía eléctrica</b> es la que viaja por los cables y permite que funcionen las luces, los aparatos y todos los dispositivos que usamos a diario en el hogar.\n¡<b>Todo lo que enchufas</b> usa energía eléctrica!";

const textoGloboSlide5 = "Ve <b>seleccionando en orden</b> cada recuadro iluminado y descubre con qué <b>tipo de corriente</b> funciona ese artefacto.";

const textoGloboFinal  = "¡Genial! Completaste el <b>Módulo 1</b> y ganaste una <b>copa solar 🏆</b>.\nAhora descubre cómo el <b>sol ☀️</b> se transforma en energía.\nPresiona la <b>flecha →</b> para avanzar al <b>Módulo 2</b>.";

const textoIntroCorrientes = "¡Atención! Existen dos formas principales en las que la electricidad puede viajar: la <b>Corriente Alterna</b> y la <b>Corriente Continua</b>.\n¡Vamos a conocer sus <b>diferencias</b>!";
/* ── NAVEGACIÓN ENTRE SLIDES ─────────────────── */

let slideActual = 0;

function actualizarFlechas() {
    let total = document.querySelectorAll(".slide").length;
    document.getElementById("flechaIzquierda").style.visibility =
        (slideActual === 0) ? "hidden" : "visible";
    
    document.getElementById("flechaDerecha").style.visibility = "visible";

    const flechaDer = document.getElementById("flechaDerecha");
    /* Ahora detecta automáticamente la última lámina, sin importar cuántas haya */
    if (slideActual === total - 1) {
        flechaDer.classList.add('pulso-final');
    } else {
        flechaDer.classList.remove('pulso-final');
    }
}

let estadoSlide3 = 1;

const textoS3E1 = "Los <b>Watts (W)</b> nos ayudan a saber <b>cuánta electricidad</b> usa un objeto. ¡Mientras más Watts tiene, más electricidad necesita para poder funcionar!";
const textoS3E2 = "Para poder entender mejor esto, haz <b>click</b> sobre cada artefacto.";

function resetSlide3() {
    estadoSlide3 = 1;
    visitadosSlide3.clear();
    document.getElementById("contenedorSlide3").classList.add("difuminado");
    document.getElementById("panelinSlide3").style.display = "flex";
    escribirTexto("textoSlide3", textoS3E1);
    document.getElementById("info1").style.display = "none";
    document.getElementById("info2").style.display = "none";
    document.getElementById("info3").style.display = "none";
}

function cambiarSlide(n) {
    if (escribiendo && n > 0) return;
    reproducirClikFlecha(n);

    let slides = document.querySelectorAll(".slide");

    /* Último slide: flecha derecha va directo al módulo 2 */
    if (slideActual === slides.length - 1 && n === 1) {
        window.location.href = 'modulos.html';
        return;
    }

    /* Slide 3 está en índice 2 — manejar sus 3 estados */
    if (slideActual === 2) {
        if (n === 1) {
            if (estadoSlide3 === 1) {
                estadoSlide3 = 2;
                escribirTexto("textoSlide3", textoS3E2);
                return;
            }
            if (estadoSlide3 === 2) {
                estadoSlide3 = 3;
                document.getElementById("contenedorSlide3").classList.remove("difuminado");
                document.getElementById("panelinSlide3").style.display = "none";
                return;
            }
            /* Verificar que abrió todos antes de avanzar */
            {
                const faltantes = ['info1', 'info2', 'info3'].filter(id => !visitadosSlide3.has(id));
                if (faltantes.length > 0) {
                    reproducirError();
                    faltantes.forEach(id => pulsarCajaSlide3(id));
                    return;
                }
            }
            resetSlide3();
        } else if (n === -1) {
            if (estadoSlide3 === 3) {
                estadoSlide3 = 2;
                document.getElementById("contenedorSlide3").classList.add("difuminado");
                document.getElementById("panelinSlide3").style.display = "flex";
                escribirTexto("textoSlide3", textoS3E2);
                document.getElementById("info1").style.display = "none";
                document.getElementById("info2").style.display = "none";
                document.getElementById("info3").style.display = "none";
                return;
            }
            if (estadoSlide3 === 2) {
                estadoSlide3 = 1;
                escribirTexto("textoSlide3", textoS3E1);
                return;
            }
            resetSlide3();
        }
    }

    /* AHORA ES LA SLIDE 6 (Índice 5) — Artefactos enchufados */
    if (slideActual === 5) {
        if (n === 1 && estadoSlide5 === 1) {
            estadoSlide5 = 2;
            document.getElementById("objetosSlide2").classList.remove("difuminado");
            document.getElementById("panelinSlide5").style.display = "none";
            actualizarDestacado();
            return;
        }
        if (n === 1 && estadoSlide5 === 2 && turnoActual < ordenDispositivos.length) {
            reproducirError();
            pulsarCardActual();
            return;
        }
        if (n === -1 && estadoSlide5 === 2) {
            estadoSlide5 = 1;
            document.getElementById("objetosSlide2").classList.add("difuminado");
            document.getElementById("panelinSlide5").style.display = "flex";
            escribirTexto("globoSlide5", textoGloboSlide5);
            return;
        }
        if (n === -1 && estadoSlide5 === 1) resetSlide5();
    }

    let slideAnterior = slideActual;
    slides[slideAnterior].classList.remove("activo");
    slideActual += n;
    
    if (slideActual < 0) slideActual = 0;
    if (slideActual >= slides.length) slideActual = slides.length - 1;
    
    slides[slideActual].classList.add("activo");

    if (slideActual === 2 && slideAnterior !== 2) resetSlide3();
    if (slideActual === 5 && slideAnterior !== 5) resetSlide5();

    /* Typewriter para slides estáticas */
    if (slideActual === 0) escribirTexto("globoSlide1", textoGloboSlide1);
    if (slideActual === 1) escribirTexto("globoSlide2", textoGloboSlide2);
    
    /* ¡NUEVA LÁMINA! Índice 3 */
    if (slideActual === 3) escribirTexto("globoIntroCorrientes", textoIntroCorrientes);
    
    /* FIN DEL MÓDULO (Última lámina) */
    if (slideActual === slides.length - 1) {
        let actual = parseInt(localStorage.getItem('modulos_desbloqueados') || '1');
        if (actual < 2) localStorage.setItem('modulos_desbloqueados', '2');
        localStorage.setItem('copa_modulo_1', 'true');
        reproducirTriunfo();
        actualizarPlacaVictoria();
        escribirTexto("globoFinal", textoGloboFinal);
    }

    actualizarFlechas();
}

/* Ajustar flechas al cargar + iniciar typewriter slide 1 */
document.addEventListener("DOMContentLoaded", function () {
    actualizarFlechas();
    escribirTexto("globoSlide1", textoGloboSlide1);
});

/* ── SLIDE 5: Corrientes y dispositivos ──────── */

let artefactoActual = "";
let estadoSlide5 = 1;

/* Orden guiado de dispositivos */
const ordenDispositivos = ['tablet', 'refrigerador', 'nintendo', 'microonda', 'teclado', 'xbox'];
let turnoActual = 0;

/* Aplica clases 'destacado' y 'visitado' según el turno */
function actualizarDestacado() {
    ordenDispositivos.forEach((nombre, i) => {
        const card = document.getElementById('card-' + nombre);
        if (!card) return;
        card.classList.remove('destacado', 'visitado');

        if (turnoActual >= ordenDispositivos.length) {
            /* Todos completados — todos quedan normales para revisión */
            return;
        }
        if (i < turnoActual) {
            card.classList.add('visitado');
        } else if (i === turnoActual) {
            card.classList.add('destacado');
        }
    });
}

function resetSlide5() {
    estadoSlide5 = 1;
    turnoActual = 0;
    /* Limpiar clases de turno */
    ordenDispositivos.forEach(nombre => {
        const card = document.getElementById('card-' + nombre);
        if (card) card.classList.remove('destacado', 'visitado');
    });
    document.getElementById("objetosSlide2").classList.add("difuminado");
    document.getElementById("objetosSlide2").style.display = "grid";
    document.getElementById("panelinSlide5").style.display = "flex";
    document.getElementById("detalleArtefacto").style.display = "none";
    document.getElementById("panelinArtefacto").style.display = "none";
    escribirTexto("globoSlide5", textoGloboSlide5);
}
const datosArtefactos = {
    tablet: {
        cargando: "tablet_carg.png",
        texto: "La tablet usa <b>corriente alterna</b> cuando se carga desde el <b>enchufe</b>, y <b>corriente continua</b> cuando funciona con su <b>batería interna</b>."
    },
    refrigerador: {
        cargando: "refrigerador_carg.png",
        texto: "El refrigerador funciona con <b>corriente alterna</b>, porque necesita estar siempre conectado al <b>enchufe</b> para mantenerse encendido."
    },
    nintendo: {
        cargando: "nintendo_carg.png",
        texto: "El Nintendo usa <b>corriente alterna</b> al cargarse desde el <b>enchufe</b>, y <b>corriente continua</b> cuando funciona con su <b>batería integrada</b>."
    },
    microonda: {
        cargando: "microondas_carg.png",
        texto: "El microondas funciona con <b>corriente alterna</b>, porque necesita conectarse al <b>enchufe</b> para poder calentar los alimentos."
    },
    teclado: {
        cargando: "teclado_carg.png",
        texto: "El teclado puede usar <b>corriente alterna</b> si está conectado al <b>enchufe</b>, y <b>corriente continua</b> cuando funciona con <b>pilas o batería</b>."
    },
    xbox: {
        cargando: "xbox_carg.png",
        texto: "La Xbox funciona con <b>corriente alterna</b>, porque necesita estar siempre conectada al <b>enchufe</b> para poder encenderse y funcionar."
    }
};

/* Estado 1 → 2: muestra el artefacto enchufado */
function mostrarDetalle(artefacto) {
    /* Bloquear si no es el turno de este artefacto */
    const indice = ordenDispositivos.indexOf(artefacto);
    if (turnoActual < ordenDispositivos.length && indice !== turnoActual) return;

    reproducirClik();
    artefactoActual = artefacto;

    document.getElementById("objetosSlide2").style.display = "none";
    document.getElementById("detalleArtefacto").style.display = "block";
    document.getElementById("panelinArtefacto").style.display = "none";
    document.getElementById("panelinSlide5").style.display = "none";

    document.getElementById("imagenCargando").src = datosArtefactos[artefacto].cargando;

    document.getElementById("flechas").style.display = "none";
}

/* Estado 2 → 3: muestra a Panelín explicando */
function mostrarPanelinArtefacto() {
    reproducirClik();
    const panel = document.getElementById("panelinArtefacto");
    panel.style.display = "block";
    panel.style.cursor = "default";   /* no pointer mientras habla */

    escribirTexto("textoPanelin", datosArtefactos[artefactoActual].texto, 30);

    /* Al terminar de escribir, volver a mostrar cursor de "toca para continuar" */
    const originalEscribiendo = setInterval(() => {
        if (!escribiendo) {
            panel.style.cursor = "pointer";
            clearInterval(originalEscribiendo);
        }
    }, 100);

    document.getElementById("flechas").style.display = "none";
}

/* ── ERROR: sonido + sacudida cuando intenta avanzar sin ver todos ── */

function reproducirError() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.28);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.28);
    } catch(e) {}
}

function pulsarCardActual() {
    if (turnoActual >= ordenDispositivos.length) return;
    const card = document.getElementById('card-' + ordenDispositivos[turnoActual]);
    if (!card) return;
    card.classList.add('pulso-error');
    setTimeout(() => card.classList.remove('pulso-error'), 750);
}

function pulsarCajaSlide3(infoId) {
    const num  = infoId.replace('info', '');
    const caja = document.getElementById('cajaSlide3-' + num);
    if (!caja) return;
    caja.classList.add('pulso-error-s3');
    setTimeout(() => caja.classList.remove('pulso-error-s3'), 750);
}

/* ── SONIDO DE TRIUNFO (Slide 6) ─────────────── */

function reproducirTriunfo() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const t   = ctx.currentTime;

        /* Fanfare ascendente en Do mayor: C5–E5–G5 rápidos, luego C5–E5 cortos, C6+E6 sostenido */
        const notas = [
            { freq: 523.25,  start: 0.00, dur: 0.15, vol: 0.38 },
            { freq: 659.25,  start: 0.13, dur: 0.15, vol: 0.38 },
            { freq: 783.99,  start: 0.26, dur: 0.15, vol: 0.38 },
            { freq: 523.25,  start: 0.41, dur: 0.09, vol: 0.30 },
            { freq: 659.25,  start: 0.50, dur: 0.09, vol: 0.30 },
            { freq: 1046.50, start: 0.60, dur: 0.65, vol: 0.42 },
            { freq: 1318.51, start: 0.60, dur: 0.65, vol: 0.18 }
        ];

        notas.forEach(({ freq, start, dur, vol }) => {
            const osc  = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + start);
            gain.gain.setValueAtTime(0,   t + start);
            gain.gain.linearRampToValueAtTime(vol, t + start + 0.025);
            gain.gain.setValueAtTime(vol,  t + start + dur - 0.05);
            gain.gain.linearRampToValueAtTime(0,   t + start + dur);
            osc.start(t + start);
            osc.stop(t  + start + dur + 0.05);
        });
    } catch(e) {}
}

/* ── PLACA DE VICTORIA (Slide 6) ─────────────── */

function actualizarPlacaVictoria() {
    const contenedor = document.getElementById('placaVicSlots');
    if (!contenedor) return;

    const modulosGanados = [
        localStorage.getItem('copa_modulo_1') === 'true',
        localStorage.getItem('copa_modulo_2') === 'true',
        localStorage.getItem('copa_modulo_3') === 'true',
        localStorage.getItem('copa_modulo_4') === 'true'
    ];
    const desafioGanado = localStorage.getItem('copa_desafio') === 'true';

    /* 4 trofeos de módulos + 2 del desafío final */
    const ganadas = [...modulosGanados, desafioGanado, desafioGanado];

    contenedor.innerHTML = ganadas
        .map(g => `<span class="placa-vic-slot${g ? ' ganada' : ''}">🏆</span>`)
        .join('');

    const total = ganadas.filter(Boolean).length;
    const totalEl = document.getElementById('placaVicTotal');
    if (totalEl) totalEl.textContent = total + ' / 6';
}

/* Estado 3 → grilla: vuelve, marca como visitado y destaca el siguiente */
function volverObjetosSlide2() {
    if (escribiendo) return;   /* Bloquear mientras Panelín habla */
    reproducirSwoosh();
    estadoSlide5 = 2;

    /* Avanzar turno y actualizar destacado */
    if (turnoActual < ordenDispositivos.length) {
        turnoActual++;
    }
    actualizarDestacado();

    document.getElementById("objetosSlide2").classList.remove("difuminado");
    document.getElementById("objetosSlide2").style.display = "grid";
    document.getElementById("detalleArtefacto").style.display = "none";
    document.getElementById("panelinArtefacto").style.display = "none";
    document.getElementById("panelinSlide5").style.display = "none";

    document.getElementById("flechas").style.display = "flex";
}
