import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { publicarInvitacionAction, slugify } from "@/app/(admin)/admin/pedidos/[id]/editar/actions";

describe("Slug Integration Tests", () => {
  let testClienteId: string;

  beforeEach(async () => {
    // Limpiar base de datos
    await prisma.visita.deleteMany();
    await prisma.rSVP.deleteMany();
    await prisma.pago.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.cliente.deleteMany();

    const client = await prisma.cliente.create({
      data: {
        nombre: "Ana y Carlos",
        fuente: "instagram",
      },
    });
    testClienteId = client.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("debe slugificar texto correctamente", async () => {
    expect(await slugify("Ana & Carlos - Bodas!")).toBe("ana-carlos-bodas");
    expect(await slugify("  María José y Andrés  ")).toBe("maria-jose-y-andres");
  });

  it("debe generar slug único para un pedido al publicar", async () => {
    const pedido = await prisma.pedido.create({
      data: {
        clienteId: testClienteId,
        tipoEvento: "boda",
        fechaEvento: new Date("2026-08-15T18:00:00Z"),
        template: "boda-elegante",
        precio: 2500,
        estado: "cotizado",
        datosJson: {
          nombres: "Ana y Carlos",
        },
      },
    });

    const res = await publicarInvitacionAction(pedido.id);
    expect(res.success).toBe(true);
    expect(res.data?.slug).toBe("ana-y-carlos-2026-08-15");

    const check = await prisma.pedido.findUnique({
      where: { id: pedido.id },
    });
    expect(check?.slug).toBe("ana-y-carlos-2026-08-15");
    expect(check?.estado).toBe("entregado");
  });

  it("debe manejar colisiones de slugs añadiendo sufijos numéricos", async () => {
    const pedido1 = await prisma.pedido.create({
      data: {
        clienteId: testClienteId,
        tipoEvento: "boda",
        fechaEvento: new Date("2026-08-15T18:00:00Z"),
        template: "boda-elegante",
        precio: 2500,
        estado: "cotizado",
        datosJson: {
          nombres: "Ana y Carlos",
        },
      },
    });

    const pedido2 = await prisma.pedido.create({
      data: {
        clienteId: testClienteId,
        tipoEvento: "boda",
        fechaEvento: new Date("2026-08-15T18:00:00Z"),
        template: "boda-elegante",
        precio: 2500,
        estado: "cotizado",
        datosJson: {
          nombres: "Ana y Carlos",
        },
      },
    });

    const res1 = await publicarInvitacionAction(pedido1.id);
    expect(res1.success).toBe(true);
    expect(res1.data?.slug).toBe("ana-y-carlos-2026-08-15");

    const res2 = await publicarInvitacionAction(pedido2.id);
    expect(res2.success).toBe(true);
    expect(res2.data?.slug).toBe("ana-y-carlos-2026-08-15-1");

    const check1 = await prisma.pedido.findUnique({ where: { id: pedido1.id } });
    const check2 = await prisma.pedido.findUnique({ where: { id: pedido2.id } });
    expect(check1?.slug).toBe("ana-y-carlos-2026-08-15");
    expect(check2?.slug).toBe("ana-y-carlos-2026-08-15-1");
  });
});
