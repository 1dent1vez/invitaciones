'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/ui/toast';
import { createLeadAction } from '@/app/(public)/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ContactForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    evento: 'cumpleanos',
    fecha: '',
    telefono: '',
    mensaje: '',
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
        title: 'Nombre inválido',
        description: 'El nombre debe tener al menos 2 caracteres.',
        type: 'error',
      });
      return;
    }
    if (!form.mensaje || form.mensaje.trim().length < 5) {
      toast({
        title: 'Mensaje inválido',
        description: 'El mensaje debe tener al menos 5 caracteres.',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await createLeadAction(form);
      if (res.success) {
        toast({
          title: '¡Mensaje enviado!',
          description: 'Nos pondremos en contacto contigo muy pronto.',
          type: 'success',
        });
        setForm({
          nombre: '',
          evento: 'cumpleanos',
          fecha: '',
          telefono: '',
          mensaje: '',
        });
      } else {
        toast({
          title: 'Error al enviar',
          description: res.error || 'Ocurrió un error inesperado.',
          type: 'error',
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error de red',
        description: 'No se pudo conectar con el servidor.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-[#E8B4B8]/30 shadow-md"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="nombre" className="text-xs font-semibold text-[#3D3D3D]/80">
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
            className="bg-[#F9F5F0]/60 border-[#E8B4B8]/40 text-[#3D3D3D] placeholder:text-[#3D3D3D]/30 focus-visible:ring-[#D4A373]"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="telefono" className="text-xs font-semibold text-[#3D3D3D]/80">
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
            className="bg-[#F9F5F0]/60 border-[#E8B4B8]/40 text-[#3D3D3D] placeholder:text-[#3D3D3D]/30 focus-visible:ring-[#D4A373]"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="evento" className="text-xs font-semibold text-[#3D3D3D]/80">
            Tipo de Evento
          </label>
          <select
            id="evento"
            name="evento"
            value={form.evento}
            onChange={handleChange}
            disabled={loading}
            className="flex h-10 w-full rounded-md border border-[#E8B4B8]/40 bg-[#F9F5F0]/60 px-3 py-2 text-sm text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#D4A373] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="cumpleanos">Cumpleaños</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="fecha" className="text-xs font-semibold text-[#3D3D3D]/80">
            Fecha Tentativa
          </label>
          <Input
            id="fecha"
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
            disabled={loading}
            className="bg-[#F9F5F0]/60 border-[#E8B4B8]/40 text-[#3D3D3D] placeholder:text-[#3D3D3D]/30 focus-visible:ring-[#D4A373]"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="mensaje" className="text-xs font-semibold text-[#3D3D3D]/80">
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
          className="flex min-h-[80px] w-full rounded-md border border-[#E8B4B8]/40 bg-[#F9F5F0]/60 px-3 py-2 text-sm text-[#3D3D3D] placeholder:text-[#3D3D3D]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373] disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#C85C5C] hover:bg-[#C85C5C]/90 text-white font-semibold shadow-md py-5 rounded-xl transition-all h-11"
      >
        {loading ? 'Enviando...' : 'Enviar Mensaje'}
      </Button>
    </form>
  );
}
