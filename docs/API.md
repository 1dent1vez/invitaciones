# 🔌 Especificación de la API — Invitaciones Digitales

Este documento proporciona la especificación técnica de la API interna del proyecto. Todos los endpoints están implementados bajo la arquitectura de Route Handlers de Next.js (`src/app/api/`) y se ejecutan en modo dinámico (`export const dynamic = 'force-dynamic'`) para evitar respuestas cacheadas obsoletas en despliegues serverless.

---

## 🗺️ Índice de Endpoints

1. [Subida de Imágenes a Cloudinary (`POST /api/upload`)](#1-subida-de-imágenes-a-cloudinary-post-apiupload)
2. [Generación de Códigos QR (`GET /api/qr`)](#2-generación-de-códigos-qr-get-apiqr)
3. [Confirmación de Asistencia RSVP (`POST /api/rsvp`)](#3-confirmación-de-asistencia-rsvp-post-apirsvp)
4. [Registro de Métricas de Visitas (`POST /api/analytics`)](#4-registro-de-métricas-de-visitas-post-apianalytics)

---

## 1. Subida de Imágenes a Cloudinary (`POST /api/upload`)

Carga imágenes proporcionadas desde el panel administrativo o el editor y las almacena en la nube de Cloudinary dentro de la carpeta `invitaciones/fotos`.

### Detalles de la Petición
- **Método**: `POST`
- **Content-Type**: `multipart/form-data`
- **Autenticación**: Restringido al flujo de edición administrativa.

### Parámetros del Body (Form-Data)
| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `file` | `File` (Binary) | Sí | Archivo de imagen a subir. Debe ser un tipo MIME válido de imagen (ej. `image/jpeg`, `image/png`, `image/webp`). |

### Reglas de Validación
- El archivo debe iniciar con la cabecera MIME `image/`.
- El peso máximo del archivo es de **5 MB** (5,242,880 bytes).

### Ejemplo de Respuesta Exitosa (`200 OK`)
```json
{
  "success": true,
  "data": "https://res.cloudinary.com/tu-cloud-name/image/upload/v123456789/invitaciones/fotos/imagen-ejemplo.jpg"
}
```

### Respuestas de Error
- **`400 Bad Request`** (MIME inválido o excede límite de 5MB):
  ```json
  {
    "success": false,
    "error": "El archivo excede el tamaño máximo permitido (5MB)"
  }
  ```
- **`500 Internal Server Error`** (Error del SDK de Cloudinary o conexión caída):
  ```json
  {
    "success": false,
    "error": "Error al subir la imagen"
  }
  ```

---

## 2. Generación de Códigos QR (`GET /api/qr`)

Genera en tiempo real un código QR apuntando a una URL y lo devuelve directamente en formato binario de imagen PNG.

### Detalles de la Petición
- **Método**: `GET`
- **Autenticación**: Ninguna (Público).

### Parámetros en Query String (URL)
| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `url` | `string` | Sí | Enlace absoluto al que redireccionará el QR al ser escaneado (ej. `https://tusitio.com/i/maria-y-pedro`). |

### Ejemplo de Petición
```http
GET /api/qr?url=https://tusitio.com/i/maria-y-pedro HTTP/1.1
Host: localhost:3000
```

### Respuesta Exitosa (`200 OK`)
- **Cabeceras HTTP**:
  - `Content-Type`: `image/png`
  - `Cache-Control`: `public, max-age=31536000, immutable` (Instruye al navegador a cachear la imagen de por vida ya que el QR es inmutable).
- **Body**: Búfer binario del archivo PNG.

### Respuestas de Error
- **`400 Bad Request`** (Falta parámetro `url`):
  ```json
  {
    "success": false,
    "error": "El parámetro URL es requerido"
  }
  ```
- **`500 Internal Server Error`** (Error al renderizar el búfer con `qrcode`):
  ```json
  {
    "success": false,
    "error": "Error al generar el código QR"
  }
  ```

---

## 3. Confirmación de Asistencia RSVP (`POST /api/rsvp`)

Registra la asistencia de un invitado, guarda su información en la base de datos y fuerza la revalidación de caché del visor y del panel de control.

### Detalles de la Petición
- **Método**: `POST`
- **Content-Type**: `application/json`
- **Autenticación**: Ninguna (Público).

### Parámetros del Body (JSON)
| Campo | Tipo | Requerido | Descripción / Validación |
|---|---|---|---|
| `slug` | `string` | Sí | Slug único de la invitación (ej. `sofia-30`). |
| `nombre` | `string` | Sí | Nombre del invitado confirmando. Mínimo 2 caracteres. |
| `asiste` | `boolean` | Sí | `true` si asistirá, `false` si declina. |
| `pax` | `number` | Sí | Número de personas que asistirán. Debe ser un entero $\ge 1$. Si `asiste` es `false`, se sobrescribe en base de datos a `0`. |
| `telefono` | `string` | No | Número de teléfono de contacto. |
| `mensaje` | `string` | No | Mensaje de felicitaciones o buenos deseos. |

### Ejemplo de Petición
```json
{
  "slug": "sofia-hernandez-30-anos",
  "nombre": "Carlos Gómez",
  "asiste": true,
  "pax": 3,
  "telefono": "5512345678",
  "mensaje": "¡Muchas felicidades, Sofi!"
}
```

### Respuesta Exitosa (`200 OK`)
- **Efecto secundario**: Invoca la revalidación del visor público (`/i/[slug]`) y de la vista del pedido en el panel administrativo (`/admin/pedidos/[id]`).
- **Body**:
  ```json
  {
    "success": true,
    "data": {
      "id": "clx123abc456",
      "pedidoId": "clp789xyz",
      "nombre": "Carlos Gómez",
      "asiste": true,
      "pax": 3,
      "telefono": "5512345678",
      "mensaje": "¡Muchas felicidades, Sofi!",
      "createdAt": "2026-06-13T19:53:00.000Z"
    }
  }
  ```

### Respuestas de Error
- **`400 Bad Request`** (Validación de Zod fallida):
  ```json
  {
    "success": false,
    "error": "El nombre debe tener al menos 2 caracteres"
  }
  ```
- **`404 Not Found`** (La invitación asociada al slug no existe):
  ```json
  {
    "success": false,
    "error": "La invitación no existe o no es válida"
  }
  ```

---

## 4. Registro de Métricas de Visitas (`POST /api/analytics`)

Registra silenciosamente las visitas únicas al visor de la invitación para análisis del administrador.

### Detalles de la Petición
- **Método**: `POST`
- **Content-Type**: `application/json`
- **Autenticación**: Ninguna (Público).

### Parámetros del Body (JSON)
| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `slug` | `string` | Sí | Slug único de la invitación abierta. |
| `ip` | `string` | No | Dirección IP del cliente. Si no se provee, el servidor lee de `x-forwarded-for` o `x-real-ip`. |
| `userAgent` | `string` | No | Agente de usuario del navegador. Si no se provee, se extrae de la cabecera `user-agent`. |

### Ejemplo de Petición
```json
{
  "slug": "sofia-hernandez-30-anos"
}
```

### Respuesta Exitosa (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "clx456def789",
    "pedidoId": "clp789xyz",
    "ip": "201.141.22.8",
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X)...",
    "fecha": "2026-06-13T19:53:05.000Z"
  }
}
```

### Respuestas de Error
- **`400 Bad Request`** (Falta el campo `slug`):
  ```json
  {
    "success": false,
    "error": "El slug es requerido"
  }
  ```
- **`404 Not Found`** (El pedido correspondiente al slug no existe):
  ```json
  {
    "success": false,
    "error": "El pedido no existe"
  }
  ```
