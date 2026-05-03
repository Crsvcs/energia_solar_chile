// ============================================================
// ESCENA 2 — Mapa isométrico: construye tu central solar
// ============================================================
// Assets:
//   Tiles:       277x147px  → escala 0.52 = ~144x76px
//   Panel_Solar: 29x34px   → escala 3.0  = ~87x102px
//   Battery:     32x32px   → escala 2.5  = ~80x80px
//   Casas:       ~60x67px  → escala 1.4
//   Cielos:      790x589px → cubre canvas 900x600
//   Panelín:     varios    → escala ~0.25
// ============================================================

class Escena2 extends Phaser.Scene {
  constructor() {
    super({ key: 'Escena2' });
  }

  // ----------------------------------------------------------
  // INIT — recibe la región elegida desde Escena1
  // ----------------------------------------------------------
  init(data) {
    this.regionElegida = data.region || 'norte';
  }

  // ----------------------------------------------------------
  // PRELOAD
  // ----------------------------------------------------------
  preload() {
    this.load.image('cielo_norte',    'assets/Cielo_norte.png');
    this.load.image('cielo_centro',   'assets/Cielo_centro.png');
    this.load.image('cielo_sur',      'assets/Cielo_sur.png');
    this.load.image('tile_n',         'assets/Tile_N.png');
    this.load.image('tile_h',         'assets/Tile_H.png');
    this.load.image('tile_o',         'assets/Tile_O.png');
    this.load.image('panel_solar',    'assets/Panel_Solar.png');
    this.load.image('battery',        'assets/Battery.png');
    this.load.image('casa_apagada',   'assets/Casa_apagada.png');
    this.load.image('casa_encendida', 'assets/Casa_encendida.png');
    this.load.image('panelin_1',      'assets/panelin_1.png');
    this.load.image('panelin_2',      'assets/panelin_2.png');
    this.load.image('panelin_3',      'assets/panelin_3.png');
    this.load.image('panelin_4',      'assets/panelin_4.png');
    this.load.image('panelin_5',      'assets/panelin_5.png');
  }

