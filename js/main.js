/* =========================================================================
   OeVecino · Plataforma web (Coordinador y Serenazgo)
   JavaScript único del proyecto (sin frameworks).

   IMPORTANTE: es una SIMULACIÓN de frontend. No existe servidor ni
   autenticación real. Los datos son ficticios y se guardan en el
   navegador con localStorage para que las acciones tengan resultados
   visibles y coherentes entre pantallas.

   Índice
   1.  Configuración y constantes
   2.  Utilidades
   3.  Datos de demostración
   4.  Estado (localStorage)
   5.  Sesión y reloj de demostración
   6.  Componentes compartidos (sidebar, topbar, modales, etiquetas…)
   7.  Mapa
   8.  W01 · Inicio de sesión
   9.  Coordinador: C01 Panel
   10. Coordinador: C02 Lista de incidentes
   11. Coordinador: C03 Detalle de incidente
   12. Coordinador: C06/C07 Moderación
   13. Coordinador: C08/C09 Comunicados
   14. Coordinador: C10/C11 Directorio
   15. W02 · Mi perfil
   16. Serenazgo: S01 Panel
   17. Serenazgo: S02 Bandeja
   18. Serenazgo: S03 Seguimiento
   19. Serenazgo: S07/S08 Unidades
   20. Arranque
   ========================================================================= */

"use strict";

/* 1. Configuración y constantes ----------------------------------------- */
const STORAGE_KEY = "oevecino-demo-v2";
const SESSION_KEY = "oevecino-sesion";
const ICONS = "../assets/icons/";
const IMAGES = "../assets/images/";
const DEMO_PASSWORD = "OeVecino2026";
const FECHA_DEMO = "Lunes, 2 de noviembre de 2026";

const USERS = {
    coordinador: {
        rol: "coordinador",
        nombre: "Diego Salazar",
        iniciales: "DS",
        rolNombre: "Coordinador",
        cargo: "Coordinador de seguridad",
        correo: "dsalazar@municipalidad.gob.pe",
        funcion: "Coordinación de incidentes, alertas vecinales y comunicación municipal.",
        badge: "role-blue",
        avatar: "",
        inicio: "coordinador-panel.html"
    },
    serenazgo: {
        rol: "serenazgo",
        nombre: "María Torres",
        iniciales: "MT",
        rolNombre: "Serenazgo",
        cargo: "Operadora de central",
        correo: "mtorres@municipalidad.gob.pe",
        funcion: "Atención de incidentes y seguimiento de unidades de Serenazgo.",
        badge: "role-yellow",
        avatar: "identity-avatar--yellow",
        inicio: "serenazgo-panel.html"
    }
};

const NAVIGATION = {
    coordinador: [
        { id: "panel", texto: "Panel", icono: "panel.svg", href: "coordinador-panel.html" },
        { id: "incidentes", texto: "Incidentes", icono: "incidentes.svg", href: "coordinador-incidentes.html" },
        { id: "red-vecinal", texto: "Red Vecinal", icono: "redvecinal.svg", href: "coordinador-moderacion.html" },
        { id: "directorio", texto: "Directorio", icono: "directorio.svg", href: "coordinador-directorio.html" },
        { id: "perfil", texto: "Mi perfil", icono: "perfil.svg", href: "coordinador-perfil.html" }
    ],
    serenazgo: [
        { id: "panel", texto: "Panel", icono: "panel.svg", href: "serenazgo-panel.html" },
        { id: "incidentes", texto: "Incidentes", icono: "incidentes.svg", href: "serenazgo-incidentes.html" },
        { id: "unidades", texto: "Unidades de Serenazgo", icono: "unidades.svg", href: "serenazgo-unidades.html" },
        { id: "perfil", texto: "Mi perfil", icono: "perfil.svg", href: "serenazgo-perfil.html" }
    ]
};

const CATEGORIES = {
    robo: { nombre: "Robo", clave: "robo" },
    actividadsospechosa: { nombre: "Actividad sospechosa", clave: "actividadsospechosa" },
    vehiculosospechoso: { nombre: "Vehículo sospechoso", clave: "vehiculosospechoso" },
    accidentetransito: { nombre: "Accidente de tránsito", clave: "accidentetransito" },
    alumbradodefectuoso: { nombre: "Alumbrado defectuoso", clave: "alumbradodefectuoso" },
    otros: { nombre: "Otros", clave: "otros" },
    sos: { nombre: "SOS", clave: "sos" },
    emergenciamedica: { nombre: "Emergencia médica", clave: "emergenciamedica" }
};

/* Categorías que el Coordinador puede editar o derivar (texto de C03). */
const EDITABLE_CATEGORIES = ["alumbradodefectuoso", "otros"];

const PRIORITY = {
    alta: { texto: "Alta", badge: "alta" },
    media: { texto: "Media", badge: "warning" },
    baja: { texto: "Baja", badge: "neutral" }
};

const COORD_STATUS = {
    "no-derivado": { texto: "No derivado", badge: "warning" },
    derivado: { texto: "Derivado", badge: "info" },
    resuelto: { texto: "Resuelto", badge: "success" },
    descartado: { texto: "Descartado", badge: "neutral" },
    cerrado: { texto: "Cerrado", badge: "success" }
};

const SER_STATUS = {
    "sin-asignar": { texto: "Sin asignar", badge: "warning" },
    despachado: { texto: "Despachado", badge: "info" },
    "en-ruta": { texto: "En ruta", badge: "info" },
    "en-atencion": { texto: "En atención", badge: "info" },
    cerrado: { texto: "Cerrado", badge: "success" }
};

const UNIT_STATUS = {
    disponible: { texto: "Disponible", badge: "success" },
    "en-ruta": { texto: "En ruta", badge: "info" },
    "en-atencion": { texto: "En atención", badge: "info" },
    "fuera-servicio": { texto: "Fuera de servicio", badge: "neutral" }
};

const PUB_STATUS = {
    pendiente: { texto: "Pendiente", badge: "warning" },
    aprobada: { texto: "Aprobada", badge: "success" },
    oculta: { texto: "Oculta", badge: "neutral" }
};

const CLOSE_RESULTS = {
    atendido: "Atendido",
    "falsa-alarma": "Falsa alarma",
    "derivado-pnp": "Derivado a la PNP"
};

