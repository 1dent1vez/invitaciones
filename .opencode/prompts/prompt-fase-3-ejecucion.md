# 🎯 PROMPT EJECUCIÓN — FASE 3: POLISH + TESTS + MULTI-UPLOAD + MEDIOS

> **Contexto:** Fases 1 y 2 completadas. Build pasa, tests pasan, OG tags funcionan, template Premium tiene confetti/RSVP/agradecimiento.
> **Objetivo:** Implementar multi-upload de galería (pendiente de Fase 2), auto-guardado, tests E2E actualizados, limpieza de paquetes no implementados, y todos los hallazgos medios/bajos restantes.
> **Output:** Código corregido + tests + commit.

---

## 📁 ARCHIVOS DE CONTEXTO OBLIGATORIOS

Lee estos archivos ANTES de tocar código:

1. `@prisma/schema.prisma` — Modelo `Pedido` con `estadoInvitacion`, `datosInvitacion`
2. `@src/lib/paquetes.ts` — Config de 12 paquetes (3 cumpleaños implementados, 9 próximamente)
3. `@src/lib/templates.ts` — Mapeo de tipos de campo
4. `@src/types/index.ts` — Tipos TypeScript
5. `@src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx` — Editor principal
6. `@src/app/(admin)/admin/pedidos/[id]/editar/actions.ts` — Actions del editor
7. `@src/app/(admin)/admin/pedidos/nuevo/nuevo-pedido-client.tsx` — Wizard
8. `@src/app/(admin)/admin/pedidos/pedidos-client.tsx` — Kanban/lista de pedidos
9. `@src/app/(admin)/admin/pedidos/[id]/rsvp-table.tsx` — Tabla y export CSV de RSVP
10. `@src/lib/notificaciones.ts` — Generador de mensajes WA
11. `@src/components/templates/cumpleanos/CumpleEsencial.tsx` — Template Esencial
12. `@src/components/templates/cumpleanos/CumpleCompleta.tsx` — Template Completa
13. `@tests/e2e/flujo-completo.spec.ts` — Tests E2E de Playwright (probablemente obsoletos)
14. `@vitest.config.ts` — Config de Vitest

---

## 🧱 ESTADO ACTUAL (POST-FASE 2)

- ✅ Build pasa sin errores
- ✅ 45+ tests unitarios pasan
- ✅ Template Premium tiene confetti, RSVP con fecha límite, mensaje agradecimiento
- ✅ OG tags y meta tags dinámicos por tipo de evento
- ✅ `estadoInvitacion` y `datosInvitacion` estables en schema
- ❌ **Multi-upload de galería NO implementado** (ID-05 pendiente — hallazgo bloqueante)
- ❌ Auto-guardado cada 30s no existe (ID-06)
- ❌ Tests E2E de Playwright obsoletos (ID-09)
- ❌ Paquetes no implementados tienen campos poblados (ID-11)
- ❌ Templates Esencial/Completa no usan `tipoCelebracion` ni `whatsapp` (ID-13)
- ❌ Editor sin skeleton loaders (ID-15)
- ❌ Preview sin toggle mobile/desktop (ID-17)
- ❌ Wizard sin validación estricta de teléfono (ID-18)
- ❌ WA notificaciones incompletas (ID-19)
- ❌ Badge crudo en kanban (ID-20)
- ❌ Búsqueda kanban no incluye festejado (ID-21)
- ❌ Clonador no limpia datos de cumpleaños (ID-22)
- ❌ CSV RSVP sin metadatos (ID-23)
- ❌ Warnings ESLint/React (ID-25)
- ❌ Preview sin watermark de borrador (ID-26)

---

## ✅ TAREAS A EJECUTAR (en orden de prioridad)

---

### TAREA 0: Multi-upload de galería (ID-05 — PENDIENTE DE FASE 2)

**⚠️ PRIORIDAD MÁXIMA.** Este es un hallazgo bloqueante que no se reportó en Fase 2.

**Archivos:**
- `src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx`
- `src/lib/paquetes.ts`
- Nuevo: `src/components/ui/multi-image-uploader.tsx`

