const CLAVE        = 'modulos_desbloqueados';
const INTRO_VISTO  = 'intro_visto';

/* ── SONIDO DE DESBLOQUEO ────────────────────── */
function reproducirDesbloqueo() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const t   = ctx.currentTime;

        /* Arpegio ascendente corto: G4 → B4 → D5 */
        const notas = [
            { freq: 392.00, start: 0.00, dur: 0.14, vol: 0.26 },
            { freq: 493.88, start: 0.11, dur: 0.14, vol: 0.26 },
            { freq: 587.33, start: 0.22, dur: 0.28, vol: 0.30 }
        ];

        notas.forEach(({ freq, start, dur, vol }) => {
            const osc  = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + start);
            gain.gain.setValueAtTime(0,   t + start);
            gain.gain.linearRampToValueAtTime(vol, t + start + 0.022);
            gain.gain.exponentialRampToValueAtTime(0.001, t + start + dur);
            osc.start(t + start);
            osc.stop(t + start + dur + 0.02);
        });
    } catch(e) {}
}

/* ── SONIDO DE CLICK SUAVE ───────────────────── */
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

const texto1 = 'Bienvenidos a los módulos de aprendizaje, aquí deberás ir en orden viendo los módulos para desbloquear el siguiente e ir obteniendo copas.';
const texto2 = '¡Se ha desbloqueado el módulo 1!\nHaz click en él para ver más...';

let estadoIntro      = 0;
let introActiva      = false;
let textoEscribiendo = false;
let twTimer          = null;

/* ── MÁQUINA DE ESCRIBIR (modulos) ───────────── */
function escribirTextoMod(elementId, texto, onFin) {
    const velocidad = 28;
    textoEscribiendo = true;
    const el = document.getElementById(elementId);
    if (!el) { textoEscribiendo = false; if (onFin) onFin(); return; }

    el.innerHTML = '';
    let i = 0;

    function tick() {
        if (i < texto.length) {
            el.innerHTML = texto.slice(0, i + 1).replace(/\n/g, '<br>') +
                           '<span style="color:#FF8F00;font-weight:900;">_</span>';
            i++;
            twTimer = setTimeout(tick, velocidad);
        } else {
            el.innerHTML = texto.replace(/\n/g, '<br>');
            textoEscribiendo = false;
            twTimer = null;
            if (onFin) onFin();
        }
    }
    tick();
}

function iniciar() {
    if (localStorage.getItem(INTRO_VISTO)) {
        mostrarEstadoNormal();
    } else {
        introActiva = true;
        document.addEventListener('click', avanzarIntro);
    }
}

function avanzarIntro() {
    /* Bloquear clic mientras Panelín sigue escribiendo */
    if (textoEscribiendo) return;

    reproducirClik();
    estadoIntro++;

    if (estadoIntro === 1) {
        document.getElementById('modulosRow').classList.add('difuminado');
        let p = document.getElementById('panelinModulos');
        p.style.display = 'flex';
        escribirTextoMod('globoMod', texto1);

    } else if (estadoIntro === 2) {
        escribirTextoMod('globoMod', texto2);

    } else if (estadoIntro >= 3) {
        document.removeEventListener('click', avanzarIntro);
        introActiva = false;
        localStorage.setItem(INTRO_VISTO, 'true');
        mostrarEstadoNormal();
    }
}

function mostrarEstadoNormal() {
    let n       = parseInt(localStorage.getItem(CLAVE) || '1');
    let nSonido = parseInt(localStorage.getItem('modulos_sonido_reproducido') || '0');

    document.getElementById('modulosRow').classList.remove('difuminado');
    document.getElementById('panelinModulos').style.display = 'none';

    for (let i = 1; i <= 4; i++) {
        let lock   = document.getElementById('lock' + i);
        let modulo = document.getElementById('modulo' + i);
        if (i <= n) {
            lock.classList.add('abierto');
            modulo.classList.remove('bloqueado');
        }
    }
    if (n >= 5) {
        document.getElementById('zonaDesafioFinal').style.display = 'block';
    }

    /* Reproducir sonido de desbloqueo para módulos nuevos */
    if (n > nSonido) {
        localStorage.setItem('modulos_sonido_reproducido', n);
        let delay = 600;  /* pequeña pausa para que el usuario vea la pantalla */
        for (let i = nSonido + 1; i <= n; i++) {
            setTimeout(reproducirDesbloqueo, delay);
            delay += 500;
        }
    }

    mostrarCopas();
}

function mostrarCopas() {
    const contenedor = document.getElementById('placaTrofeos');
    const totalEl    = document.getElementById('placaTotal');
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
    const total   = ganadas.filter(Boolean).length;

    const etiquetas = [
        'Triunfo Módulo 1',
        'Triunfo Módulo 2',
        'Triunfo Módulo 3',
        'Triunfo Módulo 4',
        'Desafío Final',
        'Desafío Final'
    ];

    contenedor.innerHTML = ganadas
        .map((g, i) => `<span class="copa-slot${g ? ' ganada' : ''}" data-label="${etiquetas[i]}">🏆</span>`)
        .join('');

    if (totalEl) totalEl.textContent = total + ' / 6';
}

function irModulo(num) {
    if (introActiva) return;
    let n = parseInt(localStorage.getItem(CLAVE) || '1');
    if (num > n) return;
    reproducirClik();

    const urls = {
        1: 'estructura_web.html',
        2: '../Proyecto-solar/modulo_2f/modulo2.html',
        3: 'modulo3.html',
        4: 'enegia_solar_chile/mapa_chile_visualizacion/modulo_4/modulo_4.html'
    };
    setTimeout(() => { window.location.href = urls[num]; }, 110);
}

iniciar();
