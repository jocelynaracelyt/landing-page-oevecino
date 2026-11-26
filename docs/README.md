# OeVecino · Plataforma web

OeVecino es nuestro proyecto de seguridad vecinal. Este repositorio tiene la parte web de la
plataforma, la que usan la municipalidad y el Serenazgo para atender los reportes que los vecinos
envían desde la app. La armamos con HTML, CSS y JavaScript, sin frameworks, siguiendo el diseño
que hicimos en Figma.

Hay dos tipos de usuario:

- **Coordinador** (Diego Salazar): revisa los incidentes del barrio, modera lo que se publica en
  la Red Vecinal, envía comunicados de la junta y consulta el directorio de vecinos.
- **Serenazgo** (María Torres): recibe los incidentes, asigna una unidad, sigue la atención y
  cierra el caso.

Todo pasa en la municipalidad ficticia de Santa Aurora (Central Norte).

> Es una simulación: no hay servidor ni base de datos. Los datos son de prueba y lo que cambies
> se guarda solo en tu navegador (`localStorage`).

**Sitio publicado:** https://jocelynaracelyt.github.io/landing-page-oevecino/pages/

---

## Cómo abrirlo en tu computadora

Si tienes Node.js instalado (puedes comprobarlo con `node -v`), entra a la carpeta del proyecto y
ejecuta:

```bash
npm run dev
```

Se abre el navegador en `http://localhost:5173/pages/`. La primera vez descarga un servidor
pequeño (`http-server`), así que necesitas internet. Para apagarlo, `Ctrl + C`.

El `package.json` solo existe para tener ese comando; el proyecto no usa dependencias.

Si no tienes Node, cualquiera de estas opciones funciona:

- En VS Code, con la extensión Live Server: clic derecho en `pages/index.html` → *Open with Live Server*.
- Con Python: `python -m http.server 8000` desde la carpeta del proyecto, y luego abre
  `http://localhost:8000/pages/`.

### Cuentas para entrar

| Rol | Correo | Contraseña |
|---|---|---|
| Coordinador | `dsalazar@municipalidad.gob.pe` | `OeVecino2026` |
| Serenazgo | `mtorres@municipalidad.gob.pe` | `OeVecino2026` |

Usamos cuentas personales y no genéricas (como `coordinador@...`) porque cada acción queda
registrada con el nombre de quien la hizo.

### Para mostrar otros estados

Algunas pantallas tienen estados que no salen solos. Se pueden ver agregando `?demo=` a la URL:

| URL | Qué muestra |
|---|---|
| cualquier página + `?demo=reset` | Borra lo que hiciste y vuelve a los datos iniciales |
| `coordinador-moderacion.html?demo=vacio` | Moderación sin publicaciones |
| `coordinador-comunicados.html?demo=vacio` | Comunicados sin publicar |
| `serenazgo-incidentes.html?demo=vacio` | Bandeja vacía |
| `serenazgo-unidades.html?demo=vacio` | Sin unidades registradas |
| `serenazgo-seguimiento.html?id=INC-0248&demo=sin-senal` | Unidad sin señal GPS |

Otros aparecen por su cuenta: si desconectas el internet, el mapa muestra «Mapa sin conexión» y
al publicar un comunicado sale el error correspondiente. Y unos 15 segundos después de entrar como
Serenazgo llega un SOS nuevo (INC-0252) con su aviso.

---

## Estructura

Respetamos la estructura que pidió el profesor y solo agregamos archivos dentro de las carpetas
que ya existían.

```text
oevecino-web/
├── assets/
│   ├── images/      fotos usadas en los incidentes
│   ├── icons/       íconos SVG sacados del diseño de Figma
│   ├── fonts/       Nunito (licencia SIL OFL)
│   └── videos/      (vacía)
├── css/styles.css   todos los estilos
├── js/main.js       datos de prueba, sesión y lógica de cada pantalla
├── pages/           las 16 páginas (index.html es el inicio de sesión)
├── docs/README.md
├── favicon.ico
├── package.json     solo para npm run dev
└── .gitignore
```

Algunas cosas sobre cómo está hecho:

- El menú lateral, la barra superior y el pie se generan desde `main.js`, para no copiar el
  mismo bloque en todas las páginas. Cada página dice qué pantalla es con `<body data-page="...">`.
- Las ventanas emergentes usan `<dialog>`, así que se cierran con Esc, con la ✕ o haciendo clic
  afuera.
- Los colores y medidas son variables CSS al inicio de `styles.css`, con los valores de Figma.

---

## Pantallas

