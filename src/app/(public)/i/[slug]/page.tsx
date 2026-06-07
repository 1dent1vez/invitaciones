import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { TEMPLATE_COMPONENTS } from "@/lib/templates";
import { TemplateWrapper } from "@/components/templates/TemplateWrapper";
import { TemplateType, InvitacionData } from "@/types";
import { PublicRSVPForm } from "./rsvp-form";

export const revalidate = 0;

interface PublicInvitationPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PublicInvitationPageProps): Promise<Metadata> {
  const { slug } = params;

  try {
    const order = await prisma.pedido.findUnique({
      where: { slug },
    });

    if (!order || !order.datosJson) {
      return {
        title: "Invitación Digital",
      };
    }

    const datos = order.datosJson as unknown as InvitacionData;
    const title = datos.nombres || "Invitación Especial";
    
    let dateText = "";
    try {
      const d = new Date(datos.fecha || order.fechaEvento);
      if (!isNaN(d.getTime())) {
        dateText = d.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    } catch {
      // fallback
    }

    const eventName = order.tipoEvento === "boda" ? "nuestra Boda" : order.tipoEvento === "xv" ? "mis XV Años" : order.tipoEvento === "baby_shower" ? "nuestro Baby Shower" : "mi Cumpleaños";
    const description = `Te invitamos a celebrar ${eventName} el día ${dateText}. Haz clic para ver los detalles del evento y confirmar tu asistencia.`;
    const ogImage = datos.portadaUrl || (datos.fotos && datos.fotos[0]) || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop";

    return {
      title: `${title} | Invitación Digital`,
      description,
      openGraph: {
        title: `${title} | Invitación Digital`,
        description,
        images: [
          {
            url: ogImage,
            width: 800,
            height: 600,
            alt: title,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Invitación Digital`,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: "Invitación Digital",
    };
  }
}

export default async function PublicInvitationPage({ params }: PublicInvitationPageProps) {
  const { slug } = params;

  const order = await prisma.pedido.findUnique({
    where: { slug },
  });

  if (!order || !order.datosJson) {
    notFound();
  }

  const templateType = order.template as TemplateType;
  const TemplateComponent = TEMPLATE_COMPONENTS[templateType];
  const datos = order.datosJson as unknown as InvitacionData;

  return (
    <TemplateWrapper data={datos}>
      <TemplateComponent data={datos} />
      <PublicRSVPForm slug={slug} />
    </TemplateWrapper>
  );
}
