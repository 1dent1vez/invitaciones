import { z } from 'zod';
import { pedidoSchema } from '@/app/(admin)/admin/pedidos/schemas';
import { pagoSchema } from '@/app/(admin)/admin/pedidos/[id]/schemas';
import { savePedidoSchema } from '@/app/(admin)/admin/pedidos/[id]/editar/schemas';
import { clienteSchema } from '@/app/(admin)/admin/clientes/schemas';

export type TemplateType = 'cumpleanos-esencial' | 'cumpleanos-completa' | 'cumpleanos-premium';

export interface TimelineEvent {
  hora: string;
  titulo: string;
  notas?: string;
}

export interface InvitacionEsencialData {
  nombres?: string;
  nombre?: string;
  edad?: number;
  fecha?: string;
  hora?: string;
  lugar?: string;
  direccion?: string;
  ubicacion?: string;
  mapsLink?: string;
  mapaUrl?: string;
  fotoPortada?: string;
  portadaUrl?: string;
  mensaje?: string;
  whatsapp?: string;
  colorPrimario?: string;
  colorSecundario?: string;
  tipoCelebracion?: string;
}

export interface InvitacionCompletaData extends InvitacionEsencialData {
  fotosGaleria?: string[];
  galeriaFotos?: string[]; // Alias
  dressCode?: string;
  dressCodeDesc?: string;
  dressCodeDescripcion?: string; // Alias
  mensajeFestejo?: string;
  mensajeFestejado?: string; // Alias
  itinerario?: string;
  datosRegalo?: string;
  mesaRegalos?: boolean;
  tieneMesaRegalos?: boolean; // Alias
  mesaRegalosDatos?: string;
}

export interface InvitacionData extends InvitacionCompletaData {
  horaCeremonia?: string;
  horaRecepcion?: string;
  horaMisa?: string;
  templo?: string;
  direccionTemplo?: string;
  salon?: string;
  direccionSalon?: string;
  musica?: string;
  musicaUrl?: string;
  mensajePadres?: string;
  timeline?: TimelineEvent[];
  regalosDatos?: string;
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
  colorPrincipal?: string;
  padres?: string;
  fotos?: string[];
  fechaLimiteRSVP?: string;
  mensajeAgradecimiento?: string;
  confettiAnimacion?: boolean;
  cuentaRegresiva?: boolean;
}

export type FieldType =
  | 'text'
  | 'date'
  | 'color'
  | 'image'
  | 'textarea'
  | 'timeline'
  | 'time'
  | 'number'
  | 'tel'
  | 'url'
  | 'select'
  | 'boolean'
  | 'gallery';

export interface FieldConfig {
  key: keyof InvitacionData | string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
  condicion?: string;
  maxItems?: number;
  maxLength?: number;
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
