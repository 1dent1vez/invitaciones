"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const pedidoSchema = z.object({
  clienteId: z.string().min(1, "El cliente es requerido"),
  tipoEvento: z.enum(["boda", "xv", "baby_shower", "cumpleanos"], {
    message: "El tipo de evento no es válido",
  }),
  fechaEvento: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "La fecha del evento no es válida",
  }),
  template: z.enum(["boda-elegante", "xv-moderno", "baby-shower", "cumpleanos-fiesta"], {
    message: "La plantilla no es válida",
  }),
  precio: z.preprocess((val) => Number(val), z.number().min(0, "El precio debe ser un número positivo")),
  notas: z.string().optional().nullable(),
});

export type PedidoInput = z.infer<typeof pedidoSchema>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, "") // remove special characters
    .trim()
    .replace(/\s+/g, "-") // replace spaces with dashes
    .replace(/-+/g, "-"); // collapse multiple dashes
}

async function getUniqueSlug(clientName: string, eventDate: Date): Promise<string> {
  const year = eventDate.getFullYear();
  const baseSlug = `${slugify(clientName)}-${year}`;
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.pedido.findUnique({
      where: { slug },
    });
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function createPedidoAction(input: PedidoInput): Promise<ActionResult<{ id: string }>> {
  try {
    const parsed = pedidoSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Datos no válidos" };
    }

    const client = await prisma.cliente.findUnique({
      where: { id: parsed.data.clienteId },
    });

    if (!client) {
      return { success: false, error: "El cliente seleccionado no existe" };
    }

    const eventDate = new Date(parsed.data.fechaEvento);
    const slug = await getUniqueSlug(client.nombre, eventDate);

    // Initial default variables for the invitation template
    const defaultDatosJson = {
      nombres: client.nombre,
      fecha: parsed.data.fechaEvento,
      ubicacion: "",
      colores: {
        primary: "#8B5CF6",
        secondary: "#EC4899",
      },
      fotos: [],
      mensaje: "¡Estás invitado a nuestro evento especial!",
    };

    const pedido = await prisma.pedido.create({
      data: {
        clienteId: parsed.data.clienteId,
        tipoEvento: parsed.data.tipoEvento,
        fechaEvento: eventDate,
        template: parsed.data.template,
        precio: parsed.data.precio,
        notas: parsed.data.notas || null,
        estado: "cotizado",
        slug,
        urlPublica: `http://localhost:3000/i/${slug}`,
        datosJson: defaultDatosJson,
      },
    });

    revalidatePath("/admin/pedidos");
    return { success: true, data: { id: pedido.id } };
  } catch (error) {
    console.error("[createPedidoAction]", error);
    return { success: false, error: "Error al registrar el pedido" };
  }
}

export async function updatePedidoEstadoAction(
  id: string,
  nuevoEstado: string
): Promise<ActionResult<void>> {
  try {
    if (!id) return { success: false, error: "ID del pedido es requerido" };

    const validStates = ["cotizado", "pagado", "en_produccion", "entregado", "completado"];
    if (!validStates.includes(nuevoEstado)) {
      return { success: false, error: "Estado no válido" };
    }

    await prisma.pedido.update({
      where: { id },
      data: { estado: nuevoEstado },
    });

    revalidatePath("/admin/pedidos");
    revalidatePath(`/admin/pedidos/${id}`);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("[updatePedidoEstadoAction]", error);
    return { success: false, error: "Error al actualizar el estado del pedido" };
  }
}
