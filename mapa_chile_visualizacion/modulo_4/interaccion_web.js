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

    /*
      Si el slide que se acaba de mostrar es el del mapa (índice 4),
      calculamos la posición inicial AHORA, cuando el wrapper ya tiene
      dimensiones reales (el slide está visible).
    */
    if (slideActual === 4) {
        // Pequeño timeout para que el navegador termine de pintar el slide
        setTimeout(initMapPosition, 30);
    }
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
        top: 16, left: 149, width: 12, height: 26
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
        top: 83, left: 142, width: 21, height: 47
    },
    {
        id: 'coquimbo', nombre: 'Coquimbo',
        archivo: 'coquimbo.png', nivel: 'alta',
        radiacionWm2: 760, capacidadMW: 753,
        top: 125, left: 140, width: 12, height: 36
    },
    {
        id: 'valparaiso', nombre: 'Valparaíso',
        archivo: 'valpo.png', nivel: 'media-alta',
        radiacionWm2: 640, capacidadMW: 312,
        top: 158, left: 139, width: 13, height: 23
    },
    {
        id: 'metropolitana', nombre: 'Región Metropolitana',
        archivo: 'RM.png', nivel: 'media-alta',
        radiacionWm2: 605, capacidadMW: 367,
        top: 170, left: 142, width: 12, height: 16
    },
    {
        id: 'ohiggins', nombre: "O'Higgins",
        archivo: 'ohiggins.png', nivel: 'media-alta',
        radiacionWm2: 570, capacidadMW: 178,
        top: 182, left: 139, width: 13, height: 14
    },
    {
        id: 'maule', nombre: 'Maule',
        archivo: 'maule.png', nivel: 'media',
        radiacionWm2: 510, capacidadMW: 142,
        top: 191, left: 137, width: 12, height: 22
    },
    {
        id: 'nuble', nombre: 'Ñuble',
        archivo: 'nuble.png', nivel: 'media',
        radiacionWm2: 480, capacidadMW: 88,
        top: 207, left: 136, width: 12, height: 15
    },
    {
        id: 'biobio', nombre: 'Biobío',
        archivo: 'biobio.png', nivel: 'media',
        radiacionWm2: 460, capacidadMW: 115,
        top: 214, left: 130, width: 18, height: 24
    },
    {
        id: 'araucania', nombre: 'La Araucanía',
        archivo: 'araucania.png', nivel: 'media',
        radiacionWm2: 430, capacidadMW: 72,
        top: 227, left: 133, width: 12, height: 25
    },
    {
        id: 'los_rios', nombre: 'Los Ríos',
        archivo: 'rios.png', nivel: 'baja',
        radiacionWm2: 360, capacidadMW: 34,
        top: 247, left: 130, width: 14, height: 18
    },
    {
        id: 'los_lagos', nombre: 'Los Lagos',
        archivo: 'lagos.png', nivel: 'baja',
        radiacionWm2: 320, capacidadMW: 41,
        top: 260, left: 123, width: 20, height: 47
    },
    {
        id: 'aysen', nombre: 'Aysén',
        archivo: 'aisen.png', nivel: 'baja',
        radiacionWm2: 290, capacidadMW: 18,
        top: 305, left: 117, width: 30, height: 78
    },
    {
        id: 'magallanes', nombre: 'Magallanes',
        archivo: 'magallanes.png', nivel: 'baja',
        radiacionWm2: 250, capacidadMW: 9,
        top: 376, left: 117, width: 59, height: 114
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
   ─────────────────────────────────────────────────────────────
   • fitScale : escala calculada al mostrar el slide para que el
                mapa quepa completo en el wrapper sin recortes.
   • mapScale : zoom del usuario (1 = 100 %, estado base).
   • mapTx/Ty : posición en px del mapa dentro del wrapper.
                El CSS usa justify-content:flex-start; todo el
                posicionamiento lo maneja el transform del JS.
   ─────────────────────────────────────────────────────────────
   Por qué este diseño evita el corrimiento al hacer zoom:
   Si CSS centrara el mapa, mapTx empezaría en 0 pero el mapa
   estaría visualmente desplazado → la fórmula de zoom se
   desajustaría. Con este diseño mapTx = initTx desde el inicio,
   así el punto bajo el cursor siempre se mantiene fijo.
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

/* ── Calcula fitScale e initTx/Ty cuando el slide es visible ── */
function initMapPosition() {
    const wrapper = document.getElementById('mapWrapper');
    if (!wrapper) return;

    const wW = wrapper.clientWidth;
    const wH = wrapper.clientHeight;
    if (!wW || !wH) return;   // slide todavía oculto, ignorar

    /* Escala para que el mapa quepa con 8 px de margen; nunca > 1 */
    fitScale = Math.min((wW - 8) / MAP_W, (wH - 8) / MAP_H, 1);

    /* Centrar el mapa escalado */
    initTx = Math.round((wW - MAP_W * fitScale) / 2);
    initTy = Math.round((wH - MAP_H * fitScale) / 2);
    if (initTy < 4) initTy = 4;

    /* Resetear el zoom del usuario */
    mapScale = 1;
    mapTx = initTx;
    mapTy = initTy;

    aplicarTransform(false);
    actualizarZoomBadge();
}

/* ── Aplica la transformación CSS ── */
function aplicarTransform(animar) {
    const mapa = document.getElementById('chileMap');
    if (!mapa) return;
    const s = fitScale * mapScale;
    mapa.style.transition = animar ? 'transform .22s ease' : 'none';
    mapa.style.transform  = `translate(${mapTx}px, ${mapTy}px) scale(${s})`;

    const wrapper = document.getElementById('mapWrapper');
    if (wrapper) {
        wrapper.style.cursor = mapScale > 1
            ? (arrastrando ? 'grabbing' : 'grab')
            : 'default';
    }
}

/* ── Restringe el paneo ── */
function clampTranslate() {
    const wrapper = document.getElementById('mapWrapper');
    if (!wrapper) return;
    const wW = wrapper.clientWidth;
    const wH = wrapper.clientHeight;
    const s  = fitScale * mapScale;

    const minX = Math.min(initTx, wW - MAP_W * s - 4);
    const maxX = Math.max(initTx, 4);
    const minY = Math.min(initTy, wH - MAP_H * s - 4);
    const maxY = Math.max(initTy, 4);

    mapTx = Math.min(maxX, Math.max(minX, mapTx));
    mapTy = Math.min(maxY, Math.max(minY, mapTy));
}

/* ── Zoom centrado en (ox, oy) relativo al wrapper ── */
function hacerZoom(nuevoUserScale, ox, oy) {
    nuevoUserScale = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nuevoUserScale));
    const ratio = nuevoUserScale / mapScale;
    mapTx = ox - ratio * (ox - mapTx);
    mapTy = oy - ratio * (oy - mapTy);
    mapScale = nuevoUserScale;

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