/* 2. Utilidades ---------------------------------------------------------- */
function qs(selector, scope = document) {
    return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function icon(nombre, alt = "", clase = "") {
    return `<img src="${ICONS}${nombre}" alt="${escapeHtml(alt)}"${clase ? ` class="${clase}"` : ""}>`;
}

function getParam(nombre) {
    return new URLSearchParams(window.location.search).get(nombre);
}

/* Normaliza texto para búsquedas sin tildes ni mayúsculas. */
function normalize(texto) {
    return String(texto ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .trim();
}

function timeToMinutes(hora) {
    const [h, m] = String(hora).split(":").map(Number);
    return h * 60 + m;
}

function minutesToTime(totalMin) {
    const h = Math.floor(totalMin / 60) % 24;
    const m = totalMin % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function setText(selector, texto, scope = document) {
    const el = qs(selector, scope);
    if (el) {
        el.textContent = texto;
    }
}

function plural(numero, singular, pluralTexto) {
    return `${numero} ${numero === 1 ? singular : pluralTexto}`;
}

/* 3. Datos de demostración ----------------------------------------------
   Datos ficticios tomados de los mockups de Figma. Los campos marcados
   como "complemento" no aparecen en Figma y se agregaron solo para que la
   simulación funcione (se documentan en docs/README.md). */
const DEMO_DATA = {
    incidentes: [
        {
            id: "INC-0254", categoria: "alumbradodefectuoso", prioridad: "media",
            direccion: "Calle Las Palmeras 180", sector: "Sector Norte", referencia: "",
            hora: "08:30", origen: "App del vecino",
            descripcion: "La luminaria frente al número 180 no enciende desde anoche. La vereda y el cruce peatonal quedan a oscuras. Se requiere revisión del poste junto a la esquina.",
            foto: "foto-reportante.png",
            reportante: { nombre: "Lucía Vargas", celular: "944 238 670", correo: "lucia.vargas@example.org" },
            validaciones: { total: 4, ultima: "08:34" },
            estadoCoord: "no-derivado", estadoSer: null, unidad: null, fichaMedica: null,
            mapa: { marcador: [70, 238], alerta: [170, 284] },
            cronologiaCoord: [
                { hora: "08:33", titulo: "Registro editado", detalle: "Prioridad de baja a media. Se añadió la referencia del cruce peatonal a la descripción.", responsable: "Diego Salazar · Coordinador" },
                { hora: "08:30", titulo: "Reporte recibido", detalle: "Registro creado desde la app del vecino.", responsable: "Lucía Vargas · Vecino" }
            ]
        },
        {
            id: "INC-0253", categoria: "emergenciamedica", prioridad: "alta",
            direccion: "Av. Los Cedros 150", sector: "Sector Norte", referencia: "",
            hora: "08:32", origen: "App del vecino",
            descripcion: "", foto: null,
            reportante: { nombre: "Carlos Paredes" }, validaciones: null,
            estadoCoord: null, estadoSer: "sin-asignar", unidad: null,
            fichaMedica: { nombre: "Carlos Paredes", sangre: "", alergias: "", enfermedades: "", seguro: "" },
            mapaOps: [330, 175],
            cronologiaSer: [
                { hora: "08:32", titulo: "Emergencia médica recibida · Ficha médica disponible", detalle: "Carlos Paredes solicitó atención médica desde su ubicación.", responsable: "Carlos Paredes · Origen: App del vecino" }
            ]
        },
        {
            id: "INC-0251", categoria: "robo", prioridad: "alta",
            direccion: "Jr. Los Jazmines 120", sector: "Sector Norte", referencia: "",
            hora: "08:29", origen: "App del vecino",
            descripcion: "", foto: null, reportante: null, validaciones: null,
            estadoCoord: "derivado", estadoSer: "sin-asignar", unidad: null, fichaMedica: null,
            mapa: { marcador: [45, 94], alerta: [145, 140] },
            mapaOps: [168, 97],
            pasosCoord: { derivado: { hora: "08:29", quien: "App del vecino" }, recibido: { hora: "08:29", quien: "Central Norte" } },
            cronologiaCoord: [
                { hora: "08:29", titulo: "Reporte recibido", detalle: "Registro creado desde la app del vecino y enviado a Serenazgo.", responsable: "Vecino" }
            ],
            cronologiaSer: [
                { hora: "08:29", titulo: "Nuevo reporte", detalle: "Robo en Jr. Los Jazmines.", responsable: "Vecino · Origen: App del vecino" }
            ]
        },
        {
            id: "INC-0250", categoria: "actividadsospechosa", prioridad: "media",
            direccion: "Parque Las Flores", sector: "", referencia: "Ingreso principal",
            hora: "08:27", origen: "App del vecino",
            descripcion: "", foto: null, reportante: null, validaciones: null,
            estadoCoord: "derivado", estadoSer: "sin-asignar", unidad: null, fichaMedica: null,
            mapa: { marcador: [245, 55], alerta: [345, 101] },
            mapaOps: [430, 40],
            pasosCoord: { derivado: { hora: "08:27", quien: "App del vecino" }, recibido: { hora: "08:27", quien: "Central Norte" } },
            cronologiaCoord: [
                { hora: "08:27", titulo: "Reporte recibido", detalle: "Registro creado desde la app del vecino y enviado a Serenazgo.", responsable: "Vecino" }
            ],
            cronologiaSer: [
                { hora: "08:27", titulo: "Nuevo reporte", detalle: "Actividad sospechosa en Parque Las Flores.", responsable: "Vecino · Origen: App del vecino" }
            ]
        },
        {
            id: "INC-0249", categoria: "vehiculosospechoso", prioridad: "media",
            direccion: "Av. Primavera 640", sector: "Sector Norte", referencia: "",
            hora: "08:25", origen: "App del vecino",
            descripcion: "", foto: null, reportante: null, validaciones: null,
            estadoCoord: "derivado", estadoSer: "en-ruta", unidad: "SER-015", fichaMedica: null,
            mapa: { marcador: [475, 94], alerta: [575, 140] },
            mapaOps: [560, 150],
            pasosCoord: { derivado: { hora: "08:25", quien: "App del vecino" }, recibido: { hora: "08:25", quien: "Central Norte" } },
            pasosSer: { despachado: { hora: "08:26", quien: "María Torres · Central" }, enRuta: { hora: "08:26", quien: "Mario Soto · Jefe de unidad" } },
            cronologiaCoord: [
                { hora: "08:25", titulo: "Reporte recibido", detalle: "Registro creado desde la app del vecino y enviado a Serenazgo.", responsable: "Vecino" }
            ],
            cronologiaSer: [
                { hora: "08:26", titulo: "Despachado · SER-015 asignada", detalle: "María Torres asignó SER-015, placa EGU-515.", responsable: "María Torres · Origen: Central web" },
                { hora: "08:25", titulo: "Nuevo reporte", detalle: "Vehículo sospechoso en Av. Primavera 640.", responsable: "Vecino · Origen: App del vecino" }
            ]
        },
        {
            id: "INC-0248", categoria: "sos", prioridad: "alta",
            direccion: "Av. Los Olivos 420", sector: "Sector Norte", referencia: "",
            hora: "08:24", origen: "App del vecino",
            descripcion: "", foto: null,
            reportante: { nombre: "Elena Mendoza" }, validaciones: null,
            estadoCoord: null, estadoSer: "en-ruta", unidad: "SER-012",
            fichaMedica: { nombre: "Elena Mendoza", sangre: "", alergias: "", enfermedades: "", seguro: "" },
            mapaOps: [445, 126],
            gps: { estado: "activo", ultima: "08:30:00", llegada: "Llegada estimada: 2 min · 650 m." },
            pasosSer: { despachado: { hora: "08:27", quien: "María Torres · Central" }, enRuta: { hora: "08:28", quien: "Luis Rojas · Jefe de unidad" } },
            avisoSer: { tipo: "success", titulo: "Patrulla en camino", texto: "Mensaje entregado a la app del vecino a las 08:27. María Torres asignó SER-012 y registró el estado Despachado." },
            actualizacionJefe: { autor: "Luis Rojas · SER-012", texto: "En camino por Av. Central. Acceso despejado por Jr. La Unión.", hora: "08:29", origen: "App de unidad" },
            cronologiaSer: [
                { hora: "08:28", titulo: "Unidad en ruta", detalle: "Luis Rojas confirmó la salida hacia Av. Los Olivos 420.", responsable: "Luis Rojas · Origen: App de unidad" },
                { hora: "08:27", titulo: "Despachado · SER-012 asignada", detalle: "María Torres asignó SER-012, placa EGU-412. Notificación enviada al vecino.", responsable: "María Torres · Origen: Central web" },
                { hora: "08:25", titulo: "Reporte validado por la central", detalle: "María Torres confirmó la dirección y la prioridad alta del SOS.", responsable: "María Torres · Origen: Central web" },
                { hora: "08:24", titulo: "SOS recibido · Ficha médica disponible", detalle: "Elena Mendoza solicitó apoyo desde su ubicación.", responsable: "Elena Mendoza · Origen: App del vecino" }
            ]
        },
        {
            id: "INC-0247", categoria: "accidentetransito", prioridad: "alta",
            direccion: "Av. Central con Jr. La Unión", sector: "", referencia: "",
            hora: "08:18", origen: "App del vecino",
            descripcion: "", foto: null, reportante: null, validaciones: null,
            estadoCoord: "derivado", estadoSer: "en-atencion", unidad: "SER-007",
            fichaMedica: { nombre: "", sangre: "", alergias: "", enfermedades: "", seguro: "" },
            mapa: { marcador: [420, 216], alerta: [520, 262] },
            mapaOps: [250, 250],
            pasosCoord: { derivado: { hora: "08:18", quien: "App del vecino" }, recibido: { hora: "08:18", quien: "Central Norte" }, atencion: { hora: "08:22", quien: "Ana Vega" } },
            pasosSer: { despachado: { hora: "08:19", quien: "María Torres · Central" }, enRuta: { hora: "08:19", quien: "Ana Vega · Jefa de unidad" }, enAtencion: { hora: "08:22", quien: "Ana Vega · Jefa de unidad" } },
            cronologiaCoord: [
                { hora: "08:22", titulo: "Atención iniciada", detalle: "Serenazgo confirmó la llegada de la unidad al lugar.", responsable: "Ana Vega · Serenazgo" },
                { hora: "08:18", titulo: "Reporte recibido", detalle: "Registro creado desde la app del vecino y enviado a Serenazgo.", responsable: "Vecino" }
            ],
            cronologiaSer: [
                { hora: "08:22", titulo: "Atención iniciada", detalle: "Ana Vega confirmó llegada de SER-007 a INC-0247.", responsable: "Ana Vega · Origen: App de unidad" },
                { hora: "08:18", titulo: "Nuevo reporte", detalle: "Accidente de tránsito en Av. Central con Jr. La Unión.", responsable: "Vecino · Origen: App del vecino" }
            ]
        },
        {
            id: "INC-0246", categoria: "otros", prioridad: "baja",
            direccion: "Jr. La Unión 215", sector: "Sector Centro", referencia: "",
            hora: "08:05", origen: "App del vecino",
            descripcion: "Un vehículo bloquea el acceso peatonal de la vivienda. La vecina solicita apoyo para despejar el ingreso.",
            foto: null,
            reportante: { nombre: "Rosa Medina", celular: "955 210 648", correo: "rosa.medina@example.org" },
            validaciones: { total: 4, ultima: "08:10" },
            estadoCoord: "derivado", estadoSer: "en-atencion", unidad: "SER-009", derivadoPorCoordinador: true, fichaMedica: null,
            mapa: { marcador: [245, 155], alerta: [345, 201] },
            mapaOps: [560, 245],
            pasosCoord: { derivado: { hora: "08:12", quien: "Diego Salazar" }, recibido: { hora: "08:15", quien: "María Torres" }, atencion: { hora: "08:20", quien: "María Torres" } },
            pasosSer: { despachado: { hora: "08:15", quien: "María Torres · Central" }, enRuta: { hora: "08:15", quien: "Daniel Ruiz · Jefe de unidad" }, enAtencion: { hora: "08:20", quien: "María Torres · Central" } },
            cronologiaCoord: [
                { hora: "08:20", titulo: "Atención iniciada", detalle: "Serenazgo confirmó el inicio de la atención del reporte.", responsable: "María Torres · Serenazgo" },
                { hora: "08:12", titulo: "Enviado a Serenazgo", detalle: "Caso incorporado a la bandeja de incidentes de Serenazgo.", responsable: "Diego Salazar · Coordinador" },
                { hora: "08:08", titulo: "Registro editado", detalle: "Categoría: Otros · Se precisó la descripción del acceso obstruido.", responsable: "Diego Salazar · Coordinador" },
                { hora: "08:05", titulo: "Reporte recibido", detalle: "Registro creado desde la app del vecino.", responsable: "Rosa Medina · Vecino" }
            ],
            cronologiaSer: [
                { hora: "08:20", titulo: "Atención iniciada", detalle: "María Torres confirmó el inicio de la atención del reporte.", responsable: "María Torres · Origen: Central web" },
                { hora: "08:12", titulo: "Derivado por el Coordinador", detalle: "Diego Salazar envió el caso a la bandeja de Serenazgo.", responsable: "Diego Salazar · Origen: Coordinación" }
            ]
        },
        {
            id: "INC-0245", categoria: "alumbradodefectuoso", prioridad: "media",
            direccion: "Av. Los Cedros 90", sector: "Sector Norte", referencia: "",
            hora: "07:40", origen: "App del vecino",
            descripcion: "Luminaria intermitente frente al ingreso del parque. Se solicitó revisión del punto de alumbrado.",
            foto: null,
            reportante: { nombre: "Carlos Paredes", celular: "966 314 027", correo: "carlos.paredes@example.org" },
            validaciones: { total: 4, ultima: "07:48" },
            estadoCoord: "resuelto", estadoSer: null, unidad: null, fichaMedica: null,
            avisoCoord: { tipo: "success", titulo: "Caso resuelto · 08:22", texto: "Diego Salazar confirmó el restablecimiento del alumbrado. Ya no aparece entre los incidentes activos de la app." },
            cronologiaCoord: [
                { hora: "08:22", titulo: "Estado cambiado a Resuelto", detalle: "Alumbrado restablecido y confirmado con el vecino. Retirado de activos en la app.", responsable: "Diego Salazar · Coordinador" },
                { hora: "07:50", titulo: "Registro editado", detalle: "Prioridad de baja a media; se precisó el punto de alumbrado.", responsable: "Diego Salazar · Coordinador" },
                { hora: "07:40", titulo: "Reporte recibido", detalle: "Registro creado desde la app del vecino.", responsable: "Carlos Paredes · Vecino" }
            ]
        },
        {
            id: "INC-0244", categoria: "otros", prioridad: "baja",
            direccion: "Parque Las Flores", sector: "Sector Norte", referencia: "",
            hora: "07:15", origen: "App del vecino",
            descripcion: "Se reportó una acumulación de residuos junto al ingreso del parque. El mismo hecho ya estaba registrado en INC-0243.",
            foto: null,
            reportante: { nombre: "Ana López", celular: "977 641 082", correo: "ana.lopez@example.org" },
            validaciones: { total: 1, ultima: "07:20" },
            estadoCoord: "descartado", estadoSer: null, unidad: null, fichaMedica: null,
            avisoCoord: { tipo: "info", titulo: "Caso descartado · 08:10", texto: "Diego Salazar identificó un reporte duplicado de INC-0243. No cuenta como activo y se conserva en el historial." },
            cronologiaCoord: [
                { hora: "08:10", titulo: "Estado cambiado a Descartado", detalle: "Reporte duplicado de INC-0243. Se conserva para consulta, sin contar como activo.", responsable: "Diego Salazar · Coordinador" },
                { hora: "07:25", titulo: "Registro revisado", detalle: "Se verificaron la dirección y la coincidencia con el reporte anterior.", responsable: "Diego Salazar · Coordinador" },
                { hora: "07:15", titulo: "Reporte recibido", detalle: "Registro creado desde la app del vecino.", responsable: "Ana López · Vecino" }
            ]
        }
    ],

    /* Incidente que llega durante la simulación (S02 · Nuevo incidente). */
    incidenteEntrante: {
        id: "INC-0252", categoria: "sos", prioridad: "alta",
        direccion: "Calle Las Acacias 82", sector: "Sector Norte", referencia: "",
        hora: "08:31", origen: "App del vecino",
        descripcion: "", foto: null, reportante: null, validaciones: null,
        estadoCoord: null, estadoSer: "sin-asignar", unidad: null,
        fichaMedica: { nombre: "", sangre: "", alergias: "", enfermedades: "", seguro: "" },
        mapaOps: [520, 60],
        cronologiaSer: [
            { hora: "08:31", titulo: "SOS recibido · Ficha médica disponible", detalle: "Solicitud de apoyo enviada desde la app del vecino.", responsable: "Vecino · Origen: App del vecino" }
        ]
    },

    unidades: [
        { id: "SER-012", tipo: "Patrullero", placa: "EGU-412", estado: "en-ruta", jefe: "Luis Rojas", jefeEtiqueta: "Jefe de unidad", conductor: "Pedro Núñez", turno: "Mañana · 06:00–14:00", radio: "Canal 3 · Central Norte", incidente: "INC-0248", mapaOps: [250, 205], distancias: { "INC-0248": "A 650 m" } },
        { id: "SER-018", tipo: "Patrullero", placa: "EGU-618", estado: "disponible", jefe: "Carla Díaz", jefeEtiqueta: "Jefa de unidad", conductor: "José Paredes", turno: "Mañana · 06:00–14:00", radio: "", incidente: null, mapaOps: [530, 226], distancias: { "INC-0248": "A 1,2 km" } },
        { id: "SER-021", tipo: "Patrullero", placa: "EGU-721", estado: "disponible", jefe: "Rosa Silva", jefeEtiqueta: "Jefa de unidad", conductor: "Miguel León", turno: "Mañana · 06:00–14:00", radio: "", incidente: null, distancias: { "INC-0248": "A 1,8 km" } },
        { id: "SER-024", tipo: "Patrullero", placa: "EGU-824", estado: "disponible", jefe: "Jorge Castro", jefeEtiqueta: "Jefe de unidad", conductor: "Lucía Ramos", turno: "Mañana · 06:00–14:00", radio: "", incidente: null, distancias: {} },
        { id: "SER-015", tipo: "Patrullero", placa: "EGU-515", estado: "en-ruta", jefe: "Mario Soto", jefeEtiqueta: "Jefe de unidad", conductor: "César Vidal", turno: "Mañana · 06:00–14:00", radio: "", incidente: "INC-0249", distancias: {} },
        { id: "SER-007", tipo: "Patrullero", placa: "EGU-307", estado: "en-atencion", jefe: "Ana Vega", jefeEtiqueta: "Jefa de unidad", conductor: "Raúl Medina", turno: "Mañana · 06:00–14:00", radio: "", incidente: "INC-0247", distancias: {} },
        { id: "SER-009", tipo: "Patrullero", placa: "EGU-309", estado: "en-atencion", jefe: "Daniel Ruiz", jefeEtiqueta: "Jefe de unidad", conductor: "Sofía Pérez", turno: "Mañana · 06:00–14:00", radio: "", incidente: "INC-0246", distancias: {} },
        { id: "SER-030", tipo: "Patrullero", placa: "EGU-930", estado: "fuera-servicio", jefe: "", jefeEtiqueta: "", conductor: "", turno: "", radio: "", incidente: null, nota: "Mantenimiento programado", distancias: {} }
    ],

    publicaciones: [
        {
            id: "PUB-01", titulo: "Cruce sin iluminación en Las Palmeras", autor: "Lucía Vargas", fecha: "2 nov.", fechaLarga: "2 nov. de 2026", hora: "08:40", orden: 2 * 1440 + 520,
            sector: "Sector Norte", estado: "pendiente", anonimo: true, categoria: "alumbradodefectuoso",
            texto: "La luminaria de la esquina no enciende desde anoche. La vereda y el cruce peatonal quedan a oscuras. Solicito revisar el punto de alumbrado.",
            foto: "foto-luminaria.png", fotoTexto: "Foto adjunta · Luminaria en la vía pública",
            ubicacion: "Calle Las Palmeras, cruce peatonal · Sector Norte · Santa Aurora",
            reportes: [
                { hora: "08:48", motivo: "Información por confirmar (1)" },
                { hora: "08:45", motivo: "Posible duplicado (1)" }
            ],
            reportesRevisados: false, validaciones: 0, decision: null
        },
        {
            id: "PUB-02", titulo: "Horario de uso del parque Las Flores", autor: "Carlos Paredes", fecha: "2 nov.", fechaLarga: "2 nov. de 2026", hora: "08:10", orden: 2 * 1440 + 490,
            sector: "Sector Norte", estado: "aprobada", anonimo: false, categoria: "otros",
            texto: "¿Podemos confirmar el horario de apertura del parque? Sería útil contar con la información de la municipalidad.",
            foto: null, ubicacion: "Sector Norte · Santa Aurora",
            reportes: [{ hora: "", motivo: "Reporte recibido (1)" }], reportesRevisados: false, validaciones: 0, decision: null
        },
        {
            id: "PUB-03", titulo: "Intercambio de libros en la plaza", autor: "Ana López", fecha: "2 nov.", fechaLarga: "2 nov. de 2026", hora: "08:50", orden: 2 * 1440 + 530,
            sector: "Sector Centro", estado: "pendiente", anonimo: false, categoria: "otros",
            texto: "Propongo organizar un intercambio de libros este domingo en la plaza. ¿Quiénes se animan a participar?",
            foto: null, ubicacion: "Sector Centro · Santa Aurora", reportes: [], reportesRevisados: true, validaciones: 0, decision: null
        },
        {
            id: "PUB-04", titulo: "Cuidemos las veredas del barrio", autor: "Rosa Medina", fecha: "2 nov.", fechaLarga: "2 nov. de 2026", hora: "08:00", orden: 2 * 1440 + 480,
            sector: "Sector Centro", estado: "aprobada", anonimo: false, categoria: "otros",
            texto: "Recordemos dejar libre el paso peatonal para que todos podamos transitar con seguridad.",
            foto: null, ubicacion: "Sector Centro · Santa Aurora", reportes: [], reportesRevisados: true, validaciones: 0, decision: null
        },
        {
            id: "PUB-05", titulo: "Consulta sobre una actividad vecinal", autor: "Miguel León", fecha: "2 nov.", fechaLarga: "2 nov. de 2026", hora: "07:30", orden: 2 * 1440 + 450,
            sector: "Sector Sur", estado: "oculta", anonimo: false, categoria: "otros",
            texto: "Quisiera conocer qué actividades comunitarias hay programadas para esta semana.",
            foto: null, ubicacion: "Sector Sur · Santa Aurora", reportes: [], reportesRevisados: true, validaciones: 0, decision: null
        },
        {
            id: "PUB-06", titulo: "Banca del parque necesita mantenimiento", autor: "José Paredes", fecha: "1 nov.", fechaLarga: "1 nov. de 2026", hora: "18:20", orden: 1 * 1440 + 1100,
            sector: "Sector Sur", estado: "pendiente", anonimo: false, categoria: "otros",
            texto: "Una banca junto al sendero tiene una tabla suelta. Solicito una revisión para que pueda usarse con seguridad.",
            foto: null, ubicacion: "Sector Sur · Santa Aurora", reportes: [], reportesRevisados: true, validaciones: 0, decision: null
        }
    ],

    comunicados: [
        {
            id: "COM-03", titulo: "Jornada de limpieza en el parque Las Flores", fecha: "2 nov. de 2026", hora: "09:00", orden: 3 * 1440 + 540, autor: "Diego Salazar",
            contenido: "Este sábado 7 de noviembre, de 9:00 a 11:00, nos reuniremos en el ingreso principal del parque Las Flores para una jornada de limpieza vecinal.\n\nTrae guantes reutilizables y una botella de agua. La junta vecinal entregará bolsas y coordinará la recolección. ¡Cuidemos juntos nuestro barrio!",
            nuevo: true
        },
        { id: "COM-02", titulo: "Reunión de la junta vecinal de noviembre", fecha: "1 nov. de 2026", hora: "17:00", orden: 2 * 1440 + 1020, autor: "Diego Salazar", contenido: "Revisaremos propuestas para mejorar los espacios comunes del barrio.", nuevo: false },
        { id: "COM-01", titulo: "Mantengamos libres los accesos peatonales", fecha: "30 oct. de 2026", hora: "10:00", orden: 600, autor: "Diego Salazar", contenido: "Respetemos el paso de peatones y cuidemos la accesibilidad de nuestras veredas.", nuevo: false }
    ],

    vecinos: [
        { id: "ana-lopez", nombre: "Ana López", iniciales: "AL", sector: "Sector Centro", celular: "977 641 082" },
        { id: "carlos-paredes", nombre: "Carlos Paredes", iniciales: "CP", sector: "Sector Norte", celular: "966 314 027" },
        { id: "jose-paredes", nombre: "José Paredes", iniciales: "JP", sector: "Sector Sur", celular: "" },
        { id: "lucia-vargas", nombre: "Lucía Vargas", iniciales: "LV", sector: "Sector Norte", celular: "944 238 670" },
        { id: "miguel-leon", nombre: "Miguel León", iniciales: "ML", sector: "Sector Sur", celular: "" },
        { id: "rosa-medina", nombre: "Rosa Medina", iniciales: "RM", sector: "Sector Centro", celular: "955 210 648" }
    ],

    actividadCoord: [
        { hora: "08:33", titulo: "Registro editado", texto: "INC-0254 · Prioridad de baja a media. Diego Salazar · Coordinador." },
        { hora: "08:22", titulo: "Caso resuelto", texto: "INC-0245 · Alumbrado restablecido. Diego Salazar · Coordinador." },
        { hora: "08:12", titulo: "Derivación confirmada", texto: "INC-0246 · Enviado a Serenazgo. Diego Salazar · Coordinador." }
    ],

    actividadSer: [
        { hora: "08:29", titulo: "Nuevo reporte", texto: "INC-0251 · Robo en Jr. Los Jazmines. Origen: app del vecino." },
        { hora: "08:28", titulo: "Unidad en ruta", texto: "Luis Rojas confirmó salida de SER-012 para INC-0248. Origen: app de unidad." },
        { hora: "08:22", titulo: "Atención iniciada", texto: "Ana Vega confirmó llegada de SER-007 a INC-0247. Origen: app de unidad." }
    ],

    casosAtendidosBase: 18,
    entranteRecibido: false,
    entranteVisto: false
};

/* 4. Estado (localStorage) ---------------------------------------------- */
let state = null;

function cloneData(datos) {
    return JSON.parse(JSON.stringify(datos));
}

function loadState() {
    try {
        const guardado = localStorage.getItem(STORAGE_KEY);
        state = guardado ? JSON.parse(guardado) : cloneData(DEMO_DATA);
    } catch (error) {
        state = cloneData(DEMO_DATA);
    }
    if (!state.relojInicio) {
        state.relojInicio = Date.now();
        saveState();
    }
    return state;
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.warn("No se pudo guardar la simulación en este navegador.", error);
    }
}

function resetState() {
    localStorage.removeItem(STORAGE_KEY);
    loadState();
}

/* Modo de demostración por URL (?demo=vacio, ?demo=sin-senal, ?demo=reset)
   para revisar estados de Figma que dependen de condiciones externas. */
function demoMode() {
    return getParam("demo") || "";
}

function getIncident(id) {
    return state.incidentes.find((inc) => inc.id === id) || null;
}

function getUnit(id) {
    return state.unidades.find((unidad) => unidad.id === id) || null;
}

function coordStatusKey(inc) {
    if (inc.estadoCoord === "derivado" && inc.estadoSer === "cerrado") {
        return "cerrado";
    }
    return inc.estadoCoord;
}

function isCoordVisible(inc) {
    return Boolean(inc.estadoCoord);
}

function isCoordActive(inc) {
    return inc.estadoCoord === "no-derivado" || (inc.estadoCoord === "derivado" && inc.estadoSer !== "cerrado");
}

function isSerVisible(inc) {
    return Boolean(inc.estadoSer);
}

function isSerActive(inc) {
    return isSerVisible(inc) && inc.estadoSer !== "cerrado";
}

function coordIncidents() {
    return state.incidentes.filter(isCoordVisible);
}

function serActiveIncidents() {
    return state.incidentes.filter(isSerActive);
}

function addCoordActivity(titulo, texto) {
    state.actividadCoord.unshift({ hora: clockTime(), titulo, texto });
}

function addSerActivity(titulo, texto) {
    state.actividadSer.unshift({ hora: clockTime(), titulo, texto });
}

function ubicacionCoord(inc) {
    return [inc.direccion, inc.sector].filter(Boolean).join(" · ");
}

function ubicacionSer(inc) {
    return [inc.direccion, inc.referencia || inc.sector].filter(Boolean).join(" · ");
}

function incidentTitle(inc) {
    return `${inc.id} · ${CATEGORIES[inc.categoria].nombre}`;
}

/* 5. Sesión y reloj de demostración ------------------------------------- */
function getSession() {
    try {
        return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY) || "null");
    } catch (error) {
        return null;
    }
}

function startSession(rol) {
    const sesion = { rol, inicio: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
    return sesion;
}

function endSession() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
}

function currentUser() {
    const sesion = getSession();
    return sesion ? USERS[sesion.rol] : null;
}

/* Reloj de demostración compartido por ambos roles: parte de las 08:35
   (hora del mockup del Panel) y avanza en tiempo real desde que se crearon
   los datos de la simulación. Así los registros de ambos roles quedan en
   orden cronológico. */
const HORA_INICIO_DEMO = 8 * 60 + 35;

function clockMinutes() {
    if (!state) {
        loadState();
    }
    const transcurridos = Math.floor((Date.now() - (state.relojInicio || Date.now())) / 60000);
    return HORA_INICIO_DEMO + Math.max(0, transcurridos);
}

function clockTime() {
    return minutesToTime(clockMinutes());
}

/* Protege las páginas internas: exige sesión con el rol correcto. */
function requireRole(rol) {
    const sesion = getSession();
    if (!sesion) {
        window.location.replace("index.html");
        return false;
    }
    if (sesion.rol !== rol) {
        window.location.replace(USERS[sesion.rol].inicio);
        return false;
    }
    return true;
}

/* 6. Componentes compartidos -------------------------------------------- */
function badge(texto, variante) {
    return `<span class="badge badge--${variante}">${escapeHtml(texto)}</span>`;
}

function priorityBadge(prioridad) {
    const p = PRIORITY[prioridad];
    return badge(p.texto, p.badge);
}

function categoryTile(categoria, tamano = "", etiqueta = true) {
    const cat = CATEGORIES[categoria];
    const clases = ["category-tile", `category-tile--${cat.clave}`];
    if (tamano) {
        clases.push(`category-tile--${tamano}`);
    }
    const alt = etiqueta ? `Categoría: ${cat.nombre}` : "";
    return `<span class="${clases.join(" ")}">${icon(`tile-${cat.clave}.svg`, alt)}</span>`;
}

function bannerHtml(tipo, titulo, texto) {
    const iconos = {
        success: "check-circulo-verde.svg",
        info: "info.svg",
        warning: "advertencia.svg",
        error: "error-circulo-grande.svg"
    };
    return `
        <div class="banner banner--${tipo}" role="status">
            ${icon(iconos[tipo])}
            <div class="banner-content">
                <p class="banner-title">${escapeHtml(titulo)}</p>
                <p class="banner-text">${escapeHtml(texto)}</p>
            </div>
        </div>`;
}

function emptyStateHtml(titulo, texto, botonTexto, botonAccion) {
    return `
        <div class="empty-state">
            ${icon("lupa-vacio.svg")}
            <h2>${escapeHtml(titulo)}</h2>
            <p>${escapeHtml(texto)}</p>
            ${botonTexto ? `<button type="button" class="btn btn--neutral" data-action="${botonAccion}">${escapeHtml(botonTexto)}</button>` : ""}
        </div>`;
}

function timelineHtml(eventos) {
    return eventos.map((ev) => `
        <li class="timeline-item">
            <span class="timeline-time">${escapeHtml(ev.hora)}</span>
            <div class="timeline-content">
                <h3>${escapeHtml(ev.titulo)}</h3>
                <p>${escapeHtml(ev.detalle)}</p>
                <p class="timeline-owner">Responsable: ${escapeHtml(ev.responsable)}</p>
            </div>
        </li>`).join("");
}

