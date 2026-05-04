// ============================================================
// ESCENA 1 — Selección de región en el mapa de Chile
// ============================================================
// Dimensiones originales de los assets (en px):
//   Norte:  30 x 162
//   Centro: 26 x 81
//   Sur:    59 x 267
//   Total Chile: ~510px alto
//   Fondo:  680 x 480
//   Labels: 176 x 61
//   Botón:  286 x 85
// ============================================================

class Escena1 extends Phaser.Scene {
  constructor() {
    super({ key: 'Escena1' });
  }

  // ----------------------------------------------------------
  // PRELOAD — carga todos los assets
  // ----------------------------------------------------------
  preload() {
    this.load.image('fondo',         'assets/Rectangle_1.png');
    this.load.image('norte',         'assets/Mp_N.png');
    this.load.image('norte_hover',   'assets/Mp_N_H_.png');
    this.load.image('norte_sel',     'assets/Mp_N_S_.png');
    this.load.image('centro',        'assets/Mp_C.png');
    this.load.image('centro_hover',  'assets/Mp_C_H_.png');
    this.load.image('centro_sel',    'assets/Mp_C_S_.png');
    this.load.image('sur',           'assets/Mp_S.png');
    this.load.image('sur_hover',     'assets/Mp_S__H_.png');
    this.load.image('sur_sel',       'assets/Mp_S_S_.png');
    this.load.image('label_norte',   'assets/Frame_4.png');
    this.load.image('label_centro',  'assets/Frame_5.png');
    this.load.image('label_sur',     'assets/Frame_6.png');
    this.load.image('btn_comenzar',  'assets/Frame_7.png');
    this.load.image('panelin_1',      'assets/panelin_1.png');
    this.load.image('panelin_2',      'assets/panelin_2.png');
    this.load.image('panelin_3',      'assets/panelin_3.png');
    this.load.image('panelin_4',      'assets/panelin_4.png');
    this.load.image('panelin_5',      'assets/panelin_5.png');
  }

