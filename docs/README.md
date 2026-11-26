# OeVecino · Plataforma web (Coordinador y Serenazgo)

Frontend de la plataforma web de **OeVecino**, proyecto universitario de seguridad vecinal.
Construido con **HTML5, CSS3 y JavaScript vanilla** a partir del export de Figma (`ai export.zip`).

> **Es una simulación de frontend.** No hay servidor, base de datos ni autenticación real.
> Los datos son ficticios (municipalidad de Santa Aurora, Central Norte) y los cambios se
> guardan solo en el navegador con `localStorage`.

---

## 1. Ejecutar localmente

Las páginas usan rutas relativas, así que basta con un servidor estático:

```bash
# Opción 1: extensión "Live Server" de VS Code → abrir pages/index.html
# Opción 2: Python, desde la carpeta oevecino-web/
python -m http.server 8000
# luego abrir http://localhost:8000/pages/
```

También funciona abriendo `pages/index.html` con doble clic, aunque se recomienda un servidor.

### Cuentas de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Coordinador (Diego Salazar) | `dsalazar@municipalidad.gob.pe` | `OeVecino2026` |
| Serenazgo (María Torres) | `mtorres@municipalidad.gob.pe` | `OeVecino2026` |

Son cuentas **personales** (inicial + apellido) y no por rol (`coordinador@…`), porque la plataforma
registra a una persona como responsable de cada acción (cronología, "Tu sesión es personal").
Usan el mismo dominio que el ejemplo del campo de Figma (`nombre@municipalidad.gob.pe`).

### Modos de demostración (parámetro `?demo=` en la URL)

| URL | Qué muestra |
|---|---|
| `cualquier-pagina.html?demo=reset` | Borra la simulación y vuelve a los datos iniciales de Figma. |
| `coordinador-moderacion.html?demo=vacio` | C06 · Moderación · Vacío |
| `coordinador-comunicados.html?demo=vacio` | C08 · Comunicados · Vacío |
| `serenazgo-incidentes.html?demo=vacio` | S02 · Bandeja vacía |
| `serenazgo-unidades.html?demo=vacio` | S07 · Sin unidades |
| `serenazgo-seguimiento.html?id=INC-0248&demo=sin-senal` | S03 · Seguimiento sin señal |

Otros estados aparecen solos: **sin conexión** (desactiva el wifi o usa "Offline" en las
herramientas del navegador) muestra "Mapa sin conexión" y el error "No pudimos publicar el
comunicado"; a los 15 s en cualquier pantalla de Serenazgo llega el SOS **INC-0252**
(S02 · Nuevo incidente).

---

## 2. Estructura del proyecto

Se respeta la estructura exigida por el profesor. Solo se **agregaron archivos** dentro de
las carpetas existentes (más páginas en `pages/`, iconos, imágenes y fuentes).

```text
oevecino-web/
├── assets/
│   ├── images/      foto-luminaria.png, foto-reportante.png (exportadas de Figma)
│   ├── icons/       SVG originales extraídos del export de Figma (+ menu.svg)
│   ├── fonts/       Nunito variable (woff2, licencia SIL OFL)
│   └── videos/      (vacía)
├── css/
│   └── styles.css   Hoja única organizada por secciones (variables → componentes → páginas → responsive)
├── js/
│   └── main.js      Script único: datos de demo, sesión, componentes y lógica de cada pantalla
├── pages/
│   ├── index.html                       W01 · Inicio de sesión (punto de entrada)
│   ├── coordinador-panel.html           C01 · Dashboard
│   ├── coordinador-incidentes.html      C02 · Lista de incidentes (+ sin resultados)
│   ├── coordinador-incidente.html       C03 · Detalle (No derivado / Derivado / Resuelto / Descartado) + ventanas Editar registro y Derivar
│   ├── coordinador-moderacion.html      C06 · Moderación (+ vacío / sin resultados) + C07 Revisión de publicación
│   ├── coordinador-comunicados.html     C08 · Lista de comunicados (+ vacío)
│   ├── coordinador-nuevo-comunicado.html C09 · Crear comunicado (+ error al publicar)
│   ├── coordinador-directorio.html      C10 · Directorio vecinal (+ sin coincidencias)
│   ├── coordinador-vecino.html          C11 · Perfil vecinal
│   ├── coordinador-perfil.html          W02 · Mi perfil (Coordinador)
│   ├── serenazgo-panel.html             S01 · Dashboard
│   ├── serenazgo-incidentes.html        S02 · Bandeja (+ vacía / nuevo incidente)
│   ├── serenazgo-seguimiento.html       S03 · Seguimiento (sin unidad / con unidad / sin señal / cerrado) + ventanas Asignación, Cierre y Ficha médica
│   ├── serenazgo-unidades.html          S07 · Lista de unidades (+ sin unidades)
│   ├── serenazgo-unidad.html            S08 · Detalle de unidad (+ sin incidente)
│   └── serenazgo-perfil.html            W02 · Mi perfil (Serenazgo)
├── docs/
│   └── README.md
├── favicon.ico
└── .gitignore
```