function sidebarHtml(rol, paginaActiva) {
    const usuario = USERS[rol];
    const items = NAVIGATION[rol].map((item) => {
        const activo = item.id === paginaActiva;
        return `
            <li>
                <a href="${item.href}" class="nav-link${activo ? " active" : ""}"${activo ? ' aria-current="page"' : ""}>
                    ${icon(item.icono)}
                    <span>${item.texto}</span>
                </a>
            </li>`;
    }).join("");

    return `
        <a class="sidebar-logo" href="${usuario.inicio}" title="Ir al panel">
            ${icon("logo.svg", "", "logo-icon")}
            <span class="logo-text">
                <strong>OeVecino</strong>
                <span>Seguridad vecinal</span>
            </span>
        </a>
        <div class="municipalidad">
            <span class="section-label">Municipalidad</span>
            <strong>Santa Aurora</strong>
        </div>
        <nav class="sidebar-navigation" aria-label="Menú de ${usuario.rolNombre}">
            <span class="section-label">${usuario.rolNombre}</span>
            <ul>${items}</ul>
        </nav>
        <div class="sidebar-bottom">
            <div class="operation-card">
                <p class="operation-status"><span class="status-dot" aria-hidden="true"></span>Central operativa</p>
                <p><strong>Central Norte</strong><span>Turno mañana · 06:00–14:00</span></p>
            </div>
            <a href="mailto:soporte@santaaurora.example.org?subject=Soporte%20OeVecino" class="support-link">
                ${icon("soporte.svg")}
                <span>Soporte de la plataforma</span>
            </a>
        </div>`;
}

function topbarHtml(rol) {
    const usuario = USERS[rol];
    const listaIncidentes = NAVIGATION[rol][1].href;
    return `
        <button type="button" class="menu-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="sidebar">
            ${icon("menu.svg")}
        </button>
        <form class="topbar-search" role="search">
            ${icon("lupa.svg")}
            <label for="global-search" class="visually-hidden">Buscar en la plataforma</label>
            <input type="search" id="global-search" placeholder="Buscar en la plataforma" autocomplete="off"
                role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="search-results">
            <div class="search-results" id="search-results" role="listbox" aria-label="Resultados de búsqueda" hidden></div>
        </form>
        <div class="topbar-actions">
            <a href="${listaIncidentes}" class="notification-button" aria-label="Notificaciones: ver incidentes">
                ${icon("campana.svg")}
                <span class="notification-dot" data-notification-dot hidden></span>
            </a>
            <span class="topbar-divider" aria-hidden="true"></span>
            <div class="account">
                <button type="button" class="user-profile" aria-haspopup="true" aria-expanded="false" aria-controls="account-menu">
                    <span class="user-avatar" aria-hidden="true">${usuario.iniciales}</span>
                    <span class="user-info">
                        <strong>${usuario.nombre}</strong>
                        <span>${usuario.rolNombre}</span>
                    </span>
                    ${icon("chevron-abajo.svg", "", "chevron")}
                    <span class="visually-hidden">Abrir menú de cuenta</span>
                </button>
                <div class="account-menu" id="account-menu" hidden>
                    <div class="account-menu-header">
                        <strong>${usuario.nombre}</strong>
                        <span>${usuario.rolNombre} · Central Norte</span>
                    </div>
                    <a href="${NAVIGATION[rol][NAVIGATION[rol].length - 1].href}" class="account-menu-item">
                        ${icon("usuario.svg")} Mi perfil
                    </a>
                    <button type="button" class="account-menu-item account-menu-item--danger" data-open-logout>
                        ${icon("cerrar-sesion-rojo.svg")} Cerrar sesión
                    </button>
                </div>
            </div>
        </div>`;
}

function logoutDialogHtml() {
    return `
        <dialog class="modal modal--small" id="logout-dialog" aria-labelledby="logout-title">
            <div class="modal-content">
                <button type="button" class="modal-close" data-close-dialog aria-label="Cerrar">${icon("cerrar.svg")}</button>
                <span class="modal-icon-box">${icon("cerrar-sesion.svg")}</span>
                <h2 id="logout-title" class="card-title" style="font-size:24px">¿Cerrar sesión?</h2>
                <p class="text-secondary">Tu sesión en OeVecino finalizará. Para volver a acceder, ingresa con tu correo y contraseña.</p>
                <div class="modal-actions">
                    <button type="button" class="btn btn--neutral" data-close-dialog>Cancelar</button>
                    <button type="button" class="btn btn--danger" data-confirm-logout>Cerrar sesión</button>
                </div>
            </div>
        </dialog>`;
}

/* Abre/cierra ventanas <dialog> nativas (accesibles con teclado y Esc). */
function openDialog(dialogo) {
    if (!dialogo) {
        return;
    }
    if (typeof dialogo.showModal === "function") {
        dialogo.showModal();
    } else {
        dialogo.setAttribute("open", "");
    }
}

function closeDialog(dialogo) {
    if (!dialogo) {
        return;
    }
    if (typeof dialogo.close === "function") {
        dialogo.close();
    } else {
        dialogo.removeAttribute("open");
    }
}

function setupDialogs() {
    document.addEventListener("click", (evento) => {
        const cerrar = evento.target.closest("[data-close-dialog]");
        if (cerrar) {
            closeDialog(cerrar.closest("dialog"));
            return;
        }
        // Clic en el fondo oscuro de un <dialog>
        if (evento.target.tagName === "DIALOG") {
            const rect = evento.target.getBoundingClientRect();
            const fuera = evento.clientX < rect.left || evento.clientX > rect.right ||
                evento.clientY < rect.top || evento.clientY > rect.bottom;
            if (fuera) {
                closeDialog(evento.target);
            }
        }
    });
}

function renderShell(rol, paginaActiva) {
    const sidebar = qs("#sidebar");
    const topbar = qs("#topbar");
    if (sidebar) {
        sidebar.innerHTML = sidebarHtml(rol, paginaActiva);
    }
    if (topbar) {
        topbar.innerHTML = topbarHtml(rol);
    }
    qsa("[data-component='datetime']").forEach((el) => {
        el.innerHTML = `${icon("calendario.svg")}<span>${FECHA_DEMO}</span><strong data-clock>${clockTime()}</strong>`;
    });
    qsa("[data-component='footer']").forEach((el) => {
        el.innerHTML = "<span>OeVecino · Seguridad vecinal</span><span>Municipalidad de Santa Aurora</span>";
    });
    document.body.insertAdjacentHTML("beforeend", logoutDialogHtml());
    if (!qs(".sidebar-overlay")) {
        document.body.insertAdjacentHTML("beforeend", '<div class="sidebar-overlay" data-close-sidebar></div>');
    }

    setupAccountMenu();
    setupMobileMenu();
    setupGlobalSearch(rol);
    updateNotificationDot(rol);

    // Actualiza el reloj de la cabecera cada 20 segundos
    window.setInterval(() => {
        qsa("[data-clock]").forEach((el) => {
            el.textContent = clockTime();
        });
    }, 20000);
}

function setupAccountMenu() {
    const boton = qs(".user-profile");
    const menu = qs("#account-menu");
    if (!boton || !menu) {
        return;
    }

    function cerrarMenu() {
        menu.hidden = true;
        boton.setAttribute("aria-expanded", "false");
    }

    boton.addEventListener("click", () => {
        const abierto = !menu.hidden;
        menu.hidden = abierto;
        boton.setAttribute("aria-expanded", String(!abierto));
        if (!abierto) {
            const primero = qs(".account-menu-item", menu);
            if (primero) {
                primero.focus();
            }
        }
    });

    document.addEventListener("click", (evento) => {
        if (!evento.target.closest(".account")) {
            cerrarMenu();
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && !menu.hidden) {
            cerrarMenu();
            boton.focus();
        }
    });

    document.addEventListener("click", (evento) => {
        if (evento.target.closest("[data-open-logout]")) {
            cerrarMenu();
            openDialog(qs("#logout-dialog"));
        }
        if (evento.target.closest("[data-confirm-logout]")) {
            endSession();
            window.location.href = "index.html";
        }
    });
}

function setupMobileMenu() {
    const boton = qs(".menu-toggle");
    const sidebar = qs("#sidebar");
    const overlay = qs(".sidebar-overlay");
    if (!boton || !sidebar) {
        return;
    }

    function setOpen(abierto) {
        sidebar.classList.toggle("is-open", abierto);
        overlay.classList.toggle("is-visible", abierto);
        boton.setAttribute("aria-expanded", String(abierto));
        boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    }

    boton.addEventListener("click", () => setOpen(!sidebar.classList.contains("is-open")));
    overlay.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && sidebar.classList.contains("is-open")) {
            setOpen(false);
            boton.focus();
        }
    });
}

/* Buscador global: busca en secciones, incidentes, publicaciones,
   comunicados, vecinos y unidades según el rol, y muestra los resultados
   agrupados debajo de la barra (sin pantalla nueva). */
const SEARCH_SECTIONS = {
    coordinador: [
        ["Panel del Coordinador", "coordinador-panel.html", "Indicadores, mapa vecinal y actividad"],
        ["Lista de incidentes", "coordinador-incidentes.html", "Incidentes de Central Norte"],
        ["Moderación de publicaciones", "coordinador-moderacion.html", "Red Vecinal"],
        ["Comunicados", "coordinador-comunicados.html", "Red Vecinal"],
        ["Crear comunicado", "coordinador-nuevo-comunicado.html", "Red Vecinal · Comunicados"],
        ["Directorio vecinal", "coordinador-directorio.html", "Vecinos de Santa Aurora"],
        ["Mi perfil", "coordinador-perfil.html", "Datos institucionales y cierre de sesión"]
    ],
    serenazgo: [
        ["Panel de Serenazgo", "serenazgo-panel.html", "Indicadores, mapa operativo y actividad"],
        ["Bandeja de incidentes", "serenazgo-incidentes.html", "Incidentes activos de Central Norte"],
        ["Unidades de Serenazgo", "serenazgo-unidades.html", "Disponibilidad y asignación"],
        ["Mi perfil", "serenazgo-perfil.html", "Datos institucionales y cierre de sesión"]
    ]
};

function buildSearchIndex(rol) {
    const items = SEARCH_SECTIONS[rol].map(([titulo, href, detalle]) => ({ grupo: "Secciones", titulo, detalle, href, texto: `${titulo} ${detalle}` }));

    if (rol === "coordinador") {
        coordIncidents().forEach((inc) => items.push({
            grupo: "Incidentes", titulo: incidentTitle(inc), detalle: `${ubicacionCoord(inc)} · ${COORD_STATUS[coordStatusKey(inc)].texto}`,
            href: `coordinador-incidente.html?id=${inc.id}`, texto: `${incidentTitle(inc)} ${ubicacionCoord(inc)} ${inc.reportante?.nombre || ""}`
        }));
        state.publicaciones.forEach((pub) => items.push({
            grupo: "Publicaciones", titulo: pub.titulo, detalle: `${pub.autor} · ${pub.sector} · ${PUB_STATUS[pub.estado].texto}`,
            href: `coordinador-moderacion.html?pub=${pub.id}`, texto: `${pub.titulo} ${pub.autor} ${pub.sector} ${pub.texto}`
        }));
        state.comunicados.forEach((com) => items.push({
            grupo: "Comunicados", titulo: com.titulo, detalle: `${com.fecha} · ${com.hora}`,
            href: `coordinador-comunicados.html#${com.id}`, texto: `${com.titulo} ${com.contenido}`
        }));
        state.vecinos.forEach((vec) => items.push({
            grupo: "Vecinos", titulo: vec.nombre, detalle: `Santa Aurora · ${vec.sector}`,
            href: `coordinador-vecino.html?id=${vec.id}`, texto: `${vec.nombre} ${vec.sector}`
        }));
    } else {
        state.incidentes.filter(isSerVisible).forEach((inc) => items.push({
            grupo: "Incidentes", titulo: serTitle(inc), detalle: `${ubicacionSer(inc)} · ${SER_STATUS[inc.estadoSer].texto}`,
            href: `serenazgo-seguimiento.html?id=${inc.id}`, texto: `${incidentTitle(inc)} ${ubicacionSer(inc)} ${inc.reportante?.nombre || ""} ${inc.unidad || ""}`
        }));
        state.unidades.forEach((u) => items.push({
            grupo: "Unidades", titulo: `${u.id} · ${u.tipo}`, detalle: `${u.placa} · ${UNIT_STATUS[u.estado].texto}`,
            href: `serenazgo-unidad.html?id=${u.id}`, texto: `${u.id} ${u.placa} ${u.jefe} ${u.conductor}`
        }));
    }
    return items;
}

function searchPlatform(rol, consulta) {
    const palabras = normalize(consulta).split(/\s+/).filter(Boolean);
    if (palabras.length === 0) {
        return [];
    }
    const grupos = {};
    buildSearchIndex(rol).forEach((item) => {
        const texto = normalize(item.texto);
        if (palabras.every((p) => texto.includes(p))) {
            grupos[item.grupo] = grupos[item.grupo] || [];
            if (grupos[item.grupo].length < 4) {
                grupos[item.grupo].push(item);
            }
        }
    });
    return Object.entries(grupos);
}

function setupGlobalSearch(rol) {
    const formulario = qs(".topbar-search");
    if (!formulario) {
        return;
    }
    const entrada = qs("input", formulario);
    const panel = qs("#search-results");
    let activo = -1;

    function opciones() {
        return qsa(".search-option", panel);
    }

    function cerrar() {
        panel.hidden = true;
        entrada.setAttribute("aria-expanded", "false");
        entrada.removeAttribute("aria-activedescendant");
        activo = -1;
    }

    function marcar(indice) {
        const lista = opciones();
        lista.forEach((op, i) => op.classList.toggle("is-active", i === indice));
        activo = indice;
        if (lista[indice]) {
            entrada.setAttribute("aria-activedescendant", lista[indice].id);
            lista[indice].scrollIntoView({ block: "nearest" });
        }
    }

    function mostrar() {
        const consulta = entrada.value.trim();
        if (!consulta) {
            cerrar();
            return;
        }
        const grupos = searchPlatform(rol, consulta);
        let n = 0;
        panel.innerHTML = grupos.length === 0
            ? `<p class="search-empty">Sin resultados para «${escapeHtml(consulta)}» en la plataforma.</p>`
            : grupos.map(([grupo, items]) => `
                <div role="group" aria-label="${grupo}">
                    <p class="search-group" aria-hidden="true">${grupo}</p>
                    ${items.map((item) => `
                        <a class="search-option" role="option" id="search-option-${n++}" href="${item.href}">
                            <strong>${escapeHtml(item.titulo)}</strong>
                            <span>${escapeHtml(item.detalle)}</span>
                        </a>`).join("")}
                </div>`).join("");
        panel.hidden = false;
        entrada.setAttribute("aria-expanded", "true");
        activo = -1;
    }

    entrada.addEventListener("input", mostrar);
    entrada.addEventListener("focus", mostrar);

    entrada.addEventListener("keydown", (evento) => {
        const lista = opciones();
        if (evento.key === "ArrowDown" && lista.length) {
            evento.preventDefault();
            marcar((activo + 1) % lista.length);
        } else if (evento.key === "ArrowUp" && lista.length) {
            evento.preventDefault();
            marcar(activo <= 0 ? lista.length - 1 : activo - 1);
        } else if (evento.key === "Escape") {
            cerrar();
        }
    });

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const lista = opciones();
        const destino = lista[activo >= 0 ? activo : 0];
        if (destino) {
            window.location.href = destino.getAttribute("href");
        } else {
            entrada.focus();
            mostrar();
        }
    });

    // Evita que el panel se cierre antes de registrar el clic en un resultado
    panel.addEventListener("mousedown", (evento) => evento.preventDefault());
    entrada.addEventListener("blur", cerrar);
}

function updateNotificationDot(rol) {
    const punto = qs("[data-notification-dot]");
    if (!punto) {
        return;
    }
    let pendientes = 0;
    if (rol === "coordinador") {
        pendientes = state.incidentes.filter((inc) => inc.estadoCoord === "no-derivado").length +
            state.publicaciones.filter((pub) => pub.estado === "pendiente").length;
    } else {
        pendientes = serActiveIncidents().filter((inc) => inc.estadoSer === "sin-asignar").length;
    }
    punto.hidden = pendientes === 0;
}

/* Marca visualmente un campo con error y muestra su mensaje. */
function setFieldError(campo, mensaje) {
    const contenedor = campo.closest(".form-field");
    if (!contenedor) {
        return;
    }
    let error = qs(".field-error", contenedor);
    if (mensaje) {
        contenedor.classList.add("has-error");
        campo.setAttribute("aria-invalid", "true");
        if (!error) {
            error = document.createElement("p");
            error.className = "field-error";
            error.id = `${campo.id || campo.name}-error`;
            contenedor.appendChild(error);
        }
        error.textContent = mensaje;
        campo.setAttribute("aria-describedby", error.id);
    } else {
        contenedor.classList.remove("has-error");
        campo.removeAttribute("aria-invalid");
        if (error) {
            error.remove();
        }
    }
}

/* 7. Mapa --------------------------------------------------------------- */
/* El mapa es esquemático (CSS), igual que en Figma. Las posiciones se
   expresan en píxeles del frame original y se convierten a porcentajes
   para que el mapa sea adaptable. */
const MAP_LAYOUTS = {
    vecinal: {
        ancho: 720, alto: 348,
        bloques: { x: [8, 98, 188, 278, 368, 458, 548, 638], y: [12, 98, 184, 270], w: 70, h: 64, parques: ["4-1", "4-2"] },
        calles: [{ x: 0, y: 184, w: 720, h: 26 }, { x: 330, y: 0, w: 26, h: 348 }],
        etiquetas: [
            { texto: "SANTA AURORA · NORTE", x: 20, y: 18, clase: "zone" },
            { texto: "Av. Los Olivos", x: 420, y: 190, clase: "" },
            { texto: "Parque Las Flores", x: 405, y: 26, clase: "park" }
        ]
    },
    operativo: {
        ancho: 720, alto: 302,
        bloques: { x: [8, 98, 188, 278, 368, 458, 548, 638], y: [12, 111, 209], w: 70, h: 66, parques: ["4-1", "3-2"] },
        calles: [{ x: 0, y: 135, w: 720, h: 22 }, { x: 320, y: 0, w: 24, h: 302 }],
        etiquetas: [
            { texto: "SANTA AURORA · NORTE", x: 20, y: 18, clase: "zone" },
            { texto: "Av. Los Olivos", x: 365, y: 140, clase: "street" },
            { texto: "Av. Central", x: 80, y: 280, clase: "small" },
            { texto: "Parque Las Flores", x: 390, y: 28, clase: "park" }
        ]
    }
};

function pct(valor, total) {
    return `${(valor / total * 100).toFixed(3)}%`;
}

