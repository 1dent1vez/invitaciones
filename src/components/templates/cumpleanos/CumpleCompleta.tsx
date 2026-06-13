'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Shirt,
  ChevronDown,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  Gift,
  Milestone,
  X,
} from 'lucide-react';
import { InvitacionData } from '@/types';
import { getOptimizedImageUrl, getFraseEdad, formatFechaMX, parseItinerario } from './shared/utils';
import { MapsLink } from './shared/MapsLink';
import { RSVPForm } from './shared/RSVPForm';

if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: class IntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  });
}

interface CumpleCompletaProps {
  data: InvitacionData & {
    coordenadas?: { lat: number; lng: number };
  };
  fechaEvento?: Date;
  direccion?: string;
}

export function CumpleCompleta({ data, fechaEvento, direccion }: CumpleCompletaProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Animación de entrada para secciones (soporta reduced-motion)
  const fadeInUp = shouldReduceMotion
    ? {
        initial: { opacity: 1, y: 0 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-50px' },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-50px' },
        transition: { duration: 0.6, ease: 'easeOut' },
      };

  // Audio helper
  useEffect(() => {
    if (data.musicaUrl) {
      const sound = new Audio(data.musicaUrl);
      sound.loop = true;
      setAudio(sound);
    }
    return () => {
      if (audio) {
        audio.pause();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.musicaUrl]);

  const toggleMusic = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.log('Audio play failed:', err));
    }
    setIsPlaying(!isPlaying);
  };

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

  // Completa specific features & aliases
  const galleryPhotos = data.fotosGaleria ?? data.galeriaFotos ?? data.fotos ?? [];
  const codeVestimenta = data.dressCode ?? '';
  const descVestimenta = data.dressCodeDesc ?? data.dressCodeDescripcion ?? '';
  const mensajeFestejo = data.mensajeFestejo ?? data.mensajeFestejado ?? '';
  const itinerarioEventos = parseItinerario(data.itinerario);
  const regalosBanco = data.datosRegalo ?? data.regalosDatos ?? '';
  const mesaRegalosActiva = data.mesaRegalos ?? data.tieneMesaRegalos ?? false;
  const mesaRegalosDetalles = data.mesaRegalosDatos ?? '';

  const primaryColor = data.colorPrimario ?? '#F97316';
  const secondaryColor = data.colorSecundario ?? '#1F2937';
  const themeStyles = {
    '--primary': primaryColor,
    '--secondary': secondaryColor,
  } as React.CSSProperties;

  return (
    <div
      style={themeStyles}
      className="flex-1 flex flex-col justify-between bg-[#FEF7F0] text-gray-800 pb-16 relative md:max-w-2xl md:mx-auto md:shadow-2xl min-h-screen font-sans"
    >
      {/* Hero Portada */}
      <div className="relative h-[65vh] min-h-[450px] max-h-[80vh] w-full overflow-hidden flex items-end animate-fade-in md:h-[50vh] md:rounded-t-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fotoPortada}
            alt="Cumpleañero"
            className="w-full h-full object-cover select-none"
          />
        </motion.div>

        {/* Float button for background music */}
        {data.musicaUrl && (
          <button
            onClick={toggleMusic}
            className="absolute top-6 right-6 z-20 h-11 w-11 flex items-center justify-center rounded-full bg-slate-950/70 border border-white/10 text-[var(--primary)] backdrop-blur-sm shadow-xl active:scale-95 transition-all cursor-pointer"
            data-testid="toggle-musica-btn"
          >
            {isPlaying ? (
              <Volume2 className="h-5 w-5 animate-pulse" />
            ) : (
              <VolumeX className="h-5 w-5 text-slate-400" />
            )}
          </button>
        )}

        <div className="w-full p-8 z-10 space-y-4 text-center flex flex-col items-center">
          {data.tipoCelebracion && data.tipoCelebracion !== 'general' && (
            <div
              className="inline-flex items-center gap-1 rounded-full bg-violet-600/30 px-3 py-1 text-xs font-semibold ring-1 ring-violet-500/50 text-violet-300"
              data-testid="tipo-celebracion-badge"
            >
              {data.tipoCelebracion.toLowerCase() === 'infantil' && '🎈 Infantil'}
              {(data.tipoCelebracion.toLowerCase() === 'adultos' ||
                data.tipoCelebracion.toLowerCase() === 'adulto') &&
                '🍷 Adultos'}
              {data.tipoCelebracion.toLowerCase() === 'sorpresa' && '🎁 Sorpresa'}
              {data.tipoCelebracion.toLowerCase() === 'juvenil' && '🎸 Juvenil'}
              {!['infantil', 'juvenil', 'adultos', 'adulto', 'sorpresa'].includes(
                data.tipoCelebracion.toLowerCase()
              ) && `Celeb: ${data.tipoCelebracion}`}
            </div>
          )}

          <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-bold drop-shadow-md">
            ¡Estás Invitado!
          </p>

          <h2 className="text-[clamp(2rem,8vw,4rem)] font-bold text-white text-center drop-shadow-lg leading-tight tracking-tight">
            {nombreFestejado}
          </h2>

          {edadFestejado && (
            <div className="flex flex-col items-center gap-1">
              <span className="text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                {edadFestejado} Años
              </span>
              {fraseEdad && (
                <p className="text-sm font-semibold text-slate-200 drop-shadow-md">{fraseEdad}</p>
              )}
            </div>
          )}

          {dateText && (
            <p className="text-xs text-slate-200 font-medium drop-shadow-md uppercase tracking-wider">
              {dateText}
            </p>
          )}

          {/* Scroll indicator sutil */}
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="pt-2"
          >
            <ChevronDown className="w-6 h-6 text-white/80" />
          </motion.div>
        </div>
      </div>

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

        {/* Mensaje Especial / Cita */}
        {mensajeFestejo && (
          <motion.div
            initial={fadeInUp.initial}
            whileInView={fadeInUp.whileInView}
            viewport={fadeInUp.viewport}
            transition={fadeInUp.transition}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md text-center space-y-3 relative overflow-hidden"
          >
            <span className="absolute -top-4 -left-2 text-8xl font-serif text-[var(--primary)]/10 select-none pointer-events-none">
              &ldquo;
            </span>
            <span className="absolute -bottom-16 -right-2 text-8xl font-serif text-[var(--primary)]/10 select-none pointer-events-none">
              &rdquo;
            </span>

            <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold block">
              Mensaje Especial
            </span>
            <p className="text-sm text-gray-600 italic leading-relaxed max-w-md mx-auto relative z-10">
              {mensajeFestejo}
            </p>
          </motion.div>
        )}

        {/* Itinerario Timeline */}
        {itinerarioEventos.length > 0 && (
          <motion.div
            initial={fadeInUp.initial}
            whileInView={fadeInUp.whileInView}
            viewport={fadeInUp.viewport}
            transition={fadeInUp.transition}
            className="space-y-4"
          >
            <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold text-center block flex items-center justify-center gap-1.5">
              <Milestone className="h-4 w-4" />
              Programa del Evento
            </span>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md space-y-6">
              {itinerarioEventos.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start relative pb-4 last:pb-0">
                  {idx < itinerarioEventos.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-0 w-[2px] bg-[var(--primary)]/20" />
                  )}
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] shrink-0 z-10 font-bold text-sm shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="space-y-1 pt-1">
                    {item.hora && (
                      <span className="inline-block text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider bg-[var(--primary)]/5 px-2 py-0.5 rounded-full">
                        {item.hora}
                      </span>
                    )}
                    <h4 className="text-sm font-semibold text-gray-800">{item.event}</h4>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Galería de Recuerdos */}
        {galleryPhotos.length > 0 && (
          <motion.div
            initial={fadeInUp.initial}
            whileInView={fadeInUp.whileInView}
            viewport={fadeInUp.viewport}
            transition={fadeInUp.transition}
            className="space-y-4"
          >
            <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold text-center block flex items-center justify-center gap-1.5">
              <ImageIcon className="h-4 w-4" />
              Galería de Recuerdos
            </span>
            <div className="grid grid-cols-2 gap-3">
              {galleryPhotos.slice(0, 6).map((photo, index) => (
                <motion.div
                  key={index}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-md relative cursor-pointer"
                  onClick={() => setSelectedImageIndex(index)}
                  data-testid={`gallery-thumb-${index}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getOptimizedImageUrl(photo)}
                    alt={`Galería ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover select-none"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Dress code */}
        {codeVestimenta && (
          <motion.div
            initial={fadeInUp.initial}
            whileInView={fadeInUp.whileInView}
            viewport={fadeInUp.viewport}
            transition={fadeInUp.transition}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-md text-center flex flex-col items-center max-w-sm mx-auto w-full"
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mb-2">
              <Shirt className="h-5 w-5" />
            </div>
            <span className="text-2xs tracking-wider text-gray-400 uppercase font-bold">
              Código de Vestimenta
            </span>
            <p className="text-sm font-bold text-gray-800 uppercase mt-0.5">{codeVestimenta}</p>
            {descVestimenta && (
              <p className="text-xs text-gray-500 mt-1 max-w-xs">{descVestimenta}</p>
            )}
          </motion.div>
        )}

        {/* Mesa de Regalos / Datos Bancarios */}
        {mesaRegalosActiva && (
          <motion.div
            initial={fadeInUp.initial}
            whileInView={fadeInUp.whileInView}
            viewport={fadeInUp.viewport}
            transition={fadeInUp.transition}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md space-y-4 max-w-md mx-auto w-full"
            data-testid="mesa-regalos-seccion"
          >
            <div className="flex items-center gap-3 text-[var(--primary)] border-b border-gray-100 pb-3">
              <div className="h-9 w-9 flex items-center justify-center rounded-full bg-[var(--primary)]/10">
                <Gift className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs uppercase tracking-widest font-bold">Mesa de Regalos</span>
            </div>
            {regalosBanco && (
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                {regalosBanco}
              </p>
            )}
            {mesaRegalosDetalles && (
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs">
                <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wide">
                  Mesa Registrada
                </span>
                <span className="text-gray-800 font-semibold mt-0.5 block">
                  {mesaRegalosDetalles}
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Maps Embed */}
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
        <RSVPForm whatsapp={data.whatsapp} />
      </div>

      {/* Lightbox Modal Carousel (Carrusel accesible con control swipe) */}
      {selectedImageIndex !== null && galleryPhotos.length > 0 && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md select-none"
          onClick={() => setSelectedImageIndex(null)}
          data-testid="lightbox-modal"
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex(null);
            }}
            className="absolute top-6 right-6 text-white hover:text-gray-300 p-2 z-50 rounded-full bg-slate-900/60 border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            aria-label="Cerrar galería"
            data-testid="btn-cerrar"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex(
                (prev) => (prev! - 1 + galleryPhotos.length) % galleryPhotos.length
              );
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 z-50 rounded-full bg-slate-900/60 border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            aria-label="Foto anterior"
            data-testid="btn-anterior"
          >
            <ChevronDown className="h-6 w-6 rotate-90" />
          </button>

          {/* Current Image Frame */}
          <motion.div
            key={selectedImageIndex}
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-full max-h-[80vh] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(e, { offset }) => {
              const swipe = offset.x;
              const swipeThreshold = 50;
              if (swipe < -swipeThreshold) {
                setSelectedImageIndex((prev) => (prev! + 1) % galleryPhotos.length);
              } else if (swipe > swipeThreshold) {
                setSelectedImageIndex(
                  (prev) => (prev! - 1 + galleryPhotos.length) % galleryPhotos.length
                );
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getOptimizedImageUrl(galleryPhotos[selectedImageIndex])}
              alt={`Imagen ampliada ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            {/* Indicator */}
            <div className="text-white/80 text-xs font-semibold mt-4">
              {selectedImageIndex + 1} de {galleryPhotos.length}
            </div>
          </motion.div>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => (prev! + 1) % galleryPhotos.length);
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 z-50 rounded-full bg-slate-900/60 border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            aria-label="Siguiente foto"
            data-testid="btn-siguiente"
          >
            <ChevronDown className="h-6 w-6 -rotate-90" />
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="w-full border-t border-gray-200/50 mt-16 pb-12" />
    </div>
  );
}

export default CumpleCompleta;
