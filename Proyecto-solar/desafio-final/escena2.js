// ============================================================
// ESCENA 2 — Mapa isométrico: construye tu central solar
// ============================================================

class Escena2 extends Phaser.Scene {
  constructor() {
    super({ key: 'Escena2' });
  }

  init(data) {
    this.regionElegida = data.region || 'norte';
  }

  preload() {
    this.load.image('cielo_norte',    'assets/Cielo_norte.png');
    this.load.image('cielo_centro',   'assets/Cielo_centro.png');
    this.load.image('cielo_sur',      'assets/Cielo_sur.png');
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

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // ── Datos por región ──────────────────────────────────
    const DATOS = {
      norte:  { rad: 950, panelKwh: 15, nombre: 'Zona Norte',  cielo: 'cielo_norte'  },
      centro: { rad: 600, panelKwh: 10, nombre: 'Zona Centro', cielo: 'cielo_centro' },
      sur:    { rad: 320, panelKwh:  6, nombre: 'Zona Sur',    cielo: 'cielo_sur'    },
    };
    this.reg        = DATOS[this.regionElegida];
    this.energia    = 0;
    this.META       = 80;
    this.BAT_KWH    = 10;
    this.casasLit   = 0;
    this.winShown   = false;

    // ── Dimensiones del tile isométrico ───────────────────
    this.TW = 144;   // ancho visual del rombo
    this.TH = 72;    // alto visual del rombo
    this.COLS = 6;
    this.ROWS = 4;

    // Origen del grid — ajusta estos dos números para mover el mapa
    this.OX = 430;
    this.OY = 290;

    // ── Fondo ─────────────────────────────────────────────
    this.add.image(W / 2, H / 2, this.reg.cielo)
      .setDisplaySize(W, H).setDepth(0);

    // Suelo
    this.add.graphics().setDepth(1)
      .fillStyle(0x3d6b35, 1)
      .fillRect(0, H - 70, W, 70);

    // ── Título ────────────────────────────────────────────
    this.add.text(W / 2, 18,
      `CONSTRUYE TU CENTRAL SOLAR — ${this.reg.nombre}`, {
      fontFamily: 'Bebas Neue, sans-serif', fontSize: '17px',
      fontStyle: 'bold', color: '#000000'
    }).setOrigin(0.5).setDepth(10);

    // ── Grid isométrico ───────────────────────────────────
    this.tiles = [];
    this._dibujarGrid();

    // ── Casas ─────────────────────────────────────────────
    this.casas = [];
    [{ x: 1100, y: 500 }, { x: 1100, y: 400 }, { x: 1000, y: 400 }]
      .forEach(pos => {
        this.casas.push(
          this.add.image(pos.x, pos.y, 'casa_apagada')
            .setScale(0.1).setDepth(15)
        );
      });

    // ── Panel inventario izquierdo ─────────────────────────
    this.add.graphics().setDepth(20)
      .fillStyle(0x0d1b3e, 0.9)
      .fillRoundedRect(8, 50, 120, 340, 10)
      .lineStyle(1, 0x4a7adf, 0.8)
      .strokeRoundedRect(8, 50, 120, 340, 10);

    this.add.text(68, 67, 'INVENTARIO', {
      fontFamily: 'Bebas Neue, sans-serif', fontSize: '9px', color: '#7ab0ff'
    }).setOrigin(0.5).setDepth(21);

    // Items arrastrables
    this._crearItem(68, 155, 'panel_solar', 'PANEL SOLAR',
      `+${this.reg.panelKwh} kWh`, 0.18, 'panel');
    this._crearItem(68, 305, 'battery', 'BATERÍA',
      `+${this.BAT_KWH} kWh`, 0.18, 'battery');

    // ── Panel info derecho ────────────────────────────────
    this.add.graphics().setDepth(20)
      .fillStyle(0x0d1b3e, 0.9)
      .fillRoundedRect(W - 180, 50, 170, 280, 10)
      .lineStyle(1, 0x4a7adf, 0.8)
      .strokeRoundedRect(W - 180, 50, 170, 280, 10);

    this.add.text(W - 95, 68, 'ENERGÍA', {
      fontFamily: 'Bebas Neue, sans-serif', fontSize: '10px', color: '#7ab0ff'
    }).setOrigin(0.5).setDepth(21);

    // Barra fondo
    this.add.graphics().setDepth(21)
      .fillStyle(0x1a2d5a, 1)
      .fillRoundedRect(W - 170, 84, 145, 16, 4);

    this.barraG = this.add.graphics().setDepth(22);
    this.txtKwh = this.add.text(W - 95, 107, '0 / 80 kWh', {
      fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#fff'
    }).setOrigin(0.5).setDepth(22);

    this.add.text(W - 95, 130, 'Radiación solar:', {
      fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#aac4ff'
    }).setOrigin(0.5).setDepth(21);
    this.add.text(W - 95, 150, `${this.reg.rad} W/m²`, {
      fontFamily: 'Poppins, sans-serif', fontSize: '20px',
      fontStyle: 'bold', color: '#EF9F27'
    }).setOrigin(0.5).setDepth(21);

    this.add.text(W - 95, 182, 'Casas abastecidas:', {
      fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#aac4ff'
    }).setOrigin(0.5).setDepth(21);
    this.txtCasas = this.add.text(W - 95, 206, '0 / 3', {
      fontFamily: 'Poppins, sans-serif', fontSize: '26px',
      fontStyle: 'bold', color: '#fff'
    }).setOrigin(0.5).setDepth(21);

    this.add.text(W - 95, 242, 'Meta: 80 kWh / día', {
      fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#fff'
    }).setOrigin(0.5).setDepth(21);

    // Botón reiniciar
    this._boton(W - 95, 284, 'Reiniciar mapa', () => this._reiniciar());

    // ── Panelín ───────────────────────────────────────────
    this.panelinImg = this.add.image(72, H - 80, 'panelin_1')
      .setScale(0.04).setDepth(30);
    this.bubbleBg  = this.add.graphics().setDepth(29);
    this.bubbleTxt = this.add.text(0, 0, '', {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px',
      color: '#412402', wordWrap: { width: 320 }, lineSpacing: 3
    }).setDepth(30);

    this._mensaje('panelin_1',
      `¡Hola! Estás en el ${this.reg.nombre}. Arrastra paneles y baterías al mapa para abastecer las 3 casas. ¡Recuerda no instalar de más!`);

    this._actualizarBarra();
  }

