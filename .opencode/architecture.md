# 🏗️ architecture.md — Invitaciones Digitales

> **SAGRADO.** Solo el agente planificador (tú) y el humano lo modifican.  
> El agente de código (Kilo Code) lo LEE pero NUNCA lo edita.

---

## 1. Visión General

SaaS de invitaciones digitales para eventos sociales (bodas, XV años, baby shower, cumpleaños).  
El admin crea pedidos desde un panel privado, personaliza invitaciones mediante un editor visual, genera URLs públicas + QR, y los invitados confirman asistencia (RSVP).

---

## 2. Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Framework | Next.js 14 (App Router) | SSR para OG tags, API routes, server actions |
| Lenguaje | TypeScript | Tipado estricto en toda la app |
| Estilos | Tailwind CSS + shadcn/ui | Componentes accesibles, rápidos de customizar |
| Animaciones | Framer Motion | Animaciones de entrada en templates |
| ORM | Prisma | Type-safe, migraciones automáticas, excelente DX |
| DB | PostgreSQL (Neon) | Serverless-compatible, free tier generoso, persistente en Vercel |
| Auth | Middleware custom | Solo 1 admin. Contraseña en `ADMIN_PASSWORD`. Sin librerías extras |
| Storage | Cloudinary | Imágenes optimizadas (`f_auto,q_auto`), upload directo, CDN gratis |
| QR | `qrcode` (npm) | Generación server-side, PNG buffer subido a Cloudinary |
| Hosting | Vercel Hobby | Deploy automático desde GitHub, dominio custom |
| Testing | Vitest + React Testing Library + Playwright | Unit + integration + E2E |

---

## 3. Arquitectura de Datos (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Cliente {
  id        String   @id @default(cuid())
  nombre    String
  telefono  String?
  fuente    String   // tienda | instagram | whatsapp | referido
  email     String?
  notas     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  pedidos   Pedido[]
}

model Pedido {
  id           String   @id @default(cuid())
  clienteId    String
  cliente      Cliente  @relation(fields: [clienteId], references: [id])
  tipoEvento   String   // boda | xv | baby_shower | cumpleanos
  fechaEvento  DateTime
  template     String   // boda-elegante | xv-moderno | baby-shower | cumpleanos-fiesta
  precio       Decimal  @db.Decimal(10, 2)
  estado       String   @default("cotizado") // cotizado | pagado | en_produccion | entregado | completado
  notas        String?
  slug         String?  @unique
  urlPublica   String?
  qrUrl        String?
  datosJson    Json?    // { nombres, fecha, ubicacion, fotos[], colores, mensaje, ... }
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  pagos        Pago[]
  rsvps        RSVP[]
  visitas      Visita[]
}

model Pago {
  id          String   @id @default(cuid())
  pedidoId    String
  pedido      Pedido   @relation(fields: [pedidoId], references: [id])
  monto       Decimal  @db.Decimal(10, 2)
  metodo      String   // efectivo | transferencia
  comprobante String?  // URL Cloudinary
  fecha       DateTime @default(now())
  notas       String?
}

model RSVP {
  id        String   @id @default(cuid())
  pedidoId  String
  pedido    Pedido   @relation(fields: [pedidoId], references: [id])
  nombre    String
  asiste    Boolean
  pax       Int      @default(1)
  telefono  String?
  mensaje   String?
  createdAt DateTime @default(now())
}

model Visita {
  id        String   @id @default(cuid())
  pedidoId  String
  pedido    Pedido   @relation(fields: [pedidoId], references: [id])
  ip        String?
  userAgent String?
  fecha     DateTime @default(now())
}

model Lead {
  id        String   @id @default(cuid())
  nombre    String
  evento    String?
  fecha     DateTime?
  telefono  String?
  mensaje   String
  createdAt DateTime @default(now())
}
```

---

## 4. Estructura de Carpetas

```
mi-proyecto/
├── .opencode/
│   ├── prompts/           ← sprint-01.md ... sprint-07.md
│   ├── memory-bank/
│   ├── reports/
│   ├── architecture.md    ← SAGRADO
│   ├── conventions.md     ← SAGRADO
│   └── testing-strategy.md ← SAGRADO
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (public)/        ← Landing, demos, invitaciones públicas
│   │   │   ├── page.tsx
│   │   │   ├── demo/
│   │   │   │   └── [tipo]/page.tsx
│   │   │   └── i/
│   │   │       └── [slug]/page.tsx
│   │   ├── (admin)/         ← Panel admin (protegido)
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── clientes/
│   │   │   │   ├── pedidos/
│   │   │   │   └── layout.tsx
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── api/             ← API routes (legacy, preferir Server Actions)
│   │   │   ├── clientes/
│   │   │   ├── pedidos/
│   │   │   └── upload/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/              ← shadcn/ui components
│   │   ├── admin/           ← Componentes exclusivos del panel
│   │   ├── templates/       ← 4 templates de invitación
│   │   ├── landing/         ← Secciones de la landing
│   │   └── shared/          ← Reutilizables (Header, Footer, etc.)
│   ├── lib/
│   │   ├── prisma.ts        ← Singleton PrismaClient
│   │   ├── auth.ts          ← Middleware + helpers de auth
│   │   ├── cloudinary.ts    ← Upload + transformaciones
│   │   ├── qr.ts            ← Generación de QR
│   │   └── utils.ts         ← cn() y helpers
│   ├── types/
│   │   └── index.ts         ← Tipos globales (InvitacionData, TemplateConfig)
│   └── hooks/
│       └── use-admin.ts     ← Hook de auth en cliente
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/
│   └── images/
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

