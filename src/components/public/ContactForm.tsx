"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { createLeadAction } from "@/app/(public)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    evento: "boda",
    fecha: "",
    telefono: "",
    mensaje: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || form.nombre.trim().length < 2) {
      toast({
        title: "Nombre inválido",
        description: "El nombre debe tener al menos 2 caracteres.",
        type: "error",
      });
      return;
    }
    if (!form.mensaje || form.mensaje.trim().length < 5) {
      toast({
        title: "Mensaje inválido",
        description: "El mensaje debe tener al menos 5 caracteres.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await createLeadAction(form);
      if (res.success) {
        toast({
          title: "¡Mensaje enviado!",
          description: "Nos pondremos en contacto contigo muy pronto.",
          type: "success",
        });
        setForm({
          nombre: "",
          evento: "boda",
          fecha: "",
          telefono: "",
          mensaje: "",
        });
      } else {
        toast({
          title: "Error al enviar",
          description: res.error || "Ocurrió un error inesperado.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error de red",
        description: "No se pudo conectar con el servidor.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto bg-slate-900/40 p-6 rounded-2xl border border-slate-900 backdrop-blur-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="nombre" className="text-xs font-semibold text-slate-300">
            Nombre Completo *
          </label>
          <Input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ana Martínez"
            required
            disabled={loading}
            className="bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-violet-500"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="telefono" className="text-xs font-semibold text-slate-300">
            Teléfono
          </label>
          <Input
            id="telefono"
            name="telefono"
            type="tel"
            value={form.telefono}
            onChange={handleChange}
            placeholder="5512345678"
            disabled={loading}
            className="bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-violet-500"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="evento" className="text-xs font-semibold text-slate-300">
            Tipo de Evento
          </label>
          <select
            id="evento"
            name="evento"
            value={form.evento}
            onChange={handleChange}
            disabled={loading}
            className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="boda">Boda</option>
            <option value="xv">XV Años</option>
            <option value="baby_shower">Baby Shower</option>
            <option value="cumpleanos">Cumpleaños</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="fecha" className="text-xs font-semibold text-slate-300">
            Fecha Tentativa
          </label>
          <Input
            id="fecha"
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
            disabled={loading}
            className="bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-violet-500"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="mensaje" className="text-xs font-semibold text-slate-300">
          Mensaje / Detalles Adicionales *
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={4}
          value={form.mensaje}
          onChange={handleChange}
          placeholder="Cuéntanos más sobre tu evento (ej. invitados esperados, tema, etc.)."
          required
          disabled={loading}
          className="flex min-h-[80px] w-full rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 font-semibold shadow-lg shadow-violet-500/20 py-5 rounded-xl transition-all"
      >
        {loading ? "Enviando..." : "Enviar Mensaje"}
      </Button>
    </form>
  );
}
