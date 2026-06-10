"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ActionResult, PagoInput } from "@/types";
import { pagoSchema } from "./schemas";


export async function registrarPagoAction(
  pedidoId: string,
  input: PagoInput
): Promise<ActionResult<void>> {
  try {
    if (!pedidoId) return { success: false, error: "El ID del pedido es requerido" };

    const parsed = pagoSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Datos no válidos" };
    }

    // Check if order exists
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
    });
    if (!pedido) {
      return { success: false, error: "El pedido no existe" };
    }

    // Check balance
    const payments = await prisma.pago.findMany({
      where: { pedidoId },
    });
    const paidSum = payments.reduce((sum, p) => sum + Number(p.monto), 0);
    const balance = Number(pedido.precio) - paidSum;

    if (parsed.data.monto > balance) {
      return { success: false, error: `El pago excede el saldo pendiente (${balance} MXN)` };
    }

    await prisma.$transaction(async (tx) => {
      await tx.pago.create({
        data: {
          pedidoId,
          monto: parsed.data.monto,
          metodo: parsed.data.metodo,
          comprobante: parsed.data.comprobante || null,
          notas: parsed.data.notas || null,
        },
      });

      // If fully paid, optionally transition state to pagado (only if it's currently cotizado)
      if (parsed.data.monto === balance && pedido.estado === "cotizado") {
        await tx.pedido.update({
          where: { id: pedidoId },
          data: { estado: "pagado" },
        });
      }
    });

    revalidatePath(`/admin/pedidos/${pedidoId}`);
    revalidatePath("/admin/pedidos");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("[registrarPagoAction]", error);
    return { success: false, error: "Error al registrar el pago" };
  }
}

import { RSVP } from "@prisma/client";
import { redirect } from "next/navigation";

export async function getRSVPsByPedidoAction(
  pedidoId: string
): Promise<ActionResult<RSVP[]>> {
  try {
    if (!pedidoId) return { success: false, error: "El ID del pedido es requerido" };

    const rsvps = await prisma.rSVP.findMany({
      where: { pedidoId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: rsvps };
  } catch (error) {
    console.error("[getRSVPsByPedidoAction]", error);
    return { success: false, error: "Error al obtener las confirmaciones" };
  }
}

export async function clonarPedidoAction(
  pedidoId: string
): Promise<ActionResult<string>> {
  let newId = "";
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
    });
    if (!pedido) {
      return { success: false, error: "El pedido a clonar no existe" };
    }

    const oldDatos = (pedido.datosInvitacion as Record<string, unknown>) || {};
    const newDatos = {
      ...oldDatos,
      nombre: "",
      nombres: "",
      edad: "",
      tipoCelebracion: "",
      fecha: "",
      hora: "",
      lugar: "",
      direccion: "",
      mapaUrl: "",
      whatsapp: "",
      musicaUrl: "",
      fotoPortada: "",
      portadaUrl: "",
      fotos: [],
      fotosGaleria: [],
      mensaje: "",
      dressCode: "",
      dressCodeDesc: "",
      mensajeFestejo: "",
      itinerario: "",
      datosRegalo: "",
      mesaRegalos: false,
      mesaRegalosDatos: "",
      // Birthday specific
      historiaEdad: "",
      historiaSeresQueridos: "",
      historiaRecuerdo: "",
      tematica: "",
      colorAcento: "",
      fotosExtra: [],
      buzonDeseos: false,
      pases: false,
      numPases: "",
      videoURL: "",
      fechaLimiteRSVP: "",
      mensajeAgradecimiento: "",
    };

    const newPedido = await prisma.pedido.create({
      data: {
        clienteId: pedido.clienteId,
        tipoEvento: pedido.tipoEvento,
        fechaEvento: new Date(),
        template: pedido.template,
        precio: pedido.precio,
        estado: "cotizado",
        notas: pedido.notas,
        slug: null,
        urlPublica: null,
        qrUrl: null,
        datosInvitacion: newDatos as unknown as Prisma.InputJsonValue,
      },
    });
    newId = newPedido.id;
  } catch (error) {
    console.error("[clonarPedidoAction]", error);
    return { success: false, error: "Error al clonar el pedido" };
  }

  redirect(`/admin/pedidos/${newId}/editar`);
}
