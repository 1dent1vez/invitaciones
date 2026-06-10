import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { registrarVisitaAction } from "@/app/(public)/i/[slug]/actions";

describe("Visitas Integration Tests", () => {
  let testPedidoId: string;
  const testSlug: string = "test-visit-analytics";

  beforeEach(async () => {
    // Clear dependencies and setup mock order
    await prisma.visita.deleteMany();
    await prisma.rSVP.deleteMany();
    await prisma.pago.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.cliente.deleteMany();

    const client = await prisma.cliente.create({
      data: {
        nombre: "Test Client Visits",
        fuente: "tienda",
      },
    });

    const pedido = await prisma.pedido.create({
      data: {
        clienteId: client.id,
        tipoEvento: "cumpleanos",
        fechaEvento: new Date("2026-10-18T18:00:00Z"),
        template: "cumpleanos-esencial",
        precio: 350,
        estado: "cotizado",
        slug: testSlug,
        urlPublica: `http://localhost:3000/i/${testSlug}`,
        datosInvitacion: {
          nombre: "María Fernanda",
        },
      },
    });
    testPedidoId = pedido.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("debe registrar una visita exitosamente", async () => {
    const res = await registrarVisitaAction(testSlug, "192.168.1.100", "Mozilla/5.0 Chrome");
    expect(res.success).toBe(true);

    const visits = await prisma.visita.findMany({
      where: { pedidoId: testPedidoId },
    });
    expect(visits.length).toBe(1);
    expect(visits[0].ip).toBe("192.168.1.100");
    expect(visits[0].userAgent).toBe("Mozilla/5.0 Chrome");
  });

  it("debe registrar una visita exitosamente con datos nulos/vacíos para ip y userAgent", async () => {
    const res = await registrarVisitaAction(testSlug, null, null);
    expect(res.success).toBe(true);

    const visits = await prisma.visita.findMany({
      where: { pedidoId: testPedidoId },
    });
    expect(visits.length).toBe(1);
    expect(visits[0].ip).toBeNull();
    expect(visits[0].userAgent).toBeNull();
  });

  it("debe retornar error si el slug no existe", async () => {
    const res = await registrarVisitaAction("non-existent-slug", "127.0.0.1", "curl");
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });
});
