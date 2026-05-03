/* ═══════════════════════════════════════════════════════════════
   MÓDULO 4 – SOL EN CHILE
   Archivo: js/map.js

   CÓMO USAR:
   1. Pon tus PNGs de cada región en la carpeta  img/regiones/
   2. En el arreglo REGIONES, edita el campo "archivo" con el
      nombre exacto de cada PNG.
   3. Ajusta los campos top, left, width, height (en píxeles)
      para que cada región quede en su lugar correcto dentro
      del contenedor .chile-map (300 × 940 px por defecto).
      Puedes usar las herramientas de desarrollo del navegador
      para encontrar los valores exactos.
═══════════════════════════════════════════════════════════════ */

/* ── 1. DATOS DE CADA REGIÓN ──────────────────────────────────
   nivel: 'muy-alta' | 'alta' | 'media-alta' | 'media' | 'baja'
   capacidadMW: MW instalados de energía solar
   archivo: nombre del PNG dentro de  img/regiones/
   top/left/width/height: posición y tamaño en PÍXELES dentro
      del contenedor chile-map (300 × 940 px)
─────────────────────────────────────────────────────────────── */
const REGIONES = [
  {
    id: 'arica',
    nombre: 'Arica y Parinacota',
    archivo: 'arica.png',    // ← CAMBIA ESTE NOMBRE
    nivel: 'muy-alta',
    radiacionWm2: 950,
    capacidadMW: 643,
    top: 0, left: 148, width: 10, height: 18
  },
  {
    id: 'tarapaca',
    nombre: 'Tarapacá',
    archivo: 'tarapaca.png',            // ← CAMBIA ESTE NOMBRE
    nivel: 'muy-alta',
    radiacionWm2: 930,
    capacidadMW: 1254,
    top: 16, left: 149, width: 12, height: 26
  },
  {
    id: 'antofagasta',
    nombre: 'Antofagasta',
    archivo: 'antofagasta.png',         // ← CAMBIA ESTE NOMBRE
    nivel: 'muy-alta',
    radiacionWm2: 920,
    capacidadMW: 3510,
    top: 37, left: 147, width: 24, height: 55
  },
  {
    id: 'atacama',
    nombre: 'Atacama',
    archivo: 'atacama.png',             // ← CAMBIA ESTE NOMBRE
    nivel: 'alta',
    radiacionWm2: 860,
    capacidadMW: 2725,
    top: 84, left: 142, width: 21, height: 47
  },
  {
    id: 'coquimbo',
    nombre: 'Coquimbo',
    archivo: 'coquimbo.png',            // ← CAMBIA ESTE NOMBRE
    nivel: 'alta',
    radiacionWm2: 760,
    capacidadMW: 753,
    top: 127, left: 141, width: 12, height: 36
  },
  {
    id: 'valparaiso',
    nombre: 'Valparaíso',
    archivo: 'valpo.png',          // ← CAMBIA ESTE NOMBRE
    nivel: 'media-alta',
    radiacionWm2: 640,
    capacidadMW: 312,
    top: 162, left: 140, width: 13, height: 23
  },
  {
    id: 'metropolitana',
    nombre: 'Región Metropolitana',
    archivo: 'RM.png',       // ← CAMBIA ESTE NOMBRE
    nivel: 'media-alta',
    radiacionWm2: 605,
    capacidadMW: 367,
    top: 174, left: 142, width: 12, height: 16
  },
  {
    id: 'ohiggins',
    nombre: "O'Higgins",
    archivo: 'ohiggins.png',            // ← CAMBIA ESTE NOMBRE
    nivel: 'media-alta',
    radiacionWm2: 570,
    capacidadMW: 178,
    top: 187, left: 139, width: 13, height: 14
  },
  {
    id: 'maule',
    nombre: 'Maule',
    archivo: 'maule.png',               // ← CAMBIA ESTE NOMBRE
    nivel: 'media',
    radiacionWm2: 510,
    capacidadMW: 142,
    top: 199, left: 137, width: 12, height: 22
  },
  {
    id: 'nuble',
    nombre: 'Ñuble',
    archivo: 'nuble.png',               // ← CAMBIA ESTE NOMBRE
    nivel: 'media',
    radiacionWm2: 480,
    capacidadMW: 88,
    top: 216, left: 136, width: 12, height: 15
  },
  {
    id: 'biobio',
    nombre: 'Biobío',
    archivo: 'biobio.png',              // ← CAMBIA ESTE NOMBRE
    nivel: 'media',
    radiacionWm2: 460,
    capacidadMW: 115,
    top: 223, left: 130, width: 18, height: 24
  },
  {
    id: 'araucania',
    nombre: 'La Araucanía',
    archivo: 'aracuania.png',           // ← CAMBIA ESTE NOMBRE
    nivel: 'media',
    radiacionWm2: 430,
    capacidadMW: 72,
    top: 239, left: 133, width: 12, height: 25
  },
  {
    id: 'los_rios',
    nombre: 'Los Ríos',
    archivo: 'rios.png',            // ← CAMBIA ESTE NOMBRE
    nivel: 'baja',
    radiacionWm2: 360,
    capacidadMW: 34,
    top: 262, left: 130, width: 14, height: 18
  },
  {
    id: 'los_lagos',
    nombre: 'Los Lagos',
    archivo: 'lagos.png',           // ← CAMBIA ESTE NOMBRE
    nivel: 'baja',
    radiacionWm2: 320,
    capacidadMW: 41,
    top: 276, left: 123, width: 20, height: 47
  },
  {
    id: 'aysen',
    nombre: 'Aysén',
    archivo: 'aisen.png',               // ← CAMBIA ESTE NOMBRE
    nivel: 'baja',
    radiacionWm2: 290,
    capacidadMW: 18,
    top: 322, left: 117, width: 30, height: 78
  },
  {
    id: 'magallanes',
    nombre: 'Magallanes',
    archivo: 'magallanes.png',          // ← CAMBIA ESTE NOMBRE
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

    /* Posición en el mapa */
    btn.style.top    = region.top    + 'px';
    btn.style.left   = region.left   + 'px';
    btn.style.width  = region.width  + 'px';
    btn.style.height = region.height + 'px';

    /* Imagen PNG de la región */
    const img = document.createElement('img');
    img.src = 'img/regiones/' + region.archivo;
    img.alt = region.nombre;
    img.draggable = false;

    /*
      Aplicamos el color de radiación usando CSS filter.
      La combinación sepia + hue-rotate + saturate permite
      "colorear" el PNG sin afectar las zonas transparentes.
      Ajusta los valores si tu PNG ya tiene color propio.
    */
    img.style.filter = nivelAFiltro(region.nivel);

    btn.appendChild(img);

    /* Evento de clic */
    btn.addEventListener('click', () => mostrarRegion(region, btn));

    mapa.appendChild(btn);
  });
}

