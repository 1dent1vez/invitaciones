import { describe, it, expect } from "vitest";
import { generarTextoNotificacion } from "@/lib/notificaciones";

describe("generarTextoNotificacion", () => {
  it("genera mensajes correctos para cumpleaños", () => {
    const cumple = generarTextoNotificacion("Ana", "http://invitacion.com", "http://qr.com", "cumpleanos");
    expect(cumple).toContain("invitación de cumpleaños");
    expect(cumple).toContain("🎉");
  });

  it("incluye fecha, hora y lugar en el mensaje si son proveídos", () => {
    const msg = generarTextoNotificacion(
      "Carlos",
      "http://invitacion.com",
      "http://qr.com",
      "cumpleanos",
      "2026-12-31T20:00:00Z",
      "20:00",
      "Salón Azul"
    );
    expect(msg).toContain("diciembre"); // or 31 depending on locale/timezone, but let's test for year/month
    expect(msg).toContain("2026");
    expect(msg).toContain("⏰ Hora: 20:00 hrs");
    expect(msg).toContain("📍 Lugar: Salón Azul");
  });
});
