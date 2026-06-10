export const PRECIOS_PAQUETE = {
  esencial: 350,
  completa: 550,
  premium: 850,
} as const;

export const TIPOS_EVENTO = ["cumpleanos"] as const;
export const PAQUETES = ["esencial", "completa", "premium"] as const;

export type TipoEvento = typeof TIPOS_EVENTO[number];
export type Paquete = typeof PAQUETES[number];

export interface CampoConfig {
  id: string;
  tipo: "text" | "textarea" | "date" | "time" | "number" | "tel" | "url" | "upload" | "select" | "boolean" | "color" | "gallery";
  label: string;
  required: boolean;
  placeholder?: string;
  max?: number;           // Para upload (máx fotos)
  maxItems?: number;      // Para gallery (máx fotos en galería)
  options?: string[];     // Para select
  default?: string | number | boolean;
  condicion?: string;     // ID del campo boolean que debe ser true para mostrar este
}

export interface PaqueteConfig {
  precio: number;
  secciones: string[];
  campos: CampoConfig[];
  implementado: boolean;
  tipoEvento: TipoEvento;
}

export const CONFIGURACION_EVENTOS: Record<TipoEvento, Record<Paquete, PaqueteConfig>> = {
  cumpleanos: {
    esencial: {
      precio: 350,
      implementado: true,
      tipoEvento: "cumpleanos",
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
      implementado: true,
      tipoEvento: "cumpleanos",
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
        { id: "fotosGaleria", tipo: "gallery", label: "Galería de fotos", required: false, maxItems: 3 },
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
      implementado: true,
      tipoEvento: "cumpleanos",
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
        { id: "fotosGaleria", tipo: "gallery", label: "Galería de fotos", required: false, maxItems: 6 },
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
        { id: "fechaLimiteRSVP", tipo: "date", label: "Fecha límite de confirmación", required: false },
        { id: "mensajeAgradecimiento", tipo: "textarea", label: "Mensaje de agradecimiento", required: false },
        { id: "confettiAnimacion", tipo: "boolean", label: "Activar confetti", required: false, default: true },
        { id: "cuentaRegresiva", tipo: "boolean", label: "Mostrar cuenta regresiva", required: false, default: true },
      ],
    },
  },
};

// Helper para obtener config
export function getPaqueteConfig(tipoEvento: TipoEvento, paquete: Paquete): PaqueteConfig {
  return CONFIGURACION_EVENTOS[tipoEvento]?.[paquete];
}

export function getTemplateName(tipoEvento: TipoEvento, paquete: Paquete): string {
  return `${tipoEvento}-${paquete}`;
}

export function getPrecio(tipoEvento: TipoEvento, paquete: Paquete): number {
  return CONFIGURACION_EVENTOS[tipoEvento]?.[paquete]?.precio ?? 0;
}
