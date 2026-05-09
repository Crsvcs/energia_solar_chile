/* ═══════════════════════════════════════════════════════════════
   MÓDULO 4 – SOL EN CHILE
   Archivo: js/map.js
═══════════════════════════════════════════════════════════════ */

const REGIONES = [
  {
    id: 'arica',
    nombre: 'Arica y Parinacota',
    archivo: 'arica.png',
    nivel: 'muy-alta',
    radiacionWm2: 950,
    capacidadMW: 643,
    top: 0, left: 148, width: 10, height: 18
  },
  {
    id: 'tarapaca',
    nombre: 'Tarapacá',
    archivo: 'tarapaca.png',
    nivel: 'muy-alta',
    radiacionWm2: 930,
    capacidadMW: 1254,
    top: 16, left: 149, width: 12, height: 26
  },
  {
    id: 'antofagasta',
    nombre: 'Antofagasta',
    archivo: 'antofagasta.png',
    nivel: 'muy-alta',
    radiacionWm2: 920,
    capacidadMW: 3510,
    top: 37, left: 147, width: 24, height: 55
  },
  {
    id: 'atacama',
    nombre: 'Atacama',
    archivo: 'atacama.png',
    nivel: 'alta',
    radiacionWm2: 860,
    capacidadMW: 2725,
    top: 84, left: 142, width: 21, height: 47
  },
  {
    id: 'coquimbo',
    nombre: 'Coquimbo',
    archivo: 'coquimbo.png',
    nivel: 'alta',
    radiacionWm2: 760,
    capacidadMW: 753,
    top: 127, left: 141, width: 12, height: 36
  },
  {
    id: 'valparaiso',
    nombre: 'Valparaíso',
    archivo: 'valpo.png',
    nivel: 'media-alta',
    radiacionWm2: 640,
    capacidadMW: 312,
    top: 162, left: 140, width: 13, height: 23
  },
  {
    id: 'metropolitana',
    nombre: 'Región Metropolitana',
    archivo: 'RM.png',
    nivel: 'media-alta',
    radiacionWm2: 605,
    capacidadMW: 367,
    top: 174, left: 142, width: 12, height: 16
  },
  {
    id: 'ohiggins',
    nombre: "O'Higgins",
    archivo: 'ohiggins.png',
    nivel: 'media-alta',
    radiacionWm2: 570,
    capacidadMW: 178,
    top: 187, left: 139, width: 13, height: 14
  },
  {
    id: 'maule',
    nombre: 'Maule',
    archivo: 'maule.png',
    nivel: 'media',
    radiacionWm2: 510,
    capacidadMW: 142,
    top: 199, left: 137, width: 12, height: 22
  },
  {
    id: 'nuble',
    nombre: 'Ñuble',
    archivo: 'nuble.png',
    nivel: 'media',
    radiacionWm2: 480,
    capacidadMW: 88,
    top: 216, left: 136, width: 12, height: 15
  },
  {
    id: 'biobio',
    nombre: 'Biobío',
    archivo: 'biobio.png',
    nivel: 'media',
    radiacionWm2: 460,
    capacidadMW: 115,
    top: 223, left: 130, width: 18, height: 24
  },
  {
    id: 'araucania',
    nombre: 'La Araucanía',
    archivo: 'aracuania.png',
    nivel: 'media',
    radiacionWm2: 430,
    capacidadMW: 72,
    top: 239, left: 133, width: 12, height: 25
  },
  {
    id: 'los_rios',
    nombre: 'Los Ríos',
    archivo: 'rios.png',
    nivel: 'baja',
    radiacionWm2: 360,
    capacidadMW: 34,
    top: 262, left: 130, width: 14, height: 18
  },
  {
    id: 'los_lagos',
    nombre: 'Los Lagos',
    archivo: 'lagos.png',
    nivel: 'baja',
    radiacionWm2: 320,
    capacidadMW: 41,
    top: 276, left: 123, width: 20, height: 47
  },
  {
    id: 'aysen',
    nombre: 'Aysén',
    archivo: 'aisen.png',
    nivel: 'baja',
    radiacionWm2: 290,
    capacidadMW: 18,
    top: 322, left: 117, width: 30, height: 78
  },
  {
    id: 'magallanes',
    nombre: 'Magallanes',
    archivo: 'magallanes.png',
    nivel: 'baja',
    radiacionWm2: 250,
    capacidadMW: 9,
    top: 393, left: 117, width: 59, height: 114
  }
];

