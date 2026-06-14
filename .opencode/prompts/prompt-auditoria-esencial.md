# 🔍 AUDITORÍA PUNTUAL — Paquete Esencial de Cumpleaños

> **Objetivo:** Verificar que el template del paquete Esencial de Cumpleaños cumple EXACTAMENTE con la especificación del documento de producto.  
> **Scope:** SOLO el paquete Esencial ($350). No tocar Completa ni Premium.  
> **Output:** `auditoria-esencial-report.md` con hallazgos clasificados.  
> **Regla:** Solo leer y reportar. NO modificar código.

---

## 📋 CHECKLIST DE AUDITORÍA — Paquete Esencial

### 1. SECCIONES DE LA INVITACIÓN (5 secciones obligatorias)

| # | Sección | ¿Existe? | ¿Renderiza correctamente? | Severidad |
|---|---------|----------|---------------------------|-----------|
| 1.1 | **Portada** — Foto + nombre + edad + frase | ⬜ | ⬜ | 🔴 |
| 1.2 | **Detalles** — Fecha, hora, lugar, botón mapa | ⬜ | ⬜ | 🔴 |
| 1.3 | **Mensaje** — Texto personalizado (condicional) | ⬜ | ⬜ | 🔴 |
| 1.4 | **Confirmación (RSVP)** — Formulario nombre/asiste/pax/mensaje | ⬜ | ⬜ | 🔴 |
| 1.5 | **Footer** — Branding + año + link discreto | ⬜ | ⬜ | 🟡 |

**Criterio:** Si falta alguna sección 1.1-1.4, es bloqueante. La 1.5 es medio.

---

### 2. PORTADA (Sección 1)

| # | Elemento | Especificación | ¿Cumple? | Severidad |
|---|----------|---------------|----------|-----------|
| 2.1 | Foto del festejado | 1 imagen, ocupa 60% superior en móvil | ⬜ | 🔴 |
| 2.2 | Nombre | Máximo 40 chars, tipografía grande (clamp 2rem-3rem) | ⬜ | 🔴 |
| 2.3 | Edad | Número, renderiza como "¡30 años!" | ⬜ | 🔴 |
| 2.4 | Frase | Si no hay mensaje, usa default según rango de edad | ⬜ | 🔴 |
| 2.5 | Fade-in suave | 0.5s al cargar | ⬜ | 🟡 |

**Frases default por rango de edad:**

| Edad | Frase esperada |
|------|---------------|
| 1-5 | "¡Estoy cumpliendo [edad] añitos!" |
| 6-17 | "¡Celebremos mis [edad] años!" |
| 18-29 | "¡Un año más de vida, un año más de aventuras!" |
| 30-49 | "¡[edad] años y contando!" |
| 50+ | "¡[edad] años de historias por celebrar!" |

**Verificación:** Crear pedido con diferentes edades y verificar que la frase correcta aparece.

---

### 3. DETALLES DEL EVENTO (Sección 2)

| # | Elemento | Especificación | ¿Cumple? | Severidad |
|---|----------|---------------|----------|-----------|
| 3.1 | Fecha | Formato: "Sábado 15 de noviembre de 2026" (`Intl.DateTimeFormat` es-MX) | ⬜ | 🔴 |
| 3.2 | Hora | Formato: "19:00 hrs" | ⬜ | 🔴 |
| 3.3 | Nombre del lugar | Texto plano, ej: "Terraza La Vista" | ⬜ | 🔴 |
| 3.4 | Dirección | Texto completo, truncado con "Ver más" si > 3 líneas | ⬜ | 🟡 |
| 3.5 | Botón de mapa | Si `mapsLink` existe → ese link; si no → búsqueda automática Google Maps con `direccion` | ⬜ | 🔴 |

