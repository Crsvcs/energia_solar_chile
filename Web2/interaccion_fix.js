/* ── PARCHE: reemplaza cambiarSlide() con versión corregida ──
   Cargar DESPUÉS de interaccion_web.js en el HTML:
       <script src="interaccion_web.js"></script>
       <script src="interaccion_fix.js"></script>

   Correcciones:
     1. Si el typewriter está activo, lo cancela en vez de bloquear el click.
     2. Verifica los límites antes de tocar las clases, evitando pantalla en blanco.
── */

function cambiarSlide(n) {

    /* FIX 1: cancelar typewriter en vez de bloquear */
    if (escribiendo) {
        if (typewriterTimer) {
            clearTimeout(typewriterTimer);
            typewriterTimer = null;
        }
        escribiendo = false;
    }

    reproducirClikFlecha(n);

    /* Último slide: flecha derecha va directo al módulo 2 */
    if (slideActual === 5 && n === 1) {
        window.location.href = 'modulo2.html';
        return;
    }

    let slides = document.querySelectorAll(".slide");

    /* FIX 2: calcular destino antes de tocar nada */
    let nuevaSlide = slideActual + n;

    /* Slide 3 (índice 2) — manejar sus 3 estados */
    if (slideActual === 2) {
        if (n === 1) {
            if (estadoSlide3 === 1) {
                estadoSlide3 = 2;
                escribirTexto("textoSlide3", textoS3E2);
                return;
            }
            if (estadoSlide3 === 2) {
                estadoSlide3 = 3;
                document.getElementById("contenedorSlide3").classList.remove("difuminado");
                document.getElementById("panelinSlide3").style.display = "none";
                return;
            }
            /* estado 3 → verificar que abrió todos antes de navegar */
            const faltantes = ['info1', 'info2', 'info3'].filter(id => !visitadosSlide3.has(id));
            if (faltantes.length > 0) {
                reproducirError();
                faltantes.forEach(id => pulsarCajaSlide3(id));
                return;
            }
            resetSlide3();
            return; // FIX: evitar doble-transición al avanzar desde estado 3
        } else if (n === -1) {
            if (estadoSlide3 === 3) {
                estadoSlide3 = 2;
                document.getElementById("contenedorSlide3").classList.add("difuminado");
                document.getElementById("panelinSlide3").style.display = "flex";
                escribirTexto("textoSlide3", textoS3E2);
                document.getElementById("info1").style.display = "none";
                document.getElementById("info2").style.display = "none";
                document.getElementById("info3").style.display = "none";
                return;
            }
            if (estadoSlide3 === 2) {
                estadoSlide3 = 1;
                escribirTexto("textoSlide3", textoS3E1);
                return;
            }
            /* estado 1 → navegar a slide 2 */
            resetSlide3();
            nuevaSlide = slideActual - 1; // FIX: recalcular para que el guard no bloquee (1 es válido)
        }
    }

    /* Slide 5 (índice 4) — manejar su estado intro */
    if (slideActual === 4) {
        if (n === 1 && estadoSlide5 === 1) {
            estadoSlide5 = 2;
            document.getElementById("objetosSlide2").classList.remove("difuminado");
            document.getElementById("panelinSlide5").style.display = "none";
            actualizarDestacado();
            return;
        }
        if (n === 1 && estadoSlide5 === 2 && turnoActual < ordenDispositivos.length) {
            reproducirError();
            pulsarCardActual();
            return;
        }
        if (n === -1 && estadoSlide5 === 2) {
            estadoSlide5 = 1;
            document.getElementById("objetosSlide2").classList.add("difuminado");
            document.getElementById("panelinSlide5").style.display = "flex";
            escribirTexto("globoSlide5", textoGloboSlide5);
            return;
        }
        if (n === -1 && estadoSlide5 === 1) resetSlide5();
    }

    /* FIX 2: salir si el destino está fuera de rango, sin tocar clases */
    if (nuevaSlide < 0 || nuevaSlide >= slides.length) return;

    let slideAnterior = slideActual;
    slides[slideAnterior].classList.remove("activo");
    slideActual = nuevaSlide;
    slides[slideActual].classList.add("activo");

    if (slideActual === 2 && slideAnterior !== 2) resetSlide3();
    if (slideActual === 4 && slideAnterior !== 4) resetSlide5();

    if (slideActual === 0) escribirTexto("globoSlide1", textoGloboSlide1);
    if (slideActual === 1) escribirTexto("globoSlide2", textoGloboSlide2);
    if (slideActual === 5) {
        let actual = parseInt(localStorage.getItem('modulos_desbloqueados') || '1');
        if (actual < 2) localStorage.setItem('modulos_desbloqueados', '2');
        localStorage.setItem('copa_modulo_1', 'true');
        reproducirTriunfo();
        actualizarPlacaVictoria();
        escribirTexto("globoFinal", textoGloboFinal);
    }

    actualizarFlechas();
}
