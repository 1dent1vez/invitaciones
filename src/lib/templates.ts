import React from "react";
import { BodaElegante } from "@/components/templates/BodaElegante";
import { XVModerno } from "@/components/templates/XVModerno";
import { BabyShower } from "@/components/templates/BabyShower";
import { CumpleanosFiesta } from "@/components/templates/CumpleanosFiesta";
import { TemplateType, TemplateConfig, InvitacionData } from "@/types";

export const TEMPLATE_COMPONENTS: Record<TemplateType, React.ComponentType<{ data: InvitacionData }>> = {
  "boda-elegante": BodaElegante,
  "xv-moderno": XVModerno,
  "baby-shower": BabyShower,
  "cumpleanos-fiesta": CumpleanosFiesta,
};

export const TEMPLATE_CONFIGS: Record<TemplateType, TemplateConfig> = {
  "boda-elegante": {
    id: "boda-elegante",
    name: "Boda Elegante",
    fields: [
      { key: "nombres", label: "Nombres de los Novios", type: "text", required: true, placeholder: "María & Juan" },
      { key: "fecha", label: "Fecha y Hora del Evento", type: "date", required: true },
      { key: "ubicacion", label: "Lugar del Evento", type: "text", required: true, placeholder: "Salón Real, Av. Principal #123" },
      { key: "mapaUrl", label: "Enlace a Google Maps", type: "text", required: false, placeholder: "https://goo.gl/maps/..." },
      { key: "mensaje", label: "Frase de Bienvenida / Verso", type: "textarea", required: false, placeholder: "Nuestra boda..." },
      { key: "dressCode", label: "Código de Vestimenta", type: "text", required: false, placeholder: "Formal / Rigurosa Etiqueta" },
      { key: "padres", label: "Nombres de los Padres (opcional)", type: "text", required: false, placeholder: "Padres de la novia y novio" },
      { key: "padrinos", label: "Nombres de los Padrinos (opcional)", type: "text", required: false, placeholder: "Padrinos de honor" },
      { key: "colorPrincipal", label: "Color Principal", type: "color", required: false },
      { key: "colorSecundario", label: "Color Secundario", type: "color", required: false },
    ],
  },
  "xv-moderno": {
    id: "xv-moderno",
    name: "XV Años Moderno",
    fields: [
      { key: "nombres", label: "Nombre de la Quinceañera", type: "text", required: true, placeholder: "Sofía Alejandra" },
      { key: "fecha", label: "Fecha y Hora del Evento", type: "date", required: true },
      { key: "ubicacion", label: "Lugar del Evento", type: "text", required: true, placeholder: "Jardín de los Ensuños" },
      { key: "mapaUrl", label: "Enlace a Google Maps", type: "text", required: false, placeholder: "https://goo.gl/maps/..." },
      { key: "mensaje", label: "Frase de Quince Años", type: "textarea", required: false, placeholder: "Hoy es un día especial..." },
      { key: "dressCode", label: "Código de Vestimenta", type: "text", required: false, placeholder: "Cóctel / Elegante" },
      { key: "musicaUrl", label: "URL de música de fondo (Audio)", type: "text", required: false, placeholder: "https://example.com/audio.mp3" },
      { key: "portadaUrl", label: "Foto de Portada Principal", type: "image", required: false },
    ],
  },
  "baby-shower": {
    id: "baby-shower",
    name: "Baby Shower",
    fields: [
      { key: "nombres", label: "Nombres de los Padres", type: "text", required: true, placeholder: "Laura & Carlos" },
      { key: "nombreBebe", label: "Nombre del Bebé", type: "text", required: true, placeholder: "Mateo / Sofía (o 'El Bebé')" },
      { key: "fecha", label: "Fecha y Hora", type: "date", required: true },
      { key: "ubicacion", label: "Lugar", type: "text", required: true, placeholder: "Casa de los abuelos / Terraza Central" },
      { key: "mapaUrl", label: "Enlace a Google Maps", type: "text", required: false, placeholder: "https://goo.gl/maps/..." },
      { key: "mensaje", label: "Mensaje / Frase de Espera", type: "textarea", required: false, placeholder: "¡Esperamos con amor la llegada de...!" },
      { key: "regalosDatos", label: "Mesa de Regalos / Sugerencias", type: "textarea", required: false, placeholder: "Liverpool: Evento 12345 / Pañales etapa 1 y 2" },
    ],
  },
  "cumpleanos-fiesta": {
    id: "cumpleanos-fiesta",
    name: "Cumpleaños Fiesta",
    fields: [
      { key: "nombres", label: "Nombre del Festejado", type: "text", required: true, placeholder: "Santiago" },
      { key: "fecha", label: "Fecha y Hora", type: "date", required: true },
      { key: "ubicacion", label: "Lugar", type: "text", required: true, placeholder: "Alberca Club Campestre / Salón de Fiestas" },
      { key: "mapaUrl", label: "Enlace a Google Maps", type: "text", required: false, placeholder: "https://goo.gl/maps/..." },
      { key: "mensaje", label: "Mensaje de Bienvenida", type: "textarea", required: false, placeholder: "¡Vamos a celebrar mis 30 años!" },
      { key: "regalosDatos", label: "Datos de Regalos / Lluvia de sobres", type: "textarea", required: false, placeholder: "Lluvia de sobres en efectivo / Cuenta bancaria..." },
    ],
  },
};

export function getTemplateConfig(type: TemplateType): TemplateConfig {
  return TEMPLATE_CONFIGS[type];
}

export function validateTemplateData(
  config: TemplateConfig,
  data: Partial<InvitacionData>
): { success: boolean; errors: string[] } {
  const errors: string[] = [];
  for (const field of config.fields) {
    if (field.required) {
      const val = data[field.key as keyof InvitacionData];
      if (val === undefined || val === null || val === "") {
        errors.push(`El campo "${field.label}" es requerido.`);
      }
    }
  }
  return {
    success: errors.length === 0,
    errors,
  };
}
