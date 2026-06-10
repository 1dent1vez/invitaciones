import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { registrarPagoAction } from "@/app/(admin)/admin/pedidos/[id]/actions";

describe("Pagos Integration Tests", () => {
  let testClienteId: string;
  let testPedidoId: string;

  beforeEach(async () => {
    // Clean database
    await prisma.visita.deleteMany();
    await prisma.rSVP.deleteMany();
    await prisma.pago.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.cliente.deleteMany();

    const client = await prisma.cliente.create({
      data: {
        nombre: "Test Client For Pagos",
        fuente: "tienda",
      },
    });
    testClienteId = client.id;

    const order = await prisma.pedido.create({
      data: {
        clienteId: testClienteId,
        tipoEvento: "cumpleanos",
        fechaEvento: new Date(),
        template: "cumpleanos-esencial",
        precio: 2000,
        estado: "cotizado",
        slug: "test-pagos-slug",
      },
    });
    testPedidoId = order.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("debe registrar un pago válido y acumular el saldo", async () => {
    const input1 = {
      monto: 1000,
      metodo: "transferencia" as const,
      comprobante: "http://example.com/receipt1.jpg",
      notas: "Primer abono",
    };

    const res1 = await registrarPagoAction(testPedidoId, input1);
    expect(res1.success).toBe(true);

    // Verify payments count and sum
    let payments = await prisma.pago.findMany({ where: { pedidoId: testPedidoId } });
    expect(payments.length).toBe(1);
    expect(Number(payments[0].monto)).toBe(1000);

    const input2 = {
      monto: 500,
      metodo: "efectivo" as const,
      comprobante: "",
      notas: "Segundo abono",
    };

    const res2 = await registrarPagoAction(testPedidoId, input2);
    expect(res2.success).toBe(true);

    payments = await prisma.pago.findMany({ where: { pedidoId: testPedidoId } });
    expect(payments.length).toBe(2);
    const sum = payments.reduce((acc, p) => acc + Number(p.monto), 0);
    expect(sum).toBe(1500);
  });

  it("debe rechazar un pago que excede el saldo pendiente", async () => {
    // Attempt to pay 2500 on a 2000 order
    const input = {
      monto: 2500,
      metodo: "transferencia" as const,
      comprobante: "",
      notas: "Pago excedido",
    };

    const res = await registrarPagoAction(testPedidoId, input);
    expect(res.success).toBe(false);
    expect(res.error).toContain("El pago excede el saldo pendiente");

    const payments = await prisma.pago.findMany({ where: { pedidoId: testPedidoId } });
    expect(payments.length).toBe(0);
  });

  it("debe cambiar automáticamente el estado del pedido a 'pagado' cuando el saldo llega a 0", async () => {
    const input = {
      monto: 2000,
      metodo: "transferencia" as const,
      comprobante: "",
      notas: "Liquidación",
    };

    const res = await registrarPagoAction(testPedidoId, input);
    expect(res.success).toBe(true);

    const checkOrder = await prisma.pedido.findUnique({
      where: { id: testPedidoId },
    });
    expect(checkOrder?.estado).toBe("pagado");
  });
});