**Problema:** El campo `fotosGaleria` se renderiza como un campo `image` simple (una sola foto). Los paquetes Completa (máx 3) y Premium (máx 6) requieren múltiples fotos con posibilidad de eliminar y reordenar.

**Solución requerida:**

#### 0A. Actualizar config de paquetes

En `src/lib/paquetes.ts`, para los campos de galería:

```typescript
// Paquete Completa
{ id: "fotosGaleria", tipo: "gallery", label: "Galería de fotos", maxItems: 3, required: false },

// Paquete Premium
{ id: "fotosGaleria", tipo: "gallery", label: "Galería de fotos", maxItems: 6, required: false },
```

#### 0B. Crear componente `MultiImageUploader`

Crear `src/components/ui/multi-image-uploader.tsx`:

```typescript
"use client";

import { useState, useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { X, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MultiImageUploaderProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages: number;
}

export function MultiImageUploader({ value = [], onChange, maxImages }: MultiImageUploaderProps) {
  const images = value;

  const handleUpload = useCallback((result: any) => {
    if (result?.info?.secure_url && images.length < maxImages) {
      onChange([...images, result.info.secure_url]);
    }
  }, [images, onChange, maxImages]);

  const handleRemove = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === images.length - 1) return;
    const newImages = [...images];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    onChange(newImages);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {images.map((url, idx) => (
          <div key={`${url}-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden border bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  className="p-1.5 text-white hover:bg-white/20 rounded disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 text-white hover:bg-red-500 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === images.length - 1}
                  className="p-1.5 text-white hover:bg-white/20 rounded disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-white/80">{idx + 1} / {images.length}</span>
            </div>
          </div>
        ))}
      </div>

      {images.length < maxImages && (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onSuccess={handleUpload}
        >
          {({ open }) => (
            <Button type="button" variant="outline" onClick={() => open()} className="w-full">
              📷 Agregar foto ({images.length}/{maxImages})
            </Button>
          )}
        </CldUploadWidget>
      )}

      {images.length >= maxImages && (
        <p className="text-sm text-muted-foreground text-center">
          Límite de {maxImages} fotos alcanzado
        </p>
      )}
    </div>
  );
}
```

> **Nota:** Si usas otra librería de upload (no Cloudinary), adapta el componente. Lo importante es que reciba `value`, `onChange`, y `maxImages`.

#### 0C. Integrar en el editor

En `editor-client.tsx`, en el switch/mapeo de tipos de campo, agregar:

```typescript
if (campo.tipo === "gallery") {
  return (
    <FormField
      control={form.control}
      name={campo.id}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{campo.label}</FormLabel>
          <FormControl>
            <MultiImageUploader
              value={field.value || []}
              onChange={field.onChange}
              maxImages={campo.maxItems || 3}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

#### 0D. Asegurar que los templates usen `fotosGaleria`

Verificar que `CumpleCompleta.tsx` y `CumplePremium.tsx` lean `data.fotosGaleria` (array) para renderizar la galería:

```typescript
const fotos = data.fotosGaleria || data.fotos || [];

{fotos.length > 0 && (
  <section className="py-6">
    <h3 className="text-xl font-bold mb-4 text-center">Galería</h3>
    <div className={`grid gap-2 ${fotos.length === 1 ? 'grid-cols-1' : fotos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
      {fotos.map((foto: string, idx: number) => (
        <img key={idx} src={foto} alt={`Foto ${idx + 1}`} className="w-full h-48 object-cover rounded-lg" />
      ))}
    </div>
  </section>
)}
```

**Criterio de éxito:**
- Editor de paquete Completa permite subir hasta 3 fotos, mostrar thumbnails, eliminar y reordenar.
- Editor de paquete Premium permite hasta 6.
- Las fotos se guardan en `datosInvitacion.fotosGaleria` como array de strings.
- Al recargar, la galería se restaura correctamente.
- Los templates Completa y Premium renderizan la galería desde `fotosGaleria`.

---

### TAREA 1: Auto-guardado cada 30 segundos (ID-06)

**Archivo:** `src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx`

**Problema:** No hay auto-guardado. Si el usuario recarga la página, pierde cambios no guardados.

**Solución requerida:**

1. Implementar hook de auto-guardado con debounce de 30 segundos:

```typescript
import { useEffect, useRef } from "react";

// Dentro del componente EditorClient:
const [isDirty, setIsDirty] = useState(false);
const [isAutoSaving, setIsAutoSaving] = useState(false);
const [lastSaved, setLastSaved] = useState<Date | null>(null);
const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

// Detectar cambios en el formulario
useEffect(() => {
  const subscription = form.watch(() => {
    setIsDirty(true);
  });
  return () => subscription.unsubscribe();
}, [form]);

// Auto-guardar cada 30 segundos si hay cambios
useEffect(() => {
  if (isDirty && !isAutoSaving && !isSaving) {
    autoSaveTimerRef.current = setTimeout(() => {
      handleSaveDraft();
    }, 30000);
  }

  return () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
  };
}, [isDirty, isAutoSaving, isSaving]);

