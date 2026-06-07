# 📋 conventions.md — Estándares de Código

> **SAGRADO.** Solo el agente planificador y el humano lo modifican.  
> El agente de código (Kilo Code) DEBE seguir estas reglas en TODO el código generado.

---

## 1. Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes React | PascalCase | `ClienteTable`, `TemplateBoda` |
| Hooks personalizados | camelCase, prefijo `use` | `useAdmin`, `usePedido` |
| Server Actions | camelCase, sufijo `Action` | `createClienteAction`, `updatePedidoAction` |
| Funciones utilitarias | camelCase | `formatCurrency`, `generateSlug` |
| Tipos/Interfaces | PascalCase, prefijo descriptivo | `ClienteData`, `InvitacionData`, `TemplateConfig` |
| Variables de estado | camelCase | `isLoading`, `selectedTemplate` |
| Constantes | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE`, `ESTADOS_PEDIDO` |
| Archivos de página Next.js | kebab-case | `page.tsx`, `layout.tsx` |
| Carpetas de rutas | kebab-case | `nuevo-pedido/`, `detalle-pedido/` |
| Clases CSS Tailwind | kebab-case en className | `bg-primary`, `text-foreground` |
| Variables de entorno | UPPER_SNAKE_CASE | `ADMIN_PASSWORD`, `DATABASE_URL` |

---

## 2. Estructura de un Componente React

```tsx
// 1. Imports externos (React, Next, librerías)
import { useState } from "react";
import { motion } from "framer-motion";

// 2. Imports internos (lib, types, hooks)
import { cn } from "@/lib/utils";
import type { ClienteData } from "@/types";

// 3. Imports de componentes
import { Button } from "@/components/ui/button";

// 4. Tipado de props (si aplica)
interface ClienteCardProps {
  cliente: ClienteData;
  onEdit: (id: string) => void;
}

// 5. Componente
export function ClienteCard({ cliente, onEdit }: ClienteCardProps) {
  // Hooks primero
  const [isExpanded, setIsExpanded] = useState(false);

  // Handlers después
  const handleClick = () => setIsExpanded((prev) => !prev);

  // Render
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">{cliente.nombre}</h3>
      <Button onClick={handleClick}>Editar</Button>
    </div>
  );
}
```

**Reglas:**
- Siempre usar `function` para componentes (no arrow functions en export default).
- Props desestructuradas en la firma.
- Tipos de props en `interface`, no `type` (preferencia de equipo).
- No usar `any`. Usar `unknown` si es necesario y hacer narrowing.

---

## 3. Server Actions

```ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateClienteInput {
  nombre: string;
  telefono?: string;
  fuente?: string;
}

interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createClienteAction(
  input: CreateClienteInput
): Promise<ActionResult<{ id: string }>> {
  try {
    // Validación explícita
    if (!input.nombre || input.nombre.trim().length < 2) {
      return { success: false, error: "El nombre debe tener al menos 2 caracteres" };
    }

    const cliente = await prisma.cliente.create({
      data: {
        nombre: input.nombre.trim(),
        telefono: input.telefono?.trim(),
        fuente: input.fuente || "tienda",
      },
    });

    revalidatePath("/admin/clientes");

    return { success: true, data: { id: cliente.id } };
  } catch (error) {
    console.error("[createClienteAction]", error);
    return { success: false, error: "Error al crear cliente" };
  }
}
```

**Reglas:**
- Siempre `"use server"` al inicio del archivo.
- Siempre retornar `ActionResult<T>`.
- Siempre validar inputs antes de tocar la DB.
- Siempre usar `revalidatePath` después de mutaciones que afectan UI.
- Nunca lanzar excepciones al cliente; capturar y retornar `error` string.
- Loggear errores en servidor con `console.error` + contexto.

---

## 4. Prisma / Base de Datos

- Usar el singleton `prisma` desde `@/lib/prisma`.
- Nunca crear `new PrismaClient()` fuera de `lib/prisma.ts`.
- Usar `Decimal` de Prisma para dinero. Convertir a string o number solo en capa de presentación.
- Fechas: siempre `DateTime` en DB, formatear con `Intl.DateTimeFormat` o `date-fns` en UI.
- JSON (datosJson): tipar con `zod` o interface antes de guardar.

---

## 5. Tailwind + shadcn/ui

- Usar `cn()` de `@/lib/utils` para clases condicionales.
- No usar `style` inline excepto para valores dinámicos de color de template.
- Extender `tailwind.config.ts` para colores del brand si es necesario.
- shadcn/ui components van en `src/components/ui/`. No modificarlos directamente; crear wrapper en `src/components/admin/` o `src/components/shared/` si necesitas variantes.
- Responsive mobile-first: `sm:`, `md:`, `lg:`.

---

## 6. Manejo de Errores

```tsx
// En componentes cliente
const [error, setError] = useState<string | null>(null);

const handleSubmit = async () => {
  setError(null);
  const result = await createClienteAction(data);
  if (!result.success) {
    setError(result.error || "Error desconocido");
    return;
  }
  // éxito
};

// En server components
try {
  const data = await prisma.cliente.findMany();
} catch (e) {
  // Mostrar estado de error en UI
  return <ErrorState message="No se pudieron cargar los clientes" />;
}
```

---

## 7. Formularios

- Usar `react-hook-form` + `zod` para validación en cliente.
- Schema de zod debe replicar las validaciones de la server action.
- Mensajes de error en español.
- Campos requeridos marcados visualmente con `*`.
- Submit con estado de loading (`disabled` + spinner).

---

## 8. Imports y Alias

```ts
// ✅ Correcto
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import type { ClienteData } from "@/types";

// ❌ Incorrecto
import { Button } from "../../../components/ui/button";
```

- Siempre usar alias `@/` configurado en `tsconfig.json`.
- Orden de imports: React/Next → Librerías externas → Alias internos → Tipos → Estilos.

---

## 9. Comentarios

- Evitar comentarios obvios (`// incrementa el contador`).
- Comentar solo lógica de negocio compleja o decisiones no evidentes.
- Usar `// TODO(sprint-X): descripción` para deuda técnica intencional.
- Usar `// HACK: explicación` para soluciones temporales.

---

## 10. Git

- Commits por sprint obligatorio.
- Mensaje de commit: `sprint-X: descripción breve`.
- Ejemplo: `sprint-1: setup proyecto, prisma, neon, auth middleware`.
- Nunca commitear `.env`.

---

> **Última modificación:** 2026-06-07
