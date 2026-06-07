import { describe, it, expect } from "vitest";
import { getTemplateConfig, validateTemplateData } from "@/lib/templates";
import { InvitacionData } from "@/types";

describe("validateTemplateData", () => {
  it("pasa la validación si se envían todos los campos obligatorios para boda-elegante", () => {
    const config = getTemplateConfig("boda-elegante");
    const data: Partial<InvitacionData> = {
      nombres: "María & Juan",
      fecha: "2026-10-24T18:00:00Z",
      ubicacion: "Hacienda del Refugio",
    };
    const result = validateTemplateData(config, data);
    expect(result.success).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("falla la validación si faltan campos requeridos en boda-elegante", () => {
    const config = getTemplateConfig("boda-elegante");
    const data: Partial<InvitacionData> = {
      nombres: "María & Juan",
      // fecha y ubicacion faltantes
    };
    const result = validateTemplateData(config, data);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBe(2);
    expect(result.errors[0]).toContain("Fecha");
    expect(result.errors[1]).toContain("Lugar");
  });

  it("falla la validación si falta el nombre del bebé en baby-shower", () => {
    const config = getTemplateConfig("baby-shower");
    const data: Partial<InvitacionData> = {
      nombres: "Laura & Carlos",
      fecha: "2026-08-08T16:00:00Z",
      ubicacion: "Jardín Los Tulipanes",
      // nombreBebe faltante
    };
    const result = validateTemplateData(config, data);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toContain("Bebé");
  });
});