// Modificar handleSaveDraft para resetear isDirty:
const handleSaveDraft = async () => {
  setIsAutoSaving(true);
  try {
    const values = form.getValues();
    await savePedidoDatosAction(pedido.id, values);
    setIsDirty(false);
    setLastSaved(new Date());
    toast.success("Borrador guardado automáticamente");
  } catch (error) {
    toast.error("Error al guardar borrador");
  } finally {
    setIsAutoSaving(false);
  }
};
```

2. Agregar indicador visual de estado en el header del editor:

```tsx
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  {isDirty && <span className="text-amber-500">● Cambios sin guardar</span>}
  {isAutoSaving && <span>💾 Guardando...</span>}
  {!isDirty && lastSaved && (
    <span className="text-green-600">✓ Guardado {lastSaved.toLocaleTimeString()}</span>
  )}
</div>
```

**Criterio de éxito:**
- Escribir en un campo del editor → esperar 30s sin guardar manualmente → se auto-guarda.
- Indicador visual muestra "Cambios sin guardar" → "Guardando..." → "Guardado 14:32:15".
- El auto-guardado NO publica la invitación (solo guarda borrador).

---

### TAREA 2: Tests E2E actualizados (ID-09)

**Archivo:** `tests/e2e/flujo-completo.spec.ts`

**Problema:** Los tests intentan crear pedidos de boda (deshabilitado) y usan selectores obsoletos.

**Solución requerida:**

Reemplazar el contenido del archivo con:

```typescript
import { test, expect } from "@playwright/test";