  // ----------------------------------------------------------
  // CREATE
  // ----------------------------------------------------------
  create() {
    const W = this.scale.width;   // 900
    const H = this.scale.height;  // 600

    // Datos por región
    const REGION_DATA = {
      norte:  { rad: 950, panelKwh: 15, nombre: 'Zona Norte',  cielo: 'cielo_norte'  },
      centro: { rad: 600, panelKwh: 10, nombre: 'Zona Centro', cielo: 'cielo_centro' },
      sur:    { rad: 320, panelKwh:  6, nombre: 'Zona Sur',    cielo: 'cielo_sur'    },
    };
    this.region     = REGION_DATA[this.regionElegida];
    this.energia    = 0;
    this.energiaMeta = 80;   // kWh necesarios para abastecer las 3 casas
    this.BAT_KWH    = 10;    // cada batería aporta 10 kWh fijos
    this.casasLit   = 0;
    this.winShown   = false;

    // ── Fondo cielo ────────────────────────────────────────
    this.add.image(W / 2, H / 2, this.region.cielo)
      .setDisplaySize(W, H)
      .setDepth(0);

    // Franja de suelo (parte inferior)
    const suelo = this.add.graphics().setDepth(1);
    suelo.fillStyle(0x4a7c3f, 1);
    suelo.fillRect(0, H - 80, W, 80);

    // ── Título y región ────────────────────────────────────
    this.add.text(W / 2, 18, `CONSTRUYE TU CENTRAL SOLAR — ${this.region.nombre}`, {
      fontFamily: 'Poppins, sans-serif', fontSize: '16px',
      fontStyle: 'bold', color: '#ffffff',
      stroke: '#0a0f2e', strokeThickness: 4
    }).setOrigin(0.5).setDepth(10);

    // ── Grid isométrico ────────────────────────────────────
    const TILE_SCALE = 0.52;
    const TILE_W     = 267 * TILE_SCALE * 0.90;  // ~144px
    const TILE_H     = 147 * TILE_SCALE * 0.7;  //  ~76px
    const COLS       = 4;
    const ROWS       = 4;

    // Origen del grid (centro-inferior del canvas, zona izquierda-central)
    const originX = 370;
    const originY = 310;

    // // // // // // this.tiles = [];

    this.tiles = [];

    for (let row = 0; row < ROWS; row++) {
     for (let col = 0; col < COLS; col++) {
        const tx = originX + (col - row) * TILE_W / 2;
        const ty = originY + (col + row) * TILE_H / 2;

        const g = this.add.graphics().setDepth(2 + row + col);

        // Dibuja el rombo directamente en código
        g.fillStyle(0x3a7d44, 1);
        g.fillPoints([
          { x: tx,             y: ty - TILE_H / 2 },
          { x: tx + TILE_W/2, y: ty               },
          { x: tx,             y: ty + TILE_H / 2 },
          { x: tx - TILE_W/2, y: ty               },
        ], true);

        // Borde sutil
        g.lineStyle(0.5, 0x2d6535, 1);
        g.strokePoints([
          { x: tx,             y: ty - TILE_H / 2 },
          { x: tx + TILE_W/2, y: ty               },
          { x: tx,             y: ty + TILE_H / 2 },
          { x: tx - TILE_W/2, y: ty               },
        ], true);

        g.row      = row;
        g.col      = col;
        g.worldX   = tx;
        g.worldY   = ty;
        g.occupied = false;
        g.itemType = null;
        g.itemImg  = null;
        g.baseColor   = (row + col) % 2 === 0 ? 0x3a7d44 : 0x2d6535;
        g.hoverColor  = 0x5aad64;
        g.occupiedColor = 0x1a4a2a;
        g.setInteractive(
          new Phaser.Geom.Polygon([
            tx, ty - TILE_H/2,
            tx + TILE_W/2, ty,
            tx, ty + TILE_H/2,
            tx - TILE_W/2, ty
          ]),
          Phaser.Geom.Polygon.Contains
        );

        g.on('pointerover', () => {
          if (!g.occupied) {
            g.clear();
            g.fillStyle(g.hoverColor, 1);
            g.fillPoints([
              { x: tx, y: ty - TILE_H/2 },
              { x: tx + TILE_W/2, y: ty },
              { x: tx, y: ty + TILE_H/2 },
              { x: tx - TILE_W/2, y: ty }
            ], true);
          }
        });

        g.on('pointerout', () => {
          if (!g.occupied) {
            g.clear();
            g.fillStyle(g.baseColor, 1);
            g.fillPoints([
              { x: tx, y: ty - TILE_H/2 },
              { x: tx + TILE_W/2, y: ty },
              { x: tx, y: ty + TILE_H/2 },
              { x: tx - TILE_W/2, y: ty }
            ], true);
            g.lineStyle(0.5, 0x2d6535, 1);
            g.strokePoints([
              { x: tx, y: ty - TILE_H/2 },
              { x: tx + TILE_W/2, y: ty },
              { x: tx, y: ty + TILE_H/2 },
              { x: tx - TILE_W/2, y: ty }
            ], true);
          }
        });

        this.tiles.push(g);
      }
    }

        // ── Casas (esquina derecha del mapa) ───────────────────
        this.casas = [];
        const casaPos = [
          { x: 860, y: 400 },
          { x: 800, y: 500 },
          { x: 760, y: 400 },
        ];
        casaPos.forEach((pos, i) => {
          const c = this.add.image(pos.x, pos.y, 'casa_apagada')
            .setScale(0.08
            )
            .setDepth(15);
          this.casas.push(c);
        });

    // ── Panel izquierdo — inventario ───────────────────────
    const inv = this.add.graphics().setDepth(20);
    inv.fillStyle(0x0d1b3e, 0.88);
    inv.fillRoundedRect(8, 50, 115, 320, 10);
    inv.lineStyle(1, 0x4a7adf, 0.8);
    inv.strokeRoundedRect(8, 50, 115, 320, 10);

    this.add.text(65, 65, 'INVENTARIO', {
      fontFamily: 'Poppins, sans-serif', fontSize: '9px',
      color: '#7ab0ff', letterSpacing: 1
    }).setOrigin(0.5).setDepth(21);

    // Separador
    const sep = this.add.graphics().setDepth(21);
    sep.lineStyle(0.5, 0x4a7adf, 0.4);
    sep.lineBetween(18, 80, 113, 80);

    // Ítem Panel Solar
    this.crearItemInventario(65, 150, 'panel_solar', 'PANEL\nSOLAR', `+${this.region.panelKwh} kWh`, 0.18, 'panel');

    // Separador
    const sep2 = this.add.graphics().setDepth(21);
    sep2.lineStyle(0.5, 0x4a7adf, 0.4);
    sep2.lineBetween(18, 240, 113, 240);

    // Ítem Batería
    this.crearItemInventario(65, 300, 'battery', 'BATERÍA', `+${this.BAT_KWH} kWh`, 0.18, 'battery');

    // ── Panel derecho — info ───────────────────────────────
    const info = this.add.graphics().setDepth(20);
    info.fillStyle(0x0d1b3e, 0.88);
    info.fillRoundedRect(W - 175, 50, 165, 260, 10);
    info.lineStyle(1, 0x4a7adf, 0.8);
    info.strokeRoundedRect(W - 175, 50, 165, 260, 10);

    this.add.text(W - 92, 68, 'ENERGÍA', {
      fontFamily: 'Poppins, sans-serif', fontSize: '10px',
      color: '#7ab0ff', letterSpacing: 1
    }).setOrigin(0.5).setDepth(21);

    // Barra de energía
    const barBg = this.add.graphics().setDepth(21);
    barBg.fillStyle(0x1a2d5a, 1);
    barBg.fillRoundedRect(W - 165, 85, 145, 16, 4);

    this.barraEnergia = this.add.graphics().setDepth(22);
    this.textoEnergia = this.add.text(W - 92, 108, '0 / 80 kWh', {
      fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#ffffff'
    }).setOrigin(0.5).setDepth(22);

    // Radiación info
    this.add.text(W - 92, 130, 'Radiación solar:', {
      fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#aac4ff'
    }).setOrigin(0.5).setDepth(21);

    this.add.text(W - 92, 148, `${this.region.rad} W/m²`, {
      fontFamily: 'Poppins, sans-serif', fontSize: '18px',
      fontStyle: 'bold', color: '#EF9F27'
    }).setOrigin(0.5).setDepth(21);

    // Casas info
    this.add.text(W - 92, 178, 'Casas abastecidas:', {
      fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#aac4ff'
    }).setOrigin(0.5).setDepth(21);

    this.textoCasas = this.add.text(W - 92, 198, '0 / 3', {
      fontFamily: 'Poppins, sans-serif', fontSize: '22px',
      fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5).setDepth(21);

    // Meta de energía
    this.add.text(W - 92, 230, 'Meta:', {
      fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#aac4ff'
    }).setOrigin(0.5).setDepth(21);
    this.add.text(W - 92, 248, '80 kWh / día', {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#ffffff'
    }).setOrigin(0.5).setDepth(21);

    // Botón reiniciar
    const btnRst = this.add.graphics().setDepth(21).setInteractive(
      new Phaser.Geom.Rectangle(W - 165, 278, 145, 26), Phaser.Geom.Rectangle.Contains
    );
    btnRst.fillStyle(0x1a2d5a, 1);
    btnRst.fillRoundedRect(W - 165, 278, 145, 26, 6);
    btnRst.lineStyle(0.5, 0x4a7adf, 1);
    btnRst.strokeRoundedRect(W - 165, 278, 145, 26, 6);
    this.add.text(W - 92, 291, 'Reiniciar mapa', {
      fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#7ab0ff'
    }).setOrigin(0.5).setDepth(22);
    btnRst.on('pointerup', () => this.reiniciarMapa());
    btnRst.on('pointerover', () => { this.input.setDefaultCursor('pointer'); });
    btnRst.on('pointerout',  () => { this.input.setDefaultCursor('default'); });

    // ── Panelín ────────────────────────────────────────────
    this.panelin = this.add.image(75, H - 95, 'panelin_1')
      .setScale(0.28)
      .setDepth(30);

    // Burbuja de mensaje
    this.bubbleBg = this.add.graphics().setDepth(29);
    this.bubbleText = this.add.text(200, H - 130, '', {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px',
      color: '#412402', wordWrap: { width: 320 }, lineSpacing: 3
    }).setDepth(30);

    this.mostrarMensaje('panelin_1',
      `¡Hola! Estás en el ${this.region.nombre}. Arrastra paneles y baterías al mapa para abastecer las 3 casas. ¡Recuerda no instalar de más!`
    );

    // ── Inicializar barra ──────────────────────────────────
    this.actualizarBarra();
  }

  // ----------------------------------------------------------
  // Crea un ítem arrastrable en el inventario
  // ----------------------------------------------------------
  crearItemInventario(x, y, texture, label, bonus, escala, tipo) {
    const img = this.add.image(x, y, texture)
      .setScale(escala)
      .setDepth(25)
      .setInteractive({ draggable: true });

    img.itemType  = tipo;
    img.baseX     = x;
    img.baseY     = y;
    img.itemScale = escala;

    this.add.text(x, y + 38, label, {
      fontFamily: 'Poppins, sans-serif', fontSize: '9px',
      color: '#ffffff', align: 'center'
    }).setOrigin(0.5).setDepth(25);

    this.add.text(x, y + 58, bonus, {
      fontFamily: 'Nunito, sans-serif', fontSize: '10px',
      color: '#EF9F27', align: 'center'
    }).setOrigin(0.5).setDepth(25);

    this.input.setDraggable(img);

    img.on('dragstart', () => {
      img.setScale(escala * 1.15).setDepth(50);
      this.input.setDefaultCursor('grabbing');
    });

    img.on('drag', (pointer, dragX, dragY) => {
      img.x = dragX;
      img.y = dragY;
    });

    img.on('dragend', (pointer) => {
      img.setScale(escala).setDepth(25);
      this.input.setDefaultCursor('default');

      const tile = this.tileMasCercano(pointer.x, pointer.y);
      if (tile && !tile.occupied) {
        this.colocarEnTile(tile, img.itemType);
        img.x = img.baseX;
        img.y = img.baseY;
      } else {
        // Devolver al inventario con animación
        this.tweens.add({
          targets: img, x: img.baseX, y: img.baseY,
          duration: 200, ease: 'Back.Out'
        });
        if (tile && tile.occupied) {
          this.mostrarMensaje('panelin_3', '¡Esa casilla ya tiene algo! Elige otra casilla vacía.');
        }
      }
    });
  }

  // ----------------------------------------------------------
  // Coloca un ítem en un tile del mapa
  // ----------------------------------------------------------
  colocarEnTile(tile, tipo) {
    tile.occupied = true;
    tile.itemType = tipo;
    tile.setTexture('tile_o');

    const escItem = tipo === 'panel' ? 0.15 : 0.15;
    const texture = tipo === 'panel' ? 'panel_solar' : 'battery';
    const offsetY = tipo === 'panel' ? -52 : -44;

    const itemImg = this.add.image(tile.worldX, tile.worldY + offsetY, texture)
      .setScale(escItem)
      .setDepth(tile.depth + 1);

    // Animación de aparición
    itemImg.setAlpha(0).setScale(escItem * 0.5);
    this.tweens.add({
      targets: itemImg, alpha: 1, scale: escItem,
      duration: 250, ease: 'Back.Out'
    });

    tile.itemImg = itemImg;

    // Calcular energía
    const kwh = tipo === 'panel' ? this.region.panelKwh : this.BAT_KWH;
    this.energia += kwh;
    this.actualizarBarra();
    this.actualizarCasas();
    this.verificarExceso();
  }

  // ----------------------------------------------------------
  // Encuentra el tile más cercano al punto dado
  // ----------------------------------------------------------
  tileMasCercano(px, py) {
    let mejor = null;
    let menorDist = 65;
    for (const t of this.tiles) {
      const d = Phaser.Math.Distance.Between(px, py, t.worldX, t.worldY);
      if (d < menorDist) { menorDist = d; mejor = t; }
    }
    return mejor;
  }

  // ----------------------------------------------------------
  // Actualiza la barra de energía
  // ----------------------------------------------------------
  actualizarBarra() {
    this.barraEnergia.clear();
    const W = this.scale.width;
    const pct = Math.min(1, this.energia / this.energiaMeta);
    const color = pct < 0.4 ? 0xE24B4A : pct < 0.8 ? 0xEF9F27 : 0x1D9E75;
    this.barraEnergia.fillStyle(color, 1);
    this.barraEnergia.fillRoundedRect(W - 165, 85, Math.round(145 * pct), 16, 4);
    this.textoEnergia.setText(`${this.energia} / ${this.energiaMeta} kWh`);
  }

  // ----------------------------------------------------------
  // Actualiza casas encendidas según energía
  // ----------------------------------------------------------
  actualizarCasas() {
    const nuevasCasas = Math.min(3, Math.floor((this.energia / this.energiaMeta) * 3));
    if (nuevasCasas !== this.casasLit) {
      this.casasLit = nuevasCasas;
      this.casas.forEach((c, i) => {
        const encendida = i < nuevasCasas;
        c.setTexture(encendida ? 'casa_encendida' : 'casa_apagada');
        if (encendida) {
          this.tweens.add({ targets: c, scaleX: c.scaleX * 1.08, scaleY: c.scaleY * 1.08, duration: 150, yoyo: true });
        }
      });
      this.textoCasas.setText(`${nuevasCasas} / 3`);
      this.textoCasas.setColor(nuevasCasas === 3 ? '#1D9E75' : '#ffffff');

      // Mensaje de Panelín según progreso
      if (nuevasCasas === 1) {
        this.mostrarMensaje('panelin_2', '¡La primera casa tiene luz! Sigue instalando para abastecer las demás.');
      } else if (nuevasCasas === 2) {
        this.mostrarMensaje('panelin_5', '¡Dos casas encendidas! Ya casi llegas, solo falta una más.');
      } else if (nuevasCasas === 3 && !this.winShown) {
        this.time.delayedCall(400, () => this.mostrarVictoria());
      }
    }
  }

  // ----------------------------------------------------------
  // Verifica si el jugador está instalando de más
  // ----------------------------------------------------------
  verificarExceso() {
    const exceso = this.energia - this.energiaMeta;
    if (exceso > 30 && exceso <= 50) {
      this.mostrarMensaje('panelin_4', `Estás generando ${this.energia} kWh pero solo necesitas ${this.energiaMeta}. Estás usando más de lo necesario.`);
    } else if (exceso > 50) {
      this.mostrarMensaje('panelin_3', `¡Demasiados elementos! Estás generando ${this.energia} kWh pero la ciudad solo necesita ${this.energiaMeta}. ¡Estás desperdiciando recursos!`);
    }
  }

  // ----------------------------------------------------------
  // Muestra un mensaje de Panelín con su pose
  // ----------------------------------------------------------
  mostrarMensaje(pose, msg) {
    this.panelin.setTexture(pose);
    const H = this.scale.height;

    this.bubbleBg.clear();
    this.bubbleBg.fillStyle(0xFAEEDA, 0.96);
    this.bubbleBg.fillRoundedRect(130, H - 148, 370, 68, 8);
    this.bubbleBg.lineStyle(0.5, 0xEF9F27, 1);
    this.bubbleBg.strokeRoundedRect(130, H - 148, 370, 68, 8);

    this.bubbleText.setText(msg);
    this.bubbleText.setPosition(142, H - 140);
  }

  // ----------------------------------------------------------
  // Reinicia el mapa limpiando todos los tiles
  // ----------------------------------------------------------
  reiniciarMapa() {
    this.tiles.forEach(t => {
      if (t.occupied) {
        if (t.itemImg) t.itemImg.destroy();
        t.occupied = false;
        t.itemType = null;
        t.itemImg  = null;
        t.setTexture('tile_n');
      }
    });
    this.energia   = 0;
    this.casasLit  = 0;
    this.winShown  = false;
    this.casas.forEach(c => c.setTexture('casa_apagada'));
    this.textoCasas.setText('0 / 3').setColor('#ffffff');
    this.actualizarBarra();
    this.mostrarMensaje('panelin_1', '¡Mapa reiniciado! Vuelve a intentarlo. Recuerda instalar lo justo para las 3 casas.');
  }

  // ----------------------------------------------------------
  // Pantalla de victoria
  // ----------------------------------------------------------
  mostrarVictoria() {
    if (this.winShown) return;
    this.winShown = true;

    const W = this.scale.width;
    const H = this.scale.height;

    const paneles  = this.tiles.filter(t => t.itemType === 'panel').length;
    const baterias = this.tiles.filter(t => t.itemType === 'battery').length;
    const total    = paneles + baterias;
    const estrellas = total <= 5 ? '★★★' : total <= 8 ? '★★☆' : '★☆☆';
    const badge    = total <= 5 ? '¡Ingeniero Solar Experto!' : total <= 8 ? 'Ingeniero Solar Junior' : 'Aprendiz Solar';

    // Panelín feliz
    this.mostrarMensaje('panelin_5', `¡Increíble! Usaste ${paneles} paneles y ${baterias} baterías. ¡Tu ciudad tiene luz!`);

    // Overlay
    const ov = this.add.graphics().setDepth(60);
    ov.fillStyle(0x000000, 0.65);
    ov.fillRect(0, 0, W, H);

    // Caja de victoria
    const cx = W / 2, cy = H / 2;
    const box = this.add.graphics().setDepth(61);
    box.fillStyle(0x0d1b3e, 0.98);
    box.fillRoundedRect(cx - 200, cy - 155, 400, 310, 14);
    box.lineStyle(2, 0xEF9F27, 1);
    box.strokeRoundedRect(cx - 200, cy - 155, 400, 310, 14);

    this.add.text(cx, cy - 118, '⚡', { fontSize: '44px' }).setOrigin(0.5).setDepth(62);
    this.add.text(cx, cy - 62, '¡Ciudad abastecida!', {
      fontFamily: 'Poppins, sans-serif', fontSize: '22px',
      fontStyle: 'bold', color: '#EF9F27'
    }).setOrigin(0.5).setDepth(62);

    this.add.text(cx, cy - 26, estrellas, {
      fontSize: '30px', color: '#EF9F27'
    }).setOrigin(0.5).setDepth(62);

    this.add.text(cx, cy + 8, badge, {
      fontFamily: 'Poppins, sans-serif', fontSize: '15px', color: '#ffffff'
    }).setOrigin(0.5).setDepth(62);

    this.add.text(cx, cy + 40, `${paneles} paneles + ${baterias} baterías = ${this.energia} kWh`, {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#aac4ff'
    }).setOrigin(0.5).setDepth(62);

    // Botón volver a elegir región
    const btnBox = this.add.graphics().setDepth(62).setInteractive(
      new Phaser.Geom.Rectangle(cx - 130, cy + 72, 260, 36), Phaser.Geom.Rectangle.Contains
    );
    btnBox.fillStyle(0xEF9F27, 1);
    btnBox.fillRoundedRect(cx - 130, cy + 72, 260, 36, 8);
    this.add.text(cx, cy + 90, 'Jugar con otra región', {
      fontFamily: 'Poppins, sans-serif', fontSize: '14px',
      fontStyle: 'bold', color: '#412402'
    }).setOrigin(0.5).setDepth(63);

    btnBox.on('pointerup', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.time.delayedCall(400, () => this.scene.start('Escena1'));
    });
    btnBox.on('pointerover', () => this.input.setDefaultCursor('pointer'));
    btnBox.on('pointerout',  () => this.input.setDefaultCursor('default'));

    // Botón reintentar
    const btnRtry = this.add.graphics().setDepth(62).setInteractive(
      new Phaser.Geom.Rectangle(cx - 130, cy + 118, 260, 32), Phaser.Geom.Rectangle.Contains
    );
    btnRtry.fillStyle(0x1a2d5a, 1);
    btnRtry.fillRoundedRect(cx - 130, cy + 118, 260, 32, 8);
    btnRtry.lineStyle(0.5, 0x4a7adf, 1);
    btnRtry.strokeRoundedRect(cx - 130, cy + 118, 260, 32, 8);
    this.add.text(cx, cy + 134, 'Intentar de nuevo', {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#7ab0ff'
    }).setOrigin(0.5).setDepth(63);

    btnRtry.on('pointerup', () => {
      ov.destroy(); box.destroy();
      this.children.list
        .filter(c => c.depth >= 60)
        .forEach(c => c.destroy());
      this.winShown = false;
      this.reiniciarMapa();
    });
    btnRtry.on('pointerover', () => this.input.setDefaultCursor('pointer'));
    btnRtry.on('pointerout',  () => this.input.setDefaultCursor('default'));
  }

  update() {}
}
