// ============================================================
// ESCENA 2 — Mapa isométrico — Estética Módulos (naranja/azul)
// ============================================================

class Escena2 extends Phaser.Scene {
  constructor() { super({ key: 'Escena2' }); }

  init(data) { this.regionElegida = data.region || 'norte'; }

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

    // Paleta módulos
    // Azul oscuro títulos: 0x01579B
    // Naranja: 0xFF8F00
    // Amarillo claro: 0xFFD54F
    // Fondo panel: 0xFFFFFF con borde 0xFFD54F
    // Texto oscuro: 0x333333
    // Texto azul: 0x01579B

    const DATOS = {
      norte:  { rad: 950, panelKwh: 15, nombre: 'Zona Norte',  cielo: 'cielo_norte'  },
      centro: { rad: 600, panelKwh: 10, nombre: 'Zona Centro', cielo: 'cielo_centro' },
      sur:    { rad: 320, panelKwh:  6, nombre: 'Zona Sur',    cielo: 'cielo_sur'    },
    };

    this.reg      = DATOS[this.regionElegida];
    this.energia  = 0;
    this.META     = 80;
    this.BAT_KWH  = 10;
    this.casasLit = 0;
    this.winShown = false;

    this.TW   = 144;
    this.TH   = 72;
    this.COLS = 6;
    this.ROWS = 4;
    this.OX   = 700;
    this.OY   = 400;

    // ── Fondo cielo ────────────────────────────────

    this.add.image(W / 2, H / 2, this.reg.cielo)
    .setDisplaySize(W * 1.36, H * 1.45).setDepth(0);gi

    // Suelo verde natural
    this.add.graphics().setDepth(1)
      .fillStyle(0x3d6b35, 1)
      .fillRect(0, H - 70, W, 70);

    // ── Franja lateral izquierda (estética módulos) ─
    this.add.graphics().setDepth(200)
      .fillStyle(0xFFD54F, 1).fillRect(0, 0, 10, H * 0.5)
      .fillStyle(0xFF8F00, 1).fillRect(0, H * 0.5, 10, H * 0.5);

    // ── Título ──────────────────────────────────────
    // Fondo blanco semitransparente detrás del título
    this.add.graphics().setDepth(9)
      .fillStyle(0xFFFFFF, 0.7)
      .fillRect(10, 0, W - 10, 38);

    this.add.text(W / 2, 12,
      `CONSTRUYE TU CENTRAL SOLAR — ${this.reg.nombre}`, {
      fontFamily: 'Bebas Neue, sans-serif',
      fontSize: '20px',
      color: '#01579B',
      letterSpacing: 2
    }).setOrigin(0.5, 0).setDepth(10);

    // Línea naranja bajo el título
    this.add.graphics().setDepth(10)
      .fillStyle(0xFF8F00, 1)
      .fillRect(10, 36, W - 10, 3);

    // ── Grid isométrico ─────────────────────────────
    this.tiles = [];
    this._dibujarGrid();

    // ── Casas ───────────────────────────────────────
    this.casas = [];
    [{ x: W - 130, y: H * 0.80 }, 
      { x: W - 80, y: H * 0.65 }, 
      { x: W - 200, y: H * 0.65 }]
      .forEach(pos => {
        this.casas.push(
          this.add.image(pos.x, pos.y, 'casa_apagada')
            .setScale(0.1).setDepth(15)
        );
      });

    // ── Panel inventario izquierdo ──────────────────
    // Fondo blanco con borde amarillo (estética módulos)
    this.add.graphics().setDepth(20)
      .fillStyle(0xFFFFFF, 0.92)
      .fillRoundedRect(100, 46, 188, 360, 14)
      .lineStyle(3, 0xFFD54F, 1)
      .strokeRoundedRect(100, 46, 188, 360, 14);

    // Acento naranja arriba del panel
    this.add.graphics().setDepth(21)
      .fillStyle(0xFF8F00, 1)
      .fillRoundedRect(100, 46, 188, 26, { tl: 14, tr: 14, bl: 0, br: 0 });

    this.add.text(195, 62, 'INVENTARIO', {
      fontFamily: 'Bebas Neue, sans-serif',
      fontSize: '14px',
      color: '#01579B',
      letterSpacing: 2
    }).setOrigin(0.5).setDepth(22);