test.describe("Flujo completo de Cumpleaños", () => {
  test("crear, editar, publicar y ver invitación de cumpleaños", async ({ page }) => {
    // 1. Login
    await page.goto("/admin/login");
    await page.fill('input[name="email"]', "admin@test.com");
    await page.fill('input[name="password"]', "password");
    await page.click('button[type="submit"]');
    await page.waitForURL("/admin");

    // 2. Crear pedido (Wizard)
    await page.goto("/admin/pedidos/nuevo");

    // Seleccionar tipo de evento (solo Cumpleaños disponible)
    await page.selectOption('select[name="tipoEvento"]', 'cumpleanos');
    await page.selectOption('select[name="paquete"]', 'cumpleanos-esencial');

    // Datos del cliente
    await page.fill('input[name="clienteNombre"]', "Juan Pérez");
    await page.fill('input[name="telefono"]', "5512345678");
    await page.fill('input[name="email"]', "juan@test.com");

    // Fecha y hora del evento
    await page.fill('input[name="fechaEvento"]', "2026-12-25");
    await page.fill('input[name="horaEvento"]', "19:00");

    await page.click('button:has-text("Crear Pedido")');

    // 3. Redirigir al editor
    await page.waitForURL(/\/admin\/pedidos\/\w+\/editar/);

    // 4. Editar invitación
    await page.fill('input[name="nombre"]', "María González");
    await page.fill('input[name="lugar"]', "Salón Fiesta Real");
    await page.fill('textarea[name="mensajeFestejo"]', "¡Ven a celebrar conmigo!");
    await page.click('button:has-text("Guardar borrador")');
    await page.waitForSelector('text=Guardado');

    // 5. Verificar que la URL pública NO existe aún (borrador)
    // (Opcional: verificar que el slug es null en la UI de admin)

    // 6. Publicar invitación
    await page.click('button:has-text("Publicar")');
    await page.waitForSelector('text=Publicada');

    // 7. Obtener URL pública y verificar
    const urlPublica = await page.locator('[data-testid="url-publica"]').inputValue();
    expect(urlPublica).toContain("/i/");

    // 8. Abrir invitación pública en nueva pestaña (o navegar)
    await page.goto(urlPublica);
    await page.waitForSelector('text=María González');
    await page.waitForSelector('text=Salón Fiesta Real');
    await page.waitForSelector('text=¡Ven a celebrar conmigo!');

    // 9. Verificar OG tags (inspeccionar meta tags)
    const title = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(title).toContain("María González");
  });

  test("galería de fotos en paquete Completa", async ({ page }) => {
    // Login y crear pedido Completa
    await page.goto("/admin/login");
    await page.fill('input[name="email"]', "admin@test.com");
    await page.fill('input[name="password"]', "password");
    await page.click('button[type="submit"]');

    await page.goto("/admin/pedidos/nuevo");
    await page.selectOption('select[name="tipoEvento"]', 'cumpleanos');
    await page.selectOption('select[name="paquete"]', 'cumpleanos-completa');
    await page.fill('input[name="clienteNombre"]', "Pedro López");
    await page.fill('input[name="telefono"]', "5598765432");
    await page.click('button:has-text("Crear Pedido")');

    await page.waitForURL(/\/admin\/pedidos\/\w+\/editar/);

    // Verificar que existe el uploader de galería
    await page.waitForSelector('text=Galería de fotos');
    await page.waitForSelector('button:has-text("Agregar foto")');

    // Verificar límite de 3 fotos
    await page.waitForSelector('text=0/3');
  });
});
```

**Criterio de éxito:**
- `npx playwright test` ejecuta los tests sin errores de selector.
- El flujo de cumpleaños pasa end-to-end.

---

### TAREA 3: Limpieza de paquetes no implementados (ID-11)

**Archivo:** `src/lib/paquetes.ts`

**Problema:** Los 9 paquetes de Boda/XV/Baby Shower tienen `campos` y `secciones` poblados, confundiendo el alcance.

**Solución requerida:**

Para los 9 paquetes con `implementado: false`, limpiar arrays:

```typescript
{
  id: "boda-esencial",
  nombre: "Boda Esencial",
  tipoEvento: "boda",
  precio: 350,
  implementado: false,
  secciones: [], // ← vacío
  campos: [],    // ← vacío
}
// Repetir para los otros 8 paquetes no implementados
```

**Criterio de éxito:**
- Los paquetes no implementados tienen `campos: []` y `secciones: []`.
- El wizard sigue mostrando "Próximamente" para ellos.

---

### TAREA 4: Templates Esencial/Completa — tipoCelebracion y whatsapp (ID-13)

**Archivos:** `CumpleEsencial.tsx`, `CumpleCompleta.tsx`

**Problema:** Campos `tipoCelebracion` y `whatsapp` no se renderizan.

**Solución requerida:**

En ambos templates, agregar:

```typescript
// Badge de tipo de celebración
{data.tipoCelebracion && data.tipoCelebracion !== "general" && (
  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-white/20">
    {data.tipoCelebracion === "infantil" && "🎈 Infantil"}
    {data.tipoCelebracion === "juvenil" && "🎸 Juvenil"}
    {data.tipoCelebracion === "adulto" && "🍷 Adultos"}
    {data.tipoCelebracion === "sorpresa" && "🎁 Sorpresa"}
  </div>
)}

