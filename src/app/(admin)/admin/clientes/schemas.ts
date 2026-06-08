import { z } from "zod";

export const clienteSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  telefono: z.string().optional().nullable(),
  fuente: z.enum(["tienda", "instagram", "whatsapp", "referido"], {
    message: "La fuente no es válida",
  }),
  email: z.preprocess((val) => (val === "" ? null : val), z.string().email("El correo electrónico no es válido").optional().nullable()),
  notas: z.string().optional().nullable(),
});
