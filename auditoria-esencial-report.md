# 🔍 AUDITORÍA — Paquete Esencial de Cumpleaños

**Fecha:** 2026-06-09  
**Auditor:** Agente de Código (Antigravity)  
**Template:** `src/components/templates/cumpleanos/CumpleEsencial.tsx`  
**Estado general:** ❌ Rechazado

---

## 📈 RESUMEN

| Categoría | ✅ Pass | ⚠️ Medio | ❌ Bloqueante |
|-----------|:-------:|:--------:|:------------:|
| Secciones | 3 | 1 | 1 |
| Portada | 1 | 2 | 2 |
| Detalles | 2 | 2 | 1 |
| Mensaje | 0 | 1 | 1 |
| RSVP | 2 | 4 | 1 |
| Footer | 0 | 0 | 1 |
| Campos cuestionario | 9 | 0 | 1 |
| Especificaciones técnicas | 1 | 6 | 0 |
| Alcance (no incluye) | 8 | 0 | 1 |
| Flujo E2E | 5 | 2 | 2 |

---

## 🔴 HALLAZGOS BLOQUEANTES

### [E-01] Footer de invitación completamente inexistente
- **Check:** #1.5 / #6.1 / #6.2 / #6.3 — Sección Footer
- **Evidencia:** [CumpleEsencial.tsx:L202-L205](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L202-L205) / [TemplateWrapper.tsx](file:///c:/Proyectos/Inv/src/components/templates/TemplateWrapper.tsx)
- **Impacto:** Faltan las leyendas de branding ("Invitación creada por [TuMarca]"), el año dinámico de la celebración ("2026") y el enlace discreto de conversión.
- **Recomendación:** Añadir el componente/elemento de footer al final de la plantilla respetando el diseño, o integrarlo directamente en el wrapper global.

### [E-02] Formato de edad del festejado incorrecto
- **Check:** #2.3 — Edad en Portada
- **Evidencia:** [CumpleEsencial.tsx:L105](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L105):
  ```tsx
  <h1 className="text-3xl font-extrabold text-white uppercase tracking-tight font-sans">
    Mis {edadFestejado} Años
  </h1>
  ```
- **Impacto:** Renders como "Mis 30 Años", violando la especificación que requiere que se muestre como `"¡[edad] años!"` (ej: "¡30 años!").
- **Recomendación:** Modificar la línea de renderizado para concatenar el número de edad y el formato deseado exactamente como se especificó: `¡{edadFestejado} años!`.

### [E-03] Ausencia de frases por defecto según rango de edad
- **Check:** #2.4 — Frase por rango
- **Evidencia:** [CumpleEsencial.tsx:L60](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L60):
  ```tsx
  const fraseMensaje = data.mensaje || "¡Celebremos juntos esta fecha especial!";
  ```
- **Impacto:** Si el cliente no especifica un mensaje personalizado en el cuestionario, el sistema muestra una frase general fija. Ignora por completo las frases preestablecidas por rango de edad (1-5, 6-17, 18-29, 30-49, 50+).
- **Recomendación:** Implementar una lógica condicional en la inicialización de la frase usando el valor de la edad:
  ```typescript
  const getFraseDefault = (edad: number) => {
    if (edad >= 1 && edad <= 5) return `¡Estoy cumpliendo ${edad} añitos!`;
    if (edad >= 6 && edad <= 17) return `¡Celebremos mis ${edad} años!`;
    if (edad >= 18 && edad <= 29) return "¡Un año más de vida, un año más de aventuras!";
    if (edad >= 30 && edad <= 49) return `¡${edad} años y contando!`;
    if (edad >= 50) return `¡${edad} años de historias por celebrar!`;
    return "¡Celebremos juntos esta fecha especial!";
  };
  ```

### [E-04] Botón de mapa sin fallback automático de búsqueda
- **Check:** #3.5 — Botón de mapa
- **Evidencia:** [CumpleEsencial.tsx:L64](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L64) y [L155-165](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L155-L165):
  ```tsx
  const mapaUrl = data.mapaUrl || data.mapsLink || "";
  ...
  {mapaUrl && (
    <a href={mapaUrl} ...>Ver dirección en Maps</a>
  )}
  ```
- **Impacto:** Si `mapsLink` o `mapaUrl` no son provistos en el formulario del pedido, el botón de mapa simplemente no se renderiza. No cumple la especificación de generar automáticamente una búsqueda con la dirección del evento (`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`).
- **Recomendación:** Ajustar la variable `mapaUrl` para incluir el fallback dinámico:
  ```typescript
  const mapaUrl = data.mapaUrl || data.mapsLink || (data.direccion ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.direccion)}` : "");
  ```

### [E-05] Sección de mensaje no condicional
- **Check:** #4.2 — Comportamiento condicional de Mensaje
- **Evidencia:** [CumpleEsencial.tsx:L125-L130](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L125-L130):
  ```tsx
  {/* Frase Festejo */}
  <div className="text-center py-2">
    <p className="text-sm italic font-light text-slate-400 max-w-xs mx-auto leading-relaxed">
      &ldquo;{fraseMensaje}&rdquo;
    </p>
  </div>
  ```
- **Impacto:** Se renderiza siempre un espacio con la frase (sea por defecto o ingresada). La sección no desaparece si no se ingresa un mensaje personalizado en `datosInvitacion`, violando el comportamiento condicional.
- **Recomendación:** Condicionar el bloque completo del mensaje:
  ```tsx
  {data.mensaje && (
    <div className="text-center py-2">
      <p className="text-sm italic font-light text-slate-400 max-w-xs mx-auto leading-relaxed">
        &ldquo;{data.mensaje}&rdquo;
      </p>
    </div>
  )}
  ```

### [E-06] Campo `mapsLink` ausente en el editor/cuestionario del paquete Esencial
- **Check:** #7.7 — Campo `mapsLink`
- **Evidencia:** [paquetes.ts:L36-L56](file:///c:/Proyectos/Inv/src/lib/paquetes.ts#L36-L56): El arreglo `campos` para `esencial` no define la llave `mapsLink` o `mapaUrl`.
- **Impacto:** Dado que el editor en [editor-client.tsx](file:///c:/Proyectos/Inv/src/app/(admin)/admin/pedidos/[id]/editar/editor-client.tsx) genera dinámicamente los campos basados en la configuración de `paquetes.ts`, el administrador no tiene forma de guardar o editar el enlace a Google Maps para el paquete Esencial, rompiendo la funcionalidad.
- **Recomendación:** Agregar el campo en la configuración de `esencial` en `paquetes.ts`:
  ```typescript
  { id: "mapsLink", tipo: "url", label: "Enlace de Google Maps", required: false, placeholder: "https://maps.google.com/..." }
  ```

### [E-07] RSVP Form sin limitación máxima de pax
- **Check:** #5.3 — Límite de pax
- **Evidencia:** [rsvp-form.tsx:L19-L22](file:///c:/Proyectos/Inv/src/app/(public)/i/[slug]/rsvp-form.tsx#L19-L22):
  ```typescript
  pax: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, "El número de personas debe ser al menos 1")
  ),
  ```
- **Impacto:** No hay regla en el esquema de validación Zod que limite el número máximo a 10 personas. Un invitado podría confirmar una cantidad descabellada de acompañantes, distorsionando el aforo de la fiesta.
- **Recomendación:** Modificar el esquema Zod agregando el límite superior:
  ```typescript
  z.number().int().min(1, "Al menos 1").max(10, "El límite máximo de acompañantes es 10")
  ```

### [E-08] Fuga de Alcance: Música de fondo activa y obligatoria en el paquete Esencial
- **Check:** #9.2 — Música de fondo (alcance)
- **Evidencia:** 
  - [paquetes.ts:L51](file:///c:/Proyectos/Inv/src/lib/paquetes.ts#L51): `campos` incluye `{ id: "musica", tipo: "select", ... required: true }`.
  - [CumpleEsencial.tsx:L90-L97](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L90-L97): Botón flotante para play/pause de música en portada.
  - [CumpleEsencial.tsx:L171-L181](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L171-L181): Caja informativa sobre música recomendada.
- **Impacto:** La música de fondo es una característica premium fuera del alcance de la invitación básica Esencial de $350. Sin embargo, está activada, es obligatoria de llenar en el cuestionario y renderiza elementos visuales/funcionales.
- **Recomendación:** Eliminar el campo `musica` de la configuración de `esencial` en `paquetes.ts` y quitar los elementos de audio de `CumpleEsencial.tsx`.

### [E-09] Inexistencia del archivo físico de la ruta RSVP independiente
- **Check:** #10.11 — Flujo E2E (Ruta RSVP independiente)
- **Evidencia:** La ruta `src/app/(public)/i/[slug]/rsvp/page.tsx` no existe en la estructura de archivos de la aplicación.
- **Impacto:** Si bien el formulario RSVP está incrustado al final de la página principal de la invitación, si el usuario intenta acceder a la subruta dedicada para RSVP obtendrá un error 404. El checklist requería verificar este archivo, sugiriendo que debería existir dicha ruta separada.
- **Recomendación:** Verificar si el RSVP independiente es un entregable requerido del paquete. De ser así, se debe crear la ruta en `src/app/(public)/i/[slug]/rsvp/page.tsx` reutilizando `<PublicRSVPForm>`.

---

## 🟡 HALLAZGOS MEDIOS

### [E-10] Portada sin ocupación del 60% de la pantalla en móvil
- **Check:** #2.1 — Altura de portada
- **Evidencia:** [CumpleEsencial.tsx:L80](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L80): `className="relative h-[380px] w-full ..."`
- **Impacto:** Altura fija de 380px que no se adapta responsivamente para representar el 60% del alto del viewport móvil (`60vh`).
- **Recomendación:** Modificar la clase de altura a `h-[60vh] min-h-[380px]` para mayor dinamismo.

### [E-11] Nombre en portada sin tipografía escalable (`clamp()`) ni validación de longitud
- **Check:** #2.2 — Nombre del festejado en portada
- **Evidencia:** [CumpleEsencial.tsx:L107-L109](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L107-L109): `className="text-xl font-bold text-white font-mono tracking-wide"`
- **Impacto:** Se utiliza una clase fija `text-xl` (muy pequeña para títulos principales de portada) en lugar de un tamaño fluido. Tampoco existe un límite en el editor para evitar que se rompa el diseño con nombres que excedan los 40 caracteres.
- **Recomendación:** Cambiar a una clase con variables de tamaño fluido en CSS o clases Tailwind escalables, y añadir límite de caracteres en el schema de validación del formulario.

### [E-12] Falta de animación Fade-in al cargar la invitación
- **Check:** #2.5 — Fade-in suave
- **Evidencia:** [CumpleEsencial.tsx:L80](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L80) / [L83](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L83): No hay estilos o clases asignadas para aplicar una transición al cargar la imagen de portada.
- **Impacto:** La imagen y la portada cargan de forma abrupta.
- **Recomendación:** Añadir una clase de animación de entrada como `animate-fade-in` (o similar ya definida en Tailwind/CSS).

### [E-13] Localización de fecha en formato de España ("es-ES")
- **Check:** #3.1 — Formato de Fecha
- **Evidencia:** [CumpleEsencial.tsx:L21](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L21): `d.toLocaleDateString("es-ES", ...)`
- **Impacto:** Puede provocar discrepancias sutiles en la redacción en México (como variaciones de conectores o mayúsculas en días/meses).
- **Recomendación:** Cambiar el locale de `"es-ES"` a `"es-MX"`.

### [E-14] Dirección larga sin truncado ni funcionalidad "Ver más"
- **Check:** #3.4 — Truncado de Dirección
- **Evidencia:** [CumpleEsencial.tsx:L154](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L154): `{direccionFiesta && <p className="text-xs text-slate-400">{direccionFiesta}</p>}`
- **Impacto:** Direcciones extensas romperán la simetría de la tarjeta de detalles sin poder colapsarse tras la tercera línea.
- **Recomendación:** Implementar un estado local en React para expandir/colapsar el texto utilizando un corte por líneas en CSS o corte por número de caracteres.

### [E-15] RSVP Form sin validación de longitud de caracteres de mensaje
- **Check:** #5.4 — Mensaje para el festejado en RSVP
- **Evidencia:** [rsvp-form.tsx:L24](file:///c:/Proyectos/Inv/src/app/(public)/i/[slug]/rsvp-form.tsx#L24): `mensaje: z.string().optional()`
- **Impacto:** Permite enviar textos indefinidamente largos al festejado, lo que puede saturar el almacenamiento o desbordar la interfaz de administración.
- **Recomendación:** Agregar restricción en Zod: `z.string().max(200, "El mensaje no debe superar los 200 caracteres").optional()`.

### [E-16] Falta de asociación semántica en Labels de formularios (Accesibilidad)
- **Check:** #8.10 — Labels en formularios
- **Evidencia:** [rsvp-form.tsx:L177-L187](file:///c:/Proyectos/Inv/src/app/(public)/i/[slug]/rsvp-form.tsx#L177-L187)
- **Impacto:** La etiqueta `<label>` no se asocia al `<Input>` mediante la propiedad `htmlFor` ni se define un `id` en el campo, degradando la accesibilidad web (lectores de pantalla).
- **Recomendación:** Vincularlos explícitamente agregando un `id` único al input y la propiedad `htmlFor` respectiva al label.

### [E-17] Falta de optimización Cloudinary para imágenes cargadas por el cliente
- **Check:** #8.4 — Imagen optimizada (LCP)
- **Evidencia:** [CumpleEsencial.tsx:L83-L87](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L83-L87):
  ```tsx
  <img src={fotoPortada} ... />
  ```
- **Impacto:** Si el cliente sube una foto de portada de cámara con resolución muy alta y peso elevado, se renderizará de forma bruta sin transformación. Afecta severamente los tiempos del Largest Contentful Paint (LCP) y consumo de datos móviles.
- **Recomendación:** Modificar la URL de la imagen si proviene de Cloudinary para inyectar automáticamente parámetros de calidad y dimensiones (`f_auto,q_auto,w_800`).

### [E-18] Tamaño del botón de reproducción de música inferior a las pautas táctiles
- **Check:** #8.9 — Área táctil de botones
- **Evidencia:** [CumpleEsencial.tsx:L93](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L93): `className="... h-10 w-10 ..."`
- **Impacto:** El tamaño es de 40px por lado, lo cual es inferior al estándar mínimo de accesibilidad táctil recomendado en dispositivos móviles (44x44px).
- **Recomendación:** Cambiar a `h-11 w-11` (44px) en la clase de Tailwind.

### [E-19] Inexistencia de adaptabilidad responsiva (Breakpoints) en la invitación
- **Check:** #8.6 — Breakpoints desktop/tablet
- **Evidencia:** [CumpleEsencial.tsx](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx): La plantilla carece de modificadores responsivos en CSS / Tailwind (`md:`, `lg:`).
- **Impacto:** La invitación se renderiza de forma idéntica en pantallas gigantes de escritorio, desaprovechando el ancho disponible y resultando en una apariencia estirada o desproporcionada.
- **Recomendación:** Diseñar y estructurar la plantilla con soporte mobile-first real y acomodar la información en múltiples columnas a partir del breakpoint `md:`.

---

## 🟢 HALLAZGOS BAJOS / POLISH

### [E-20] Ausencia de animación de Confeti CSS al confirmar
- **Check:** #5.7 — Confeti CSS
- **Evidencia:** [rsvp-form.tsx](file:///c:/Proyectos/Inv/src/app/(public)/i/[slug]/rsvp-form.tsx)
- **Impacto:** Detalle estético/lúdico que incrementa la satisfacción del usuario ausente en la confirmación.
- **Recomendación:** Integrar una librería de confeti ultraligera o una animación CSS autogenerada en el estado de éxito `isSubmitted`.

### [E-21] Pobre contraste de color en textos del pie de página
- **Check:** #8.8 — Contraste mínimo
- **Evidencia:** [CumpleEsencial.tsx:L202](file:///c:/Proyectos/Inv/src/components/templates/cumpleanos/CumpleEsencial.tsx#L202): `className="... text-slate-700 ..."` sobre fondo `#0B0C10`.
- **Impacto:** El contraste resultante es de ~2.1:1, lo que dificulta mucho su lectura y viola el mínimo de 4.5:1 de accesibilidad de la W3C.
- **Recomendación:** Cambiar el color del texto a `text-slate-400` o `text-slate-500`.