function mapBaseHtml(tipo) {
    const layout = MAP_LAYOUTS[tipo];
    const b = layout.bloques;
    let html = "";
    b.y.forEach((y, fila) => {
        b.x.forEach((x, columna) => {
            const parque = b.parques.includes(`${columna}-${fila}`);
            html += `<span class="map-block${parque ? " map-block--park" : ""}" style="left:${pct(x, layout.ancho)};top:${pct(y, layout.alto)};width:${pct(b.w, layout.ancho)};height:${pct(b.h, layout.alto)}"></span>`;
        });
    });
    layout.calles.forEach((c) => {
        html += `<span class="map-road" style="left:${pct(c.x, layout.ancho)};top:${pct(c.y, layout.alto)};width:${pct(c.w, layout.ancho)};height:${pct(c.h, layout.alto)}"></span>`;
    });
    layout.etiquetas.forEach((e) => {
        html += `<span class="map-label${e.clase ? ` map-label--${e.clase}` : ""}" style="left:${pct(e.x, layout.ancho)};top:${pct(e.y, layout.alto)}">${e.texto}</span>`;
    });
    return html;
}

function positionStyle(posicion, tipo) {
    const layout = MAP_LAYOUTS[tipo];
    return `left:${pct(posicion[0], layout.ancho)};top:${pct(posicion[1], layout.alto)}`;
}

function mapControlsHtml() {
    return `
        <div class="map-controls" role="group" aria-label="Controles del mapa">
            <button type="button" data-map-zoom="in" aria-label="Acercar mapa">${icon("mapa-acercar.svg")}</button>
            <button type="button" data-map-zoom="out" aria-label="Alejar mapa">${icon("mapa-alejar.svg")}</button>
            <button type="button" data-map-zoom="reset" aria-label="Centrar mapa">${icon("mapa-ubicar.svg")}</button>
        </div>`;
}

function offlineHtml(ultimoDato) {
    return `
        <div class="map-offline" data-map-offline hidden>
            <div class="offline-card" role="alert">
                ${icon("sin-conexion.svg")}
                <h3>Mapa sin conexión</h3>
                <p>La ubicación de incidentes y unidades no se está actualizando. Último dato: ${escapeHtml(ultimoDato)}.</p>
                <button type="button" class="btn btn--secondary" data-map-retry>Reintentar conexión</button>
            </div>
        </div>`;
}

/* Zoom, centrado y detección de conexión del navegador.
   Se puede llamar de nuevo si el mapa se vuelve a dibujar: los eventos
   se registran una sola vez y buscan los elementos actuales. */
function setupMapInteractions(viewport) {
    if (!viewport) {
        return;
    }

    function actualizarConexion() {
        const aviso = qs("[data-map-offline]", viewport);
        if (aviso) {
            aviso.hidden = navigator.onLine;
        }
    }
    actualizarConexion();

    if (viewport.dataset.mapReady) {
        return;
    }
    viewport.dataset.mapReady = "true";
    let escala = 1;

    viewport.addEventListener("click", (evento) => {
        const reintentar = evento.target.closest("[data-map-retry]");
        if (reintentar) {
            actualizarConexion();
            if (!navigator.onLine) {
                reintentar.textContent = "Sin conexión · Reintentar";
            }
            return;
        }
        const boton = evento.target.closest("[data-map-zoom]");
        if (!boton) {
            return;
        }
        const accion = boton.dataset.mapZoom;
        if (accion === "in") {
            escala = Math.min(1.6, escala + 0.2);
        } else if (accion === "out") {
            escala = Math.max(1, escala - 0.2);
        } else {
            escala = 1;
        }
        const canvas = qs(".map-canvas", viewport);
        if (canvas) {
            canvas.style.transform = `scale(${escala})`;
        }
    });

    window.addEventListener("online", actualizarConexion);
    window.addEventListener("offline", actualizarConexion);
}

/* 8. W01 · Inicio de sesión --------------------------------------------- */
function initLogin() {
    const sesion = getSession();
    if (sesion && USERS[sesion.rol]) {
        window.location.replace(USERS[sesion.rol].inicio);
        return;
    }

    const formulario = qs("#login-form");
    const correo = qs("#login-email");
    const clave = qs("#login-password");
    const resumen = qs("#login-summary");
    const alerta = qs("#login-alert");
    const verClave = qs("#toggle-password");

    verClave.addEventListener("click", () => {
        const oculto = clave.type === "password";
        clave.type = oculto ? "text" : "password";
        verClave.setAttribute("aria-pressed", String(oculto));
        verClave.setAttribute("aria-label", oculto ? "Ocultar contraseña" : "Mostrar contraseña");
    });

    [correo, clave].forEach((campo) => {
        campo.addEventListener("input", () => {
            if (campo.value.trim()) {
                setFieldError(campo, "");
                actualizarIconos();
            }
        });
    });

    function actualizarIconos() {
        const correoError = correo.closest(".form-field").classList.contains("has-error");
        const claveError = clave.closest(".form-field").classList.contains("has-error");
        qs("#email-error-icon").hidden = !correoError;
        qs("#toggle-password img").src = `${ICONS}${claveError ? "ojo-oculto-error.svg" : "ojo-oculto.svg"}`;
    }

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        alerta.hidden = true;
        const valorCorreo = correo.value.trim().toLowerCase();
        const valorClave = clave.value;

        setFieldError(correo, valorCorreo ? "" : "Ingresa tu correo institucional.");
        setFieldError(clave, valorClave ? "" : "Ingresa tu contraseña.");
        actualizarIconos();

        if (!valorCorreo || !valorClave) {
            resumen.hidden = false;
            (valorCorreo ? clave : correo).focus();
            return;
        }
        resumen.hidden = true;

        const usuario = Object.values(USERS).find((u) => u.correo === valorCorreo);
        if (!usuario || valorClave !== DEMO_PASSWORD) {
            alerta.hidden = false;
            alerta.focus();
            return;
        }

        startSession(usuario.rol);
        window.location.href = usuario.inicio;
    });
}

/* 9. Coordinador: C01 Panel --------------------------------------------- */
function initCoordPanel() {
    const incidentes = coordIncidents();
    const activos = incidentes.filter(isCoordActive);
    const noDerivados = activos.filter((inc) => inc.estadoCoord === "no-derivado").length;
    const resueltosHoy = incidentes.filter((inc) => inc.estadoCoord === "resuelto").length;
    const pendientes = state.publicaciones.filter((pub) => pub.estado === "pendiente").length;

    setText("[data-stat='activos']", activos.length);
    setText("[data-stat='activos-detalle']", `${noDerivados} no derivado · ${activos.length - noDerivados} en seguimiento`);
    setText("[data-stat='atendidos']", resueltosHoy);
    setText("[data-stat='pendientes']", pendientes);
    setText("[data-review-count]", pendientes);

    // Mapa vecinal: un marcador y una alerta por incidente activo
    const viewport = qs("#coord-map");
    const conMapa = activos.filter((inc) => inc.mapa);
    let marcadores = "";
    conMapa.forEach((inc) => {
        const cat = CATEGORIES[inc.categoria];
        marcadores += `
            <a class="map-marker" href="coordinador-incidente.html?id=${inc.id}" style="${positionStyle(inc.mapa.marcador, "vecinal")};border-color:var(--cat-${colorVar(inc.categoria)})" aria-label="${inc.id}, ${cat.nombre}. Ver detalle">
                ${categoryTile(inc.categoria, "", false)}<span>${inc.id}</span>
            </a>
            <a class="map-alert" href="coordinador-incidente.html?id=${inc.id}" style="${positionStyle(inc.mapa.alerta, "vecinal")};border-color:var(--cat-${colorVar(inc.categoria)})" aria-label="Alerta vecinal de ${inc.id}">
                ${icon(`alerta-${cat.clave}.svg`)}
            </a>`;
    });
    viewport.innerHTML = `<div class="map-canvas">${mapBaseHtml("vecinal")}${marcadores}</div>${mapControlsHtml()}${offlineHtml(clockTime() + ":00")}`;
    setupMapInteractions(viewport);

    setText("[data-map='incidentes']", plural(activos.length, "incidente activo", "incidentes activos"));
    setText("[data-map='alertas']", plural(conMapa.length, "alerta pendiente", "alertas pendientes"));
    setText("[data-map='actualizacion']", `Última actualización: ${clockTime()}:00 · Incidentes y alertas de Central Norte.`);

    // Incidente prioritario: el activo más reciente con prioridad alta
    const ordenados = activos.slice().sort((a, b) => timeToMinutes(b.hora) - timeToMinutes(a.hora));
    const prioritario = ordenados.find((inc) => inc.prioridad === "alta") || ordenados[0];
    const contenedor = qs("#priority-incident");
    if (prioritario) {
        const estado = COORD_STATUS[coordStatusKey(prioritario)];
        const detalle = prioritario.estadoCoord === "derivado"
            ? `Reporte recibido a las ${prioritario.hora}.<br>Serenazgo ha recibido el caso.`
            : `Reporte recibido a las ${prioritario.hora}.<br>Pendiente de revisión del Coordinador.`;
        contenedor.innerHTML = `
            <article class="priority-card">
                <div class="priority-card-body">
                    <h3>${incidentTitle(prioritario)}</h3>
                    <div class="badge-row">${priorityBadge(prioritario.prioridad)}${badge(estado.texto, estado.badge)}</div>
                    <p class="priority-location">${escapeHtml(ubicacionCoord(prioritario))}</p>
                    <p class="priority-description">${detalle}</p>
                    <a class="btn btn--text" href="coordinador-incidente.html?id=${prioritario.id}">Ver detalle →</a>
                </div>
                ${categoryTile(prioritario.categoria)}
            </article>`;
    } else {
        contenedor.innerHTML = `<article class="priority-card"><div class="priority-card-body"><h3>Sin incidentes activos</h3><p class="priority-location">No hay incidentes activos en Central Norte.</p></div></article>`;
    }
    setText("[data-alerts-title]", plural(conMapa.length, "alerta por revisar", "alertas por revisar"));

    // Actividad reciente (las tres más recientes)
    qs("#recent-activity").innerHTML = state.actividadCoord.slice(0, 3).map((act) => `
        <li class="card card--compact activity-card">
            <h3>${escapeHtml(act.hora)} · ${escapeHtml(act.titulo)}</h3>
            <p>${escapeHtml(act.texto)}</p>
        </li>`).join("");
}

function colorVar(categoria) {
    const mapa = {
        robo: "robo", actividadsospechosa: "actividad", vehiculosospechoso: "vehiculo",
        accidentetransito: "accidente", alumbradodefectuoso: "alumbrado", otros: "otros", sos: "sos",
        emergenciamedica: "emergencia"
    };
    return mapa[categoria];
}

/* 10. Coordinador: C02 Lista de incidentes ------------------------------ */
function initCoordIncidents() {
    const busqueda = qs("#incident-search");
    const prioridad = qs("#priority-filter");
    const estado = qs("#status-filter");
    const categorias = qsa("input[name='categoria']");
    const orden = qs("#sort-toggle");
    let masRecientes = true;

    const consulta = getParam("q");
    if (consulta) {
        busqueda.value = consulta;
    }

    function filtrar() {
        const texto = normalize(busqueda.value);
        const catsSeleccionadas = categorias.filter((c) => c.checked).map((c) => c.value);
        return coordIncidents().filter((inc) => {
            const campos = normalize([inc.id, inc.direccion, inc.sector, inc.reportante?.nombre, CATEGORIES[inc.categoria].nombre].join(" "));
            const coincideTexto = !texto || campos.includes(texto);
            const coincidePrioridad = !prioridad.value || inc.prioridad === prioridad.value;
            const coincideEstado = !estado.value || coordStatusKey(inc) === estado.value;
            const coincideCategoria = catsSeleccionadas.length === 0 || catsSeleccionadas.includes(inc.categoria);
            return coincideTexto && coincidePrioridad && coincideEstado && coincideCategoria;
        }).sort((a, b) => (masRecientes ? 1 : -1) * (timeToMinutes(b.hora) - timeToMinutes(a.hora)));
    }

    function render() {
        const todos = coordIncidents();
        const activos = todos.filter(isCoordActive).length;
        const resultado = filtrar();
        setText("[data-active-count]", plural(activos, "incidente activo", "incidentes activos"));

        const tabla = qs("#incident-table");
        const vacio = qs("#incident-empty");
        if (resultado.length === 0) {
            tabla.hidden = true;
            vacio.hidden = false;
            const termino = busqueda.value.trim();
            setText("#empty-summary", `0 resultados · Los ${activos} incidentes activos se conservan`);
            qs("#empty-card").innerHTML = emptyStateHtml(
                "No encontramos incidentes",
                termino
                    ? `No hay coincidencias para «${termino}» con los filtros aplicados. Prueba otra búsqueda o limpia los filtros.`
                    : "No hay coincidencias con los filtros aplicados. Prueba otra búsqueda o limpia los filtros.",
                "Limpiar filtros",
                "clear-filters"
            );
            return;
        }

        tabla.hidden = false;
        vacio.hidden = true;
        setText("#table-count", `${plural(todos.length, "registro", "registros")} · ${activos} ${activos === 1 ? "activo" : "activos"}`);
        setText("#table-showing", `Mostrando 1–${resultado.length} de ${plural(resultado.length, "incidente", "incidentes")}`);
        qs("#incident-rows").innerHTML = resultado.map((inc) => {
            const est = COORD_STATUS[coordStatusKey(inc)];
            return `
                <tr data-href="coordinador-incidente.html?id=${inc.id}">
                    <td class="cell-tile">${categoryTile(inc.categoria, "", false)}</td>
                    <td class="cell-strong" data-label="Categoría">${escapeHtml(CATEGORIES[inc.categoria].nombre)}</td>
                    <td data-label="Código"><a class="row-link" href="coordinador-incidente.html?id=${inc.id}">${inc.id}</a></td>
                    <td class="cell-muted cell-full" data-label="Dirección">${escapeHtml(inc.direccion)}</td>
                    <td data-label="Prioridad">${priorityBadge(inc.prioridad)}</td>
                    <td data-label="Estado">${badge(est.texto, est.badge)}</td>
                    <td data-label="Hora">${inc.hora}</td>
                    <td class="cell-hide-mobile">${icon("chevron-derecha.svg", "", "row-arrow")}</td>
                </tr>`;
        }).join("");
    }

    function limpiar() {
        busqueda.value = "";
        prioridad.value = "";
        estado.value = "";
        categorias.forEach((c) => {
            c.checked = false;
        });
        render();
        busqueda.focus();
    }

    [busqueda, prioridad, estado, ...categorias].forEach((el) => el.addEventListener("input", render));
    qs("#clear-filters").addEventListener("click", limpiar);
    document.addEventListener("click", (evento) => {
        if (evento.target.closest("[data-action='clear-filters']")) {
            limpiar();
        }
    });
    orden.addEventListener("click", () => {
        masRecientes = !masRecientes;
        orden.textContent = masRecientes ? "Más recientes primero ↓" : "Más antiguos primero ↑";
        setText("#hour-header", masRecientes ? "Hora ↓" : "Hora ↑");
        render();
    });
    setupClickableRows(qs("#incident-rows"));
    render();
}

/* Toda la fila de la tabla abre el detalle (el enlace interno sirve para teclado). */
function setupClickableRows(tbody) {
    tbody.addEventListener("click", (evento) => {
        const fila = evento.target.closest("tr[data-href]");
        if (fila && !evento.target.closest("a, button")) {
            window.location.href = fila.dataset.href;
        }
    });
}

/* 11. Coordinador: C03 Detalle de incidente ----------------------------- */
function initCoordIncident() {
    const inc = getIncident(getParam("id") || "INC-0254");
    if (!inc || !isCoordVisible(inc)) {
        qs("#incident-detail").innerHTML = emptyStateHtml("Incidente no encontrado", "El incidente solicitado no existe o no corresponde a la coordinación vecinal.", "", "");
        return;
    }
    renderCoordIncident(inc);
    setupEditDialog(inc);
    setupDeriveDialog(inc);
}

function renderCoordIncident(inc) {
    const estadoKey = coordStatusKey(inc);
    const estado = COORD_STATUS[estadoKey];
    const editable = inc.estadoCoord === "no-derivado" && EDITABLE_CATEGORIES.includes(inc.categoria);
    document.title = `${incidentTitle(inc)} · OeVecino`;

    setText("[data-incident='title']", incidentTitle(inc));
    setText("[data-incident='location']", ubicacionCoord(inc));
    qs("[data-incident='status']").innerHTML = badge(estado.texto, estado.badge);
    qs("[data-incident='meta']").innerHTML = `
        ${categoryTile(inc.categoria)}
        ${priorityBadge(inc.prioridad)}
        <span class="meta-text">Recibido hoy a las ${inc.hora} · ${escapeHtml(inc.origen)} · Central Norte</span>
        ${editable ? `
            <span class="meta-actions">
                <button type="button" class="btn btn--secondary" data-open="edit-dialog">Editar registro</button>
                <button type="button" class="btn btn--primary" data-open="derive-dialog">Enviar a Serenazgo</button>
            </span>` : ""}`;

    // Aviso de caso resuelto/descartado
    const aviso = qs("[data-incident='notice']");
    aviso.innerHTML = inc.avisoCoord ? bannerHtml(inc.avisoCoord.tipo, inc.avisoCoord.titulo, inc.avisoCoord.texto) : "";
    aviso.hidden = !inc.avisoCoord;

    // Pasos de atención (solo casos derivados)
    const pasos = qs("[data-incident='steps']");
    if (inc.estadoCoord === "derivado") {
        const p = inc.pasosCoord || {};
        const lista = [
            { titulo: "Derivado", dato: p.derivado },
            { titulo: "Recibido", dato: p.recibido },
            { titulo: "En atención", dato: p.atencion },
            { titulo: "Cierre", dato: p.cierre }
        ];
        pasos.innerHTML = lista.map((paso) => `
            <li class="step-card">
                <h3>${paso.dato ? "✓ " : ""}${paso.titulo}</h3>
                <p>${paso.dato ? `${escapeHtml(paso.dato.hora)} · ${escapeHtml(paso.dato.quien)}` : "Pendiente"}</p>
            </li>`).join("");
        pasos.hidden = false;
    } else {
        pasos.hidden = true;
    }

    // Datos del incidente
    const sinInformar = "Sin informar";
    setText("[data-field='categoria']", CATEGORIES[inc.categoria].nombre);
    setText("[data-field='prioridad']", PRIORITY[inc.prioridad].texto);
    setText("[data-field='estado']", estado.texto);
    setText("[data-field='direccion']", ubicacionCoord(inc));
    setText("[data-field='descripcion']", inc.descripcion || sinInformar);
    const foto = qs("[data-field='foto']");
    const sinFoto = qs("[data-field='sin-foto']");
    if (inc.foto) {
        foto.hidden = false;
        sinFoto.hidden = true;
        qs("img", foto).src = `${IMAGES}${inc.foto}`;
        qs("a", foto).href = `${IMAGES}${inc.foto}`;
    } else {
        foto.hidden = true;
        sinFoto.hidden = false;
    }

    // Reportante (visible solo para el Coordinador)
    const r = inc.reportante || {};
    qs("[data-field='reportante']").innerHTML = [r.nombre, r.celular, r.correo]
        .map((dato) => escapeHtml(dato || sinInformar)).join("<br>");

    // Cronología
    qs("[data-incident='timeline']").innerHTML = timelineHtml(inc.cronologiaCoord || []);

    // Validaciones vecinales
    const validaciones = qs("[data-incident='validations']");
    if (inc.validaciones) {
        validaciones.hidden = false;
        setText("[data-field='validaciones']", inc.validaciones.total);
        setText("[data-field='validaciones-texto']", inc.validaciones.total === 1 ? "vecino confirma el reporte" : "vecinos confirman el reporte");
        setText("[data-field='validaciones-ultima']", `Última validación: ${inc.validaciones.ultima}`);
    } else {
        validaciones.hidden = true;
    }
    qs("[data-incident='rule']").hidden = !editable;
}

