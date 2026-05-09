/* ══════════════════════════════════════════════════════════════
   MÓDULO 4 — interaccion_web.js
   Contiene:
     1. Navegación de slides
     2. Datos y generación del mapa interactivo de Chile
     3. Sistema de zoom y paneo
══════════════════════════════════════════════════════════════ */

/* ── 1. NAVEGACIÓN DE SLIDES ─────────────────────────────── */

let slideActual = 0;

function actualizarFlechas() {
    const total = document.querySelectorAll(".slide").length;
    document.getElementById("flechaIzquierda").style.visibility =
        (slideActual === 0) ? "hidden" : "visible";
    document.getElementById("flechaDerecha").style.visibility =
        (slideActual === total - 1) ? "hidden" : "visible";
}

function cambiarSlide(n) {
    const slides = document.querySelectorAll(".slide");
    slides[slideActual].classList.remove("activo");
    slideActual = Math.max(0, Math.min(slideActual + n, slides.length - 1));
    slides[slideActual].classList.add("activo");
    actualizarFlechas();
}

/* ══════════════════════════════════════════════════════════════
   2. DATOS DE REGIONES
══════════════════════════════════════════════════════════════ */

const REGIONES = [
    {
        id: 'arica', nombre: 'Arica y Parinacota',
        archivo: 'arica.png', nivel: 'muy-alta',
        radiacionWm2: 950, capacidadMW: 643,
        top: 0, left: 148, width: 10, height: 18
    },
    {
        id: 'tarapaca', nombre: 'Tarapacá',
        archivo: 'tarapaca.png', nivel: 'muy-alta',
        radiacionWm2: 930, capacidadMW: 1254,
        top: 15, left: 149, width: 12, height: 26
    },
    {
        id: 'antofagasta', nombre: 'Antofagasta',
        archivo: 'antofagasta.png', nivel: 'muy-alta',
        radiacionWm2: 920, capacidadMW: 3510,
        top: 36, left: 147, width: 24, height: 55
    },
    {
        id: 'atacama', nombre: 'Atacama',
        archivo: 'atacama.png', nivel: 'alta',
        radiacionWm2: 860, capacidadMW: 2725,
        top: 84, left: 142, width: 21, height: 47
    },
    {
        id: 'coquimbo', nombre: 'Coquimbo',
        archivo: 'coquimbo.png', nivel: 'alta',
        radiacionWm2: 760, capacidadMW: 753,
        top: 127, left: 141, width: 12, height: 36
    },
    {
        id: 'valparaiso', nombre: 'Valparaíso',
        archivo: 'valpo.png', nivel: 'media-alta',
        radiacionWm2: 640, capacidadMW: 312,
        top: 162, left: 140, width: 13, height: 23
    },
    {
        id: 'metropolitana', nombre: 'Región Metropolitana',
        archivo: 'RM.png', nivel: 'media-alta',
        radiacionWm2: 605, capacidadMW: 367,
        top: 174, left: 142, width: 12, height: 16
    },
    {
        id: 'ohiggins', nombre: "O'Higgins",
        archivo: 'ohiggins.png', nivel: 'media-alta',
        radiacionWm2: 570, capacidadMW: 178,
        top: 187, left: 139, width: 13, height: 14
    },
    {
        id: 'maule', nombre: 'Maule',
        archivo: 'maule.png', nivel: 'media',
        radiacionWm2: 510, capacidadMW: 142,
        top: 199, left: 137, width: 12, height: 22
    },
    {
        id: 'nuble', nombre: 'Ñuble',
        archivo: 'nuble.png', nivel: 'media',
        radiacionWm2: 480, capacidadMW: 88,
        top: 216, left: 136, width: 12, height: 15
    },
    {
        id: 'biobio', nombre: 'Biobío',
        archivo: 'biobio.png', nivel: 'media',
        radiacionWm2: 460, capacidadMW: 115,
        top: 223, left: 130, width: 18, height: 24
    },
    {
        id: 'araucania', nombre: 'La Araucanía',
        archivo: 'araucania.png', nivel: 'media',
        radiacionWm2: 430, capacidadMW: 72,
        top: 239, left: 133, width: 12, height: 25
    },
    {
        id: 'los_rios', nombre: 'Los Ríos',
        archivo: 'rios.png', nivel: 'baja',
        radiacionWm2: 360, capacidadMW: 34,
        top: 262, left: 130, width: 14, height: 18
    },
    {
        id: 'los_lagos', nombre: 'Los Lagos',
        archivo: 'lagos.png', nivel: 'baja',
        radiacionWm2: 320, capacidadMW: 41,
        top: 276, left: 123, width: 20, height: 47
    },
    {
        id: 'aysen', nombre: 'Aysén',
        archivo: 'aisen.png', nivel: 'baja',
        radiacionWm2: 290, capacidadMW: 18,
        top: 322, left: 117, width: 30, height: 78
    },
    {
        id: 'magallanes', nombre: 'Magallanes',
        archivo: 'magallanes.png', nivel: 'baja',
        radiacionWm2: 250, capacidadMW: 9,
        top: 393, left: 117, width: 59, height: 114
    }
];

