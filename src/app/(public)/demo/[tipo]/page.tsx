import { notFound } from "next/navigation";
import { TemplateType, InvitacionData } from "@/types";
import { TEMPLATE_COMPONENTS } from "@/lib/templates";
import { TemplateWrapper } from "@/components/templates/TemplateWrapper";

const MOCK_CUMPLE: InvitacionData = {
  nombre: "Santiago",
  edad: 30,
  fecha: "2026-07-25T20:00:00Z",
  hora: "20:00",
  lugar: "El Local del Tío, Tlaquepaque, Jal.",
  direccion: "Calle Libertad 456",
  tipoCelebracion: "Adultos",
  fotoPortada: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800",
  mensaje: "Un año más para reír, bailar y agradecer. ¡No faltes a mi fiesta de cumpleaños número 30!",
  regalosDatos: "Lluvia de sobres en efectivo el día del evento.\nNúmero de cuenta: 1234 5678 9012 (Bancomer).",
  colorPrimario: "#F59E0B",
  colorSecundario: "#1f2937",
  musica: "Fiesta",
  whatsapp: "5512345678",
  mapaUrl: "https://maps.google.com"
};

const MOCK_DATA: Record<TemplateType, InvitacionData> = {
  "cumpleanos-esencial": MOCK_CUMPLE,
  "cumpleanos-completa": MOCK_CUMPLE,
  "cumpleanos-premium": MOCK_CUMPLE,
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