---

## 5. Patrones de Diseño

### 5.1 Server Actions (preferido sobre API routes)
- Usar `use server` para mutaciones (CRUD, cambio de estado, upload).
- API routes solo para webhooks o endpoints que necesitan ser llamados externamente.
- Cada server action debe retornar `{ success: boolean, data?, error? }`.

### 5.2 Templates como Componentes Funcionales
- Cada template es un componente React que recibe `InvitacionData`.
- Separación de datos (JSON) de presentación (JSX/CSS).
- Configuración de campos por template en `src/types/index.ts`.

### 5.3 Singleton PrismaClient
- `src/lib/prisma.ts` exporta una única instancia. Evita múltiples conexiones en desarrollo (hot reload).

### 5.4 Middleware de Auth
- `src/middleware.ts` intercepta `/admin/*` y `/api/admin/*`.
- Valida cookie `admin_session` contra hash de `ADMIN_PASSWORD`.
- No usa NextAuth, no hay tabla de sesiones.

### 5.5 Upload a Cloudinary
- Server action recibe `FormData` con archivo.
- Usa `cloudinary.v2.uploader.upload_stream()` para subir buffer directo.
- Retorna URL segura. No guarda archivos en disco local.

---

## 6. Flujo de Datos

### 6.1 Crear Invitación (Admin)
```
Admin → Formulario Pedido → Server Action → Prisma → PostgreSQL
                                    ↓
                              Genera slug único
                                    ↓
                              Editor de variables → datosJson
                                    ↓
                              "Publicar" → Guarda datos → URL pública lista
```

### 6.2 Invitación Pública (Invitado)
```
Invitado accede /i/[slug] → Server Component → Prisma (slug) → Renderiza template
                                    ↓
                              Registrar visita (Server Action, fire-and-forget)
                                    ↓
                              RSVP → Server Action → Prisma → RSVP creado
```

### 6.3 Compartir (WhatsApp)
```
URL pública → Meta scraper lee OG tags (Server Component genera <meta>)
                                    ↓
                              Preview con nombre del evento + foto
```

---

## 7. Seguridad

- **Auth:** Cookie `admin_session` con valor `sha256(ADMIN_PASSWORD + salt)`. Salt rotativo por semana.
- **Slug:** Generado con `slugify(nombres + fecha)` + sufijo numérico si duplicado.
- **Upload:** Validar tipo MIME (image/jpeg, image/png), tamaño máximo 5MB.
- **RSVP:** Rate limiting por IP (middleware o Vercel KV si escala).
- **Env vars:** `ADMIN_PASSWORD`, `DATABASE_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.

---

## 8. Escalabilidad Futura (no implementar ahora)

- Multi-tenancy (varios admins/vendedores)
- Templates marketplace (subir templates custom)
- Notificaciones WhatsApp real (Twilio API)
- Pasarela de pagos (Stripe)
- Analytics avanzadas (PostHog)

---

## 9. Decisiones Arquitectónicas Clave

| Decisión | Alternativa rechazada | Por qué |
|----------|----------------------|---------|
| PostgreSQL (Neon) | SQLite | SQLite no persiste en Vercel serverless |
| Middleware custom | NextAuth | Solo 1 usuario admin, NextAuth es overkill |
| Server Actions | tRPC / REST API | Menos boilerplate, integrado con Next.js App Router |
| Cloudinary | Supabase Storage | Transformaciones automáticas, CDN global, mejor para OG images |
| shadcn/ui | Material UI / Chakra | Copia componentes, full control, sin vendor lock-in |

---

> **Última modificación:** 2026-06-07  
> **Próxima revisión:** Al finalizar Sprint 7 o si cambia el stack.
