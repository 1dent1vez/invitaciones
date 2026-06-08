# 📦 PAQUETES DE INVITACIONES — Contexto Completo

> **Archivo de referencia para el agente de código.**  
> Contiene toda la información de los 12 paquetes (4 tipos de evento × 3 niveles).  
> El agente DEBE leer este archivo antes de implementar cualquier fase.

---

## 🏗️ ESTRUCTURA DE DATOS EN DB (Prisma)

```prisma
model Pedido {
  id           String   @id @default(cuid())
  clienteId    String
  cliente      Cliente  @relation(fields: [clienteId], references: [id])
  tipoEvento   String   // boda | xv | babyshower | cumpleanos
  paquete      String   // esencial | completa | premium
  template     String   // boda-esencial | boda-completa | boda-premium | ...
  fechaEvento  DateTime
  precio       Decimal  @db.Decimal(10, 2)  // Fijo según paquete
  estado       String   @default("cotizado")
  notas        String?
  slug         String?  @unique
  urlPublica   String?
  qrUrl        String?
  datosJson    Json?    // Solo los campos del paquete seleccionado
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  pagos        Pago[]
  rsvps        RSVP[]
  visitas      Visita[]
}
```

**Reglas de negocio:**
- `precio` se asigna automáticamente según `tipoEvento + paquete` (no editable por el admin).
- `template` se deriva automáticamente: `${tipoEvento}-${paquete}`.
- `datosJson` solo contiene los campos definidos para ese paquete específico.

---

## 💰 PRECIOS FIJOS POR PAQUETE

| Paquete | Precio MXN | Posicionamiento | Tiempo de producción |
|---------|-----------|-----------------|---------------------|
| **Esencial** | **$350** | "Todo lo necesario para invitar y confirmar" | 10-15 min |
| **Completa** | **$550** | "La experiencia completa de tu evento" | 20-25 min |
| **Premium** | **$850** | "Tu evento, contado a detalle" | 35-40 min |

---

## 🎨 DISEÑO VISUAL

Los 3 paquetes de un mismo tipo de evento comparten **misma base visual**:
- Misma paleta de colores (configurable por el cliente)
- Misma tipografía
- Misma animación de entrada
- **Diferencia:** El paquete Esencial tiene menos secciones, Completa tiene más, Premium tiene todas + extras.

Ejemplo: `boda-esencial`, `boda-completa`, `boda-premium` — los 3 se ven "elegantes", pero:
- Esencial: portada + ubicación + rsvp + música (4 secciones)
- Completa: + galería + dress code + mensaje + itinerario + regalos (9 secciones)
- Premium: + historia + buzón + álbum QR + pases + video + segundo idioma (16 secciones)

---

## 📋 CONFIGURACIÓN COMPLETA DE PAQUETES

