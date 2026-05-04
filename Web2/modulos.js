const CLAVE        = 'modulos_desbloqueados';
const INTRO_VISTO  = 'intro_visto';

const texto1 = 'Bienvenidos a los módulos de aprendizaje, aquí deberás ir en orden viendo los módulos para desbloquear el siguiente.';
const texto2 = '¡Se ha desbloqueado el módulo 1!\nHaz click en él para ver más...';

let estadoIntro  = 0;
let introActiva  = false;

function iniciar() {
    if (localStorage.getItem(INTRO_VISTO)) {
        mostrarEstadoNormal();
    } else {
        introActiva = true;
        document.addEventListener('click', avanzarIntro);
    }
}

function avanzarIntro() {
    estadoIntro++;

    if (estadoIntro === 1) {
        document.getElementById('modulosRow').classList.add('difuminado');
        let p = document.getElementById('panelinModulos');
        p.style.display = 'flex';
        document.getElementById('globoMod').innerText = texto1;

    } else if (estadoIntro === 2) {
        document.getElementById('globoMod').innerText = texto2;

    } else if (estadoIntro >= 3) {
        document.removeEventListener('click', avanzarIntro);
        introActiva = false;
        localStorage.setItem(INTRO_VISTO, 'true');
        mostrarEstadoNormal();
    }
}

function mostrarEstadoNormal() {
    let n = parseInt(localStorage.getItem(CLAVE) || '1');

    document.getElementById('modulosRow').classList.remove('difuminado');
    document.getElementById('panelinModulos').style.display = 'none';

    for (let i = 1; i <= 4; i++) {
        let lock   = document.getElementById('lock' + i);
        let modulo = document.getElementById('modulo' + i);
        if (i <= n) {
            lock.classList.add('abierto');
            modulo.classList.remove('bloqueado');
        }
    }
    // 👇 AGREGA ESTAS 3 LÍNEAS AQUÍ 👇
    if (n >= 5) {
        document.getElementById('zonaDesafioFinal').style.display = 'block';
    }
}

function irModulo(num) {
    if (introActiva) return;
    let n = parseInt(localStorage.getItem(CLAVE) || '1');
    if (num > n) return;

    const urls = {
        1: 'estructura_web.html',
        2: 'modulo2.html',
        3: 'modulo3.html',
        4: 'modulo4.html'
    };
    window.location.href = urls[num];
}

iniciar();