  // ── Dibuja el grid isométrico en código ─────────────────
  _dibujarGrid() {
    const TW = this.TW, TH = this.TH;
    const OX = this.OX, OY = this.OY;

    for (let row = 0; row < this.ROWS; row++) {
      for (let col = 0; col < this.COLS; col++) {
        const tx = OX + (col - row) * TW / 2;
        const ty = OY + (col + row) * TH / 2;

        const colorBase = (row + col) % 2 === 0 ? 0x3a7d44 : 0x2a6535;
        const g = this.add.graphics().setDepth(3 + row + col);
        this._relleno(g, tx, ty, colorBase);

        g.worldX    = tx;
        g.worldY    = ty;
        g.occupied  = false;
        g.itemType  = null;
        g.itemImg   = null;
        g.colorBase = colorBase;
        g.row = row; g.col = col;

        g.setInteractive(
          new Phaser.Geom.Polygon([
            tx,        ty - TH / 2,
            tx + TW/2, ty,
            tx,        ty + TH / 2,
            tx - TW/2, ty
          ]),
          Phaser.Geom.Polygon.Contains
        );

        g.on('pointerover', () => {
          if (!g.occupied) this._relleno(g, tx, ty, 0x5ab86a);
        });
        g.on('pointerout', () => {
          if (!g.occupied) this._relleno(g, tx, ty, g.colorBase);
        });

        this.tiles.push(g);
      }
    }
  }

