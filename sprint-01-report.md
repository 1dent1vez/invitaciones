# 🚀 Reporte de Finalización: Sprint 1 — Fundamentos

## 1. Archivos Creados y Modificados

### 📂 Archivos Creados
* **Configuración y Entorno:**
  * [.env.example](file:///c:/Proyectos/Inv/.env.example) — Plantilla con las variables de entorno necesarias para la app.
  * [.env](file:///c:/Proyectos/Inv/.env) — Configuración del entorno de desarrollo local.
  * [vitest.config.ts](file:///c:/Proyectos/Inv/vitest.config.ts) — Configuración de Vitest para soporte de TypeScript, React y resolución de alias `@/*`.
  * [tests/setup.ts](file:///c:/Proyectos/Inv/tests/setup.ts) — Configuración global del testing (importación de `@testing-library/jest-dom`).
* **Lógica e Infraestructura:**
  * [src/lib/prisma.ts](file:///c:/Proyectos/Inv/src/lib/prisma.ts) — Instancia singleton del cliente Prisma.
  * [prisma/seed.ts](file:///c:/Proyectos/Inv/prisma/seed.ts) — Semilla para poblar inicialmente la base de datos local o en Neon.
  * [src/lib/auth.ts](file:///c:/Proyectos/Inv/src/lib/auth.ts) — Helpers de criptografía SHA-256 (Web Crypto) y salt semanal rotativo.
  * [src/middleware.ts](file:///c:/Proyectos/Inv/src/middleware.ts) — Interceptor de rutas para `/admin/*` y `/api/admin/*`.
* **Componentes y Vistas:**
  * [src/app/(admin)/login/actions.ts](file:///c:/Proyectos/Inv/src/app/(admin)/login/actions.ts) — Server Actions para controlar inicio y cierre de sesión de forma segura.
  * [src/app/(admin)/login/page.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/login/page.tsx) — Vista premium de login (glassmorphism oscuro).
  * [src/app/(admin)/admin/layout.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/layout.tsx) — Layout administrativo responsivo con barra lateral y menú móvil (Base UI).
  * [src/app/(admin)/admin/page.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/page.tsx) — Página inicial del dashboard administrativo con métricas.
  * [src/app/(public)/page.tsx](file:///c:/Proyectos/Inv/src/app/(public)/page.tsx) — Landing page pública completa (Hero, Características, Galería de ejemplos y Precios).
* **Pruebas:**
  * [tests/integration/auth.test.ts](file:///c:/Proyectos/Inv/tests/integration/auth.test.ts) — Pruebas de integración del login y redirecciones del middleware.
  * [tests/unit/components/Landing.test.tsx](file:///c:/Proyectos/Inv/tests/unit/components/Landing.test.tsx) — Pruebas de renderizado y estructura de la Landing Page.

### 📝 Archivos Modificados
* [package.json](file:///c:/Proyectos/Inv/package.json) — Actualizadas dependencias, añadidas dependencias de testing (`vitest`, testing-library) y validación de formularios (`zod`, `react-hook-form`).
* [src/app/layout.tsx](file:///c:/Proyectos/Inv/src/app/layout.tsx) — Solucionado problema de carga de fuentes mapeando la fuente Geist local directamente a la variable global.
* [src/app/globals.css](file:///c:/Proyectos/Inv/src/app/globals.css) — Removidos estilos incompatibles (`outline-ring/50`) con la versión instalada de Tailwind CSS v3.
* [tailwind.config.ts](file:///c:/Proyectos/Inv/tailwind.config.ts) — Mapeados los colores de la UI y del Sidebar a las variables CSS de shadcn para evitar errores en PostCSS.

---

## 2. Decisiones Técnicas Tomadas

1. **Downgrade de Prisma (v7.8.0 ➔ v5.18.0):**
   * *Razón:* Prisma 7+ introduce cambios drásticos en cómo se declaran las URLs de conexión (prohibiendo `url = env("DATABASE_URL")` directo en el schema). Para respetar el diseño establecido en `architecture.md` y mantener una compatibilidad óptima con Next.js 14 sin agregar archivos de configuración complejos de Prisma 7, decidimos usar la versión estable v5.18.0.
2. **Uso de Web Crypto API en `auth.ts`:**
   * *Razón:* Las funciones nativas de Node.js `crypto` pueden presentar incompatibilidades o advertencias al ejecutarse en el Edge Runtime de Next.js Middleware. `crypto.subtle` (Web Crypto) es un estándar web soportado nativamente en navegadores, Node, y Edge Runtimes de forma universal.
3. **Adaptación de `SheetTrigger` en Base UI:**
   * *Razón:* El boilerplate del proyecto utiliza `@base-ui/react` en lugar de Radix UI para los componentes de shadcn. Dado que Base UI no utiliza la directiva `asChild` para los triggers, se implementó el paso de componentes a través del prop `render` (`render={<Button>...`}), que es el estándar en esta librería.
4. **Validaciones en cliente y servidor unificadas:**
   * *Razón:* Se usó Zod en el cliente (login form) y validaciones en la Server Action para asegurar doble capa de seguridad y consistencia, siguiendo la sección 7 de `conventions.md`.

---

## 3. Deuda Técnica Identificada

* **Rate Limiting:** Actualmente no hay un límite de intentos (rate limit) en la Server Action `loginAction` ni en el middleware para peticiones de contraseña al admin. Se recomienda añadirlo en el Sprint 6 para mitigar ataques de fuerza bruta.
* **Salt Dinámico Semanal en Testing:** En los tests, mockeamos la cookie pero los cálculos de salt dependen del reloj del sistema. Si los tests corren justo en la frontera de cambio de semana (domingo a lunes UTC), podría ocurrir una discrepancia en el hash temporal.
* **Separación de Layouts Públicos:** Las páginas públicas (`/`) comparten el `src/app/layout.tsx` raíz con las páginas administrativas. Se sugiere encapsular las rutas públicas en un route group layout `src/app/(public)/layout.tsx` si se requieren metadatos o scripts independientes de administración.

---

## 4. Estado de los Tests

Se implementó una suite completa que corre de manera aislada (sin requerir conexión activa de DB en este sprint):

* **Suite de Pruebas Ejecutadas:** `npm run test:ci`
* **Test Files:** 2 pasados (100% de éxito)
* **Total de Pruebas:** 6 pasadas:
  * `loginAction` exitoso con contraseña correcta (cookie configurada).
  * `loginAction` fallido con contraseña incorrecta (mensaje de error devuelto).
  * Redirección HTTP 307 de `/admin` a `/login` si no hay sesión.
  * Permiso de acceso de `/admin` si la sesión con hash semanal es válida.
  * Render de la Landing Page correctamente y validación de la marca "Kilo Invitaciones".
  * Comprobación de existencia de características, galerías y precios en la landing pública.

---

## 5. Próximo Sprint: Requerimientos Previos

Para iniciar el **Sprint 2 (CRUD y Panel Administrativo)**, se requiere:
1. **Configurar la base de datos PostgreSQL activa:** El usuario debe proveer la `DATABASE_URL` real de Neon en su archivo `.env`.
2. **Ejecutar migraciones iniciales:** Correr `npx prisma migrate dev --name init` para crear las tablas físicas en la base de datos Neon.
3. **Poblar datos iniciales:** Ejecutar `npx prisma db seed` para asegurar que el primer cliente y pedido de prueba queden registrados.
