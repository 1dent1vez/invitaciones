# 🚀 Sprint 1: Fundamentos — Prompt para Kilo Code

## 📖 Contexto Inicial (LEER ANTES DE CODEAR)

1. `.opencode/architecture.md` — Stack, estructura de carpetas, patrones
2. `.opencode/conventions.md` — Nomenclatura, server actions, componentes
3. `.opencode/testing-strategy.md` — Tests unit + integration, Vitest
4. `prisma/schema.prisma` — Schema completo (ya debe existir o crearlo)

## 🎯 Objetivo del Sprint

Tener el proyecto corriendo en `localhost:3000` con:
- Next.js 14 + Tailwind + shadcn/ui + Prisma + PostgreSQL (Neon)
- Auth simple protegiendo `/admin/*`
- Landing page estructura visual (Hero, galería placeholder, precios, footer)
- Tests de integración para auth

## 📝 Tareas Atómicas

### Paso 1: Setup del proyecto
- [ ] Crear proyecto Next.js 14 con App Router, TypeScript, Tailwind.
- [ ] Instalar shadcn/ui (`npx shadcn-ui@latest init`).
- [ ] Instalar Prisma, configurar `prisma/schema.prisma` con el schema completo del `architecture.md`.
- [ ] Configurar `DATABASE_URL` apuntando a Neon (PostgreSQL).
- [ ] Correr `prisma migrate dev --name init` y `prisma generate`.
- [ ] Crear `src/lib/prisma.ts` singleton.
- [ ] Configurar Prettier + ESLint (shadcn ya trae config base).
- [ ] Crear `.env.example` con todas las variables necesarias.
- [ ] Crear script `prisma/seed.ts` que inserte 1 admin de prueba (no necesario para auth, pero útil para seed).

**Done:** `npm run dev` levanta sin errores. `npx prisma studio` muestra tablas vacías.

### Paso 2: Auth simple (middleware)
- [ ] Crear `src/middleware.ts` que proteja rutas `/admin/*` y `/api/admin/*`.
- [ ] Validar cookie `admin_session` contra `sha256(ADMIN_PASSWORD + salt_semanal)`.
- [ ] Si no hay cookie válida, redirigir a `/login`.
- [ ] Crear página `/login` con formulario de contraseña.
- [ ] Al enviar, setear cookie `admin_session` con 7 días de expiración.
- [ ] Crear `src/lib/auth.ts` con helpers `hashPassword`, `verifySession`.
- [ ] Crear layout admin en `src/app/(admin)/admin/layout.tsx` con sidebar + header (shadcn/ui: Sheet, Button, Avatar).

**Done:** Acceder a `/admin` sin cookie redirige a `/login`. Login con contraseña correcta permite acceso. Login con incorrecta muestra error.

### Paso 3: Landing page estructura
- [ ] Crear `src/app/(public)/page.tsx` con secciones:
  - Hero: título, subtítulo, CTA "Ver ejemplos".
  - Galería: 6 cards con placeholders (imagen gris + texto).
  - Precios: 3 cards de planes (básico, premium, deluxe) con precios ficticios.
  - Footer: links, copyright.
- [ ] Responsive mobile-first con Tailwind.
- [ ] Usar componentes shadcn/ui donde aplique (Card, Button, Badge).

**Done:** Landing se ve bien en desktop y móvil. Navegación a `/admin` funciona.

### Paso 4: Tests
- [ ] Instalar Vitest, React Testing Library, jsdom.
- [ ] Test de integración: `POST /login` con contraseña correcta → cookie seteada.
- [ ] Test de integración: `POST /login` con contraseña incorrecta → error.
- [ ] Test de middleware: request a `/admin` sin cookie → redirect 307.
- [ ] Test de componente: render de landing, presencia de texto "Ver ejemplos".

**Done:** `npm run test:ci` pasa verde.

## 🚫 Restricciones del Sprint

- NO crear API routes para CRUD todavía (usar server actions en sprints siguientes).
- NO implementar funcionalidad real de la galería (solo placeholders).
- NO usar NextAuth ni ninguna librería de auth externa.
- NO tocar lógica de pedidos, clientes, templates todavía.

## 🧪 Tests Obligatorios

- `tests/integration/auth.test.ts` — login success/fail, middleware redirect
- `tests/unit/components/Landing.test.tsx` — render básico

## 🎯 Checkpoint

Antes de declarar done, verificar:
- [ ] `npm run dev` funciona
- [ ] `npm run test:ci` pasa
- [ ] Prisma Studio conecta a Neon y muestra tablas
- [ ] `/admin` protegido, `/login` funciona
- [ ] Landing responsive

## 🎬 Comando de Kickoff

```
Eres un desarrollador senior. Sigue el archivo .opencode/conventions.md para nomenclatura y estructura. Lee .opencode/architecture.md para entender el stack. Implementa el Sprint 1 paso por paso. Escribe tests junto con el código. Al finalizar, genera un reporte de los archivos creados y decisiones tomadas.
```

## 📊 Formato de Reporte

Al final del sprint, genera `sprint-01-report.md` con:
1. Archivos creados/modificados (lista)
2. Decisiones técnicas tomadas (si desviaste del plan, documenta por qué)
3. Deuda técnica identificada
4. Estado de tests (cuántos, cuántos pasan)
5. Próximo sprint: qué se necesita antes de empezar (ej. "esperar aprobación de diseño de landing")