  // ── Dibuja un rombo isométrico en un graphics ────────────
  _relleno(g, tx, ty, color) {
    const TW = this.TW, TH = this.TH;
    g.clear();
    g.fillStyle(color, 1);
    g.fillPoints([
      { x: tx,        y: ty - TH / 2 },
      { x: tx + TW/2, y: ty           },
      { x: tx,        y: ty + TH / 2 },
      { x: tx - TW/2, y: ty           },
    ], true);
    g.lineStyle(0.8, 0x1a4a25, 0.5);
    g.strokePoints([
      { x: tx,        y: ty - TH / 2 },
      { x: tx + TW/2, y: ty           },
      { x: tx,        y: ty + TH / 2 },
      { x: tx - TW/2, y: ty           },
    ], true);
  }

  // ── Crea un item arrastrable en el inventario ────────────
  _crearItem(x, y, texture, label, bonus, escala, tipo) {
    const img = this.add.image(x, y, texture)
      .setScale(escala).setDepth(25)
      .setInteractive({ draggable: true });

    img.itemType  = tipo;
    img.baseX     = x;
    img.baseY     = y;
    img.escala    = escala;

    this.add.text(x, y + 44, label, {
      fontFamily: 'Poppins, sans-serif', fontSize: '9px',
      color: '#fff', align: 'center'
    }).setOrigin(0.5).setDepth(25);

    this.add.text(x, y + 58, bonus, {
      fontFamily: 'Nunito, sans-serif', fontSize: '10px',
      color: '#EF9F27', align: 'center'
    }).setOrigin(0.5).setDepth(25);

    this.input.setDraggable(img);

    img.on('dragstart', () => {
      img.setScale(escala * 1.1).setDepth(50);
    });
    img.on('drag', (ptr, dx, dy) => {
      img.x = dx; img.y = dy;
    });
    img.on('dragend', (ptr) => {
      img.setScale(escala).setDepth(25);
      const tile = this._tileCercano(ptr.x, ptr.y);
      if (tile && !tile.occupied) {
        this._colocar(tile, img.itemType);
        img.x = img.baseX;
        img.y = img.baseY;
      } else {
        this.tweens.add({
          targets: img, x: img.baseX, y: img.baseY,
          duration: 200, ease: 'Back.Out'
        });
        if (tile && tile.occupied)
          this._mensaje('panelin_3', '¡Esa casilla ya tiene algo! Elige una casilla vacía.');
      }
    });
  }

  // ── Coloca un item en un tile ────────────────────────────
  _colocar(tile, tipo) {
    tile.occupied = true;
    tile.itemType = tipo;

    // Tile ocupado en color oscuro
    this._relleno(tile, tile.worldX, tile.worldY, 0x1a4a25);

    const esc  = tipo === 'panel' ? 0.17 : 0.17;
    const tex  = tipo === 'panel' ? 'panel_solar' : 'battery';
    const offY = tipo === 'panel' ? -50 : -42;

    const it = this.add.image(tile.worldX, tile.worldY + offY, tex)
      .setScale(esc)
      .setDepth(tile.depth + 2);

    it.setAlpha(0).setScale(esc * 0.5);
    this.tweens.add({ targets: it, alpha: 1, scale: esc, duration: 220, ease: 'Back.Out' });
    tile.itemImg = it;

    const kwh = tipo === 'panel' ? this.reg.panelKwh : this.BAT_KWH;
    this.energia += kwh;
    this._actualizarBarra();
    this._actualizarCasas();
    this._checkExceso();
  }

  // ── Tile más cercano al puntero ──────────────────────────
  _tileCercano(px, py) {
    let best = null, dist = 60;
    for (const t of this.tiles) {
      const d = Phaser.Math.Distance.Between(px, py, t.worldX, t.worldY);
      if (d < dist) { dist = d; best = t; }
    }
    return best;
  }

  // ── Actualiza barra de energía ───────────────────────────
  _actualizarBarra() {
    const W   = this.scale.width;
    const pct = Math.min(1, this.energia / this.META);
    const col = pct < 0.4 ? 0xE24B4A : pct < 0.8 ? 0xEF9F27 : 0x1D9E75;
    this.barraG.clear()
      .fillStyle(col, 1)
      .fillRoundedRect(W - 170, 84, Math.round(145 * pct), 16, 4);
    this.txtKwh.setText(`${this.energia} / ${this.META} kWh`);
  }