**Cómo está organizado el código**

- El menú lateral, la barra superior, el menú de cuenta, la ventana "¿Cerrar sesión?" y el
  pie se generan desde `main.js` (funciones `sidebarHtml`, `topbarHtml`…), para no repetir
  el mismo bloque en 15 páginas. Cada página indica su pantalla con `<body data-page="…">`.
- Las ventanas modales usan el elemento nativo `<dialog>` (se cierran con Esc, botón ✕ o clic fuera).
- Los colores, radios y medidas están en variables CSS al inicio de `styles.css`, con los
  valores de `design.json`.
- Los iconos son los SVG originales del export, guardados como archivos y usados con `<img>`.

---

## 3. Matriz de pantallas

| Código | Pantalla | Rol | Componentes principales | Variantes implementadas | Navega a |
|---|---|---|---|---|---|
| W01 | Inicio de sesión | Ambos | Formulario, aviso de error, ilustración | Normal, Campos requeridos, Credenciales incorrectas | C01 o S01 según el rol |
| W02 | Mi perfil | Ambos | Tarjeta de identidad, datos institucionales, asignación, sesión | Coordinador, Serenazgo | Ventana Cerrar sesión → W01 |
| C01 | Dashboard | Coordinador | Indicadores, mapa vecinal, incidente prioritario, alertas, leyenda, actividad | Datos vivos de la simulación | C02, C03, C06 |
| C02 | Lista de incidentes | Coordinador | Buscador, filtros, checkboxes de categoría, tabla, paginación | Lista, Sin resultados | C03 |
| C03 | Detalle de incidente | Coordinador | Datos, reportante, identidad protegida, cronología, validaciones, pasos | No derivado, Derivado, Resuelto, Descartado | Ventanas Editar registro / Derivar |
| C06 | Moderación | Coordinador | Indicadores, pestañas, buscador, tarjetas | Lista, Vacío, Sin resultados | C07, C08 |
| C07 | Revisión de publicación | Coordinador | Ventana con criterios, reportes, decisión | Pendiente, Aprobada, Oculta | C06 |
| C08 | Comunicados | Coordinador | Lista de comunicados | Lista, Vacío | C09, C06 |
| C09 | Crear comunicado | Coordinador | Formulario, vista previa de la app | Normal, validación, error sin conexión | C08 |
| C10 | Directorio vecinal | Coordinador | Buscador, tarjetas de vecinos | Lista, Sin coincidencias | C11 |
| C11 | Perfil vecinal | Coordinador | Identidad, datos del vecino | 6 vecinos | C10 |
| S01 | Dashboard | Serenazgo | 8 indicadores, mapa operativo, atención prioritaria, otros incidentes, actividad | Datos vivos | S02, S03, S07, S08 |
| S02 | Bandeja de incidentes | Serenazgo | Buscador, filtros, tarjetas | Lista, Vacía, Nuevo incidente | S03 |
| S03 | Seguimiento | Serenazgo | Pasos de atención, mapa con recorrido, unidad, cronología, jefe de unidad, resultado | Sin unidad, Con unidad, Sin señal, Caso cerrado | Ventanas Asignación, Cierre, Ficha médica; S08 |
| S07 | Unidades | Serenazgo | Indicadores, filtros, tabla | Lista, Sin unidades | S08 |
| S08 | Detalle de unidad | Serenazgo | Datos, tripulación, incidente asignado | Con incidente, Sin incidente | S03 |
| — | Auxiliares | Ambos | Menú de cuenta, Cerrar sesión, Estado sin conexión, Control (checkbox), Validación editorial | — | — |

C04, C05 y S04–S06 no existen en el export y **no se crearon**.

**User Stories:** el documento de HU no se incluyó en los archivos recibidos, por eso la
columna de HU queda pendiente. Hay que completarla con las descripciones y escenarios Gherkin
antes de declarar qué historias quedan cubiertas.

---

## 4. Funcionalidades

### Implementadas (funcionan en la simulación)