| Código | Pantalla | Rol | Qué se puede hacer |
|---|---|---|---|
| W01 | Inicio de sesión | Ambos | Entrar, con avisos si faltan datos o la contraseña es incorrecta |
| W02 | Mi perfil | Ambos | Ver tus datos y cerrar sesión |
| C01 | Panel | Coordinador | Indicadores, mapa del barrio, incidente prioritario y actividad reciente |
| C02 | Lista de incidentes | Coordinador | Buscar, filtrar y ordenar los reportes |
| C03 | Detalle de incidente | Coordinador | Editar, resolver, descartar o enviar a Serenazgo |
| C06 | Moderación | Coordinador | Revisar las publicaciones de la Red Vecinal |
| C07 | Revisión de publicación | Coordinador | Aprobar u ocultar una publicación |
| C08 | Comunicados | Coordinador | Ver los comunicados de la junta |
| C09 | Crear comunicado | Coordinador | Escribirlo con una vista previa de cómo se ve en la app |
| C10 | Directorio vecinal | Coordinador | Buscar vecinos |
| C11 | Perfil vecinal | Coordinador | Datos de contacto de un vecino |
| S01 | Panel | Serenazgo | Indicadores, mapa operativo y casos prioritarios |
| S02 | Bandeja de incidentes | Serenazgo | Ver los casos que llegan, con su ficha médica |
| S03 | Seguimiento | Serenazgo | Asignar unidad, marcar en ruta y en atención, y cerrar el caso |
| S07 | Unidades | Serenazgo | Ver qué unidades están disponibles |
| S08 | Detalle de unidad | Serenazgo | Tripulación y caso asignado |

Las pantallas C04, C05 y S04–S06 no existen en el diseño, así que no las creamos.

Lo que hace un rol se ve en el otro: si el Coordinador envía un caso a Serenazgo, aparece en la
bandeja, y cuando Serenazgo lo atiende o lo cierra, el Coordinador ve el avance en el detalle.

### Historias de usuario

Revisamos la web contra nuestras historias de usuario (HU-001 a HU-063, versión del 22/11/2026).
Aquí solo van las que son de la web; las demás son de la app.

| HU | Historia | Dónde | Estado |
|---|---|---|---|
| HU-002 | Ficha y ubicación a Serenazgo | S02, S03 | Lo de la web está: el SOS llega con ubicación y ficha. Los SMS a contactos son de la app. |
| HU-003 | Ficha médica | S01, S02, S03 | Listo. Se ven los tres casos: con datos (INC-0253), sin datos (INC-0248) y sin autorización (INC-0252). El Coordinador nunca la ve. |
| HU-010 | Ubicación de la unidad | S03 | Listo |
| HU-011 | Unidad sin señal | S03 | A medias: se ve el aviso, la última hora conocida y «Confirmar por radio». Falta reasignar porque no está diseñado. |
| HU-020 | Editar incidente | C03 | Listo. Como dice el diseño, solo se editan Alumbrado defectuoso y Otros que no se han enviado a Serenazgo. |
| HU-021 | Resolver o descartar | C03 | Listo |
| HU-028 | Resumen de Serenazgo | S01 | Listo |
| HU-029 | Resumen del Coordinador | C01 | Listo |
| HU-030 | Comunicados de la junta | C08, C09 | Listo |
| HU-031 | Moderación | C06, C07 | Listo |
| HU-032 | Ocultar publicaciones | C07 | Listo |
| HU-033 | Inicio de sesión | W01 | Listo |
| HU-034 | Navegación por rol | Todas | Listo |
| HU-035 | Perfil | W02 | Listo |
| HU-036 | Directorio vecinal | C10, C11 | Listo |
| HU-037 | Mapa en vivo | C01, S01 | Listo dentro de la simulación: el panel de Serenazgo se actualiza solo y el del Coordinador al recargar. |
| HU-038 | Unidades en el mapa | S01 | Listo |
| HU-039 | Bandeja de Serenazgo | S02 | Listo |
| HU-040 | Registrar un incidente desde la web | — | Pendiente: todavía no tiene pantalla en Figma. |
| HU-041 | Asignar unidad | S03 | Listo |
| HU-042 | Sin unidades disponibles | S03, S07 | Listo |
| HU-044 | Enviar a Serenazgo | C03 | Listo |
| HU-048 | Buscar incidentes | C02 | Listo (por código, dirección o vecino) |
| HU-049 | Filtros | C02 | Listo |
| HU-051 | Reporte anónimo | C07, C03, S03 | Listo en la web: la gestión ve el nombre real. |
| HU-052 | Estado de unidades | S07 | Listo |
| HU-053 | Detalle de unidad | S08 | Listo |
| HU-054 | Seguimiento del caso | S03, C03 | Listo |
| HU-061 | Aviso de incidente nuevo | Serenazgo | A medias: el aviso sale en cualquier pantalla y lleva al caso, pero la campana no tiene lista de notificaciones porque no está diseñada. |
| HU-062 | En ruta y en atención | S03 | Listo |
| HU-063 | Cerrar el caso | S03 | Listo |

---