function setupEditDialog(inc) {
    const dialogo = qs("#edit-dialog");
    const formulario = qs("#edit-form");
    const descripcion = qs("#edit-description");

    document.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-open='edit-dialog']");
        if (!boton) {
            return;
        }
        setText("#edit-subtitle", incidentTitle(inc));
        qs("#edit-category").value = inc.categoria;
        qs("#edit-priority").value = inc.prioridad;
        descripcion.value = inc.descripcion;
        qs("input[name='estado-guardar'][value='no-derivado']").checked = true;
        setFieldError(descripcion, "");
        openDialog(dialogo);
    });

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const nuevaDescripcion = descripcion.value.trim();
        if (!nuevaDescripcion) {
            setFieldError(descripcion, "Escribe una descripción para guardar el registro.");
            descripcion.focus();
            return;
        }

        const nuevaCategoria = qs("#edit-category").value;
        const nuevaPrioridad = qs("#edit-priority").value;
        const nuevoEstado = qs("input[name='estado-guardar']:checked").value;
        const hora = clockTime();
        const cambios = [];
        if (nuevaCategoria !== inc.categoria) {
            cambios.push(`Categoría: ${CATEGORIES[nuevaCategoria].nombre}`);
        }
        if (nuevaPrioridad !== inc.prioridad) {
            cambios.push(`Prioridad de ${PRIORITY[inc.prioridad].texto.toLowerCase()} a ${PRIORITY[nuevaPrioridad].texto.toLowerCase()}`);
        }
        if (nuevaDescripcion !== inc.descripcion) {
            cambios.push("Se actualizó la descripción");
        }

        inc.categoria = nuevaCategoria;
        inc.prioridad = nuevaPrioridad;
        inc.descripcion = nuevaDescripcion;

        if (cambios.length > 0) {
            inc.cronologiaCoord.unshift({ hora, titulo: "Registro editado", detalle: `${cambios.join(". ")}.`, responsable: "Diego Salazar · Coordinador" });
            addCoordActivity("Registro editado", `${inc.id} · ${cambios.join(". ")}. Diego Salazar · Coordinador.`);
        }

        if (nuevoEstado === "resuelto") {
            inc.estadoCoord = "resuelto";
            inc.avisoCoord = { tipo: "success", titulo: `Caso resuelto · ${hora}`, texto: "Diego Salazar confirmó la solución del reporte. Ya no aparece entre los incidentes activos de la app." };
            inc.cronologiaCoord.unshift({ hora, titulo: "Estado cambiado a Resuelto", detalle: "Caso solucionado por Coordinación. Retirado de activos en la app.", responsable: "Diego Salazar · Coordinador" });
            addCoordActivity("Caso resuelto", `${inc.id} · Estado cambiado a Resuelto. Diego Salazar · Coordinador.`);
        } else if (nuevoEstado === "descartado") {
            inc.estadoCoord = "descartado";
            inc.avisoCoord = { tipo: "info", titulo: `Caso descartado · ${hora}`, texto: "Diego Salazar descartó el reporte. No cuenta como activo y se conserva en el historial." };
            inc.cronologiaCoord.unshift({ hora, titulo: "Estado cambiado a Descartado", detalle: "Se conserva para consulta, sin contar como activo.", responsable: "Diego Salazar · Coordinador" });
            addCoordActivity("Caso descartado", `${inc.id} · Estado cambiado a Descartado. Diego Salazar · Coordinador.`);
        }

        saveState();
        closeDialog(dialogo);
        renderCoordIncident(inc);
        updateNotificationDot("coordinador");
        if (cambios.length === 0 && nuevoEstado === "no-derivado") {
            showPageNotice("info", "Sin cambios", "El registro se mantiene igual.");
        } else if (nuevoEstado === "no-derivado") {
            showPageNotice("success", `Registro actualizado · ${hora}`, "Los cambios se guardaron y se añadieron a la cronología.");
        }
    });
}

function setupDeriveDialog(inc) {
    const dialogo = qs("#derive-dialog");
    document.addEventListener("click", (evento) => {
        if (!evento.target.closest("[data-open='derive-dialog']")) {
            return;
        }
        setText("#derive-subtitle", `${inc.id} · No derivado`);
        setText("#derive-category", CATEGORIES[inc.categoria].nombre);
        setText("#derive-address", ubicacionCoord(inc));
        setText("#derive-description", inc.descripcion || "Sin informar");
        openDialog(dialogo);
    });

    qs("#derive-confirm").addEventListener("click", () => {
        const hora = clockTime();
        inc.estadoCoord = "derivado";
        inc.estadoSer = "sin-asignar";
        inc.derivadoPorCoordinador = true;
        inc.pasosCoord = { derivado: { hora, quien: "Diego Salazar" } };
        inc.mapaOps = inc.mapaOps || [420, 60];
        inc.cronologiaCoord.unshift({ hora, titulo: "Enviado a Serenazgo", detalle: "Caso incorporado a la bandeja de incidentes de Serenazgo.", responsable: "Diego Salazar · Coordinador" });
        inc.cronologiaSer = [
            { hora, titulo: "Derivado por el Coordinador", detalle: "Diego Salazar envió el caso a la bandeja de Serenazgo.", responsable: "Diego Salazar · Origen: Coordinación" }
        ];
        addCoordActivity("Derivación confirmada", `${inc.id} · Enviado a Serenazgo. Diego Salazar · Coordinador.`);
        addSerActivity("Nuevo reporte", `${inc.id} · Derivado por el Coordinador. Origen: coordinación vecinal.`);
        saveState();
        closeDialog(dialogo);
        renderCoordIncident(inc);
        updateNotificationDot("coordinador");
        showPageNotice("success", `Derivación confirmada · ${hora}`, "El caso ya aparece en la bandeja de incidentes de Serenazgo.");
    });
}

/* Muestra un aviso en la zona [data-page-notice] de la página actual. */
function showPageNotice(tipo, titulo, texto) {
    const zona = qs("[data-page-notice]");
    if (!zona) {
        return;
    }
    zona.innerHTML = bannerHtml(tipo, titulo, texto);
    zona.hidden = false;
    zona.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* 12. Coordinador: C06/C07 Moderación ---------------------------------- */
function initModeration() {
    const vacio = demoMode() === "vacio";
    const publicaciones = () => (vacio ? [] : state.publicaciones);
    const busqueda = qs("#post-search");
    const categoria = qs("#post-category");
    const ordenBoton = qs("#post-sort");
    let pestana = "todas";
    let masRecientes = true;

    function renderStats() {
        const lista = publicaciones();
        const pendientes = lista.filter((p) => p.estado === "pendiente");
        const hoy = pendientes.filter((p) => p.fecha === "2 nov.").length;
        const ayer = pendientes.length - hoy;
        const conReportes = lista.filter((p) => !p.reportesRevisados && p.reportes.length > 0);
        const totalReportes = conReportes.reduce((suma, p) => suma + p.reportes.length, 0);

        setText("[data-stat='hoy']", hoy);
        setText("[data-stat='hoy-detalle']", lista.length === 0 ? "Sin publicaciones recibidas" : `${pendientes.length} pendientes en total · ${ayer} de ayer`);
        setText("[data-stat='reportes']", totalReportes);
        setText("[data-stat='reportes-detalle']", totalReportes === 0 ? "Sin reportes registrados" : `En ${plural(conReportes.length, "publicación", "publicaciones")} · Atención prioritaria`);

        const antigua = pendientes.slice().sort((a, b) => a.orden - b.orden)[0];
        if (antigua) {
            const minutos = (2 * 1440 + clockMinutes()) - antigua.orden;
            setText("[data-stat='antigua']", `${Math.floor(minutos / 60)} h ${minutos % 60} min`);
            setText("[data-stat='antigua-detalle']", `${antigua.autor} · ${antigua.fecha}, ${antigua.hora}`);
        } else {
            setText("[data-stat='antigua']", "Sin pendientes");
            setText("[data-stat='antigua-detalle']", lista.length === 0 ? "La bandeja aún no tiene registros" : "Todas las publicaciones fueron revisadas");
        }

        const cuenta = (estado) => lista.filter((p) => !estado || p.estado === estado).length;
        setText("[data-tab-count='todas']", `Todas (${cuenta()})`);
        setText("[data-tab-count='pendiente']", `Pendientes (${cuenta("pendiente")})`);
        setText("[data-tab-count='aprobada']", `Aprobadas (${cuenta("aprobada")})`);
        setText("[data-tab-count='oculta']", `Ocultas (${cuenta("oculta")})`);
    }

    function renderList() {
        const lista = publicaciones();
        const texto = normalize(busqueda.value);
        const filtradas = lista.filter((p) => {
            const campos = normalize([p.titulo, p.autor, p.sector, p.ubicacion, p.texto].join(" "));
            return (pestana === "todas" || p.estado === pestana) &&
                (!texto || campos.includes(texto)) &&
                (!categoria.value || p.categoria === categoria.value);
        }).sort((a, b) => {
            const repA = !a.reportesRevisados && a.reportes.length > 0 ? 1 : 0;
            const repB = !b.reportesRevisados && b.reportes.length > 0 ? 1 : 0;
            return (repB - repA) || (masRecientes ? 1 : -1) * (b.orden - a.orden);
        });

        const contenedor = qs("#post-list");
        const resumen = qs("#post-summary");
        if (lista.length === 0) {
            resumen.textContent = "0 publicaciones registradas";
            contenedor.innerHTML = emptyStateHtml("Aún no hay publicaciones", "Las nuevas publicaciones vecinales aparecerán aquí para su revisión.", "Actualizar bandeja", "refresh-posts");
            setText("#post-footer", "");
            return;
        }
        if (filtradas.length === 0) {
            resumen.textContent = `0 resultados · Se conservan las ${lista.length} publicaciones y sus contadores`;
            const termino = busqueda.value.trim();
            contenedor.innerHTML = emptyStateHtml(
                "No encontramos publicaciones",
                termino ? `No hay coincidencias para «${termino}». Prueba otro autor, publicación o ubicación.` : "No hay publicaciones con los filtros aplicados.",
                "Limpiar filtros",
                "clear-post-filters"
            );
            setText("#post-footer", "");
            return;
        }

        const reportadas = filtradas.filter((p) => !p.reportesRevisados && p.reportes.length > 0).length;
        resumen.textContent = `${plural(filtradas.length, "publicación", "publicaciones")} · ${reportadas} ${reportadas === 1 ? "reportada" : "reportadas"} y ${filtradas.length - reportadas} sin reportes`;
        contenedor.innerHTML = filtradas.map((p) => {
            const numReportes = p.reportes.length;
            return `
                <li class="post-card">
                    <h3>${escapeHtml(p.titulo)}</h3>
                    <p><span class="post-author">${escapeHtml(p.autor)}</span> · ${p.fecha} · ${p.hora} · ${escapeHtml(p.sector)} · ${PUB_STATUS[p.estado].texto}</p>
                    ${p.anonimo ? "<p>Publica como «Vecino anónimo» en la app · Autor real: solo gestión</p>" : ""}
                    <p>${escapeHtml(p.texto)}</p>
                    <p>Categoría: ${CATEGORIES[p.categoria].nombre} &nbsp;·&nbsp; <span class="post-reports${numReportes > 0 ? " has-reports" : ""}">${plural(numReportes, "reporte", "reportes")}</span></p>
                    <button type="button" class="link-button" data-review="${p.id}">Revisar →</button>
                </li>`;
        }).join("");
        setText("#post-footer", `Mostrando ${filtradas.length} de ${plural(lista.length, "publicación", "publicaciones")} · Revisar abre el detalle y las decisiones de moderación.`);
    }

    function renderAll() {
        renderStats();
        renderList();
        updateNotificationDot("coordinador");
    }

    function limpiar() {
        busqueda.value = "";
        categoria.value = "";
        renderList();
        busqueda.focus();
    }

    qsa(".status-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            pestana = tab.dataset.tab;
            qsa(".status-tab").forEach((t) => t.setAttribute("aria-pressed", String(t === tab)));
            renderList();
        });
    });
    busqueda.addEventListener("input", renderList);
    categoria.addEventListener("input", renderList);
    ordenBoton.addEventListener("click", () => {
        masRecientes = !masRecientes;
        ordenBoton.textContent = masRecientes
            ? "Reportadas primero · Más recientes primero dentro de cada grupo ↓"
            : "Reportadas primero · Más antiguas primero dentro de cada grupo ↑";
        renderList();
    });
    qs("#clear-post-filters").addEventListener("click", limpiar);
    document.addEventListener("click", (evento) => {
        if (evento.target.closest("[data-action='clear-post-filters']")) {
            limpiar();
        }
        if (evento.target.closest("[data-action='refresh-posts']")) {
            renderAll();
            showPageNotice("info", `Bandeja actualizada · ${clockTime()}`, "No hay nuevas publicaciones vecinales por revisar.");
        }
        const revisar = evento.target.closest("[data-review]");
        if (revisar) {
            openReview(revisar.dataset.review);
        }
    });

    /* C07 · Revisión de publicación */
    const dialogo = qs("#review-dialog");

    function openReview(id) {
        const pub = state.publicaciones.find((p) => p.id === id);
        if (!pub) {
            return;
        }
        renderReview(pub);
        openDialog(dialogo);
        history.replaceState(null, "", `?pub=${id}`);
    }

    dialogo.addEventListener("close", () => {
        history.replaceState(null, "", window.location.pathname);
        renderAll();
    });

    function renderReview(pub) {
        const estado = PUB_STATUS[pub.estado];
        const decision = pub.decision;
        let aviso = "";
        if (decision && pub.estado === "aprobada") {
            aviso = bannerHtml("success", `Publicación aprobada · ${decision.hora}`, "Visible en Red Vecinal como «Vecino anónimo». Puedes cambiar la decisión y ocultarla después.");
        } else if (decision && pub.estado === "oculta") {
            aviso = bannerHtml("info", `Publicación oculta · ${decision.hora}`, "No aparece en la app. Puedes cambiar la decisión y aprobarla después para que aparezca en Red Vecinal.");
        }
        if (aviso && !pub.anonimo) {
            aviso = aviso.replace("como «Vecino anónimo»", "con el nombre del autor");
        }

        const reportes = pub.reportes.length > 0 ? `
            <section class="reports-card" aria-labelledby="reports-title">
                <h4 id="reports-title">${plural(pub.reportes.length, "reporte recibido", "reportes recibidos")}</h4>
                <ul>${pub.reportes.map((r) => `<li>${r.hora ? `${escapeHtml(r.hora)} · ` : ""}${escapeHtml(r.motivo)}</li>`).join("")}</ul>
                <p class="note note--small">Son motivos señalados por vecinos, no conclusiones de moderación.</p>
            </section>` : "";

        let panel;
        if (pub.estado === "pendiente") {
            panel = `
                <h3>Decidir sobre esta publicación</h3>
                <p>Aprobar: aparece en Red Vecinal. Ocultar: desaparece de la app.<br>Puedes volver a Revisar desde Moderación y cambiar la decisión más adelante.</p>
                <div class="modal-actions">
                    <button type="button" class="btn btn--neutral" data-decision="oculta">Ocultar</button>
                    <button type="button" class="btn btn--primary" data-decision="aprobada">Aprobar</button>
                </div>`;
        } else if (pub.estado === "aprobada") {
            panel = `
                <h3>Cambiar la decisión</h3>
                <div class="modal-actions">
                    <button type="button" class="btn btn--neutral" data-close-dialog>Volver</button>
                    <button type="button" class="btn btn--danger-dark" data-decision="oculta">Ocultar publicación</button>
                </div>`;
        } else {
            panel = `
                <h3>Cambiar la decisión</h3>
                <p>Aprobar: aparece en Red Vecinal. Ocultar: desaparece de la app. Puedes volver a Revisar desde Moderación y cambiar la decisión más adelante.</p>
                <div class="modal-actions modal-actions--single">
                    <button type="button" class="btn btn--primary" data-decision="aprobada">Aprobar publicación</button>
                </div>`;
        }

        const criterios = [
            ["utilidad", "Utilidad para la comunidad", "Describe una necesidad concreta en un espacio público."],
            ["lenguaje", "Lenguaje respetuoso", "No contiene insultos ni acusaciones a personas."],
            ["datos", "Protección de datos personales", "Sin celulares, domicilios privados ni personas identificables en la foto."],
            ["verificacion", "Verificación responsable", "No se ha confirmado la falla en campo. No presentar el relato como un hecho comprobado."]
        ];

        qs("#review-content").innerHTML = `
            <div class="review-header">
                <div>
                    <h2 id="review-title">Revisar publicación</h2>
                    <p>PUBLICACIÓN · ${escapeHtml(pub.fechaLarga)} · ${escapeHtml(pub.hora)} · ${escapeHtml(pub.sector)}</p>
                </div>
                ${badge(estado.texto, estado.badge)}
            </div>
            ${aviso}
            <p class="form-error-summary" data-review-error hidden>Marca los cuatro criterios de revisión para aprobar la publicación.</p>
            <div class="review-layout">
                <div class="review-post">
                    <h3>${escapeHtml(pub.titulo)}</h3>
                    <div>${badge(CATEGORIES[pub.categoria].nombre, "category")}</div>
                    <p>${escapeHtml(pub.texto)}</p>
                    ${pub.foto ? `
                        <figure class="review-photo stack-8">
                            <img src="${IMAGES}${pub.foto}" alt="${escapeHtml(pub.fotoTexto)}">
                            <figcaption class="photo-caption">${escapeHtml(pub.fotoTexto)} · <a href="${IMAGES}${pub.foto}" target="_blank" rel="noopener">Ver imagen ↗</a></figcaption>
                        </figure>` : ""}
                    <p class="review-location">Ubicación: ${escapeHtml(pub.ubicacion)}</p>
                    ${reportes}
                </div>
                <div class="review-criteria">
                    <h3>Criterios de revisión</h3>
                    <p class="note" style="font-size:13px">Revisión editorial de Diego Salazar. No equivale a comprobar los hechos.</p>
                    ${criterios.map(([clave, titulo, ayuda]) => `
                        <div class="criteria-item">
                            <label class="check-option">
                                <input type="checkbox" name="criterio" value="${clave}" checked>
                                <span class="check-box">${icon("check.svg")}</span>
                                ${titulo}
                            </label>
                            <p>${ayuda}</p>
                        </div>`).join("")}
                    ${bannerHtml("warning", `Validaciones vecinales: ${pub.validaciones}`, "Los hechos siguen pendientes de comprobación. Si falta sustento, evita difundir afirmaciones no verificadas.")}
                </div>
            </div>
            <section class="decision-panel" aria-label="Decisión de moderación">${panel}</section>`;

        qsa("[data-decision]", dialogo).forEach((boton) => {
            boton.addEventListener("click", () => decide(pub, boton.dataset.decision));
        });
    }

    function decide(pub, nuevoEstado) {
        if (nuevoEstado === "aprobada") {
            const sinMarcar = qsa("input[name='criterio']", dialogo).some((c) => !c.checked);
            if (sinMarcar) {
                qs("[data-review-error]", dialogo).hidden = false;
                return;
            }
        }
        const hora = clockTime();
        pub.estado = nuevoEstado;
        pub.decision = { hora };
        pub.reportesRevisados = true;
        addCoordActivity(nuevoEstado === "aprobada" ? "Publicación aprobada" : "Publicación oculta", `${pub.titulo}. Diego Salazar · Coordinador.`);
        saveState();
        renderReview(pub);
        renderAll();
        qs("#review-content").scrollIntoView({ block: "start" });
    }

    renderAll();
    const pubInicial = getParam("pub");
    if (pubInicial) {
        openReview(pubInicial);
    }
}

