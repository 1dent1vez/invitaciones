import React from "react";
import { Proximamente } from "@/components/templates/Proximamente";
import { CumpleEsencial } from "@/components/templates/cumpleanos/CumpleEsencial";
import { CumpleCompleta } from "@/components/templates/cumpleanos/CumpleCompleta";
import { CumplePremium } from "@/components/templates/cumpleanos/CumplePremium";
import { TemplateType, TemplateConfig, InvitacionData, FieldType } from "@/types";
import { getPaqueteConfig, TipoEvento, Paquete, CONFIGURACION_EVENTOS } from "@/lib/paquetes";

export const TEMPLATE_COMPONENTS: Record<TemplateType, React.ComponentType<{ data: InvitacionData }>> = {
  "boda-esencial": Proximamente,
  "boda-completa": Proximamente,
  "boda-premium": Proximamente,
  "xv-esencial": Proximamente,
  "xv-completa": Proximamente,
  "xv-premium": Proximamente,
  "babyshower-esencial": Proximamente,
  "babyshower-completa": Proximamente,
  "babyshower-premium": Proximamente,
  "cumpleanos-esencial": CumpleEsencial,
  "cumpleanos-completa": CumpleCompleta,
  "cumpleanos-premium": CumplePremium,
};

export function getTemplateConfig(type: TemplateType): TemplateConfig {
  const parts = (type || "").split("-");
  const tipoEvento = (parts[0] || "cumpleanos") as TipoEvento;
  const paquete = (parts[1] || "esencial") as Paquete;
  const pkgConfig = getPaqueteConfig(tipoEvento, paquete);

  console.log({ tipoEvento, paquete, pkgConfig });

  const formatName = (text: string) => {
    if (!text) return "Cumpleaños";
    if (text === "cumpleanos") return "Cumpleaños";
    if (text === "babyshower") return "Baby Shower";
    if (text === "boda") return "Boda";
    if (text === "xv") return "XV Años";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const formatPaquete = (text: string) => {
    if (!text) return "Esencial";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  if (!pkgConfig) {
    console.error(`No se encontró config para ${tipoEvento} - ${paquete}`);
    const fallbackConfig = CONFIGURACION_EVENTOS["cumpleanos"]["esencial"];
    return {
      id: type,
      name: `${formatName(tipoEvento)} ${formatPaquete(paquete)}`,
      fields: fallbackConfig.campos.map((c) => ({
        key: c.id,
        label: c.label,
        type: c.tipo === "upload" ? "image" : (c.tipo as FieldType),
        required: c.required,
        placeholder: c.placeholder,
        options: c.options,
        condicion: c.condicion,
        maxItems: c.maxItems,
      })),
    };
  }

  return {
    id: type,
    name: `${formatName(tipoEvento)} ${formatPaquete(paquete)}`,
    fields: pkgConfig.campos.map((c) => ({
      key: c.id,
      label: c.label,
      type: c.tipo === "upload" ? "image" : (c.tipo as FieldType), // Map upload to image for compatibility with editor-client.tsx
      required: c.required,
      placeholder: c.placeholder,
      options: c.options,
      condicion: c.condicion,
      maxItems: c.maxItems,
    })),
  };
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
