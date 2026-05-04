// ============================================================
// escena1-html.js — Lógica de selección de región en HTML puro
// ============================================================

const DATOS = {
  norte:  {
    nombre: 'Zona Norte',
    rad: '950 W/m²',
    desc: 'El desierto de Atacama tiene la mayor radiación solar del planeta. Aquí el sol brilla casi todo el año sin nubes.',
    img_normal: 'assets/Mp_N.png',
    img_hover:  'assets/Mp_N_H_.png',
    img_sel:    'assets/Mp_N_S_.png',
    panelin: '¡Excelente elección! El norte tiene el sol más intenso del mundo. Vas a necesitar pocos paneles para abastecer tu ciudad.',
    pose: 'assets/panelin_5.png'
  },
  centro: {
    nombre: 'Zona Centro',
    rad: '600 W/m²',
    desc: 'La zona central tiene buen sol durante casi todo el año. Es la región más habitada de Chile.',
    img_normal: 'assets/Mp_C.png',
    img_hover:  'assets/Mp_C_H_.png',
    img_sel:    'assets/Mp_C_S_.png',
    panelin: 'Buena opción. El centro tiene buen potencial solar pero necesitarás más paneles que en el norte.',
    pose: 'assets/panelin_2.png'
  },
  sur: {
    nombre: 'Zona Sur',
    rad: '320 W/m²',
    desc: 'El sur es más lluvioso y nublado, por lo que recibe menos radiación solar. Necesitarás más paneles y baterías.',
    img_normal: 'assets/Mp_S.png',
    img_hover:  'assets/Mp_S__H_.png',
    img_sel:    'assets/Mp_S_S_.png',
    panelin: 'Interesante desafío. En el sur hay menos sol así que necesitarás más paneles y baterías para lograrlo.',
    pose: 'assets/panelin_3.png'
  }
};

let regionSeleccionada = null;

// ── Cierra el overlay de intro ────────────────
function cerrarIntro() {
  document.getElementById('overlay-intro').style.display = 'none';
  document.getElementById('panelin-fijo').style.display = 'flex';
}

// ── Selecciona una región ─────────────────────
function seleccionar(region) {
  regionSeleccionada = region;
  const datos = DATOS[region];

  // Resetear todas las imágenes
  ['norte', 'centro', 'sur'].forEach(r => {
    const img = document.getElementById('img-' + r);
    img.src = DATOS[r].img_normal;
    img.classList.remove('seleccionada');
  });

  // Aplicar seleccionada
  const imgSel = document.getElementById('img-' + region);
  imgSel.src = datos.img_sel;
  imgSel.classList.add('seleccionada');

  // Actualizar panel de info
  document.getElementById('info-default').style.display = 'none';
  document.getElementById('info-region').style.display  = 'block';
  document.getElementById('info-nombre').textContent    = datos.nombre;
  document.getElementById('info-rad').textContent       = datos.rad;
  document.getElementById('info-desc').textContent      = datos.desc;

  // Actualizar Panelín
  document.getElementById('panelin-img').src    = datos.pose;
  document.getElementById('panelin-msg').textContent = datos.panelin;
}

// ── Hover de regiones ─────────────────────────
['norte', 'centro', 'sur'].forEach(r => {
  const img = document.getElementById('img-' + r);

  img.addEventListener('mouseover', () => {
    if (regionSeleccionada !== r) img.src = DATOS[r].img_hover;
  });

  img.addEventListener('mouseout', () => {
    if (regionSeleccionada !== r) img.src = DATOS[r].img_normal;
    else img.src = DATOS[r].img_sel;
  });
});

// ── Ir al juego ───────────────────────────────
function comenzar() {
  if (!regionSeleccionada) {
    document.getElementById('panelin-msg').textContent =
      '¡Primero debes elegir una región tocando el mapa!';
    document.getElementById('panelin-img').src = 'assets/panelin_4.png';
    return;
  }
  // Guarda la región y va al juego Phaser
  localStorage.setItem('regionElegida', regionSeleccionada);
  window.location.href = 'juego.html';
}
