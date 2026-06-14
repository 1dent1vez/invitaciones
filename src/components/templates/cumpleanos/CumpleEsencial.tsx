'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Shirt } from 'lucide-react';
import { InvitacionData } from '@/types';
import { getOptimizedImageUrl, getFraseEdad, formatFechaMX } from './shared/utils';
import { MapsLink } from './shared/MapsLink';
import { RSVPWrapper } from './shared/RSVPWrapper';
import { HeroPortada } from './shared/HeroPortada';

if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: class IntersectionObserver {
      observe() {
        // mock
      }
      unobserve() {
        // mock
      }
      disconnect() {
        // mock
      }
    },
  });
}

interface CumpleEsencialProps {
  data: InvitacionData & {
    coordenadas?: { lat: number; lng: number };
  };
  fechaEvento?: Date;
  direccion?: string;
}

// Animación de entrada para secciones
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export function CumpleEsencial({ data, fechaEvento, direccion }: CumpleEsencialProps) {
  const nombreFestejado = data.nombre ?? data.nombres ?? 'Festejado';
  const edadFestejado = data.edad ?? '';
  const fraseEdad = data.edad ? getFraseEdad(Number(data.edad)) : '';
  const fotoPortada = getOptimizedImageUrl(
    data.fotoPortada ??
      data.portadaUrl ??
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop'
  );

  const lugarFiesta = data.lugar ?? data.ubicacion ?? 'Lugar del Evento';
  const direccionFiesta = direccion ?? data.direccion ?? '';
  const horaFiesta = data.hora ?? '';

  // Parse and format date
  const dateObj = fechaEvento ?? (data.fecha ? new Date(data.fecha) : null);
  let dateText = '';
  if (dateObj && !isNaN(dateObj.getTime())) {
    dateText = formatFechaMX(dateObj);
  } else {
    dateText = data.fecha ?? '';
  }

  const primaryColor = data.colorPrimario ?? '#F97316';
  const themeStyles = {
    '--primary': primaryColor,
  } as React.CSSProperties;

  return (
    <div
      style={themeStyles}
      className="flex-1 flex flex-col justify-between bg-[#FEF7F0] text-gray-800 pb-16 relative md:max-w-2xl md:mx-auto md:shadow-2xl min-h-screen font-sans"
    >
      <HeroPortada
        data={data}
        fotoPortada={fotoPortada}
        nombreFestejado={nombreFestejado}
        edadFestejado={edadFestejado}
        fraseEdad={fraseEdad}
        dateText={dateText}
      />
      {/* Main Content Details */}
      <div className="px-6 space-y-8 mt-6 relative md:px-10 md:py-12">
        {/* Frase Festejo */}
        {data.mensaje && (
          <motion.div
            initial={fadeInUp.initial}
            whileInView={fadeInUp.whileInView}
            viewport={fadeInUp.viewport}
            transition={fadeInUp.transition}
            className="text-center py-2"
          >
            <p className="text-base italic font-light text-gray-600 max-w-xs mx-auto leading-relaxed">
              &ldquo;{data.mensaje}&rdquo;
            </p>
          </motion.div>
        )}

        {/* Detalles Card */}
        <motion.div
          initial={fadeInUp.initial}
          whileInView={fadeInUp.whileInView}
          viewport={fadeInUp.viewport}
          transition={fadeInUp.transition}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-6"
        >
          {/* Fecha */}
          <div className="flex gap-4 items-start">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-2xs tracking-wider text-gray-400 uppercase font-bold">
                ¿Cuándo?
              </span>
              <p className="text-sm font-semibold text-gray-800 capitalize">{dateText}</p>
            </div>
          </div>

          {/* Hora */}
          {horaFiesta && (
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-2xs tracking-wider text-gray-400 uppercase font-bold">
                  ¿A qué hora?
                </span>
                <p className="text-sm font-semibold text-gray-800">A las {horaFiesta} hrs</p>
              </div>
            </div>
          )}

          {/* Ubicación */}
          <div className="flex gap-4 items-start">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="space-y-1 w-full">
              <span className="text-2xs tracking-wider text-gray-400 uppercase font-bold">
                ¿Dónde?
              </span>
              <p className="text-sm font-semibold text-gray-800">{lugarFiesta}</p>
              {direccionFiesta && (
                <p className="text-xs text-gray-500 leading-normal">{direccionFiesta}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Dress code (si aplica en datos) */}
        {data.dressCode && (
          <motion.div
            initial={fadeInUp.initial}
            whileInView={fadeInUp.whileInView}
            viewport={fadeInUp.viewport}
            transition={fadeInUp.transition}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-md text-center flex flex-col items-center max-w-sm mx-auto"
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mb-2">
              <Shirt className="h-5 w-5" />
            </div>
            <span className="text-2xs tracking-wider text-gray-400 uppercase font-bold">
              Código de Vestimenta
            </span>
            <p className="text-sm font-bold text-gray-800 uppercase mt-0.5">{data.dressCode}</p>
            {data.dressCodeDesc && (
              <p className="text-xs text-gray-500 mt-1 max-w-xs">{data.dressCodeDesc}</p>
            )}
          </motion.div>
        )}

        {/* Maps Embed o Fallback */}
        <motion.div
          initial={fadeInUp.initial}
          whileInView={fadeInUp.whileInView}
          viewport={fadeInUp.viewport}
          transition={fadeInUp.transition}
          className="overflow-hidden rounded-2xl border border-gray-100 shadow-md bg-white p-2"
        >
          <MapsLink direccion={direccionFiesta} coordenadas={data.coordenadas} />
        </motion.div>

        {/* RSVP Section */}
        <RSVPWrapper whatsapp={data.whatsapp} />
      </div>

      {/* Footer */}
      <div className="w-full border-t border-gray-200/50 mt-16 pb-12" />
    </div>
  );
}

export default CumpleEsencial;
