import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { createRSVPAction } from "@/app/(public)/i/[slug]/actions";

describe("RSVP Integration Tests", () => {
  let testPedidoId: string;
  const testSlug: string = "test-event-rsvp";

  beforeEach(async () => {
    await prisma.visita.deleteMany();
    await prisma.rSVP.deleteMany();
    await prisma.pago.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.cliente.deleteMany();

    const client = await prisma.cliente.create({
      data: {
        nombre: "Test Client",
        fuente: "instagram",
      },
    });

    const pedido = await prisma.pedido.create({
      data: {
        clienteId: client.id,
        tipoEvento: "cumpleanos",
        paquete: "esencial",
        fechaEvento: new Date("2026-12-18T18:00:00Z"),
        template: "cumpleanos-esencial",
        precio: 2500,
        estado: "cotizado",
        slug: testSlug,
        urlPublica: `http://localhost:3000/i/${testSlug}`,
        datosInvitacion: {
          nombre: "Ana & Carlos",
        },
      },
    });
    testPedidoId = pedido.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("debe registrar un RSVP exitosamente si los datos son válidos", async () => {
    const res = await createRSVPAction(testSlug, {
      nombre: "José Pérez",
      asiste: true,
      pax: 2,
      telefono: "5512345678",
      mensaje: "¡Felicidades!",
    });

    expect(res.success).toBe(true);

    const rsvps = await prisma.rSVP.findMany({
      where: { pedidoId: testPedidoId },
    });
    expect(rsvps.length).toBe(1);
    expect(rsvps[0].nombre).toBe("José Pérez");
    expect(rsvps[0].asiste).toBe(true);
    expect(rsvps[0].pax).toBe(2);
    expect(rsvps[0].telefono).toBe("5512345678");
  });

  it("debe forzar pax a 0 en base de datos si asiste es false", async () => {
    const res = await createRSVPAction(testSlug, {
      nombre: "María Gómez",
      asiste: false,
      pax: 3,
    });

    expect(res.success).toBe(true);

    const rsvps = await prisma.rSVP.findMany({
      where: { pedidoId: testPedidoId },
    });
    expect(rsvps.length).toBe(1);
    expect(rsvps[0].asiste).toBe(false);
    expect(rsvps[0].pax).toBe(0);
  });

  it("debe rechazar nombres demasiado cortos", async () => {
    const res = await createRSVPAction(testSlug, {
      nombre: "J",
      asiste: true,
      pax: 1,
    });
    expect(res.success).toBe(false);
    expect(res.error).toContain("nombre");
  });

  it("debe rechazar cantidad de pax menor a 1", async () => {
    const res = await createRSVPAction(testSlug, {
      nombre: "Juan Valdez",
      asiste: true,
      pax: 0,
    });
    expect(res.success).toBe(false);
    expect(res.error).toContain("personas");
  });
});
