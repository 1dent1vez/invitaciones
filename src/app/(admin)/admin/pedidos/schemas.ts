import { z } from "zod";

export const pedidoSchema = z.object({
  clienteId: z.string().min(1, "El cliente es requerido"),
  tipoEvento: z.enum(["boda", "xv", "baby_shower", "cumpleanos"], {
    message: "El tipo de evento no es válido",
  }),
  fechaEvento: z.string().min(1, "La fecha y hora del evento es requerida").refine((val) => {
    const d = new Date(val);
    if (isNaN(d.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
  }, {
    message: "La fecha y hora del evento no puede ser anterior a hoy",
  }),
  template: z.enum(["boda-elegante", "xv-moderno", "baby-shower", "cumpleanos-fiesta"], {
    message: "La plantilla no es válida",
  }),
  precio: z.preprocess((val) => Number(val), z.number().positive("El precio debe ser un número positivo")),
  notas: z.string().optional().transform(val => val || ""),
});