/* ── 3. GENERAR EL MAPA ──────────────────────────────────── */

function generarMapa() {
    const mapa = document.getElementById('chileMap');
    if (!mapa) return;

    REGIONES.forEach((region) => {
        const btn = document.createElement('button');
        btn.className    = 'region-btn';
        btn.dataset.id   = region.id;
        btn.dataset.nombre = region.nombre;
        btn.title        = region.nombre;

        btn.style.top    = region.top    + 'px';
        btn.style.left   = region.left   + 'px';
        btn.style.width  = region.width  + 'px';
        btn.style.height = region.height + 'px';

        btn.style.backgroundColor = colorRegion(region.nivel);

        btn.style.mask =
            `url(mapa/img/regiones/${region.archivo}) center/contain no-repeat`;

        btn.style.webkitMask =
            `url(mapa/img/regiones/${region.archivo}) center/contain no-repeat`;
        btn.addEventListener('click', () => mostrarRegion(region, btn));
        mapa.appendChild(btn);
    });
}

function colorRegion(nivel) {

    const colores = {
        'muy-alta':   '#D62828',
        'alta':       '#F77F00',
        'media-alta': '#FCBF49',
        'media':      '#6DB33F',
        'baja':       '#5B8BDF'
    };

    return colores[nivel] || '#999';
}

/* ── 4. MOSTRAR INFO DE LA REGIÓN ────────────────────────── */

let regionActiva = null;

function mostrarRegion(region, btnEl) {
    if (regionActiva && regionActiva !== btnEl) {
        regionActiva.classList.remove('activa');
    }
    btnEl.classList.toggle('activa');
    regionActiva = btnEl.classList.contains('activa') ? btnEl : null;

    if (!regionActiva) { restaurarVistaPrincipal(); return; }

    /* Ocultar estado inicial, mostrar detalle */
    document.getElementById('infoInicial').classList.add('hidden');
    document.getElementById('infoRegion').classList.remove('hidden');

    document.getElementById('regionNombre').textContent = region.nombre;
    document.getElementById('regionRadiacion').textContent =
        region.radiacionWm2.toLocaleString('es-CL') + ' W/m²';
    document.getElementById('regionMW').textContent =
        region.capacidadMW.toLocaleString('es-CL') + ' MW';

    generarIconosPaneles(region.capacidadMW);
}

/* ── 5. ÍCONOS DE PANELES SOLARES ────────────────────────── */

function generarIconosPaneles(mw) {
    const grid  = document.getElementById('panelesGrid');
    const total = document.getElementById('panelesTotal');
    grid.innerHTML = '';

    const panelesCnt    = mw / 100;
    const panelesEnteros = Math.floor(panelesCnt);
    const fraccion       = panelesCnt - panelesEnteros;

    for (let i = 0; i < panelesEnteros; i++) {
        const svg = crearPanelSVG(false);
        svg.style.animationDelay = (i * 35) + 'ms';
        grid.appendChild(svg);
    }

    if (fraccion > 0.05) {
        const svg = crearPanelSVG(true);
        svg.style.animationDelay = (panelesEnteros * 35) + 'ms';
        grid.appendChild(svg);
    }

    total.textContent =
        panelesCnt.toFixed(2) + ' ⊞ = ' + mw.toLocaleString('es-CL') + ' MW';
}

