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
