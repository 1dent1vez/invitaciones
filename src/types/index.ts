import { z } from "zod";
import { pedidoSchema } from "@/app/(admin)/admin/pedidos/schemas";
import { pagoSchema } from "@/app/(admin)/admin/pedidos/[id]/schemas";
import { savePedidoSchema } from "@/app/(admin)/admin/pedidos/[id]/editar/schemas";
import { clienteSchema } from "@/app/(admin)/admin/clientes/schemas";

export type TemplateType = 'boda-elegante' | 'xv-moderno' | 'baby-shower' | 'cumpleanos-fiesta';

export interface TimelineEvent {
  hora: string;
  titulo: string;
  notas?: string;
}

export interface InvitacionData {
  nombres: string;
  fecha: string;
  ubicacion: string;
  mapaUrl?: string;
  mensaje?: string;
  colorPrincipal?: string;
  colorSecundario?: string;
  portadaUrl?: string;
  fotos?: string[];
  dressCode?: string;
  regalosDatos?: string;
  musicaUrl?: string;
  timeline?: TimelineEvent[];
  nombreBebe?: string; // específico de baby shower
  padrinos?: string;
  padres?: string;
}

export type FieldType = 'text' | 'date' | 'color' | 'image' | 'textarea' | 'timeline';

export interface FieldConfig {
  key: keyof InvitacionData | string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
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

