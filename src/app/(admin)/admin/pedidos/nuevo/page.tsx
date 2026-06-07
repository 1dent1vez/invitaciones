import { prisma } from "@/lib/prisma";
import { NuevoPedidoClient } from "./nuevo-pedido-client";

export const revalidate = 0;

export default async function NuevoPedidoPage() {
  const clients = await prisma.cliente.findMany({
    orderBy: {
      nombre: "asc",
    },
  });

  return <NuevoPedidoClient clientes={clients} />;
}