/* 13. Coordinador: C08/C09 Comunicados ---------------------------------- */
function initNotices() {
    const vacio = demoMode() === "vacio";
    const lista = vacio ? [] : state.comunicados;
    const contenedor = qs("#notice-list");
    setText("#notice-count", `${plural(lista.length, "comunicado publicado", "comunicados publicados")}`);

    if (lista.length === 0) {
        contenedor.innerHTML = `<li>${emptyStateHtml("Aún no hay comunicados", "Crea el primer mensaje para informar a los vecinos de Santa Aurora.", "Nuevo comunicado", "new-notice")}</li>`;
        qs("#notice-footer").hidden = true;
    } else {
        let masRecientes = true;
        const orden = qs("#notice-sort");
        const render = () => {
            const ordenada = lista.slice().sort((a, b) => (masRecientes ? 1 : -1) * ((b.orden || 0) - (a.orden || 0)));
            contenedor.innerHTML = ordenada.map((c) => `
                <li class="notice-card${c.nuevo ? " is-new" : ""}" id="${c.id}" tabindex="-1">
                    <h3>${escapeHtml(c.titulo)}</h3>
                    <p class="notice-date">${escapeHtml(c.fecha)} · ${escapeHtml(c.hora)} · ${escapeHtml(c.autor)}</p>
                    <p>Junta vecinal · Publicado en Red Vecinal</p>
                    <p${c.nuevo ? ' class="notice-body"' : ""}>${escapeHtml(c.contenido)}</p>
                </li>`).join("");
        };
        orden.hidden = false;
        orden.addEventListener("click", () => {
            masRecientes = !masRecientes;
            orden.textContent = masRecientes ? "Más recientes primero ↓" : "Más antiguos primero ↑";
            render();
        });
        render();
        setText("#notice-footer", `Mostrando ${lista.length} de ${plural(lista.length, "comunicado", "comunicados")} · La atribución pública es «Junta vecinal»; el autor de gestión queda registrado.`);

        // Llegada desde el buscador global (#COM-xx): resalta y enfoca el comunicado
        const destino = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
        if (destino) {
            destino.focus();
            destino.scrollIntoView({ block: "center" });
        }
    }

    document.addEventListener("click", (evento) => {
        if (evento.target.closest("[data-action='new-notice']")) {
            window.location.href = "coordinador-nuevo-comunicado.html";
        }
    });

    const publicado = getParam("publicado");
    if (publicado) {
        showPageNotice("success", `Comunicado publicado · ${clockTime()}`, "El comunicado ya aparece en Red Vecinal con la atribución «Junta vecinal».");
    }
}

function initNewNotice() {
    const formulario = qs("#notice-form");
    const titulo = qs("#notice-title");
    const contenido = qs("#notice-content");
    const previewTitulo = qs("[data-preview='title']");
    const previewContenido = qs("[data-preview='content']");
    const errorDialogo = qs("#publish-error-dialog");
    const BORRADOR = "oevecino-borrador-comunicado";

    // Recupera el texto si una publicación anterior falló
    try {
        const borrador = JSON.parse(sessionStorage.getItem(BORRADOR) || "null");
        if (borrador) {
            titulo.value = borrador.titulo;
            contenido.value = borrador.contenido;
        }
    } catch (error) {
        sessionStorage.removeItem(BORRADOR);
    }

    function actualizarVista() {
        const t = titulo.value.trim();
        const c = contenido.value.trim();
        previewTitulo.textContent = t || "Título del comunicado";
        previewTitulo.classList.toggle("is-placeholder", !t);
        previewContenido.textContent = c || "El contenido aparecerá aquí.";
        previewContenido.classList.toggle("is-placeholder", !c);
    }

    [titulo, contenido].forEach((campo) => {
        campo.addEventListener("input", () => {
            if (campo.value.trim()) {
                setFieldError(campo, "");
            }
            actualizarVista();
        });
    });

    qs("[data-preview='time']").textContent = clockTime();

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const t = titulo.value.trim();
        const c = contenido.value.trim();
        setFieldError(titulo, t ? "" : "Ingresa el título del comunicado.");
        setFieldError(contenido, c ? "" : "Ingresa el contenido del comunicado.");
        if (!t || !c) {
            (t ? contenido : titulo).focus();
            return;
        }

        // Sin conexión: se conserva el texto y se muestra el error de Figma
        if (!navigator.onLine) {
            sessionStorage.setItem(BORRADOR, JSON.stringify({ titulo: t, contenido: c }));
            openDialog(errorDialogo);
            return;
        }

        state.comunicados.forEach((com) => {
            com.nuevo = false;
        });
        state.comunicados.unshift({
            id: `COM-${Date.now()}`,
            titulo: t,
            fecha: "2 nov. de 2026",
            hora: clockTime(),
            // Siempre después del último publicado (el mockup tiene uno a las 09:00)
            orden: Math.max(3 * 1440 + clockMinutes(), ...state.comunicados.map((com) => com.orden || 0)) + 1,
            autor: "Diego Salazar",
            contenido: c,
            nuevo: true
        });
        addCoordActivity("Comunicado publicado", `${t}. Junta vecinal · Diego Salazar.`);
        saveState();
        sessionStorage.removeItem(BORRADOR);
        window.location.href = "coordinador-comunicados.html?publicado=1";
    });

    actualizarVista();
}

/* 14. Coordinador: C10/C11 Directorio ----------------------------------- */
function initDirectory() {
    const busqueda = qs("#neighbor-search");
    const lista = state.vecinos.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

    function render() {
        const texto = normalize(busqueda.value);
        const filtrados = lista.filter((v) => !texto || normalize(v.nombre).includes(texto));
        const contenedor = qs("#neighbor-list");
        if (filtrados.length === 0) {
            setText("#neighbor-summary", `0 coincidencias · ${lista.length} vecinos en el directorio`);
            contenedor.innerHTML = `<li>${emptyStateHtml("No encontramos vecinos", `No hay coincidencias para «${busqueda.value.trim()}». Revisa el nombre o limpia la búsqueda para ver el directorio.`, "Limpiar búsqueda", "clear-neighbors")}</li>`;
            qs("#neighbor-footer").hidden = true;
            return;
        }
        setText("#neighbor-summary", texto ? `${plural(filtrados.length, "coincidencia", "coincidencias")} · Orden alfabético` : `${lista.length} vecinos · Orden alfabético`);
        contenedor.innerHTML = filtrados.map((v) => `
            <li class="neighbor-row">
                <div class="neighbor-card">
                    <h3>${escapeHtml(v.nombre)}</h3>
                    <p>Santa Aurora · ${escapeHtml(v.sector)}</p>
                </div>
                <span class="verified">Vecino verificado ${icon("verificado.svg", "Verificado")}</span>
                <a class="btn btn--secondary" href="coordinador-vecino.html?id=${v.id}" aria-label="Ver perfil de ${escapeHtml(v.nombre)}">Ver perfil →</a>
            </li>`).join("");
        qs("#neighbor-footer").hidden = false;
        setText("#neighbor-footer", `Mostrando ${filtrados.length} de ${lista.length} vecinos · Ver perfil abre el registro seleccionado.`);
    }

    function limpiar() {
        busqueda.value = "";
        render();
        busqueda.focus();
    }

    busqueda.addEventListener("input", render);
    qs("#clear-search").addEventListener("click", limpiar);
    document.addEventListener("click", (evento) => {
        if (evento.target.closest("[data-action='clear-neighbors']")) {
            limpiar();
        }
    });
    render();
}

function initNeighborProfile() {
    const vecino = state.vecinos.find((v) => v.id === getParam("id")) || state.vecinos.find((v) => v.id === "lucia-vargas");
    document.title = `${vecino.nombre} · Perfil vecinal · OeVecino`;
    setText("[data-neighbor='initials']", vecino.iniciales);
    setText("[data-neighbor='name']", vecino.nombre);
    setText("[data-neighbor='sector']", vecino.sector);
    setText("[data-neighbor='fullname']", vecino.nombre);
    setText("[data-neighbor='phone']", vecino.celular || "Sin informar");
}

/* 15. W02 · Mi perfil --------------------------------------------------- */
function initProfile() {
    qsa("[data-open-logout-page]").forEach((boton) => {
        boton.addEventListener("click", () => openDialog(qs("#logout-dialog")));
    });
}

/* 16. Serenazgo: S01 Panel ---------------------------------------------- */
function initSerPanel() {
    const activos = serActiveIncidents();
    const sinAsignar = activos.filter((i) => i.estadoSer === "sin-asignar").length;
    const altas = activos.filter((i) => i.prioridad === "alta");
    const altasSinAsignar = altas.filter((i) => i.estadoSer === "sin-asignar").length;
    const cerradosSesion = state.incidentes.filter((i) => i.estadoSer === "cerrado" && i.cerradoEnSimulacion).length;
    const cuentaUnidades = (estado) => state.unidades.filter((u) => u.estado === estado).length;

    setText("[data-stat='activos']", activos.length);
    setText("[data-stat='activos-detalle']", `${sinAsignar} sin asignar · ${activos.length - sinAsignar} en respuesta`);
    setText("[data-stat='altas']", altas.length);
    setText("[data-stat='altas-detalle']", `${altasSinAsignar} ${altasSinAsignar === 1 ? "requiere" : "requieren"} asignación`);
    setText("[data-stat='atendidos']", state.casosAtendidosBase + cerradosSesion);
    setText("[data-stat='disponibles']", cuentaUnidades("disponible"));
    setText("[data-stat='en-ruta']", cuentaUnidades("en-ruta"));
    setText("[data-stat='en-atencion']", cuentaUnidades("en-atencion"));
    setText("[data-stat='fuera']", cuentaUnidades("fuera-servicio"));

    // Mapa operativo: incidentes sin asignar o en ruta y unidades ubicadas
    const viewport = qs("#ops-map");
    let capas = "";
    activos.filter((i) => i.mapaOps && i.prioridad === "alta" && ["sin-asignar", "en-ruta"].includes(i.estadoSer)).forEach((inc) => {
        capas += `<a class="map-chip map-chip--incident" href="serenazgo-seguimiento.html?id=${inc.id}" style="${positionStyle(inc.mapaOps, "operativo")}">${icon("pin-blanco.svg")}${incidentTitle(inc)}</a>`;
    });
    state.unidades.filter((u) => u.mapaOps && u.estado !== "fuera-servicio").forEach((u) => {
        capas += `<a class="map-chip map-chip--unit" href="serenazgo-unidad.html?id=${u.id}" style="${positionStyle(u.mapaOps, "operativo")}">${icon("unidad-pequena.svg")}${u.id}</a>`;
    });
    capas += `<span class="map-chip map-chip--alert" style="${positionStyle([95, 211], "operativo")}">${icon("advertencia-oscuro.svg")}Alerta vial</span>`;
    viewport.innerHTML = `<div class="map-canvas">${mapBaseHtml("operativo")}${capas}</div>${mapControlsHtml()}${offlineHtml(clockTime() + ":00")}`;
    setupMapInteractions(viewport);
    setText("[data-map='actualizacion']", `Última actualización: ${clockTime()}:00 · GPS cada 15 segundos.`);

    // Atención prioritaria y otros incidentes
    const ordenados = activos.slice().sort((a, b) => timeToMinutes(b.hora) - timeToMinutes(a.hora));
    const prioritarios = ordenados.filter((i) => i.prioridad === "alta").slice(0, 3);
    const otros = ordenados.filter((i) => !prioritarios.includes(i)).slice(0, 3);

    qs("#priority-list").innerHTML = prioritarios.length
        ? prioritarios.map((inc) => opsIncidentCard(inc, true)).join("")
        : `<li class="card"><p class="card-text">No hay incidentes de prioridad alta.</p></li>`;
    qs("#other-list").innerHTML = otros.length
        ? otros.map((inc) => opsIncidentCard(inc, false)).join("")
        : `<li class="card"><p class="card-text">No hay otros incidentes activos.</p></li>`;

    if (!initSerPanel.escuchando) {
        initSerPanel.escuchando = true;
        document.addEventListener("oevecino:nuevo-incidente", initSerPanel);
    }

    qs("#ser-activity").innerHTML = state.actividadSer.slice(0, 3).map((act) => `
        <li class="card card--compact activity-card">
            <h3>${escapeHtml(act.hora)} · ${escapeHtml(act.titulo)}</h3>
            <p>${escapeHtml(act.texto)}</p>
        </li>`).join("");
}

function serTitle(inc) {
    return inc.derivadoPorCoordinador ? `${inc.id} · Derivado por el Coordinador` : incidentTitle(inc);
}

function opsMetaHtml(inc) {
    return `
        <p class="ops-meta">
            <span class="ops-priority${inc.prioridad === "alta" ? " is-alta" : ""}">Prioridad ${PRIORITY[inc.prioridad].texto}</span>
            <span>${SER_STATUS[inc.estadoSer].texto}</span>
            <span>${inc.hora}</span>
            ${inc.fichaMedica ? `<span class="ops-flag"><button type="button" class="ops-flag-button" data-medical="${inc.id}" aria-label="Ver ficha médica de ${inc.id}">Ficha médica</button></span>` : ""}
        </p>`;
}

function opsIncidentCard(inc, conIcono) {
    return `
        <li class="ops-incident-card">
            <h3>${escapeHtml(serTitle(inc))}</h3>
            <p class="ops-address">${escapeHtml(ubicacionSer(inc))}</p>
            ${opsMetaHtml(inc)}
            <a class="link-button" href="serenazgo-seguimiento.html?id=${inc.id}">Ver seguimiento →</a>
            ${conIcono && !inc.derivadoPorCoordinador ? categoryTile(inc.categoria, inc.categoria === "sos" ? "" : "") : ""}
        </li>`;
}

/* Ficha médica (solo lectura): se abre desde el seguimiento, la bandeja y el panel. */
function medicalDialogHtml() {
    return `
        <dialog class="modal" id="medical-dialog" aria-labelledby="medical-title">
            <div class="modal-content">
                <button type="button" class="modal-close" data-close-dialog aria-label="Cerrar ventana">${icon("cerrar.svg")}</button>
                <div class="modal-header">
                    <h2 id="medical-title">Ficha médica</h2>
                    <p id="medical-subtitle" class="modal-subtitle-small"></p>
                </div>
                <div class="modal-body modal-body--compact" id="medical-data"></div>
                <p class="note note--small">Los campos sin datos se muestran como «Sin informar».</p>
                <div class="modal-actions modal-actions--single">
                    <button type="button" class="btn btn--primary" data-close-dialog>Cerrar</button>
                </div>
            </div>
        </dialog>`;
}

function openMedicalRecord(inc) {
    if (!inc || !inc.fichaMedica) {
        return;
    }
    const f = inc.fichaMedica;
    const valor = (dato) => escapeHtml(dato || "Sin informar");
    setText("#medical-subtitle", `${inc.id} · ${CATEGORIES[inc.categoria].nombre} · Información de solo lectura`);
    qs("#medical-data").innerHTML = `
        <div class="data-item"><span class="data-label">Nombre completo</span><span class="data-value data-value--name">${valor(f.nombre)}</span></div>
        <div class="data-item"><span class="data-label">Tipo de sangre</span><span class="data-value">${valor(f.sangre)}</span></div>
        <div class="data-item"><span class="data-label">Alergias</span><span class="data-value">${valor(f.alergias)}</span></div>
        <div class="data-item"><span class="data-label">Enfermedades preexistentes</span><span class="data-value">${valor(f.enfermedades)}</span></div>
        <div class="data-item"><span class="data-label">Seguro / EPS</span><span class="data-value">${valor(f.seguro)}</span></div>`;
    openDialog(qs("#medical-dialog"));
}

/* Aviso flotante cuando llega un incidente nuevo: se ve en cualquier
   pantalla de Serenazgo y aunque se haya bajado en la página. */
function showIncomingToast(inc) {
    const anterior = qs(".toast");
    if (anterior) {
        anterior.remove();
    }
    const enBandeja = document.body.dataset.page === "serenazgo-incidentes";
    document.body.insertAdjacentHTML("beforeend", `
        <div class="toast" role="alert">
            ${icon("info.svg")}
            <div class="banner-content">
                <p class="banner-title">Nuevo incidente · ${inc.id}</p>
                <p class="banner-text">${escapeHtml(CATEGORIES[inc.categoria].nombre)} recibido a las ${inc.hora}.${enBandeja ? " Ya aparece al inicio de la bandeja." : ""}</p>
                <a class="btn btn--primary btn--small" href="serenazgo-seguimiento.html?id=${inc.id}">Ver nuevo incidente</a>
            </div>
            <button type="button" class="toast-close" aria-label="Cerrar aviso">${icon("cerrar.svg")}</button>
        </div>`);
    qs(".toast .toast-close").addEventListener("click", () => qs(".toast").remove());
}

/* Llegada simulada de un nuevo SOS (S02 · Nuevo incidente). */
function simulateIncomingIncident() {
    if (state.entranteRecibido || demoMode() === "vacio") {
        return;
    }
    window.setTimeout(() => {
        loadState();
        if (state.entranteRecibido) {
            return;
        }
        const nuevo = cloneData(DEMO_DATA.incidenteEntrante);
        nuevo.hora = clockTime();
        nuevo.cronologiaSer[0].hora = nuevo.hora;
        state.incidentes.unshift(nuevo);
        state.entranteRecibido = true;
        state.entranteVisto = false;
        addSerActivity("Nuevo reporte", `${nuevo.id} · SOS en ${nuevo.direccion}. Origen: app del vecino.`);
        saveState();
        updateNotificationDot("serenazgo");
        document.dispatchEvent(new CustomEvent("oevecino:nuevo-incidente", { detail: nuevo }));
        showIncomingToast(nuevo);
    }, 15000);
}

