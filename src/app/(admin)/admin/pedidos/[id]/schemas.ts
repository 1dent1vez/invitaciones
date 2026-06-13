import { z } from 'zod';

export const pagoSchema = z.object({
  monto: z.preprocess((val) => Number(val), z.number().min(0.01, 'El monto debe ser mayor a 0')),
  metodo: z.enum(['efectivo', 'transferencia'], {
    message: 'El método de pago no es válido',
  }),
  comprobante: z.string().optional().nullable(),
  notas: z.string().optional().nullable(),
});
