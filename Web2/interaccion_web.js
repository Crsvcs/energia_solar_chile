/* ── SLIDE 1: Consumo eléctrico ─────────────── */

function toggleInfo(id) {
    let box = document.getElementById(id);
    if (box.style.display === "block") {
        box.style.display = "none";
    } else {
        box.style.display = "block";
    }
}

/* ── NAVEGACIÓN ENTRE SLIDES ─────────────────── */

let slideActual = 0;

function actualizarFlechas() {
    let total = document.querySelectorAll(".slide").length;
    document.getElementById("flechaIzquierda").style.visibility =
        (slideActual === 0) ? "hidden" : "visible";
    document.getElementById("flechaDerecha").style.visibility =
        (slideActual === total - 1) ? "hidden" : "visible";
}
let estadoSlide3 = 1;

const textoS3E1 = "Los watts (W) nos ayudan a saber cuánta electricidad usa un objeto. Mientras más watts tiene un objeto, más electricidad necesita para funcionar.";
const textoS3E2 = "Para poder entender mejor esto, haz click sobre cada artefacto.";

function resetSlide3() {
    estadoSlide3 = 1;
    document.getElementById("contenedorSlide3").classList.add("difuminado");
    document.getElementById("panelinSlide3").style.display = "flex";
    document.getElementById("textoSlide3").innerText = textoS3E1;
    document.getElementById("info1").style.display = "none";
    document.getElementById("info2").style.display = "none";
    document.getElementById("info3").style.display = "none";
}

function cambiarSlide(n) {
    let slides = document.querySelectorAll(".slide");

    /* Slide 3 está en índice 2 — manejar sus 3 estados */
    if (slideActual === 2) {
        if (n === 1) {
            if (estadoSlide3 === 1) {
                estadoSlide3 = 2;
                document.getElementById("textoSlide3").innerText = textoS3E2;
                return;
            }
            if (estadoSlide3 === 2) {
                estadoSlide3 = 3;
                document.getElementById("contenedorSlide3").classList.remove("difuminado");
                document.getElementById("panelinSlide3").style.display = "none";
                return;
            }
            /* estado 3 → navegar a slide 4 */
            resetSlide3();
        } else if (n === -1) {
            if (estadoSlide3 === 3) {
                estadoSlide3 = 2;
                document.getElementById("contenedorSlide3").classList.add("difuminado");
                document.getElementById("panelinSlide3").style.display = "flex";
                document.getElementById("textoSlide3").innerText = textoS3E2;
                document.getElementById("info1").style.display = "none";
                document.getElementById("info2").style.display = "none";
                document.getElementById("info3").style.display = "none";
                return;
            }
            if (estadoSlide3 === 2) {
                estadoSlide3 = 1;
                document.getElementById("textoSlide3").innerText = textoS3E1;
                return;
            }
            /* estado 1 → navegar a slide 2 */
            resetSlide3();
        }
    }

    /* Slide 5 está en índice 4 — manejar su estado intro */
    if (slideActual === 4) {
        if (n === 1 && estadoSlide5 === 1) {
            estadoSlide5 = 2;
            document.getElementById("objetosSlide2").classList.remove("difuminado");
            document.getElementById("panelinSlide5").style.display = "none";
            return;
        }
        if (n === -1 && estadoSlide5 === 2) {
            estadoSlide5 = 1;
            document.getElementById("objetosSlide2").classList.add("difuminado");
            document.getElementById("panelinSlide5").style.display = "flex";
            return;
        }
        if (n === -1 && estadoSlide5 === 1) resetSlide5();
    }

    let slideAnterior = slideActual;
    slides[slideAnterior].classList.remove("activo");
    slideActual += n;
    if (slideActual < 0) slideActual = 0;
    if (slideActual >= slides.length) slideActual = slides.length - 1;
    slides[slideActual].classList.add("activo");

    if (slideActual === 2 && slideAnterior !== 2) resetSlide3();
    if (slideActual === 4 && slideAnterior !== 4) resetSlide5();

    /* Al llegar a la slide final, desbloquear módulo 2 */
    if (slideActual === 5) {
        let actual = parseInt(localStorage.getItem('modulos_desbloqueados') || '1');
        if (actual < 2) localStorage.setItem('modulos_desbloqueados', '2');
    }

    actualizarFlechas();
}

/* Ajustar flechas al cargar */
document.addEventListener("DOMContentLoaded", actualizarFlechas);

/* ── SLIDE 5: Corrientes y dispositivos ──────── */

let artefactoActual = "";
let estadoSlide5 = 1;

function resetSlide5() {
    estadoSlide5 = 1;
    document.getElementById("objetosSlide2").classList.add("difuminado");
    document.getElementById("objetosSlide2").style.display = "grid";
    document.getElementById("panelinSlide5").style.display = "flex";
    document.getElementById("detalleArtefacto").style.display = "none";
    document.getElementById("panelinArtefacto").style.display = "none";
}

const datosArtefactos = {
    tablet: {
        cargando: "tablet_carg.png",
        texto: "La tablet usa corriente alterna cuando se carga desde el enchufe y utiliza corriente continua cuando funciona con su batería."
    },
    refrigerador: {
        cargando: "refrigerador_carg.png",
        texto: "El refrigerador funciona con corriente alterna, porque necesita estar conectado al enchufe para mantenerse encendido."
    },
    nintendo: {
        cargando: "nintendo_carg.png",
        texto: "El Nintendo funciona con corriente alterna al cargarse desde el enchufe y además funciona con corriente continua gracias a su batería integrada."
    },
    microonda: {
        cargando: "microondas_carg.png",
        texto: "El microondas funciona con corriente alterna, porque necesita conectarse al enchufe para calentar los alimentos."
    },
    teclado: {
        cargando: "teclado_carg.png",
        texto: "El teclado puede usar corriente alterna cuando está conectado al enchufe y corriente continua si funciona con batería."
    },
    xbox: {
        cargando: "xbox_carg.png",
        texto: "La Xbox funciona con corriente alterna, porque necesita estar conectada al enchufe para encenderse y funcionar."
    }
};

/* Estado 1 → 2: muestra el artefacto enchufado */
function mostrarDetalle(artefacto) {
    artefactoActual = artefacto;

    document.getElementById("objetosSlide2").style.display = "none";
    document.getElementById("detalleArtefacto").style.display = "block";
    document.getElementById("panelinArtefacto").style.display = "none";
    document.getElementById("panelinSlide5").style.display = "none";

    document.getElementById("imagenCargando").src = datosArtefactos[artefacto].cargando;

    document.getElementById("flechas").style.display = "none";
}

/* Estado 2 → 3: muestra a Panelín explicando */
function mostrarPanelinArtefacto() {
    document.getElementById("panelinArtefacto").style.display = "block";
    document.getElementById("textoPanelin").innerText = datosArtefactos[artefactoActual].texto;

    document.getElementById("flechas").style.display = "none";
}

/* Estado 3 → 2: vuelve a la grilla (ya sin intro) */
function volverObjetosSlide2() {
    estadoSlide5 = 2;
    document.getElementById("objetosSlide2").classList.remove("difuminado");
    document.getElementById("objetosSlide2").style.display = "grid";
    document.getElementById("detalleArtefacto").style.display = "none";
    document.getElementById("panelinArtefacto").style.display = "none";
    document.getElementById("panelinSlide5").style.display = "none";

    document.getElementById("flechas").style.display = "flex";
}
