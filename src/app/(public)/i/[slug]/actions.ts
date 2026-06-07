"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

const rsvpSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  asiste: z.boolean({
    required_error: "Debe indicar si asistirá",
  }),
  pax: z.preprocess((val) => Number(val), z.number().int().min(1, "El número de personas (pax) debe ser al menos 1")),
  telefono: z.string().optional().nullable().or(z.literal("")),
  mensaje: z.string().optional().nullable().or(z.literal("")),
});

export type RSVPInput = z.infer<typeof rsvpSchema>;

export async function createRSVPAction(
  slug: string,
  input: RSVPInput
): Promise<ActionResult> {
  try {
    if (!slug) {
      return { success: false, error: "El slug de la invitación es requerido" };
    }

    const parsed = rsvpSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Datos del RSVP no válidos" };
    }

    const pedido = await prisma.pedido.findUnique({
      where: { slug },
    });

    if (!pedido) {
      return { success: false, error: "La invitación no existe o no es válida" };
    }

    const { nombre, asiste, pax, telefono, mensaje } = parsed.data;

    // Si no asiste, forzamos pax a 0 en la base de datos o lo guardamos como viene (usualmente 1 si asiste, pero 0 si no asiste, para cálculos de totales correctos).
    // El prompt indica "pax >= 1" para validación pero usualmente si no asiste, su pax no debería sumar al total. Vamos a guardar pax según la asiste.
    const finalPax = asiste ? pax : 0;

    await prisma.rSVP.create({
      data: {
        pedidoId: pedido.id,
        nombre,
        asiste,
        pax: finalPax,
        telefono: telefono || null,
        mensaje: mensaje || null,
      },
    });

    revalidatePath(`/i/${slug}`);
    revalidatePath(`/admin/pedidos/${pedido.id}`);

    return { success: true };
  } catch (error) {
    console.error("[createRSVPAction]", error);
    return { success: false, error: "Ocurrió un error inesperado al registrar tu confirmación" };
  }
}
