# 🎨 Guía de Desarrollo de Templates — Invitaciones Digitales

Esta guía detalla la arquitectura de las plantillas visuales ubicadas en `src/components/templates/` y explica cómo extender el sistema creando un nuevo template o adaptando la lógica compartida.

---

## 🏗️ Arquitectura de Plantillas

Las invitaciones se dividen en carpetas por categoría de evento (ej. `cumpleanos/`). Cada categoría cuenta con sus templates específicos y una carpeta `shared/` para evitar duplicar código común:

```
src/components/templates/cumpleanos/
├── CumpleEsencial.tsx      # Componente del paquete Esencial
├── CumpleCompleta.tsx      # Componente del paquete Completa
├── CumplePremium.tsx       # Componente del paquete Premium
└── shared/                 # Recursos y componentes compartidos
    ├── ConfettiAmbient.tsx # Animación de partículas canvas-confetti
    ├── HeroPortada.tsx     # Cabecera visual responsiva
    ├── MapsLink.tsx        # Integración con Google Maps
    ├── RSVPForm.tsx        # Formulario de asistencia interactivo
    ├── RSVPWrapper.tsx     # Contenedor seguro para RSVP
    ├── useCountdown.ts     # Hook contador regresivo
    └── utils.ts            # Utilidades de optimización de Cloudinary y fechas
```

---

## 📝 Props Requeridas y Tipado Estricto

Cualquier template de invitación debe exportarse como un componente de React válido y consumir exclusivamente el tipo `InvitacionData` definido en `src/types/index.ts`.

### Estructura de la Interfaz del Template
```typescript
import React from 'react';
import { InvitacionData } from '@/types';

interface MiNuevoTemplateProps {
  data: InvitacionData;
  fechaEvento?: Date; // Opcional (para inyectar mock-dates en tests)
  direccion?: string;  // Opcional (para sobreescribir direcciones físicas)
}

export function MiNuevoTemplate({ data, fechaEvento, direccion }: MiNuevoTemplateProps) {
  // Implementación del componente
}
```

---

## 🎨 Convenciones de Estilo y Colores Dinámicos

Para mantener consistencia estética y permitir que los clientes elijan sus propios esquemas de color, se aplican las siguientes reglas de diseño:

1. **Inyección de Variables CSS**: El color primario, secundario y los acentos seleccionados por el cliente en el cuestionario se inyectan como variables inline en el nodo contenedor de la invitación:
   ```typescript
   const primaryColor = data.colorPrimario ?? '#f59e0b';
   const secondaryColor = data.colorSecundario ?? '#1f2937';
   
   const themeStyles = {
     '--primary': primaryColor,
     '--secondary': secondaryColor,
   } as React.CSSProperties;
   
   return <div style={themeStyles} className="bg-[#FEF7F0] text-gray-800 pb-16 ..."> ... </div>;
   ```

2. **Consumo con Tailwind**: En lugar de utilizar colores fijos (como `bg-amber-500`), se consumen las variables de CSS en línea mediante las utilidades arbitrarias de Tailwind CSS:
   - Fondo con opacidad sutil: `bg-[var(--primary)]/10`
   - Color de texto: `text-[var(--primary)]`
   - Bordes interactivos: `border-[var(--primary)]/20`
   - Fondo de botones: `bg-[var(--primary)] hover:bg-[var(--primary)]/90`

---

## 🔄 Cómo Crear un Nuevo Template Paso a Paso

Supongamos que deseas añadir un nuevo paquete o tipo de evento (ej. `cumpleanos-ultra`). Sigue esta secuencia técnica:

### Paso 1: Definir los Campos en `src/lib/paquetes.ts`
Agrega la configuración del paquete, definiendo el precio, las secciones que renderiza y el listado de campos del cuestionario con sus respectivas validaciones:

```typescript
// En src/lib/paquetes.ts
export const CONFIGURACION_EVENTOS = {
  cumpleanos: {
    // ... esencial, completa, premium
    ultra: {
      precio: 1200,
      implementado: true,
      tipoEvento: 'cumpleanos',
      secciones: ['portada', 'ubicacion', 'rsvp', 'galeria', 'vip'],
      campos: [
        { id: 'nombre', tipo: 'text', label: 'Nombre', required: true },
        // Otros campos específicos de este paquete
      ]
    }
  }
};
```

### Paso 2: Agregar el Tipo en `src/types/index.ts`
Registra el nuevo identificador del template en la unión de tipos:
```typescript
// En src/types/index.ts
export type TemplateType = 
  | 'cumpleanos-esencial' 
  | 'cumpleanos-completa' 
  | 'cumpleanos-premium'
  | 'cumpleanos-ultra'; // <-- Añadido
```

### Paso 3: Crear el Componente Visual
Crea el archivo en `src/components/templates/cumpleanos/CumpleUltra.tsx` consumiendo los componentes compartidos de `shared/`:

```typescript
'use client';
import React from 'react';
import { InvitacionData } from '@/types';
import { HeroPortada } from './shared/HeroPortada';
import { RSVPWrapper } from './shared/RSVPWrapper';

export function CumpleUltra({ data }: { data: InvitacionData }) {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <HeroPortada data={data} fotoPortada={data.fotoPortada ?? ''} nombreFestejado={data.nombre ?? ''} edadFestejado={data.edad ?? ''} dateText={data.fecha ?? ''} />
      <div className="px-6 py-10">
        {/* Contenido Ultra exclusivo */}
        <RSVPWrapper whatsapp={data.whatsapp} />
      </div>
    </div>
  );
}
```

### Paso 4: Registrar el Componente en el Gestor de Templates
Asocia el identificador del string con el componente importado en `src/lib/templates.ts`:

```typescript
// En src/lib/templates.ts
import { CumpleUltra } from '@/components/templates/cumpleanos/CumpleUltra';

export const TEMPLATE_COMPONENTS: Record<
  TemplateType,
  React.ComponentType<{ data: InvitacionData }>
> = {
  'cumpleanos-esencial': CumpleEsencial,
  'cumpleanos-completa': CumpleCompleta,
  'cumpleanos-premium': CumplePremium,
  'cumpleanos-ultra': CumpleUltra, // <-- Registrado
};
```

Con estos pasos, el visor dinámico `/i/[slug]` podrá renderizar el nuevo template automáticamente cuando un pedido esté configurado con `template: "cumpleanos-ultra"`.