/* 17. Serenazgo: S02 Bandeja -------------------------------------------- */
function initSerInbox() {
    const busqueda = qs("#inbox-search");
    const categoria = qs("#inbox-category");
    const estado = qs("#inbox-status");
    const orden = qs("#inbox-sort");
    let masRecientes = true;

    const consulta = getParam("q");
    if (consulta) {
        busqueda.value = consulta;
    }

    function render() {
        loadState();
        const vacio = demoMode() === "vacio";
        const activos = vacio ? [] : serActiveIncidents();
        const texto = normalize(busqueda.value);
        const filtrados = activos.filter((inc) => {
            const campos = normalize([inc.id, inc.direccion, inc.sector, inc.referencia].join(" "));
            return (!texto || campos.includes(texto)) &&
                (!categoria.value || inc.categoria === categoria.value) &&
                (!estado.value || inc.estadoSer === estado.value);
        }).sort((a, b) => (masRecientes ? 1 : -1) * (timeToMinutes(b.hora) - timeToMinutes(a.hora)));

        setText("[data-active-count]", plural(activos.length, "incidente activo", "incidentes activos"));
        qs(".chip-select--status").classList.toggle("chip-select--active", Boolean(estado.value));

        // Aviso de nuevo incidente
        const entrante = getIncident("INC-0252");
        const aviso = qs("#new-incident-banner");
        if (entrante && !state.entranteVisto && isSerActive(entrante) && !vacio) {
            aviso.hidden = false;
            setText("#new-incident-title", `Nuevo incidente · ${entrante.id}`);
            setText("#new-incident-text", `SOS recibido a las ${entrante.hora}. El reporte ya aparece al inicio de la bandeja.`);
            qs("#new-incident-link").href = `serenazgo-seguimiento.html?id=${entrante.id}`;
        } else {
            aviso.hidden = true;
        }

        const lista = qs("#inbox-list");
        const sinActivos = qs("#inbox-empty");
        const resumen = qs("#inbox-summary");
        const pie = qs("#inbox-footer");

        if (activos.length === 0) {
            lista.innerHTML = "";
            resumen.hidden = true;
            pie.hidden = true;
            sinActivos.hidden = false;
            setText("#inbox-empty-banner-text", `Última revisión: ${clockTime()}. La recepción de reportes sigue activa durante tu turno.`);
            return;
        }
        sinActivos.hidden = true;
        resumen.hidden = false;
        setText("#inbox-count", `${plural(filtrados.length, "reporte", "reportes")} · Central Norte`);
        setText("#inbox-updated", `Actualizado a las ${clockTime()}`);

        if (filtrados.length === 0) {
            lista.innerHTML = `<li>${emptyStateHtml("No encontramos incidentes", busqueda.value.trim() ? `No hay coincidencias para «${busqueda.value.trim()}» con los filtros aplicados.` : "No hay incidentes con los filtros aplicados.", "Limpiar filtros", "clear-inbox")}</li>`;
            pie.hidden = true;
            return;
        }
        pie.hidden = false;
        setText("#inbox-footer", `Mostrando ${filtrados.length} de ${plural(activos.length, "incidente activo", "incidentes activos")} · Cada tarjeta permite ver su seguimiento.`);
        lista.innerHTML = filtrados.map((inc) => `
            <li class="ops-incident-card inbox-card${inc.id === "INC-0252" && !state.entranteVisto ? " is-new" : ""}">
                <div class="inbox-card-text">
                    <h3>${escapeHtml(serTitle(inc))}</h3>
                    <p class="ops-address">${escapeHtml(ubicacionSer(inc))}</p>
                    ${opsMetaHtml(inc)}
                    <a class="link-button" href="serenazgo-seguimiento.html?id=${inc.id}">Ver seguimiento →</a>
                </div>
                ${inc.derivadoPorCoordinador ? "" : categoryTile(inc.categoria, "large")}
            </li>`).join("");
    }

    function limpiar() {
        busqueda.value = "";
        categoria.value = "";
        estado.value = "";
        render();
    }

    [busqueda, categoria, estado].forEach((el) => el.addEventListener("input", render));
    orden.addEventListener("click", () => {
        masRecientes = !masRecientes;
        orden.textContent = masRecientes ? "Más recientes primero ↓" : "Más antiguos primero ↑";
        render();
    });
    document.addEventListener("click", (evento) => {
        if (evento.target.closest("[data-action='clear-inbox']")) {
            limpiar();
        }
        if (evento.target.closest("[data-action='refresh-inbox']")) {
            render();
            showPageNotice("info", `Bandeja actualizada · ${clockTime()}`, "No hay nuevos reportes por ahora.");
        }
    });
    document.addEventListener("oevecino:nuevo-incidente", render);
    render();
}

/* 18. Serenazgo: S03 Seguimiento ---------------------------------------- */
function initTracking() {
    const inc = getIncident(getParam("id") || "INC-0248");
    if (!inc || !isSerVisible(inc)) {
        qs("#tracking-detail").innerHTML = emptyStateHtml("Incidente no encontrado", "El incidente solicitado no está en la bandeja de Central Norte.", "", "");
        return;
    }

    // Registrar recepción (se refleja en el detalle del Coordinador)
    if (inc.id === "INC-0252") {
        state.entranteVisto = true;
    }
    if (inc.estadoCoord === "derivado") {
        inc.pasosCoord = inc.pasosCoord || {};
        if (!inc.pasosCoord.recibido) {
            inc.pasosCoord.recibido = { hora: clockTime(), quien: "María Torres" };
        }
    }
    if (demoMode() === "sin-senal" && inc.unidad && inc.estadoSer !== "cerrado") {
        inc.gps = Object.assign({}, inc.gps, { estado: "sin-senal", ultima: `${minutesToTime(clockMinutes() - 1)}:45` });
    }
    saveState();
    updateNotificationDot("serenazgo");

    renderTracking(inc);
    setupTrackingActions(inc);
}

function renderTracking(inc) {
    const estado = SER_STATUS[inc.estadoSer];
    const unidad = inc.unidad ? getUnit(inc.unidad) : null;
    const cerrado = inc.estadoSer === "cerrado";
    const sinSenal = inc.gps && inc.gps.estado === "sin-senal" && !cerrado;
    document.title = `${serTitle(inc)} · Seguimiento · OeVecino`;

    setText("[data-track='title']", serTitle(inc));
    setText("[data-track='location']", `${ubicacionSer(inc)} · Recibido hoy a las ${inc.hora}`);
    qs("[data-track='status']").innerHTML = badge(estado.texto, estado.badge);

    // Botón principal de la cabecera
    const cabecera = qs("[data-track='header-action']");
    if (cerrado) {
        cabecera.innerHTML = '<a class="btn btn--secondary" href="serenazgo-incidentes.html">Volver a la bandeja</a>';
    } else if (inc.estadoSer === "sin-asignar") {
        cabecera.innerHTML = '<button type="button" class="btn btn--light" disabled title="Asigna una unidad antes de cerrar el caso">Cerrar caso</button>';
    } else {
        cabecera.innerHTML = '<button type="button" class="btn btn--danger" data-action="open-close">Cerrar caso</button>';
    }

    const reportante = inc.reportante?.nombre ? `Reportado por ${escapeHtml(inc.reportante.nombre)} · Central Norte` : "Reporte desde la app del vecino · Central Norte";
    qs("[data-track='meta']").innerHTML = `
        ${categoryTile(inc.categoria)}
        ${priorityBadge(inc.prioridad)}
        ${inc.fichaMedica ? badge("Ficha médica", "info") : ""}
        <span class="meta-text">${reportante}</span>
        ${inc.fichaMedica ? '<span class="meta-actions"><button type="button" class="btn btn--secondary" data-action="open-medical">Ver ficha médica</button></span>' : ""}`;

    // Avisos
    let avisos = "";
    if (cerrado && inc.cierre) {
        avisos += bannerHtml("success", `Caso cerrado · ${inc.cierre.hora}`, inc.cierre.aviso);
    } else if (inc.estadoSer === "sin-asignar") {
        avisos += bannerHtml("warning", "Este incidente aún no tiene una unidad", "Asigna una unidad disponible para iniciar el despacho. El caso permanece Sin asignar.");
    } else if (inc.avisoSer) {
        avisos += bannerHtml(inc.avisoSer.tipo, inc.avisoSer.titulo, inc.avisoSer.texto);
    }
    if (sinSenal && unidad) {
        avisos += bannerHtml("warning", `Sin señal GPS de ${unidad.id}`, `Última ubicación: ${inc.gps.ultima}. El recorrido está desactualizado; confirma la posición por radio. El caso sigue ${estado.texto}.`);
    }
    qs("[data-track='notices']").innerHTML = avisos;

    // Estado de la atención: 4 pasos + 4 botones
    const p = inc.pasosSer || {};
    const pasos = [
        { titulo: "Despachado", dato: p.despachado, pendiente: "Requiere una unidad" },
        { titulo: "En ruta", dato: p.enRuta, pendiente: "Después del despacho" },
        { titulo: "En atención", dato: p.enAtencion, pendiente: "Confirmar llegada al lugar" },
        { titulo: "Cierre", dato: p.cierre, pendiente: "Registrar resultado de atención" }
    ];
    const acciones = trackingButtons(inc);
    qs("[data-track='steps']").innerHTML = pasos.map((paso) => `
        <li class="step-card step-card--ops">
            <h3>${paso.dato ? "✓ " : ""}${paso.titulo}</h3>
            <p class="step-value">${paso.dato ? escapeHtml(paso.dato.hora) : "Pendiente"}</p>
            <p>${paso.dato ? escapeHtml(paso.dato.quien) : paso.pendiente}</p>
        </li>`).join("") + acciones.map((a) => `<li class="steps-action-item">${a}</li>`).join("");

    // Mapa con recorrido
    setText("[data-track='map-title']", cerrado ? "Recorrido de la atención" : "Ubicación y recorrido GPS");
    const mapaEstado = cerrado ? ["Finalizado", "info"] : !unidad ? ["Sin unidad", "info"] : sinSenal ? ["Sin señal", "neutral"] : ["GPS activo", "info"];
    qs("[data-track='map-status']").innerHTML = badge(mapaEstado[0], mapaEstado[1]);
    renderTrackingMap(inc, unidad, inc.estadoSer !== "sin-asignar");
    let notaMapa;
    if (cerrado) {
        notaMapa = `Recorrido archivado · Última posición de la atención: ${inc.cierre ? inc.cierre.hora : inc.hora}:00.`;
    } else if (!unidad) {
        notaMapa = `Ubicación del reporte recibida a las ${inc.hora} · El recorrido aparecerá al asignar una unidad.`;
    } else if (sinSenal) {
        notaMapa = `Última actualización GPS: ${inc.gps.ultima} · Posición no actual.`;
    } else {
        notaMapa = `Última actualización GPS: ${clockTime()}:00${inc.gps?.llegada && inc.estadoSer === "en-ruta" ? ` · ${inc.gps.llegada}` : "."}`;
    }
    setText("[data-track='map-note']", notaMapa);

    // Unidad asignada
    setText("[data-track='unit-title']", cerrado ? "Unidad que atendió" : "Unidad asignada");
    const cajaUnidad = qs("[data-track='unit']");
    if (!unidad) {
        cajaUnidad.innerHTML = `
            <div class="card card--compact">
                <h3 class="card-title card-title--small">Sin unidad asignada</h3>
                <p class="card-text">Aún no se ha iniciado el despacho. Revisa las unidades disponibles de Central Norte.</p>
            </div>
            <button type="button" class="btn btn--primary btn--block" data-action="open-assign">Asignar unidad</button>`;
    } else {
        const estUnidad = UNIT_STATUS[unidad.estado];
        cajaUnidad.innerHTML = `
            <div class="card card--compact">
                <h3 class="card-title card-title--small">${unidad.id} · ${escapeHtml(unidad.tipo)}</h3>
                <p class="unit-card-body">
                    <span>Placa: ${escapeHtml(unidad.placa)}</span>
                    <span>${escapeHtml(unidad.jefeEtiqueta)}: ${escapeHtml(unidad.jefe)}</span>
                    <span>Conductor: ${escapeHtml(unidad.conductor)}</span>
                    ${unidad.radio ? `<span>Radio: ${escapeHtml(unidad.radio.replace(" · ", " · "))}</span>` : ""}
                </p>
            </div>
            <div>${badge(estUnidad.texto, estUnidad.badge)}</div>
            <a class="btn btn--secondary btn--block" href="serenazgo-unidad.html?id=${unidad.id}">Ver detalle de unidad</a>
            ${sinSenal ? '<button type="button" class="btn btn--secondary btn--block" data-action="radio-confirm">Confirmar por radio</button>' : ""}`;
    }

    // Resultado y calificación
    const resultado = qs("[data-track='result']");
    if (cerrado && inc.cierre) {
        resultado.hidden = false;
        qs("[data-track='result-body']").innerHTML = `
            <div class="stack-8">
                <h3>${escapeHtml(inc.cierre.titulo)}</h3>
                <p>${escapeHtml(inc.cierre.descripcion || "Sin descripción adicional.")}</p>
                <p class="note">Cierre: ${escapeHtml(inc.cierre.responsable)} · ${escapeHtml(inc.cierre.hora)} · Central web</p>
            </div>
            ${inc.cierre.calificacion ? `
                <div class="stack-8">
                    <h3>${escapeHtml(inc.cierre.calificacion.titulo)}</h3>
                    <div class="rating-stars" aria-label="${escapeHtml(inc.cierre.calificacion.titulo)}">${`<span>${icon("estrella.svg")}</span>`.repeat(inc.cierre.calificacion.estrellas)}</div>
                    <p>«${escapeHtml(inc.cierre.calificacion.comentario)}»</p>
                    <p class="note">${escapeHtml(inc.cierre.calificacion.autor)}</p>
                </div>` : `
                <div class="stack-8">
                    <h3>Calificación del vecino</h3>
                    <p>El vecino podrá calificar la atención desde la app.</p>
                </div>`}`;
    } else {
        resultado.hidden = true;
    }

    // Cronología y actualización del jefe de unidad
    qs("[data-track='timeline']").innerHTML = timelineHtml(inc.cronologiaSer || []);
    const jefe = inc.actualizacionJefe;
    qs("[data-track='leader']").innerHTML = jefe ? `
        <h3 class="text-strong" style="font-size:14px;font-weight:900">${escapeHtml(jefe.autor)}</h3>
        <p class="leader-quote">«${escapeHtml(jefe.texto)}»</p>
        <p class="note">${escapeHtml(jefe.hora)} · ${escapeHtml(jefe.origen)}</p>
        ${sinSenal ? '<p class="note">Parte conservado antes de la pérdida de señal.</p>' : ""}` : `
        ${icon("mensaje.svg", "", "leader-empty-icon")}
        <p class="leader-quote">Sin actualizaciones. El jefe de unidad podrá enviar novedades después del despacho.</p>`;
}

/* Botones de la fila "Estado de la atención" según el estado del caso. */
function trackingButtons(inc) {
    const e = inc.estadoSer;
    const deshabilitado = (texto) => `<button type="button" class="btn" disabled>${texto}</button>`;
    const primario = (texto, accion) => `<button type="button" class="btn btn--primary" data-action="${accion}">${texto}</button>`;
    if (e === "sin-asignar") {
        return [primario("Asignar unidad", "open-assign"), deshabilitado("Marcar en ruta"), deshabilitado("Marcar en atención"), '<button type="button" class="btn btn--light" disabled>Cerrar caso</button>'];
    }
    if (e === "despachado") {
        return [deshabilitado("Despacho registrado"), primario("Marcar en ruta", "mark-route"), deshabilitado("Marcar en atención"), '<button type="button" class="btn btn--secondary" data-action="open-close">Cerrar caso</button>'];
    }
    if (e === "en-ruta") {
        return [deshabilitado("Despacho registrado"), deshabilitado("Marcar en ruta"), primario("Marcar en atención", "mark-attention"), '<button type="button" class="btn btn--secondary" data-action="open-close">Cerrar caso</button>'];
    }
    if (e === "en-atencion") {
        return [deshabilitado("Despacho registrado"), deshabilitado("Marcar en ruta"), deshabilitado("Llegada registrada"), primario("Cerrar caso", "open-close")];
    }
    return [deshabilitado("Despacho registrado"), deshabilitado("Marcar en ruta"), deshabilitado("Llegada registrada"), '<button type="button" class="btn btn--light" disabled>Caso cerrado</button>'];
}

function renderTrackingMap(inc, unidad, conRecorrido) {
    const viewport = qs("#track-map");
    const pos = inc.mapaOps || [445, 126];
    let capas = `<span class="map-chip map-chip--incident" style="${positionStyle(pos, "operativo")}">${icon("pin-blanco.svg")}${inc.id} · ${CATEGORIES[inc.categoria].nombre === "SOS" ? "SOS" : CATEGORIES[inc.categoria].nombre}</span>`;
    if (unidad && conRecorrido) {
        // El trazo original de Figma (200×79) une la unidad con el incidente.
        const haciaArriba = pos[1] + 79 > 280;
        const haciaDerecha = pos[0] - 195 < 8;
        const rutaX = haciaDerecha ? pos[0] + 100 : pos[0] - 195;
        const rutaY = haciaArriba ? pos[1] - 79 + 12 : pos[1];
        const unidadX = haciaDerecha ? rutaX + 200 - 40 : rutaX;
        const unidadY = haciaArriba ? rutaY - 10 : pos[1] + 79;
        const transformacion = `${haciaDerecha ? "scaleX(-1) " : ""}${haciaArriba ? "scaleY(-1)" : ""}`.trim();
        capas = `<img class="map-route" src="${ICONS}recorrido.svg" alt="" style="${positionStyle([rutaX, rutaY], "operativo")}${transformacion ? `;transform:${transformacion}` : ""}">` + capas;
        capas += `<a class="map-chip map-chip--unit" href="serenazgo-unidad.html?id=${unidad.id}" style="${positionStyle([unidadX, unidadY], "operativo")}">${icon("unidad-pequena.svg")}${unidad.id}</a>`;
    }
    viewport.innerHTML = `<div class="map-canvas">${mapBaseHtml("operativo")}${capas}</div>${mapControlsHtml()}${offlineHtml(inc.gps?.ultima || clockTime() + ":00")}`;
    setupMapInteractions(viewport);
}

