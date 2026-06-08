# 🔍 AUDITORÍA FASE CUMPLEAÑOS — Instrucciones para Agente de Código

> **Objetivo:** Verificar que la implementación de los 3 paquetes de Cumpleaños (Esencial, Completa, Premium) esté 100% correcta, integrada y funcional.  
> **Output esperado:** `auditoria-cumpleanos-report.md` con hallazgos clasificados por severidad y plan de corrección.  
> **Scope:** NO tocar código. Solo leer, analizar, reportar.

---

## 📋 CHECKLIST MAESTRA DE AUDITORÍA

### 1. CONFIGURACIÓN DE PAQUETES (`src/lib/paquetes.ts`)

| # | Verificación | Criterio de Éxito | Severidad |
|---|------------|-------------------|-----------|
| 1.1 | Existe `src/lib/paquetes.ts` | Archivo presente y exporta config | 🔴 Bloqueante |
| 1.2 | Hay exactamente 12 paquetes definidos | Array de 12 objetos con `id`, `nombre`, `tipoEvento`, `precio`, `campos`, `secciones` | 🔴 Bloqueante |
| 1.3 | Solo 3 paquetes de Cumpleaños tienen `implementado: true` | Esencial, Completa, Premium = `true`. Los otros 9 = `false` | 🔴 Bloqueante |
| 1.4 | Precios correctos | Esencial: $350, Completa: $550, Premium: $850 | 🔴 Bloqueante |
| 1.5 | Cada paquete tiene array `campos` definido | Lista de campos editables que el usuario puede personalizar | 🔴 Bloqueante |
| 1.6 | Cada paquete tiene array `secciones` definido | Lista de secciones visibles en la invitación final | 🔴 Bloqueante |
| 1.7 | Campos de paquetes NO implementados están vacíos o null | Los 9 paquetes "Próximamente" no tienen campos/secciones fantasmas | 🟡 Medio |
| 1.8 | No hay duplicados de `id` | Cada paquete tiene ID único | 🔴 Bloqueante |
| 1.9 | `tipoEvento` es consistente | Los 3 paquetes de cumpleaños tienen `tipoEvento: "cumpleanos"` | 🔴 Bloqueante |

#### Campos esperados por paquete (Cumpleaños):

**🎂 Esencial ($350):**
- `nombreCumpleanero` (texto, obligatorio)
- `fechaEvento` (date, obligatorio)
- `horaEvento` (time, obligatorio)
- `lugarEvento` (texto, obligatorio)
- `mensajeBienvenida` (textarea, opcional, default genérico)
- `fotoPrincipal` (imagen, opcional)

