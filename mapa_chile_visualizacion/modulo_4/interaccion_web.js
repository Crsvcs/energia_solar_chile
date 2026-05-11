/* ══════════════════════════════════════════════════════════════
   MÓDULO 4 — interaccion_web.js
════════════════════════════════════════════════════════════════ */

/* ── SONIDOS ─────────────────────────────────────────────────
   Copiados del sistema de Módulo 1.
─────────────────────────────────────────────────────────────── */

function reproducirClik() {
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

function reproducirClikFlecha(n) {
    try {
        const ctx  = new (window.AudioContext || window.webkitAudioContext)();
        const t    = ctx.currentTime;
        const osc  = ctx.createOscillator();
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

/* ── TYPEWRITER ──────────────────────────────────────────────
   Mientras escribe, la bandera `escribiendo = true` bloquea
   las flechas en cambiarSlide().
─────────────────────────────────────────────────────────────── */

let typewriterTimer = null;
let escribiendo     = false;

function escribirTexto(elementId, texto, velocidad) {
    velocidad = velocidad || 28;
    escribiendo = true;

    if (typewriterTimer) { clearTimeout(typewriterTimer); typewriterTimer = null; }

    const el = document.getElementById(elementId);
    if (!el) { escribiendo = false; return; }

    let i = 0;
    function tick() {
        if (i < texto.length) {
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

/* Textos de cada globo */
const TEXTOS = {
    slide1: "Usa las flechas para avanzar, la casita para volver a los módulos y la ampolleta si tienes alguna duda.",
    slide2: "Chile recibe mucha radiación solar, que es la cantidad de energía del sol que llega a un lugar.\n¡Por eso es uno de los mejores países del mundo para generar energía solar!",
    slide3: "En el desierto de Atacama el sol brilla casi todo el año y tiene muy poca nubosidad.\n¡Por eso hay muchas plantas solares en el norte de Chile!",
    slide4: "En la siguiente pantalla haz clic en las regiones del mapa para conocer la radiación solar y la capacidad instalada de energía solar de cada una.",
    slide6: "Con la energía solar, Chile podría convertirse en un líder mundial en energías renovables y exportar energía limpia a otros países.",
    final:  "¡Muy bien! Completaste el cuarto y último módulo.\nPrepárate… ahora viene el resumen y el desafío final. ¡Aprieta la casa para continuar!"
};

/* ── NAVEGACIÓN ──────────────────────────────────────────────*/

let slideActual = 0;

function actualizarFlechas() {
    const total = document.querySelectorAll(".slide").length;
    document.getElementById("flechaIzquierda").style.visibility =
        slideActual === 0 ? "hidden" : "visible";
    document.getElementById("flechaDerecha").style.visibility =
        slideActual === total - 1 ? "hidden" : "visible";
}

/* Textos que se disparan al llegar a cada slide (por índice) */
const TEXTO_POR_SLIDE = {
    0: () => escribirTexto("globoSlide1", TEXTOS.slide1),
    1: () => escribirTexto("globoSlide2", TEXTOS.slide2),
    2: () => escribirTexto("globoSlide3", TEXTOS.slide3),
    3: () => escribirTexto("globoSlide4", TEXTOS.slide4),
    5: () => escribirTexto("globoSlide6", TEXTOS.slide6),
    6: () => escribirTexto("globoFinal",  TEXTOS.final)
};

function cambiarSlide(n) {
    /* Bloquear mientras el panelín escribe */
    if (escribiendo) return;

    reproducirClikFlecha(n);

    const slides = document.querySelectorAll(".slide");

    /* Quitar preview y activo actuales */
    slides.forEach(s => s.classList.remove("slide--preview"));
    slides[slideActual].classList.remove("activo");

    slideActual = Math.max(0, Math.min(slideActual + n, slides.length - 1));
    slides[slideActual].classList.add("activo");
    actualizarFlechas();

    /* Preview difuminado: mostrar slide 5 (índice 4) detrás del slide 4 (índice 3) */
    if (slideActual === 3 && slides[4]) {
        slides[4].classList.add("slide--preview");
    }

    /* Init del mapa al llegar al slide 5 (índice 4) */
    if (slideActual === 4) {
        setTimeout(initMapPosition, 30);
    }

    /* Disparar typewriter del slide que se muestra */
    if (TEXTO_POR_SLIDE[slideActual]) {
        TEXTO_POR_SLIDE[slideActual]();
    }
}

/* ══════════════════════════════════════════════════════════════
   MAPA DE CHILE — DATOS
══════════════════════════════════════════════════════════════ */

const REGIONES = [
    { id:'arica',        nombre:'Arica y Parinacota',  archivo:'arica.png',       nivel:'muy-alta',   radiacionWm2:950,  capacidadMW:643,  top:0,   left:148, width:10, height:18 },
    { id:'tarapaca',     nombre:'Tarapacá',             archivo:'tarapaca.png',    nivel:'muy-alta',   radiacionWm2:930,  capacidadMW:1254, top:17,  left:149, width:12, height:26 },
    { id:'antofagasta',  nombre:'Antofagasta',          archivo:'antofagasta.png', nivel:'muy-alta',   radiacionWm2:920,  capacidadMW:3510, top:39,  left:147, width:24, height:55 },
    { id:'atacama',      nombre:'Atacama',              archivo:'atacama.png',     nivel:'alta',       radiacionWm2:860,  capacidadMW:2725, top:87,  left:142, width:21, height:47 },
    { id:'coquimbo',     nombre:'Coquimbo',             archivo:'coquimbo.png',    nivel:'alta',       radiacionWm2:760,  capacidadMW:753,  top:130, left:140, width:12, height:36 },
    { id:'valparaiso',   nombre:'Valparaíso',           archivo:'valpo.png',       nivel:'media-alta', radiacionWm2:640,  capacidadMW:312,  top:165, left:139, width:13, height:23 },
    { id:'metropolitana',nombre:'Región Metropolitana', archivo:'RM.png',          nivel:'media-alta', radiacionWm2:605,  capacidadMW:367,  top:178, left:142, width:12, height:16 },
    { id:'ohiggins',     nombre:"O'Higgins",            archivo:'ohiggins.png',    nivel:'media-alta', radiacionWm2:570,  capacidadMW:178,  top:191, left:139, width:13, height:14 },
    { id:'maule',        nombre:'Maule',                archivo:'maule.png',       nivel:'media',      radiacionWm2:510,  capacidadMW:142,  top:203, left:137, width:12, height:22 },
    { id:'nuble',        nombre:'Ñuble',                archivo:'nuble.png',       nivel:'media',      radiacionWm2:480,  capacidadMW:88,   top:221, left:136, width:12, height:15 },
    { id:'biobio',       nombre:'Biobío',               archivo:'biobio.png',      nivel:'media',      radiacionWm2:460,  capacidadMW:115,  top:229, left:130, width:18, height:24 },
    { id:'araucania',    nombre:'La Araucanía',         archivo:'araucania.png',   nivel:'media',      radiacionWm2:430,  capacidadMW:72,   top:245, left:133, width:12, height:25 },
    { id:'los_rios',     nombre:'Los Ríos',             archivo:'rios.png',        nivel:'baja',       radiacionWm2:360,  capacidadMW:34,   top:269, left:130, width:14, height:18 },
    { id:'los_lagos',    nombre:'Los Lagos',            archivo:'lagos.png',       nivel:'baja',       radiacionWm2:320,  capacidadMW:41,   top:284, left:123, width:20, height:47 },
    { id:'aysen',        nombre:'Aysén',                archivo:'aisen.png',       nivel:'baja',       radiacionWm2:290,  capacidadMW:18,   top:330, left:117, width:30, height:78 },
    { id:'magallanes',   nombre:'Magallanes',           archivo:'magallanes.png',  nivel:'baja',       radiacionWm2:250,  capacidadMW:9,    top:402, left:117, width:59, height:114 }
];

/* ── Filtros CSS por nivel de radiación ──────────────────────
   Se aplican como inline style en la imagen.
   El hover se maneja con mouseenter/mouseleave en JS
   para poder sobreescribir el inline style correctamente.
─────────────────────────────────────────────────────────────── */


const FILTRO_HOVER  = 'brightness(1.3) drop-shadow(0 0 6px rgba(255,180,0,0.9))';
const FILTRO_ACTIVA = 'brightness(1.35) drop-shadow(0 0 10px rgba(255,213,79,1))';

/* ── Generar mapa ────────────────────────────────────────────── */

let regionActiva = null;

function generarMapa() {
    const mapa = document.getElementById('chileMap');
    if (!mapa) return;

    REGIONES.forEach((region) => {
        const btn = document.createElement('button');
        btn.className      = 'region-btn';
        btn.dataset.id     = region.id;
        btn.dataset.nombre = region.nombre;
        btn.title          = region.nombre;

        btn.style.top    = region.top    + 'px';
        btn.style.left   = region.left   + 'px';
        btn.style.width  = region.width  + 'px';
        btn.style.height = region.height + 'px';

        const img = document.createElement('img');
        img.src       = 'mapa/img/regiones/' + region.archivo;
        img.alt       = region.nombre;
        img.draggable = false;
        img.style.filter = '';

        btn.appendChild(img);

        /* ── Hover: mouseenter / mouseleave ──────────────────────
           Necesario porque img.style.filter (inline) tiene mayor
           especificidad que cualquier regla CSS :hover, así que
           el hover CSS nunca ganaría. Lo manejamos desde JS.
        ───────────────────────────────────────────────────────── */
        btn.addEventListener('mouseenter', () => {
            if (!btn.classList.contains('activa')) {
                img.style.filter = FILTRO_HOVER;
            }
        });
        btn.addEventListener('mouseleave', () => {
            if (!btn.classList.contains('activa')) {
                img.style.filter = '';
            }
        });

        btn.addEventListener('click', () => mostrarRegion(region, btn, img));
        mapa.appendChild(btn);
    });
}

/* ── Mostrar info de la región ────────────────────────────────── */

function mostrarRegion(region, btnEl, imgEl) {
    reproducirClik();

    /* Restaurar región activa anterior */
    if (regionActiva && regionActiva.btn !== btnEl) {
        regionActiva.btn.classList.remove('activa');
        regionActiva.img.style.filter = '';
    }

    const yaActiva = btnEl.classList.contains('activa');
    btnEl.classList.toggle('activa');

    if (yaActiva) {
        /* Desactivar */
        imgEl.style.filter = '';
        regionActiva = null;
        restaurarVistaPrincipal();
        return;
    }

    /* Activar */
    imgEl.style.filter = FILTRO_ACTIVA;
    regionActiva = { btn: btnEl, img: imgEl, nivel: region.nivel };

    /* Panel info */
    document.getElementById('infoInicial').classList.add('hidden');
    document.getElementById('infoRegion').classList.remove('hidden');

    document.getElementById('regionNombre').textContent = region.nombre;
    document.getElementById('regionRadiacion').textContent =
        region.radiacionWm2.toLocaleString('es-CL') + ' W/m²';
    document.getElementById('regionMW').textContent =
        region.capacidadMW.toLocaleString('es-CL') + ' MW';

    generarIconosPaneles(region.capacidadMW);
}

function restaurarVistaPrincipal() {
    document.getElementById('infoRegion').classList.add('hidden');
    document.getElementById('infoInicial').classList.remove('hidden');
}

/* ── Paneles solares ─────────────────────────────────────────── */

function generarIconosPaneles(mw) {
    const grid  = document.getElementById('panelesGrid');
    const total = document.getElementById('panelesTotal');
    grid.innerHTML = '';

    const cnt     = mw / 100;
    const enteros = Math.floor(cnt);
    const frac    = cnt - enteros;

    for (let i = 0; i < enteros; i++) {
        const s = crearPanelSVG(false);
        s.style.animationDelay = (i * 35) + 'ms';
        grid.appendChild(s);
    }
    if (frac > 0.05) {
        const s = crearPanelSVG(true);
        s.style.animationDelay = (enteros * 35) + 'ms';
        grid.appendChild(s);
    }
    total.textContent = cnt.toFixed(2) + ' ⊞ = ' + mw.toLocaleString('es-CL') + ' MW';
}

function crearPanelSVG(parcial) {
    const ns  = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '22'); svg.setAttribute('height', '22');
    svg.classList.add('panel-svg');
    if (parcial) svg.classList.add('parcial');

    [[1,1,7,7],[9,1,7,7],[17,1,7,7],
     [1,9,7,7],[9,9,7,7],[17,9,7,7],
     [1,17,7,7],[9,17,7,7],[17,17,7,7]].forEach(([x,y,w,h]) => {
        const r = document.createElementNS(ns, 'rect');
        r.setAttribute('x', x); r.setAttribute('y', y);
        r.setAttribute('width', w); r.setAttribute('height', h);
        r.setAttribute('rx', '1');
        r.setAttribute('fill', '#2F80ED');
        r.setAttribute('stroke', '#01579B');
        r.setAttribute('stroke-width', '0.5');
        svg.appendChild(r);
    });
    ['8,0 8,24','16,0 16,24','0,8 24,8','0,16 24,16'].forEach(pts => {
        const l = document.createElementNS(ns, 'polyline');
        l.setAttribute('points', pts);
        l.setAttribute('stroke', '#01579B');
        l.setAttribute('stroke-width', '0.8');
        svg.appendChild(l);
    });
    return svg;
}

/* Botón cerrar región */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('closeBtnRegion')?.addEventListener('click', () => {
        if (regionActiva) {
            regionActiva.btn.classList.remove('activa');
            regionActiva.img.style.filter = '';
            regionActiva = null;
        }
        restaurarVistaPrincipal();
    });
});

/* ══════════════════════════════════════════════════════════════
   ZOOM Y PANEO
══════════════════════════════════════════════════════════════ */

const MAP_W    = 300;
const MAP_H    = 510;
const ZOOM_MIN  = 1;
const ZOOM_MAX  = 5;
const ZOOM_PASO = 0.4;

let fitScale = 1;
let mapScale = 1;
let mapTx = 0, mapTy = 0;
let initTx = 0, initTy = 0;

let arrastrando = false;
let arrastrarOx = 0, arrastrarOy = 0;
let arrastrarMx = 0, arrastrarMy = 0;
let pinchDistPrev = null;

function initMapPosition() {
    const wrapper = document.getElementById('mapWrapper');
    if (!wrapper) return;
    const wW = wrapper.clientWidth;
    const wH = wrapper.clientHeight;
    if (!wW || !wH) return;

    fitScale = Math.min((wW - 8) / MAP_W, (wH - 8) / MAP_H, 1);
    initTx   = Math.round((wW - MAP_W * fitScale) / 2);
    initTy   = Math.round((wH - MAP_H * fitScale) / 2);
    if (initTy < 4) initTy = 4;

    mapScale = 1; mapTx = initTx; mapTy = initTy;
    aplicarTransform(false);
    actualizarZoomBadge();
}

function aplicarTransform(animar) {
    const mapa = document.getElementById('chileMap');
    if (!mapa) return;
    const s = fitScale * mapScale;
    mapa.style.transition = animar ? 'transform .22s ease' : 'none';
    mapa.style.transform  = `translate(${mapTx}px, ${mapTy}px) scale(${s})`;
    const wrapper = document.getElementById('mapWrapper');
    if (wrapper) wrapper.style.cursor = mapScale > 1 ? (arrastrando ? 'grabbing' : 'grab') : 'default';
}

function clampTranslate() {
    const wrapper = document.getElementById('mapWrapper');
    if (!wrapper) return;
    const wW = wrapper.clientWidth, wH = wrapper.clientHeight;
    const s  = fitScale * mapScale;
    mapTx = Math.min(Math.max(initTx, 4),     Math.max(Math.min(initTx, wW - MAP_W * s - 4), mapTx));
    mapTy = Math.min(Math.max(initTy, 4),     Math.max(Math.min(initTy, wH - MAP_H * s - 4), mapTy));
}

function hacerZoom(nuevoScale, ox, oy) {
    nuevoScale = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nuevoScale));
    const ratio = nuevoScale / mapScale;
    mapTx = ox - ratio * (ox - mapTx);
    mapTy = oy - ratio * (oy - mapTy);
    mapScale = nuevoScale;
    if (mapScale <= ZOOM_MIN) { mapTx = initTx; mapTy = initTy; }
    else clampTranslate();
    aplicarTransform(false);
    actualizarZoomBadge();
}

function actualizarZoomBadge() {
    const badge  = document.getElementById('zoomBadge');
    const btnOut = document.getElementById('zoomOut');
    const btnIn  = document.getElementById('zoomIn');
    if (badge)  badge.textContent = Math.round(mapScale * 100) + '%';
    if (btnOut) btnOut.disabled   = mapScale <= ZOOM_MIN;
    if (btnIn)  btnIn.disabled    = mapScale >= ZOOM_MAX;
}

function centroWrapper() {
    const w = document.getElementById('mapWrapper');
    return w ? { x: w.clientWidth / 2, y: w.clientHeight / 2 } : { x: 150, y: 255 };
}

function initRueda() {
    const wrapper = document.getElementById('mapWrapper');
    if (!wrapper) return;
    wrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = wrapper.getBoundingClientRect();
        hacerZoom(mapScale + (e.deltaY < 0 ? ZOOM_PASO : -ZOOM_PASO),
                  e.clientX - rect.left, e.clientY - rect.top);
    }, { passive: false });
}