function crearPanelSVG(parcial) {
    const ns  = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '22');
    svg.setAttribute('height', '22');
    svg.classList.add('panel-svg');
    if (parcial) svg.classList.add('parcial');

    const celdas = [
        [1,1,7,7],[9,1,7,7],[17,1,7,7],
        [1,9,7,7],[9,9,7,7],[17,9,7,7],
        [1,17,7,7],[9,17,7,7],[17,17,7,7]
    ];
    celdas.forEach(([x,y,w,h]) => {
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

/* ── 6. RESTAURAR VISTA INICIAL ──────────────────────────── */

function restaurarVistaPrincipal() {
    document.getElementById('infoRegion').classList.add('hidden');
    document.getElementById('infoInicial').classList.remove('hidden');
}

/* ══════════════════════════════════════════════════════════════
   7. ZOOM Y PANEO
   – Rueda del mouse: zoom centrado en el cursor
   – Botones +/−/⊙: zoom incremental y reset
   – Click + arrastre: pan cuando hay zoom activo
   – Pinch táctil: zoom con dos dedos
══════════════════════════════════════════════════════════════ */

const ZOOM_MIN  = 1;
const ZOOM_MAX  = 5;
const ZOOM_PASO = 0.4;

let mapScale = 1;
let mapTx    = 0;   // translate X
let mapTy    = 0;   // translate Y

/* Estado de arrastre con mouse */
let arrastrando = false;
let arrastrarOx = 0, arrastrarOy = 0;   // translate al inicio del arrastre
let arrastrarMx = 0, arrastrarMy = 0;   // posición mouse al inicio

/* Estado de pinch */
let pinchDistPrev = null;

/* Aplica la transformación al mapa */
function aplicarTransform(animar) {
    const mapa = document.getElementById('chileMap');
    if (!mapa) return;
    mapa.style.transition = animar ? 'transform .22s ease' : 'none';
    mapa.style.transform  = `translate(${mapTx}px, ${mapTy}px) scale(${mapScale})`;

    const wrapper = document.getElementById('mapWrapper');
    if (wrapper) {
        wrapper.style.cursor = mapScale > 1 ? (arrastrando ? 'grabbing' : 'grab') : 'default';
    }
}

/* Restringe el paneo para que el mapa no se aleje demasiado */
function clampTranslate() {
    const wrapper = document.getElementById('mapWrapper');
    const mapa    = document.getElementById('chileMap');
    if (!wrapper || !mapa) return;

    const wW = wrapper.clientWidth;
    const wH = wrapper.clientHeight;
    if (!wW || !wH) return;

    const mW = mapa.offsetWidth  * mapScale;
    const mH = mapa.offsetHeight * mapScale;

    const maxX = Math.max(0, (mW - wW) / 2 + 80);
    const maxY = Math.max(0, (mH - wH) / 2 + 80);

    mapTx = Math.min(maxX, Math.max(-maxX, mapTx));
    mapTy = Math.min(maxY, Math.max(-maxY, mapTy));
}

/* Zoom centrado en un punto (ox, oy) relativo al wrapper */
function hacerZoom(nuevoScale, ox, oy) {
    nuevoScale = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nuevoScale));

    const ratio = nuevoScale / mapScale;
    mapTx = ox - ratio * (ox - mapTx);
    mapTy = oy - ratio * (oy - mapTy);
    mapScale = nuevoScale;

    if (mapScale === ZOOM_MIN) { mapTx = 0; mapTy = 0; }
    else clampTranslate();

    aplicarTransform(false);
    actualizarZoomBadge();
}

/* Actualiza indicador y estado de botones */
function actualizarZoomBadge() {
    const badge  = document.getElementById('zoomBadge');
    const btnOut = document.getElementById('zoomOut');
    const btnIn  = document.getElementById('zoomIn');
    if (badge)  badge.textContent   = Math.round(mapScale * 100) + '%';
    if (btnOut) btnOut.disabled     = mapScale <= ZOOM_MIN;
    if (btnIn)  btnIn.disabled      = mapScale >= ZOOM_MAX;
}