/* ── Rueda del mouse ── */
function initRueda() {
    const wrapper = document.getElementById('mapWrapper');
    if (!wrapper) return;
    wrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect  = wrapper.getBoundingClientRect();
        hacerZoom(mapScale + (e.deltaY < 0 ? ZOOM_PASO : -ZOOM_PASO),
                  e.clientX - rect.left, e.clientY - rect.top);
    }, { passive: false });
}

/* ── Arrastre con mouse ── */
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
        clampTranslate();
        aplicarTransform(false);
    });

    window.addEventListener('mouseup', () => {
        if (!arrastrando) return;
        arrastrando = false;
        const w = document.getElementById('mapWrapper');
        if (w) w.style.cursor = mapScale > 1 ? 'grab' : 'default';
    });
}

/* ── Pinch táctil ── */
function initPinch() {
    const wrapper = document.getElementById('mapWrapper');
    if (!wrapper) return;

    let tArr = false, tOx = 0, tOy = 0, tTxBase = 0, tTyBase = 0;

    wrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            pinchDistPrev = distPinch(e.touches);
        } else if (e.touches.length === 1 && mapScale > 1) {
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
            clampTranslate();
            aplicarTransform(false);
        }
    }, { passive: false });

    wrapper.addEventListener('touchend', () => { pinchDistPrev = null; tArr = false; });
}

function distPinch(t) {
    return Math.sqrt((t[0].clientX-t[1].clientX)**2 + (t[0].clientY-t[1].clientY)**2);
}

/* ── Botones de zoom ── */
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
    /*
      NO llamamos initMapPosition aquí porque el slide del mapa
      está oculto (display:none) y el wrapper mide 0×0.
      Se llama desde cambiarSlide() cuando el slide se hace visible.
    */
});