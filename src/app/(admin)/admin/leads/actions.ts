'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function deleteLeadAction(id: string): Promise<ActionResult> {
  try {
    if (!id) {
      return { success: false, error: 'El ID del lead es requerido' };
    }

    await prisma.lead.delete({
      where: { id },
    });

    revalidatePath('/admin/leads');
    return { success: true };
  } catch (error) {
    console.error('[deleteLeadAction] Error:', error);
    return { success: false, error: 'No se pudo eliminar el lead de la base de datos' };
  }
}
