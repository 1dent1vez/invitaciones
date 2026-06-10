# 🧹 PURGA COMPLETA — Solo Cumpleaños Queda

> **Objetivo:** Eliminar TODO lo relacionado con Boda, XV Años y Baby Shower de la aplicación.  
> **Scope:** Frontend (UI, templates, filtros, combos), Backend (schema, API, server actions, types), y Configuración.  
> **Qué se conserva:** Solo Cumpleaños (3 paquetes: Esencial, Completa, Premium).  
> **Output:** App limpia, sin referencias a otros eventos, build pasa, tests pasan.  
> **Regla:** Eliminar archivos, no solo comentar. Limpiar imports. Actualizar tipos.

---

## 📋 CHECKLIST DE PURGA

### 1. CONFIGURACIÓN DE PAQUETES (`src/lib/paquetes.ts`)

| Acción | Estado |
|--------|--------|
| Eliminar paquetes de Boda (3) | ⬜ |
| Eliminar paquetes de XV Años (3) | ⬜ |
| Eliminar paquetes de Baby Shower (3) | ⬜ |
| Dejar solo 3 paquetes de Cumpleaños | ⬜ |
| Eliminar tipoEvento del tipo/enum si solo queda uno | ⬜ |
| Actualizar `CONFIGURACION_EVENTOS` o `PAQUETES` | ⬜ |

**Código esperado:**
```typescript
export const PAQUETES = [
  {
    id: "cumpleanos-esencial",
    nombre: "Esencial",
    precio: 350,
    implementado: true,
    secciones: ["hero", "detalles"],
    campos: [ /* ... campos esenciales ... */ ],
  },
  {
    id: "cumpleanos-completa",
    nombre: "Completa",
    precio: 550,
    implementado: true,
    secciones: ["hero", "detalles", "galeria"],
    campos: [ /* ... campos completos ... */ ],
  },
  {
    id: "cumpleanos-premium",
    nombre: "Premium",
    precio: 850,
    implementado: true,
    secciones: ["hero", "detalles", "galeria", "rsvp", "regalos", "agradecimiento", "cuentaRegresiva"],
    campos: [ /* ... campos premium ... */ ],
  },
] as const;

export type PaqueteId = typeof PAQUETES[number]["id"];
```

Si `tipoEvento` ya no tiene sentido (solo hay cumpleaños), puedes:
- Eliminarlo del tipo/enum
- O mantenerlo como constante `"cumpleanos"` para futura extensión

---

### 2. SCHEMA DE PRISMA (`prisma/schema.prisma`)

| Acción | Estado |
|--------|--------|
| Eliminar `tipoEvento` del modelo `Pedido` si no se usa | ⬜ |
| O mantenerlo con default `"cumpleaños"` si se prefiere | ⬜ |
| Verificar que no hay constraints que dependan de `tipoEvento` | ⬜ |

**Nota:** Si `tipoEvento` se usa en queries de filtrado, puedes:
- Eliminar el campo y sus índices
- O mantenerlo con `@default("cumpleanos")` para no romper queries existentes

---

### 3. TEMPLATES (`src/components/templates/`)

| Acción | Estado |
|--------|--------|
| Eliminar `BodaElegante.tsx` | ⬜ |
| Eliminar `BodaModerna.tsx` | ⬜ |
| Eliminar `BodaRustica.tsx` | ⬜ |
| Eliminar `XVElegante.tsx` | ⬜ |
| Eliminar `XVModerno.tsx` | ⬜ |
| Eliminar `XVTradicional.tsx` | ⬜ |
| Eliminar `BabyShowerClasico.tsx` | ⬜ |
| Eliminar `BabyShowerModerno.tsx` | ⬜ |
| Eliminar `BabyShowerNino.tsx` | ⬜ |
| Eliminar `Proximamente.tsx` (si ya no se necesita) | ⬜ |
| Conservar `CumpleEsencial.tsx` | ⬜ |
| Conservar `CumpleCompleta.tsx` | ⬜ |
| Conservar `CumplePremium.tsx` | ⬜ |

**Código esperado en `src/lib/templates.ts`:**
```typescript
export const TEMPLATES = {
  "cumpleanos-esencial": CumpleEsencial,
  "cumpleanos-completa": CumpleCompleta,
  "cumpleanos-premium": CumplePremium,
} as const;
```

---

### 4. TYPES (`src/types/index.ts`)

