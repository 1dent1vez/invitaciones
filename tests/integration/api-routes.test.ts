import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { GET as qrGET } from "@/app/api/qr/route";
import { POST as rsvpPOST } from "@/app/api/rsvp/route";
import { POST as analyticsPOST } from "@/app/api/analytics/route";

describe("API Routes Integration Tests", () => {
  let testClienteId: string;
  let testPedidoId: string;
  const testSlug = "api-test-slug";

  beforeEach(async () => {
    await prisma.visita.deleteMany();
    await prisma.rSVP.deleteMany();
    await prisma.pago.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.cliente.deleteMany();

    const client = await prisma.cliente.create({
      data: {
        nombre: "API Test Client",
        fuente: "instagram",
      },
    });
    testClienteId = client.id;

    const pedido = await prisma.pedido.create({
      data: {
        clienteId: testClienteId,
        tipoEvento: "cumpleanos",
        paquete: "esencial",
        fechaEvento: new Date("2026-10-12T15:00:00Z"),
        template: "cumpleanos-esencial",
        precio: 2500,
        estado: "cotizado",
        slug: testSlug,
        urlPublica: `http://localhost:3000/i/${testSlug}`,
        datosInvitacion: {
          nombre: "API test event",
        },
      },
    });
    testPedidoId = pedido.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/qr", () => {
    it("debe retornar error 400 si falta url", async () => {
      const req = new NextRequest("http://localhost:3000/api/qr");
      const res = await qrGET(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("URL");
    });

    it("debe retornar 200 y png si se provee url", async () => {
      const req = new NextRequest("http://localhost:3000/api/qr?url=http://localhost:3000/i/api-test-slug");
      const res = await qrGET(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("image/png");
      const buffer = await res.arrayBuffer();
      expect(buffer.byteLength).toBeGreaterThan(0);
    });
  });

  describe("POST /api/rsvp", () => {
    it("debe registrar un RSVP exitosamente si el cuerpo es valido", async () => {
      const req = new NextRequest("http://localhost:3000/api/rsvp", {
        method: "POST",
        body: JSON.stringify({
          slug: testSlug,
          nombre: "Invitado API",
          asiste: true,
          pax: 2,
          telefono: "5512345678",
          mensaje: "Felicidades!",
        }),
      });

      const res = await rsvpPOST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);

      const rsvps = await prisma.rSVP.findMany({
        where: { pedidoId: testPedidoId },
      });
      expect(rsvps.length).toBe(1);
      expect(rsvps[0].nombre).toBe("Invitado API");
      expect(rsvps[0].pax).toBe(2);
    });

    it("debe retornar 404 si el slug no existe", async () => {
      const req = new NextRequest("http://localhost:3000/api/rsvp", {
        method: "POST",
        body: JSON.stringify({
          slug: "slug-inexistente",
          nombre: "Invitado API",
          asiste: true,
          pax: 2,
        }),
      });

      const res = await rsvpPOST(req);
      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("no existe");
    });
  });

  describe("POST /api/analytics", () => {
    it("debe registrar una visita exitosamente si se provee el slug", async () => {
      const req = new NextRequest("http://localhost:3000/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          slug: testSlug,
          ip: "127.0.0.1",
          userAgent: "Vitest Agent",
        }),
      });

      const res = await analyticsPOST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);

      const visitas = await prisma.visita.findMany({
        where: { pedidoId: testPedidoId },
      });
      expect(visitas.length).toBe(1);
      expect(visitas[0].ip).toBe("127.0.0.1");
      expect(visitas[0].userAgent).toBe("Vitest Agent");
    });
  });
});
