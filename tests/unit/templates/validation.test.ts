import { describe, it, expect } from "vitest";
import { getTemplateConfig, validateTemplateData } from "@/lib/templates";
import { InvitacionData } from "@/types";

describe("validateTemplateData", () => {
  it("pasa la validación si se envían todos los campos obligatorios para cumpleanos-esencial", () => {
    const config = getTemplateConfig("cumpleanos-esencial");
    const data: Partial<InvitacionData> = {
      nombre: "Santiago",
      edad: 30,
      fecha: "2026-10-24T18:00:00Z",
      hora: "18:00",
      lugar: "Terraza La Vista",
      direccion: "Av. Insurgentes 123",
      tipoCelebracion: "Adultos",
      fotoPortada: "https://example.com/foto.jpg",
      musica: "Fiesta",
      whatsapp: "5512345678",
    };
    const result = validateTemplateData(config, data);
    expect(result.success).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("falla la validación si faltan campos requeridos en cumpleanos-esencial", () => {
    const config = getTemplateConfig("cumpleanos-esencial");
    const data: Partial<InvitacionData> = {
      nombre: "Santiago",
      edad: 30,
      // fecha, hora, lugar, direccion, tipoCelebracion, fotoPortada, musica, whatsapp faltantes
    };
    const result = validateTemplateData(config, data);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBe(8);
  });

  it("falla la validación si falta el nombre de la mamá en babyshower-esencial", () => {
    const config = getTemplateConfig("babyshower-esencial");
    const data: Partial<InvitacionData> = {
      fecha: "2026-08-08T16:00:00Z",
      hora: "16:00",
      lugar: "Jardín Los Tulipanes",
      direccion: "Calle Roble 45",
      tipoBebe: "Niño",
      fotoPortada: "https://example.com/foto.jpg",
      musica: "Dulce",
      whatsapp: "5512345678",
      // nombreMama faltante
    };
    const result = validateTemplateData(config, data);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toContain("mamá");
  });
});

