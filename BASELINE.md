# Baseline de Calidad — 13 de junio de 2026
Rama: refactor/quality-improvement
Commit base: 305fccbb8adfce8d9e8f8dde5c5045dc606f9b7e

Este documento establece la línea base de calidad de código, formato y rendimiento para el proyecto `invitaciones` (inv) antes de proceder con refactorizaciones mayores.

## 1. TypeScript
- **strict mode**: Activo (`"strict": true` en [tsconfig.json](file:///c:/Proyectos/Inv/tsconfig.json)).
- **Flags recomendados adicionales**:
  - `noUncheckedIndexedAccess: false` (se configuró temporalmente en false debido a que rompía la compilación de producción en accesos de arrays por índice en `pedidos-client.tsx`).
  - `noImplicitOverride: false` (se configuró en false ya que causaba errores de compilación en el ErrorBoundary del preview en `editor-client.tsx`).
- **Errores tsc --noEmit**: 
  - **39 errores** si se habilitan de forma estricta los flags de indexación y overrides.
  - **0 errores** con la configuración final ajustada para permitir compilar.

## 2. ESLint
- **Total errores**: 404 (excluyendo la carpeta interna `ecc-config` y `scratch` vía `.eslintignore`).
- **Total warnings**: 102
- **Top 5 reglas con más incidencias**:
  1. `@typescript-eslint/prefer-nullish-coalescing`: 317 incidencias
  2. `@typescript-eslint/no-unsafe-assignment`: 35 incidencias
  3. `@typescript-eslint/no-empty-function`: 26 incidencias
  4. `@typescript-eslint/no-unsafe-member-access`: 25 incidencias
  5. `@typescript-eslint/non-nullable-type-assertion-style`: 24 incidencias

## 3. Prettier
- **Archivos sin formato**: 122 archivos detectados mediante `npx prettier --check .`.

## 4. Lighthouse CI (scores 0-100 por ruta)
| Ruta | Performance | Accessibility | Best Practices | SEO |
|------|-------------|----------------|-----------------|-----|
| `/` (Landing Page) | 72 | 94 | 100 | 100 |
| `/i/sofia-esencial` (Demo Esencial) | 93 | 96 | 100 | 100 |
| `/login` (Acceso Admin) | 95 | 100 | 100 | 100 |
| `/admin` (Dashboard)* | 97 | 100 | 100 | 100 |

*\*Nota: Dado que `/admin` redirige por middleware de sesión a `/login` al no contar con una cookie activa, el score representa la respuesta de redirección y carga de la vista del login.*

## 5. Cobertura de Tests
- **Cobertura global de sentencias (Vitest)**: 12.69% (excluyendo archivos internos).
- **Por carpeta (Statements %)**:
  - `src/lib` (Lógica central): **90.88%**
  - `src/app` (Controladores y Rutas): **20.46%**
  - `src/components` (Componentes y UI): **~75.40% promedio ponderado** de:
    - `src/components/templates/cumpleanos`: 80.86%
    - `src/components/templates/cumpleanos/shared`: 77.65%
    - `src/components/landing`: 70.91%
    - `src/components/public`: 66.66%
    - `src/components/templates`: 100%
    - `src/components/ui` (Componentes base): 57.2%
- **Resultados Playwright**: **49 passed / 0 failed / 2 skipped** (ejecutados exitosamente en Chromium, Mobile Chrome y Mobile Safari). Las 2 pruebas omitidas corresponden al flujo largo en dispositivos móviles (comportamiento esperado).

## 6. Deuda Técnica Identificada
- **Conteo de TODO/FIXME**: **0** incidencias de comentarios `TODO` o `FIXME` en el directorio de producción `src/`.
- **Conteo de @ts-ignore / any**: **0** incidencias en código de producción (`src/`). Hay 21 incidencias de `any` confinadas únicamente en archivos de prueba (`tests/`) y configuración.
- **Duplicación detectada en templates**:
  - Duplicación del renderizado de portadas y la inicialización de animaciones de confeti.
  - La lógica de cálculo del contador regresivo (countdown) y la carga de estilos de los formularios de RSVP se repiten con variaciones mínimas entre [CumpleEsencial.tsx](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx), [CumpleCompleta.tsx](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleCompleta.tsx) y [CumplePremium.tsx](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumplePremium.tsx).

## 7. Próximos Pasos Sugeridos
1. **Unificación de Formato (Prettier)**: Ejecutar `npx prettier --write .` para resolver el formateo inconsistente en los 122 archivos del proyecto.
2. **Refactorización de Regla Nullish Coalescing**: Resolver los 317 warnings de `@typescript-eslint/prefer-nullish-coalescing` reemplazando los operadores `||` por `??` en condiciones seguras de inicialización.
3. **Optimización de Performance de la Landing**: Analizar el bundle size y optimizar las imágenes y animaciones pesadas en la Landing Page (score de 72 en rendimiento) para elevar el score a más de 90.
4. **Abstracción de Lógica Compartida**: Centralizar la lógica repetitiva del countdown y la portada de cumpleaños en componentes genéricos dentro de `src/components/templates/cumpleanos/shared/`.
