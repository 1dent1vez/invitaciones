import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { publicarInvitacionAction } from "@/app/(admin)/admin/pedidos/[id]/editar/actions";
import PublicInvitationPage, { generateMetadata } from "@/app/(public)/i/[slug]/page";

describe("Publicación e Invitación Pública Integration Tests", () => {
  let testClienteId: string;

  beforeEach(async () => {
    await prisma.visita.deleteMany();
    await prisma.rSVP.deleteMany();
    await prisma.pago.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.cliente.deleteMany();

    const client = await prisma.cliente.create({
      data: {
        nombre: "María y Juan",
        fuente: "instagram",
      },
    });
    testClienteId = client.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("debe publicar un pedido y renderizar la página pública exitosamente", async () => {
    const pedido = await prisma.pedido.create({
      data: {
        clienteId: testClienteId,
        tipoEvento: "boda",
        paquete: "esencial",
        fechaEvento: new Date("2026-10-12T15:00:00Z"),
        template: "boda-esencial",
        precio: 2500,
        estado: "cotizado",
        datosInvitacion: {
          nombres: "María y Juan",
          fecha: "2026-10-12T15:00:00Z",
          ubicacion: "Hacienda del Sol",
        },
      },
    });

    // Publicar
    const pubRes = await publicarInvitacionAction(pedido.id);
    expect(pubRes.success).toBe(true);
    const slug = pubRes.data?.slug!;

    // Generar metadata
    const metadata = await generateMetadata({ params: { slug } });
    expect(metadata.title).toContain("María y Juan");
    expect(metadata.description).toContain("celebrar nuestra Boda");

    // Renderizar página pública
    const result = await PublicInvitationPage({ params: { slug } });
    expect(result).toBeDefined();
    expect(result.props.children).toBeDefined();
  });

  it("debe retornar error notFound si el slug no existe", async () => {
    await expect(
      PublicInvitationPage({ params: { slug: "slug-inexistente" } })
    ).rejects.toThrow();
  });
});
