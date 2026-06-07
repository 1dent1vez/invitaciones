import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditorClient } from "./editor-client";

export const revalidate = 0;

interface EditorPageProps {
  params: {
    id: string;
  };
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { id } = params;

  const order = await prisma.pedido.findUnique({
    where: { id },
    include: {
      cliente: true,
    },
  });

  if (!order) {
    notFound();
  }

  return <EditorClient pedido={order} />;
}
