import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { clonarPedidoAction } from '@/app/(admin)/admin/pedidos/[id]/actions';

// Mock next/navigation redirect behavior
vi.mock('next/navigation', () => {
  return {
    redirect: vi.fn((url) => {
      // Mocked redirect throws an error to emulate Next.js behavior
      throw new Error(`Redirected to: ${url}`);
    }),
  };
});

describe('Clonación de Pedidos Integration Tests', () => {
  let testClienteId: string;
  let sourcePedidoId: string;

  beforeEach(async () => {
    await prisma.visita.deleteMany();
    await prisma.rSVP.deleteMany();
    await prisma.pago.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.cliente.deleteMany();

    const client = await prisma.cliente.create({
      data: {
        nombre: 'Felipe Calderón',
        fuente: 'instagram',
      },
    });
    testClienteId = client.id;

    const sourcePedido = await prisma.pedido.create({
      data: {
        clienteId: testClienteId,
        tipoEvento: 'cumpleanos',
        fechaEvento: new Date('2026-08-20T19:00:00Z'),
        template: 'cumpleanos-esencial',
        precio: 350.0,
        estado: 'completado',
        slug: 'felipe-cumple-2026-08-20',
        urlPublica: 'http://localhost:3000/i/felipe-cumple-2026-08-20',
        qrUrl: 'https://cloudinary.com/qr-source.png',
        datosInvitacion: {
          nombre: 'Valeria Calderón',
          fecha: '2026-08-20T19:00:00Z',
          lugar: 'Salón Real',
          mensaje: 'Mis Quince Años',
          portadaUrl: 'https://cloudinary.com/valeria.jpg',
          fotos: ['https://cloudinary.com/valeria-1.jpg'],
        },
      },
    });
    sourcePedidoId = sourcePedido.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('debe clonar el pedido, limpiar los datos personales y de publicación, e iniciar en estado cotizado', async () => {
    let redirectUrl = '';
    try {
      await clonarPedidoAction(sourcePedidoId);
    } catch (err: any) {
      redirectUrl = err.message;
    }

    expect(redirectUrl).toContain('Redirected to: /admin/pedidos/');
    const newPedidoId = redirectUrl.split('/admin/pedidos/')[1].split('/editar')[0];
    expect(newPedidoId).toBeDefined();

    // Check database copy
    const check = await prisma.pedido.findUnique({
      where: { id: newPedidoId },
    });

    expect(check).toBeDefined();
    expect(check?.clienteId).toBe(testClienteId);
    expect(check?.tipoEvento).toBe('cumpleanos');
    expect(check?.template).toBe('cumpleanos-esencial');
    expect(Number(check?.precio)).toBe(350);

    // Check initial state
    expect(check?.estado).toBe('cotizado');

    // Check cleaned publishing columns
    expect(check?.slug).toBeNull();
    expect(check?.urlPublica).toBeNull();
    expect(check?.qrUrl).toBeNull();

    // Check cleaned dynamic JSON data
    const newDatos = check?.datosInvitacion as any;
    expect(newDatos).toBeDefined();
    expect(newDatos.nombres).toBe('');
    expect(newDatos.nombre).toBe('');
    expect(newDatos.edad).toBe('');
    expect(newDatos.tipoCelebracion).toBe('');
    expect(newDatos.fecha).toBe('');
    expect(newDatos.portadaUrl).toBe('');
    expect(newDatos.mensaje).toBe('');
    expect(newDatos.fotos).toEqual([]);
    expect(newDatos.fotosGaleria).toEqual([]);

    // Ensure template options are kept (e.g. template)
    expect(check?.template).toBe('cumpleanos-esencial');
  });
});