  // ── Actualiza casas encendidas ───────────────────────────
  _actualizarCasas() {
    const n = Math.min(3, Math.floor((this.energia / this.META) * 3));
    if (n === this.casasLit) return;
    this.casasLit = n;
    this.casas.forEach((c, i) => {
      const enc = i < n;
      c.setTexture(enc ? 'casa_encendida' : 'casa_apagada');
      if (enc) this.tweens.add({
        targets: c, scaleX: c.scaleX * 1.08, scaleY: c.scaleY * 1.08,
        duration: 140, yoyo: true
      });
    });
    this.txtCasas.setText(`${n} / 3`)
      .setColor(n === 3 ? '#1D9E75' : '#ffffff');

    if (n === 1) this._mensaje('panelin_2', '¡Primera casa con luz! Sigue instalando para abastecer las demás.');
    else if (n === 2) this._mensaje('panelin_5', '¡Dos casas encendidas! Ya casi. Solo falta una más.');
    else if (n === 3 && !this.winShown) this.time.delayedCall(400, () => this._victoria());
  }

  // ── Revisa exceso de instalación ─────────────────────────
  _checkExceso() {
    const ex = this.energia - this.META;
    if (ex > 50)
      this._mensaje('panelin_3', `¡Demasiado! Generas ${this.energia} kWh pero la ciudad solo necesita ${this.META}. ¡Estás desperdiciando!`);
    else if (ex > 25)
      this._mensaje('panelin_4', `Estás generando ${this.energia} kWh, más de los ${this.META} que necesitas. Considera si realmente hace falta.`);
  }

  // ── Muestra mensaje de Panelín ───────────────────────────
  _mensaje(pose, txt) {
    const H = this.scale.height;
    this.panelinImg.setTexture(pose);
    this.bubbleBg.clear()
      .fillStyle(0xFAEEDA, 0.97)
      .fillRoundedRect(130, H - 152, 370, 72, 8)
      .lineStyle(0.5, 0xEF9F27, 1)
      .strokeRoundedRect(130, H - 152, 370, 72, 8);
    this.bubbleTxt.setText(txt).setPosition(144, H - 144);
  }

  // ── Crea botón simple ─────────────────────────────────────
  _boton(cx, cy, label, cb) {
    const W2 = 145, H2 = 28;
    const g = this.add.graphics().setDepth(21).setInteractive(
      new Phaser.Geom.Rectangle(cx - W2/2, cy - H2/2, W2, H2),
      Phaser.Geom.Rectangle.Contains
    );
    g.fillStyle(0x1a2d5a, 1).fillRoundedRect(cx - W2/2, cy - H2/2, W2, H2, 6)
      .lineStyle(0.5, 0x4a7adf, 1).strokeRoundedRect(cx - W2/2, cy - H2/2, W2, H2, 6);
    this.add.text(cx, cy, label, {
      fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#7ab0ff'
    }).setOrigin(0.5).setDepth(22);
    g.on('pointerup', cb);
    g.on('pointerover', () => this.input.setDefaultCursor('pointer'));
    g.on('pointerout',  () => this.input.setDefaultCursor('default'));
  }

  // ── Reinicia el mapa ──────────────────────────────────────
  _reiniciar() {
    this.tiles.forEach(t => {
      if (t.occupied) {
        if (t.itemImg) t.itemImg.destroy();
        t.occupied = false; t.itemType = null; t.itemImg = null;
        this._relleno(t, t.worldX, t.worldY, t.colorBase);
      }
    });
    this.energia = 0; this.casasLit = 0; this.winShown = false;
    this.casas.forEach(c => c.setTexture('casa_apagada').setScale(0.1));
    this.txtCasas.setText('0 / 3').setColor('#ffffff');
    this._actualizarBarra();
    this._mensaje('panelin_1', '¡Mapa reiniciado! Vuelve a intentarlo. Recuerda instalar lo justo para las 3 casas.');
  }