  // ----------------------------------------------------------
  // CREATE — construye la escena completa
  // ----------------------------------------------------------
  create() {
    const W = this.scale.width;   // 900
    const H = this.scale.height;  // 600

    this.selectedRegion = null;

    // ── Fondo ────────────────────────────────────────────────
    this.add.image(W / 2, H / 2, 'fondo').setDisplaySize(W, H);

    // Overlay oscuro para que el mapa destaque más
    const overlay = this.add.graphics();
    overlay.fillStyle(0x0a0f2e, 0.45);
    overlay.fillRect(0, 0, W, H);

    // ── Título ───────────────────────────────────────────────
    this.add.text(W / 2, 38, 'SALVA TU CIUDAD SOLAR', {
      fontFamily: 'Bebas Neue, sans-serif',
      fontSize: '52px',
      color: '#000000'
    }).setOrigin(0.5);

    this.add.text(W / 2, 74, 'Elige la región de Chile donde instalarás tu sistema solar', {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '14px',
      color: '#7ab0ff'
    }).setOrigin(0.5);

    // ── Layout del mapa ──────────────────────────────────────
    // Escala elegida para que el total (510px) quepa en ~490px con margen
    const MAP_SCALE = 0.82;

    // Alturas escaladas de cada región
    const norteH  = 162 * MAP_SCALE;  // ~155px
    const centroH = 81  * MAP_SCALE;  // ~78px
    const surH    = 267 * MAP_SCALE;  // ~256px

    // Posición X del centro del mapa (tercio izquierdo)
    const mapX = 200;

    // Posición Y de inicio del mapa (con margen superior de ~105px para el título)
    const mapStartY = 105;

    // Centros Y de cada región
    const norteY  = mapStartY + norteH / 2+0;
    const centroY = mapStartY + norteH + centroH / 2+0;
    const surY    = mapStartY + norteH + centroH + surH / 2+ (-5);

    // ── Zonas interactivas invisibles (más anchas que la imagen) ─
    // Facilita el click para niños — área clickable de 160px de ancho
    const HIT_W = 160;

    // ── Imágenes de cada región ──────────────────────────────
    const imgNorte  = this.add.image(mapX + 12, norteY,  'norte').setScale(MAP_SCALE);
    const imgCentro = this.add.image(mapX + 0, centroY, 'centro').setScale(MAP_SCALE);
    const imgSur    = this.add.image(mapX + 3, surY,    'sur').setScale(MAP_SCALE);

    // ── Zonas clickables (rectángulos invisibles sobre las imágenes) ─
    const zoneNorte  = this.add.zone(mapX, norteY,  HIT_W, norteH).setInteractive();
    const zoneCentro = this.add.zone(mapX, centroY, HIT_W, centroH).setInteractive();
    const zoneSur    = this.add.zone(mapX, surY,    HIT_W, surH).setInteractive();

    // ── Datos de cada región ─────────────────────────────────
    const regiones = {
      norte:  { rad: '950 W/m²', desc: 'Desierto de Atacama\nMáxima radiación solar del planeta', img: imgNorte,  zona: zoneNorte,  normal: 'norte',  hover: 'norte_hover',  sel: 'norte_sel',  label: 'label_norte',  y: norteY  },
      centro: { rad: '600 W/m²', desc: 'Zona Central\nClima templado, buen potencial solar',      img: imgCentro, zona: zoneCentro, normal: 'centro', hover: 'centro_hover', sel: 'centro_sel', label: 'label_centro', y: centroY },
      sur:    { rad: '320 W/m²', desc: 'Zona Sur\nMás lluvioso, menor radiación solar',            img: imgSur,    zona: zoneSur,    normal: 'sur',    hover: 'sur_hover',    sel: 'sur_sel',    label: 'label_sur',    y: surY    }
    };

    // ── Labels (Zona Norte / Centro / Sur) ───────────────────
    const labelScale = 0.75;
    const labelX = mapX + 140; // a la derecha del mapa

    Object.entries(regiones).forEach(([key, data]) => {
      const labelOffsets = { norte: 0, centro: 0, sur: 0 };
      data.labelImg = this.add.image(labelX, data.y + labelOffsets[key], data.label)
        .setScale(labelScale)
        .setAlpha(1);
    });

    // ── Panel de info (derecha) ───────────────────────────────
    const panelX = 600;

    const panelBg = this.add.graphics();
    panelBg.fillStyle(0x0d1b3e, 0.85);
    panelBg.fillRoundedRect(panelX - 130, 130, 260, 320, 12);
    panelBg.lineStyle(0.5, 0x4a7adf, 1);
    panelBg.strokeRoundedRect(panelX - 130, 130, 260, 320, 12);

    this.panelTitle = this.add.text(panelX, 165, 'Elige una región', {
      fontFamily: 'Poppins, sans-serif', fontSize: '16px',
      color: '#7ab0ff', align: 'center'
    }).setOrigin(0.5);

    this.panelRad = this.add.text(panelX, 220, '', {
      fontFamily: 'Poppins, sans-serif', fontSize: '28px',
      fontStyle: 'bold', color: '#EF9F27', align: 'center'
    }).setOrigin(0.5);

    this.panelRadLabel = this.add.text(panelX, 255, '', {
      fontFamily: 'Nunito, sans-serif', fontSize: '12px',
      color: '#aac4ff', align: 'center'
    }).setOrigin(0.5);

    this.panelDesc = this.add.text(panelX, 305, '', {
      fontFamily: 'Nunito, sans-serif', fontSize: '14px',
      color: '#ffffff', align: 'center', lineSpacing: 6,
      wordWrap: { width: 220 }
    }).setOrigin(0.5);

    // Panelín mensaje
    // Panelín
    this.add.image(120, H - 90, 'panelin_1')
      .setScale(0.06).setDepth(20);

    // Bocadillo
    const boc = this.add.graphics().setDepth(19);
    boc.fillStyle(0xffffff, 1);
    boc.fillRoundedRect(180, H - 150, 320, 90, 10);
    boc.lineStyle(1, 0xcccccc, 1);
    boc.strokeRoundedRect(180, H - 150, 320, 90, 10);

    this.add.text(340, H - 105,
      '¡Hola! Elige una región del mapa\npara comenzar tu aventura solar.', {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px',
      color: '#412402', align: 'center', lineSpacing: 4
    }).setOrigin(0.5).setDepth(20);

    // Flecha para avanzar (igual que módulo 1)
    const flechaBtn = this.add.graphics().setDepth(20).setInteractive(
      new Phaser.Geom.Rectangle(W - 70, H - 70, 54, 54),
      Phaser.Geom.Rectangle.Contains
    );
    flechaBtn.fillStyle(0x1a2744, 1);
    flechaBtn.fillRoundedRect(W - 70, H - 70, 54, 54, 8);
    this.add.text(W - 43, H - 43, '→', {
      fontSize: '22px', color: '#ffffff'
    }).setOrigin(0.5).setDepth(21);
    flechaBtn.on('pointerup', () => {
      if (!this.selectedRegion) {
        this.mostrarMensaje('panelin_1', '¡Primero debes elegir una región tocando el mapa!');
      }
    });
    flechaBtn.on('pointerover', () => this.input.setDefaultCursor('pointer'));
    flechaBtn.on('pointerout', () => this.input.setDefaultCursor('default'));

    // ── Botón Comenzar (oculto hasta seleccionar) ────────────
    this.btnComentar = this.add.image(panelX, 510, 'btn_comenzar')
      .setScale(0.8)
      .setAlpha(0);

    this.btnComentar.setInteractive();
    this.btnComentar.on('pointerover', () => {
      this.tweens.add({ targets: this.btnComentar, scaleX: 0.85, scaleY: 0.85, duration: 120 });
    });
    this.btnComentar.on('pointerout', () => {
      this.tweens.add({ targets: this.btnComentar, scaleX: 0.8, scaleY: 0.8, duration: 120 });
    });
    this.btnComentar.on('pointerup', () => this.comenzarJuego());

    // ── Interactividad de cada zona ──────────────────────────
    Object.entries(regiones).forEach(([key, data]) => {
      // Hover
      data.zona.on('pointerover', () => {
        if (this.selectedRegion !== key) {
          data.img.setTexture(data.hover);
          data.labelImg.setAlpha(1);
          this.input.setDefaultCursor('pointer');
        }
      });

      data.zona.on('pointerout', () => {
        if (this.selectedRegion !== key) {
          data.img.setTexture(data.normal);
          data.labelImg.setAlpha(0.6);
        }
        this.input.setDefaultCursor('default');
      });

      // Click / selección
      data.zona.on('pointerup', () => {
        // Resetear todas las regiones
        Object.entries(regiones).forEach(([k, d]) => {
          d.img.setTexture(d.normal);
          d.labelImg.setAlpha(0.6);
        });

        // Aplicar seleccionada
        data.img.setTexture(data.sel);
        data.labelImg.setAlpha(1);
        this.selectedRegion = key;

        // Actualizar panel de info
        this.actualizarPanel(key, data);

        // Mostrar botón con animación
        this.tweens.add({
          targets: this.btnComentar,
          alpha: 1,
          y: 510,
          duration: 350,
          ease: 'Back.Out'
        });

        // Efecto de destellos en la región seleccionada
        //this.crearDestellos(mapX, data.y);
      });
    });

    // ── Instrucción inicial con flecha ───────────────────────
    //this.flechaTxt = this.add.text(350, H - 40, '↑ toca el mapa', {
     //     fontFamily: 'Nunito, sans-serif', fontSize: '12px',
       //   color: '#7ab0ff', align: 'left', lineSpacing: 4
       // });

      //  this.tweens.add({
       //   targets: this.flechaTxt,
        //  x: mapX + HIT_W / 2 + 4,
        //  duration: 700,
       //   yoyo: true,
       //   repeat: -1,
       //   ease: 'Sine.InOut'
       // });

    // ── Partículas de sol en el fondo ────────────────────────
      //  this.crearParticulasSol(W, H);
      }