/* ── 2. COLORES POR NIVEL DE RADIACIÓN ──────────────────────── */
const COLOR_NIVEL = {
  'muy-alta':   '#D62828',
  'alta':       '#F77F00',
  'media-alta': '#FCBF49',
  'media':      '#6DB33F',
  'baja':       '#5B8BDF'
};

/* ── 3. GENERAR EL MAPA ──────────────────────────────────────── */
function generarMapa() {
  const mapa = document.getElementById('chileMap');
  if (!mapa) return;

  REGIONES.forEach((region) => {
    const btn = document.createElement('button');
    btn.className = 'region-btn';
    btn.dataset.id = region.id;
    btn.dataset.nombre = region.nombre;
    btn.title = region.nombre;

    btn.style.top    = region.top    + 'px';
    btn.style.left   = region.left   + 'px';
    btn.style.width  = region.width  + 'px';
    btn.style.height = region.height + 'px';

    const img = document.createElement('img');
    img.src = 'img/regiones/' + region.archivo;
    img.alt = region.nombre;
    img.draggable = false;
    img.style.filter = nivelAFiltro(region.nivel);

    btn.appendChild(img);
    btn.addEventListener('click', () => mostrarRegion(region, btn));
    mapa.appendChild(btn);
  });
}

function nivelAFiltro(nivel) {
  const filtros = {
    'muy-alta':   'sepia(1) hue-rotate(310deg) saturate(4) brightness(.9)',
    'alta':       'sepia(1) hue-rotate(340deg) saturate(3.5) brightness(1)',
    'media-alta': 'sepia(1) hue-rotate(20deg)  saturate(3)   brightness(1.05)',
    'media':      'sepia(1) hue-rotate(60deg)  saturate(3)   brightness(.95)',
    'baja':       'sepia(1) hue-rotate(170deg) saturate(3)   brightness(.95)'
  };
  return filtros[nivel] || 'none';
}

/* ── 4. MOSTRAR INFO DE LA REGIÓN ──────────────────────────── */
let regionActiva = null;

function mostrarRegion(region, btnEl) {
  if (regionActiva && regionActiva !== btnEl) {
    regionActiva.classList.remove('activa');
  }
  btnEl.classList.toggle('activa');
  regionActiva = btnEl.classList.contains('activa') ? btnEl : null;

  if (!regionActiva) {
    restaurarVistaPrincipal();
    return;
  }

  document.getElementById('infoCard').querySelector('.info-initial').classList.add('hidden');
  const panelRegion = document.getElementById('infoRegion');
  panelRegion.classList.remove('hidden');

  document.getElementById('regionNombre').textContent = region.nombre;
  document.getElementById('regionRadiacion').textContent =
    region.radiacionWm2.toLocaleString('es-CL') + ' W/m²';
  document.getElementById('regionMW').textContent =
    region.capacidadMW.toLocaleString('es-CL') + ' MW';

  generarIconosPaneles(region.capacidadMW);
  document.getElementById('nextBtn').disabled = false;
}

/* ── 5. GENERAR ÍCONOS DE PANELES ───────────────────────────── */
function generarIconosPaneles(mw) {
  const grid = document.getElementById('panelesGrid');
  const total = document.getElementById('panelesTotal');
  grid.innerHTML = '';

  const panelesCnt = mw / 100;
  const panelesEnteros = Math.floor(panelesCnt);
  const fraccion = panelesCnt - panelesEnteros;

  for (let i = 0; i < panelesEnteros; i++) {
    const svg = crearPanelSVG(false);
    svg.style.animationDelay = (i * 40) + 'ms';
    grid.appendChild(svg);
  }

  if (fraccion > 0.05) {
    const svg = crearPanelSVG(true);
    svg.style.animationDelay = (panelesEnteros * 40) + 'ms';
    grid.appendChild(svg);
  }

  total.textContent =
    panelesCnt.toFixed(2) + ' ⊞ = ' + mw.toLocaleString('es-CL') + ' MW';
}

