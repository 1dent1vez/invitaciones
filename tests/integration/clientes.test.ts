import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { prisma } from '@/lib/prisma';
import {
  createClienteAction,
  getClientesAction,
  updateClienteAction,
  deleteClienteAction,
} from '@/app/(admin)/admin/clientes/actions';
import { ClientesClient } from '@/app/(admin)/admin/clientes/clientes-client';

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

describe('Clientes CRUD Integration Tests', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Clean database in reverse order of dependencies
    await prisma.visita.deleteMany();
    await prisma.rSVP.deleteMany();
    await prisma.pago.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.cliente.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('debe crear un cliente válido y recuperarlo', async () => {
    const input = {
      nombre: 'Juan Perez Integration',
      telefono: '5511223344',
      email: 'juan.integration@example.com',
      fuente: 'instagram' as const,
      notas: 'Notas de prueba',
    };

    const createRes = await createClienteAction(input);
    expect(createRes.success).toBe(true);
    expect(createRes.data?.id).toBeDefined();

    const getRes = await getClientesAction('Juan Perez');
    expect(getRes.success).toBe(true);
    expect(getRes.data).toBeDefined();
    expect(getRes.data!.length).toBeGreaterThan(0);
    expect(getRes.data![0]!.nombre).toBe(input.nombre);
  });

  it('debe rechazar nombres de cliente con menos de 2 caracteres', async () => {
    const input = {
      nombre: 'J',
      telefono: '',
      email: '',
      fuente: 'tienda' as const,
      notas: '',
    };

    const createRes = await createClienteAction(input);
    expect(createRes.success).toBe(false);
    expect(createRes.error).toContain('El nombre debe tener al menos 2 caracteres');
  });

  it('debe actualizar la información de un cliente existente', async () => {
    const client = await prisma.cliente.create({
      data: {
        nombre: 'Original Name',
        fuente: 'whatsapp',
      },
    });

    const updateInput = {
      nombre: 'Updated Name',
      telefono: '9988776655',
      email: 'updated@example.com',
      fuente: 'instagram' as const,
      notas: 'Updated notes',
    };

    const updateRes = await updateClienteAction(client.id, updateInput);
    expect(updateRes.success).toBe(true);

    const updated = await prisma.cliente.findUnique({
      where: { id: client.id },
    });
    expect(updated?.nombre).toBe('Updated Name');
    expect(updated?.telefono).toBe('9988776655');
    expect(updated?.fuente).toBe('instagram');
  });

  it('debe eliminar un cliente que no tiene pedidos', async () => {
    const client = await prisma.cliente.create({
      data: {
        nombre: 'To Delete',
        fuente: 'referido',
      },
    });

    const deleteRes = await deleteClienteAction(client.id);
    expect(deleteRes.success).toBe(true);

    const check = await prisma.cliente.findUnique({
      where: { id: client.id },
    });
    expect(check).toBeNull();
  });

  it('debe bloquear la eliminación de un cliente si tiene pedidos asociados', async () => {
    const client = await prisma.cliente.create({
      data: {
        nombre: 'Has Orders',
        fuente: 'tienda',
      },
    });

    await prisma.pedido.create({
      data: {
        clienteId: client.id,
        tipoEvento: 'cumpleanos',
        fechaEvento: new Date(),
        template: 'cumpleanos-esencial',
        precio: 1000,
        estado: 'cotizado',
        slug: 'test-has-orders-slug',
      },
    });

    const deleteRes = await deleteClienteAction(client.id);
    expect(deleteRes.success).toBe(false);
    expect(deleteRes.error).toContain(
      'No se puede eliminar el cliente porque tiene pedidos asociados'
    );

    const check = await prisma.cliente.findUnique({
      where: { id: client.id },
    });
    expect(check).not.toBeNull();
  });

  describe('ClientesClient Component', () => {
    it('debe abrir el diálogo y al guardar correctamente un nuevo cliente redirige a /admin/clientes', async () => {
      render(React.createElement(ClientesClient, { initialClientes: [] }));

      const openBtn = screen.getByRole('button', { name: /Registrar Cliente/i });
      fireEvent.click(openBtn);

      const nombreInput = screen.getByPlaceholderText('Ej. María López');
      const saveBtn = screen.getByRole('button', { name: /Guardar/i });

      fireEvent.change(nombreInput, { target: { value: 'Maria Perez Test' } });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/admin/clientes');
        expect(mockRefresh).toHaveBeenCalled();
      });
    });
  });
});