/* Centro del wrapper */
function centroWrapper() {
    const w = document.getElementById('mapWrapper');
    return w ? { x: w.clientWidth / 2, y: w.clientHeight / 2 } : { x: 150, y: 255 };
}

/* ── Rueda del mouse ── */
function initRueda() {
    const wrapper = document.getElementById('mapWrapper');
    if (!wrapper) return;

    wrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect  = wrapper.getBoundingClientRect();
        const ox    = e.clientX - rect.left;
        const oy    = e.clientY - rect.top;
        const delta = e.deltaY < 0 ? ZOOM_PASO : -ZOOM_PASO;
        hacerZoom(mapScale + delta, ox, oy);
    }, { passive: false });
}

/* ── Arrastre con mouse ── */
function initArrastre() {
    const wrapper = document.getElementById('mapWrapper');
    if (!wrapper) return;

    wrapper.addEventListener('mousedown', (e) => {
        if (mapScale <= 1) return;
        arrastrando  = true;
        arrastrarMx  = e.clientX;
        arrastrarMy  = e.clientY;
        arrastrarOx  = mapTx;
        arrastrarOy  = mapTy;
        wrapper.style.cursor = 'grabbing';
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!arrastrando) return;
        mapTx = arrastrarOx + (e.clientX - arrastrarMx);
        mapTy = arrastrarOy + (e.clientY - arrastrarMy);
        clampTranslate();
        aplicarTransform(false);
    });

    window.addEventListener('mouseup', () => {
        if (!arrastrando) return;
        arrastrando = false;
        const wrapper = document.getElementById('mapWrapper');
        if (wrapper) wrapper.style.cursor = mapScale > 1 ? 'grab' : 'default';
    });
}

/* ── Pinch táctil ── */
function initPinch() {
    const wrapper = document.getElementById('mapWrapper');
    if (!wrapper) return;

    let touchArrastrando = false;
    let touchOx = 0, touchOy = 0, touchTxBase = 0, touchTyBase = 0;

    wrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            pinchDistPrev = distPinch(e.touches);
        } else if (e.touches.length === 1 && mapScale > 1) {
            touchArrastrando = true;
            touchOx    = e.touches[0].clientX;
            touchOy    = e.touches[0].clientY;
            touchTxBase = mapTx;
            touchTyBase = mapTy;
        }
    }, { passive: true });

    wrapper.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dist = distPinch(e.touches);
            if (pinchDistPrev === null) { pinchDistPrev = dist; return; }

            const rect  = wrapper.getBoundingClientRect();
            const midX  = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left;
            const midY  = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top;
            hacerZoom(mapScale * (dist / pinchDistPrev), midX, midY);
            pinchDistPrev = dist;
        } else if (e.touches.length === 1 && touchArrastrando) {
            mapTx = touchTxBase + (e.touches[0].clientX - touchOx);
            mapTy = touchTyBase + (e.touches[0].clientY - touchOy);
            clampTranslate();
            aplicarTransform(false);
        }
    }, { passive: false });

    wrapper.addEventListener('touchend', () => {
        pinchDistPrev    = null;
        touchArrastrando = false;
    });
}

function distPinch(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

/* ── Botones de zoom ── */
function initBotonesZoom() {
    document.getElementById('zoomIn')?.addEventListener('click', () => {
        const c = centroWrapper();
        hacerZoom(mapScale + ZOOM_PASO, c.x, c.y);
    });

    document.getElementById('zoomOut')?.addEventListener('click', () => {
        const c = centroWrapper();
        hacerZoom(mapScale - ZOOM_PASO, c.x, c.y);
    });

    document.getElementById('zoomReset')?.addEventListener('click', () => {
        mapScale = 1; mapTx = 0; mapTy = 0;
        aplicarTransform(true);
        actualizarZoomBadge();
    });

    /* Botón cerrar región */
    document.getElementById('closeBtnRegion')?.addEventListener('click', () => {
        if (regionActiva) { regionActiva.classList.remove('activa'); regionActiva = null; }
        restaurarVistaPrincipal();
    });
}

/* ══════════════════════════════════════════════════════════════
   8. ARRANQUE
══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    actualizarFlechas();
    generarMapa();
    initRueda();
    initArrastre();
    initPinch();
    initBotonesZoom();
    actualizarZoomBadge();
});