  // ----------------------------------------------------------
  // Actualiza el panel derecho con info de la región
  // ----------------------------------------------------------
  actualizarPanel(key, data) {
    const nombres = {
      norte:  'Zona Norte',
      centro: 'Zona Centro',
      sur:    'Zona Sur'
    };
    const mensajes = {
      norte:  '¡Excelente elección!\nEl norte tiene el sol\nmás fuerte del mundo.',
      centro: 'Buena opción. El centro\ntiene buen sol durante\ntodo el año.',
      sur:    'Interesante. En el sur\nnecesitarás más paneles\npor la menor radiación.'
    };

    this.panelTitle.setText(nombres[key]);
    this.panelTitle.setColor('#ffffff');

    this.tweens.add({ targets: this.panelRad, alpha: 0, duration: 150, onComplete: () => {
      this.panelRad.setText(data.rad);
      this.tweens.add({ targets: this.panelRad, alpha: 1, duration: 250 });
    }});

    this.panelRadLabel.setText('Radiación solar promedio');
    this.panelDesc.setText(data.desc);

    this.panelinMsg.setText(mensajes[key]);
    this.flechaTxt.setAlpha(0);
  }

  // ----------------------------------------------------------
  // Destellos visuales al seleccionar una región
  // ----------------------------------------------------------
 // crearDestellos(x, y) {
    // for (let i = 0; i < 8; i++) {
      // const angle = (i / 8) * Math.PI * 2;
   //    const dist = Phaser.Math.Between(30, 80);
      // const star = this.add.text(x, y, '✦', {
   //      fontSize: '12px', color: '#EF9F27'
   //    }).setOrigin(0.5);

   //    this.tweens.add({
    //     targets: star,
    //     x: x + Math.cos(angle) * dist,
      //   y: y + Math.sin(angle) * dist,
    //     alpha: 0,
    //     scale: 0.2,
    //     duration: 600,
    //     ease: 'Power2',
    //     onComplete: () => star.destroy()
    //   });
    // }
  // }

  // ----------------------------------------------------------
  // Partículas decorativas de sol en el fondo
  // ----------------------------------------------------------
   // }
  //}

  // ----------------------------------------------------------
  // Transición a la Escena 2 con fade
  // ----------------------------------------------------------
  comenzarJuego() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      // Cuando tengas la Escena 2 lista, cámbiala aquí:
      // this.scene.start('Escena2', { region: this.selectedRegion });
      console.log('Región elegida:', this.selectedRegion);
      this.scene.start('Escena2', { region: this.selectedRegion });
    });
  }
}
