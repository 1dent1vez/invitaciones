# Reporte de Ejecución: Fase Cumpleaños

Este documento detalla la implementación, normalización y verificación de la **Fase Cumpleaños** para la plataforma de invitaciones. Se han integrado 3 plantillas de cumpleaños con un diseño moderno "dark-electric", se preparó el esquema de base de datos para los 12 paquetes de eventos futuros, se normalizaron referencias a `baby_shower` y se resolvieron fallos de pruebas.

---

## 1. Cambios Estructurales y Base de Datos

- **Esquema de Prisma (`prisma/schema.prisma`):**
  - Se añadieron los campos `tipoEvento` y `paquete` al modelo `Pedido`.
  - Se aplicaron migraciones locales y se generó el cliente actualizado de Prisma (`npx prisma generate`).
- **Configuración de Paquetes (`src/lib/paquetes.ts`):**
  - Se crearon definiciones y configuraciones completas para 12 paquetes (Boda, XV Años, Babyshower y Cumpleaños, en niveles Esencial, Completa y Premium).
  - El tipo `tipoEvento` se normalizó para usar `babyshower` en lugar del anterior snake_case `baby_shower`.
- **Datos de Prueba (`prisma/seed.ts`):**
  - Se actualizó el archivo de semillas para incluir pedidos demo de cumpleaños con datos específicos de plantilla.

---

## 2. Plantillas de Cumpleaños y Fallbacks

- **Plantillas Creadas (`src/components/templates/cumpleanos/`):**
  - [CumpleEsencial.tsx](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx): Portada, fecha, ubicación/mapa, confirmación RSVP y música.
  - [CumpleCompleta.tsx](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleCompleta.tsx): Añade galería de imágenes (hasta 6 fotos), código de vestimenta con descripción y itinerario/regalos.
  - [CumplePremium.tsx](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumplePremium.tsx): Añade biografía/sección de historia detallada, pases de invitados, buzón de deseos y sección de video de Save the Date.
  - Diseño: Estilo premium con paletas oscuras, detalles de luces color neón y tipografías sans-serif modernas.
- **Plantilla Próximamente (`src/components/templates/Proximamente.tsx`):**
  - Las otras 9 plantillas de eventos no implementados muestran un componente elegante con un contador simulado de lanzamiento y estética premium.
- **Normalización de Estilos (`TemplateWrapper.tsx`):**
  - Se incluyó compatibilidad y fallback para mapear el campo `colorPrimario` (nuevo esquema) a `colorPrincipal` (legado) de forma que no existan inconsistencias visuales en el preview ni en producción.

---

## 3. Interfaces del Administrador (Wizard y Editor)

- **Creación de Pedidos (`nuevo-pedido-client.tsx`):**
  - Se restringió la creación de pedidos iniciales únicamente al tipo de evento "Cumpleaños" conforme a los requerimientos de la fase.
  - Se automatizó la asignación del precio de acuerdo al paquete seleccionado.
- **Edición de Pedido (`editor-client.tsx`):**
  - Se restauró el editor manual de JSON para eventos que no sean de cumpleaños.
  - Se solucionó el problema de envío en JSDOM en el que un clic en un botón externo de guardar borrador no disparaba el submit del formulario natively; el botón ahora apunta a `form="editor-form"` con tipo `submit`.

---

## 4. Normalización de `baby_shower` a `babyshower`

Se modificaron todos los archivos del codebase para normalizar referencias de texto e identificadores:
- [ContactForm.tsx](file:///c:/Proyectos/Inv/src/components/ContactForm.tsx)
- [pedidos-client.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/pedidos-client.tsx)
- [leads-client.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/leads/leads-client.tsx)
- [schemas.ts](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/[id]/editar/schemas.ts)
- [page.tsx](file:///c:/Proyectos/Inv/src/app/(public)/i/[slug]/page.tsx)

---

## 5. Corrección de Errores Críticos de Pruebas

Se detectaron y solucionaron tres problemas en el entorno de pruebas (`vitest`):
1. **Crash en Preprocesador Numérico:**
   - *Problema:* El componente `EditorClient` utilizaba `register("edad", { valueAsNumber: true })`. En los tests de borrador con campos vacíos, este campo retornaba `NaN`, el cual fallaba la validación del esquema de borrador Zod (`z.number().optional()`), impidiendo el guardado.
   - *Solución:* Se implementó `preprocessNumber` en `editor-client.tsx` para filtrar valores `NaN` o no numéricos a `undefined`, haciéndolos pasar de forma segura por el validador opcional.
2. **Leaks de DOM en Vitest:**
   - *Problema:* Al ejecutar pruebas secuencialmente en un único hilo, JSDOM conservaba elementos montados por suites anteriores en `document.body`, causando que el LoginPage tuviera múltiples inputs de contraseña redundantes y fallara con error de RTL.
   - *Solución:* Se actualizó `tests/setup.ts` agregando un gancho `afterEach` global que limpia el DOM después de cada prueba (`document.body.innerHTML = ""`).
3. **Zonas Horarias e ISO Dates:**
   - *Problema:* Las comparaciones de fechas fallaban en entornos locales debido al desplazamiento del huso horario.
   - *Solución:* Se estandarizó el uso de cadenas completas ISO (`new Date().toISOString()`) en las validaciones y los mocks de prueba.

---

## 6. Resultados de Verificación (100% Exitoso)

### Pruebas Unitarias
Todas las 12 suites de pruebas unitarias pasaron con éxito:
```bash
 Test Files  12 passed (12)
      Tests  38 passed (38)
```
- Validadas configuraciones, esquemas, renderizado de plantillas de cumpleaños, Kanban, y RSVPTable.

### Pruebas de Integración
Las 10 suites de integración pasaron correctamente tras corregirse el leak de JSDOM:
```bash
 Test Files  10 passed (10)
      Tests  39 passed (39)
```
- Valizados flujos CRUD de clientes, creación de pedidos, generación de QR, RSVP público, visitas, clonado y estados de pago.
