import { prisma } from "@/lib/prisma";
import { ClientesClient } from "./clientes-client";

export const revalidate = 0; // Disable layout caching to guarantee actual DB entries are loaded

export default async function ClientesPage() {
  const clients = await prisma.cliente.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return <ClientesClient initialClientes={clients} />;
}
