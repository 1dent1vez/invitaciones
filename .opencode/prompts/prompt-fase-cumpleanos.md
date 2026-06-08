# 🚀 FASE CUMPLEAÑOS: 3 Templates + DB Preparada para Escalar

## 📖 Contexto Inicial (LEER ANTES DE CODEAR)

1. `.opencode/prompts/paquetes-contexto.md` — Configuración completa de paquetes (referencia)
2. `.opencode/architecture.md` — Stack y patrones
3. `.opencode/conventions.md` — Nomenclatura y server actions
4. `prisma/schema.prisma` — Schema actual
5. `src/lib/templates.ts` — Mapeo actual de templates
6. `src/types/index.ts` — Tipos actuales
7. `src/components/templates/` — Templates existentes (4 genéricos)

## 🎯 OBJETIVO DE ESTA FASE

Implementar SOLO los 3 templates de **Cumpleaños** (Esencial, Completa, Premium), pero dejar la **base de datos y la arquitectura lista** para agregar los 9 templates restantes (Boda, XV, Baby Shower) en el futuro sin tocar la DB.

## 🏗️ REGLA DE ORO: DB PREPARADA PARA ESCALAR

El schema de Prisma y la configuración de paquetes deben soportar los 12 paquetes desde el día 1, aunque solo implementemos 3 ahora. Esto significa:

- `tipoEvento` y `paquete` existen en el schema.
- `src/lib/paquetes.ts` tiene la config de los 12 paquetes.
- Los 9 paquetes no implementados retornan un componente "Próximamente" o usan fallback.

---

## 📝 TAREAS ATÓMICAS

### Paso 1: Preparar DB y Configuración (Escalable)

- [ ] Actualizar `prisma/schema.prisma`:
  - Añadir `paquete String` al modelo `Pedido`.
  - `template` se deriva de `${tipoEvento}-${paquete}`.
  - `precio` se asigna automáticamente según `tipoEvento + paquete`.
  - Crear migración: `npx prisma migrate dev --name add_paquete`.
  - Correr `npx prisma generate`.

- [ ] Crear `src/lib/paquetes.ts`:
  - Incluir la configuración de los **12 paquetes completos** (copiar de paquetes-contexto.md).
  - `PRECIOS_PAQUETE`, `TIPOS_EVENTO`, `PAQUETES`, `CONFIGURACION_EVENTOS`.
  - Helpers: `getPaqueteConfig()`, `getTemplateName()`, `getPrecio()`.
  - Para los 9 paquetes no implementados, añadir flag `implementado: boolean` (true solo para cumpleaños).

- [ ] Actualizar `src/types/index.ts`:
  - Añadir `tipoEvento` y `paquete` a tipos de Pedido.
  - Añadir `InvitacionData` con TODOS los campos posibles (de los 12 paquetes), todos opcionales.

- [ ] Actualizar `prisma/seed.ts`:
  - Crear 3 demos de cumpleaños (esencial, completa, premium).
  - Los 9 demos restantes se crean como "placeholder" (datos mínimos, template = "proximamente").

### Paso 2: Crear 3 Templates de Cumpleaños

- [ ] Crear carpetas:
  ```
  src/components/templates/cumpleanos/
  ├── CumpleEsencial.tsx
  ├── CumpleCompleta.tsx
  └── CumplePremium.tsx
  ```

- [ ] **CumpleEsencial** — 4 secciones:
  - Portada: nombre, edad, foto, frase
  - Ubicación: lugar, dirección, link Maps
  - RSVP básico
  - Música de fondo (botón toggle)
  - Colores desde `datosJson.colorPrimario/colorSecundario`

- [ ] **CumpleCompleta** — 9 secciones (hereda de Esencial +):
  - Galería de fotos (hasta 6)
  - Dress code con descripción
  - Mensaje del festejado
  - Itinerario de la fiesta
  - Mesa de regalos / datos bancarios

- [ ] **CumplePremium** — 16 secciones (hereda de Completa +):
  - Historia del festejado (3 momentos: significado de la edad, mensaje a seres queridos, recuerdo favorito)
  - Galería extendida (hasta 12 fotos totales)
  - Buzón de deseos
  - Álbum QR (placeholder visual)
  - Pases personalizados ("Tienes X pases")
  - Video embebido (YouTube/Vimeo iframe)
  - Temática de decoración (selector visual)
  - Color de acento adicional

- [ ] Diseño visual:
  - Los 3 comparten MISMA base: fondo oscuro eléctrico, tipografía moderna, animación Framer Motion.
  - Diferencia: cantidad de secciones.
  - Confeti CSS animado en Premium.
  - Timeline interactivo en Completa/Premium.

