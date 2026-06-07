# ❓ Preguntas Frecuentes (FAQ) — Invitaciones Digitales

Encuentra soluciones rápidas a dudas técnicas y operativas del día a día.

---

## 🔐 Acceso y Seguridad

### ¿Cómo cambio la contraseña de administración?
1. Debes modificar la variable de entorno `ADMIN_PASSWORD` en tu entorno local (archivo `.env`) o en el panel de Vercel.
2. Si cambias la contraseña en producción, todas las sesiones de administración activas caducarán automáticamente y deberás iniciar sesión con la nueva contraseña.

### El login falla diciendo "Contraseña incorrecta" o da error de servidor
- Verifica que el archivo `.env` exista en el servidor y que la variable `ADMIN_PASSWORD` tenga el valor correcto.
- Si estás en producción, asegúrate de que no haya espacios adicionales alrededor del valor de la contraseña en la configuración de Vercel.

---

## 💾 Base de Datos e Integridad

### Da un error relacionado con Prisma al guardar o cargar datos
- **Causa común**: Las migraciones de base de datos no se han ejecutado en el servidor correspondiente.
- **Solución**: Corre `npx prisma migrate deploy` en tu entorno o a través de los scripts de build de Vercel para asegurar que el esquema de la base de datos coincida con la aplicación.

### ¿Puedo eliminar un cliente con pedidos activos?
- **No**. Por seguridad y consistencia de datos, el sistema bloquea la eliminación de clientes que tengan pedidos asociados. Primero debes eliminar los pedidos del cliente o reasignarlos.

---

## 🎨 Cloudinary e Imágenes

### Las imágenes tardan mucho en cargar o fallan al subir
- **Validación de tamaño**: El límite de carga es de 5MB por archivo. Asegúrate de que las imágenes no superen este peso.
- **Formato**: Solo se permiten archivos de imagen válidos (MIME type `image/*` como JPEG, PNG, WEBP).
- **Credenciales**: Si la carga falla por completo, revisa que las variables de entorno `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET` estén configuradas correctamente.

---

## 🔗 Enlaces Públicos y Códigos QR

### ¿Cómo cambio la URL o el slug de una invitación ya publicada?
- Por defecto, el slug se genera automáticamente usando los nombres del evento y la fecha (ej. `ana-y-pedro-2027-12-31`).
- Si deseas cambiarlo, puedes actualizar el nombre del evento o la fecha del evento en el editor y hacer clic en **Republicar Cambios**. El sistema calculará y actualizará el slug y la URL si son válidos.

### El código QR no se genera o da error
- El sistema requiere que la invitación esté **publicada** antes de generar el código QR. Verifica que el pedido ya cuente con una "URL Pública" en su detalle.
- Asegúrate de que tus credenciales de Cloudinary estén activas, ya que el código QR generado se sube a Cloudinary y se guarda como enlace en la base de datos.

---

## 🚀 Despliegue y Vercel

### ¿Cómo se hace deploy de una actualización?
- Todo cambio subido a la rama `main` de tu repositorio conectado en GitHub se desplegará automáticamente en Vercel.
- Recuerda revisar que las variables de entorno estén sincronizadas en el panel de Vercel si añadiste alguna nueva configuración.
