# AGENTS.md

This file provides guidance to your coding CLI when working with code in this repository.

## Setup commands
- Install deps: `npm install`
- Start dev server: `npm run dev`
- Run build: `npm run build`
- Run tests: `npx vitest run --sequence.concurrent false --no-file-parallelism`

## Stack
- Next.js 14 App Router
- TypeScript (strict)
- Tailwind CSS + shadcn/ui
- Prisma + PostgreSQL (Neon)
- Cloudinary (imágenes)
- Framer Motion (animaciones)
- Auth: cookies propias (no NextAuth)

## Project structure
- src/app/(public)/ → Rutas públicas (landing, invitaciones /i/[slug])
- src/app/(admin)/admin/ → Panel de administración
- src/components/templates/cumpleanos/ → Templates de invitaciones
- src/lib/ → Utilidades, config de paquetes, templates
- src/types/ → Tipos TypeScript

## Code style
- TypeScript strict mode
- Prefer `interface` over `type` for props
- Use functional components with named exports
- Tailwind para estilos, NO CSS modules
- Framer Motion para animaciones
- Mobile-first responsive design

## Testing
- Vitest para unit/integración
- Playwright para E2E
- Tests secuenciales: `--no-file-parallelism` (Neon DB)

## Rules
- Una fase, un prompt
- Tests junto con código
- Build debe pasar antes de commit
- NO features extras
- Backward compatibility con datos existentes
- Paquetes: Esencial($350), Completa($550), Premium($850)
