# Proyecto Plataforma Educativa: Energía Solar en Chile

Este repositorio contiene el código fuente de la plataforma web interactiva diseñada para enseñar a estudiantes de 5to básico en adelante sobre la energía eléctrica, el funcionamiento de los paneles fotovoltaicos y el potencial solar en las distintas regiones de Chile.

## Primeros Pasos para el Equipo

Si es tu primera vez trabajando con Git y GitHub, no te preocupes. Sigue estos pasos para configurar tu entorno de trabajo correctamente:

### 1. Requisitos Previos
*   **Visual Studio Code (VS Code):** El editor de código que usaremos para programar.
*   **Git:** El sistema de control de versiones. Descárgalo desde [git-scm.com](https://git-scm.com/download/win) e instálalo dejando todas las opciones por defecto. **Importante:** Cierra y vuelve a abrir VS Code después de instalarlo.
*   **Cuenta de GitHub:** Crea una cuenta en [github.com](https://github.com/) y avisa por el grupo para que te agreguen como colaborador del proyecto.

### 2. Clonar el Repositorio (Descargar el código)
Una vez que hayas aceptado la invitación al repositorio:
1.  Abre VS Code.
2.  Abre una nueva terminal (`Ctrl` + `J` o ve arriba a `Terminal > New Terminal`).
3.  Ejecuta el siguiente comando para descargar la carpeta del proyecto:
    ```bash
    git clone [https://github.com/Crsvcs/energia_solar_chile.git](https://github.com/Crsvcs/energia_solar_chile.git)
    ```

### 3. Configuración Inicial (Solo la primera vez)
Dile a Git quién eres para que tus cambios queden registrados con tu nombre en el historial del equipo. Ejecuta estos dos comandos en la terminal con tus datos reales:
```bash
git config --global user.email "tu@email.com"
git config --global user.name "Tu Nombre"

---

## 💻 Flujo de Trabajo Diario

Cada vez que te sientes a programar, **siempre** debes seguir este orden para evitar que tu código choque con el de tus compañeros:

### Paso 1: Actualizar (Obligatorio antes de empezar)
Descarga los últimos cambios que hayan subido los demás:
```bash
git pull
```

### Paso 2: Trabajar
Haz tus cambios, guarda tus archivos en VS Code y prueba que todo funcione.

### Paso 3: Subir los cambios
Sube tu trabajo a GitHub ejecutando estos tres comandos en orden:
```bash
git add .
git commit -m "Escribe aquí qué hiciste (ej: maquetación HTML módulo 1)"
git push
```

---

## 📁 Estructura del Proyecto

*   `index.html` - Página principal con la vista de los módulos.
*   `styles/` - Archivos CSS para el diseño visual (`main.css`).
*   `js/` - Lógica principal de la plataforma (`modulos.js`).
*   `juego-final/` - Archivos específicos para el desafío final interactivo (Phaser + Canvas).

## ⚠️ Reglas Importantes del Equipo
1.  **Respeta las carpetas:** Cada integrante tiene tareas asignadas. Trabaja únicamente en los archivos que te corresponden para no borrar el trabajo de otro por accidente.
2.  **Pull antes de Push:** Nunca intentes subir código (`git push`) sin antes haber descargado lo más reciente (`git pull`).
3.  