- Inicio de sesión con validación de campos vacíos, credenciales incorrectas y mostrar/ocultar contraseña.
- Protección de páginas por rol (sin sesión → W01; un rol no puede abrir pantallas del otro).
- Menú de cuenta, "Mi perfil" y cierre de sesión con confirmación.
- **Buscador global**: mientras escribes muestra resultados agrupados (Secciones, Incidentes, Publicaciones, Comunicados y Vecinos para el Coordinador; Secciones, Incidentes y Unidades para Serenazgo). Se navega con flechas, Enter abre el resultado y Esc cierra.
- Orden conmutable (más recientes / más antiguos) en Incidentes, Bandeja, Moderación y Comunicados.
- C01: indicadores, mapa e incidente prioritario calculados desde los datos; zoom del mapa; marcadores que abren el detalle.
- C02: búsqueda, filtros por prioridad, estado y categoría, orden por hora, estado sin resultados.
- C03: **Editar registro** (categoría, prioridad, descripción y estado al guardar: No derivado / Resuelto / Descartado), **Enviar a Serenazgo**; los cambios se suman a la cronología y a la actividad reciente.
- C06/C07: pestañas, búsqueda, filtro de categoría, **aprobar / ocultar / cambiar decisión** con los criterios de revisión.
- C08/C09: lista de comunicados, **publicar comunicado** con validación y vista previa en vivo; si no hay conexión, se conserva el texto y aparece el error de Figma.
- C10/C11: búsqueda de vecinos y perfil de cada uno.
- S01: indicadores de incidentes y unidades calculados, mapa operativo, atención prioritaria.
- S02: búsqueda, filtros, orden; llegada simulada de un SOS nuevo con aviso.
- S03: **Asignar unidad** (solo unidades disponibles; variante "No hay unidades disponibles"), **Marcar en ruta**, **Marcar en atención**, **Cerrar caso** (resultado obligatorio), ficha médica, aviso sin señal GPS y "Confirmar por radio".
- S07/S08: indicadores, búsqueda y filtro por estado, detalle con incidente asignado.
- Conexión entre roles: lo que deriva el Coordinador aparece en la bandeja de Serenazgo; lo que hace Serenazgo (recepción, atención, cierre) se refleja en el detalle del Coordinador.

### Simuladas (no son reales)

- Autenticación (contraseña única de demostración, sin servidor).
- Persistencia (solo `localStorage` del navegador).
- Notificaciones a la app del vecino, GPS, radio y llegada de nuevos incidentes.
- Reloj: empieza a las 08:35 del 2 de noviembre de 2026 y avanza en tiempo real.

---

## 5. Cumplimiento de la rúbrica (responsive, interacciones y accesibilidad)

### Adaptación responsive

Un solo código HTML, CSS y JS para todos los tamaños (no hay versiones separadas). Puntos de quiebre en `css/styles.css`, sección 19:

| Tamaño | Ancho | Qué cambia |
|---|---|---|
| Desktop | más de 1280 px | Diseño de Figma a 1440 px: menú lateral fijo, contenido + columna lateral de 360 px. |
| Desktop pequeño | 1025–1280 px | La columna lateral pasa a 320 px y se reducen márgenes. |
| Tablet | 769–1024 px | El menú lateral se vuelve un panel desplegable (botón ☰); las dos columnas pasan a una; indicadores y pasos de atención en 2 columnas. |
| Mobile | hasta 768 px | Una sola columna; el buscador baja a su propia fila; **las tablas se convierten en tarjetas con etiquetas**; botones de ancho completo; ventanas a pantalla casi completa. |

| Criterio de la rúbrica | Dónde se ve |
|---|---|
| Reorganización del contenido / distribución de columnas | Paneles C01 y S01, detalle C03, seguimiento S03: dos columnas → una. |
| Tipografía | Título de 32 px en escritorio y 26 px en móvil; Nunito autoalojada. |
| Navegación | Menú lateral fijo en escritorio, panel desplegable con fondo oscuro en tablet y móvil (se cierra con Esc o tocando fuera). |
| Botones y componentes | Botones de ancho completo en móvil; los botones de los pasos de atención quedan debajo de su paso. |
| Imágenes y recursos | Fotos y mapas escalan con su proporción (`aspect-ratio`); los SVG mantienen su tamaño. |
| Formularios | Filtros de 3 columnas pasan a 1; campos de ancho completo. |
| El contenido no desaparece | Tablas de C02 y S07 como tarjetas en móvil; el nombre del usuario, oculto en la barra móvil, sigue en el menú de cuenta; el código del incidente en el mapa móvil queda en su etiqueta accesible y al tocar el marcador. |

### Interacciones con JavaScript

