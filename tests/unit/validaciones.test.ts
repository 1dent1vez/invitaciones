import { describe, it, expect, vi } from "vitest";
import { pedidoSchema } from "@/app/(admin)/admin/pedidos/schemas";
import { uploadImageAction } from "@/app/(admin)/admin/pedidos/[id]/editar/actions";

// Mock Cloudinary to avoid network calls
vi.mock("@/lib/cloudinary", () => ({
  uploadToCloudinary: vi.fn().mockResolvedValue("https://res.cloudinary.com/demo/image/upload/mocked-image.jpg"),
}));

describe("Date Validation Tests", () => {
  it("debe aceptar la fecha de hoy", () => {
    const today = new Date().toISOString();
    const data = {
      clienteId: "client-id",
      tipoEvento: "cumpleanos",
      paquete: "esencial",
      fechaEvento: today,
      template: "cumpleanos-esencial",
      precio: 1000,
    };

    const parsed = pedidoSchema.safeParse(data);
    expect(parsed.success).toBe(true);
  });

  it("debe aceptar fechas futuras", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    const data = {
      clienteId: "client-id",
      tipoEvento: "cumpleanos",
      paquete: "esencial",
      fechaEvento: dateStr,
      template: "cumpleanos-esencial",
      precio: 1000,
    };

    const parsed = pedidoSchema.safeParse(data);
    expect(parsed.success).toBe(true);
  });

  it("debe rechazar fechas pasadas", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];

    const data = {
      clienteId: "client-id",
      tipoEvento: "cumpleanos",
      paquete: "esencial",
      fechaEvento: dateStr,
      template: "cumpleanos-esencial",
      precio: 1000,
    };

    const parsed = pedidoSchema.safeParse(data);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0].message).toContain("no puede ser anterior");
    }
  });
});

describe("Image Validation Tests", () => {
  it("debe rechazar archivos que no sean imágenes (tipo MIME no compatible)", async () => {
    const formData = new FormData();
    const file = new File(["dummy text content"], "test.txt", { type: "text/plain" });
    formData.append("file", file);

    const res = await uploadImageAction(formData);
    expect(res.success).toBe(false);
    expect(res.error).toContain("imagen válida");
  });

  it("debe rechazar imágenes con tamaño superior a 5MB", async () => {
    const formData = new FormData();
    // 6MB of empty data
    const largeContent = new Uint8Array(6 * 1024 * 1024);
    const file = new File([largeContent], "large_photo.jpg", { type: "image/jpeg" });
    formData.append("file", file);

    const res = await uploadImageAction(formData);
    expect(res.success).toBe(false);
    expect(res.error).toContain("5MB");
  });

  it("debe aceptar imágenes válidas de tamaño menor o igual a 5MB", async () => {
    const formData = new FormData();
    const smallContent = new Uint8Array(1 * 1024 * 1024); // 1MB
    const file = new File([smallContent], "photo.jpg", { type: "image/jpeg" });
    // Bypasses JSDOM limitation where File.prototype.arrayBuffer is undefined
    Object.defineProperty(file, "arrayBuffer", {
      value: async () => smallContent.buffer,
      writable: true,
    });
    formData.append("file", file);

    const res = await uploadImageAction(formData);
    expect(res.success).toBe(true);
    expect(res.data).toBe("https://res.cloudinary.com/demo/image/upload/mocked-image.jpg");
  });
});
