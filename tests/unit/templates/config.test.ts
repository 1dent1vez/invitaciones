import { describe, it, expect } from "vitest";
import { getTemplateConfig } from "@/lib/templates";

describe("getTemplateConfig", () => {


  it("retorna la configuración correcta para cumpleanos-esencial", () => {
    const config = getTemplateConfig("cumpleanos-esencial");
    expect(config).toBeDefined();
    expect(config.id).toBe("cumpleanos-esencial");
    expect(config.fields.some(f => f.key === "nombre" && f.required)).toBe(true);
  });
});