| Tipo (rúbrica) | Ejemplos en el proyecto |
|---|---|
| Validación de formularios | Inicio de sesión (vacíos y credenciales), Editar registro, Crear comunicado, Cerrar caso (resultado obligatorio). |
| Mensajes y estados | Avisos de éxito, información y advertencia; estados vacíos y sin resultados; error al publicar sin conexión; mapa sin conexión. |
| Mostrar u ocultar información | Ver/ocultar contraseña, menú de cuenta, ficha médica, revisión de publicación, aviso de nuevo incidente. |
| Navegación interactiva | Filas de tabla clicables, buscador global con teclado, menú lateral móvil, mapa con zoom. |
| Filtros | Búsqueda, prioridad, estado, categoría y orden en Incidentes, Bandeja, Moderación, Unidades, Directorio y Comunicados. |
| Selección de opciones | Pestañas de estado, categorías (checkbox), unidad a asignar (radio), resultado de cierre. |
| Confirmaciones | Derivar a Serenazgo, Asignar unidad, Cerrar caso, Cerrar sesión. |
| Retroalimentación | Cronología y actividad reciente se actualizan; contadores y mapa se recalculan; punto de notificación. |

### Accesibilidad (WCAG 2.1 AA)

Verificado con **axe-core** en las 16 páginas: **0 errores**. También se probó el recorrido completo solo con teclado.

| Criterio | Implementación |
|---|---|
| Contraste | Toda la paleta pasa 4,5:1 (texto principal 14:1; secundario `#526277` 6,2:1; amarillo con texto oscuro 9,8:1). Se oscureció un poco el verde de la etiqueta del parque en el mapa (4,42 → 5,1). |
| Jerarquía | Un solo `h1` por página, `h2` para secciones y `h3` para tarjetas; `header`, `nav`, `main`, `aside`, `footer`. |
| Textos alternativos | Fotos con `alt` descriptivo; iconos decorativos con `alt=""`; iconos que comunican algo (categoría, verificado) con texto alternativo. |
| Formularios | Todos los campos con `label`; errores con `aria-invalid`, `aria-describedby` y `role="alert"`. |
| Navegación por teclado | Enlace "Saltar al contenido"; foco visible en todo elemento interactivo; Esc cierra menús, ventanas y el menú móvil; las ventanas (`<dialog>`) devuelven el foco al botón que las abrió; buscador navegable con flechas. |
| Identificación de elementos interactivos | Botones para acciones y enlaces para navegación; estados `aria-pressed`, `aria-expanded`, `aria-current="page"`. |
| Área táctil | Controles del mapa de 24 px (criterio 2.5.8). |
| Movimiento | Se respetan las preferencias de movimiento reducido (`prefers-reduced-motion`). |
| Idioma | `lang="es"` en todas las páginas. |

---

## 6. Decisiones e inconsistencias encontradas