function crearPanelSVG(parcial) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '26');
  svg.setAttribute('height', '26');
  svg.classList.add('panel-svg');
  if (parcial) svg.classList.add('parcial');

  const data = [
    [1,1,7,7], [9,1,7,7], [17,1,7,7],
    [1,9,7,7], [9,9,7,7], [17,9,7,7],
    [1,17,7,7],[9,17,7,7],[17,17,7,7]
  ];
  data.forEach(([x, y, w, h]) => {
    const rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('x', x); rect.setAttribute('y', y);
    rect.setAttribute('width', w); rect.setAttribute('height', h);
    rect.setAttribute('rx', '1');
    rect.setAttribute('fill', '#2F80ED');
    rect.setAttribute('stroke', '#1a1a2e');
    rect.setAttribute('stroke-width', '0.5');
    svg.appendChild(rect);
  });

  ['8,0 8,24', '16,0 16,24', '0,8 24,8', '0,16 24,16'].forEach(pts => {
    const line = document.createElementNS(ns, 'polyline');
    line.setAttribute('points', pts);
    line.setAttribute('stroke', '#1a1a2e');
    line.setAttribute('stroke-width', '0.8');
    svg.appendChild(line);
  });

  return svg;
}

/* ── 6. RESTAURAR VISTA INICIAL ─────────────────────────────── */
function restaurarVistaPrincipal() {
  document.getElementById('infoRegion').classList.add('hidden');
  document.getElementById('infoCard')
    .querySelector('.info-initial').classList.remove('hidden');
}

document.getElementById('closeBtnRegion')?.addEventListener('click', () => {
  if (regionActiva) {
    regionActiva.classList.remove('activa');
    regionActiva = null;
  }
  restaurarVistaPrincipal();
});

/* ── 7. CLASE HELPER PARA OCULTAR ───────────────────────────── */
const style = document.createElement('style');
style.textContent = '.hidden { display: none !important; }';
document.head.appendChild(style);

/* ══════════════════════════════════════════════════════════════
   ZOOM & PAN
   – Rueda del mouse: zoom centrado en el cursor
   – Botones + / − / ⊙: zoom incremental / reset
   – Arrastrar: mover el mapa cuando está ampliado
══════════════════════════════════════════════════════════════ */
const MIN_SCALE = 1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.4;

let mapScale     = 1;
let mapTranslateX = 0;
let mapTranslateY = 0;

/* Estado de arrastre */
let isDragging   = false;
let dragStartX   = 0;
let dragStartY   = 0;
let dragOriginX  = 0;
let dragOriginY  = 0;

/* Estado de pinch (táctil) */
let lastPinchDist = null;

function applyTransform(animate = false) {
  const mapa = document.getElementById('chileMap');
  if (!mapa) return;
  mapa.style.transition = animate ? 'transform .25s ease' : 'none';
  mapa.style.transform =
    `translate(${mapTranslateX}px, ${mapTranslateY}px) scale(${mapScale})`;
  /* Cambiar cursor según si hay zoom activo */
  const wrapper = document.getElementById('mapWrapper');
  if (wrapper) {
    wrapper.style.cursor = mapScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default';
  }
}

function clampTranslate(scale) {
  /* Limita el pan para que el mapa no se vaya demasiado lejos */
  const wrapper = document.getElementById('mapWrapper');
  if (!wrapper) return;
  const wW = wrapper.clientWidth;
  const wH = wrapper.clientHeight;
  const mapa = document.getElementById('chileMap');
  const mW = mapa.offsetWidth  * scale;
  const mH = mapa.offsetHeight * scale;

  const maxX = Math.max(0, (mW - wW) / 2 + 60);
  const maxY = Math.max(0, (mH - wH) / 2 + 60);

  mapTranslateX = Math.min(maxX, Math.max(-maxX, mapTranslateX));
  mapTranslateY = Math.min(maxY, Math.max(-maxY, mapTranslateY));
}

function zoomAt(newScale, originX, originY) {
  /* originX/Y: coordenadas DENTRO del wrapper donde ocurre el zoom */
  const wrapper = document.getElementById('mapWrapper');
  if (!wrapper) return;

  newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));

  const ratio = newScale / mapScale;
  mapTranslateX = originX - ratio * (originX - mapTranslateX);
  mapTranslateY = originY - ratio * (originY - mapTranslateY);
  mapScale = newScale;

  if (mapScale === MIN_SCALE) {
    mapTranslateX = 0;
    mapTranslateY = 0;
  } else {
    clampTranslate(mapScale);
  }

  applyTransform();
  updateZoomBadge();
}