```typescript
// src/lib/paquetes.ts

export const PRECIOS_PAQUETE = {
  esencial: 350,
  completa: 550,
  premium: 850,
} as const;

export const TIPOS_EVENTO = ["boda", "xv", "babyshower", "cumpleanos"] as const;
export const PAQUETES = ["esencial", "completa", "premium"] as const;

export type TipoEvento = typeof TIPOS_EVENTO[number];
export type Paquete = typeof PAQUETES[number];

export interface CampoConfig {
  id: string;
  tipo: "text" | "textarea" | "date" | "time" | "number" | "tel" | "url" | "upload" | "select" | "boolean" | "color";
  label: string;
  required: boolean;
  placeholder?: string;
  max?: number;           // Para upload (máx fotos)
  options?: string[];     // Para select
  default?: string | number | boolean;
  condicion?: string;     // ID del campo boolean que debe ser true para mostrar este
}

export interface PaqueteConfig {
  precio: number;
  secciones: string[];
  campos: CampoConfig[];
}

export const CONFIGURACION_EVENTOS: Record<TipoEvento, Record<Paquete, PaqueteConfig>> = {
  boda: {
    esencial: {
      precio: 350,
      secciones: ["portada", "ubicacion", "rsvp", "musica"],
      campos: [
        { id: "nombres", tipo: "text", label: "Nombre de los novios", required: true, placeholder: "Ana María López & Carlos Hernández Ruiz" },
        { id: "fecha", tipo: "date", label: "Fecha de la boda", required: true },
        { id: "horaCeremonia", tipo: "time", label: "Hora de la ceremonia", required: true },
        { id: "horaRecepcion", tipo: "time", label: "Hora de la recepción", required: true },
        { id: "templo", tipo: "text", label: "Nombre del templo/lugar ceremonia", required: true, placeholder: "Parroquia de San José" },
        { id: "direccionTemplo", tipo: "textarea", label: "Dirección ceremonia", required: true, placeholder: "Calle Hidalgo 123, Centro, Querétaro" },
        { id: "salon", tipo: "text", label: "Nombre del salón recepción", required: true, placeholder: "Hacienda San Ángel" },
        { id: "direccionSalon", tipo: "textarea", label: "Dirección recepción", required: true, placeholder: "Carretera 57 km 12, San Juan del Río" },
        { id: "mapsLink", tipo: "url", label: "Link Google Maps (opcional)", required: false },
        { id: "fotoPortada", tipo: "upload", label: "Foto de la pareja (portada)", required: true, max: 1 },
        { id: "mensaje", tipo: "textarea", label: "Frase o mensaje corto", required: false, placeholder: "Nos encantaría compartir este día con ustedes" },
        { id: "musica", tipo: "select", label: "Música de fondo", required: true, options: ["Romántica", "Instrumental", "Pop acústico"] },
        { id: "whatsapp", tipo: "tel", label: "WhatsApp para confirmaciones", required: true, placeholder: "5512345678" },
        { id: "colorPrimario", tipo: "color", label: "Color primario", required: false, default: "#d4af37" },
        { id: "colorSecundario", tipo: "color", label: "Color secundario", required: false, default: "#ffffff" },
      ],
    },
    completa: {
      precio: 550,
      secciones: ["portada", "ubicacion", "rsvp", "musica", "galeria", "dresscode", "mensajePadres", "itinerario", "regalos"],
      campos: [
        // Hereda todos los de esencial + adicionales
        { id: "nombres", tipo: "text", label: "Nombre de los novios", required: true },
        { id: "fecha", tipo: "date", label: "Fecha de la boda", required: true },
        { id: "horaCeremonia", tipo: "time", label: "Hora de la ceremonia", required: true },
        { id: "horaRecepcion", tipo: "time", label: "Hora de la recepción", required: true },
        { id: "templo", tipo: "text", label: "Nombre del templo", required: true },
        { id: "direccionTemplo", tipo: "textarea", label: "Dirección ceremonia", required: true },
        { id: "salon", tipo: "text", label: "Nombre del salón", required: true },
        { id: "direccionSalon", tipo: "textarea", label: "Dirección recepción", required: true },
        { id: "mapsLink", tipo: "url", label: "Link Google Maps", required: false },
        { id: "fotoPortada", tipo: "upload", label: "Foto de la pareja", required: true, max: 1 },
        { id: "mensaje", tipo: "textarea", label: "Frase o mensaje", required: false },
        { id: "musica", tipo: "select", label: "Música de fondo", required: true, options: ["Romántica", "Instrumental", "Pop acústico"] },
        { id: "whatsapp", tipo: "tel", label: "WhatsApp", required: true },
        { id: "colorPrimario", tipo: "color", label: "Color primario", required: false, default: "#d4af37" },
        { id: "colorSecundario", tipo: "color", label: "Color secundario", required: false, default: "#ffffff" },
        // ADICIONALES COMPLETA
        { id: "fotosGaleria", tipo: "upload", label: "Fotos para galería", required: false, max: 6 },
        { id: "dressCode", tipo: "select", label: "Código de vestimenta", required: true, options: ["Formal", "Semi-formal", "Cocktail", "Playa"] },
        { id: "dressCodeDesc", tipo: "textarea", label: "Descripción del dress code", required: false, placeholder: "Mujeres: vestido largo. Hombres: traje oscuro. No niños." },
        { id: "mensajePadres", tipo: "textarea", label: "Mensaje de los papás o pareja", required: false, placeholder: "Con la bendición de Dios y el amor de nuestras familias..." },
        { id: "itinerario", tipo: "textarea", label: "Itinerario de la fiesta", required: false, placeholder: "17:00 Ceremonia — 19:30 Recepción — 21:00 Primer baile — 22:30 Pastel — 00:00 Cierre" },
        { id: "datosRegalo", tipo: "textarea", label: "Datos para regalos en efectivo", required: false, placeholder: "Santander 1234567890 a nombre de Ana López" },
        { id: "mesaRegalos", tipo: "boolean", label: "¿Tienen mesa de regalos en tienda?", required: false, default: false },
        { id: "mesaRegalosDatos", tipo: "text", label: "Nombre de tienda y número de evento", required: false, condicion: "mesaRegalos" },
      ],
    },
    premium: {
      precio: 850,
      secciones: ["portada", "ubicacion", "rsvp", "musica", "galeria", "dresscode", "mensajePadres", "itinerario", "regalos", "historia", "hospedaje", "buzon", "albumQR", "pases", "video", "segundoIdioma"],
      campos: [
        // Hereda todos los de completa + adicionales
        { id: "nombres", tipo: "text", label: "Nombre de los novios", required: true },
        { id: "fecha", tipo: "date", label: "Fecha de la boda", required: true },
        { id: "horaCeremonia", tipo: "time", label: "Hora de la ceremonia", required: true },
        { id: "horaRecepcion", tipo: "time", label: "Hora de la recepción", required: true },
        { id: "templo", tipo: "text", label: "Nombre del templo", required: true },
        { id: "direccionTemplo", tipo: "textarea", label: "Dirección ceremonia", required: true },
        { id: "salon", tipo: "text", label: "Nombre del salón", required: true },
        { id: "direccionSalon", tipo: "textarea", label: "Dirección recepción", required: true },
        { id: "mapsLink", tipo: "url", label: "Link Google Maps", required: false },
        { id: "fotoPortada", tipo: "upload", label: "Foto de la pareja", required: true, max: 1 },
        { id: "mensaje", tipo: "textarea", label: "Frase o mensaje", required: false },
        { id: "musica", tipo: "select", label: "Música de fondo", required: true, options: ["Romántica", "Instrumental", "Pop acústico"] },
        { id: "whatsapp", tipo: "tel", label: "WhatsApp", required: true },
        { id: "colorPrimario", tipo: "color", label: "Color primario", required: false, default: "#d4af37" },
        { id: "colorSecundario", tipo: "color", label: "Color secundario", required: false, default: "#ffffff" },
        { id: "fotosGaleria", tipo: "upload", label: "Fotos para galería", required: false, max: 6 },
        { id: "dressCode", tipo: "select", label: "Código de vestimenta", required: true, options: ["Formal", "Semi-formal", "Cocktail", "Playa"] },
        { id: "dressCodeDesc", tipo: "textarea", label: "Descripción del dress code", required: false },
        { id: "mensajePadres", tipo: "textarea", label: "Mensaje de los papás", required: false },
        { id: "itinerario", tipo: "textarea", label: "Itinerario", required: false },
        { id: "datosRegalo", tipo: "textarea", label: "Datos para regalos", required: false },
        { id: "mesaRegalos", tipo: "boolean", label: "¿Mesa de regalos?", required: false, default: false },
        { id: "mesaRegalosDatos", tipo: "text", label: "Datos de mesa de regalos", required: false, condicion: "mesaRegalos" },
        // ADICIONALES PREMIUM
        { id: "historiaConocieron", tipo: "textarea", label: "¿Cómo se conocieron?", required: true, placeholder: "Nos conocimos en la universidad en 2018..." },
        { id: "historiaPropuesta", tipo: "textarea", label: "¿Cómo fue la propuesta?", required: true, placeholder: "Carlos me sorprendió en nuestra playa favorita..." },
        { id: "historiaSignificado", tipo: "textarea", label: "¿Qué significa este día para ustedes?", required: true, placeholder: "Es el inicio de nuestra familia..." },
        { id: "fotosExtra", tipo: "upload", label: "Fotos adicionales (galería extendida)", required: false, max: 6 },
        { id: "hospedaje", tipo: "textarea", label: "Sugerencia de hospedaje", required: false, placeholder: "Hotel Quinta Real, código BODAANA10 para 15% descuento" },
        { id: "buzonDeseos", tipo: "boolean", label: "¿Activar buzón de deseos?", required: false, default: true },
        { id: "pases", tipo: "boolean", label: "¿Número de pases personalizado?", required: false, default: true },
        { id: "numPases", tipo: "number", label: "Pases por invitado", required: false, default: 2, condicion: "pases" },
        { id: "videoURL", tipo: "url", label: "Link de video Save the Date", required: false },
        { id: "segundoIdioma", tipo: "boolean", label: "¿Segundo idioma inglés?", required: false, default: false },
      ],
    },
  },

  xv: {
    esencial: {
      precio: 350,
      secciones: ["portada", "ubicacion", "rsvp", "musica"],
      campos: [
        { id: "nombre", tipo: "text", label: "Nombre completo de la quinceañera", required: true, placeholder: "María Fernanda Sánchez García" },
        { id: "fecha", tipo: "date", label: "Fecha del evento", required: true },
        { id: "horaMisa", tipo: "time", label: "Hora de la misa", required: true },
        { id: "horaRecepcion", tipo: "time", label: "Hora de la recepción", required: true },
        { id: "templo", tipo: "text", label: "Nombre del templo", required: true, placeholder: "Iglesia de San Francisco" },
        { id: "direccionTemplo", tipo: "textarea", label: "Dirección del templo", required: true, placeholder: "Calle 5 de Mayo 45, Centro, Puebla" },
        { id: "salon", tipo: "text", label: "Nombre del salón", required: true, placeholder: "Salón Jardines del Rey" },
        { id: "direccionSalon", tipo: "textarea", label: "Dirección del salón", required: true, placeholder: "Blvd. Atlixcáyotl 123, Angelópolis" },
        { id: "fotoPortada", tipo: "upload", label: "Foto principal (portada)", required: true, max: 1 },
        { id: "mensaje", tipo: "textarea", label: "Frase o mensaje", required: false, placeholder: "Un sueño que se hace realidad" },
        { id: "musica", tipo: "select", label: "Música de fondo", required: true, options: ["Pop", "Instrumental", "Regional mexicano"] },
        { id: "whatsapp", tipo: "tel", label: "WhatsApp", required: true, placeholder: "2221234567" },
        { id: "colorPrimario", tipo: "color", label: "Color primario", required: false, default: "#ec4899" },
        { id: "colorSecundario", tipo: "color", label: "Color secundario", required: false, default: "#ffffff" },
      ],
    },
    completa: {
      precio: 550,
      secciones: ["portada", "ubicacion", "rsvp", "musica", "galeria", "dresscode", "mensajePadres", "itinerario", "padrinos", "chambelanes", "regalos"],
      campos: [
        { id: "nombre", tipo: "text", label: "Nombre completo", required: true },
        { id: "fecha", tipo: "date", label: "Fecha", required: true },
        { id: "horaMisa", tipo: "time", label: "Hora misa", required: true },
        { id: "horaRecepcion", tipo: "time", label: "Hora recepción", required: true },
        { id: "templo", tipo: "text", label: "Templo", required: true },
        { id: "direccionTemplo", tipo: "textarea", label: "Dirección templo", required: true },
        { id: "salon", tipo: "text", label: "Salón", required: true },
        { id: "direccionSalon", tipo: "textarea", label: "Dirección salón", required: true },
        { id: "fotoPortada", tipo: "upload", label: "Foto portada", required: true, max: 1 },
        { id: "mensaje", tipo: "textarea", label: "Mensaje", required: false },
        { id: "musica", tipo: "select", label: "Música", required: true, options: ["Pop", "Instrumental", "Regional mexicano"] },
        { id: "whatsapp", tipo: "tel", label: "WhatsApp", required: true },
        { id: "colorPrimario", tipo: "color", label: "Color primario", required: false, default: "#ec4899" },
        { id: "colorSecundario", tipo: "color", label: "Color secundario", required: false, default: "#ffffff" },
        { id: "fotosGaleria", tipo: "upload", label: "Fotos galería", required: false, max: 6 },
        { id: "dressCode", tipo: "select", label: "Dress code", required: true, options: ["Formal", "Elegante", "Cocktail"] },
        { id: "dressCodeDesc", tipo: "textarea", label: "Descripción dress code", required: false, placeholder: "Mujeres: vestido largo. Hombres: traje. No tennis." },
        { id: "mensajePadres", tipo: "textarea", label: "Mensaje de los papás", required: false, placeholder: "Hoy nuestra hija cumple 15 años..." },
        { id: "itinerario", tipo: "textarea", label: "Itinerario", required: false, placeholder: "16:00 Misa — 18:30 Recepción — 20:00 Vals — 21:00 Sorpresa — 22:00 Pastel" },
        { id: "padrinos", tipo: "textarea", label: "Padrinos de velación", required: false, placeholder: "Juan Pérez y María López" },
        { id: "chambelanes", tipo: "textarea", label: "Chambelanes", required: false, placeholder: "Luis, Pedro, Diego, Andrés, Mateo" },
        { id: "datosRegalo", tipo: "textarea", label: "Datos regalos", required: false, placeholder: "BBVA 123456789 a nombre de Patricia García" },
      ],
    },
    premium: {
      precio: 850,
      secciones: ["portada", "ubicacion", "rsvp", "musica", "galeria", "dresscode", "mensajePadres", "itinerario", "padrinos", "chambelanes", "regalos", "historia", "buzon", "albumQR", "pases", "hospedaje", "video", "colorAcento"],
      campos: [
        { id: "nombre", tipo: "text", label: "Nombre", required: true },
        { id: "fecha", tipo: "date", label: "Fecha", required: true },
        { id: "horaMisa", tipo: "time", label: "Hora misa", required: true },
        { id: "horaRecepcion", tipo: "time", label: "Hora recepción", required: true },
        { id: "templo", tipo: "text", label: "Templo", required: true },
        { id: "direccionTemplo", tipo: "textarea", label: "Dirección templo", required: true },
        { id: "salon", tipo: "text", label: "Salón", required: true },
        { id: "direccionSalon", tipo: "textarea", label: "Dirección salón", required: true },
        { id: "fotoPortada", tipo: "upload", label: "Foto portada", required: true, max: 1 },
        { id: "mensaje", tipo: "textarea", label: "Mensaje", required: false },
        { id: "musica", tipo: "select", label: "Música", required: true, options: ["Pop", "Instrumental", "Regional mexicano"] },
        { id: "whatsapp", tipo: "tel", label: "WhatsApp", required: true },
        { id: "colorPrimario", tipo: "color", label: "Color primario", required: false, default: "#ec4899" },
        { id: "colorSecundario", tipo: "color", label: "Color secundario", required: false, default: "#ffffff" },
        { id: "fotosGaleria", tipo: "upload", label: "Fotos galería", required: false, max: 6 },
        { id: "dressCode", tipo: "select", label: "Dress code", required: true, options: ["Formal", "Elegante", "Cocktail"] },
        { id: "dressCodeDesc", tipo: "textarea", label: "Descripción", required: false },
        { id: "mensajePadres", tipo: "textarea", label: "Mensaje papás", required: false },
        { id: "itinerario", tipo: "textarea", label: "Itinerario", required: false },
        { id: "padrinos", tipo: "textarea", label: "Padrinos", required: false },
        { id: "chambelanes", tipo: "textarea", label: "Chambelanes", required: false },
        { id: "datosRegalo", tipo: "textarea", label: "Datos regalos", required: false },
        { id: "historiaSignificado", tipo: "textarea", label: "Significado de los XV", required: true, placeholder: "Es el momento de cerrar una etapa..." },
        { id: "historiaPadres", tipo: "textarea", label: "Mensaje a sus papás", required: true, placeholder: "Gracias por siempre apoyarme..." },
        { id: "historiaAmigos", tipo: "textarea", label: "Mensaje a sus amigos", required: true, placeholder: "Ustedes han sido parte de mi historia..." },
        { id: "fotosExtra", tipo: "upload", label: "Fotos adicionales", required: false, max: 6 },
        { id: "buzonDeseos", tipo: "boolean", label: "¿Buzón de deseos?", required: false, default: true },
        { id: "pases", tipo: "boolean", label: "¿Pases personalizados?", required: false, default: true },
        { id: "numPases", tipo: "number", label: "Pases por invitado", required: false, default: 2, condicion: "pases" },
        { id: "hospedaje", tipo: "textarea", label: "Sugerencia hospedaje", required: false, placeholder: "Hotel NH Puebla, código XVFER15" },
        { id: "videoURL", tipo: "url", label: "Link video", required: false },
        { id: "colorAcento", tipo: "select", label: "Color de acento", required: true, options: ["Rosa", "Dorado", "Plateado", "Morado", "Azul"] },
      ],
    },
  },

  babyshower: {
    esencial: {
      precio: 350,
      secciones: ["portada", "ubicacion", "rsvp", "musica"],
      campos: [
        { id: "nombreMama", tipo: "text", label: "Nombre de la mamá", required: true, placeholder: "Laura Martínez" },
        { id: "nombrePapa", tipo: "text", label: "Nombre del papá", required: false, placeholder: "Roberto Díaz" },
        { id: "fecha", tipo: "date", label: "Fecha del baby shower", required: true },
        { id: "hora", tipo: "time", label: "Hora", required: true },
        { id: "lugar", tipo: "text", label: "Nombre del lugar", required: true, placeholder: "Casa de los abuelos" },
        { id: "direccion", tipo: "textarea", label: "Dirección", required: true, placeholder: "Calle Roble 45, Col. Del Valle, CDMX" },
        { id: "tipoBebe", tipo: "select", label: "¿Es niño o niña?", required: true, options: ["Niño", "Niña", "Sorpresa"] },
        { id: "fotoPortada", tipo: "upload", label: "Foto principal", required: true, max: 1 },
        { id: "mensaje", tipo: "textarea", label: "Frase o mensaje", required: false, placeholder: "Un pequeño gran amor está en camino" },
        { id: "musica", tipo: "select", label: "Música", required: true, options: ["Dulce", "Instrumental", "Infantil"] },
        { id: "whatsapp", tipo: "tel", label: "WhatsApp", required: true, placeholder: "5512345678" },
        { id: "colorPrimario", tipo: "color", label: "Color primario", required: false, default: "#a8d8ea" },
        { id: "colorSecundario", tipo: "color", label: "Color secundario", required: false, default: "#f7f4eb" },
      ],
    },
    completa: {
      precio: 550,
      secciones: ["portada", "ubicacion", "rsvp", "musica", "galeria", "dresscode", "mensajePadres", "itinerario", "listaRegalos", "juegos"],
      campos: [
        { id: "nombreMama", tipo: "text", label: "Nombre de la mamá", required: true },
        { id: "nombrePapa", tipo: "text", label: "Nombre del papá", required: false },
        { id: "fecha", tipo: "date", label: "Fecha", required: true },
        { id: "hora", tipo: "time", label: "Hora", required: true },
        { id: "lugar", tipo: "text", label: "Lugar", required: true },
        { id: "direccion", tipo: "textarea", label: "Dirección", required: true },
        { id: "tipoBebe", tipo: "select", label: "¿Niño o niña?", required: true, options: ["Niño", "Niña", "Sorpresa"] },
        { id: "fotoPortada", tipo: "upload", label: "Foto portada", required: true, max: 1 },
        { id: "mensaje", tipo: "textarea", label: "Mensaje", required: false },
        { id: "musica", tipo: "select", label: "Música", required: true, options: ["Dulce", "Instrumental", "Infantil"] },
        { id: "whatsapp", tipo: "tel", label: "WhatsApp", required: true },
        { id: "colorPrimario", tipo: "color", label: "Color primario", required: false, default: "#a8d8ea" },
        { id: "colorSecundario", tipo: "color", label: "Color secundario", required: false, default: "#f7f4eb" },
        { id: "fotosGaleria", tipo: "upload", label: "Fotos galería", required: false, max: 6 },
        { id: "dressCode", tipo: "select", label: "Dress code", required: true, options: ["Casual", "Color asignado", "Cómodo"] },
        { id: "dressCodeDesc", tipo: "textarea", label: "Descripción", required: false, placeholder: "Vístete de azul si crees que es niño, de rosa si crees que es niña" },
        { id: "mensajePadres", tipo: "textarea", label: "Mensaje de los papás", required: false, placeholder: "Estamos muy emocionados..." },
        { id: "itinerario", tipo: "textarea", label: "Itinerario", required: false, placeholder: "15:00 Bienvenida — 15:30 Juegos — 16:30 Comida — 17:30 Regalos — 18:00 Pastel" },
        { id: "listaRegalos", tipo: "textarea", label: "Lista de regalos sugeridos", required: false, placeholder: "Pañales talla 2, ropa 0-3 meses, artículos de baño" },
        { id: "mesaRegalos", tipo: "boolean", label: "¿Mesa de regalos en tienda?", required: false, default: false },
        { id: "mesaRegalosDatos", tipo: "text", label: "Datos de mesa de regalos", required: false, condicion: "mesaRegalos" },
        { id: "juegos", tipo: "textarea", label: "Juegos del baby shower", required: false, placeholder: "Adivina el peso, Cambia el pañal, Bingo" },
      ],
    },
    premium: {
      precio: 850,
      secciones: ["portada", "ubicacion", "rsvp", "musica", "galeria", "dresscode", "mensajePadres", "itinerario", "listaRegalos", "juegos", "historia", "buzon", "albumQR", "pases", "hospedaje", "video", "nombreBebe"],
      campos: [
        { id: "nombreMama", tipo: "text", label: "Nombre mamá", required: true },
        { id: "nombrePapa", tipo: "text", label: "Nombre papá", required: false },
        { id: "fecha", tipo: "date", label: "Fecha", required: true },
        { id: "hora", tipo: "time", label: "Hora", required: true },
        { id: "lugar", tipo: "text", label: "Lugar", required: true },
        { id: "direccion", tipo: "textarea", label: "Dirección", required: true },
        { id: "tipoBebe", tipo: "select", label: "¿Niño o niña?", required: true, options: ["Niño", "Niña", "Sorpresa"] },
        { id: "fotoPortada", tipo: "upload", label: "Foto portada", required: true, max: 1 },
        { id: "mensaje", tipo: "textarea", label: "Mensaje", required: false },
        { id: "musica", tipo: "select", label: "Música", required: true, options: ["Dulce", "Instrumental", "Infantil"] },
        { id: "whatsapp", tipo: "tel", label: "WhatsApp", required: true },
        { id: "colorPrimario", tipo: "color", label: "Color primario", required: false, default: "#a8d8ea" },
        { id: "colorSecundario", tipo: "color", label: "Color secundario", required: false, default: "#f7f4eb" },
        { id: "fotosGaleria", tipo: "upload", label: "Fotos galería", required: false, max: 6 },
        { id: "dressCode", tipo: "select", label: "Dress code", required: true, options: ["Casual", "Color asignado", "Cómodo"] },
        { id: "dressCodeDesc", tipo: "textarea", label: "Descripción", required: false },
        { id: "mensajePadres", tipo: "textarea", label: "Mensaje papás", required: false },
        { id: "itinerario", tipo: "textarea", label: "Itinerario", required: false },
        { id: "listaRegalos", tipo: "textarea", label: "Lista regalos", required: false },
        { id: "mesaRegalos", tipo: "boolean", label: "¿Mesa de regalos?", required: false, default: false },
        { id: "mesaRegalosDatos", tipo: "text", label: "Datos mesa regalos", required: false, condicion: "mesaRegalos" },
        { id: "juegos", tipo: "textarea", label: "Juegos", required: false },
        { id: "historiaEmbarazo", tipo: "textarea", label: "¿Cómo se enteraron?", required: true, placeholder: "Fue una sorpresa inesperada..." },
        { id: "historiaVivencia", tipo: "textarea", label: "¿Cómo han vivido el embarazo?", required: true, placeholder: "Ha sido una montaña rusa de emociones..." },
        { id: "historiaSignificado", tipo: "textarea", label: "¿Qué significa este bebé?", required: true, placeholder: "Es el inicio de nuestra familia..." },
        { id: "nombreBebe", tipo: "text", label: "Nombre provisional del bebé", required: false, placeholder: "Le decimos 'pequeño' de cariño" },
        { id: "fotosExtra", tipo: "upload", label: "Fotos adicionales", required: false, max: 6 },
        { id: "buzonDeseos", tipo: "boolean", label: "¿Buzón de deseos?", required: false, default: true },
        { id: "pases", tipo: "boolean", label: "¿Pases?", required: false, default: true },
        { id: "numPases", tipo: "number", label: "Pases por invitado", required: false, default: 2, condicion: "pases" },
        { id: "hospedaje", tipo: "textarea", label: "Sugerencia hospedaje", required: false },
        { id: "videoURL", tipo: "url", label: "Link video", required: false },
      ],
    },
  },

  cumpleanos: {
    esencial: {
      precio: 350,
      secciones: ["portada", "ubicacion", "rsvp", "musica"],
      campos: [
        { id: "nombre", tipo: "text", label: "Nombre del festejado", required: true, placeholder: "Sofía Hernández" },
        { id: "edad", tipo: "number", label: "Edad que cumple", required: true, placeholder: "30" },
        { id: "fecha", tipo: "date", label: "Fecha del cumpleaños", required: true },
        { id: "hora", tipo: "time", label: "Hora", required: true },
        { id: "lugar", tipo: "text", label: "Nombre del lugar", required: true, placeholder: "Terraza La Vista" },
        { id: "direccion", tipo: "textarea", label: "Dirección", required: true, placeholder: "Av. Insurgentes 123, Condesa, CDMX" },
        { id: "tipoCelebracion", tipo: "select", label: "Tipo de celebración", required: true, options: ["Adultos", "Infantil", "Sorpresa"] },
        { id: "fotoPortada", tipo: "upload", label: "Foto del festejado", required: true, max: 1 },
        { id: "mensaje", tipo: "textarea", label: "Frase o mensaje", required: false, placeholder: "¡Vamos a celebrar 30 años de risas!" },
        { id: "musica", tipo: "select", label: "Música", required: true, options: ["Fiesta", "Pop", "Regional", "Infantil"] },
        { id: "whatsapp", tipo: "tel", label: "WhatsApp", required: true, placeholder: "5512345678" },
        { id: "colorPrimario", tipo: "color", label: "Color primario", required: false, default: "#f59e0b" },
        { id: "colorSecundario", tipo: "color", label: "Color secundario", required: false, default: "#1f2937" },
      ],
    },
    completa: {
      precio: 550,
      secciones: ["portada", "ubicacion", "rsvp", "musica", "galeria", "dresscode", "mensajeFestejo", "itinerario", "regalos"],
      campos: [
        { id: "nombre", tipo: "text", label: "Nombre", required: true },
        { id: "edad", tipo: "number", label: "Edad", required: true },
        { id: "fecha", tipo: "date", label: "Fecha", required: true },
        { id: "hora", tipo: "time", label: "Hora", required: true },
        { id: "lugar", tipo: "text", label: "Lugar", required: true },
        { id: "direccion", tipo: "textarea", label: "Dirección", required: true },
        { id: "tipoCelebracion", tipo: "select", label: "Tipo", required: true, options: ["Adultos", "Infantil", "Sorpresa"] },
        { id: "fotoPortada", tipo: "upload", label: "Foto portada", required: true, max: 1 },
        { id: "mensaje", tipo: "textarea", label: "Mensaje", required: false },
        { id: "musica", tipo: "select", label: "Música", required: true, options: ["Fiesta", "Pop", "Regional", "Infantil"] },
        { id: "whatsapp", tipo: "tel", label: "WhatsApp", required: true },
        { id: "colorPrimario", tipo: "color", label: "Color primario", required: false, default: "#f59e0b" },
        { id: "colorSecundario", tipo: "color", label: "Color secundario", required: false, default: "#1f2937" },
        { id: "fotosGaleria", tipo: "upload", label: "Fotos galería", required: false, max: 6 },
        { id: "dressCode", tipo: "select", label: "Dress code", required: true, options: ["Casual", "Fiesta", "Temático", "Elegante"] },
        { id: "dressCodeDesc", tipo: "textarea", label: "Descripción", required: false, placeholder: "Vengan cómodos, habrá baile" },
        { id: "mensajeFestejo", tipo: "textarea", label: "Mensaje del festejado", required: false, placeholder: "¡Gracias por ser parte de mi vida!" },
        { id: "itinerario", tipo: "textarea", label: "Itinerario", required: false, placeholder: "19:00 Bienvenida — 20:00 Cena — 21:00 Pastel — 22:00 Baile" },
        { id: "datosRegalo", tipo: "textarea", label: "Datos regalos", required: false, placeholder: "Si quieres hacerme un regalo..." },
        { id: "mesaRegalos", tipo: "boolean", label: "¿Mesa de regalos?", required: false, default: false },
        { id: "mesaRegalosDatos", tipo: "text", label: "Datos mesa regalos", required: false, condicion: "mesaRegalos" },
      ],
    },
    premium: {
      precio: 850,
      secciones: ["portada", "ubicacion", "rsvp", "musica", "galeria", "dresscode", "mensajeFestejo", "itinerario", "regalos", "historia", "buzon", "albumQR", "pases", "video", "tematica", "colorAcento"],
      campos: [
        { id: "nombre", tipo: "text", label: "Nombre", required: true },
        { id: "edad", tipo: "number", label: "Edad", required: true },
        { id: "fecha", tipo: "date", label: "Fecha", required: true },
        { id: "hora", tipo: "time", label: "Hora", required: true },
        { id: "lugar", tipo: "text", label: "Lugar", required: true },
        { id: "direccion", tipo: "textarea", label: "Dirección", required: true },
        { id: "tipoCelebracion", tipo: "select", label: "Tipo", required: true, options: ["Adultos", "Infantil", "Sorpresa"] },
        { id: "fotoPortada", tipo: "upload", label: "Foto portada", required: true, max: 1 },
        { id: "mensaje", tipo: "textarea", label: "Mensaje", required: false },
        { id: "musica", tipo: "select", label: "Música", required: true, options: ["Fiesta", "Pop", "Regional", "Infantil"] },
        { id: "whatsapp", tipo: "tel", label: "WhatsApp", required: true },
        { id: "colorPrimario", tipo: "color", label: "Color primario", required: false, default: "#f59e0b" },
        { id: "colorSecundario", tipo: "color", label: "Color secundario", required: false, default: "#1f2937" },
        { id: "fotosGaleria", tipo: "upload", label: "Fotos galería", required: false, max: 6 },
        { id: "dressCode", tipo: "select", label: "Dress code", required: true, options: ["Casual", "Fiesta", "Temático", "Elegante"] },
        { id: "dressCodeDesc", tipo: "textarea", label: "Descripción", required: false },
        { id: "mensajeFestejo", tipo: "textarea", label: "Mensaje festejado", required: false },
        { id: "itinerario", tipo: "textarea", label: "Itinerario", required: false },
        { id: "datosRegalo", tipo: "textarea", label: "Datos regalos", required: false },
        { id: "mesaRegalos", tipo: "boolean", label: "¿Mesa regalos?", required: false, default: false },
        { id: "mesaRegalosDatos", tipo: "text", label: "Datos", required: false, condicion: "mesaRegalos" },
        { id: "historiaEdad", tipo: "textarea", label: "¿Qué significa esta edad?", required: true, placeholder: "Los 30 son el inicio..." },
        { id: "historiaSeresQueridos", tipo: "textarea", label: "Mensaje a seres queridos", required: true, placeholder: "Gracias por siempre estar ahí..." },
        { id: "historiaRecuerdo", tipo: "textarea", label: "Un recuerdo favorito", required: true, placeholder: "Mi viaje a Europa..." },
        { id: "fotosExtra", tipo: "upload", label: "Fotos adicionales", required: false, max: 6 },
        { id: "buzonDeseos", tipo: "boolean", label: "¿Buzón deseos?", required: false, default: true },
        { id: "pases", tipo: "boolean", label: "¿Pases?", required: false, default: true },
        { id: "numPases", tipo: "number", label: "Pases por invitado", required: false, default: 2, condicion: "pases" },
        { id: "tematica", tipo: "select", label: "Temática", required: true, options: ["Tropical", "Vintage", "Neon", "Elegante", "Infantil"] },
        { id: "videoURL", tipo: "url", label: "Link video", required: false },
        { id: "colorAcento", tipo: "select", label: "Color de acento", required: true, options: ["Dorado", "Plateado", "Rosa", "Azul", "Verde"] },
      ],
    },
  },
};

// Helper para obtener config
export function getPaqueteConfig(tipoEvento: TipoEvento, paquete: Paquete): PaqueteConfig {
  return CONFIGURACION_EVENTOS[tipoEvento][paquete];
}

export function getTemplateName(tipoEvento: TipoEvento, paquete: Paquete): string {
  return `${tipoEvento}-${paquete}`;
}

export function getPrecio(tipoEvento: TipoEvento, paquete: Paquete): number {
  return CONFIGURACION_EVENTOS[tipoEvento][paquete].precio;
}
```

