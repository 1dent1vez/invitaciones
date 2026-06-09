import { notFound } from "next/navigation";
import { TemplateType, InvitacionData } from "@/types";
import { TEMPLATE_COMPONENTS } from "@/lib/templates";
import { TemplateWrapper } from "@/components/templates/TemplateWrapper";

const MOCK_BODA: InvitacionData = {
  nombres: "María Fernanda & Juan Carlos",
  fecha: "2026-10-24T18:00:00Z",
  ubicacion: "Hacienda del Refugio, Salón Emperador, Zapopan, Jal.",
  mapaUrl: "https://maps.google.com",
  mensaje: "El amor no reclama posesión, sino que da libertad. Acompáñanos a celebrar el inicio de nuestra vida juntos.",
  colorPrimario: "#C5A880",
  colorSecundario: "#2C3E50",
  dressCode: "Formal - Rigurosa Etiqueta",
  padres: "Sra. Amelia Ortiz & Sr. Pedro González / Sra. Sofía Mendoza & Sr. Alberto Díaz",
  padrinos: "Sra. Esthela Ruíz & Sr. Fernando López",
};

const MOCK_XV: InvitacionData = {
  nombres: "Valeria Monserrat",
  fecha: "2026-09-12T19:00:00Z",
  ubicacion: "Terraza del Sol, Zapopan, Jal.",
  mapaUrl: "https://maps.google.com",
  mensaje: "Hay momentos que son inolvidables, y compartirlos con las personas que más quiero los hace aún más especiales.",
  colorPrimario: "#EC4899",
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
};

const MOCK_BABY: InvitacionData = {
  nombreMama: "Gabriela",
  nombrePapa: "Alejandro",
  nombreBebe: "Emma Lucía",
  fecha: "2026-08-08T16:00:00Z",
  lugar: "Jardín Los Tulipanes, Zapopan, Jal.",
  direccion: "Calle Tulipanes 123",
  tipoBebe: "Niña",
  fotoPortada: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
  musica: "Dulce",
  whatsapp: "5512345678",
  colorPrimario: "#725C42",
  colorSecundario: "#EAE2D5"
};

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
  "boda-esencial": MOCK_BODA,
  "boda-completa": MOCK_BODA,
  "boda-premium": MOCK_BODA,
  "xv-esencial": MOCK_XV,
  "xv-completa": MOCK_XV,
  "xv-premium": MOCK_XV,
  "babyshower-esencial": MOCK_BABY,
  "babyshower-completa": MOCK_BABY,
  "babyshower-premium": MOCK_BABY,
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
