# 🎁 ¡Ábreme! — SaaS de Invitaciones Digitales Premium

Bienvenido a **¡Ábreme!**, una plataforma SaaS moderna diseñada para crear, personalizar, gestionar y compartir invitaciones digitales interactivas para eventos sociales (cumpleaños, bodas, XV años, etc.) con confirmación RSVP en tiempo real y analíticas integradas.

---

## 🛠️ Stack Tecnológico

El proyecto está construido con herramientas modernas de desarrollo web bajo un entorno TypeScript estricto:

| Tecnología | Rol en el Proyecto |
|---|---|
| **Next.js 14** | Framework web con soporte completo de App Router (rutas híbridas, layouts y server components). |
| **TypeScript** | Modo estricto habilitado (`strict: true`) para garantizar la robustez del código. |
| **Tailwind CSS** | Estilado rápido y responsivo con utilidades predefinidas. |
| **shadcn/ui** | Colección de componentes de interfaz atómicos y accesibles. |
| **Framer Motion** | Micro-animaciones fluidas y transiciones interactivas en el visor de invitaciones y landing page. |
| **Prisma ORM** | Capa de abstracción y consultas estructuradas de base de datos. |
| **PostgreSQL (Neon)** | Base de datos SQL relacional y serverless hospedada en Neon Cloud. |
| **Cloudinary** | Almacenamiento, redimensionamiento y optimización automática de imágenes subidas por los usuarios. |
| **Vitest** | Suite de pruebas unitarias y de integración rápida. |
| **Playwright** | Pruebas e2e (end-to-end) para flujos de usuario completos y pruebas de responsive. |

---

## 📂 Estructura del Proyecto

```
/ (raíz)
├── docs/                # Documentación técnica, guías de paquetes, templates y APIs
│   ├── CODEMAPS/        # Mapas generales de arquitectura, API y dependencias del código
│   ├── API.md           # Especificación detallada de endpoints
│   ├── PAQUETES.md      # Configuración de los paquetes (Esencial, Completa, Premium)
│   └── TEMPLATES.md     # Guía para extender o construir nuevas plantillas
├── prisma/              # Esquemas de base de datos, semillas y migraciones
├── tests/               # Pruebas automatizadas (unitarias, integración y e2e)
└── src/
    ├── app/             # Rutas, layouts y controladores de API de Next.js
    │   ├── (admin)/     # Panel administrativo (/admin) y autenticación (/login)
    │   ├── (public)/    # Landing page, visor público (/i/[slug]) y RSVP
    │   └── api/         # Endpoints REST (upload, qr, rsvp, analytics)
    ├── components/      # Componentes de React
    │   ├── landing/     # Elementos de la Landing Page ("Caja de Regalo")
    │   ├── templates/   # Plantillas visuales (CumpleEsencial, Completa, Premium)
    │   │   └── cumpleanos/shared/ # Componentes y hooks de uso común en templates
    │   └── ui/          # Componentes visuales básicos (botones, inputs, multi-image-uploader)
    ├── lib/             # Módulos de lógica (estados, notificaciones, paquetes, templates)
    └── types/           # Definiciones globales de TypeScript
```

---

## 📅 Flujo de Trabajo del Admin (Los 6 Pasos)

La plataforma permite la automatización de la entrega de invitaciones mediante 6 sencillos pasos ejecutados desde el panel `/admin`:

1. **Crear Pedido**: Registrar o seleccionar a un Cliente y definir la fecha, precio, tipo de evento y paquete contratado.
2. **Cuestionario**: El sistema genera un link del cuestionario inicial que se envía al cliente para recabar los datos del festejo.
3. **Editor**: Rellenar y personalizar todos los campos obligatorios del formulario (frases, ubicaciones, fotos y colores).
4. **Publicar**: Guardar los datos y hacer clic en publicar. Esto genera una URL pública única basada en un slug (ej. `/i/sofia-hernandez-30-anos`) y un código QR descargable.
5. **Compartir**: Utilizar los templates de notificaciones de WhatsApp integrados en el admin para enviar el link y el QR al cliente de forma limpia.
6. **RSVP (Confirmación)**: Monitorear la lista de confirmación de invitados y la cantidad acumulada de pases en tiempo real desde el detalle del pedido.

---

## 📦 Paquetes Disponibles (Cumpleaños)

| Paquete | Precio | Secciones Incluidas | Características Clave |
|---|---|---|---|
| **Esencial** | $350 MXN | Portada, Ubicación, RSVP, Música. | Carga de foto de portada, enlace a Google Maps, RSVP básico y música de fondo única. |
| **Completa** | $550 MXN | Portada, Ubicación, RSVP, Música, Galería, Dresscode, Mensaje Festejo, Itinerario, Regalos. | Galería interactiva (hasta 6 fotos), Dresscode detallado, itinerario cronológico y mesa de regalos/datos bancarios. |
| **Premium** | $850 MXN | Todas las anteriores + Historia, Buzón de Deseos, Álbum QR, Pases, Video, Temática. | Animación de confetti, cuenta regresiva activa, historia personal, buzón de deseos digital, QR para subir fotos post-evento y asignación de pases individuales. |

---

## 🚀 Configuración y Setup Local

### 1. Requisitos Previos
- **Node.js** v18 o superior.
- Una cuenta en **Neon Console** (u otra base de datos PostgreSQL).
- Una cuenta en **Cloudinary** para subir imágenes.

### 2. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
DATABASE_URL="postgresql://usuario:contraseña@servidor/dbname?sslmode=require"
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"
ADMIN_PASSWORD="tu-contraseña-admin"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Instalación e Inicio
```bash
# Instalar dependencias
npm install

# Correr migraciones de base de datos
npx prisma migrate dev

# Poblado inicial de datos (seed)
npm run db:seed  # O npx prisma db seed si está configurado

# Iniciar servidor de desarrollo
npm run dev
```

---

## 🧪 Comandos de Calidad y Tests

El proyecto cuenta con un riguroso sistema de calidad tras las refactorizaciones:

```bash
# Ejecutar pruebas unitarias e integración en modo interactivo (Vitest)
npm run test

# Ejecutar suite de pruebas para CI (Vitest run)
npm run test:ci

# Ejecutar pruebas End-to-End (Playwright)
npm run test:e2e

# Ejecutar análisis estático y linter (ESLint)
npm run lint

# Validar compilación de producción
npm run build
```

---

## 🎨 Identidad Visual

El diseño general de la landing page sigue la estética de **"Caja de Regalo"** para causar una impresión elegante y festiva en el usuario:

- **Tipografías**:
  - **Fraunces**: Tipografía Serif clásica y elegante para títulos de secciones y encabezados de paquetes.
  - **Inter**: Tipografía Sans-serif altamente legible para textos descriptivos, listados y formularios.
- **Paleta de Colores**:
  - `Rosa Regalo` (`#E8B4B8`): Color decorativo primario para acentos y badges de paquetes básicos.
  - `Crema Seda` (`#FEF7F0`): Color de fondo suave que aporta calidez y limpieza.
  - `Dorado Cálido` (`#D4A373`): Usado en sellos foil y botones de llamada a la acción premium.
  - `Terracota / Rojo Pastel` (`#C85C5C`): Color de contraste de alta energía utilizado en llamados a la acción destacados.
  - `Carbon Suave` (`#1F2937`): Tonalidad oscura para textos legibles y contrastados.
