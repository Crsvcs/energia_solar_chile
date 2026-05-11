// Inicializamos KAPLAY adjuntándolo al Canvas específico de la lámina
kaplay({
    canvas: document.getElementById("simulador-fotones"),
    width: 1000,
    height: 500,
    background: [135, 206, 235], // Un celeste cielo brillante 
    global: true,
    debug: false
});

// Cargamos los assets (¡Verifica que estas rutas sean correctas!)
loadSprite("sunny", "dist/sun-o.png");
loadSprite("panel", "dist/panel.png");
loadSprite("electron", "dist/electron.png");
loadSprite("photon", "dist/photon.png");
loadSprite("bulbOFF", "dist/Bulboff.png");
loadSprite("trees", "dist/trees.png");
loadSprite("clouds", "dist/near-clouds.png");
loadSprite("mountains", "dist/mountains.png");
loadSprite("farclouds", "dist/far-clouds.png");
loadSprite("floor", "dist/4.png");

// Dibujar el suelo
add([
    sprite("floor"),
    scale(2.5),
    pos(0, -210),
    z(-1)
]);

// Parallax (Fondos)
let cloudsNear = [];
let mountains = [];
let trees = [];
let cloudsFar = [];

for (let e = 0; e < 30; e++) {
    cloudsNear.push(add([sprite("clouds"), pos(e * 140, 50), z(-4)]));
    mountains.push(add([sprite("mountains"), pos(e * 150, 100), scale(1.5), z(-3)]));
    trees.push(add([sprite("trees"), scale(2), pos(e * 150, 40), z(-2)]));
    cloudsFar.push(add([sprite("farclouds"), pos(e * 120, 20), z(-5)]));
}

onUpdate(() => {
    cloudsNear.forEach(e => { e.pos.x -= 0.5; if (e.pos.x < -800) e.pos.x += 1600; });
    mountains.forEach(e => { e.pos.x -= 0.1; if (e.pos.x < -800) e.pos.x += 1600; });
    trees.forEach(e => { e.pos.x -= 0.01; if (e.pos.x < -800) e.pos.x += 1600; });
    cloudsFar.forEach(e => { e.pos.x -= 0.01; if (e.pos.x < -800) e.pos.x += 1600; });
});

// El Sol (Click para emitir fotones)
const sol = add([
    pos(150, 100),
    sprite("sunny"),
    scale(2),
    anchor("center"),
    area({ isSensor: true }), 
    "emitter"
]);

// Cable conductor (ajustado para que empiece debajo del panel y vaya a la ampolleta)
add([
    rect(480, 10),
    pos(350, 400),
    color(32, 32, 32)
]);

// El Panel Solar (lo bajamos un poco para que toque el cable)
const panel = add([
    sprite("panel"),
    pos(300, 210),
    scale(2),
    area(),
    rotate(0),
    body()
]);

// La Ampolleta (Movida a la izquierda al píxel 850 para que se vea en pantalla)
const ampolleta = add([
    sprite("bulbOFF"),
    pos(750, 250), 
    area(),
    "objetivoe"
]);

// Interacción al hacer click en el Sol
sol.onClick(() => {
    for (let e = 0; e < 30; e++) {
        let angulo = (e / 30) * 360 * (Math.PI / 180);
        let velocidad = rand(100, 700);
        
        add([
            sprite("photon"),
            scale(0.5),
            pos(sol.pos),
            opacity(1),
            lifespan(1, { fade: 1 }), 
            move(Math.cos(angulo) * velocidad, Math.sin(angulo) * velocidad),
            rotate(rand(0, 360)),
            area(),
            "foton"
        ]);
    }
});

// Colisión: Fotón en el Panel -> Crea Electrón
panel.onCollide("foton", (foton) => {
    destroy(foton); 
    
    let electron = add([
        sprite("electron"),
        pos(650, 360),
        opacity(1),
        lifespan(1, { fade: 2 }),
        area()
    ]);
    
    electron.onUpdate(() => {
        electron.move(1000, 0); 
    });
    
    // Colisión: Electrón llega a la Ampolleta
    electron.onCollide("objetivoe", (amp) => {
        destroy(electron);
        amp.color = rgb(255, 255, 50); 
        wait(0.1, () => { amp.color = rgb(255, 255, 255); });
    });
});