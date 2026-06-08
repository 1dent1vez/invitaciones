import { z } from "zod";
import { pedidoSchema } from "@/app/(admin)/admin/pedidos/schemas";
import { pagoSchema } from "@/app/(admin)/admin/pedidos/[id]/schemas";
import { savePedidoSchema } from "@/app/(admin)/admin/pedidos/[id]/editar/schemas";
import { clienteSchema } from "@/app/(admin)/admin/clientes/schemas";

export type TemplateType =
  | 'boda-esencial' | 'boda-completa' | 'boda-premium'
  | 'xv-esencial' | 'xv-completa' | 'xv-premium'
  | 'babyshower-esencial' | 'babyshower-completa' | 'babyshower-premium'
  | 'cumpleanos-esencial' | 'cumpleanos-completa' | 'cumpleanos-premium';

export interface TimelineEvent {
  hora: string;
  titulo: string;
  notas?: string;
}

export interface InvitacionData {
  nombres?: string;
  nombre?: string;
  edad?: number;
  fecha?: string;
  hora?: string;
  horaCeremonia?: string;
  horaRecepcion?: string;
  horaMisa?: string;
  templo?: string;
  direccionTemplo?: string;
  salon?: string;
  direccionSalon?: string;
  lugar?: string;
  direccion?: string;
  ubicacion?: string;
  mapsLink?: string;
  mapaUrl?: string;
  fotoPortada?: string;
  portadaUrl?: string;
  mensaje?: string;
  musica?: string;
  musicaUrl?: string;
  whatsapp?: string;
  colorPrimario?: string;
  colorSecundario?: string;
  fotosGaleria?: string[];
  dressCode?: string;
  dressCodeDesc?: string;
  mensajePadres?: string;
  mensajeFestejo?: string;
  itinerario?: string;
  timeline?: TimelineEvent[];
  datosRegalo?: string;
  regalosDatos?: string;
  mesaRegalos?: boolean;
  mesaRegalosDatos?: string;
  historiaConocieron?: string;
  historiaPropuesta?: string;
  historiaSignificado?: string;
  fotosExtra?: string[];
  hospedaje?: string;
  buzonDeseos?: boolean;
  pases?: boolean;
  numPases?: number;
  videoURL?: string;
  segundoIdioma?: boolean;
  nombreMama?: string;
  nombrePapa?: string;
  listaRegalos?: string;
  juegos?: string;
  historiaEmbarazo?: string;
  historiaVivencia?: string;
  nombreBebe?: string;
  padrinos?: string;
  chambelanes?: string;
  historiaPadres?: string;
  historiaAmigos?: string;
  colorAcento?: string;
  historiaEdad?: string;
  historiaSeresQueridos?: string;
  historiaRecuerdo?: string;
  tematica?: string;
  tipoBebe?: string;
  tipoCelebracion?: string;
  colorPrincipal?: string;
  padres?: string;
  fotos?: string[];
}

export type FieldType = 'text' | 'date' | 'color' | 'image' | 'textarea' | 'timeline' | 'time' | 'number' | 'tel' | 'url' | 'select' | 'boolean';

export interface FieldConfig {
  key: keyof InvitacionData | string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
  condicion?: string;
}

export interface TemplateConfig {
  id: TemplateType;
  name: string;
  fields: FieldConfig[];
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export type PedidoInput = z.infer<typeof pedidoSchema>;
export type PagoInput = z.infer<typeof pagoSchema>;
export type ClienteInput = z.infer<typeof clienteSchema>;
export type SavePedidoInput = z.infer<ReturnType<typeof savePedidoSchema>>;