    this._crearItem(195, 155, 'panel_solar', 'PANEL SOLAR',
      `+${this.reg.panelKwh} kWh`, 0.18, 'panel');
    this._crearItem(195, 300, 'battery', 'BATERÍA',
      `+${this.BAT_KWH} kWh`, 0.18, 'battery');

    // ── Panel info derecho ──────────────────────────
    this.add.graphics().setDepth(20)
      .fillStyle(0xFFFFFF, 0.92)
      .fillRoundedRect(W - 240, 46, 188, 310, 14)
      .lineStyle(3, 0xFFD54F, 1)
      .strokeRoundedRect(W - 240, 46, 188, 310, 14);

    this.add.graphics().setDepth(21)
      .fillStyle(0xFF8F00, 1)
      .fillRoundedRect(W - 240, 46, 188, 26, { tl: 14, tr: 14, bl: 0, br: 0 });

    this.add.text(W - 140, 62, 'ENERGÍA', {
      fontFamily: 'Bebas Neue, sans-serif',
      fontSize: '14px',
      color: '#01579B',
      letterSpacing: 2
    }).setOrigin(0.5).setDepth(22);

    // Barra fondo gris suave
    this.add.graphics().setDepth(21)
      .fillStyle(0xEEEEEE, 1)
      .fillRoundedRect(W - 210, 82, 140, 18, 9);

    this.barraG  = this.add.graphics().setDepth(22);
    this.txtKwh  = this.add.text(W - 140, 110, '0 / 80 kWh', {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#333333'
    }).setOrigin(0.5).setDepth(22);

    this.add.text(W - 140, 134, 'Radiación solar:', {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#888888'
    }).setOrigin(0.5).setDepth(22);

    this.add.text(W - 140, 158, `${this.reg.rad} W/m²`, {
      fontFamily: 'Bebas Neue, sans-serif',
      fontSize: '26px',
      color: '#FF8F00'
    }).setOrigin(0.5).setDepth(22);

    this.add.text(W - 140, 192, 'Casas abastecidas:', {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#888888'
    }).setOrigin(0.5).setDepth(22);

    this.txtCasas = this.add.text(W - 140, 220, '0 / 3', {
      fontFamily: 'Bebas Neue, sans-serif',
      fontSize: '32px',
      color: '#01579B'
    }).setOrigin(0.5).setDepth(22);

    this.add.text(W - 140, 256, 'Meta: 80 kWh / día', {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px',
      fontStyle: 'bold', color: '#555555'
    }).setOrigin(0.5).setDepth(22);

    // Botón reiniciar estilo módulos
    this._boton(W - 140, 282, 'Reiniciar mapa', () => this._reiniciar());

    // ── Panelín ─────────────────────────────────────
    // era 0.055, achicamos
    this.panelinImg = this.add.image(120, H - 100, 'panelin_1')
    .setScale(0.042).setDepth(30);
    this.bubbleBg   = this.add.graphics().setDepth(29);
    this.bubbleTxt  = this.add.text(0, 0, '', {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#424242',
      wordWrap: { width: 420 },
      lineSpacing: 5
    }).setDepth(30);

    this._mensaje('panelin_1',
      `¡Hola! Estás en el ${this.reg.nombre}. Arrastra paneles y baterías al mapa para abastecer las 3 casas.`);