| Acción | Estado |
|--------|--------|
| Eliminar `TipoEvento` si solo queda uno | ⬜ |
| O simplificar a `export type TipoEvento = "cumpleanos"` | ⬜ |
| Eliminar interfaces específicas de Boda/XV/BabyShower | ⬜ |
| Simplificar `InvitacionData` a solo campos de cumpleaños | ⬜ |

**Código esperado:**
```typescript
export interface InvitacionData {
  nombre: string;
  edad?: string;
  fechaEvento?: string;
  horaEvento?: string;
  lugar?: string;
  direccion?: string;
  fotoPortada?: string;
  tipoCelebracion?: "infantil" | "juvenil" | "adulto" | "general" | "sorpresa";
  mensajeFestejo?: string;
  mensajeBienvenida?: string;
  itinerario?: Array<{hora: string; actividad: string}>;
  datosRegalo?: string;
  fotosGaleria?: string[];
  fotos?: string[]; // backward compat
  colorPrimario?: string;
  colorSecundario?: string;
  musicaFondo?: string;
  fechaLimiteRSVP?: string;
  mensajeAgradecimiento?: string;
  codigoVestimenta?: "casual" | "formal" | "tematica" | "elegante";
  linkRegalos?: string;
  mapaPersonalizado?: boolean;
  confettiAnimacion?: boolean;
  cuentaRegresiva?: boolean;
  whatsapp?: string;
  // Campos legacy de boda (mantener para backward compat de datos existentes)
  nombres?: string; // legacy
  portadaUrl?: string; // legacy
  ubicacion?: string; // legacy
}
```

---

### 5. WIZARD (`src/app/(admin)/admin/pedidos/nuevo/`)

| Acción | Estado |
|--------|--------|
| Eliminar select de "Tipo de Evento" | ⬜ |
| O dejarlo como label fijo "Cumpleaños" | ⬜ |
| Eliminar lógica de "Próximamente" | ⬜ |
| Simplificar a: seleccionar paquete (3 opciones) | ⬜ |
| Eliminar validación de `tipoEvento` en Zod | ⬜ |

**Código esperado:**
```typescript
// ANTES: Select tipoEvento + select paquete
// DESPUÉS: Solo select paquete (3 opciones)

const schema = z.object({
  paquete: z.enum(["cumpleanos-esencial", "cumpleanos-completa", "cumpleanos-premium"]),
  // ... datos del cliente ...
});
```

---

### 6. EDITOR (`src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx`)

| Acción | Estado |
|--------|--------|
| Eliminar lógica condicional por tipoEvento | ⬜ |
| Simplificar: siempre cargar campos de cumpleaños | ⬜ |
| Eliminar `defaultValues` para campos de boda (si no hay pedidos boda) | ⬜ |
| O mantenerlos vacíos para backward compat | ⬜ |

---

### 7. KANBAN / LISTA DE PEDIDOS (`src/app/(admin)/admin/pedidos/pedidos-client.tsx`)

| Acción | Estado |
|--------|--------|
| Eliminar filtro por "Tipo de Evento" | ⬜ |
| Eliminar badge de tipoEvento (o simplificar) | ⬜ |
| Eliminar búsqueda por campos de boda/XV | ⬜ |
| Simplificar búsqueda: cliente, nombre festejado, slug | ⬜ |

---

### 8. OG TAGS / META TAGS (`src/app/(public)/i/[slug]/page.tsx`)

| Acción | Estado |
|--------|--------|
| Eliminar switch/case por tipoEvento | ⬜ |
| Simplificar: solo lógica de cumpleaños | ⬜ |
| Eliminar defaults de boda/XV/babyshower | ⬜ |

**Código esperado:**
```typescript
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const order = await prisma.pedido.findUnique({ where: { slug } });

  if (!order || order.estadoInvitacion !== "PUBLICADA") {
    return { title: "Invitación no encontrada" };
  }

  const datos = (order.datosInvitacion ?? {}) as InvitacionData;
  const nombre = datos.nombre ?? "alguien especial";

  return {
    title: `¡Fiesta de cumpleaños de ${nombre}! 🎂`,
    description: datos.mensajeFestejo ?? datos.mensajeBienvenida ?? `Acompáñanos a celebrar`,
    openGraph: {
      images: [datos.fotoPortada ?? datos.portadaUrl ?? "/default-cumpleanos-og.jpg"],
    },
  };
}
```

---

### 9. NOTIFICACIONES WA (`src/lib/notificaciones.ts`)

| Acción | Estado |
|--------|--------|
| Simplificar mensaje a solo cumpleaños | ⬜ |
| Eliminar condicionales por tipoEvento | ⬜ |