**Verificación del botón de mapa:**
- Caso A: `mapsLink` existe → href = `mapsLink`
- Caso B: `mapsLink` vacío → href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`

---

### 4. MENSAJE PERSONALIZADO (Sección 3)

| # | Elemento | Especificación | ¿Cumple? | Severidad |
|---|----------|---------------|----------|-----------|
| 4.1 | Texto del festejado | Si existe `mensaje`, renderiza en blockquote/card con ícono de comillas | ⬜ | 🔴 |
| 4.2 | Comportamiento condicional | Si NO existe `mensaje`, la sección NO aparece (sin espacio vacío) | ⬜ | 🔴 |

---

### 5. CONFIRMACIÓN RSVP (Sección 4)

| # | Campo | Tipo | Obligatorio | Validación | ¿Cumple? | Severidad |
|---|-------|------|-------------|------------|----------|-----------|
| 5.1 | Nombre completo | Texto | Sí | Mínimo 3 caracteres | ⬜ | 🔴 |
| 5.2 | ¿Asistirás? | Toggle Sí/No | Sí | Default: Sí | ⬜ | 🔴 |
| 5.3 | Número de personas | Número (1-10) | Solo si "Sí" | Default: 1, max 10 | ⬜ | 🔴 |
| 5.4 | Mensaje para el festejado | Textarea | No | Máximo 200 caracteres | ⬜ | 🟡 |
| 5.5 | Botón "Confirmar" | Submit | — | — | ⬜ | 🔴 |
| 5.6 | Mensaje de éxito | "¡Gracias! Tu confirmación ha sido enviada" | — | — | ⬜ | 🔴 |
| 5.7 | Confeti CSS opcional | Animación al confirmar | — | — | ⬜ | 🟢 |

**Flujo de verificación:**
1. Abrir invitación pública
2. Scrollear a RSVP
3. Llenar nombre, dejar "Sí" marcado, pax = 2
4. Click "Confirmar"
5. Verificar: mensaje de éxito aparece, datos se guardan en DB

---

### 6. FOOTER (Sección 5)

| # | Elemento | Especificación | ¿Cumple? | Severidad |
|---|----------|---------------|----------|-----------|
| 6.1 | Branding | "Invitación creada por [TuMarca]" | ⬜ | 🟡 |
| 6.2 | Año | "2026" (dinámico, `new Date().getFullYear()`) | ⬜ | 🟡 |
| 6.3 | Link discreto | "¿Quieres una invitación como esta?" → landing page | ⬜ | 🟡 |

---

### 7. DATOS DEL CUESTIONARIO (10 campos)

| # | Campo | Tipo | Obligatorio | ¿Existe en editor? | ¿Se guarda en DB? | ¿Se renderiza? | Severidad |
|---|-------|------|-------------|-------------------|------------------|----------------|-----------|
| 7.1 | `nombre` | Texto | Sí | ⬜ | ⬜ | ⬜ | 🔴 |
| 7.2 | `edad` | Número | Sí | ⬜ | ⬜ | ⬜ | 🔴 |
| 7.3 | `fecha` | Fecha | Sí | ⬜ | ⬜ | ⬜ | 🔴 |
| 7.4 | `hora` | Hora | Sí | ⬜ | ⬜ | ⬜ | 🔴 |
| 7.5 | `lugar` | Texto | Sí | ⬜ | ⬜ | ⬜ | 🔴 |
| 7.6 | `direccion` | Texto largo | Sí | ⬜ | ⬜ | ⬜ | 🔴 |
| 7.7 | `mapsLink` | URL | No | ⬜ | ⬜ | ⬜ | 🟡 |
| 7.8 | `fotoPortada` | Imagen (1) | Sí | ⬜ | ⬜ | ⬜ | 🔴 |
| 7.9 | `mensaje` | Texto largo | No | ⬜ | ⬜ | ⬜ | 🔴 |
| 7.10 | `whatsapp` | Teléfono | Sí | ⬜ | ⬜ | ⬜ | 🟡 |

**Nota:** Los campos del cuestionario deben existir en el editor, guardarse en `datosInvitacion` (JSON), y renderizarse en el template.

---

### 8. ESPECIFICACIONES TÉCNICAS

| # | Métrica | Objetivo | ¿Cumple? | Severidad |
|---|---------|----------|----------|-----------|
| 8.1 | First Contentful Paint | < 1.5s | ⬜ | 🟡 |
| 8.2 | Largest Contentful Paint | < 2.5s | ⬜ | 🟡 |
| 8.3 | Tamaño total de página | < 500KB (sin foto del cliente) | ⬜ | 🟡 |
| 8.4 | Foto del cliente | Cloudinary con `f_auto,q_auto,w_800` | ⬜ | 🟡 |
| 8.5 | Mobile-first | 80% de usuarios en celular | ⬜ | 🔴 |
| 8.6 | Breakpoint | `md:` para tablets/desktop | ⬜ | 🟡 |
| 8.7 | Tipografía escalable | `clamp()` | ⬜ | 🟡 |
| 8.8 | Contraste mínimo | 4.5:1 | ⬜ | 🟡 |
| 8.9 | Botones mínimo | 44x44px | ⬜ | 🟡 |
| 8.10 | Labels en formularios | Asociados correctamente | ⬜ | 🟡 |

---

### 9. LO QUE NO DEBE INCLUIR (alcance limitado)

| # | Elemento | ¿Está presente? | Severidad |
|---|----------|-----------------|-----------|
| 9.1 | Galería de fotos (múltiples) | ⬜ | 🔴 (si está) |
| 9.2 | Música de fondo | ⬜ | 🔴 (si está) |
| 9.3 | Contador regresivo | ⬜ | 🔴 (si está) |
| 9.4 | Código de vestimenta como sección visual | ⬜ | 🔴 (si está) |
| 9.5 | Buzón de deseos | ⬜ | 🔴 (si está) |
| 9.6 | Álbum QR post-evento | ⬜ | 🔴 (si está) |
| 9.7 | Segundo idioma | ⬜ | 🔴 (si está) |
| 9.8 | Historia del festejado | ⬜ | 🔴 (si está) |
| 9.9 | Temática personalizada | ⬜ | 🔴 (si está) |

**Si alguno de estos elementos está presente en el template Esencial, es un bloqueante** — está violando el alcance del paquete de entrada.

---

### 10. FLUJO END-TO-END

| # | Paso | ¿Funciona? | Severidad |
|---|------|-----------|-----------|
| 10.1 | Crear pedido Esencial en wizard | ⬜ | 🔴 |
| 10.2 | Abrir editor, ver 10 campos del cuestionario | ⬜ | 🔴 |
| 10.3 | Llenar datos, subir foto, guardar borrador | ⬜ | 🔴 |
| 10.4 | Ver preview con datos reales | ⬜ | 🔴 |
| 10.5 | Publicar invitación | ⬜ | 🔴 |
| 10.6 | Abrir URL pública, ver 5 secciones | ⬜ | 🔴 |
| 10.7 | Confirmar RSVP desde invitación pública | ⬜ | 🔴 |
| 10.8 | Ver confirmación en panel admin | ⬜ | 🔴 |
| 10.9 | Generar QR automáticamente | ⬜ | 🟡 |
| 10.10 | Meta tags OG al compartir en WhatsApp | ⬜ | 🟡 |

---

## 🏷️ CLASIFICACIÓN DE HALLAZGOS

| Severidad | Definición | Acción |
|-----------|-----------|--------|
| 🔴 **Bloqueante** | Falta sección obligatoria, campo obligatorio no funciona, elemento fuera de alcance presente | Corregir antes de entregar al cliente |
| 🟡 **Medio** | Especificación técnica no cumplida (performance, accesibilidad), campo opcional no funciona | Corregir en siguiente iteración |
| 🟢 **Bajo** | Polish, animación faltante, mejora visual | Nice-to-have |

---

## 📄 FORMATO DEL REPORTE (`auditoria-esencial-report.md`)

```markdown
# 🔍 AUDITORÍA — Paquete Esencial de Cumpleaños

