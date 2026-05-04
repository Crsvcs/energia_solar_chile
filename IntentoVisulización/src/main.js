import kaplay from "kaplay";


const k= kaplay({ //puedes definir width height y letterbox true
background: "#4dbe85",
  debug: true, //pressing f1
  global: true, //you could use kaplay methods and functions need to be used through a k.
  scale: 1,
}); //starts kaplsay! bastante importante

loadSprite("sunny","src/assets/sun-o.png")
loadSprite("panel", "src/assets/panel.png");
loadSprite("electron", "src/assets/electron.png");
loadSprite("photon", "src/assets/photon.png");
loadSprite("block","src/assets/steel-o.png")
loadSprite("bulbOFF","src/assets/Bulboff.png")

// Adds the nucleus for the other children to get added to, it just means this is their parent
//const nucleus = add([
//    sprite("sunny"),
//    pos(center()),
//    anchor("center"),
//]);

// Add children
//for (let i = 12; i < 24; i++) {
//    nucleus.add([
//        sprite("photon"),
//        rotate(0),
//        anchor(vec2(i).scale(0.1)),
//        {
//            speed: i * 8,
//       },
//        area(),
//       
//    ]);
//}//



// const evil = add([
//     sprite("panel"),
//     pos(center()),
//     area(),
//    scale(2),
//     // This game object also has isStatic, so our player won't be able to move pass this
//     body({ isStatic: true }),
//     "penca",
// ]);

// const steelo = add([
//     sprite("block"),
//     area(),
//     pos(1000,0),
//     "steelo",

// ]);

const emitter = add([
    sprite("sunny"),
    scale(2),
    pos(center()),
    anchor("center"),
    area({isSensor:true}),
   
    "emitter"
]);

emitter.onClick(()=>{

    const childCount= 12; //numero de wawas

    for(let i = 0; i< childCount; i++){
        const angle = (i/childCount)*360;
        const radians = angle*Math.PI/180;
        const speed = rand(100, 300); // random speed variation

            add([
            sprite("photon"),
            scale(0.5),
            pos(emitter.pos),
            opacity(1),
            lifespan(1, {fade: 10}),
            move(Math.cos(radians)*speed, Math.sin(radians)*speed),
            rotate(rand(0,360)),
            area(),
            "guagua"
        ]);    
    }

});

const cable = add([
    rect(480,10),
    pos(600,380),
    color(rgb(30, 29, 75))
])
const objetivoe = add([
    sprite("bulbOFF"),
    pos(1000,220),
    area(),
    "objetivoe"
]);

    
// Create multiple collectors that all destroy particles
const target = add([
    sprite("panel"),
    pos(500, 200),
    scale(2),
    area(),
    rotate(0),
    body(),
]);

onDraw(() => {

    drawText({
        text: "Visulalización! (haz click)",
    });
    // (we will see more about drawing functions later.)
});

// const collector2 = add([
//     sprite("panel"),
//     pos(width() - 100, height() - 100),
//     area(),
//     "collector"
// ]);

// const collector3 = add([
//     sprite("panel"),
//     pos(width() / 2, 50),
//     area(),
//     "collector"
// ]);

// Single collision handler for all collectors

    target.onCollide("guagua",(guagua)=>{

    destroy(guagua);
    const electron = add([
        sprite("electron"),
        pos(650,350),
        opacity(1),
        lifespan(1,{fade:2}),
        area(),
    ]); 
    electron.onUpdate(()=>{
        electron.move(1000,0)
    })
    
   
    electron.onCollide("objetivoe",(objetivoe)=>{
        destroy(electron);
        objetivoe.color = rgb(194, 204, 58);
        wait(0.1, () => {
        objetivoe.color = rgb()
})
  
    });
    });



emitter.onUpdate(()=>{


    emitter.pos = mousePos();

        emitter.children.forEach((child) => {
            child.onCollide("collector",(collector)=>{
            destroy(child);      
            });
    });

});



// Runs every frame
//nucleus.onUpdate(() => {
//  nucleus.pos = mousePos();

// //update children
//     nucleus.children.forEach((child) => {
////         child.angle += child.speed * dt();
//         child.onCollide("penca",(penca)=>{
//             debug.log("electron");
//             destroy(child);        
//         });       
//     });
// });







 