import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { prisma } from '@/lib/prisma';
import { createPedidoAction, updatePedidoEstadoAction } from '@/app/(admin)/admin/pedidos/actions';
import { NuevoPedidoClient } from '@/app/(admin)/admin/pedidos/nuevo/nuevo-pedido-client';
import { Cliente } from '@prisma/client';

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

describe('Pedidos Integration Tests', () => {
  let testClienteId: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Clean database
    await prisma.visita.deleteMany();
    await prisma.rSVP.deleteMany();
    await prisma.pago.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.cliente.deleteMany();

    // Create a base client for order tests
    const client = await prisma.cliente.create({
      data: {
        nombre: 'Test Client For Pedidos',
        fuente: 'instagram',
      },
    });
    testClienteId = client.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('debe crear un pedido válido y verificar su estado inicial como cotizado', async () => {
    const input = {
      clienteId: testClienteId,
      tipoEvento: 'cumpleanos' as const,
      paquete: 'esencial' as const,
      fechaEvento: '2026-09-20',
      template: 'cumpleanos-esencial' as const,
      precio: 350,
      notas: 'Notas de pedido de prueba',
    };

    const res = await createPedidoAction(input);
    expect(res.success).toBe(true);
    expect(res.data?.id).toBeDefined();

    const check = await prisma.pedido.findUnique({
      where: { id: res.data!.id },
    });
    expect(check).toBeDefined();
    console.log('CHECKED PEDIDO:', JSON.stringify(check, null, 2));
    expect(check?.estado).toBe('cotizado');
    expect(Number(check?.precio)).toBe(350);
    expect(check?.slug).toBe('test-client-for-pedidos-2026');
  });

  it('debe generar slugs únicos incrementando sufijos numéricos si hay colisión', async () => {
    const input1 = {
      clienteId: testClienteId,
      tipoEvento: 'cumpleanos' as const,
      paquete: 'esencial' as const,
      fechaEvento: '2026-09-20',
      template: 'cumpleanos-esencial' as const,
      precio: 350,
      notas: '',
    };

    const res1 = await createPedidoAction(input1);
    expect(res1.success).toBe(true);

    const res2 = await createPedidoAction({
      clienteId: testClienteId,
      tipoEvento: 'cumpleanos' as const,
      paquete: 'esencial' as const,
      fechaEvento: '2026-09-20',
      template: 'cumpleanos-esencial' as const,
      precio: 350,
      notas: '',
    });
    expect(res2.success).toBe(true);

    const check1 = await prisma.pedido.findUnique({ where: { id: res1.data!.id } });
    const check2 = await prisma.pedido.findUnique({ where: { id: res2.data!.id } });

    expect(check1?.slug).toBe('test-client-for-pedidos-2026');
    expect(check2?.slug).toBe('test-client-for-pedidos-2026-1');
  });

  it('debe actualizar el estado del pedido a estados válidos', async () => {
    const order = await prisma.pedido.create({
      data: {
        clienteId: testClienteId,
        tipoEvento: 'cumpleanos',
        paquete: 'esencial',
        fechaEvento: new Date(),
        template: 'cumpleanos-esencial',
        precio: 350,
        estado: 'cotizado',
        slug: 'test-update-state',
      },
    });

    const res = await updatePedidoEstadoAction(order.id, 'en_produccion');
    expect(res.success).toBe(true);

    const check = await prisma.pedido.findUnique({ where: { id: order.id } });
    expect(check?.estado).toBe('en_produccion');
  });

  it('debe rechazar estados de pedidos inválidos', async () => {
    const order = await prisma.pedido.create({
      data: {
        clienteId: testClienteId,
        tipoEvento: 'cumpleanos',
        paquete: 'esencial',
        fechaEvento: new Date(),
        template: 'cumpleanos-esencial',
        precio: 350,
        estado: 'cotizado',
        slug: 'test-invalid-state',
      },
    });

    const res = await updatePedidoEstadoAction(order.id, 'estado_inventado');
    expect(res.success).toBe(false);
    expect(res.error).toContain('Estado no válido');

    const check = await prisma.pedido.findUnique({ where: { id: order.id } });
    expect(check?.estado).toBe('cotizado');
  });

  it('debe rechazar la creación de un pedido si el precio es negativo o cero', async () => {
    const inputNegative = {
      clienteId: testClienteId,
      tipoEvento: 'cumpleanos' as const,
      paquete: 'esencial' as const,
      fechaEvento: '2026-09-20T18:00:00.000Z',
      template: 'cumpleanos-esencial' as const,
      precio: -100,
      notas: '',
    };

    const resNegative = await createPedidoAction(inputNegative);
    expect(resNegative.success).toBe(false);
    expect(resNegative.error).toContain('El precio debe ser un número positivo');

    const inputZero = {
      ...inputNegative,
      precio: 0,
    };
    const resZero = await createPedidoAction(inputZero);
    expect(resZero.success).toBe(false);
    expect(resZero.error).toContain('El precio debe ser un número positivo');
  });

  it('debe rechazar la creación de un pedido si la fecha es en el pasado', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const input = {
      clienteId: testClienteId,
      tipoEvento: 'cumpleanos' as const,
      paquete: 'esencial' as const,
      fechaEvento: pastDate.toISOString(),
      template: 'cumpleanos-esencial' as const,
      precio: 350,
      notas: '',
    };

    const res = await createPedidoAction(input);
    expect(res.success).toBe(false);
    expect(res.error).toContain('La fecha y hora del evento no puede ser anterior a hoy');
  });

  describe('NuevoPedidoClient Component', () => {
    let mockClient: Cliente;

    beforeEach(async () => {
      mockClient = await prisma.cliente.create({
        data: {
          nombre: 'Client For Wizard Test',
          fuente: 'tienda',
        },
      });
    });

    it('debe completar el wizard de 2 pasos y redirigir a /admin/pedidos al crear el pedido', async () => {
      render(React.createElement(NuevoPedidoClient, { clientes: [mockClient] }));

      const clientRow = screen.getByText('Client For Wizard Test');
      fireEvent.click(clientRow);

      const continuarBtn = screen.getByRole('button', { name: /Continuar/i });
      fireEvent.click(continuarBtn);

      const dateInput = screen.getByLabelText(/Fecha del Evento/i);
      const timeInput = screen.getByLabelText(/Hora del Evento/i);
      const priceInput = screen.getByPlaceholderText('Ej. 350');
      const submitBtn = screen.getByRole('button', { name: /Crear Pedido/i });

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const dateString = futureDate.toISOString().split('T')[0];

      fireEvent.change(dateInput, { target: { value: dateString } });
      fireEvent.change(timeInput, { target: { value: '18:00' } });
      // The price field is readOnly, but let's simulate form check if needed or just submit
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/^\/admin\/pedidos\/.+/));
        expect(mockRefresh).toHaveBeenCalled();
      });
    });
  });
});
