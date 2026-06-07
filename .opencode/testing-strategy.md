# 🧪 testing-strategy.md — Estrategia de Pruebas

> **SAGRADO.** Solo el agente planificador y el humano lo modifican.  
> El agente de código DEBE escribir tests ANTES o JUNTO con el código de producción. Nunca al final.

---

## 1. Filosofía

- **Tests primero, o tests juntos, nunca al final.**
- Cada server action debe tener al menos un test de integración.
- Cada componente crítico debe tener un test de render + interacción básica.
- El flujo E2E se valida al final de cada sprint, no solo al final del proyecto.
- Cobertura mínima: **60% en lógica de negocio** (server actions, utilidades, helpers).

---

## 2. Stack de Testing

| Tipo | Herramienta | Para qué |
|------|-------------|----------|
| Unit + Integration | Vitest + React Testing Library | Server actions, componentes React, hooks |
| E2E | Playwright | Flujos completos (login → crear pedido → publicar → RSVP) |
| Mocking | MSW (Mock Service Worker) | API externas (Cloudinary en tests) |
| DB de tests | `prisma` + `createMockContext` | Base de datos aislada por test file |

---

## 3. Estructura de Tests

```
tests/
├── unit/                    ← Funciones puras, helpers
│   ├── utils.test.ts
│   ├── slug.test.ts
│   └── currency.test.ts
├── integration/             ← Server actions + DB
│   ├── auth.test.ts
│   ├── clientes.test.ts
│   ├── pedidos.test.ts
│   └── rsvp.test.ts
└── e2e/                     ← Playwright
    ├── login.spec.ts
    ├── crear-pedido.spec.ts
    └── flujo-completo.spec.ts
```

---

## 4. Reglas por Tipo de Test

### 4.1 Unit Tests (Vitest)

```ts
// tests/unit/slug.test.ts
import { describe, it, expect } from "vitest";
import { generateSlug } from "@/lib/slug";

describe("generateSlug", () => {
  it("genera slug desde nombres y fecha", () => {
    const result = generateSlug("Ana & Carlos", new Date("2026-08-15"));
    expect(result).toBe("ana-carlos-15ago-2026");
  });

  it("añade sufijo numérico si existe duplicado", () => {
    const result = generateSlug("Ana & Carlos", new Date("2026-08-15"), ["ana-carlos-15ago-2026"]);
    expect(result).toBe("ana-carlos-15ago-2026-1");
  });
});
```

**Reglas:**
- Probar casos felices + casos edge (vacío, null, caracteres especiales).
- No testear librerías externas (no testear que `slugify` funcione; testear que TU wrapper funcione).
- Usar `describe` + `it` con nombres descriptivos en español.

### 4.2 Integration Tests (Vitest + Prisma + RTL)

```ts
// tests/integration/clientes.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClienteAction } from "@/app/(admin)/admin/clientes/actions";
import { prisma } from "@/lib/prisma";

describe("createClienteAction", () => {
  beforeAll(async () => {
    // Limpiar tabla
    await prisma.cliente.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("crea un cliente válido", async () => {
    const result = await createClienteAction({
      nombre: "María López",
      telefono: "5512345678",
      fuente: "instagram",
    });

    expect(result.success).toBe(true);
    expect(result.data?.id).toBeDefined();
  });

  it("rechaza nombre vacío", async () => {
    const result = await createClienteAction({ nombre: "" });
    expect(result.success).toBe(false);
    expect(result.error).toContain("nombre");
  });
});
```

**Reglas:**
- Usar base de datos real (Neon/PostgreSQL) o SQLite en memoria para tests.
- Limpiar datos antes/después de cada test suite.
- No compartir estado entre tests.
- Testear validaciones de negocio, no solo que Prisma funcione.

### 4.3 Component Tests (React Testing Library)

```tsx
// tests/unit/components/ClienteTable.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { ClienteTable } from "@/components/admin/ClienteTable";
import { describe, it, expect, vi } from "vitest";

describe("ClienteTable", () => {
  it("renderiza lista de clientes", () => {
    const clientes = [
      { id: "1", nombre: "Juan", telefono: "123" },
    ];

    render(<ClienteTable data={clientes} />);
    expect(screen.getByText("Juan")).toBeInTheDocument();
  });

  it("llama onEdit al hacer click", () => {
    const mockEdit = vi.fn();
    render(<ClienteTable data={[{ id: "1", nombre: "Juan" }]} onEdit={mockEdit} />);
    fireEvent.click(screen.getByText("Editar"));
    expect(mockEdit).toHaveBeenCalledWith("1");
  });
});
```

**Reglas:**
- Testear comportamiento, no implementación (no testear que `useState` se llama).
- Usar `screen` queries accesibles (`getByRole`, `getByLabelText`).
- Mockear server actions con `vi.mock()`.

### 4.4 E2E Tests (Playwright)

```ts
// tests/e2e/crear-pedido.spec.ts
import { test, expect } from "@playwright/test";

test("flujo completo: crear pedido", async ({ page }) => {
  // Login
  await page.goto("/login");
  await page.fill("[name=password]", process.env.ADMIN_PASSWORD!);
  await page.click("button[type=submit]");

  // Crear cliente
  await page.goto("/admin/clientes");
  await page.click("text=Nuevo cliente");
  await page.fill("[name=nombre]", "Cliente E2E");
  await page.click("text=Guardar");

  // Verificar
  await expect(page.locator("text=Cliente E2E")).toBeVisible();
});
```

**Reglas:**
- 1 test E2E por sprint crítico (Sprint 2, 4, 7).
- Usar `dotenv` para cargar variables de entorno en Playwright.
- No testear todo con E2E; son lentos. Priorizar integration tests.

---

## 5. Cobertura Esperada por Sprint

| Sprint | Tests obligatorios | Cobertura objetivo |
|--------|-------------------|-------------------|
| Sprint 1 | Auth middleware, login action, render landing | 50% |
| Sprint 2 | CRUD clientes, CRUD pedidos, kanban estados, pagos | 60% |
| Sprint 3 | Render de 4 templates con datos, validación de props | 50% |
| Sprint 4 | Generación slug, URL pública, OG tags, QR | 60% |
| Sprint 5 | RSVP guarda correctamente, cálculo totales, clonado | 60% |
| Sprint 6 | Validaciones fechas, form contacto, 404 | 50% |
| Sprint 7 | E2E flujo completo | 1 test E2E que pase |

---

## 6. Mocking de Servicios Externos

### Cloudinary
- En tests de upload, mockear `cloudinary.v2.uploader.upload_stream`.
- Retornar URL fija `https://res.cloudinary.com/demo/image/upload/test.jpg`.

### QR
- Mockear `qrcode.toDataURL` para retornar string base64 fijo.

### Fechas
- Usar `vi.useFakeTimers()` si es necesario congelar fecha.

---

## 7. Comandos de Test

```bash
# Unit + Integration (modo watch)
npm run test

# Unit + Integration (CI, una sola corrida)
npm run test:ci

# E2E (modo headed para debug)
npx playwright test --headed

# E2E (CI)
npx playwright test

# Cobertura
npm run test:coverage
```

---

## 8. Checklist Pre-Commit por Sprint

Antes de declarar un sprint "done":

- [ ] Todos los tests nuevos pasan (`npm run test:ci` verde).
- [ ] No hay tests rotos de sprints anteriores.
- [ ] Cobertura de lógica de negocio ≥ 60%.
- [ ] E2E del sprint (si aplica) pasa en local.
- [ ] No hay `console.log` de debug en código de producción.
- [ ] No hay `.only` o `.skip` en tests.

---

> **Última modificación:** 2026-06-07
