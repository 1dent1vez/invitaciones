import { describe, it, expect } from "vitest";
import { getTemplateConfig } from "@/lib/templates";

describe("getTemplateConfig", () => {
  it("retorna la configuración correcta para boda-esencial", () => {
    const config = getTemplateConfig("boda-esencial");
    expect(config).toBeDefined();
    expect(config.id).toBe("boda-esencial");
    expect(config.name).toBe("Boda Esencial");
    expect(config.fields.some(f => f.key === "nombres" && f.required)).toBe(true);
  });

  it("retorna la configuración correcta para xv-esencial", () => {
    const config = getTemplateConfig("xv-esencial");
    expect(config).toBeDefined();
    expect(config.id).toBe("xv-esencial");
    expect(config.fields.some(f => f.key === "nombre" && f.required)).toBe(true);
  });

  it("retorna la configuración correcta para babyshower-esencial", () => {
    const config = getTemplateConfig("babyshower-esencial");
    expect(config).toBeDefined();
    expect(config.id).toBe("babyshower-esencial");
    expect(config.fields.some(f => f.key === "nombreMama" && f.required)).toBe(true);
  });

  it("retorna la configuración correcta para cumpleanos-esencial", () => {
    const config = getTemplateConfig("cumpleanos-esencial");
    expect(config).toBeDefined();
    expect(config.id).toBe("cumpleanos-esencial");
    expect(config.fields.some(f => f.key === "nombre" && f.required)).toBe(true);
  });
});

