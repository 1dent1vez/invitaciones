import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TemplateWrapper } from "@/components/templates/TemplateWrapper";
import { InvitacionData } from "@/types";
import { PublicRSVPForm } from "../rsvp-form";

interface PublicRSVPPageProps {
  params: {
    slug: string;
  };
}

export default async function PublicRSVPPage({ params }: PublicRSVPPageProps) {
  const { slug } = params;

  const order = await prisma.pedido.findUnique({
    where: { slug },
  });

  if (!order || !order.datosInvitacion || order.estadoInvitacion !== "PUBLICADA") {
    notFound();
  }

  const datos = order.datosInvitacion as unknown as InvitacionData;
  const nombreFestejado = datos.nombre || datos.nombres || "Festejado";

  return (
    <TemplateWrapper data={datos}>
      <div className="flex-1 flex flex-col justify-center bg-[#0B0C10] text-[#C5C6C7] py-12 px-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-sans">
            Confirma tu asistencia
          </h1>
          <p className="text-sm font-semibold text-[var(--primary)] font-mono tracking-wide">
            Festejado: {nombreFestejado}
          </p>
        </div>
        <PublicRSVPForm slug={slug} fechaLimiteRSVP={datos.fechaLimiteRSVP} />
      </div>
    </TemplateWrapper>
  );
}