**🎉 Completa ($550):**
- Todos los campos de Esencial +
- `edadCumpleanero` (number, opcional)
- `temaEvento` (select: infantil/juvenil/adulto/general, default: general)
- `mensajePersonalizado` (textarea, opcional)
- `fotoGaleria` (array de imágenes, máx 3)
- `musicaFondo` (URL o select, opcional)
- `colorPrimario` (color picker, default: #FF6B6B)
- `colorSecundario` (color picker, default: #4ECDC4)

**🎁 Premium ($850):**
- Todos los campos de Completa +
- `fechaLimiteRSVP` (date, opcional)
- `mensajeAgradecimiento` (textarea, opcional)
- `fotoGaleria` (array de imágenes, máx 6 — diferente a Completa)
- `codigoVestimenta` (select: casual/formal/temática/elegante, opcional)
- `linkRegalos` (URL, opcional)
- `mapaPersonalizado` (boolean + coordenadas, opcional)
- `confettiAnimacion` (boolean, default: true)
- `cuentaRegresiva` (boolean, default: true)

---

### 2. SCHEMA DE PRISMA (`prisma/schema.prisma`)

| # | Verificación | Criterio de Éxito | Severidad |
|---|------------|-------------------|-----------|
| 2.1 | Modelo `Pedido` tiene `tipoEvento` | Campo enum o string: `["cumpleanos", "boda", "xv", "babyshower"]` | 🔴 Bloqueante |
| 2.2 | Modelo `Pedido` tiene `paquete` | Campo string con el ID del paquete seleccionado | 🔴 Bloqueante |
| 2.3 | Modelo `Pedido` tiene `datosInvitacion` | Campo JSON para almacenar los campos personalizados | 🔴 Bloqueante |
| 2.4 | Modelo `Invitacion` (o equivalente) tiene `slug` | Slug único para URL pública | 🔴 Bloqueante |
| 2.5 | Modelo `Invitacion` tiene `estado` | Enum: `["borrador", "publicada", "archivada"]` | 🔴 Bloqueante |
| 2.6 | Modelo `Invitacion` tiene `templateHTML` o referencia a template | Relación o campo que identifica qué template renderizar | 🔴 Bloqueante |
| 2.7 | Migraciones aplicadas en Neon | Revisar que `prisma migrate status` o última migración incluya estos campos | 🔴 Bloqueante |
| 2.8 | No hay campos duplicados o deprecados | No hay campos viejos que ya no se usen | 🟡 Medio |
| 2.9 | Índices correctos | `slug` tiene `@unique`, `tipoEvento` tiene índice si se filtra frecuentemente | 🟢 Bajo |

---

### 3. TEMPLATES DE CUMPLEAÑOS (`src/components/templates/cumpleanos/` o similar)

| # | Verificación | Criterio de Éxito | Severidad |
|---|------------|-------------------|-----------|
| 3.1 | Existen 3 templates de cumpleaños | Carpeta o archivos separados para Esencial, Completa, Premium | 🔴 Bloqueante |
| 3.2 | Template Esencial renderiza todos sus campos | `nombreCumpleanero`, `fechaEvento`, `horaEvento`, `lugarEvento`, `mensajeBienvenida`, `fotoPrincipal` | 🔴 Bloqueante |
| 3.3 | Template Completa renderiza todos sus campos | Incluye los de Esencial + `edad`, `tema`, `mensajePersonalizado`, galería (3 fotos), colores | 🔴 Bloqueante |
| 3.4 | Template Premium renderiza todos sus campos | Incluye los de Completa + RSVP, agradecimiento, galería (6 fotos), vestimenta, regalos, mapa, confetti, cuenta regresiva | 🔴 Bloqueante |
| 3.5 | Diseño es "festivo" | Colores vivos, tipografía alegre, animaciones suaves (Framer Motion), sin look genérico | 🟡 Medio |
| 3.6 | Templates NO implementados usan `Proximamente.tsx` | Los 9 paquetes de Boda/XV/Baby Shower renderizan componente "Próximamente" sin crashear | 🔴 Bloqueante |
| 3.7 | Responsive design | Templates se ven bien en mobile (320px) y desktop | 🔴 Bloqueante |
| 3.8 | OG tags dinámicos | `og:title`, `og:description`, `og:image` usan datos del cumpleañero | 🟡 Medio |
| 3.9 | Meta tags correctos | `title`, `description` personalizados por invitación | 🟡 Medio |
| 3.10 | QR generado correctamente | Cloudinary o librería genera QR apuntando a la URL pública del slug | 🟡 Medio |

#### Comportamiento específico por template:

**Esencial:**
- [ ] Layout centrado, hero con nombre grande
- [ ] Fecha y hora en formato legible (ej: "Sábado 15 de Agosto, 2026 · 7:00 PM")
- [ ] Lugar con icono de ubicación
- [ ] Foto principal como background o hero image (si existe, si no, gradiente festivo)
- [ ] Sin secciones extra (no galería, no RSVP, no cuenta regresiva)

**Completa:**
- [ ] Todo lo de Esencial +
- [ ] Badge de edad visible (ej: "¡Estoy cumpliendo 25 años!" o "¡Mis XV...!" adaptado)
- [ ] Tema aplica clase CSS o estilo visual (infantil = más colores/ilustraciones, adulto = elegante)
- [ ] Galería de fotos con grid o carousel (máximo 3)
- [ ] Colores primario/secundario aplicados a botones, fondos, acentos
- [ ] Música de fondo opcional (si se proporcionó URL, botón de play/pause)

**Premium:**
- [ ] Todo lo de Completa +
- [ ] RSVP con fecha límite visible ("Confirma antes del 10 de Agosto")
- [ ] Mensaje de agradecimiento post-RSVP o en footer
- [ ] Galería ampliada (máximo 6 fotos)
- [ ] Código de vestimenta con icono descriptivo
- [ ] Link de regalos como botón destacado (si existe)
- [ ] Mapa embebido o imagen de mapa (si se proporcionó)
- [ ] Confetti animation al cargar la página (Framer Motion o canvas)
- [ ] Cuenta regresiva animada hasta la fecha del evento (días, horas, minutos, segundos)

---

### 4. EDITOR DE INVITACIÓN (`src/components/editor/` o similar)

| # | Verificación | Criterio de Éxito | Severidad |
|---|------------|-------------------|-----------|
| 4.1 | Editor carga campos según paquete seleccionado | Si el pedido es Esencial, solo muestra campos de Esencial | 🔴 Bloqueante |
| 4.2 | Editor NO muestra campos de paquetes superiores | Esencial no ve campos de Premium | 🔴 Bloqueante |
| 4.3 | Split screen funciona | Panel izquierdo: formulario. Panel derecho: preview en tiempo real | 🔴 Bloqueante |
| 4.4 | Preview se actualiza en tiempo real | Al escribir en un campo, la preview refleja el cambio sin lag >500ms | 🔴 Bloqueante |
| 4.5 | Todos los tipos de campo renderizan correctamente | text, textarea, number, date, time, select, color, image, boolean | 🔴 Bloqueante |
| 4.6 | Validación de campos obligatorios | Campos marcados como required tienen validación visual y lógica | 🔴 Bloqueante |
| 4.7 | Upload de imágenes a Cloudinary | Selector de imagen sube a Cloudinary y devuelve URL segura | 🔴 Bloqueante |
| 4.8 | Galería de imágenes permite agregar/eliminar/reordenar | UI de galería funcional con límites (3 o 6 según paquete) | 🔴 Bloqueante |
| 4.9 | Color picker funciona | Selector de color actualiza preview inmediatamente | 🔴 Bloqueante |
| 4.10 | Selects tienen opciones correctas | `temaEvento`, `codigoVestimenta` muestran opciones definidas en config | 🔴 Bloqueante |
| 4.11 | Editor NO crashea al cambiar entre paquetes | Navegación fluida entre pedidos de diferente paquete | 🔴 Bloqueante |
| 4.12 | Editor maneja estado de "cargando" | Skeleton o spinner mientras carga datos del pedido | 🟡 Medio |
| 4.13 | Editor maneja estado de "error" | Mensaje claro si falla carga de datos o guardado | 🟡 Medio |
| 4.14 | Editor es responsive | Usable en tablet y desktop (split screen se adapta) | 🟡 Medio |

#### Validación de campos específicos en el editor:

- [ ] `nombreCumpleanero`: input text, max 100 chars, required
- [ ] `fechaEvento`: input date, required, no permite fechas pasadas
- [ ] `horaEvento`: input time, required
- [ ] `lugarEvento`: input text, required, max 200 chars
- [ ] `mensajeBienvenida`: textarea, max 500 chars, placeholder genérico
- [ ] `fotoPrincipal`: upload image, max 5MB, preview thumbnail
- [ ] `edadCumpleanero`: input number, min 1, max 120, optional
- [ ] `temaEvento`: select con opciones [infantil, juvenil, adulto, general]
- [ ] `mensajePersonalizado`: textarea, max 1000 chars, optional
- [ ] `fotoGaleria`: multi-upload, max 3 (Completa) o 6 (Premium), preview grid
- [ ] `musicaFondo`: input URL, validación de formato URL, optional
- [ ] `colorPrimario`: color picker, default #FF6B6B
- [ ] `colorSecundario`: color picker, default #4ECDC4
- [ ] `fechaLimiteRSVP`: input date, debe ser anterior a `fechaEvento`, optional
- [ ] `mensajeAgradecimiento`: textarea, max 500 chars, optional
- [ ] `codigoVestimenta`: select [casual, formal, temática, elegante]
- [ ] `linkRegalos`: input URL, validación de formato, optional
- [ ] `mapaPersonalizado`: toggle boolean + campos de lat/lng o dirección
- [ ] `confettiAnimacion`: toggle boolean, default true
- [ ] `cuentaRegresiva`: toggle boolean, default true

---

### 5. GUARDADO DE BORRADORES

| # | Verificación | Criterio de Éxito | Severidad |
|---|------------|-------------------|-----------|
| 5.1 | Botón "Guardar borrador" existe | Visible en el editor, siempre accesible | 🔴 Bloqueante |
| 5.2 | Guardado automático cada 30 segundos | Debounce de 30s si hay cambios sin guardar | 🟡 Medio |
| 5.3 | Estado "Guardando..." visible | Spinner o texto durante la operación | 🟡 Medio |
| 5.4 | Confirmación de guardado exitoso | Toast o checkmark verde | 🟡 Medio |
| 5.5 | Datos se guardan en `datosInvitacion` (JSON) | Revisar en DB que el JSON contiene todos los campos editados | 🔴 Bloqueante |
| 5.6 | Borrador recupera datos al recargar | Al volver a abrir el editor, los campos mantienen valores guardados | 🔴 Bloqueante |
| 5.7 | Borrador no publica la invitación | Estado sigue siendo "borrador" tras guardar | 🔴 Bloqueante |
| 5.8 | Botón "Publicar" separado de "Guardar" | Dos acciones distintas, publicar cambia estado a "publicada" | 🔴 Bloqueante |
| 5.9 | Publicar genera slug único | Slug basado en nombre + fecha o UUID corto, único en DB | 🔴 Bloqueante |
| 5.10 | Publicar actualiza OG tags | Meta tags se regeneran con datos actualizados | 🟡 Medio |
| 5.11 | No hay pérdida de datos entre guardados | Guardar múltiples veces no borra campos previos | 🔴 Bloqueante |
| 5.12 | Manejo de concurrencia | Si dos pestañas editan, último guardado gana (acceptable) o hay lock | 🟢 Bajo |

---

### 6. VISTA PREVIA (PREVIEW) EN TIEMPO REAL

| # | Verificación | Criterio de Éxito | Severidad |
|---|------------|-------------------|-----------|
| 6.1 | Preview usa el template correcto del paquete | Esencial usa template Esencial, etc. | 🔴 Bloqueante |
| 6.2 | Preview muestra datos actuales del formulario | Sincronización bidireccional o unidireccional inmediata | 🔴 Bloqueante |
| 6.3 | Preview maneja campos vacíos graceful | Placeholders o defaults en lugar de "undefined" o blank | 🔴 Bloqueante |
| 6.4 | Preview actualiza colores inmediatamente | Cambio de color picker se ve en preview sin delay | 🔴 Bloqueante |
| 6.5 | Preview actualiza imágenes inmediatamente | Upload de foto se ve en preview tras URL lista | 🔴 Bloqueante |
| 6.6 | Preview es fiel al template final publicado | Lo que se ve en preview = lo que verá el invitado | 🔴 Bloqueante |
| 6.7 | Preview tiene toggle "Vista Mobile/Desktop" | Simulador de viewport para verificar responsive | 🟡 Medio |
| 6.8 | Preview NO permite interacción real | Botones de RSVP en preview son decorativos o deshabilitados | 🟡 Medio |
| 6.9 | Preview muestra watermark o indicador de borrador | "Vista previa" o "Borrador" visible para diferenciar de publicada | 🟢 Bajo |
| 6.10 | Preview performance | No hay re-renders excesivos, no lag al escribir rápido | 🟡 Medio |

---

### 7. WIZARD DE CREACIÓN DE PEDIDO

| # | Verificación | Criterio de Éxito | Severidad |
|---|------------|-------------------|-----------|
| 7.1 | Wizard paso 1: selección de evento | Solo "Cumpleaños" está habilitado, otros muestran "Próximamente" | 🔴 Bloqueante |
| 7.2 | Wizard paso 2: selección de paquete | Muestra solo 3 paquetes de cumpleaños con precios correctos | 🔴 Bloqueante |
| 7.3 | Wizard paso 2: paquetes no implementados bloqueados | Boda/XV/Baby Shower no se pueden seleccionar | 🔴 Bloqueante |
| 7.4 | Wizard crea pedido con `tipoEvento` y `paquete` correctos | Revisar en DB tras crear | 🔴 Bloqueante |
| 7.5 | Wizard redirige al editor tras crear | URL: `/admin/pedidos/[id]/editar` o similar | 🔴 Bloqueante |
| 7.6 | Wizard guarda cliente correctamente | Cliente vinculado al pedido | 🔴 Bloqueante |
| 7.7 | Wizard calcula precio correcto | Precio base = precio del paquete seleccionado | 🔴 Bloqueante |
| 7.8 | Wizard permite búsqueda de cliente existente | Autocomplete o selector de clientes previos | 🟡 Medio |
| 7.9 | Wizard valida campos obligatorios del cliente | Nombre, teléfono, email (formato correcto) | 🔴 Bloqueante |

---

### 8. INTEGRACIÓN END-TO-END

| # | Verificación | Criterio de Éxito | Severidad |
|---|------------|-------------------|-----------|
| 8.1 | Flujo completo: Crear pedido → Editar → Guardar borrador → Publicar → Ver invitación pública | Sin errores en consola ni en UI | 🔴 Bloqueante |
| 8.2 | Flujo RSVP (Premium): Invitado abre URL → Llena RSVP → Admin ve confirmación en panel | Datos persisten en DB | 🔴 Bloqueante |
| 8.3 | Flujo Analytics: Visita a invitación pública incrementa contador | Analytics registra visita | 🟡 Medio |
| 8.4 | QR escaneado redirige a slug correcto | URL pública funciona desde QR | 🟡 Medio |
| 8.5 | Notificación WA genera texto con datos correctos | Nombre, fecha, lugar, URL del slug incluidos | 🟡 Medio |
| 8.6 | Panel admin muestra pedidos de cumpleaños con badge correcto | Badge "Cumpleaños · Esencial" visible en kanban/lista | 🟡 Medio |
| 8.7 | Dashboard incluye métricas de cumpleaños | Pedidos de cumpleaños cuentan en métricas del mes | 🟡 Medio |
| 8.8 | Búsqueda de pedidos funciona con nuevos campos | Buscar por nombre de cumpleañero funciona | 🟡 Medio |
| 8.9 | Clonado de pedido limpia datos sensibles y copia estructura | Clon de cumpleaños crea nuevo borrador con campos vacíos | 🟡 Medio |
| 8.10 | Export CSV de RSVP incluye datos de cumpleaños | Nombre del evento, fecha, nombre del invitado, respuesta | 🟡 Medio |

---

### 9. TESTS

| # | Verificación | Criterio de Éxito | Severidad |
|---|------------|-------------------|-----------|
| 9.1 | Tests de `src/lib/paquetes.ts` | Config de paquetes tiene tests unitarios | 🟡 Medio |
| 9.2 | Tests de templates de cumpleaños | Renderizado de cada template con props mínimas y completas | 🟡 Medio |
| 9.3 | Tests de editor | Cambio de campo actualiza estado, guardado llama API correcta | 🟡 Medio |
| 9.4 | Tests de wizard (cumpleaños only) | Creación de pedido con paquete cumpleaños funciona | 🟡 Medio |
| 9.5 | Tests de publicación | Cambio de estado a "publicada", generación de slug | 🟡 Medio |
| 9.6 | Tests pasan en CI | `npm test` o equivalente pasa sin errores | 🔴 Bloqueante |
| 9.7 | Coverage de nuevos módulos > 70% | Paquetes, templates, editor tienen cobertura razonable | 🟢 Bajo |

---

### 10. PERFORMANCE & BUILD

| # | Verificación | Criterio de Éxito | Severidad |
|---|------------|-------------------|-----------|
| 10.1 | `npm run build` pasa sin errores | Next.js build exitoso | 🔴 Bloqueante |
| 10.2 | No hay console errors en runtime | Consola limpia al navegar editor, preview, invitación pública | 🔴 Bloqueante |
| 10.3 | No hay console warnings críticos | Warnings de React (key props, deprecated APIs) resueltos | 🟡 Medio |
| 10.4 | Lighthouse score > 90 en invitación pública | Performance, Accessibility, Best Practices, SEO | 🟡 Medio |
| 10.5 | Imágenes optimizadas | Next.js Image component o Cloudinary transforms usados | 🟡 Medio |
| 10.6 | Bundle size razonable | Templates de cumpleaños no añaden > 200KB al bundle | 🟢 Bajo |

---

## 🏷️ CLASIFICACIÓN DE HALLAZGOS

Para cada hallazgo encontrado, clasificar así:

| Severidad | Definición | Acción requerida |
|-----------|-----------|-----------------|
| 🔴 **Bloqueante** | Funcionalidad rota, crash, data loss, seguridad | Debe corregirse antes de deploy |
| 🟡 **Medio** | Funciona pero con bugs menores, UX deficiente, deuda técnica | Debe corregirse en el siguiente sprint |
| 🟢 **Bajo** | Mejora, optimización, polish | Puede esperar o ser nice-to-have |

---

## 📄 FORMATO DEL REPORTE (`auditoria-cumpleanos-report.md`)

El agente debe generar un archivo con esta estructura exacta:

```markdown
# 📊 AUDITORÍA FASE CUMPLEAÑOS — Reporte

**Fecha:** [auto-generada]  
**Auditor:** Agente de Código  
**Commit base:** [hash del último commit]  
**Total checks:** 70+  
**Estado general:** [✅ Aprobado / ⚠️ Aprobado con observaciones / ❌ Rechazado]

---

## 📈 RESUMEN EJECUTIVO

| Categoría | ✅ Pass | ⚠️ Medio | ❌ Bloqueante | 🟢 Bajo |
|-----------|--------|----------|--------------|---------|
| Configuración | X | X | X | X |
| Schema | X | X | X | X |
| Templates | X | X | X | X |
| Editor | X | X | X | X |
| Borradores | X | X | X | X |
| Preview | X | X | X | X |
| Wizard | X | X | X | X |
| Integración | X | X | X | X |
| Tests | X | X | X | X |
| Performance | X | X | X | X |

**Total:** X/70+ checks pasados

---

## 🔴 HALLAZGOS BLOQUEANTES

### [ID-01] Título del hallazgo
- **Check:** #X.X — Nombre del check
- **Archivo:** `ruta/al/archivo.ts`
- **Descripción:** Qué se encontró, qué se esperaba
- **Evidencia:** Código relevante o error
- **Impacto:** Qué se rompe si no se corrige
- **Recomendación:** Cómo corregirlo

### [ID-02] ...

---

## 🟡 HALLAZGOS MEDIOS

### [ID-XX] ...
- **Check:** #X.X
- **Archivo:** ...
- **Descripción:** ...
- **Recomendación:** ...

---

## 🟢 HALLAZGOS BAJOS / MEJORAS

### [ID-YY] ...

---

## 📋 PLAN DE CORRECCIÓN

### Fase 1: Bloqueantes (Antes de deploy)
| ID | Hallazgo | Archivo | Estimación | Prioridad |
|----|----------|---------|------------|-----------|
| ID-01 | ... | ... | 2h | P0 |

### Fase 2: Medios (Próximo sprint)
| ID | Hallazgo | Archivo | Estimación | Prioridad |
|----|----------|---------|------------|-----------|
| ID-XX | ... | ... | 1h | P1 |

### Fase 3: Bajos (Backlog)
| ID | Hallazgo | Archivo | Estimación | Prioridad |
|----|----------|---------|------------|-----------|
| ID-YY | ... | ... | 30min | P2 |

---

## ✅ CHECKS QUE PASARON (Resumen)

- #1.1 Configuración de paquetes existe
- #3.1 Templates de cumpleaños existen
- ...

---

## 📝 NOTAS DEL AUDITOR

[Observaciones adicionales, contexto, suposiciones]
```

---

## 🛠️ INSTRUCCIONES DE EJECUCIÓN PARA EL AGENTE

1. **NO modifiques código.** Solo lee, analiza y reporta.
2. **Revisa archivo por archivo** siguiendo el orden de la checklist (1 → 10).
3. **Para cada check:**
   - Lee el archivo relevante
   - Verifica el criterio de éxito
   - Anota Pass, Medio, Bloqueante o Bajo
   - Si falla, documenta evidencia con líneas de código o mensajes de error
4. **Al final:** Genera `auditoria-cumpleanos-report.md` en la raíz del proyecto
5. **Si un archivo no existe:** Marcar como Bloqueante con nota "Archivo no encontrado en [ruta esperada]"
6. **Si no estás seguro:** Marcar como Medio con nota "Requiere verificación manual"
7. **Commit:** Al terminar, ejecuta `git add auditoria-cumpleanos-report.md && git commit -m "audit: fase cumpleaños report"`