function initArrastre() {
    const wrapper = document.getElementById('mapWrapper');
    if (!wrapper) return;
    wrapper.addEventListener('mousedown', (e) => {
        if (mapScale <= 1) return;
        arrastrando = true;
        arrastrarMx = e.clientX; arrastrarMy = e.clientY;
        arrastrarOx = mapTx;     arrastrarOy = mapTy;
        wrapper.style.cursor = 'grabbing';
        e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
        if (!arrastrando) return;
        mapTx = arrastrarOx + (e.clientX - arrastrarMx);
        mapTy = arrastrarOy + (e.clientY - arrastrarMy);
        clampTranslate(); aplicarTransform(false);
    });
    window.addEventListener('mouseup', () => {
        if (!arrastrando) return;
        arrastrando = false;
        const w = document.getElementById('mapWrapper');
        if (w) w.style.cursor = mapScale > 1 ? 'grab' : 'default';
    });
}

function initPinch() {
    const wrapper = document.getElementById('mapWrapper');
    if (!wrapper) return;
    let tArr = false, tOx = 0, tOy = 0, tTxBase = 0, tTyBase = 0;
    wrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) pinchDistPrev = distPinch(e.touches);
        else if (e.touches.length === 1 && mapScale > 1) {
            tArr = true;
            tOx = e.touches[0].clientX; tOy = e.touches[0].clientY;
            tTxBase = mapTx; tTyBase = mapTy;
        }
    }, { passive: true });
    wrapper.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dist = distPinch(e.touches);
            if (pinchDistPrev === null) { pinchDistPrev = dist; return; }
            const rect = wrapper.getBoundingClientRect();
            hacerZoom(mapScale * (dist / pinchDistPrev),
                ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left,
                ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top);
            pinchDistPrev = dist;
        } else if (e.touches.length === 1 && tArr) {
            mapTx = tTxBase + (e.touches[0].clientX - tOx);
            mapTy = tTyBase + (e.touches[0].clientY - tOy);
            clampTranslate(); aplicarTransform(false);
        }
    }, { passive: false });
    wrapper.addEventListener('touchend', () => { pinchDistPrev = null; tArr = false; });
}

function distPinch(t) {
    return Math.sqrt((t[0].clientX-t[1].clientX)**2 + (t[0].clientY-t[1].clientY)**2);
}

function initBotonesZoom() {
    document.getElementById('zoomIn')?.addEventListener('click', () => {
        const c = centroWrapper(); hacerZoom(mapScale + ZOOM_PASO, c.x, c.y);
    });
    document.getElementById('zoomOut')?.addEventListener('click', () => {
        const c = centroWrapper(); hacerZoom(mapScale - ZOOM_PASO, c.x, c.y);
    });
    document.getElementById('zoomReset')?.addEventListener('click', () => {
        mapScale = 1; mapTx = initTx; mapTy = initTy;
        aplicarTransform(true); actualizarZoomBadge();
    });
}

/* ══════════════════════════════════════════════════════════════
   ARRANQUE
══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    actualizarFlechas();

    /* Typewriter del primer slide */
    escribirTexto("globoSlide1", TEXTOS.slide1);

    /* Mapa */
    generarMapa();
    initRueda();
    initArrastre();
    initPinch();
    initBotonesZoom();
    actualizarZoomBadge();
});