**Fecha:** [auto]  
**Auditor:** Agente de Código  
**Template:** `src/components/templates/cumpleanos/CumpleEsencial.tsx`  
**Estado general:** [✅ Aprobado / ⚠️ Aprobado con observaciones / ❌ Rechazado]

---

## 📈 RESUMEN

| Categoría | ✅ Pass | ⚠️ Medio | ❌ Bloqueante |
|-----------|--------|----------|--------------|
| Secciones | X | X | X |
| Portada | X | X | X |
| Detalles | X | X | X |
| Mensaje | X | X | X |
| RSVP | X | X | X |
| Footer | X | X | X |
| Campos cuestionario | X | X | X |
| Especificaciones técnicas | X | X | X |
| Alcance (no incluye) | X | X | X |
| Flujo E2E | X | X | X |

---

## 🔴 HALLAZGOS BLOQUEANTES

### [E-01] Título
- **Check:** #X.X — Nombre del check
- **Evidencia:** Código o screenshot
- **Impacto:** Qué se rompe
- **Recomendación:** Cómo corregir

---

## 🟡 HALLAZGOS MEDIOS

### [E-XX] ...

---

## 🟢 HALLAZGOS BAJOS

### [E-YY] ...

---

## ✅ CHECKS QUE PASARON

- #2.1 Foto del festejado renderiza
- ...

---

## 📝 NOTAS DEL AUDITOR

[Observaciones]
```

---

## 🛠️ INSTRUCCIONES DE EJECUCIÓN

1. **Lee el template** `src/components/templates/cumpleanos/CumpleEsencial.tsx` completo.
2. **Lee el editor** `src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx` y verifica qué campos muestra para el paquete Esencial.
3. **Lee `src/lib/paquetes.ts`** y verifica la config del paquete Esencial.
4. **Crea un pedido de prueba** (si es posible) o revisa un pedido existente con paquete Esencial.
5. **Abre la invitación pública** y verifica cada sección visualmente.
6. **Prueba el RSVP** desde la invitación pública.
7. **Genera el reporte** con todos los hallazgos.
8. **NO modifiques código.** Solo reporta.