---

### 10. CLONADOR (`src/app/(admin)/admin/pedidos/[id]/actions.ts`)

| Acción | Estado |
|--------|--------|
| Simplificar limpieza de datos a solo campos de cumpleaños | ⬜ |
| Eliminar lógica condicional por tipoEvento | ⬜ |

---

### 11. SERVER ACTIONS (`src/app/(admin)/admin/pedidos/actions.ts`)

| Acción | Estado |
|--------|--------|
| Simplificar `crearPedidoAction` — no recibe tipoEvento | ⬜ |
| O recibe tipoEvento con default `"cumpleanos"` | ⬜ |
| Eliminar validación de tipoEvento en Zod | ⬜ |

---

### 12. LANDING PAGE (`src/app/(public)/`)

| Acción | Estado |
|--------|--------|
| Eliminar sección de galería de Boda/XV/BabyShower | ⬜ |
| Eliminar precios de Boda/XV/BabyShower | ⬜ |
| Dejar solo precios de Cumpleaños | ⬜ |
| Eliminar testimonios de bodas/XV | ⬜ |

---

### 13. TESTS

| Acción | Estado |
|--------|--------|
| Eliminar tests de templates de boda/XV/babyshower | ⬜ |
| Eliminar tests de flujo de boda/XV/babyshower | ⬜ |
| Simplificar tests E2E a solo cumpleaños | ⬜ |
| Actualizar mocks de datos | ⬜ |

---

### 14. ARCHIVOS HUÉRFANOS

| Acción | Estado |
|--------|--------|
| Eliminar imágenes de templates no usados | ⬜ |
| Eliminar fuentes tipográficas no usadas | ⬜ |
| Eliminar CSS/modules de templates no usados | ⬜ |
| Eliminar assets de boda/XV/babyshower | ⬜ |

---

## 🛠️ METODOLOGÍA DE PURGA

### Paso 1: Buscar todas las referencias

```bash
# Buscar en todo el codebase
grep -r "boda" src/ --include="*.ts" --include="*.tsx" --include="*.css" --include="*.json"
grep -r "xv" src/ --include="*.ts" --include="*.tsx" --include="*.css" --include="*.json"
grep -r "babyshower\|baby.shower" src/ --include="*.ts" --include="*.tsx" --include="*.css" --include="*.json"
grep -r "Boda\|XV\|BabyShower" src/ --include="*.ts" --include="*.tsx"
grep -r "tipoEvento" src/ --include="*.ts" --include="*.tsx"
```

### Paso 2: Eliminar archivos no usados

```bash
# Templates de boda
rm src/components/templates/boda/BodaElegante.tsx
rm src/components/templates/boda/BodaModerna.tsx
rm src/components/templates/boda/BodaRustica.tsx

# Templates de XV
rm src/components/templates/xv/XVElegante.tsx
rm src/components/templates/xv/XVModerno.tsx
rm src/components/templates/xv/XVTradicional.tsx

# Templates de baby shower
rm src/components/templates/babyshower/BabyShowerClasico.tsx
rm src/components/templates/babyshower/BabyShowerModerno.tsx
rm src/components/templates/babyshower/BabyShowerNino.tsx

# Proximamente si ya no se necesita
rm src/components/templates/Proximamente.tsx
```

### Paso 3: Limpiar imports y referencias

Por cada archivo eliminado, busca quién lo importaba y elimina el import.

### Paso 4: Simplificar tipos y config

### Paso 5: Verificar build y tests

```bash
npm run build
npx vitest run --sequence.concurrent false --no-file-parallelism
```

---

## 📝 COMMIT

```bash
git add .
git commit -m "refactor(purge): eliminar boda, xv, babyshower. Solo queda cumpleaños (3 paquetes)"
```

---

## ⚠️ REGLAS DE ORO DE ESTA PURGA

1. **NO elimines datos de clientes existentes.** Si hay pedidos de boda en la DB, no los borres. Solo limpia la UI.
2. **Mantén backward compat en `InvitacionData`.** Los campos `nombres`, `portadaUrl`, `ubicacion` pueden existir en datos antiguos. No los elimines del tipo, solo no los uses en UI nueva.
3. **NO añadas features nuevas.** Solo elimina.
4. **Si un archivo se importa en muchos lugares**, elimina el archivo primero, luego arregla los imports rotos uno por uno.
5. **Verifica build después de cada grupo de cambios.** No esperes al final.