function setupTrackingActions(inc) {
    const dialogoAsignar = qs("#assign-dialog");
    const dialogoCierre = qs("#close-dialog");

    function refrescar() {
        saveState();
        renderTracking(inc);
        updateNotificationDot("serenazgo");
    }

    function nota(evento) {
        inc.cronologiaSer = inc.cronologiaSer || [];
        inc.cronologiaSer.unshift(evento);
    }

    document.addEventListener("click", (evento) => {
        const objetivo = evento.target.closest("[data-action]");
        if (!objetivo) {
            return;
        }
        const accion = objetivo.dataset.action;
        const hora = clockTime();
        const unidad = inc.unidad ? getUnit(inc.unidad) : null;

        if (accion === "open-assign") {
            renderAssignDialog(inc);
            openDialog(dialogoAsignar);
        }

        if (accion === "mark-route" && unidad) {
            inc.estadoSer = "en-ruta";
            inc.pasosSer.enRuta = { hora, quien: "María Torres · Central" };
            unidad.estado = "en-ruta";
            nota({ hora, titulo: "Unidad en ruta", detalle: `Se registró la salida de ${unidad.id} hacia ${inc.direccion}.`, responsable: "María Torres · Origen: Central web" });
            addSerActivity("Unidad en ruta", `${unidad.id} en camino a ${inc.id}. Registrado por María Torres.`);
            refrescar();
        }

        if (accion === "mark-attention" && unidad) {
            inc.estadoSer = "en-atencion";
            inc.pasosSer.enAtencion = { hora, quien: "María Torres · Central" };
            unidad.estado = "en-atencion";
            if (inc.estadoCoord === "derivado") {
                inc.pasosCoord.atencion = { hora, quien: "María Torres" };
                inc.cronologiaCoord.unshift({ hora, titulo: "Atención iniciada", detalle: "Serenazgo confirmó el inicio de la atención del reporte.", responsable: "María Torres · Serenazgo" });
            }
            nota({ hora, titulo: `${unidad.id} inició la atención`, detalle: "Se registró la llegada al lugar y el apoyo al vecino.", responsable: "María Torres · Origen: Central web" });
            addSerActivity("Atención iniciada", `Llegada de ${unidad.id} a ${inc.id}. Registrado por María Torres.`);
            refrescar();
        }

        if (accion === "open-close") {
            renderCloseDialog(inc);
            openDialog(dialogoCierre);
        }

        if (accion === "open-medical") {
            openMedicalRecord(inc);
        }

        if (accion === "radio-confirm" && unidad) {
            inc.gps = Object.assign({}, inc.gps, { estado: "activo" });
            nota({ hora, titulo: "Posición confirmada por radio", detalle: `María Torres confirmó por radio la posición de ${unidad.id}.`, responsable: "María Torres · Origen: Central web" });
            refrescar();
        }
    });

    // Confirmar asignación
    qs("#assign-confirm").addEventListener("click", () => {
        const elegida = qs("input[name='unidad']:checked", dialogoAsignar);
        if (!elegida) {
            return;
        }
        const unidad = getUnit(elegida.value);
        const hora = clockTime();
        inc.unidad = unidad.id;
        inc.estadoSer = "despachado";
        inc.pasosSer = { despachado: { hora, quien: "María Torres · Central" } };
        inc.gps = { estado: "activo", ultima: `${hora}:00`, llegada: unidad.distancias?.[inc.id] ? `Distancia inicial: ${unidad.distancias[inc.id].replace("A ", "")}.` : "" };
        unidad.estado = "en-ruta";
        unidad.incidente = inc.id;
        inc.avisoSer = { tipo: "success", titulo: "Patrulla en camino", texto: `Mensaje entregado a la app del vecino a las ${hora}. María Torres asignó ${unidad.id} y registró el estado Despachado.` };
        if (inc.estadoCoord === "derivado") {
            inc.pasosCoord.recibido = inc.pasosCoord.recibido || { hora, quien: "María Torres" };
        }
        nota({ hora, titulo: `Despachado · ${unidad.id} asignada`, detalle: `María Torres asignó ${unidad.id}, placa ${unidad.placa}. Notificación enviada al vecino.`, responsable: "María Torres · Origen: Central web" });
        addSerActivity("Unidad despachada", `María Torres asignó ${unidad.id} a ${inc.id}. Origen: central web.`);
        closeDialog(dialogoAsignar);
        refrescar();
    });

    // Confirmar cierre
    qs("#close-form").addEventListener("submit", (evento) => {
        evento.preventDefault();
        const seleccion = qs("input[name='resultado']:checked", dialogoCierre);
        const grupo = qs("#close-options-field");
        if (!seleccion) {
            grupo.classList.add("has-error");
            qs("#close-error").hidden = false;
            qs("input[name='resultado']", dialogoCierre).focus();
            return;
        }
        const hora = clockTime();
        const unidad = inc.unidad ? getUnit(inc.unidad) : null;
        const resultado = CLOSE_RESULTS[seleccion.value];
        const descripcion = qs("#close-description").value.trim();

        inc.estadoSer = "cerrado";
        inc.cerradoEnSimulacion = true;
        inc.pasosSer.cierre = { hora, quien: "María Torres · Central" };
        if (!inc.pasosSer.enAtencion) {
            inc.pasosSer.enAtencion = null;
        }
        inc.cierre = {
            hora,
            titulo: resultado === "Atendido" ? "Resuelto · Atención registrada" : resultado,
            descripcion,
            responsable: "María Torres",
            aviso: `Resultado: ${resultado}. El cierre fue comunicado a la app del vecino.${unidad ? ` ${unidad.id} volvió a estar disponible.` : ""}`
        };
        if (unidad) {
            unidad.estado = "disponible";
            unidad.incidente = null;
        }
        if (inc.estadoCoord === "derivado") {
            inc.pasosCoord.cierre = { hora, quien: "María Torres" };
            inc.cronologiaCoord.unshift({ hora, titulo: "Caso cerrado por Serenazgo", detalle: `Resultado: ${resultado}.`, responsable: "María Torres · Serenazgo" });
        }
        nota({ hora, titulo: `Caso cerrado · ${resultado}`, detalle: `María Torres registró el cierre.${descripcion ? ` ${descripcion}` : ""}`, responsable: "María Torres · Origen: Central web" });
        addSerActivity("Caso cerrado", `${inc.id} · ${resultado}. Registrado por María Torres.`);
        closeDialog(dialogoCierre);
        refrescar();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    qsa("input[name='resultado']", dialogoCierre).forEach((opcion) => {
        opcion.addEventListener("change", () => {
            qs("#close-options-field").classList.remove("has-error");
            qs("#close-error").hidden = true;
        });
    });
}

function renderAssignDialog(inc) {
    const disponibles = state.unidades.filter((u) => u.estado === "disponible");
    setText("#assign-incident", `${incidentTitle(inc)} · Prioridad ${PRIORITY[inc.prioridad].texto.toLowerCase()}`);
    setText("#assign-address", ubicacionSer(inc));
    const cuerpo = qs("#assign-body");
    const boton = qs("#assign-confirm");
    if (disponibles.length === 0) {
        boton.disabled = true;
        cuerpo.innerHTML = `
            <div class="stack-8">
                <h3 class="text-danger" style="font-size:19px;font-weight:900">No hay unidades disponibles</h3>
                <p class="text-secondary" style="font-size:15px">Todas las unidades de Central Norte están en ruta, en atención o fuera de servicio.</p>
            </div>
            <div class="stack-8">
                <p class="text-strong" style="font-size:15px">El incidente permanece Sin asignar.</p>
                <p class="text-secondary" style="font-size:15px">No se registra un despacho ni se comunica una patrulla en camino a la app del vecino.</p>
            </div>
            <p class="text-secondary" style="font-size:15px">Espera a que una unidad quede disponible. Cancela para volver al seguimiento y mantener el reporte pendiente.</p>`;
        return;
    }
    boton.disabled = false;
    cuerpo.innerHTML = `
        <fieldset class="stack-16" style="border:none">
            <legend class="overline" style="margin-bottom:16px">${disponibles.length} ${disponibles.length === 1 ? "unidad disponible" : "unidades disponibles"} · Central Norte</legend>
            <div class="unit-list">
                ${disponibles.map((u, i) => `
                    <label class="unit-option">
                        <input type="radio" name="unidad" value="${u.id}"${i === 0 ? " checked" : ""}>
                        <span class="unit-radio"></span>
                        <span>
                            <strong>${u.id}<span data-selected-label>${i === 0 ? " · Seleccionada" : ""}</span></strong>
                            <p>${escapeHtml(u.jefe)} · ${escapeHtml(u.jefeEtiqueta)} / ${escapeHtml(u.conductor)} · Conductor</p>
                            <p>Placa ${escapeHtml(u.placa)} · ${escapeHtml(u.tipo)}${u.distancias?.[inc.id] ? ` · ${u.distancias[inc.id]}` : ""}</p>
                        </span>
                    </label>`).join("")}
            </div>
        </fieldset>
        <p class="note">Al asignar se registrarán la hora del despacho y María Torres como responsable. El estado será Despachado y la app del vecino recibirá «Patrulla en camino».</p>`;
    qsa("input[name='unidad']", cuerpo).forEach((radio) => {
        radio.addEventListener("change", () => {
            qsa("[data-selected-label]", cuerpo).forEach((etiqueta) => {
                etiqueta.textContent = etiqueta.closest("label").querySelector("input").checked ? " · Seleccionada" : "";
            });
        });
    });
}

function renderCloseDialog(inc) {
    const nombre = inc.reportante?.nombre ? ` · ${inc.reportante.nombre}` : "";
    setText("#close-subtitle-1", `${incidentTitle(inc)}${nombre}`);
    setText("#close-subtitle-2", ubicacionSer(inc));
    setText("#close-cancel-note", `Cancelar mantiene el caso ${SER_STATUS[inc.estadoSer].texto}, sin guardar cambios.`);
    qsa("input[name='resultado']").forEach((r) => {
        r.checked = false;
    });
    qs("#close-description").value = "";
    qs("#close-options-field").classList.remove("has-error");
    qs("#close-error").hidden = true;
}

/* 19. Serenazgo: S07/S08 Unidades --------------------------------------- */
function initUnits() {
    const vacio = demoMode() === "vacio";
    const unidades = vacio ? [] : state.unidades;
    const busqueda = qs("#unit-search");
    const estado = qs("#unit-status");
    const cuenta = (e) => unidades.filter((u) => u.estado === e).length;

    setText("[data-stat='disponible']", cuenta("disponible"));
    setText("[data-stat='en-ruta']", cuenta("en-ruta"));
    setText("[data-stat='en-atencion']", cuenta("en-atencion"));
    setText("[data-stat='fuera-servicio']", cuenta("fuera-servicio"));
    qsa("[data-updated]").forEach((el) => {
        el.textContent = `Actualizado a las ${clockTime()}`;
    });

    function render() {
        const texto = normalize(busqueda.value);
        const filtradas = unidades.filter((u) => {
            const campos = normalize([u.id, u.placa, u.jefe, u.conductor].join(" "));
            return (!texto || campos.includes(texto)) && (!estado.value || u.estado === estado.value);
        });
        setText("#unit-count", `${plural(filtradas.length, "unidad", "unidades")} · Central Norte`);
        const tabla = qs("#unit-table");
        const vacioEl = qs("#unit-empty");

        if (unidades.length === 0) {
            tabla.hidden = true;
            vacioEl.hidden = false;
            vacioEl.innerHTML = emptyStateHtml("No hay unidades registradas", "Central Norte aún no tiene unidades registradas. Contacta al administrador para actualizar la flota.", "Actualizar", "refresh-units");
            setText("#unit-footer", "Las unidades aparecerán aquí cuando sean registradas en la central.");
            return;
        }
        if (filtradas.length === 0) {
            tabla.hidden = true;
            vacioEl.hidden = false;
            vacioEl.innerHTML = emptyStateHtml("No encontramos unidades", busqueda.value.trim() ? `No hay coincidencias para «${busqueda.value.trim()}» con el estado seleccionado.` : "No hay unidades con el estado seleccionado.", "Limpiar filtros", "clear-units");
            setText("#unit-footer", "");
            return;
        }
        tabla.hidden = false;
        vacioEl.hidden = true;
        setText("#unit-records", plural(unidades.length, "registro", "registros"));
        setText("#unit-showing", `Mostrando 1–${filtradas.length} de ${plural(filtradas.length, "unidad", "unidades")}`);
        setText("#unit-footer", `Mostrando ${filtradas.length} de ${plural(unidades.length, "unidad", "unidades")} · Selecciona Ver detalle para consultar una unidad.`);

        qs("#unit-rows").innerHTML = filtradas.map((u) => {
            const est = UNIT_STATUS[u.estado];
            const inc = u.incidente ? getIncident(u.incidente) : null;
            const tripulacion = u.jefe
                ? `<span class="cell-stack"><strong>${escapeHtml(u.jefe)} · Jefatura</strong><small>${escapeHtml(u.conductor)} · Conductor</small></span>`
                : '<span class="cell-stack"><strong>Sin tripulación</strong><small>Mantenimiento</small></span>';
            const turno = u.turno ? u.turno.replace(" · ", "<br>") : "Sin turno operativo";
            const incidente = inc
                ? `<span class="cell-incident">${categoryTile(inc.categoria, "sm")}<span class="cell-stack"><strong>${inc.id}</strong><small>${escapeHtml(CATEGORIES[inc.categoria].nombre)}</small></span></span>`
                : `<span class="cell-stack"><strong>Sin incidente</strong><small>${escapeHtml(u.nota || "Lista para despacho")}</small></span>`;
            return `
                <tr data-href="serenazgo-unidad.html?id=${u.id}">
                    <td class="cell-strong" data-label="Código">${u.id}</td>
                    <td data-label="Estado">${badge(est.texto, est.badge)}</td>
                    <td class="cell-full" data-label="Tripulación">${tripulacion}</td>
                    <td data-label="Turno">${turno}</td>
                    <td data-label="Placa">${escapeHtml(u.placa)}</td>
                    <td class="cell-full" data-label="Incidente asignado">${incidente}</td>
                    <td class="cell-full"><a class="btn btn--text btn--small" href="serenazgo-unidad.html?id=${u.id}">Ver detalle<span class="visually-hidden"> de ${u.id}</span></a></td>
                </tr>`;
        }).join("");
    }

    function limpiar() {
        busqueda.value = "";
        estado.value = "";
        render();
    }

    busqueda.addEventListener("input", render);
    estado.addEventListener("input", render);
    document.addEventListener("click", (evento) => {
        if (evento.target.closest("[data-action='clear-units']")) {
            limpiar();
        }
        if (evento.target.closest("[data-action='refresh-units']")) {
            render();
            showPageNotice("info", `Lista actualizada · ${clockTime()}`, "No se encontraron nuevas unidades registradas.");
        }
    });
    setupClickableRows(qs("#unit-rows"));
    render();
}

function initUnitDetail() {
    const unidad = getUnit(getParam("id") || "SER-012");
    if (!unidad) {
        qs("#unit-detail").innerHTML = emptyStateHtml("Unidad no encontrada", "La unidad solicitada no está registrada en Central Norte.", "", "");
        return;
    }
    const est = UNIT_STATUS[unidad.estado];
    document.title = `${unidad.id} · Unidades de Serenazgo · OeVecino`;
    setText("[data-unit='crumb']", unidad.id);
    setText("[data-unit='title']", `${unidad.id} · ${unidad.tipo}`);
    qs("[data-unit='status']").innerHTML = badge(est.texto, est.badge);
    setText("[data-unit='code']", unidad.id);
    setText("[data-unit='plate']", unidad.placa);
    setText("[data-unit='type']", unidad.tipo);
    setText("[data-unit='leader-label']", unidad.jefeEtiqueta || "Jefe de unidad");
    setText("[data-unit='leader']", unidad.jefe || "Sin tripulación");
    setText("[data-unit='driver']", unidad.conductor || "Sin tripulación");
    setText("[data-unit='shift']", unidad.turno || "Sin turno operativo");
    const radio = qs("[data-unit='radio-item']");
    radio.hidden = !unidad.radio;
    setText("[data-unit='radio']", unidad.radio);
    setText("[data-unit='updated']", `Información operativa de Central Norte · Actualizada a las ${clockTime()}.`);

    const inc = unidad.incidente ? getIncident(unidad.incidente) : null;
    const caja = qs("[data-unit='incident']");
    if (!inc) {
        caja.innerHTML = `
            <div class="card card--compact">
                <h3 class="card-title card-title--small">Sin incidente asignado</h3>
                <p class="card-text">${unidad.estado === "fuera-servicio"
                    ? `${unidad.id} está fuera de servicio por ${escapeHtml((unidad.nota || "mantenimiento").toLowerCase())}.`
                    : `${unidad.id} está disponible para despacho. No tiene un incidente asignado en este momento.`}</p>
            </div>`;
        return;
    }
    const p = inc.pasosSer || {};
    const historial = [
        p.despachado ? `Despacho: ${p.despachado.hora} · ${p.despachado.quien.split(" · ")[0]}` : "",
        p.enRuta ? `En ruta: ${p.enRuta.hora} · ${p.enRuta.quien.split(" · ")[0]}` : "",
        p.enAtencion ? `En atención: ${p.enAtencion.hora} · ${p.enAtencion.quien.split(" · ")[0]}` : ""
    ].filter(Boolean).join("<br>");
    const jefe = inc.actualizacionJefe;
    caja.innerHTML = `
        <div class="card card--compact" style="position:relative">
            <h3 class="card-title card-title--small" style="padding-right:40px">${escapeHtml(incidentTitle(inc))}</h3>
            <p class="meta-note">${escapeHtml(ubicacionSer(inc))}${inc.reportante?.nombre ? `<br>Reportado por ${escapeHtml(inc.reportante.nombre)}` : ""}<br>Recibido hoy a las ${inc.hora}</p>
            <span style="position:absolute;top:24px;right:24px">${categoryTile(inc.categoria, "sm")}</span>
        </div>
        <div>${badge(SER_STATUS[inc.estadoSer].texto, SER_STATUS[inc.estadoSer].badge)}</div>
        <a class="btn btn--secondary btn--block" href="serenazgo-seguimiento.html?id=${inc.id}">Ver seguimiento del incidente</a>
        ${historial ? `<p class="meta-note">${historial}</p>` : ""}
        ${jefe ? `
            <div class="card card--compact">
                <h3 class="card-title card-title--small">Última actualización</h3>
                <p class="leader-quote">«${escapeHtml(jefe.texto)}»</p>
                <p class="leader-quote" style="margin-top:12px">${escapeHtml(jefe.hora)} · ${escapeHtml(jefe.autor.split(" · ")[0])} · ${escapeHtml(jefe.origen)}</p>
            </div>` : ""}`;
}

/* 20. Arranque ---------------------------------------------------------- */
const PAGES = {
    "login": { init: initLogin },
    "coordinador-panel": { rol: "coordinador", nav: "panel", init: initCoordPanel },
    "coordinador-incidentes": { rol: "coordinador", nav: "incidentes", init: initCoordIncidents },
    "coordinador-incidente": { rol: "coordinador", nav: "incidentes", init: initCoordIncident },
    "coordinador-moderacion": { rol: "coordinador", nav: "red-vecinal", init: initModeration },
    "coordinador-comunicados": { rol: "coordinador", nav: "red-vecinal", init: initNotices },
    "coordinador-nuevo-comunicado": { rol: "coordinador", nav: "red-vecinal", init: initNewNotice },
    "coordinador-directorio": { rol: "coordinador", nav: "directorio", init: initDirectory },
    "coordinador-vecino": { rol: "coordinador", nav: "directorio", init: initNeighborProfile },
    "coordinador-perfil": { rol: "coordinador", nav: "perfil", init: initProfile },
    "serenazgo-panel": { rol: "serenazgo", nav: "panel", init: initSerPanel },
    "serenazgo-incidentes": { rol: "serenazgo", nav: "incidentes", init: initSerInbox },
    "serenazgo-seguimiento": { rol: "serenazgo", nav: "incidentes", init: initTracking },
    "serenazgo-unidades": { rol: "serenazgo", nav: "unidades", init: initUnits },
    "serenazgo-unidad": { rol: "serenazgo", nav: "unidades", init: initUnitDetail },
    "serenazgo-perfil": { rol: "serenazgo", nav: "perfil", init: initProfile }
};

document.addEventListener("DOMContentLoaded", () => {
    if (demoMode() === "reset") {
        resetState();
        window.location.replace(window.location.pathname);
        return;
    }
    loadState();
    setupDialogs();

    // Los formularios de filtros funcionan en vivo: evitamos que recarguen la página
    qsa("form.filters, form.filters-row").forEach((formulario) => {
        formulario.addEventListener("submit", (evento) => evento.preventDefault());
    });

    const pagina = PAGES[document.body.dataset.page];
    if (!pagina) {
        return;
    }
    if (pagina.rol) {
        if (!requireRole(pagina.rol)) {
            return;
        }
        renderShell(pagina.rol, pagina.nav);
        if (pagina.rol === "serenazgo") {
            document.body.insertAdjacentHTML("beforeend", medicalDialogHtml());
            document.addEventListener("click", (evento) => {
                const boton = evento.target.closest("[data-medical]");
                if (boton) {
                    openMedicalRecord(getIncident(boton.dataset.medical));
                }
            });
            simulateIncomingIncident();
        }
    }
    pagina.init();
});
