import { describe, it, expect } from "vitest";
import { getTemplateConfig } from "@/lib/templates";

describe("getTemplateConfig", () => {
  it("retorna la configuración correcta para boda-elegante", () => {
    const config = getTemplateConfig("boda-elegante");
    expect(config).toBeDefined();
    expect(config.id).toBe("boda-elegante");
    expect(config.name).toBe("Boda Elegante");
    expect(config.fields.some(f => f.key === "nombres" && f.required)).toBe(true);
  });

  it("retorna la configuración correcta para xv-moderno", () => {
    const config = getTemplateConfig("xv-moderno");
    expect(config).toBeDefined();
    expect(config.id).toBe("xv-moderno");
    expect(config.fields.some(f => f.key === "nombres" && f.required)).toBe(true);
  });

  it("retorna la configuración correcta para baby-shower", () => {
    const config = getTemplateConfig("baby-shower");
    expect(config).toBeDefined();
    expect(config.id).toBe("baby-shower");
    expect(config.fields.some(f => f.key === "nombreBebe" && f.required)).toBe(true);
  });

  it("retorna la configuración correcta para cumpleanos-fiesta", () => {
    const config = getTemplateConfig("cumpleanos-fiesta");
    expect(config).toBeDefined();
    expect(config.id).toBe("cumpleanos-fiesta");
    expect(config.fields.some(f => f.key === "nombres" && f.required)).toBe(true);
  });
});