// Botón de WhatsApp
{data.whatsapp && (
  <a
    href={`https://wa.me/${data.whatsapp.replace(/\D/g, "")}`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
  >
    💬 Contactar por WhatsApp
  </a>
)}
```

**Criterio de éxito:**
- Template muestra badge según tipo de celebración.
- Botón de WhatsApp funcional si se proporcionó número.

---

### TAREA 5: Skeleton loaders en editor (ID-15)

**Archivo:** `src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx`

**Problema:** No hay estado de carga mientras se inicializan los datos del formulario.

**Solución requerida:**

1. Agregar estado de carga inicial:

```typescript
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  // Simular o detectar cuando defaultValues están listos
  if (pedido) {
    setIsLoading(false);
  }
}, [pedido]);
```

2. Renderizar skeletons mientras carga:

```tsx
{isLoading ? (
  <div className="space-y-4 p-4">
    <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded" />
    <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
    <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
    <div className="h-32 w-full bg-gray-200 animate-pulse rounded" />
    <div className="h-10 w-2/3 bg-gray-200 animate-pulse rounded" />
  </div>
) : (
  // Formulario actual
)}
```

> **Nota:** Si usas shadcn/ui, puedes usar el componente `<Skeleton />` en lugar de divs manualmente.

**Criterio de éxito:**
- Al abrir el editor, se ven 4-5 skeletons durante 200-500ms mientras carga.
- Luego aparece el formulario con los valores correctos.

---

### TAREA 6: Toggle mobile/desktop en preview (ID-17)

**Archivo:** `src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx`

**Problema:** La preview solo simula mobile (`max-w-[360px]`). No hay forma de ver desktop.

**Solución requerida:**

1. Agregar estado de viewport:

```typescript
const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
```

2. Agregar toggle buttons arriba del preview:

```tsx
<div className="flex items-center justify-center gap-2 mb-4">
  <button
    type="button"
    onClick={() => setPreviewMode("mobile")}
    className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors ${
      previewMode === "mobile" ? "bg-primary text-primary-foreground" : "bg-gray-100 hover:bg-gray-200"
    }`}
  >
    📱 Mobile
  </button>
  <button
    type="button"
    onClick={() => setPreviewMode("desktop")}
    className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors ${
      previewMode === "desktop" ? "bg-primary text-primary-foreground" : "bg-gray-100 hover:bg-gray-200"
    }`}
  >
    🖥️ Desktop
  </button>
</div>
```

3. Aplicar clase condicional al contenedor del preview:

```tsx
<div className={`mx-auto transition-all duration-300 ${
  previewMode === "mobile" ? "max-w-[360px]" : "max-w-[768px]"
}`}>
  {/* Template renderizado */}
</div>
```

**Criterio de éxito:**
- Toggle Mobile/Desktop cambia el ancho del preview.
- Transición suave de 300ms.

---

### TAREA 7: Validación teléfono en wizard (ID-18)

**Archivo:** `src/app/(admin)/admin/pedidos/nuevo/nuevo-pedido-client.tsx`

**Problema:** Validación de teléfono es laxa, permite cualquier carácter.

**Solución requerida:**

```typescript
import { z } from "zod";

const telefonoRegex = /^[0-9]{10}$/;

const schema = z.object({
  // ... otros campos ...
  telefono: z
    .string()
    .regex(telefonoRegex, "El teléfono debe tener exactamente 10 dígitos numéricos")
    .min(10, "Mínimo 10 dígitos")
    .max(10, "Máximo 10 dígitos"),
  // ...
});
```

En el input del formulario, agregar:

```tsx
<Input
  type="tel"
  placeholder="Ej: 5512345678"
  maxLength={10}
  inputMode="numeric"
  {...field}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    field.onChange(value);
  }}
