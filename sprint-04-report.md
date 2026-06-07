# Reporte del Sprint 4: Editor y Publicación

Este reporte detalla los entregables de diseño, desarrollo y control de calidad realizados para la entrega del Sprint 4.

---

## 1. Archivos del Editor y Página Pública

Se implementaron y modificaron los siguientes archivos clave para la funcionalidad del Sprint 4:

*   **Página del Editor Visual & Preview (Server side container):**
    *   [page.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/[id]/editar/page.tsx)
*   **Componente de Interfaz de Editor & Split Screen Preview:**
    *   [editor-client.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx)
*   **Acciones Servidor del Editor (Guardar, Publicar, Subir Imagen, Generar QR):**
    *   [actions.ts](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/[id]/editar/actions.ts)
*   **Página Pública & Open Graph Dinámico (Server Component):**
    *   [page.tsx](file:///c:/Proyectos/Inv/src/app/(public)/i/[slug]/page.tsx)
*   **Modificaciones de Detalle de Pedido (Acceso a Editor y QR):**
    *   [pedido-detalle-client.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/[id]/pedido-detalle-client.tsx)
*   **Servicios Utilitarios:**
    *   [qr.ts](file:///c:/Proyectos/Inv/src/app/src/lib/qr.ts) (Generación de PNG QR a través de Buffer)
    *   [cloudinary.ts](file:///c:/Proyectos/Inv/src/app/src/lib/cloudinary.ts) (Carga de imágenes vía upload stream buffer)

---

## 2. Decisiones sobre OG Tags y QR

*   **Rutas de Invitación del Servidor (OG Tags):** Las páginas públicas en `/i/[slug]` se programaron estrictamente como Server Components. Esto garantiza que las herramientas externas de redes sociales (ej. WhatsApp, Facebook, Twitter) puedan rastrear y leer la metadata Open Graph (`og:image`, `og:title`, `og:description`) de forma síncrona en el HTML inicial sin depender de la ejecución del cliente JS.
*   **Generador de QR Server-Side:** La conversión de la URL pública a un código QR se realiza en el servidor para evitar dependencias innecesarias del cliente y asegurar que el archivo PNG final sea guardado de forma persistente y segura en Cloudinary, optimizando el ancho de banda del cliente.
*   **Manejo de Colisión de Slugs:** Se implementó una lógica de duplicidad basada en `slugify(nombres + fechaEvento)` con búsqueda incremental concurrente (añadiendo sufijos `-1`, `-2`, etc.) en la base de datos para asegurar un identificador único por invitación pública.

---

## 3. Deuda Técnica

*   **Optimización de Imágenes (LCP):** Se utilizan etiquetas nativas `<img>` debido a la renderización dinámica de los templates. Para optimizar LCP y SEO en la web de cara a producción, se recomienda la migración a `<Image />` de `next/image` configurando correctamente los dominios autorizados de Cloudinary en `next.config.js`.
*   **Validación de Formulario Dinámico en Zod:** La validación genérica en el lado del servidor utiliza un esquema base amplio. A futuro, se podrían compilar dinámicamente validadores de Zod basados en la configuración de campos individuales de cada template (`TEMPLATE_CONFIGS`).

---

## 4. Estado de los Tests

Se crearon 4 nuevos archivos de prueba obligatorios, los cuales pasaron exitosamente en verde junto con la suite existente del CRM (13 suites, 41 pruebas totales):

1.  `tests/integration/slug.test.ts` — Prueba la normalización de textos, la estructura de slugs y la prevención de colisiones.
2.  `tests/integration/publicar.test.ts` — Valida la generación de metadata OG dinámica y el retorno exitoso de errores 404 (`notFound`).
3.  `tests/unit/qr.test.ts` — Valida el buffer de códigos QR y el mock de almacenamiento de Cloudinary.
4.  `tests/unit/components/Editor.test.tsx` — Verifica el renderizado de la UI de edición y los disparadores de Server Actions.

---

## 5. Notas para el Siguiente Sprint (Sprint 5)

*   **Confirmaciones RSVP:** Se deberá integrar el soporte para registro de asistencia (RSVP) en la página pública de invitaciones (`/i/[slug]`).
*   **Control de Cantidades y Restricciones:** Se debe planificar la estructura de base de datos para almacenar el límite de confirmaciones permitidas y pases por invitación.
