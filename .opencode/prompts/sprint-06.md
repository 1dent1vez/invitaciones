# 🚀 Sprint 6: Polish y Performance — Prompt para Kilo Code

## 📖 Contexto Inicial (LEER ANTES DE CODEAR)

1. `.opencode/architecture.md` — SEO, analytics, Cloudinary optimización
2. `.opencode/conventions.md` — Responsive, manejo de errores
3. `src/app/(public)/page.tsx` — Landing existente
4. `src/app/(public)/i/[slug]/page.tsx` — Página pública existente

## 🎯 Objetivo del Sprint

- Analytics básicos (visitas por invitación)
- SEO + performance optimizada
- Validaciones robustas
- 3 invitaciones demo completas
- Formulario de contacto en landing

## 📝 Tareas Atómicas

### Paso 1: Analytics Básicos
- [ ] En página pública `/i/[slug]`, registrar visita:
  - Server action `registrarVisitaAction(slug, ip, userAgent)`.
  - Guardar en tabla `Visita` (no bloquear render si falla; fire-and-forget).
- [ ] En panel admin `/admin/pedidos/[id]`, mostrar contador de visitas totales.
- [ ] Gráfica simple en dashboard: visitas por día (últimos 7 días).
  - Usar shadcn/ui Chart o librería ligera (recharts si es necesario).

**Done:** Ves que una invitación tuvo 120 visitas. Dashboard muestra gráfica.

### Paso 2: SEO + Performance
- [ ] Optimizar imágenes en Cloudinary: añadir `f_auto,q_auto` a todas las URLs.
- [ ] Lazy loading en galería de landing (`next/image` con `loading="lazy"`).
- [ ] Crear `sitemap.xml` (dinámico o estático).
- [ ] Crear `robots.txt` (permitir todo, excepto `/admin`).
- [ ] Añadir `manifest.json` para PWA básico.
- [ ] Revisar Core Web Vitals: optimizar LCP (hero image), CLS (evitar layout shift en templates).
- [ ] Lighthouse score objetivo: >90 en móvil.

**Done:** Lighthouse audit >90 en móvil.

### Paso 3: Validaciones y Manejo de Errores
- [ ] Validar que formulario de pedido no acepte fechas pasadas (zod).
- [ ] Validar que slug sea único (ya lo hace Prisma, pero manejar error gracefully).
- [ ] Validar que fotos subidas sean válidas (tipo MIME, tamaño ≤ 5MB).
- [ ] Página 404 bonita para invitaciones inexistentes (`src/app/not-found.tsx` personalizada para `/i/[slug]`).
- [ ] Página de error genérica (`src/app/error.tsx`).
- [ ] Toast notifications para errores de server actions (usar shadcn/ui Sonner o Toast).

**Done:** Sistema robusto, no se rompe con datos malos. Usuario ve feedback claro.

### Paso 4: Datos de Prueba + Demos
- [ ] Crear 3 invitaciones de demo completas con datos ficticios pero realistas:
  - Boda: Ana & Carlos, 15 de agosto, Playa del Carmen.
  - XV: María Fernanda, 20 de septiembre, Salón Las Palmas.
  - Baby Shower: Bebé Mateo, 10 de octubre, Casa de los abuelos.
- [ ] Insertar en DB via seed o script.
- [ ] Asegurar que las demos tengan fotos de placeholder de alta calidad (Cloudinary demo images o Unsplash).
- [ ] En landing, galería apunta a demos reales.

**Done:** Demos navegables y realistas.

### Paso 5: Formulario de Contacto en Landing
- [ ] Añadir sección "Contacto" en landing.
- [ ] Formulario: nombre, evento, fecha, teléfono, mensaje.
- [ ] Server action `createLeadAction` que guarda en tabla `Lead`.
- [ ] Notificación: al crear lead, mostrar mensaje de confirmación al usuario.
- [ ] En admin, añadir sección "Leads" con tabla de leads recibidos.

**Done:** Llenas formulario y te llega alerta en el panel.

### Paso 6: Tests
- [ ] Test integration: registrar visita.
- [ ] Test unit: validaciones de fecha (no pasadas).
- [ ] Test unit: validación de tamaño de imagen.
- [ ] Test componente: render de 404.

**Done:** `npm run test:ci` pasa verde.

## 🚫 Restricciones del Sprint

- NO implementar autenticación de múltiples usuarios.
- NO implementar pasarela de pagos.
- NO modificar schema de Prisma (ya soporta todo).
- NO tocar lógica de templates (solo optimizar imágenes).

## 🧪 Tests Obligatorios

- `tests/integration/visitas.test.ts` — registrar visita
- `tests/unit/validaciones.test.ts` — fechas, imágenes
- `tests/unit/components/NotFound.test.tsx` — render 404
- `tests/integration/leads.test.ts` — crear lead desde landing

## 🎯 Checkpoint

- [ ] Analytics de visitas funcionando
- [ ] Lighthouse >90
- [ ] Validaciones robustas
- [ ] 3 demos realistas
- [ ] Formulario de contacto + leads en admin
- [ ] Tests pasan

## 🎬 Comando de Kickoff

```
Implementa el Sprint 6: Polish y Performance. Añade analytics de visitas, optimiza SEO y performance (Lighthouse >90), implementa validaciones robustas, crea 3 demos realistas, y añade formulario de contacto en landing. No toques templates ni lógica de negocio core. Escribe tests para visitas y validaciones.
```

## 📊 Formato de Reporte

`sprint-06-report.md` con:
1. Optimizaciones realizadas
2. Score Lighthouse
3. Demos creados
4. Estado de tests
5. Notas para siguiente sprint
