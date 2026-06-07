import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { createPedidoAction, updatePedidoEstadoAction } from "@/app/(admin)/admin/pedidos/actions";

describe("Pedidos Integration Tests", () => {
  let testClienteId: string;

  beforeEach(async () => {
    // Clean database
    await prisma.visita.deleteMany();
    await prisma.rSVP.deleteMany();
    await prisma.pago.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.cliente.deleteMany();

    // Create a base client for order tests
    const client = await prisma.cliente.create({
      data: {
        nombre: "Test Client For Pedidos",
        fuente: "instagram",
      },
    });
    testClienteId = client.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("debe crear un pedido válido y verificar su estado inicial como cotizado", async () => {
    const input = {
      clienteId: testClienteId,
      tipoEvento: "boda" as const,
      fechaEvento: "2026-09-20",
      template: "boda-elegante" as const,
      precio: 2500,
      notas: "Notas de pedido de prueba",
    };

    const res = await createPedidoAction(input);
    expect(res.success).toBe(true);
    expect(res.data?.id).toBeDefined();

    const check = await prisma.pedido.findUnique({
      where: { id: res.data!.id },
    });
    expect(check).toBeDefined();
    expect(check?.estado).toBe("cotizado");
    expect(Number(check?.precio)).toBe(2500);
    expect(check?.slug).toBe("test-client-for-pedidos-2026");
  });

  it("debe generar slugs únicos incrementando sufijos numéricos si hay colisión", async () => {
    const input1 = {
      clienteId: testClienteId,
      tipoEvento: "boda" as const,
      fechaEvento: "2026-09-20",
      template: "boda-elegante" as const,
      precio: 2500,
      notas: "",
    };

    const res1 = await createPedidoAction(input1);
    expect(res1.success).toBe(true);

    const input2 = {
      clienteId: testClienteId,
      tipoEvento: "xv" as const,
      fechaEvento: "2026-09-20", // same year
      template: "xv-moderno" as const,
      precio: 3000,
      notas: "",
    };

    const res2 = await createPedidoAction(input2);
    expect(res2.success).toBe(true);

    const check1 = await prisma.pedido.findUnique({ where: { id: res1.data!.id } });
    const check2 = await prisma.pedido.findUnique({ where: { id: res2.data!.id } });

    expect(check1?.slug).toBe("test-client-for-pedidos-2026");
    expect(check2?.slug).toBe("test-client-for-pedidos-2026-1");
  });

  it("debe actualizar el estado del pedido a estados válidos", async () => {
    const order = await prisma.pedido.create({
      data: {
        clienteId: testClienteId,
        tipoEvento: "cumpleanos",
        fechaEvento: new Date(),
        template: "cumpleanos-fiesta",
        precio: 1000,
        estado: "cotizado",
        slug: "test-update-state",
      },
    });

    const res = await updatePedidoEstadoAction(order.id, "en_produccion");
    expect(res.success).toBe(true);

    const check = await prisma.pedido.findUnique({ where: { id: order.id } });
    expect(check?.estado).toBe("en_produccion");
  });

  it("debe rechazar estados de pedidos inválidos", async () => {
    const order = await prisma.pedido.create({
      data: {
        clienteId: testClienteId,
        tipoEvento: "cumpleanos",
        fechaEvento: new Date(),
        template: "cumpleanos-fiesta",
        precio: 1000,
        estado: "cotizado",
        slug: "test-invalid-state",
      },
    });

    const res = await updatePedidoEstadoAction(order.id, "estado_inventado");
    expect(res.success).toBe(false);
    expect(res.error).toContain("Estado no válido");

    const check = await prisma.pedido.findUnique({ where: { id: order.id } });
    expect(check?.estado).toBe("cotizado");
  });
});
