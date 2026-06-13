import { z } from 'zod';

export const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const urlValidation = z
  .string()
  .optional()
  .nullable()
  .or(z.literal(''))
  .refine(
    (val) => {
      if (!val) return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Debe ser una URL válida (ej. https://ejemplo.com)' }
  );

// Draft Schema: All fields optional/nullable/empty, only formats are validated if provided
export const draftPedidoSchema = z
  .object({
    nombres: z.string().optional().nullable().or(z.literal('')),
    fecha: z.string().optional().nullable().or(z.literal('')),
    ubicacion: z.string().optional().nullable().or(z.literal('')),
    mapaUrl: urlValidation,
    mensaje: z.string().optional().nullable().or(z.literal('')),
    colorPrincipal: z
      .string()
      .optional()
      .nullable()
      .or(z.literal(''))
      .refine((val) => !val || hexColorRegex.test(val), {
        message: 'Debe ser un color hexadecimal válido (ej. #FFFFFF)',
      }),
    colorSecundario: z
      .string()
      .optional()
      .nullable()
      .or(z.literal(''))
      .refine((val) => !val || hexColorRegex.test(val), {
        message: 'Debe ser un color hexadecimal válido (ej. #FFFFFF)',
      }),
    portadaUrl: urlValidation,
    dressCode: z.string().optional().nullable().or(z.literal('')),
    regalosDatos: z.string().optional().nullable().or(z.literal('')),
    musicaUrl: urlValidation,
    nombreBebe: z.string().optional().nullable().or(z.literal('')),
    padrinos: z.string().optional().nullable().or(z.literal('')),
    padres: z.string().optional().nullable().or(z.literal('')),
  })
  .passthrough();

// Publication Schema: Enforces required fields based on template
export const publishPedidoSchema = (templateType: string) => {
  const base: Record<string, z.ZodTypeAny> = {
    nombres: z.string().min(2, 'El nombre del evento debe tener al menos 2 caracteres'),
    fecha: z.string().min(1, 'La fecha y hora del evento es requerida'),
    ubicacion: z.string().min(1, 'La ubicación es requerida'),
    mapaUrl: urlValidation,
    mensaje: z.string().optional().nullable().or(z.literal('')),
    colorPrincipal: z
      .string()
      .optional()
      .nullable()
      .or(z.literal(''))
      .refine((val) => !val || hexColorRegex.test(val), {
        message: 'Debe ser un color hexadecimal válido (ej. #FFFFFF)',
      }),
    colorSecundario: z
      .string()
      .optional()
      .nullable()
      .or(z.literal(''))
      .refine((val) => !val || hexColorRegex.test(val), {
        message: 'Debe ser un color hexadecimal válido (ej. #FFFFFF)',
      }),
    portadaUrl: urlValidation,
    dressCode: z.string().optional().nullable().or(z.literal('')),
    regalosDatos: z.string().optional().nullable().or(z.literal('')),
    musicaUrl: urlValidation,
    nombreBebe: z.string().optional().nullable().or(z.literal('')),
    padrinos: z.string().optional().nullable().or(z.literal('')),
    padres: z.string().optional().nullable().or(z.literal('')),
  };

  if (templateType === 'baby-shower') {
    base.nombreBebe = z.string().min(1, 'El nombre del bebé es requerido');
  }

  return z.object(base);
};

// Backwards compatibility alias for actions.ts to use draft validation when saving
export const savePedidoSchema = (templateType?: string) => {
  if (templateType) {
    // Dummy reference to satisfy ESLint no-unused-vars
  }
  return draftPedidoSchema;
};
