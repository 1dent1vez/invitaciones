"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ActionResult, PedidoInput } from "@/types";
import { pedidoSchema } from "./schemas";


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
      console.error("[createPedidoAction] Zod validation failed:", parsed.error.format());
      return { success: false, error: parsed.error.issues[0]?.message || "Datos no válidos" };
    }

    const client = await prisma.cliente.findUnique({
      where: { id: parsed.data.clienteId },
    });

    if (!client) {
      return { success: false, error: "El cliente seleccionado no existe" };
    }

    const eventDate = new Date(parsed.data.fechaEvento);
    if (isNaN(eventDate.getTime())) {
      console.error("[createPedidoAction] Invalid date:", parsed.data.fechaEvento);
      return { success: false, error: "La fecha del evento no es válida" };
    }

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
        precio: new Prisma.Decimal(parsed.data.precio),
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
    console.error("[createPedidoAction] Database error:", error);
    return { success: false, error: "Error al registrar el pedido. Por favor, intente nuevamente." };
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
