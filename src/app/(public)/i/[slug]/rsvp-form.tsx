'use client';

import React, { useState, useTransition } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, CheckCircle, X, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createRSVPAction } from './actions';

const rsvpFormSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  asiste: z.boolean({
    required_error: 'Selecciona si asistirás o no',
  }),
  pax: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, 'Al menos 1').max(10, 'El límite máximo de acompañantes es 10')
  ),
  telefono: z.string().optional(),
  mensaje: z.string().max(200, 'El mensaje no debe superar los 200 caracteres').optional(),
});

type RSVPFormValues = z.infer<typeof rsvpFormSchema>;

interface PublicRSVPFormProps {
  slug: string;
  fechaLimiteRSVP?: string;
}

export function PublicRSVPForm({ slug, fechaLimiteRSVP }: PublicRSVPFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const isPastDeadline = React.useMemo(() => {
    if (!fechaLimiteRSVP) return false;
    const limit = new Date(fechaLimiteRSVP).getTime();
    if (isNaN(limit)) return false;
    return Date.now() > limit;
  }, [fechaLimiteRSVP]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RSVPFormValues>({
    resolver: zodResolver(rsvpFormSchema) as unknown as Resolver<RSVPFormValues>,
    defaultValues: {
      nombre: '',
      asiste: true,
      pax: 1,
      telefono: '',
      mensaje: '',
    },
  });

  const watchAsiste = watch('asiste');

  const onSubmit = async (data: RSVPFormValues) => {
    if (isPastDeadline) {
      setSubmitError('El período de confirmación ha cerrado.');
      return;
    }
    setSubmitError(null);
    startTransition(async () => {
      const res = await createRSVPAction(slug, {
        nombre: data.nombre,
        asiste: data.asiste,
        pax: data.asiste ? data.pax : 1,
        telefono: data.telefono || null,
        mensaje: data.mensaje || null,
      });

      if (res.success) {
        setIsSubmitted(true);
        setShowConfetti(true);
        reset();
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      } else {
        setSubmitError(res.error || 'Ocurrió un error al registrar el RSVP');
      }
    });
  };

  return (
    <div className="w-full px-8 pb-12 pt-6 border-t border-slate-900/60 text-center space-y-4 md:max-w-md md:mx-auto">
      <h3 className="text-xs uppercase tracking-widest text-[var(--primary)] font-sans font-semibold">
        Confirmación de Asistencia
      </h3>
      <p className="text-xs text-slate-400 font-sans px-4">
        Por favor, confírmanos tu asistencia para asegurar tu lugar en nuestro evento.
      </p>

      {isPastDeadline ? (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 flex flex-col items-center gap-2 max-w-sm mx-auto">
          <p className="text-sm font-semibold text-rose-400">Confirmación Cerrada</p>
          <p className="text-xs text-slate-400">El período de confirmación ha cerrado.</p>
        </div>
      ) : isSubmitted ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 flex flex-col items-center gap-3 animate-fade-in">
          <CheckCircle className="h-10 w-10 text-emerald-400" />
          <p className="text-sm font-semibold text-white">¡Confirmación Registrada!</p>
          <p className="text-xs text-slate-400">
            Gracias, tus detalles han sido guardados con éxito.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="mt-2 border-slate-800 text-slate-300 hover:text-white text-2xs"
          >
            Modificar o enviar otra respuesta
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => {
            setIsOpen(true);
            setIsSubmitted(false);
          }}
          className="w-full py-6 bg-[var(--primary)] hover:opacity-90 text-[#0e0e13] font-sans font-bold rounded-xl text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-[var(--primary)]/10 transition-all"
        >
          Confirmar Lugar
        </Button>
      )}

      {/* POPUP MODAL OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xs"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-md bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl p-6 text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1 pb-4 border-b border-slate-900">
                <h2 className="text-lg font-bold text-white flex items-center gap-1.5 font-serif">
                  <Sparkles className="h-5 w-5 text-[var(--primary)]" />
                  Confirmar Asistencia
                </h2>
                <p className="text-xs text-slate-400">
                  Por favor, ingresa los siguientes datos para confirmar tu lugar.
                </p>
              </div>

              {submitError && (
                <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-400">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                {/* Nombre */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="rsvp-nombre"
                    className="text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    Nombre Completo *
                  </label>
                  <Input
                    id="rsvp-nombre"
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    className="border-slate-900 bg-slate-950 text-slate-100 placeholder:text-slate-700"
                    disabled={isPending}
                    {...register('nombre')}
                  />
                  {errors.nombre && (
                    <p className="text-2xs font-semibold text-rose-500">{errors.nombre.message}</p>
                  )}
                </div>

                {/* ¿Asistirá? */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="rsvp-asiste"
                    className="text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    ¿Asistirás al evento? *
                  </label>
                  <Input type="text" id="rsvp-asiste" className="hidden" />
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setValue('asiste', true)}
                      className={`py-3 rounded-lg border text-xs font-bold tracking-wide transition-all ${
                        watchAsiste
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                          : 'border-slate-900 bg-slate-950/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      Sí, asistiré
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue('asiste', false)}
                      className={`py-3 rounded-lg border text-xs font-bold tracking-wide transition-all ${
                        !watchAsiste
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                          : 'border-slate-900 bg-slate-950/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      No podré asistir
                    </button>
                  </div>
                </div>

                {/* Cantidad de personas (Pax) - Solo se muestra si asiste es true */}
                <AnimatePresence>
                  {watchAsiste && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden space-y-1.5"
                    >
                      <label
                        htmlFor="rsvp-pax"
                        className="text-xs font-bold uppercase tracking-wider text-slate-400"
                      >
                        Cantidad de Lugares (Pax) *
                      </label>
                      <Input
                        id="rsvp-pax"
                        type="number"
                        min="1"
                        className="border-slate-900 bg-slate-950 text-slate-100"
                        disabled={isPending}
                        {...register('pax')}
                      />
                      {errors.pax && (
                        <p className="text-2xs font-semibold text-rose-500">{errors.pax.message}</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Teléfono */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Teléfono (Opcional)
                  </label>
                  <Input
                    type="tel"
                    placeholder="Ej. 5512345678"
                    className="border-slate-900 bg-slate-950 text-slate-100 placeholder:text-slate-700"
                    disabled={isPending}
                    {...register('telefono')}
                  />
                </div>

                {/* Mensaje */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="rsvp-mensaje"
                    className="text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    Mensaje para los novios / festejados
                  </label>
                  <textarea
                    id="rsvp-mensaje"
                    placeholder="Ej. ¡Muchas felicidades! Nos vemos ahí."
                    rows={3}
                    className="w-full rounded-lg border border-slate-900 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all resize-none"
                    disabled={isPending}
                    {...register('mensaje')}
                  />
                  {errors.mensaje && (
                    <p className="text-2xs font-semibold text-rose-500">{errors.mensaje.message}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-900">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-slate-900 text-slate-400 hover:text-white"
                    disabled={isPending}
                    onClick={() => setIsOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[var(--primary)] hover:opacity-90 text-[#0e0e13] font-bold"
                    disabled={isPending}
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar'}
                  </Button>
                  {showConfetti && (
                    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
                      {Array.from({ length: 20 }).map((_, i) => {
                        const left = `${i * 5}%`;
                        const delay = `${(i % 5) * 0.2}s`;
                        const duration = `${1.5 + (i % 3) * 0.5}s`;
                        const colors = [
                          '#f59e0b',
                          '#10b981',
                          '#3b82f6',
                          '#ec4899',
                          '#8b5cf6',
                          '#ef4444',
                        ];
                        const color = colors[i % colors.length];
                        return (
                          <div
                            key={i}
                            className="absolute top-0 w-2 h-4 rounded-xs animate-fall"
                            style={{
                              left,
                              backgroundColor: color,
                              animationDelay: delay,
                              animationDuration: duration,
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
