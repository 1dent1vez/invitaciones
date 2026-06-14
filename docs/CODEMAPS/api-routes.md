# 🔌 Rutas API (api-routes.md)

Este documento detalla la especificación de los endpoints API del backend localizados en `src/app/api/`. Todos los endpoints están optimizados para entornos Serverless y utilizan Prisma para la interacción con la base de datos PostgreSQL en Neon.

---

## 🗂️ Catálogo de Endpoints

### 1. Subida de Archivos (`/api/upload`)
Permite a los administradores o editores subir imágenes directamente a Cloudinary.

- **Método**: `POST`
- **Autenticación**: Opcional/Nivel de aplicación (usualmente restringido al flujo del editor).
- **Entrada (Multipart/Form-Data)**:
  - `file`: Archivo binario (Imagen).
- **Validaciones**:
  - Debe ser un archivo del tipo `image/*`.
  - Tamaño máximo permitido: 5 MB (5,242,880 bytes).
- **Salida exitosa (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": "https://res.cloudinary.com/cloudinary-name/image/upload/v123456789/invitaciones/fotos/nombre_archivo.jpg"
  }
  ```
- **Códigos de error**:
  - `400 Bad Request`: Si no se proporciona archivo o si la imagen no es válida o excede el peso de 5MB.
  - `500 Internal Server Error`: Falla en la carga o credenciales caídas del SDK de Cloudinary.

---

### 2. Generador de Código QR (`/api/qr`)
Genera un código QR dinámico a partir de una dirección URL.

- **Método**: `GET`
- **Parámetros URL**:
  - `url` (Query String, Requerido): Enlace absoluto al que debe apuntar el código QR (ej. `/api/qr?url=https://invitaciones.com/i/sofia-30`).
- **Salida exitosa (`200 OK`)**:
  - Retorna directamente el búfer binario de la imagen en formato **PNG**.
  - **Cabeceras HTTP**:
    - `Content-Type: image/png`
    - `Cache-Control: public, max-age=31536000, immutable` (Optimización para caché prolongada en el navegador).
- **Códigos de error**:
  - `400 Bad Request`: Si falta el parámetro `url`.
  - `500 Internal Server Error`: Falla en la librería de generación `qrcode`.

---

### 3. Registro de RSVP (`/api/rsvp`)
Procesa la confirmación de asistencia desde el visor de la invitación.

- **Método**: `POST`
- **Entrada (JSON Body)**:
  ```json
  {
    "slug": "sofia-hernandez-30-anos",
    "nombre": "Juan Pérez",
    "asiste": true,
    "pax": 2,
    "telefono": "5512345678", // Opcional
    "mensaje": "¡Ahí nos vemos!" // Opcional
  }
  ```
- **Validaciones (Esquema Zod)**:
  - `slug`: String no vacío.
  - `nombre`: Mínimo 2 caracteres.
  - `asiste`: Booleano requerido.
  - `pax`: Número entero positivo igual o mayor a 1. (Si `asiste` es false, el valor se fuerza internamente a `0`).
- **Efectos Secundarios (Revalidación de Caché)**:
  Ejecuta `revalidatePath` para invalidar y regenerar la caché bajo demanda de:
  - El visor público: `/i/[slug]`
  - La vista detallada en el panel de administración: `/admin/pedidos/[id]`
- **Salida exitosa (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "cuid-del-rsvp",
      "pedidoId": "cuid-del-pedido",
      "nombre": "Juan Pérez",
      "asiste": true,
      "pax": 2,
      "telefono": "5512345678",
      "mensaje": "¡Ahí nos vemos!",
      "createdAt": "2026-06-13T19:50:00.000Z"
    }
  }
  ```
- **Códigos de error**:
  - `400 Bad Request`: Esquema JSON inválido o error en validación Zod.
  - `404 Not Found`: Si la invitación asociada al `slug` no existe.
  - `500 Internal Server Error`: Error de persistencia en PostgreSQL o de conexión con Neon.

---

### 4. Registro de Visitas y Analíticas (`/api/analytics`)
Registra de forma pasiva y en segundo plano las métricas de tráfico de las invitaciones.

- **Método**: `POST`
- **Entrada (JSON Body)**:
  ```json
  {
    "slug": "sofia-hernandez-30-anos",
    "ip": "192.168.1.1", // Opcional (obtenido automáticamente de cabeceras si falta)
    "userAgent": "Mozilla/5.0..." // Opcional (obtenido automáticamente de cabeceras si falta)
  }
  ```
- **Lógica de Fallback de Cliente**:
  Si no se proporciona `ip` o `userAgent` en el cuerpo de la petición, el backend intenta extraerlos de:
  - Cabecera `x-forwarded-for` (detrás de Proxies/Vercel) o `x-real-ip`.
  - Cabecera `user-agent` del cliente HTTP.
- **Salida exitosa (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "cuid-de-visita",
      "pedidoId": "cuid-del-pedido",
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "fecha": "2026-06-13T19:50:00.000Z"
    }
  }
  ```
- **Códigos de error**:
  - `400 Bad Request`: Si no se proporciona el `slug`.
  - `404 Not Found`: Si el pedido correspondiente al `slug` no existe en la base de datos.
  - `500 Internal Server Error`: Error al persistir la métrica.
