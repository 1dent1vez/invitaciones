# 📖 Manual de Operación Diaria — Invitaciones Digitales

Este documento detalla la rutina de operaciones diarias, los flujos clave del negocio y el mantenimiento básico de la plataforma.

---

## 📅 Checklist de Operación Diaria

Sigue este checklist todos los días por la mañana para asegurar el correcto funcionamiento del negocio y la satisfacción del cliente:

- [ ] **Revisar leads nuevos**:
  - Acceder al panel de administración en `/admin/leads` (o la pestaña correspondiente en el panel).
  - Revisar los mensajes de contacto entrantes de clientes potenciales.
  - Contactar a los prospectos vía WhatsApp o teléfono en menos de 2 horas.
- [ ] **Revisar pedidos próximos a vencer**:
  - En la vista principal del panel (`/admin`), revisar la lista de pedidos activos.
  - Identificar eventos cuya fecha de realización esté en los próximos 15 días.
  - Verificar con el cliente si requiere cambios de último momento y confirmar el estatus de su pago total.
- [ ] **Revisar RSVP pendientes**:
  - Monitorear el progreso de asistencia de los eventos activos.
  - Si un evento tiene un porcentaje de RSVP bajo y la fecha límite se acerca, sugerir al cliente enviar un recordatorio por WhatsApp con el enlace de la invitación.
- [ ] **Hacer backup de DB (Neon)**:
  - Neon realiza respaldos automáticos cada 24 horas y retiene los datos según el plan contratado.
  - **Procedimiento de respaldo manual o verificación**:
    1. Iniciar sesión en la consola de [Neon Console](https://console.neon.tech/).
    2. Seleccionar el proyecto correspondiente.
    3. Ir a la sección **Branches** o **Backups**.
    4. Para restaurar o clonar la base de datos a un punto específico del tiempo (Point-in-Time Recovery), crear una nueva rama a partir del timestamp deseado.

---

## ➕ Cómo crear un nuevo pedido paso a paso

Cuando un cliente adquiere una invitación, sigue estos pasos para registrarlo en el sistema:

1. **Registrar al Cliente** (si es nuevo):
   - Ve a `/admin/clientes` y haz clic en **Registrar Cliente**.
   - Ingresa su nombre completo, teléfono, correo electrónico y el canal por el cual te contactó (Instagram, WhatsApp, Tienda, etc.).
   - Haz clic en **Guardar**.
2. **Crear el Pedido**:
   - Ve a `/admin/pedidos/nuevo` (o haz clic en el botón de registrar nuevo pedido).
   - Busca el cliente registrado por su nombre y selecciónalo.
   - Haz clic en **Continuar**.
   - Rellena la información del evento:
     - **Tipo de evento**: Boda, XV Años, Baby Shower o Cumpleaños (esto seleccionará una plantilla visual por defecto).
     - **Plantilla visual**: Elige la plantilla adecuada.
     - **Fecha del evento**: Introduce la fecha y hora exacta.
     - **Precio total**: El monto cobrado en pesos mexicanos (MXN).
     - **Notas**: Agrega detalles importantes (ej. "Requiere mapa detallado", "Incluir mesa de regalos").
   - Haz clic en **Crear Pedido**. Serás redirigido a la página de detalles del pedido.
3. **Personalizar la Invitación**:
   - En los detalles del pedido, haz clic en **Editar Invitación**.
   - Completa todos los campos obligatorios del formulario (nombres de los festejados, ubicación, colores, frase de bienvenida).
   - Puedes subir imágenes de portada directly a Cloudinary usando el botón de carga.
   - Haz clic en **Guardar Cambios**.
4. **Publicar la Invitación**:
   - En el panel del editor, bajo la sección "Publicación e Internet", haz clic en **Publicar Invitación**.
   - Esto generará un enlace único `/i/[slug]` (ej. `/i/maria-y-juan-2027-12-31`) y cambiará el estado del pedido a **Entregado**.
   - Haz clic en **Generar Código QR** para obtener la imagen descargable del QR que puedes enviar al cliente para sus invitaciones impresas.

---

## 👯 Cómo clonar un pedido

El clonado es útil cuando un cliente quiere una invitación idéntica o muy similar a otra existente (por ejemplo, para eventos del mismo tipo o plantillas pre-configuradas):

1. Ve a `/admin/pedidos` y haz clic en el pedido que deseas duplicar para abrir sus detalles.
2. En la barra de herramientas superior de detalles del pedido, localiza y haz clic en el botón **Clonar Pedido**.
3. El sistema duplicará de forma segura el pedido:
   - Mantendrá el cliente original, tipo de evento, plantilla, precio y notas generales.
   - Limpiará los datos específicos del evento anterior (nombres de novios, fecha, fotos) para evitar mezclar información sensible.
   - Establecerá el estado en **Cotizado**.
4. Serás redirigido automáticamente al editor visual del nuevo pedido clonado.
5. Introduce los nuevos datos del evento, guarda y publica normalmente.
