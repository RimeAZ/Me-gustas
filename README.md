# Para Rallada 🌅 — Una carta de tarde

Una experiencia web **cariñosa, elegante y romántica** dedicada a una persona
especial llamada **Rallada**. Construida con **React + Vite**, con una escena 3D
hecha con **Three.js** (`@react-three/fiber` + `@react-three/drei`) y animaciones
suaves con **framer-motion**.

La página transmite la calidez de una tarde de atardecer: degradado naranja/coral
a rosa, motas de luz dorada flotando, corazones 3D orbitando, rosas con vaivén de
brisa y pétalos que caen muy despacio. En el centro, una tarjeta tipo pergamino
con efecto cristal esmerilado muestra la carta, y como broche de oro la firma
**RALLADA RALLADA** en dorado brillante.

## ✨ Qué incluye

- 🌇 Fondo degradado de atardecer con resplandor de sol y nubes suaves.
- 💛 Partículas de luz cálida (motas de polvo de sol) en 3D.
- 💗 Corazones 3D que orbitan lenta y elegantemente alrededor del texto.
- 🌹 Rosas modeladas en 3D en los laterales inferiores, con vaivén de brisa.
- 🌸 Pétalos 2D que caen suavemente (capa HTML).
- 🧸 Ositos y corazones decorativos en las esquinas.
- 📜 Carta en tarjeta de cristal esmerilado con tipografía serif elegante.
- ✒️ Firma final "RALLADA RALLADA" en dorado, espaciada y con brillo.
- 📱 Totalmente responsive (móvil y escritorio).

## 🚀 Cómo ejecutarla en local

Necesitas [Node.js](https://nodejs.org) (v18 o superior).

```bash
# 1. Instalar dependencias
npm install

# 2. Arrancar el servidor de desarrollo
npm run dev
```

Abre la URL que indica la terminal (normalmente `http://localhost:5173`).

## 📦 Compilar para producción

```bash
npm run build
```

Esto genera la carpeta `dist/` con los archivos estáticos listos para desplegar.
Puedes previsualizar el resultado con:

```bash
npm run preview
```

## ☁️ Desplegar en Surge.sh

[Surge](https://surge.sh) sirve archivos estáticos de forma gratuita.

```bash
# 1. Instalar Surge (una sola vez)
npm install -g surge

# 2. Compilar el proyecto
npm run build

# 3. Desplegar la carpeta dist/ con el dominio que quieras
surge dist nombre.surge.sh
```

La primera vez Surge te pedirá un email y contraseña para crear tu cuenta.
Sustituye `nombre.surge.sh` por el dominio que prefieras (debe terminar en
`.surge.sh`), por ejemplo:

```bash
surge dist para-rallada.surge.sh
```

> Nota: el `vite.config.js` usa `base: './'` para que las rutas de los assets
> funcionen correctamente en Surge y en cualquier subdirectorio.

## 🗂️ Estructura

```
.
├── index.html         # HTML base + tipografías de Google Fonts
├── package.json       # dependencias y scripts
├── vite.config.js     # configuración de Vite
└── src/
    ├── main.jsx       # punto de entrada de React
    ├── App.jsx        # toda la experiencia (escena 3D + carta)
    └── index.css      # estilos, fondo de atardecer y responsive
```

Hecho con cariño, para una tarde cálida. 💛
