import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test.describe('Public Invitation E2E Tests', () => {
  test.beforeAll(async () => {
    // Ensure we have a client for our E2E invitation
    let client = await prisma.cliente.findFirst({
      where: { nombre: 'María Pérez' },
    });
    if (!client) {
      client = await prisma.cliente.create({
        data: {
          nombre: 'María Pérez',
          telefono: '5512345678',
          email: 'maria@example.com',
          fuente: 'instagram',
        },
      });
    }

    // Check if the order already exists
    const order = await prisma.pedido.findFirst({
      where: { slug: 'sofia-esencial' },
    });

    if (order) {
      // If it exists, make sure it is PUBLICADA
      await prisma.pedido.update({
        where: { id: order.id },
        data: { estadoInvitacion: 'PUBLICADA' },
      });
    } else {
      // Recreate the birthday invitation
      await prisma.pedido.create({
        data: {
          clienteId: client.id,
          tipoEvento: 'cumpleanos',
          paquete: 'esencial',
          template: 'cumpleanos-esencial',
          fechaEvento: new Date('2026-11-05T20:00:00.000Z'),
          precio: 350.0,
          estado: 'completado',
          estadoInvitacion: 'PUBLICADA',
          slug: 'sofia-esencial',
          urlPublica: 'http://localhost:3000/i/sofia-esencial',
          datosInvitacion: {
            nombre: 'Sofía Hernández',
            edad: 30,
            fecha: '2026-11-05T20:00:00.000Z',
            hora: '20:00',
            lugar: 'Terraza La Vista',
            direccion: 'Av. Insurgentes 123, Condesa, CDMX',
            tipoCelebracion: 'Adultos',
            fotoPortada:
              'https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=800&auto=format&fit=crop',
            mensaje: '¡Vamos a celebrar 30 años de risas y buenos amigos!',
            whatsapp: '5512345678',
          },
        },
      });
    }
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test('debería cargar la invitación pública de Sofía y mostrar su nombre', async ({ page }) => {
    await page.goto('/i/sofia-esencial');

    // Check that we are on the correct page and not redirected
    await expect(page).toHaveURL(/\/i\/sofia-esencial/);
    expect(page.url()).not.toContain('test-visit-analytics');

    // Check that the name of the birthday person is visible in the DOM
    await expect(page.locator('body')).toContainText('Sofía Hernández');
  });
});