### Paso 3: Actualizar Mapeo y Fallbacks

- [ ] Modificar `src/lib/templates.ts`:
  - Mapear los 3 templates de cumpleaños.
  - Para los 9 no implementados, mapear a un componente `Proximamente` que muestre: "Próximamente disponible".
  - `getTemplateConfig` usa `tipoEvento + paquete`.

- [ ] Crear `src/components/templates/Proximamente.tsx`:
  - Componente simple con mensaje "Esta invitación estará disponible pronto".
  - Se usa como fallback para boda, xv, babyshower.

### Paso 4: Actualizar Editor (Mínimo para Cumpleaños)

- [ ] Modificar `src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx`:
  - Si `tipoEvento === 'cumpleanos'`, cargar campos de `CONFIGURACION_EVENTOS.cumpleanos[paquete]`.
  - Si es otro tipo, mostrar mensaje: "Editor en desarrollo para este tipo de evento." + botón "Editar datos JSON manualmente" (textarea).
  - Preview renderiza el template correcto (CumpleEsencial/Completa/Premium).

### Paso 5: Actualizar Wizard de Nuevo Pedido (Mínimo)

- [ ] Modificar `src/app/(admin)/admin/pedidos/nuevo/nuevo-pedido-client.tsx`:
  - Select de tipo de evento: mostrar los 4 tipos, pero los no implementados (boda, xv, babyshower) están **disabled** con label "(Próximamente)".
  - Solo `cumpleanos` está habilitado.
  - Al seleccionar cumpleaños → select de paquete (esencial/completa/premium) → precio automático.
  - Fecha con calendario, hora con reloj.

### Paso 6: Actualizar Página Pública

- [ ] Modificar `src/app/(public)/i/[slug]/page.tsx`:
  - Si `tipoEvento === 'cumpleanos'`, renderizar template correcto.
  - Si es otro tipo, renderizar `Proximamente`.

- [ ] RSVP:
  - Para cumpleaños Premium: mostrar selector de pases si `datosJson.pases = true`.
  - Para cumpleaños Premium: mostrar buzón de deseos si `datosJson.buzonDeseos = true`.

### Paso 7: Tests

- [ ] `tests/unit/templates/cumpleanos.test.tsx` — Render de los 3 templates.
- [ ] `tests/integration/pedidos.test.ts` — Crear pedido cumpleaños con precio correcto.
- [ ] `tests/unit/paquetes.test.ts` — Config de paquetes, precios, template names.

---

## 🚫 RESTRICCIONES

- NO implementar templates de boda, xv, babyshower (solo dejar la config lista).
- NO modificar auth, clientes, kanban, pagos (excepto precio automático en pedidos).
- Los 9 paquetes no implementados deben mostrar "Próximamente", NO crashear.

## 🧪 TESTS OBLIGATORIOS

- `tests/unit/templates/cumpleanos.test.tsx` — 3 renders
- `tests/integration/pedidos.test.ts` — precio fijo cumpleaños
- `tests/unit/paquetes.test.ts` — config completa de 12 paquetes

## 🎯 CHECKLIST PRE-ESCALADO (para cuando quieras agregar los 9 restantes)

Cuando quieras escalar, solo necesitas:
- [ ] Crear los 9 templates en `src/components/templates/{boda,xv,babyshower}/`
- [ ] Habilitar los tipos en el select del wizard (quitar disabled)
- [ ] Implementar editor dinámico completo para todos los tipos
- [ ] La DB ya está lista, la config ya está lista, los tipos ya están listos.

## 🎬 COMANDO DE KICKOFF

```
Implementa la FASE CUMPLEAÑOS: 3 templates (Esencial, Completa, Premium) + DB preparada para escalar a 12 paquetes. Actualiza el schema de Prisma con tipoEvento+paquete, crea src/lib/paquetes.ts con config de 12 paquetes (pero solo cumpleaños implementado), crea los 3 templates de cumpleaños con diseño festivo, deja los 9 restantes con componente "Próximamente". Actualiza el wizard para solo permitir cumpleaños, y el editor para cargar campos de cumpleaños. Escribe tests. Genera fase-cumpleanos-report.md al terminar.
```

## 📊 FORMATO DE REPORTE

`fase-cumpleanos-report.md` con:
1. Cambios en schema.prisma
2. Archivos creados (paquetes.ts, 3 templates, Proximamente)
3. Estado de implementación por paquete (tabla de 12 con ✅/⏳)
4. Estado de tests
5. Instrucciones exactas para escalar (qué archivos tocar para agregar boda/xv/baby)