## Qué funciona y qué es simulado

Funciona de verdad (dentro del navegador):

- Inicio de sesión con validaciones y protección de páginas: sin sesión vuelves al inicio, y un
  rol no puede entrar a las pantallas del otro.
- El buscador de arriba busca en toda la plataforma: secciones, incidentes, publicaciones,
  comunicados y vecinos (o unidades, en Serenazgo). Si buscas a una persona, aparece primero, y
  si otro resultado sale por ella, te dice por qué (por ejemplo, «Reportado por Rosa Medina»).
- Filtros, búsquedas y orden (más recientes o más antiguos) en todas las listas.
- Editar, resolver, descartar y enviar incidentes; aprobar u ocultar publicaciones; publicar
  comunicados.
- Todo el flujo de Serenazgo: asignar unidad, en ruta, en atención y cierre con resultado.
- La cronología y la actividad reciente se van llenando con cada acción.

Es simulado:

- El inicio de sesión (no hay servidor; la contraseña es la misma para las dos cuentas).
- El GPS, la radio, los avisos a la app del vecino y la llegada de incidentes nuevos.
- La hora: la demo empieza a las 08:35 del 2 de noviembre de 2026 y avanza en tiempo real. Si
  pasa de las 14:00 (fin del turno de la mañana), empieza un turno nuevo para que las horas no se
  desordenen.

---

## Responsive, interacciones y accesibilidad

### Tamaños de pantalla

Es el mismo código para todos los tamaños:

- **Escritorio (más de 1280 px):** como en Figma, con el menú fijo a la izquierda.
- **Escritorio pequeño (1025–1280 px):** se reducen márgenes y la columna lateral.
- **Tablet (769–1024 px):** el menú se abre con el botón ☰ y las dos columnas pasan a una.
- **Móvil (hasta 768 px):** todo en una columna, botones de ancho completo y las tablas se
  convierten en tarjetas para que no haya que desplazarse de lado.

### Interacciones

- Validación de formularios: inicio de sesión, editar incidente, crear comunicado y cerrar caso.
- Mensajes de éxito, error, aviso y pantallas vacías.
- Mostrar u ocultar: contraseña, menú de cuenta, ficha médica y revisión de publicación.
- Confirmaciones antes de enviar a Serenazgo, asignar unidad, cerrar caso y cerrar sesión.
- El mapa tiene zoom y sus marcadores llevan al detalle del incidente.

### Accesibilidad

Pasamos las 16 páginas por axe (WCAG 2.1 AA) sin errores y probamos todo solo con teclado.

- Hay un enlace «Saltar al contenido» al presionar Tab, y el foco siempre se ve.
- Esc cierra menús y ventanas, y al cerrar una ventana el foco vuelve al botón que la abrió.
- Todos los campos tienen etiqueta, y los errores se anuncian a los lectores de pantalla.
- Los colores cumplen el contraste mínimo (el texto principal tiene 14:1).
- Las fotos tienen texto alternativo, y se respeta la opción de reducir animaciones.

---

## Decisiones que tomamos

Algunas cosas no son exactamente iguales a Figma. Estas son las principales y por qué:

- **Ruta de navegación (breadcrumb):** solo la dejamos en pantallas que están dentro de otra
  (por ejemplo, Directorio › Perfil vecinal). Cosas como «Panel › Mi perfil» no tenían sentido.
- **Buscador:** Figma solo tiene el campo, así que diseñamos la lista de resultados debajo.
- **Emergencia médica:** es una categoría nueva (INC-0253). Va en un círculo celeste (`#60A5FA`)
  con el ícono oscuro (`#172C45`), en círculo porque se relaciona con el SOS; los tipos de
  incidente usan cuadrado. Igual que el SOS, solo la ve Serenazgo.
- **Leyenda del mapa:** agregamos SOS y Emergencia médica a los seis tipos de incidente.
- **Ficha médica en las tarjetas:** ahora se puede abrir directamente desde la bandeja.
- **Aviso de nuevo incidente:** además del aviso de la bandeja, sale un aviso flotante en
  cualquier pantalla de Serenazgo, porque si estabas en otra sección no te enterabas.
- **Seguimiento:** le pusimos el ícono del tipo de incidente, como en el detalle del Coordinador.
- **Publicaciones pendientes:** el panel decía 6 y Moderación mostraba 3; usamos 3 para que
  coincidan.
- **Criterios de revisión:** para aprobar una publicación hay que marcar los cuatro criterios.
- **Ícono del SOS:** lo achicamos porque se salía de su círculo.
- **Campana y Soporte:** como no tienen pantalla en Figma, la campana lleva a la lista de
  incidentes y Soporte abre un correo.

Figma tampoco tiene todos los datos de algunos incidentes (reportante, descripción u horas de
INC-0247 a INC-0251). Donde falta algo, se muestra «Sin informar».
