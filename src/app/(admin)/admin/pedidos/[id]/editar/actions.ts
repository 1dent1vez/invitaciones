'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { generateQRBuffer } from '@/lib/qr';
import { InvitacionData, ActionResult } from '@/types';
import { Prisma } from '@prisma/client';
import { savePedidoSchema } from './schemas';

export async function slugify(text: string): Promise<string> {
  await Promise.resolve();
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .trim()
    .replace(/\s+/g, '-') // replace spaces with dashes
    .replace(/-+/g, '-'); // collapse multiple dashes
}

export async function savePedidoDatosAction(
  pedidoId: string,
  datos: InvitacionData
): Promise<ActionResult<InvitacionData>> {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
    });

    if (!pedido) {
      return { success: false, error: 'El pedido no existe' };
    }

    // Server-side Zod validation matching template
    const parsed = savePedidoSchema(pedido.template).safeParse(datos);
    if (!parsed.success) {
      const errorMsg = parsed.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      return { success: false, error: `Validación de datos fallida: ${errorMsg}` };
    }

    const updateData: Prisma.PedidoUpdateInput = {
      datosInvitacion: datos as unknown as Prisma.InputJsonValue,
    };

    if (datos.fecha) {
      const parsedDate = new Date(datos.fecha);
      if (!isNaN(parsedDate.getTime())) {
        updateData.fechaEvento = parsedDate;
      }
    }

    // Save dynamic JSON & synchronize date
    const updated = await prisma.pedido.update({
      where: { id: pedidoId },
      data: updateData,
    });

    revalidatePath(`/admin/pedidos/${pedidoId}`);
    revalidatePath(`/admin/pedidos/${pedidoId}/editar`);

    return { success: true, data: updated.datosInvitacion as unknown as InvitacionData };
  } catch (error) {
    console.error('[savePedidoDatosAction] Failed to save invitation data:', error);
    return {
      success: false,
      error: 'Error al guardar los datos de la invitación',
    };
  }
}

export async function publicarInvitacionAction(
  pedidoId: string
): Promise<ActionResult<{ urlPublica: string; slug: string }>> {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: { cliente: true },
    });

    if (!pedido) {
      return { success: false, error: 'El pedido no existe' };
    }

    let slug = pedido.slug;
    if (!slug) {
      const datos = (pedido.datosInvitacion as unknown as InvitacionData) || {};
      const names = datos.nombre ?? datos.nombres ?? pedido.cliente.nombre ?? 'evento';

      let baseSlug = await slugify(names);
      const date = new Date(pedido.fechaEvento);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        baseSlug = `${baseSlug}-${year}-${month}-${day}`;
      }

      slug = baseSlug;
      let suffix = 1;

      // Colisión de slugs - busca un slug libre
      while (true) {
        const existing = await prisma.pedido.findFirst({
          where: {
            slug,
            id: { not: pedidoId },
          },
        });
        if (!existing) {
          break;
        }
        slug = `${baseSlug}-${suffix}`;
        suffix++;
      }
    }

    const host =
      process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000';
    const urlPublica = `${host}/i/${slug}`;

    const updated = await prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        slug,
        urlPublica,
        estadoInvitacion: 'PUBLICADA',
        estado: 'entregado', // publicando marca el pedido como entregado
      },
    });

    revalidatePath(`/admin/pedidos/${pedidoId}`);
    revalidatePath(`/admin/pedidos/${pedidoId}/editar`);

    return {
      success: true,
      data: {
        urlPublica: updated.urlPublica ?? urlPublica,
        slug: updated.slug ?? slug,
      },
    };
  } catch (error) {
    console.error('[publicarInvitacionAction] Failed to publish invitation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al publicar la invitación',
    };
  }
}

export async function generarQRAction(pedidoId: string): Promise<ActionResult<string>> {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
    });

    if (!pedido) {
      return { success: false, error: 'El pedido no existe' };
    }

    if (!pedido.urlPublica) {
      return { success: false, error: 'La invitación no ha sido publicada aún' };
    }

    // Generar buffer del código QR
    const qrBuffer = await generateQRBuffer(pedido.urlPublica);

    // Subir a Cloudinary
    const qrUrl = await uploadToCloudinary(qrBuffer, 'invitaciones/qr');

    // Guardar en base de datos
    await prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        qrUrl,
      },
    });

    revalidatePath(`/admin/pedidos/${pedidoId}`);
    revalidatePath(`/admin/pedidos/${pedidoId}/editar`);

    return { success: true, data: qrUrl };
  } catch (error) {
    console.error('[generarQRAction] Failed to generate QR:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al generar el código QR',
    };
  }
}

export async function uploadImageAction(formData: FormData): Promise<ActionResult<string>> {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No se proporcionó ningún archivo' };
    }

    // Validar tipo MIME (tipo de archivo)
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'El archivo debe ser una imagen válida' };
    }

    // Validar tamaño (máximo 5MB)
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      return { success: false, error: 'El archivo excede el tamaño máximo permitido (5MB)' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const url = await uploadToCloudinary(buffer, 'invitaciones/fotos');

    return { success: true, data: url };
  } catch (err) {
    console.error('[uploadImageAction] error details:', err);
    return { success: false, error: 'Error al subir la imagen' };
  }
}
