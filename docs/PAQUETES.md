# 📦 Manual de Configuración de Paquetes — Invitaciones Digitales

Este documento detalla la estructura, campos del cuestionario y secciones visuales que configuran cada uno de los paquetes disponibles en el sistema de invitaciones de cumpleaños (`Esencial`, `Completa` y `Premium`). Sirve como referencia técnica para la creación y extensión de nuevos paquetes o tipos de eventos.

---

## 🛠️ Estructura del Modelo de Datos

Los datos específicos de cada invitación se guardan en la base de datos PostgreSQL como un objeto JSON en el campo `datosInvitacion` del modelo `Pedido`.
En el código TypeScript, estos datos son tipados bajo la interfaz `InvitacionData` definida en `src/types/index.ts`. La configuración y esquema de validación de los formularios de edición se cargan dinámicamente desde `src/lib/paquetes.ts`.

---

## 📋 Catálogo de Campos por Paquete

### 1. Paquete Esencial ($350 MXN)
Diseñado para invitaciones básicas de carga rápida.

#### Campos del Cuestionario
- **Nombre del festejado** (`nombre` | Tipo: `text`): Requerido. Límite de 40 caracteres.
- **Edad que cumple** (`edad` | Tipo: `number`): Requerido.
- **Fecha del cumpleaños** (`fecha` | Tipo: `date`): Requerido.
- **Hora** (`hora` | Tipo: `time`): Requerido.
- **Nombre del lugar** (`lugar` | Tipo: `text`): Requerido. Nombre del salón o terraza.
- **Dirección** (`direccion` | Tipo: `textarea`): Requerido. Dirección física detallada.
- **Enlace de Google Maps** (`mapsLink` | Tipo: `url`): Opcional. URL de ubicación.
- **Tipo de celebración** (`tipoCelebracion` | Tipo: `select`): Requerido. Opciones: `Adultos` | `Infantil` | `Sorpresa`.
- **Foto del festejado** (`fotoPortada` | Tipo: `upload`): Requerido. 1 foto de portada para Cloudinary.
- **Frase o mensaje** (`mensaje` | Tipo: `textarea`): Opcional. Mensaje de bienvenida.
- **WhatsApp** (`whatsapp` | Tipo: `tel`): Requerido. Teléfono del anfitrión para recibir RSVP.
- **Color primario** (`colorPrimario` | Tipo: `color`): Opcional. Default: `#f59e0b` (Naranja/Ámbar).
- **Color secundario** (`colorSecundario` | Tipo: `color`): Opcional. Default: `#1f2937` (Carbono).

#### Secciones Renderizadas en el Visor
- `portada`: Imagen de portada, nombre, edad, frase y cuenta regresiva si aplica.
- `ubicacion`: Fecha, hora, nombre del lugar, dirección y botón a Google Maps.
- `rsvp`: Widget con botón flotante que abre modal/sección de confirmación de asistencia.
- `musica`: Carga del reproductor sutil en segundo plano.

---

### 2. Paquete Completa ($550 MXN)
El paquete intermedio enriquecido con secciones interactivas.

#### Campos del Cuestionario
- *Todos los campos del paquete Esencial* +
- **Música** (`musica` | Tipo: `select`): Requerido. Estilos predefinidos: `Fiesta` | `Pop` | `Regional` | `Infantil`.
- **Galería de fotos** (`fotosGaleria` | Tipo: `gallery`): Opcional. Soporta hasta 6 fotos.
- **Dress code** (`dressCode` | Tipo: `select`): Requerido. Opciones: `Casual` | `Fiesta` | `Temático` | `Elegante`.
- **Descripción del Dress code** (`dressCodeDesc` | Tipo: `textarea`): Opcional. Detalles (ej. *"Vengan de blanco"*).
- **Mensaje del festejado** (`mensajeFestejo` | Tipo: `textarea`): Opcional. Mensaje de agradecimiento.
- **Itinerario** (`itinerario` | Tipo: `textarea`): Opcional. Texto multilínea con formato `Hora — Evento`.
- **Datos de regalos** (`datosRegalo` | Tipo: `textarea`): Opcional. Instrucciones para regalos (ej. *"Lluvia de sobres"*).
- **¿Mesa de regalos?** (`mesaRegalos` | Tipo: `boolean`): Opcional. Activa el campo de detalles si es `true`.
- **Datos mesa regalos** (`mesaRegalosDatos` | Tipo: `text`): Condicional. URL o código de mesa de regalos (ej. de Liverpool). Se muestra solo si `mesaRegalos` es `true`.

