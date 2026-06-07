import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PedidoDetalleClient } from "./pedido-detalle-client";

export const revalidate = 0;

interface PedidoDetallePageProps {
  params: {
    id: string;
  };
}

export default async function PedidoDetallePage({ params }: PedidoDetallePageProps) {
  const { id } = params;

  const order = await prisma.pedido.findUnique({
    where: { id },
    include: {
      cliente: true,
      pagos: {
        orderBy: {
          fecha: "desc",
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return <PedidoDetalleClient pedido={order} />;
}
