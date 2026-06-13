'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const leadSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  evento: z.string().optional().nullable().or(z.literal('')),
  fecha: z.string().optional().nullable().or(z.literal('')),
  telefono: z.string().optional().nullable().or(z.literal('')),
  mensaje: z.string().min(5, 'El mensaje debe tener al menos 5 caracteres'),
});

export type LeadInput = z.infer<typeof leadSchema>;

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createLeadAction(input: LeadInput): Promise<ActionResult> {
  try {
    const parsed = leadSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || 'Datos del formulario inválidos',
      };
    }

    const { nombre, evento, fecha, telefono, mensaje } = parsed.data;

    let parsedFecha: Date | null = null;
    if (fecha) {
      const d = new Date(fecha);
      if (!isNaN(d.getTime())) {
        parsedFecha = d;
      }
    }

    await prisma.lead.create({
      data: {
        nombre,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        evento: evento || null,
        fecha: parsedFecha,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        telefono: telefono || null,
        mensaje,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('[createLeadAction] Error:', error);
    return {
      success: false,
      error: 'Ocurrió un error al enviar tu mensaje. Inténtalo de nuevo.',
    };
  }
}
