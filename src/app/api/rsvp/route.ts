import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const rsvpSchema = z.object({
  slug: z.string().min(1, 'El slug de la invitación es requerido'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  asiste: z.boolean({
    required_error: 'Debe indicar si asistirá',
  }),
  pax: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, 'El número de personas (pax) debe ser al menos 1')
  ),
  telefono: z.string().optional().nullable().or(z.literal('')),
  mensaje: z.string().optional().nullable().or(z.literal('')),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = rsvpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Datos del RSVP no válidos' },
        { status: 400 }
      );
    }

    const { slug, nombre, asiste, pax, telefono, mensaje } = parsed.data;

    const pedido = await prisma.pedido.findUnique({
      where: { slug },
    });

    if (!pedido) {
      return NextResponse.json(
        { success: false, error: 'La invitación no existe o no es válida' },
        { status: 404 }
      );
    }

    const finalPax = asiste ? pax : 0;

    const newRsvp = await prisma.rSVP.create({
      data: {
        pedidoId: pedido.id,
        nombre,
        asiste,
        pax: finalPax,
        telefono: telefono ?? null,
        mensaje: mensaje ?? null,
      },
    });

    revalidatePath(`/i/${slug}`);
    revalidatePath(`/admin/pedidos/${pedido.id}`);

    return NextResponse.json({ success: true, data: newRsvp });
  } catch (err) {
    console.error('[POST /api/rsvp]', err);
    return NextResponse.json(
      { success: false, error: 'Ocurrió un error inesperado al registrar el RSVP' },
      { status: 500 }
    );
  }
}