  // ── Pantalla de victoria ──────────────────────────────────
  _victoria() {
    if (this.winShown) return;
    this.winShown = true;
    const W = this.scale.width, H = this.scale.height;
    const paneles  = this.tiles.filter(t => t.itemType === 'panel').length;
    const baterias = this.tiles.filter(t => t.itemType === 'battery').length;
    const total    = paneles + baterias;
    const stars    = total <= 5 ? '★★★' : total <= 8 ? '★★☆' : '★☆☆';
    const badge    = total <= 5 ? '¡Ingeniero Solar Experto!' : total <= 8 ? 'Ingeniero Solar Junior' : 'Aprendiz Solar';

    this._mensaje('panelin_5', `¡Increíble! Usaste ${paneles} paneles y ${baterias} baterías. ¡Tu ciudad tiene luz!`);

    const ov = this.add.graphics().setDepth(60).fillStyle(0x000000, 0.65).fillRect(0,0,W,H);
    const cx = W/2, cy = H/2;

    this.add.graphics().setDepth(61)
      .fillStyle(0x0d1b3e, 0.98).fillRoundedRect(cx-200, cy-160, 400, 320, 14)
      .lineStyle(2, 0xEF9F27, 1).strokeRoundedRect(cx-200, cy-160, 400, 320, 14);

    this.add.text(cx, cy-118, '⚡', { fontSize:'44px' }).setOrigin(0.5).setDepth(62);
    this.add.text(cx, cy-68, '¡Ciudad abastecida!', {
      fontFamily:'Poppins,sans-serif', fontSize:'22px', fontStyle:'bold', color:'#EF9F27'
    }).setOrigin(0.5).setDepth(62);
    this.add.text(cx, cy-30, stars, { fontSize:'30px', color:'#EF9F27' }).setOrigin(0.5).setDepth(62);
    this.add.text(cx, cy+4, badge, {
      fontFamily:'Poppins,sans-serif', fontSize:'15px', color:'#fff'
    }).setOrigin(0.5).setDepth(62);
    this.add.text(cx, cy+36, `${paneles} paneles + ${baterias} baterías = ${this.energia} kWh`, {
      fontFamily:'Nunito,sans-serif', fontSize:'13px', color:'#aac4ff'
    }).setOrigin(0.5).setDepth(62);

    // Botón volver
    const btnV = this.add.graphics().setDepth(62).setInteractive(
      new Phaser.Geom.Rectangle(cx-130, cy+68, 260, 36), Phaser.Geom.Rectangle.Contains);
    btnV.fillStyle(0xEF9F27,1).fillRoundedRect(cx-130, cy+68, 260, 36, 8);
    this.add.text(cx, cy+86, 'Jugar con otra región', {
      fontFamily:'Poppins,sans-serif', fontSize:'14px', fontStyle:'bold', color:'#412402'
    }).setOrigin(0.5).setDepth(63);
    btnV.on('pointerup', () => {
      this.cameras.main.fadeOut(400,0,0,0);
      this.time.delayedCall(400, () => window.location.href = 'index.html');
    });
    btnV.on('pointerover', () => this.input.setDefaultCursor('pointer'));
    btnV.on('pointerout',  () => this.input.setDefaultCursor('default'));

    // Botón reintentar
    const btnR = this.add.graphics().setDepth(62).setInteractive(
      new Phaser.Geom.Rectangle(cx-130, cy+114, 260, 32), Phaser.Geom.Rectangle.Contains);
    btnR.fillStyle(0x1a2d5a,1).fillRoundedRect(cx-130, cy+114, 260, 32, 8)
      .lineStyle(0.5,0x4a7adf,1).strokeRoundedRect(cx-130, cy+114, 260, 32, 8);
    this.add.text(cx, cy+130, 'Intentar de nuevo', {
      fontFamily:'Nunito,sans-serif', fontSize:'13px', color:'#7ab0ff'
    }).setOrigin(0.5).setDepth(63);
    btnR.on('pointerup', () => {
      [ov, btnV, btnR].forEach(o => o.destroy());
      this.children.list.filter(c => c.depth >= 61).forEach(c => c.destroy());
      this.winShown = false;
      this._reiniciar();
    });
    btnR.on('pointerover', () => this.input.setDefaultCursor('pointer'));
    btnR.on('pointerout',  () => this.input.setDefaultCursor('default'));
  }

  update() {}
}