| Tema | Figma | Implementación | Motivo |
|---|---|---|---|
| Breadcrumb | "Inicio › …" en todas las pantallas | Solo en pantallas que están dentro de otra sección: Incidentes › Detalle del incidente, Comunicados › Crear comunicado, Directorio › Perfil vecinal, Incidentes › Seguimiento, Unidades de Serenazgo › Detalle de unidad | Decisión del equipo: el Panel ya es el inicio, y las secciones del menú no cuelgan del Panel ("Panel › Mi perfil" o "Directorio › Directorio vecinal" no aportaban nada). |
| Buscador global | Solo el campo "Buscar en la plataforma" | Panel de resultados agrupados bajo la barra | Figma no define resultados; el texto promete buscar en toda la plataforma. Es un componente nuevo: **validar con el equipo**. |
| Emergencia médica | No existe en Figma | Categoría nueva (INC-0253): círculo `#60A5FA` con el icono en `#172C45` (definido por el equipo; círculo porque se relaciona con SOS, los tipos de incidente usan cuadrado). Visible para Serenazgo en el mapa operativo, la bandeja, el seguimiento y el buscador; igual que SOS, no aparece en la lista del Coordinador | Pedido del equipo. Falta agregarlo en Figma. |
| Leyenda del mapa (C01) | 6 categorías | Se agregaron SOS y Emergencia médica (8 elementos en 4 columnas) | Pedido del equipo: la leyenda debe mostrar todos los tipos, aunque SOS y Emergencia médica solo los atiende Serenazgo. |
| "Ficha médica" en las tarjetas | Texto en negrita | Botón que abre la ficha médica desde la bandeja y el panel | Pedido del equipo: se veía clicable y no hacía nada. |
| Aviso de nuevo incidente | Aviso fijo arriba de la bandeja (S02) | Se mantiene, y además aparece un aviso flotante en cualquier pantalla de Serenazgo | El aviso de arriba no se veía si estabas en el Panel o habías bajado en la lista. |
| Seguimiento (S03) | Sin icono de categoría | Icono del tipo de incidente al inicio de la fila de datos (como en C03) | Pedido del equipo: la cabecera se veía vacía. |
| Texto secundario | El prompt indicaba `#64748B` | `#526277` | Es la variable "Gris-Azul" de `design.json`; fondo `#FFFEFA` y bordes `#D8E0E8` también salen de ahí. |
| Publicaciones pendientes | C01 muestra 6 («Por revisar · Una por categoría»); C06 muestra 3 pendientes | Se calcula desde los datos de C06 (3) y el subtítulo dice «Por revisar en Red Vecinal» | C01 y C06 se contradicen; se priorizó la coherencia entre pantallas. **Confirmar con el equipo.** |
| C11 | El menú resalta "Mi perfil" | Se resalta "Directorio" | El perfil vecinal se abre desde el directorio. |
| C08 | Breadcrumb "Inicio › Avisos › Comunicados" (lista) y "Red vecinal" (vacío) | "Red vecinal" | Coincide con el menú. |
| S07 | SER-007 → "INC-0249 · Accidente"; SER-009 → INC-0246 con icono de vehículo | SER-007 → INC-0247 Accidente; SER-009 → INC-0246 Otros | S01 dice que SER-007 llegó a INC-0247, y INC-0246 es "Otros" en C02/C03. |
| Códigos de pantalla en textos | "(S02)", "(C07)", "desde C06", "vuelve a C08" | Nombres de pantalla ("Moderación", "Comunicados") | Son anotaciones de diseño, no textos para el usuario. |
| Editar registro | Lista de categorías no visible | Solo "Alumbrado defectuoso" y "Otros" | C03: "Puedes editar o derivar los casos de Alumbrado defectuoso u Otros". |
| Criterios de revisión (C07) | Siempre marcados | Interactivos; aprobar exige los 4 marcados | Interpretación de la lista de control. **Confirmar con las HU.** |
| Comunicado en C09 | Formulario ya lleno | Formulario vacío con placeholders | El comunicado de ejemplo ya está publicado en C08. |
| Icono SOS | Glifo de 32 px dentro de un círculo de 60 px | El glifo se escala al 54 % del círculo | Antes ocupaba todo el círculo y se salía. |
| Icono de menú móvil | No existe | `menu.svg` con el mismo trazo que los demás iconos | Necesario para el menú en tablet y móvil. |
| Campana / Soporte | Sin pantalla destino | Campana → lista de incidentes; Soporte y "Contacta al administrador" → correo ficticio | No hay panel de notificaciones ni pantalla de soporte en Figma. |

**Datos complementarios:** Figma no muestra reportante, descripción ni algunos horarios de
INC-0247 a INC-0251, ni la cronología completa de esos casos. Se muestran como "Sin informar"
(convención de la Ficha médica) o con registros mínimos (hora del reporte, origen). Las
posiciones de algunos incidentes en el mapa operativo son ilustrativas.

---

## 7. Pendientes

1. **Documento de User Stories**: completar la matriz de HU y revisar los criterios de aceptación (por ejemplo, los criterios de C07 y qué roles cambian cada estado).
2. Confirmar el valor de "Publicaciones vecinales pendientes" (6 o 3).
3. Agregar en Figma: Emergencia médica, el panel de resultados del buscador y el aviso flotante de nuevo incidente.
4. La paginación es visual (todos los registros caben en una página).
5. El filtro de fecha de S02 tiene solo "Hoy, 2 nov.", igual que el diseño.
6. El icono `tipo-emergenciamedica.svg` se usa tal cual (`tile-emergenciamedica.svg`, trazo `#172C45`). Los íconos `tipo-*.svg` y `check.svg` que estaban en el repositorio se conservaron, pero no se usan (se usan los `tile-*.svg` del export). Los íconos con el mismo nombre (`panel`, `incidentes`, `redvecinal`, `directorio`, `perfil`, `soporte`, `lupa`, `campana`, `calendario`, `logo`, `cerrar`) se reemplazaron por los SVG originales del export, que conservan la caja de 20×20 y el alineado de Figma.

---

## 8. Publicar en GitHub Pages

La estructura no tiene `index.html` en la raíz, así que se publica tal cual y se entra por `/pages/`:

1. Sube la carpeta `oevecino-web` como repositorio (el contenido de `oevecino-web` debe quedar en la raíz del repo).
2. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. Abre `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/pages/`.

Si el profesor lo permite, se puede agregar un `index.html` en la raíz que redirija a
`pages/index.html` para que la URL base funcione. **No se agregó** para no cambiar la estructura exigida.