### [E-22] Validación de longitud mínima del nombre de RSVP es menor al estándar
- **Check:** #5.1 — Nombre completo (longitud)
- **Evidencia:** [rsvp-form.tsx:L15](file:///c:/Proyectos/Inv/src/app/(public)/i/[slug]/rsvp-form.tsx#L15): `z.string().min(2, ...)`
- **Impacto:** Permite ingresar nombres sumamente cortos (de 2 letras, ej. "Al") en lugar del estándar de 3 caracteres indicado en el checklist.
- **Recomendación:** Cambiar `.min(2, ...)` a `.min(3, ...)` en Zod.

---

## ✅ CHECKS QUE PASARON

- **#1.1 Portada:** Renderiza correctamente el nombre, edad, frase y foto.
- **#1.2 Detalles:** Renderiza de forma clara e interactiva la fecha, hora, lugar de la celebración y el botón de mapas (cuando existe link).
- **#1.3 Mensaje:** Muestra correctamente el mensaje provisto por el usuario.
- **#1.4 Confirmación (RSVP):** El flujo básico de confirmación está completamente integrado en la invitación a través de un botón modal que guarda con éxito las respuestas.
- **#3.2 Hora:** Renderiza la hora de forma legible concatenando el sufijo "hrs" (ej. "A las 20:00 hrs").
- **#3.3 Nombre del lugar:** Renderiza correctamente en texto plano.
- **#5.2 Toggle Asistencia:** Permite alternar entre "Sí, asistiré" y "No podré asistir".
- **#5.5 Botón confirmar:** Implementado con transición de cargando y re-establecimiento de estados.
- **#7.1 a #7.6, #7.8 a #7.10 Campos del Cuestionario:** Nombre, edad, fecha, hora, lugar, dirección, foto de portada, mensaje y WhatsApp son campos soportados tanto en el editor como en la base de datos PostgreSQL/Prisma.
- **#8.5 Mobile-first:** La interfaz se enfoca principalmente en la proporción y usabilidad móvil.
- **#9.1, #9.3 a #9.9 Alcance restringido:** No se incluyen elementos fuera de alcance como galerías, contadores, vestimenta, buzones de deseos, álbumes QR post-evento, segundo idioma o temáticas personalizadas dentro de `CumpleEsencial.tsx`.
- **#10.1 y #10.3 a #10.5 Flujo Admin:** Funciones para crear el pedido, subir imagen, guardar borrador automático y publicar la invitación en estado "PUBLICADA" funcionan correctamente.
- **#10.8 y #10.9 Integración de Datos:** Los registros RSVP se vinculan al pedido correspondiente en la base de datos y se pueden visualizar, al igual que la generación del código QR dinámico.
- **#10.10 Meta tags OG:** Genera etiquetas OpenGraph dinámicas que se configuran adecuadamente para compartir en WhatsApp.

---

## 📝 NOTAS DEL AUDITOR

1. **Falta de uniformidad en campos opcionales vs requeridos:** El campo de música es requerido en la base de datos y en la lógica de configuración para el paquete Esencial, lo cual es contraproducente ya que no debería formar parte de la oferta de este paquete básico de $350.
2. **Deficiencias de accesibilidad:** Se detectó la falta de asociación semántica en los campos de formulario y varios problemas de contraste con el fondo `#0B0C10` que impiden una lectura fluida.
3. **Optimización de imágenes:** Es muy recomendable forzar la re-dimensión de las fotos de portada cargadas por los usuarios. Dado que la invitación es predominantemente de carga rápida, renderizar imágenes masivas sin compresión afecta gravemente el rendimiento del LCP.