#### Secciones Renderizadas en el Visor
- `portada`, `ubicacion`, `rsvp`, `musica`.
- `mensajeFestejo`: Cita destacada en cursiva del cumpleañero.
- `itinerario`: Línea de tiempo interactiva estructurada con iconos cronológicos.
- `galeria`: Cuadrícula responsiva de 6 imágenes con visor Lightbox Modal interactivo.
- `dresscode`: Tarjeta descriptiva con icono de vestimenta recomendada.
- `regalos`: Información bancaria o enlace a mesa de regalos de tiendas afiliadas.

---

### 3. Paquete Premium ($850 MXN)
La experiencia interactiva completa con control de pases de invitados y efectos visuales avanzados.

#### Campos del Cuestionario
- *Todos los campos de los paquetes Esencial y Completa* +
- **¿Qué significa esta edad?** (`historiaEdad` | Tipo: `textarea`): Requerido. Reflexión del cumpleaños.
- **Mensaje a seres queridos** (`historiaSeresQueridos` | Tipo: `textarea`): Requerido. Agradecimiento a familia/amigos.
- **Un recuerdo favorito** (`historiaRecuerdo` | Tipo: `textarea`): Requerido. Anécdota especial.
- **Fotos adicionales** (`fotosExtra` | Tipo: `upload`): Opcional. Hasta 6 fotos adicionales.
- **¿Buzón de deseos?** (`buzonDeseos` | Tipo: `boolean`): Opcional. Default: `true`.
- **¿Pases?** (`pases` | Tipo: `boolean`): Opcional. Activa pases individuales. Default: `true`.
- **Pases por invitado** (`numPases` | Tipo: `number`): Condicional. Cantidad por defecto. Default: 2.
- **Temática** (`tematica` | Tipo: `select`): Requerido. Estilos: `Tropical` | `Vintage` | `Neon` | `Elegante` | `Infantil`.
- **Link video** (`videoURL` | Tipo: `url`): Opcional. Enlace embebido a Youtube/Vimeo.
- **Color de acento** (`colorAcento` | Tipo: `select`): Requerido. Opciones: `Dorado` | `Plateado` | `Rosa` | `Azul` | `Verde`.
- **Fecha límite de confirmación** (`fechaLimiteRSVP` | Tipo: `date`): Opcional.
- **Mensaje de agradecimiento** (`mensajeAgradecimiento` | Tipo: `textarea`): Opcional.
- **Activar confetti** (`confettiAnimacion` | Tipo: `boolean`): Opcional. Default: `true`.
- **Mostrar cuenta regresiva** (`cuentaRegresiva` | Tipo: `boolean`): Opcional. Default: `true`.

#### Secciones Renderizadas en el Visor
- *Todas las secciones del paquete Completa* +
- `historia`: Línea de tiempo o bloques narrativos ("Mi Trayectoria") con 3 momentos clave.
- `cuentaRegresiva`: Widget dinámico que muestra días, horas, minutos y segundos restantes.
- `pases`: Mensaje personalizado que indica el número de pases asignados al invitado.
- `video`: Reproductor de video de invitación integrado.
- `albumQR`: Tarjeta interactiva con un código QR simulado para que los invitados compartan las fotos que tomen durante el evento.
- `buzon`: Habilita una caja interactiva de buenos deseos en el formulario de RSVP.

---

## 🔄 Mapeo JSON a Componentes Visuales

Cuando el visor público lee un pedido, pasa el objeto JSON al componente correspondiente. Dado que históricamente existieron cambios en los nombres de los campos de la base de datos (por refactorizaciones previas), el sistema utiliza un mapeo defensivo de alias en los templates para evitar fallos de renderizado:

```typescript
// Ejemplo de resolución de alias y fallback en CumpleCompleta.tsx
const galleryPhotos = data.fotosGaleria ?? data.galeriaFotos ?? data.fotos ?? [];
const codeVestimenta = data.dressCode ?? '';
const descVestimenta = data.dressCodeDesc ?? data.dressCodeDescripcion ?? '';
const mensajeFestejo = data.mensajeFestejo ?? data.mensajeFestejado ?? '';
const regalosBanco = data.datosRegalo ?? data.regalosDatos ?? '';
const mesaRegalosActiva = data.mesaRegalos ?? data.tieneMesaRegalos ?? false;
```

### Reglas de Mapeo
1. **Cloudinary Images**: Cualquier URL cruda guardada en `fotoPortada`, `fotosGaleria` o `fotosExtra` es procesada por `getOptimizedImageUrl` antes de inyectarse en el atributo `src` de los tags `<img>`.
2. **Colores Dinámicos**: Los colores hexadecimales se inyectan como variables inline en el estilo del contenedor HTML raíz:
   ```typescript
   const themeStyles = {
     '--primary': data.colorPrimario ?? '#F97316',
     '--secondary': data.colorSecundario ?? '#1F2937',
   } as React.CSSProperties;
   ```
   Esto permite que las clases utilitarias de Tailwind apliquen estilos adaptativos (ej. `bg-[var(--primary)]`).
