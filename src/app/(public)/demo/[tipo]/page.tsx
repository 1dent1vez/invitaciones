import { notFound } from "next/navigation";
import { TemplateType, InvitacionData } from "@/types";
import { TEMPLATE_COMPONENTS } from "@/lib/templates";
import { TemplateWrapper } from "@/components/templates/TemplateWrapper";

const MOCK_DATA: Record<TemplateType, InvitacionData> = {
  "boda-elegante": {
    nombres: "María Fernanda & Juan Carlos",
    fecha: "2026-10-24T18:00:00Z",
    ubicacion: "Hacienda del Refugio, Salón Emperador, Zapopan, Jal.",
    mapaUrl: "https://maps.google.com",
    mensaje: "El amor no reclama posesión, sino que da libertad. Acompáñanos a celebrar el inicio de nuestra vida juntos.",
    colorPrincipal: "#C5A880",
    colorSecundario: "#2C3E50",
    dressCode: "Formal - Rigurosa Etiqueta",
    padres: "Sra. Amelia Ortiz & Sr. Pedro González / Sra. Sofía Mendoza & Sr. Alberto Díaz",
    padrinos: "Sra. Esthela Ruíz & Sr. Fernando López",
  },
  "xv-moderno": {
    nombres: "Valeria Monserrat",
    fecha: "2026-09-12T19:00:00Z",
    ubicacion: "Terraza del Sol, Zapopan, Jal.",
    mapaUrl: "https://maps.google.com",
    mensaje: "Hay momentos que son inolvidables, y compartirlos con las personas que más quiero los hace aún más especiales.",
    colorPrincipal: "#EC4899",
    colorSecundario: "#4C1D95",
    dressCode: "Código de Vestimenta: Elegante Casual",
    musicaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    portadaUrl: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=600&auto=format&fit=crop",
    fotos: [
      "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop"
    ]
  },
  "baby-shower": {
    nombres: "Gabriela & Alejandro",
    nombreBebe: "Emma Lucía",
    fecha: "2026-08-08T16:00:00Z",
    ubicacion: "Jardín Los Tulipanes, Zapopan, Jal.",
    mapaUrl: "https://maps.google.com",
    mensaje: "Una nueva aventura está por comenzar. Ven a celebrar con nosotros la dulce espera de nuestra bebé.",
    regalosDatos: "Mesa de regalos Liverpool: Evento #50849204\nSugerencia de pañales: Etapas 1, 2 y 3.",
    colorPrincipal: "#725C42",
    colorSecundario: "#EAE2D5"
  },
  "cumpleanos-fiesta": {
    nombres: "Mateo",
    fecha: "2026-07-25T20:00:00Z",
    ubicacion: "El Local del Tío, Tlaquepaque, Jal.",
    mapaUrl: "https://maps.google.com",
    mensaje: "Un año más para reír, bailar y agradecer. ¡No faltes a mi fiesta de cumpleaños número 30!",
    regalosDatos: "Lluvia de sobres en efectivo el día del evento.\nNúmero de cuenta: 1234 5678 9012 (Bancomer).",
    colorPrincipal: "#F59E0B",
    colorSecundario: "#10B981"
  }
};

interface DemoPageProps {
  params: {
    tipo: string;
  };
}

export default function DemoPage({ params }: DemoPageProps) {
  const tipo = params.tipo as TemplateType;
  
  if (!MOCK_DATA[tipo]) {
    notFound();
  }

  const TemplateComponent = TEMPLATE_COMPONENTS[tipo];
  const mockData = MOCK_DATA[tipo];

  return (
    <TemplateWrapper data={mockData}>
      <TemplateComponent data={mockData} />
    </TemplateWrapper>
  );
}
