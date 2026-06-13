import { describe, it, expect } from "vitest";
import { getTemplateConfig } from "@/lib/templates";

describe("getTemplateConfig", () => {


  it("retorna la configuración correcta para cumpleanos-esencial", () => {
    const config = getTemplateConfig("cumpleanos-esencial");
    expect(config).toBeDefined();
    expect(config.id).toBe("cumpleanos-esencial");
    expect(config.fields.some(f => f.key === "nombre" && f.required)).toBe(true);
  });

  it("retorna la configuración correcta para cumpleanos-completa", () => {
    const config = getTemplateConfig("cumpleanos-completa");
    expect(config).toBeDefined();
    expect(config.id).toBe("cumpleanos-completa");
    
    // Validar campos heredados de esencial
    expect(config.fields.some(f => f.key === "nombre" && f.required)).toBe(true);
    expect(config.fields.some(f => f.key === "whatsapp" && f.required)).toBe(true);
    
    // Validar campos nuevos de completa
    expect(config.fields.some(f => f.key === "dressCode" && f.required)).toBe(true);
    expect(config.fields.some(f => f.key === "fotosGaleria" && !f.required)).toBe(true);
    
    // Validar maxItems de galería es 6
    const galeriaField = config.fields.find(f => f.key === "fotosGaleria");
    expect(galeriaField).toBeDefined();
    expect(galeriaField?.maxItems).toBe(6);
  });
});

