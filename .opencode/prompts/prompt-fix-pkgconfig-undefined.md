# 🚨 FIX URGENTE — Error al editar invitación: `pkgConfig is undefined`

> **Error:** `TypeError: can't access property "campos", pkgConfig is undefined`  
> **Archivo:** `src/lib/templates.ts` línea 45  
> **Ruta:** `/admin/pedidos/[id]/editar`  
> **Contexto:** Post-Fase 3. El editor crashea al intentar cargar la configuración del template.

---

## 🔍 DIAGNÓSTICO RÁPIDO (Ejecutar primero)

### Paso 1: Verificar qué está pasando en `templates.ts`

Lee el archivo `src/lib/templates.ts` y busca la función que genera `pkgConfig`.

Patrón típico:
```typescript
// PROBABLE CÓDIGO ACTUAL:
const pkgConfig = CONFIGURACION_EVENTOS[tipoEvento][paquete];
// o
const pkgConfig = PAQUETES.find(p => p.id === `${tipoEvento}-${paquete}`);
// o
const pkgConfig = getPaqueteConfig(tipoEvento, paquete);
```

**Verifica:**
1. ¿Qué valor tiene `tipoEvento`? (debe ser `"cumpleanos"`, `"boda"`, etc.)
2. ¿Qué valor tiene `paquete`? (debe ser `"esencial"`, `"completa"`, `"premium"`, etc.)
3. ¿Existe esa combinación en `CONFIGURACION_EVENTOS`?

### Paso 2: Verificar `paquetes.ts`

Lee `src/lib/paquetes.ts` y verifica:

1. ¿La estructura de `CONFIGURACION_EVENTOS` es:
   ```typescript
   const CONFIGURACION_EVENTOS = {
     cumpleanos: {
       esencial: { ... },
       completa: { ... },
       premium: { ... },  // ← ¿EXISTE? ¿Fue removido en Fase 3?
     },
     boda: { ... },
     // ...
   };
   ```

   O es:
   ```typescript
   const CONFIGURACION_EVENTOS = [
     { id: "cumpleanos-esencial", tipoEvento: "cumpleanos", ... },
     { id: "cumpleanos-completa", tipoEvento: "cumpleanos", ... },
     { id: "cumpleanos-premium", tipoEvento: "cumpleanos", ... },  // ← ¿EXISTE?
   ];
   ```

2. ¿El paquete Premium de cumpleaños fue removido? Si fue removido, los pedidos existentes que usan ese paquete NO tienen configuración.

### Paso 3: Verificar el pedido en la base de datos

Si tienes acceso a la DB o puedes loggear, verifica qué valores tiene el pedido `cmq7e62p5000emgw03t5lnfgp`:

```sql
SELECT tipoEvento, paquete, estadoInvitacion FROM Pedido WHERE id = 'cmq7e62p5000emgw03t5lnfgp';
```

O agrega un `console.log` temporal en `templates.ts`:
```typescript
console.log("DEBUG templates.ts:", { tipoEvento, paquete, pkgConfig });
```

---

## 🔧 FIXES POSIBLES (Aplicar según diagnóstico)

### Fix A: Si el paquete Premium fue removido

**Causa:** En Fase 3 se "removió el paquete Premium de cumpleaños". Los pedidos existentes con ese paquete ahora no tienen config.

**Solución:** Agregar de vuelta el paquete Premium a `paquetes.ts`:

```typescript
// En src/lib/paquetes.ts, dentro de CONFIGURACION_EVENTOS
const CONFIGURACION_EVENTOS = {
  cumpleanos: {
    esencial: {
      id: "cumpleanos-esencial",
      nombre: "Esencial",
      tipoEvento: "cumpleanos",
      precio: 350,
      implementado: true,
      secciones: ["hero", "detalles"],
      campos: [
        { id: "nombre", tipo: "text", label: "Nombre del festejado", required: true },
        { id: "fechaEvento", tipo: "date", label: "Fecha del evento", required: true },
        { id: "horaEvento", tipo: "time", label: "Hora", required: true },
        { id: "lugar", tipo: "text", label: "Lugar", required: true },
        { id: "mensajeBienvenida", tipo: "textarea", label: "Mensaje de bienvenida", required: false },
        { id: "fotoPortada", tipo: "image", label: "Foto principal", required: false },
      ],
    },
    completa: {
      id: "cumpleanos-completa",
      nombre: "Completa",
      tipoEvento: "cumpleanos",
      precio: 550,
      implementado: true,
      secciones: ["hero", "detalles", "galeria"],
      campos: [
        // ... campos de Esencial ...
        { id: "edad", tipo: "number", label: "Edad", required: false },
        { id: "tipoCelebracion", tipo: "select", label: "Tipo de celebración", options: ["infantil", "juvenil", "adulto", "general"], required: false },
        { id: "mensajeFestejo", tipo: "textarea", label: "Mensaje personalizado", required: false },
        { id: "fotosGaleria", tipo: "gallery", label: "Galería de fotos", maxItems: 3, required: false },
        { id: "musicaFondo", tipo: "url", label: "Música de fondo", required: false },
        { id: "colorPrimario", tipo: "color", label: "Color primario", defaultValue: "#FF6B6B", required: false },
        { id: "colorSecundario", tipo: "color", label: "Color secundario", defaultValue: "#4ECDC4", required: false },
      ],
    },
    premium: {
      id: "cumpleanos-premium",
      nombre: "Premium",
      tipoEvento: "cumpleanos",
      precio: 850,
      implementado: true,
      secciones: ["hero", "detalles", "galeria", "rsvp", "regalos", "agradecimiento", "cuentaRegresiva"],
      campos: [
        // ... campos de Completa ...
        { id: "fechaLimiteRSVP", tipo: "date", label: "Fecha límite de confirmación", required: false },
        { id: "mensajeAgradecimiento", tipo: "textarea", label: "Mensaje de agradecimiento", required: false },
        { id: "fotosGaleria", tipo: "gallery", label: "Galería de fotos", maxItems: 6, required: false },
        { id: "codigoVestimenta", tipo: "select", label: "Código de vestimenta", options: ["casual", "formal", "tematica", "elegante"], required: false },
        { id: "linkRegalos", tipo: "url", label: "Link de regalos", required: false },
        { id: "mapaPersonalizado", tipo: "boolean", label: "Mapa personalizado", required: false },
        { id: "confettiAnimacion", tipo: "boolean", label: "Activar confetti", defaultValue: true, required: false },
        { id: "cuentaRegresiva", tipo: "boolean", label: "Mostrar cuenta regresiva", defaultValue: true, required: false },
      ],
    },
  },
  // ... boda, xv, babyshower ...
};
```

### Fix B: Si la estructura de búsqueda cambió

**Causa:** `templates.ts` busca por key diferente a cómo se almacena en `paquetes.ts`.

**Ejemplo:** Si `paquetes.ts` usa array de objetos pero `templates.ts` busca por objeto anidado:

```typescript
// En templates.ts, corregir la búsqueda:

// Si CONFIGURACION_EVENTOS es objeto anidado:
const pkgConfig = CONFIGURACION_EVENTOS[tipoEvento]?.[paquete];

// Si CONFIGURACION_EVENTOS es array plano:
const pkgConfig = CONFIGURACION_EVENTOS.find(
  p => p.tipoEvento === tipoEvento && (p.id === `${tipoEvento}-${paquete}` || p.id === paquete)
);

// Si usa una función helper:
const pkgConfig = getPaqueteConfig(tipoEvento, paquete);
```

**Asegurar que hay fallback:**
```typescript
if (!pkgConfig) {
  console.error(`No se encontró config para ${tipoEvento} - ${paquete}`);
  // Fallback a Esencial:
  return CONFIGURACION_EVENTOS["cumpleanos"]["esencial"] || {
    id: "fallback",
    nombre: "Configuración no encontrada",
    campos: [],
    secciones: [],
  };
}
```

### Fix C: Si el campo `paquete` en el pedido tiene formato diferente

**Causa:** El pedido guarda `paquete` como `"cumpleanos-premium"` pero `templates.ts` espera solo `"premium"`.

**Solución:** Normalizar el valor antes de buscar:

```typescript
// En templates.ts:
const paqueteNormalizado = paquete.replace(`${tipoEvento}-`, ""); // "cumpleanos-premium" → "premium"
const pkgConfig = CONFIGURACION_EVENTOS[tipoEvento]?.[paqueteNormalizado];
```

O en `paquetes.ts`, asegurar que el ID incluye el tipoEvento:
```typescript
// Si el paquete se guarda como "cumpleanos-premium":
const pkgConfig = CONFIGURACION_EVENTOS.find(p => p.id === paquete);
```

---

## 🧪 VERIFICACIÓN

Después de aplicar el fix:

1. Reiniciar `npm run dev`
2. Navegar a `/admin/pedidos/cmq7e62p5000emgw03t5lnfgp/editar`
3. Verificar que el editor carga sin errores
4. Verificar que la preview se renderiza
5. Verificar que los campos del paquete correcto se muestran (Esencial/Completa/Premium)

---

## 📝 COMMIT

```bash
git add src/lib/paquetes.ts src/lib/templates.ts
git commit -m "fix(templates): restaurar config de paquetes y corregir lookup de pkgConfig"
```

---

## ⚠️ REGLAS DE ESTE FIX

1. **NO toques el editor** (`editor-client.tsx`) a menos que el error persista después de fixear `templates.ts` y `paquetes.ts`.
2. **NO toques el schema de Prisma**.
3. **Mantén backward compatibility** — si hay pedidos con formato antiguo de `paquete`, deben seguir funcionando.
4. **Agrega un fallback** — si `pkgConfig` no se encuentra, no crashear, usar config por defecto.