function updateZoomBadge() {
  const badge = document.getElementById('zoomBadge');
  if (badge) badge.textContent = Math.round(mapScale * 100) + '%';

  const btnOut = document.getElementById('zoomOut');
  const btnIn  = document.getElementById('zoomIn');
  if (btnOut) btnOut.disabled = mapScale <= MIN_SCALE;
  if (btnIn)  btnIn.disabled  = mapScale >= MAX_SCALE;
}

/* ── Rueda del mouse ── */
function initWheelZoom() {
  const wrapper = document.getElementById('mapWrapper');
  if (!wrapper) return;

  wrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = wrapper.getBoundingClientRect();
    const ox = e.clientX - rect.left;
    const oy = e.clientY - rect.top;
    const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    zoomAt(mapScale + delta, ox, oy);
  }, { passive: false });
}

/* ── Arrastre con mouse ── */
function initDragPan() {
  const wrapper = document.getElementById('mapWrapper');
  if (!wrapper) return;

  wrapper.addEventListener('mousedown', (e) => {
    if (mapScale <= 1) return;
    isDragging  = true;
    dragStartX  = e.clientX;
    dragStartY  = e.clientY;
    dragOriginX = mapTranslateX;
    dragOriginY = mapTranslateY;
    wrapper.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    mapTranslateX = dragOriginX + (e.clientX - dragStartX);
    mapTranslateY = dragOriginY + (e.clientY - dragStartY);
    clampTranslate(mapScale);
    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    const wrapper = document.getElementById('mapWrapper');
    if (wrapper) wrapper.style.cursor = mapScale > 1 ? 'grab' : 'default';
  });
}

/* ── Pinch zoom táctil ── */
function initTouchZoom() {
  const wrapper = document.getElementById('mapWrapper');
  if (!wrapper) return;

  let touchStartX = 0, touchStartY = 0, touchOriginX = 0, touchOriginY = 0;
  let isTouchDragging = false;

  wrapper.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      lastPinchDist = getPinchDist(e.touches);
    } else if (e.touches.length === 1 && mapScale > 1) {
      isTouchDragging = true;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchOriginX = mapTranslateX;
      touchOriginY = mapTranslateY;
    }
  }, { passive: true });

  wrapper.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = getPinchDist(e.touches);
      if (lastPinchDist === null) { lastPinchDist = dist; return; }

      const rect   = wrapper.getBoundingClientRect();
      const midX   = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left;
      const midY   = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top;
      const factor = dist / lastPinchDist;

      zoomAt(mapScale * factor, midX, midY);
      lastPinchDist = dist;
    } else if (e.touches.length === 1 && isTouchDragging) {
      mapTranslateX = touchOriginX + (e.touches[0].clientX - touchStartX);
      mapTranslateY = touchOriginY + (e.touches[0].clientY - touchStartY);
      clampTranslate(mapScale);
      applyTransform();
    }
  }, { passive: false });

  wrapper.addEventListener('touchend', () => {
    lastPinchDist   = null;
    isTouchDragging = false;
  });
}

function getPinchDist(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

/* ── Botones de zoom ── */
function initZoomButtons() {
  document.getElementById('zoomIn')?.addEventListener('click', () => {
    const wrapper = document.getElementById('mapWrapper');
    if (!wrapper) return;
    zoomAt(mapScale + ZOOM_STEP, wrapper.clientWidth / 2, wrapper.clientHeight / 2);
  });

  document.getElementById('zoomOut')?.addEventListener('click', () => {
    const wrapper = document.getElementById('mapWrapper');
    if (!wrapper) return;
    zoomAt(mapScale - ZOOM_STEP, wrapper.clientWidth / 2, wrapper.clientHeight / 2);
  });

  document.getElementById('zoomReset')?.addEventListener('click', () => {
    mapScale      = 1;
    mapTranslateX = 0;
    mapTranslateY = 0;
    applyTransform(true);
    updateZoomBadge();
  });
}

/* ── 8. ARRANCAR ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  generarMapa();
  initWheelZoom();
  initDragPan();
  initTouchZoom();
  initZoomButtons();
  updateZoomBadge();
});

/* ── 9. NAVEGACIÓN HACIA EL RESUMEN (MÓDULO 5) ───────────────── */
document.getElementById('nextBtn').addEventListener('click', function() {
  let actual = parseInt(localStorage.getItem('modulos_desbloqueados') || '1');
  if (actual < 5) {
    localStorage.setItem('modulos_desbloqueados', '5');
  }
  window.location.href = '../Web2/modulo5.html';
});