'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { Cliente } from '@prisma/client';
import { ActionResult, ClienteInput } from '@/types';
import { clienteSchema } from './schemas';

export async function getClientesAction(search?: string): Promise<ActionResult<Cliente[]>> {
  try {
    const clients = await prisma.cliente.findMany({
      where: search
        ? {
            nombre: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { success: true, data: clients };
  } catch (error) {
    console.error('[getClientesAction]', error);
    return { success: false, error: 'Error al cargar los clientes' };
  }
}

export async function createClienteAction(
  input: ClienteInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const parsed = clienteSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Datos no válidos' };
    }

    const client = await prisma.cliente.create({
      data: {
        nombre: parsed.data.nombre.trim(),
        telefono: parsed.data.telefono?.trim() ?? null,
        fuente: parsed.data.fuente,
        email: parsed.data.email?.trim() ?? null,
        notas: parsed.data.notas?.trim() ?? null,
      },
    });

    revalidatePath('/admin/clientes');
    return { success: true, data: { id: client.id } };
  } catch (error) {
    console.error('[createClienteAction]', error);
    return { success: false, error: 'Error al registrar el cliente' };
  }
}

export async function updateClienteAction(
  id: string,
  input: ClienteInput
): Promise<ActionResult<void>> {
  try {
    if (!id) return { success: false, error: 'ID del cliente es requerido' };

    const parsed = clienteSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Datos no válidos' };
    }

    await prisma.cliente.update({
      where: { id },
      data: {
        nombre: parsed.data.nombre.trim(),
        telefono: parsed.data.telefono?.trim() ?? null,
        fuente: parsed.data.fuente,
        email: parsed.data.email?.trim() ?? null,
        notas: parsed.data.notas?.trim() ?? null,
      },
    });

    revalidatePath('/admin/clientes');
    return { success: true };
  } catch (error) {
    console.error('[updateClienteAction]', error);
    return { success: false, error: 'Error al actualizar el cliente' };
  }
}

export async function deleteClienteAction(id: string): Promise<ActionResult<void>> {
  try {
    if (!id) return { success: false, error: 'ID del cliente es requerido' };

    // Check if client has associated orders
    const ordersCount = await prisma.pedido.count({
      where: { clienteId: id },
    });

    if (ordersCount > 0) {
      return {
        success: false,
        error: 'No se puede eliminar el cliente porque tiene pedidos asociados',
      };
    }

    await prisma.cliente.delete({
      where: { id },
    });

    revalidatePath('/admin/clientes');
    return { success: true };
  } catch (error) {
    console.error('[deleteClienteAction]', error);
    return { success: false, error: 'Error al eliminar el cliente' };
  }
}