    this._actualizarBarra();
  }

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

        g.worldX   = tx; g.worldY   = ty;
        g.occupied = false; g.itemType = null; g.itemImg = null;
        g.colorBase = colorBase; g.row = row; g.col = col;

        g.setInteractive(
          new Phaser.Geom.Polygon([
            tx, ty - TH / 2, tx + TW/2, ty, tx, ty + TH / 2, tx - TW/2, ty
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

  _relleno(g, tx, ty, color) {
    const TW = this.TW, TH = this.TH;
    g.clear();
    g.fillStyle(color, 1);
    g.fillPoints([
      { x: tx, y: ty - TH/2 }, { x: tx + TW/2, y: ty },
      { x: tx, y: ty + TH/2 }, { x: tx - TW/2, y: ty }
    ], true);
    g.lineStyle(0.8, 0x1a4a25, 0.5);
    g.strokePoints([
      { x: tx, y: ty - TH/2 }, { x: tx + TW/2, y: ty },
      { x: tx, y: ty + TH/2 }, { x: tx - TW/2, y: ty }
    ], true);
  }

  _crearItem(x, y, texture, label, bonus, escala, tipo) {
    // Fondo del item con estética módulos
    this.add.graphics().setDepth(23)
      .fillStyle(0xFFF8E1, 0.9)
      .fillRoundedRect(x - 48, y - 52, 96, 96, 10)
      .lineStyle(2, 0xFFD54F, 1)
      .strokeRoundedRect(x - 48, y - 52, 96, 96, 10);

    const img = this.add.image(x, y - 10, texture)
      .setScale(escala).setDepth(25)
      .setInteractive({ draggable: true });

    img.itemType = tipo; img.baseX = x; img.baseY = y; img.escala = escala;

    this.add.text(x, y + 40, label, {
      fontFamily: 'Bebas Neue, sans-serif',
      fontSize: '10px', color: '#01579B', align: 'center', letterSpacing: 1
    }).setOrigin(0.5).setDepth(25);

    this.add.text(x, y + 55, bonus, {
      fontFamily: 'Nunito, sans-serif', fontSize: '11px',
      fontStyle: 'bold', color: '#FF8F00', align: 'center'
    }).setOrigin(0.5).setDepth(25);

    this.input.setDraggable(img);

    img.on('dragstart', () => img.setScale(escala * 1.1).setDepth(50));
    img.on('drag', (ptr, dx, dy) => { img.x = dx; img.y = dy; });
    img.on('dragend', (ptr) => {
      img.setScale(escala).setDepth(25);
      const tile = this._tileCercano(ptr.x, ptr.y);
      if (tile && !tile.occupied) {
        this._colocar(tile, img.itemType);
        img.x = img.baseX; img.y = img.baseY;
      } else {
        this.tweens.add({
          targets: img, x: img.baseX, y: img.baseY, duration: 200, ease: 'Back.Out'
        });
        if (tile && tile.occupied)
          this._mensaje('panelin_3', '¡Esa casilla ya tiene algo! Elige una casilla vacía.');
      }
    });
  }

  _colocar(tile, tipo) {
    tile.occupied = true; tile.itemType = tipo;
    this._relleno(tile, tile.worldX, tile.worldY, 0x1a4a25);

    const esc  = 0.17;
    const tex  = tipo === 'panel' ? 'panel_solar' : 'battery';
    const offY = tipo === 'panel' ? -50 : -42;

    const it = this.add.image(tile.worldX, tile.worldY + offY, tex)
      .setScale(esc).setDepth(tile.depth + 2).setAlpha(0).setScale(esc * 0.5);

    this.tweens.add({ targets: it, alpha: 1, scale: esc, duration: 220, ease: 'Back.Out' });
    tile.itemImg = it;

    this.energia += tipo === 'panel' ? this.reg.panelKwh : this.BAT_KWH;
    this._actualizarBarra();
    this._actualizarCasas();
    this._checkExceso();
  }

  _tileCercano(px, py) {
    let best = null, dist = 60;
    for (const t of this.tiles) {
      const d = Phaser.Math.Distance.Between(px, py, t.worldX, t.worldY);
      if (d < dist) { dist = d; best = t; }
    }
    return best;
  }

  _actualizarBarra() {
    const W   = this.scale.width;
    const pct = Math.min(1, this.energia / this.META);
    // Colores: rojo → naranja → verde (mismo sistema visual)
    const col = pct < 0.4 ? 0xE24B4A : pct < 0.8 ? 0xFF8F00 : 0x2E7D32;
    this.barraG.clear()
      .fillStyle(col, 1)
      .fillRoundedRect(W - 168, 82, Math.round(140 * pct), 16, 8);
    this.txtKwh.setText(`${this.energia} / ${this.META} kWh`);
  }

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
      .setColor(n === 3 ? '#2E7D32' : '#01579B');

    if (n === 1) this._mensaje('panelin_2', '¡Primera casa con luz! Sigue instalando para abastecer las demás.');
    else if (n === 2) this._mensaje('panelin_5', '¡Dos casas encendidas! Ya casi. Solo falta una más.');
    else if (n === 3 && !this.winShown) this.time.delayedCall(400, () => this._victoria());
  }

  _checkExceso() {
    const ex = this.energia - this.META;
    if (ex > 50)
      this._mensaje('panelin_3', `¡Demasiado! Generas ${this.energia} kWh pero la ciudad solo necesita ${this.META}. ¡Estás desperdiciando!`);
    else if (ex > 25)
      this._mensaje('panelin_4', `Estás generando ${this.energia} kWh, más de los ${this.META} que necesitas.`);
  }

  _mensaje(pose, txt) {
    const H = this.scale.height;
    this.panelinImg.setTexture(pose);
    this.bubbleBg.clear()
      .fillStyle(0xFFD54F, 1)
      .fillRoundedRect(208, H - 190, 280, 110, 18)
      .lineStyle(3, 0xFF8F00, 1)
      .strokeRoundedRect(208, H - 190, 280, 110, 18);
    this.bubbleBg
      .fillStyle(0xFF8F00, 1)
      .fillTriangle(208, H - 120, 85, H - 100, 108, H - 100)
      .fillStyle(0xFFD54F, 1)
      .fillTriangle(210, H - 122, 90, H - 102, 110, H - 102);

    this.bubbleTxt.setWordWrapWidth(255).setText(txt).setPosition(216, H - 182);
}

  _boton(cx, cy, label, cb) {
    const W2 = 140, H2 = 30;
    // Estilo botón módulos: naranja con texto blanco
    const g = this.add.graphics().setDepth(22).setInteractive(
      new Phaser.Geom.Rectangle(cx - W2/2, cy - H2/2, W2, H2),
      Phaser.Geom.Rectangle.Contains
    );
    g.fillStyle(0xFF8F00, 1)
      .fillRoundedRect(cx - W2/2, cy - H2/2, W2, H2, 50)
      .lineStyle(0, 0xFF8F00, 0);

    this.add.text(cx, cy, label, {
      fontFamily: 'Bebas Neue, sans-serif',
      fontSize: '13px',
      color: '#ffffff',
      letterSpacing: 1
    }).setOrigin(0.5).setDepth(23);

    g.on('pointerup', cb);
    g.on('pointerover', () => {
      g.clear().fillStyle(0xF57C00, 1).fillRoundedRect(cx - W2/2, cy - H2/2, W2, H2, 50);
      this.input.setDefaultCursor('pointer');
    });
    g.on('pointerout', () => {
      g.clear().fillStyle(0xFF8F00, 1).fillRoundedRect(cx - W2/2, cy - H2/2, W2, H2, 50);
      this.input.setDefaultCursor('default');
    });
  }

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
    this.txtCasas.setText('0 / 3').setColor('#01579B');
    this._actualizarBarra();
    this._mensaje('panelin_1', '¡Mapa reiniciado! Vuelve a intentarlo. Instala lo justo para las 3 casas.');
  }

  _victoria() {
    if (this.winShown) return;
    this.winShown = true;

    // Guardar copa
    localStorage.setItem('copa_desafio', 'true');
    const actual = parseInt(localStorage.getItem('modulos_desbloqueados') || '1');
    if (actual < 5) localStorage.setItem('modulos_desbloqueados', '5');

    const W = this.scale.width, H = this.scale.height;
    const paneles  = this.tiles.filter(t => t.itemType === 'panel').length;
    const baterias = this.tiles.filter(t => t.itemType === 'battery').length;
    const total    = paneles + baterias;
    const stars    = total <= 5 ? '★★★' : total <= 8 ? '★★☆' : '★☆☆';
    const badge    = total <= 5 ? '¡Ingeniero Solar Experto!' : total <= 8 ? 'Ingeniero Solar Junior' : 'Aprendiz Solar';

    this._mensaje('panelin_5', `¡Increíble! Usaste ${paneles} paneles y ${baterias} baterías. ¡Tu ciudad tiene luz!`);

    // Overlay semitransparente
    this.add.graphics().setDepth(60)
      .fillStyle(0xFFFFFF, 0.75)
      .fillRect(0, 0, W, H);

    const cx = W/2, cy = H/2;

    // Tarjeta victoria estilo módulos
    this.add.graphics().setDepth(61)
      .fillStyle(0xFFFFFF, 1)
      .fillRoundedRect(cx - 210, cy - 170, 420, 340, 24)
      .lineStyle(4, 0xFFD54F, 1)
      .strokeRoundedRect(cx - 210, cy - 170, 420, 340, 24);

    // Barra naranja arriba de la tarjeta
    this.add.graphics().setDepth(62)
      .fillStyle(0xFF8F00, 1)
      .fillRoundedRect(cx - 210, cy - 170, 420, 8,
        { tl: 24, tr: 24, bl: 0, br: 0 });

    this.add.text(cx, cy - 132, '⚡', { fontSize: '48px' })
      .setOrigin(0.5).setDepth(62);

    this.add.text(cx, cy - 78, '¡Ciudad abastecida!', {
      fontFamily: 'Bebas Neue, sans-serif',
      fontSize: '28px', color: '#01579B', letterSpacing: 2
    }).setOrigin(0.5).setDepth(62);

    this.add.text(cx, cy - 42, stars, {
      fontSize: '32px', color: '#FF8F00'
    }).setOrigin(0.5).setDepth(62);

    this.add.text(cx, cy - 10, badge, {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '16px', fontStyle: 'bold', color: '#333333'
    }).setOrigin(0.5).setDepth(62);

    this.add.text(cx, cy + 22,
      `${paneles} paneles + ${baterias} baterías = ${this.energia} kWh`, {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#888888'
    }).setOrigin(0.5).setDepth(62);

    // Botón "Jugar con otra región" — naranja
    const btnV = this.add.graphics().setDepth(62).setInteractive(
      new Phaser.Geom.Rectangle(cx - 140, cy + 60, 280, 44),
      Phaser.Geom.Rectangle.Contains
    );
    btnV.fillStyle(0xFF8F00, 1).fillRoundedRect(cx - 140, cy + 60, 280, 44, 50);
    this.add.text(cx, cy + 82, 'JUGAR CON OTRA REGIÓN', {
      fontFamily: 'Bebas Neue, sans-serif',
      fontSize: '16px', color: '#FFFFFF', letterSpacing: 2
    }).setOrigin(0.5).setDepth(63);

    btnV.on('pointerup', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.time.delayedCall(400, () => window.location.href = 'index.html');
    });
    btnV.on('pointerover', () => {
      btnV.clear().fillStyle(0xF57C00, 1).fillRoundedRect(cx - 140, cy + 60, 280, 44, 50);
      this.input.setDefaultCursor('pointer');
    });
    btnV.on('pointerout', () => {
      btnV.clear().fillStyle(0xFF8F00, 1).fillRoundedRect(cx - 140, cy + 60, 280, 44, 50);
      this.input.setDefaultCursor('default');
    });

    // Botón "Intentar de nuevo" — contorno naranja
    const btnR = this.add.graphics().setDepth(62).setInteractive(
      new Phaser.Geom.Rectangle(cx - 140, cy + 116, 280, 38),
      Phaser.Geom.Rectangle.Contains
    );
    btnR.fillStyle(0xFFFFFF, 1)
      .fillRoundedRect(cx - 140, cy + 116, 280, 38, 50)
      .lineStyle(3, 0xFF8F00, 1)
      .strokeRoundedRect(cx - 140, cy + 116, 280, 38, 50);

    this.add.text(cx, cy + 135, 'Intentar de nuevo', {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '14px', fontStyle: 'bold', color: '#FF8F00'
    }).setOrigin(0.5).setDepth(63);

    btnR.on('pointerup', () => {
      // Destruir overlay
      this.children.list
        .filter(c => c.depth >= 60)
        .forEach(c => c.destroy());
      this.winShown = false;
      this._reiniciar();
    });
    btnR.on('pointerover', () => {
      btnR.clear()
        .fillStyle(0xFFF8E1, 1).fillRoundedRect(cx - 140, cy + 116, 280, 38, 50)
        .lineStyle(3, 0xFF8F00, 1).strokeRoundedRect(cx - 140, cy + 116, 280, 38, 50);
      this.input.setDefaultCursor('pointer');
    });
    btnR.on('pointerout', () => {
      btnR.clear()
        .fillStyle(0xFFFFFF, 1).fillRoundedRect(cx - 140, cy + 116, 280, 38, 50)
        .lineStyle(3, 0xFF8F00, 1).strokeRoundedRect(cx - 140, cy + 116, 280, 38, 50);
      this.input.setDefaultCursor('default');
    });

    // Botón volver a módulos
    const btnM = this.add.graphics().setDepth(62).setInteractive(
      new Phaser.Geom.Rectangle(cx - 100, cy + 166, 200, 30),
      Phaser.Geom.Rectangle.Contains
    );
    this.add.text(cx, cy + 181, '🏠 Volver a módulos', {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '13px', fontStyle: 'bold', color: '#01579B'
    }).setOrigin(0.5).setDepth(63);
    btnM.on('pointerup', () => {
      window.location.href = '../../Web2/modulos.html';
    });
    btnM.on('pointerover', () => this.input.setDefaultCursor('pointer'));
    btnM.on('pointerout',  () => this.input.setDefaultCursor('default'));
  }

  update() {}
}