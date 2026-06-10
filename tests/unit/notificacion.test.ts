import { describe, it, expect } from "vitest";
import { generarTextoNotificacion } from "@/lib/notificaciones";

describe("Generación de Texto de Notificación para WhatsApp", () => {
  it("debe retornar el texto de notificación formateado correctamente con todas las variables", () => {
    const nombre = "Carlos Slim";
    const url = "https://invitaciones.com/i/carlos-y-soumaya";
    const qr = "https://cloudinary.com/qr.png";

    const text = generarTextoNotificacion(nombre, url, qr);

    expect(text).toBe(
      "¡Hola Carlos Slim! Tu invitación de cumpleaños está lista 🎉\n\n" +
      "Link: https://invitaciones.com/i/carlos-y-soumaya\n" +
      "QR: https://cloudinary.com/qr.png"
    );
  });

  it("debe manejar fallbacks para campos vacíos u omitidos", () => {
    const text = generarTextoNotificacion("", "", "");

    expect(text).toBe(
      "¡Hola cliente! Tu invitación de cumpleaños está lista 🎉\n\n" +
      "Link: \n" +
      "QR: "
    );
  });

  it("debe retornar texto adaptado para cumpleaños", () => {
    const text = generarTextoNotificacion("Juan", "http://link", "http://qr", "cumpleanos");
    expect(text).toContain("invitación de cumpleaños");
    expect(text).toContain("🎉");
  });
});