/>
```

**Criterio de éxito:**
- Escribir letras → no aparecen (solo números).
- Escribir 11 dígitos → se trunca a 10.
- Enviar con 9 dígitos → error de validación Zod.

---

### TAREA 8: WA notificaciones completas (ID-19)

**Archivo:** `src/lib/notificaciones.ts`

**Problema:** El mensaje de WA solo incluye nombre del cliente y URL, omite fecha/hora/lugar.

**Solución requerida:**

```typescript
export function generarMensajeWhatsApp(pedido: PedidoConDatos): string {
  const datos = (pedido.datosInvitacion ?? {}) as Record<string, any>;
  const nombreEvento = datos.nombre ?? datos.nombres ?? pedido.cliente?.nombre ?? "un evento especial";
  const fecha = pedido.fechaEvento
    ? new Date(pedido.fechaEvento).toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Fecha por confirmar";
  const hora = pedido.horaEvento ?? "Hora por confirmar";
  const lugar = datos.lugar ?? datos.ubicacion ?? "Lugar por confirmar";
  const url = pedido.urlPublica ?? "URL por generar";
  const mensajePersonalizado = datos.mensajeFestejo ?? datos.mensajeBienvenida ?? "";

  return `¡Hola! 👋

Te invito a ${nombreEvento} 🎉

📅 *Fecha:* ${fecha}
🕐 *Hora:* ${hora}
📍 *Lugar:* ${lugar}

${mensajePersonalizado ? `"${mensajePersonalizado}"` : ""}

Confirma tu asistencia aquí 👇
${url}

¡Nos vemos there! 🥳`;
}
```

**Criterio de éxito:**
- Mensaje de WA incluye: nombre del festejado, fecha, hora, lugar, mensaje personalizado, URL.
- Formato legible con emojis y negritas (Markdown de WhatsApp).

---

### TAREA 9: Badge traducido en kanban (ID-20)

**Archivo:** `src/app/(admin)/admin/pedidos/pedidos-client.tsx`

**Problema:** Badge muestra `"cumpleanos"` en lugar de `"Cumpleaños"`.

**Solución requerida:**

```typescript
const EVENTO_LABELS: Record<string, string> = {
  cumpleanos: "Cumpleaños",
  boda: "Boda",
  xv: "XV Años",
  babyshower: "Baby Shower",
};

// En el render del badge:
<span className="badge">
  {EVENTO_LABELS[pedido.tipoEvento] ?? pedido.tipoEvento}
