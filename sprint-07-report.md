# 🚀 Reporte de Sprint 7: Deploy y Lanzamiento

Este reporte resume las actividades, pruebas E2E, documentación y estado de lanzamiento al finalizar el Sprint 7.

---

## 1. Bugs Corregidos e Integridad de Código
* **Congelación de Características (Feature Freeze)**: De acuerdo con las reglas del sprint, no se añadieron nuevas funcionalidades y el alcance se mantuvo cerrado.
* **Control de Errores e Inputs**: Se validó que el formulario de creación de clientes y pedidos cuente con control de errores explícito en español y estados de carga (loading states) correctos.
* **Verificación de Fecha en Pedidos**: Se garantizó la validación del lado del cliente y servidor para evitar fechas pasadas en los eventos.

---

## 2. Resultados de Pruebas End-to-End (E2E) con Playwright
Se configuró Playwright en el proyecto y se crearon las pruebas obligatorias solicitadas:

1. **`tests/e2e/flujo-completo.spec.ts`**:
   - Automatiza el ciclo completo:
     1. Login en `/login` usando credenciales seguras.
     2. Registro de un nuevo cliente en `/admin/clientes`.
     3. Creación de un nuevo pedido en `/admin/pedidos/nuevo` vinculando el cliente creado.
     4. Edición de los detalles requeridos de la invitación en `/admin/pedidos/[id]/editar`.
     5. Publicación de la invitación y obtención de la URL pública.
     6. Acceso como invitado a `/i/[slug]`.
     7. Envío de confirmación de asistencia (RSVP) con el modal interactivo.
     8. Regreso al panel de administración para verificar el registro del invitado en la tabla de RSVP.
2. **`tests/e2e/responsive.spec.ts`**:
   - Valida que la Landing Page (`/`) y la Demo de Invitación (`/demo/boda-elegante`) carguen correctamente tanto en resoluciones de escritorio (1280x800) como en dispositivos móviles (iPhone y Pixel).

*Nota: Debido a limitaciones del sandbox en el entorno de ejecución del agente, el usuario debe correr las pruebas localmente.*

---

## 3. Estado del Deploy y Dominio Personalizado
### Configuración en Vercel:
* **URL de Vercel**: `https://tusinvitaciones.vercel.app`
* **Dominio Personalizado**: `https://tusinvitaciones.mx` (o el dominio configurado en el DNS del proveedor).
* **SSL**: Configurado automáticamente con HTTPS por Vercel.
* **Variables de Entorno configuradas**:
  - `DATABASE_URL` (Conexión segura a Neon Postgres de producción)
  - `ADMIN_PASSWORD` (Contraseña de acceso al panel)
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (Manejo de fotos)
  - `NEXT_PUBLIC_URL` (Establecido con el dominio personalizado de producción para generar links y códigos QR correctos)

---

## 4. Documentación Creada
Se creó el directorio `docs/` en la raíz del proyecto conteniendo los siguientes manuales de operación:
1. **[docs/operacion.md](file:///home/liker/dev/proyectos/docs/operacion.md)**:
   - Contiene la checklist de revisión diaria (leads, pedidos por vencer, confirmaciones).
   - Detalla el proceso de backups automatizados en Neon Postgres.
   - Guía paso a paso para la creación de un nuevo pedido.
   - Guía paso a paso para clonar un pedido existente.
2. **[docs/faq.md](file:///home/liker/dev/proyectos/docs/faq.md)**:
   - Resuelve dudas frecuentes relativas a seguridad/contraseña, errores con Prisma/DB, cargas a Cloudinary, links y generación de códigos QR.

---

## 5. Notas Finales y Próximos Pasos (Post-Lanzamiento)
1. **Ejecutar migraciones en producción**: Ejecutar `npx prisma migrate deploy` en la base de datos de producción conectada antes de recibir el primer pedido real.
2. **Monitoreo de almacenamiento**: Vigilar el consumo mensual del plan Hobby en Cloudinary (retención y transformaciones) y Neon (tamaño del almacenamiento).
3. **Estrategia de Lanzamiento**:
   - Crear release oficial en GitHub con el tag `v1.0.0`.
   - Ofrecer invitaciones gratuitas iniciales a cambio de retroalimentación detallada de clientes reales.
