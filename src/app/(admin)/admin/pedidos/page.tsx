import { prisma } from "@/lib/prisma";
import { PedidosClient } from "./pedidos-client";

export const revalidate = 0;

export default async function PedidosPage() {
  const orders = await prisma.pedido.findMany({
    include: {
      cliente: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <PedidosClient initialPedidos={orders} />;
}
