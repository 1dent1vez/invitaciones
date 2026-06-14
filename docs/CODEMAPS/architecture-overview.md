# 🗺️ Mapa de Arquitectura General — Invitaciones Digitales

Este documento detalla la estructura completa del directorio `src/`, las responsabilidades de cada módulo y los flujos generales de la aplicación tras las refactorizaciones de calidad.

---

## 📂 Estructura General del Directorio `src/`

La aplicación sigue el patrón de **App Router** de Next.js 14 y centraliza sus recursos en `/src`.

```
src/
├── app/                  # Sistema de enrutamiento y endpoints API
│   ├── (admin)/          # Panel de administración cerrado
│   ├── (public)/         # Páginas visibles por el usuario final (visor, landing, RSVP)
│   └── api/              # Endpoints HTTP (RSVP, QR, Upload, Analytics)
├── components/           # Componentes visuales reutilizables
│   ├── landing/          # Secciones específicas de la landing page ("Caja de Regalo")
│   ├── templates/        # Plantillas de invitaciones (e.g. cumpleaños)
│   └── ui/               # Componentes atómicos (shadcn/ui e inputs personalizados)
├── lib/                  # Funciones de utilidad, base de datos y lógica de negocio
└── types/                # Declaraciones de tipos globales de TypeScript
```

---

## 🏛️ Desglose de Componentes y Responsabilidades

### 1. Sistema de Rutas (`src/app/`)

#### 🔒 Grupo Administrativo: `app/(admin)/`
Rutas protegidas para la gestión de clientes, leads y pedidos de invitaciones.
- `admin/layout.tsx`: Define el marco de navegación interno (Sidebar, Header con usuario y logout).
- `admin/page.tsx`: Dashboard principal que despliega estadísticas críticas (Pedidos Totales, Ingresos, Leads Nuevos, Visitas y Conversión de RSVP) y un gráfico interactivo.
- `admin/clientes/`: Panel para la administración de Clientes (`Cliente`).
- `admin/leads/`: Monitoreo y contacto rápido de mensajes recibidos de clientes potenciales.
- `admin/pedidos/`: Creación, edición, clonación y detalles del estado de producción de cada pedido (`Pedido`).

#### 🌐 Grupo Público: `app/(public)/`
Rutas y páginas de acceso abierto y optimizado.
- `page.tsx`: Landing page principal, rediseñada con la temática de "Caja de Regalo". Presenta el valor del producto, demo, comparativa de paquetes y CTA final.
- `i/[slug]/page.tsx`: El **Visor de Invitación**. Detecta la plantilla seleccionada del pedido e inyecta dinámicamente el componente correcto del template (`CumpleEsencial`, `CumpleCompleta` o `CumplePremium`).
- `i/[slug]/rsvp/page.tsx`: Página para la confirmación rápida de asistencia desde dispositivos móviles.
- `i/[slug]/rsvp-form.tsx`: Formulario dinámico con validación de campos según el paquete contratado.

#### ⚙️ Endpoints API: `app/api/`
- `api/upload/route.ts` [`POST`]: Sube imágenes a Cloudinary dentro del directorio `invitaciones/fotos`. Valida tipos de archivo y peso máximo (5MB).
- `api/qr/route.ts` [`GET`]: Genera un búfer PNG con un código QR que apunta a la URL pública de la invitación.
- `api/rsvp/route.ts` [`POST`]: Recibe, valida mediante Zod y almacena los datos de asistencia en la base de datos PostgreSQL, ejecutando una revalidación bajo demanda (`revalidatePath`).
- `api/analytics/route.ts` [`POST`]: Registra de forma silenciosa la dirección IP y el agente de usuario cada vez que se abre una invitación pública.

---

### 2. Componentes de Interfaz (`src/components/`)

- `components/landing/`: Módulos que estructuran el nuevo diseño de la landing page:
  - `HeroBox.tsx`: El bloque de bienvenida animado que simula la apertura de una caja de regalo interactiva.
  - `ProblemSection.tsx`, `HowItWorks.tsx`, `SocialProof.tsx`: Mapeo del dolor del cliente, pasos y reseñas.
  - `PackagesSection.tsx`: Tabla interactiva con precios y desglose detallado de los paquetes **Esencial**, **Completa** y **Premium**.
- `components/templates/cumpleanos/`: Contiene las plantillas de visualización:
  - `CumpleEsencial.tsx`: Renderizado ligero y minimalista para el paquete básico.
  - `CumpleCompleta.tsx`: Renderizado enriquecido con galería, itinerario, mesa de regalos y música.
  - `CumplePremium.tsx`: Plantilla premium con confetti animado, cuenta regresiva, álbum de fotos QR y buzón de deseos.
  - `shared/`: Lógica, componentes y hooks compartidos (ver detalles en [templates-cumpleanos.md](file:///c:/Proyectos/Inv/docs/CODEMAPS/templates-cumpleanos.md)).
- `components/ui/`: Componentes básicos de interfaz como botones, inputs, modales, etc. Destaca `multi-image-uploader.tsx`, que simplifica la subida múltiple a Cloudinary para la galería.

---

### 3. Librerías y Helpers (`src/lib/`)

- [paquetes.ts](file:///c:/Proyectos/Inv/src/lib/paquetes.ts): Define los precios oficiales, los campos obligatorios del formulario por paquete y las secciones habilitadas.
- [templates.ts](file:///c:/Proyectos/Inv/src/lib/templates.ts): Mapea los strings del tipo de template (ej. `cumpleanos-completa`) al componente de React correspondiente y proporciona funciones de validación.
- [estados.ts](file:///c:/Proyectos/Inv/src/lib/estados.ts): Centraliza las traducciones, colores y labels de los estados de pedidos (`cotizado`, `pagado`, `en_produccion`, `entregado`, `completado`) y estados de invitación (`BORRADOR`, `PUBLICADA`).
- [notificaciones.ts](file:///c:/Proyectos/Inv/src/lib/notificaciones.ts): Gestiona los templates de mensajes predefinidos para WhatsApp (envío de cuestionario al cliente, entrega de link público, envío de QR).
- [cloudinary.ts](file:///c:/Proyectos/Inv/src/lib/cloudinary.ts): Conexión SDK para la subida de imágenes a la nube.
- [qr.ts](file:///c:/Proyectos/Inv/src/lib/qr.ts): Utilidad para generar códigos QR a partir de cadenas de texto.
- [prisma.ts](file:///c:/Proyectos/Inv/src/lib/prisma.ts): Instancia global del cliente de base de datos de Prisma compatible con Serverless (Neon).

---

## 🔄 Flujo de Datos Principal

```
  [ Cliente compra ] ──> [ Admin crea Pedido ] ──> [ Envía Cuestionario ]
                                                            │
                                                            ▼
  [ Genera QR & Link ] <── [ Publica Invitación ] <── [ Completa Editor ]
          │
          ├─> [ Invitado abre Link ] ──> [ Registra Visita (Analytics) ]
          │
          └─> [ Invitado llena RSVP ] ──> [ Guarda DB ] ──> [ Revalida Caché ]
```
