import { notFound } from "next/navigation";
import { Metadata } from "next";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { TEMPLATE_COMPONENTS } from "@/lib/templates";
import { TemplateWrapper } from "@/components/templates/TemplateWrapper";
import { TemplateType, InvitacionData } from "@/types";
import { PublicRSVPForm } from "./rsvp-form";
import { registrarVisitaAction } from "./actions";

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

    if (!order || !order.datosInvitacion || order.estadoInvitacion !== "PUBLICADA") {
      return {
        title: "Invitación Digital",
      };
    }

    const datos = order.datosInvitacion as unknown as InvitacionData;
    const title = datos.nombre || datos.nombres || "Mi Cumpleaños";
    
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

    const description = `Te invitamos a celebrar mi Cumpleaños el día ${dateText}. Haz clic para ver los detalles del evento y confirmar tu asistencia.`;
    const ogImage = datos.fotoPortada || datos.portadaUrl || (datos.fotos && datos.fotos[0]) || "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop";

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

  if (!order || !order.datosInvitacion || order.estadoInvitacion !== "PUBLICADA") {
    notFound();
  }

  // Registrar visita asíncronamente (fire-and-forget)
  let ip: string | null = null;
  let userAgent: string | null = null;
  try {
    const headersList = headers();
    ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip");
    userAgent = headersList.get("user-agent");
  } catch {
    // Graceful fallback for non-request scope contexts (like Vitest)
  }

  registrarVisitaAction(slug, ip, userAgent).catch((err) => {
    console.error("Error al registrar la visita en analytics:", err);
  });

  const templateType = order.template as TemplateType;
  const TemplateComponent = TEMPLATE_COMPONENTS[templateType];
  const datos = order.datosInvitacion as unknown as InvitacionData;

  return (
    <TemplateWrapper data={datos}>
      <TemplateComponent data={datos} />
      <PublicRSVPForm slug={slug} fechaLimiteRSVP={datos.fechaLimiteRSVP} />
    </TemplateWrapper>
  );
}