/* Convierte nivel a filtro CSS */
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
  /* Quitar clase activa al botón anterior */
  if (regionActiva && regionActiva !== btnEl) {
    regionActiva.classList.remove('activa');
  }
  btnEl.classList.toggle('activa');
  regionActiva = btnEl.classList.contains('activa') ? btnEl : null;

  if (!regionActiva) {
    restaurarVistaPrincipal();
    return;
  }

  /* Panel izquierdo */
  document.getElementById('infoCard').querySelector('.info-initial').classList.add('hidden');

  const panelRegion = document.getElementById('infoRegion');
  panelRegion.classList.remove('hidden');

  /* Nombre */
  document.getElementById('regionNombre').textContent = region.nombre;

  /* Radiación */
  document.getElementById('regionRadiacion').textContent =
    region.radiacionWm2.toLocaleString('es-CL') + ' W/m²';

  /* Capacidad en MW */
  document.getElementById('regionMW').textContent =
    region.capacidadMW.toLocaleString('es-CL') + ' MW';

  /* Iconos de paneles (cada panel = 100 MW) */
  generarIconosPaneles(region.capacidadMW);

  /* Habilitar botón siguiente si hay al menos 1 región visitada */
  document.getElementById('nextBtn').disabled = false;
}

/* ── 5. GENERAR ÍCONOS DE PANELES ───────────────────────────── */
function generarIconosPaneles(mw) {
  const grid = document.getElementById('panelesGrid');
  const total = document.getElementById('panelesTotal');
  grid.innerHTML = '';

  const panelesCnt = mw / 100;               // total paneles (puede ser decimal)
  const panelesEnteros = Math.floor(panelesCnt);
  const fraccion = panelesCnt - panelesEnteros;

  /* Paneles completos */
  for (let i = 0; i < panelesEnteros; i++) {
    const svg = crearPanelSVG(false);
    svg.style.animationDelay = (i * 40) + 'ms';
    grid.appendChild(svg);
  }

  /* Panel parcial (si hay fracción) */
  if (fraccion > 0.05) {
    const svg = crearPanelSVG(true);
    svg.style.animationDelay = (panelesEnteros * 40) + 'ms';
    grid.appendChild(svg);
  }

  /* Texto total */
  total.textContent =
    panelesCnt.toFixed(2) + ' ⊞ = ' + mw.toLocaleString('es-CL') + ' MW';
}

/* SVG de panel solar */
function crearPanelSVG(parcial) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '26');
  svg.setAttribute('height', '26');
  svg.classList.add('panel-svg');
  if (parcial) svg.classList.add('parcial');

  /* Celdas del panel solar */
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

  /* Líneas de la cuadrícula */
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

/* Botón cerrar región */
document.getElementById('closeBtnRegion')?.addEventListener('click', () => {
  if (regionActiva) {
    regionActiva.classList.remove('activa');
    regionActiva = null;
  }
  restaurarVistaPrincipal();
});

/* ── 7. CLASE HELPER PARA OCULTAR ───────────────────────────── */
/* Añadimos la clase 'hidden' al CSS de forma programática */
const style = document.createElement('style');
style.textContent = '.hidden { display: none !important; }';
document.head.appendChild(style);

/* ── 8. ARRANCAR ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', generarMapa);