---

## 🎨 SECCIONES VISUALES POR PAQUETE

Cada template renderiza secciones condicionales según el paquete:

| Sección | Esencial | Completa | Premium |
|---------|:--------:|:--------:|:-------:|
| **Portada** | ✅ | ✅ | ✅ |
| **Ubicación/GPS** | ✅ | ✅ | ✅ |
| **RSVP** | ✅ | ✅ | ✅ |
| **Música** | ✅ | ✅ | ✅ |
| **Galería fotos** | ❌ | 6 fotos | 12 fotos |
| **Dress code** | ❌ | ✅ | ✅ |
| **Mensaje papás/pareja** | ❌ | ✅ | ✅ |
| **Itinerario** | ❌ | ✅ | ✅ |
| **Mesa de regalos** | ❌ | ✅ | ✅ |
| **Historia** | ❌ | ❌ | ✅ (3 momentos) |
| **Buzón de deseos** | ❌ | ❌ | ✅ |
| **Álbum QR** | ❌ | ❌ | ✅ |
| **Pases personalizados** | ❌ | ❌ | ✅ |
| **Hospedaje** | ❌ | ❌ | ✅ (solo boda/baby) |
| **Video** | ❌ | ❌ | ✅ |
| **Segundo idioma** | ❌ | ❌ | ✅ (solo boda) |
| **Padrinos/Chambelanes** | ❌ | ❌ | ✅ (solo XV) |
| **Tipo bebé** | ❌ | ❌ | ✅ (solo baby) |
| **Temática** | ❌ | ❌ | ✅ (solo cumple) |
| **Color acento** | ❌ | ❌ | ✅ (solo XV/cumple) |

---

## 📁 MAPEO DE TEMPLATES A COMPONENTES

| Template (DB) | Componente React | Tipo | Paquete |
|---------------|-----------------|------|---------|
| `boda-esencial` | `BodaEsencial` | boda | esencial |
| `boda-completa` | `BodaCompleta` | boda | completa |
| `boda-premium` | `BodaPremium` | boda | premium |
| `xv-esencial` | `XVEsencial` | xv | esencial |
| `xv-completa` | `XVCompleta` | xv | completa |
| `xv-premium` | `XVPremium` | xv | premium |
| `babyshower-esencial` | `BabyEsencial` | babyshower | esencial |
| `babyshower-completa` | `BabyCompleta` | babyshower | completa |
| `babyshower-premium` | `BabyPremium` | babyshower | premium |
| `cumpleanos-esencial` | `CumpleEsencial` | cumpleanos | esencial |
| `cumpleanos-completa` | `CumpleCompleta` | cumpleanos | completa |
| `cumpleanos-premium` | `CumplePremium` | cumpleanos | premium |

---

> **Última modificación:** 2026-06-08  
> **Próxima revisión:** Al finalizar Fase 5
