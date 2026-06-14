# 🎂 Estructura de Plantillas de Cumpleaños (cumpleanos/)

Este documento detalla la estructura modular de las plantillas del tipo de evento **Cumpleaños** y cómo se relacionan con los componentes comunes centralizados en `src/components/templates/cumpleanos/shared/`.

---

## 🎛️ Vista General de Componentes y Plantillas

El proyecto soporta tres niveles de paquetes/plantillas bajo `src/components/templates/cumpleanos/`:
1. `CumpleEsencial.tsx` (Básico — $350)
2. `CumpleCompleta.tsx` (Intermedio — $550)
3. `CumplePremium.tsx` (Avanzado — $850)

Cada una consume propiedades bajo la interfaz común `InvitacionData` y renderiza un subconjunto específico de componentes y lógica compartida de la carpeta `shared/`:

| Componente Compartido | Propósito | Esencial | Completa | Premium |
|---|---|:---:|:---:|:---:|
| `HeroPortada.tsx` | Cabecera visual animada con foto de portada y título | Sí | Sí | Sí |
| `useCountdown.ts` | Hook personalizado para calcular el tiempo restante | No | No | Sí |
| `ConfettiAmbient.tsx` | Renderizado y disparo de partículas de confetti (canvas) | No | No | Sí |
| `RSVPWrapper.tsx` | Contenedor de formulario de confirmación de asistencia | Sí | Sí | Sí |
| `RSVPForm.tsx` | Formulario interno interactivo con validaciones y envío | Sí | Sí | Sí |
| `MapsLink.tsx` | Enlace dinámico o iframe embebido para Google Maps | Sí | Sí | Sí |
| `utils.ts` | Optimizaciones de imágenes de Cloudinary, formateadores | Sí | Sí | Sí |

---

## 🧩 Detalle de Componentes Compartidos (`shared/`)

### 1. `HeroPortada.tsx`
Renderiza la sección inicial de la invitación.
- **Funcionalidad**: Carga la imagen de portada y aplica un gradiente para asegurar la legibilidad del texto superior. Integra el reproductor de música en las versiones *Completa* y *Premium*.
- **Props Clave**:
  ```typescript
  interface HeroPortadaProps {
    data: InvitacionData;
    fotoPortada: string;
    nombreFestejado: string;
    edadFestejado: string | number;
    dateText: string;
    isPlaying?: boolean;
    onToggleMusic?: () => void;
    showConfettiButton?: boolean;
    onTriggerConfetti?: () => void;
    isPremium?: boolean;
    tematicaDeco?: string;
  }
  ```

### 2. `useCountdown.ts`
Un hook de React que gestiona el estado dinámico del contador regresivo.
- **Funcionalidad**: Recibe una cadena de fecha, calcula la diferencia en milisegundos y actualiza cada segundo un objeto `{ days, hours, minutes, seconds }`. Retorna `null` si la fecha ya pasó o es inválida.

### 3. `ConfettiAmbient.tsx`
Añade un ambiente interactivo usando `canvas-confetti`.
- **Funcionalidad**: Expone la función `triggerConfetti()` que dispara ráfagas multicolores en ráfagas laterales y centrales. El componente `ConfettiAmbient` se monta en la plantilla *Premium* para renderizar de manera transparente sobre el fondo oscuro.

### 4. `RSVPWrapper.tsx` y `RSVPForm.tsx`
Manejan la confirmación de asistencia del invitado.
- **Funcionalidad**: `RSVPForm` captura el nombre, cantidad de acompañantes (pax), teléfono y un mensaje opcional. Envía una petición `POST` al endpoint `/api/rsvp` y muestra un estado de éxito o error con animaciones de Framer Motion. Si el envío es exitoso, ofrece un botón directo para enviar confirmación vía WhatsApp al anfitrión.

### 5. `MapsLink.tsx`
- **Funcionalidad**: Recibe la dirección física y el enlace de Google Maps. Genera un botón estilizado interactivo. Si se proporcionan coordenadas (`coordenadas?: { lat: number; lng: number }`), renderiza un mapa visual embebido para facilitar la orientación del invitado.

### 6. `utils.ts`
Contiene funciones utilitarias independientes de React:
- `getOptimizedImageUrl(url)`: Modifica las URLs de Cloudinary inyectando parámetros de optimización automáticos (`f_auto,q_auto,w_800`).
- `getFraseEdad(edad)`: Retorna un string dinámico y festivo adaptado a la edad del cumpleañero.
- `formatFechaMX(fecha)`: Formatea objetos `Date` a español de México (ej. *"sábado, 13 de junio de 2026"*).
- `parseItinerario(text)`: Convierte un texto plano formateado por saltos de línea o guiones en un array estructurado de eventos `{ hora, event }`.

---

## 🎨 Convenciones de Diseño y Paleta Temática

Los componentes compartidos adaptan su paleta de colores dinámicamente mediante variables CSS inyectadas en línea en el contenedor raíz:

1. **CumpleEsencial / CumpleCompleta** (Fondo Claro):
   - Inyectan `--primary` y `--secondary` en base a `data.colorPrimario` y `data.colorSecundario`.
   - Utilizan clases como `bg-[var(--primary)]/10` y `text-[var(--primary)]` para micro-detalles y botones.
   
2. **CumplePremium** (Sleek Dark Mode):
   - Diseñado sobre un fondo oscuro `#0B0C10` y texto claro `#C5C6C7`.
   - Inyecta una variable de color de acento dinámico (`colorAcento`: Dorado, Plateado, Rosa, Azul, Verde) para detalles premium en bordes y botones.