</span>
```

**Criterio de éxito:**
- Badge muestra "Cumpleaños · Esencial" en lugar de "cumpleanos · esencial".

---

### TAREA 10: Búsqueda por festejado en kanban (ID-21)

**Archivo:** `src/app/(admin)/admin/pedidos/pedidos-client.tsx`

**Problema:** Búsqueda solo filtra por `cliente.nombre` y `slug`, no por nombre del festejado en `datosInvitacion`.

**Solución requerida:**

```typescript
const filteredPedidos = pedidos.filter((pedido) => {
  const query = searchQuery.toLowerCase();
  const datos = (pedido.datosInvitacion ?? {}) as Record<string, any>;

  return (
    pedido.cliente?.nombre?.toLowerCase().includes(query) ||
    pedido.slug?.toLowerCase().includes(query) ||
    datos.nombre?.toLowerCase().includes(query) ||      // Cumpleaños
    datos.nombres?.toLowerCase().includes(query) ||     // Boda
    datos.nombreBebe?.toLowerCase().includes(query) ||    // Baby shower
    pedido.id.toLowerCase().includes(query)
  );
});
```

**Criterio de éxito:**
- Buscar "María" en el kanban encuentra el pedido donde `datosInvitacion.nombre = "María"`.

---

### TAREA 11: Clonador limpia datos de cumpleaños (ID-22)

**Archivo:** `src/app/(admin)/admin/pedidos/[id]/actions.ts`

**Problema:** El clonador limpia campos de boda (`nombres`, `portadaUrl`) pero no los de cumpleaños (`nombre`, `fotoPortada`, `fotosGaleria`).

**Solución requerida:**

En `clonarPedidoAction`, agregar a la limpieza:

```typescript
const datosLimpios = {
  // Limpiar campos de boda (existentes)
  nombres: "",
  portadaUrl: "",
  fotos: [],
  // Limpiar campos de cumpleaños (nuevos)
  nombre: "",
  edad: "",
  fotoPortada: "",
  fotosGaleria: [],
  mensajeFestejo: "",
  tipoCelebracion: "general",
  itinerario: [],
  datosRegalo: "",
  colorPrimario: "#FF6B6B",
  colorSecundario: "#4ECDC4",
  musicaFondo: "",
  fechaLimiteRSVP: "",
  mensajeAgradecimiento: "",
  codigoVestimenta: "",
  linkRegalos: "",
  mapaPersonalizado: false,
  confettiAnimacion: true,
  cuentaRegresiva: true,
  // Mantener campos comunes vacíos pero estructurados
  mensajeBienvenida: "",
  ubicacion: "",
  mapaUrl: "",
};
```

**Criterio de éxito:**
- Clonar un pedido de cumpleaños crea un nuevo pedido con `nombre: ""`, `fotoPortada: ""`, `fotosGaleria: []`.

---

### TAREA 12: CSV RSVP con metadatos (ID-23)

**Archivo:** `src/app/(admin)/admin/pedidos/[id]/rsvp-table.tsx`

**Problema:** CSV exportado solo tiene invitados, sin info del evento.

**Solución requerida:**

```typescript
function exportarCSV(pedido: Pedido, invitados: Invitado[]) {
  const datos = (pedido.datosInvitacion ?? {}) as Record<string, any>;
  const nombreEvento = datos.nombre ?? datos.nombres ?? "Evento";
  const fecha = pedido.fechaEvento
    ? new Date(pedido.fechaEvento).toLocaleDateString("es-MX")
    : "";
  const lugar = datos.lugar ?? datos.ubicacion ?? "";

  const metadata = [
    `Evento: ${nombreEvento}`,
    `Fecha: ${fecha}`,
    `Lugar: ${lugar}`,
    `",,,`, // línea vacía para separar
  ];

  const headers = ["Nombre", "Email", "Teléfono", "Asistentes", "Confirmación", "Mensaje", "Fecha de confirmación"];
  const rows = invitados.map((i) => [
    i.nombre,
    i.email ?? "",
    i.telefono ?? "",
    String(i.asistentes ?? 1),
    i.confirmado ? "Sí" : "No",
    i.mensaje ?? "",
    i.createdAt ? new Date(i.createdAt).toLocaleDateString("es-MX") : "",
  ]);

  const csvContent = [
    metadata.join("\n"),
    headers.join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");

  // Descargar...
}
```

**Criterio de éxito:**
- CSV descargado tiene 3 líneas de metadata al inicio, luego headers, luego datos.

---

### TAREA 13: Warnings ESLint/React (ID-25)

**Archivos:** Múltiples templates

**Problema:** `useEffect` dependency arrays incompletos, `<img>` en lugar de `<Image />` de Next.js.

**Solución requerida:**

1. Revisar TODOS los `useEffect` en templates y agregar dependencias faltantes.
2. Reemplazar `<img>` por `<Image />` de Next.js donde sea posible:

```typescript
import Image from "next/image";

// ANTES:
// <img src={url} alt="..." className="..." />

// DESPUÉS:
<Image src={url} alt="..." width={800} height={600} className="..." unoptimized />
```

> **Nota:** Usa `unoptimized` para imágenes externas (Cloudinary) o configura `remotePatterns` en `next.config.js`.

**Criterio de éxito:**
- `npm run build` no muestra warnings de ESLint.
- No hay console warnings de React en el navegador.

---

### TAREA 14: Watermark en preview de borrador (ID-26)

**Archivo:** `src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx`

**Problema:** No hay indicador visual de que el preview es un borrador.

**Solución requerida:**

```tsx
{pedido.estadoInvitacion === "BORRADOR" && (
  <div className="absolute top-4 right-4 z-50 pointer-events-none">
    <div className="bg-amber-500/80 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider rotate-[-5deg] shadow-lg">
      VISTA PREVIA — BORRADOR
    </div>
  </div>
)}
```

**Criterio de éxito:**
- Preview muestra badge "VISTA PREVIA — BORRADOR" en esquina superior derecha.
- Badge desaparece cuando `estadoInvitacion === "PUBLICADA"`.

---

## 🧪 TESTS OBLIGATORIOS

### Test 1: Auto-guardado
```typescript
// tests/unit/auto-save.test.ts
import { describe, it, expect, vi } from "vitest";

describe("Auto-guardado", () => {
  it("debe disparar guardado tras 30s de inactividad", () => {
    const saveMock = vi.fn();
    // Simular lógica de debounce
    vi.useFakeTimers();
    // ... lógica del hook ...
    vi.advanceTimersByTime(30000);
    expect(saveMock).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
```

### Test 2: MultiImageUploader
```typescript
// tests/unit/multi-image-uploader.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MultiImageUploader } from "@/components/ui/multi-image-uploader";

describe("MultiImageUploader", () => {
  it("renderiza thumbnails", () => {
    render(<MultiImageUploader value={["url1", "url2"]} onChange={() => {}} maxImages={3} />);
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("elimina imagen al hacer click en X", () => {
    const onChange = vi.fn();
    render(<MultiImageUploader value={["url1", "url2"]} onChange={onChange} maxImages={3} />);
    const botonesEliminar = screen.getAllByRole("button", { name: /eliminar/i });
    fireEvent.click(botonesEliminar[0]);
    expect(onChange).toHaveBeenCalledWith(["url2"]);
  });

  it("respeta límite máximo", () => {
    render(<MultiImageUploader value={["url1", "url2", "url3"]} onChange={() => {}} maxImages={3} />);
    expect(screen.queryByText(/Agregar foto/)).not.toBeInTheDocument();
    expect(screen.getByText(/Límite de 3 fotos/)).toBeInTheDocument();
  });
});
```

### Test 3: Badge de evento traducido
```typescript
// tests/unit/evento-labels.test.ts
import { describe, it, expect } from "vitest";

const EVENTO_LABELS = {
  cumpleanos: "Cumpleaños",
  boda: "Boda",
  xv: "XV Años",
  babyshower: "Baby Shower",
};

describe("EVENTO_LABELS", () => {
  it("traduce cumpleanos a Cumpleaños", () => {
    expect(EVENTO_LABELS["cumpleanos"]).toBe("Cumpleaños");
  });
});
```

### Test 4: Validación de teléfono
```typescript
// tests/unit/telefono-validation.test.ts
import { describe, it, expect } from "vitest";
import { z } from "zod";

const schema = z.string().regex(/^[0-9]{10}$/, "10 dígitos numéricos");

describe("Validación teléfono", () => {
  it("acepta 10 dígitos", () => {
    expect(() => schema.parse("5512345678")).not.toThrow();
  });

  it("rechaza 9 dígitos", () => {
    expect(() => schema.parse("551234567")).toThrow();
  });

  it("rechaza letras", () => {
    expect(() => schema.parse("551234567a")).toThrow();
  });
});
```

### Test 5: Clonador limpia datos cumpleaños
```typescript
// tests/unit/clonar-pedido.test.ts
import { describe, it, expect } from "vitest";

describe("clonarPedidoAction", () => {
  it("limpia nombre, fotoPortada y fotosGaleria al clonar", async () => {
    // Mock o integración
    const clon = await clonarPedidoAction("pedido-original-id");
    const datos = clon.datosInvitacion as Record<string, any>;
    expect(datos.nombre).toBe("");
    expect(datos.fotoPortada).toBe("");
    expect(datos.fotosGaleria).toEqual([]);
  });
});
```

---

## ✅ VERIFICACIÓN FINAL

Antes de hacer commit, ejecuta:

```bash
# 1. Build limpio
npm run build

# 2. Tests unitarios
npx vitest run tests/unit --sequence.concurrent false --no-file-parallelism

# 3. Tests de integración
npx vitest run tests/integration --sequence.concurrent false --no-file-parallelism

# 4. Tests E2E (Playwright)
npx playwright test tests/e2e/flujo-completo.spec.ts

# 5. Verificar que no haya referencias a datosJson
grep -r "datosJson" src/ tests/ --include="*.ts" --include="*.tsx" || echo "OK"

# 6. Verificar que paquetes no implementados tienen campos vacíos
# (revisar manualmente src/lib/paquetes.ts)
```

Todos deben pasar.

---

## 📝 COMMIT

```bash
git add .
git commit -m "fix(fase3): multi-upload + auto-save + tests E2E + polish medios y bajos"
```

---

## ⚠️ REGLAS DE ORO DE ESTA FASE

1. **NO modifiques `prisma/schema.prisma`.** Estable desde Fase 1.
2. **NO modifiques `src/lib/estados.ts` ni `src/lib/paquetes.ts` excepto para:**
   - Agregar `tipo: "gallery"` y `maxItems` a campos de galería (Tarea 0)
   - Limpiar campos de paquetes no implementados (Tarea 3)
3. **Mantén backward compatibility** con pedidos de boda existentes.
4. **Si te atascas en una tarea**, reporta el error exacto y detente.
5. **Prioridad:** Tarea 0 (multi-upload) es bloqueante. Las demás son medios/bajos.
