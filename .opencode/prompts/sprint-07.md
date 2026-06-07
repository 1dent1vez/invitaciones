# 🚀 Sprint 7: Deploy y Lanzamiento — Prompt para Kilo Code

## 📖 Contexto Inicial (LEER ANTES DE CODEAR)

1. `.opencode/architecture.md` — Deploy, variables de entorno, dominio
2. `.opencode/testing-strategy.md` — E2E tests, flujo completo
3. Todo el código de sprints 1-6

## 🎯 Objetivo del Sprint

- Testing end-to-end completo
- Deploy a Vercel producción
- Dominio personalizado configurado
- Checklist de operación y lanzamiento

## 📝 Tareas Atómicas

### Paso 1: Testing End-to-End Completo
- [ ] E2E test con Playwright: flujo completo:
  1. Login en `/login`
  2. Crear cliente en `/admin/clientes`
  3. Crear pedido en `/admin/pedidos/nuevo`
  4. Editar invitación en `/admin/pedidos/[id]/editar`
  5. Publicar invitación
  6. Acceder a URL pública `/i/[slug]`
  7. Enviar RSVP desde invitación pública
  8. Verificar RSVP en panel admin
- [ ] Corregir todos los bugs encontrados durante el test.
- [ ] Revisar responsive en móvil (usar devtools o Playwright mobile viewport).
- [ ] Revisar accesibilidad básica (labels, alt text, contrast).

**Done:** Flujo end-to-end sin errores en local.

### Paso 2: Preparar para Producción
- [ ] Revisar `.env.example` y asegurar que todas las variables están documentadas.
- [ ] Verificar que no hay datos sensibles hardcodeados.
- [ ] Limpiar `console.log` de debug.
- [ ] Revisar que `prisma/schema.prisma` está sincronizado con DB de producción.
- [ ] Crear script de migración para producción: `prisma migrate deploy`.
- [ ] Verificar que `next.config.js` tiene `output: 'standalone'` si es necesario, o config estándar para Vercel.

**Done:** Código listo para deploy.

### Paso 3: Deploy a Vercel
- [ ] Crear proyecto en Vercel, conectar con repo GitHub.
- [ ] Configurar variables de entorno en Vercel Dashboard:
  - `DATABASE_URL` (Neon production)
  - `ADMIN_PASSWORD`
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - `NEXT_PUBLIC_URL` (dominio de producción)
- [ ] Deploy. Verificar que build pasa.
- [ ] Correr `prisma migrate deploy` en Vercel (usar Vercel CLI o script de build).
- [ ] Verificar que la app carga en el dominio de Vercel.

**Done:** App accesible en `https://tusinvitaciones.vercel.app`.

### Paso 4: Dominio Personalizado
- [ ] Configurar dominio comprado (ej. `tusinvitaciones.mx`) en Vercel Dashboard.
- [ ] Añadir registros DNS en proveedor de dominio (CNAME o A records según Vercel).
- [ ] Verificar SSL (HTTPS automático en Vercel).
- [ ] Actualizar `NEXT_PUBLIC_URL` al dominio personalizado.
- [ ] Redeploy.

**Done:** Dominio propio apuntando a Vercel con HTTPS.

### Paso 5: Checklist de Operación
- [ ] Crear `docs/operacion.md` con checklist diaria:
  - Revisar leads nuevos
  - Revisar pedidos próximos a vencer
  - Revisar RSVP pendientes
  - Hacer backup de DB (Neon tiene backups automáticos, documentar)
- [ ] Crear `docs/faq.md` con respuestas a problemas comunes.
- [ ] Documentar cómo crear un nuevo pedido paso a paso.
- [ ] Documentar cómo clonar un pedido.

**Done:** Documentación mínima para operar el negocio.

### Paso 6: Lanzamiento
- [ ] Hacer git commit final: `sprint-7: lanzamiento v1.0`.
- [ ] Crear release en GitHub.
- [ ] Publicar en redes sociales de tu tienda (copiar textos sugeridos).
- [ ] Ofrecer 3 invitaciones gratis a primeros clientes reales a cambio de feedback.
- [ ] Crear formulario de feedback (Google Forms o Typeform).

**Done:** Sistema en producción, recibiendo pedidos reales.

## 🚫 Restricciones del Sprint

- NO añadir nuevas features (congelar scope).
- NO refactorizar código de sprints anteriores a menos que sea bug crítico.
- NO modificar schema de Prisma.
- NO cambiar stack tecnológico.

## 🧪 Tests Obligatorios

- `tests/e2e/flujo-completo.spec.ts` — flujo end-to-end (obligatorio que pase)
- `tests/e2e/responsive.spec.ts` — vistas en mobile y desktop

## 🎯 Checkpoint

- [ ] E2E flujo completo pasa en local
- [ ] Deploy en Vercel exitoso
- [ ] Dominio personalizado funciona con HTTPS
- [ ] Documentación de operación creada
- [ ] Git commit final hecho
- [ ] Release en GitHub

## 🎬 Comando de Kickoff

```
Implementa el Sprint 7: Deploy y Lanzamiento. Congela nuevas features. Enfócate en testing E2E, corregir bugs, deploy a Vercel, configurar dominio personalizado, y documentar operación. No añadas nuevas funcionalidades. Asegúrate de que el flujo completo (login → cliente → pedido → editor → publicar → RSVP → panel) funcione sin errores. Escribe el E2E test con Playwright.
```

## 📊 Formato de Reporte

`sprint-07-report.md` con:
1. Bugs corregidos
2. Estado del deploy (URL, dominio)
3. Resultados E2E
4. Documentación creada
5. Notas finales y próximos pasos post-lanzamiento
