'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { InvitacionData } from '@/types';

interface HeroPortadaProps {
  data: InvitacionData;
  fotoPortada: string;
  nombreFestejado: string;
  edadFestejado: string;
  fraseEdad?: string;
  dateText?: string;
  // Music config
  isPlaying?: boolean;
  onToggleMusic?: () => void;
  // Confetti config
  showConfettiButton?: boolean;
  onTriggerConfetti?: () => void;
  // Premium specific configs
  isPremium?: boolean;
  tematicaDeco?: string;
  // Styling overrides
  className?: string;
  gradientFrom?: string;
}

export function HeroPortada({
  data,
  fotoPortada,
  nombreFestejado,
  edadFestejado,
  fraseEdad = '',
  dateText = '',
  isPlaying = false,
  onToggleMusic,
  showConfettiButton = false,
  onTriggerConfetti,
  isPremium = false,
  tematicaDeco = '',
  className = '',
  gradientFrom = 'from-black',
}: HeroPortadaProps) {
  const shouldReduceMotion = useReducedMotion();

  // Basic styling for the container
  const containerClasses = isPremium
    ? `relative h-[440px] w-full overflow-hidden flex items-end ${className}`
    : `relative h-[65vh] min-h-[450px] max-h-[80vh] w-full overflow-hidden flex items-end animate-fade-in md:h-[50vh] md:rounded-t-2xl ${className}`;

  const gradientClasses = isPremium
    ? `absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/40 to-transparent z-10`
    : `absolute inset-0 bg-gradient-to-t ${gradientFrom} via-black/40 to-transparent z-10`;

  return (
    <div className={containerClasses}>
      <div className={gradientClasses} />

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
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

      {/* Confetti float button */}
      {showConfettiButton && onTriggerConfetti && (
        <button
          onClick={onTriggerConfetti}
          className="absolute top-6 left-6 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-slate-950/70 border border-white/10 text-xl backdrop-blur-sm shadow-xl active:scale-95 transition-all hover:bg-slate-900 cursor-pointer"
          title="Lanzar Confetti"
        >
          🎉
        </button>
      )}

      {/* Float button for background music */}
      {data.musicaUrl && onToggleMusic && (
        <button
          onClick={onToggleMusic}
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

      {isPremium ? (
        <div className="w-full p-8 z-10 space-y-2 text-center">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 mb-1">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <p className="text-2xs uppercase tracking-[0.3em] text-[var(--primary)] font-bold">
            VIP Invitation
          </p>
          <h1 className="text-4xl font-extrabold text-white uppercase tracking-tight font-sans">
            Mis {edadFestejado} Años
          </h1>
          <h2 className="text-xl font-bold text-white font-mono tracking-wide">
            {nombreFestejado}
          </h2>
          {tematicaDeco && (
            <span className="inline-block rounded-full bg-[var(--primary)]/10 px-3 py-0.5 text-3xs font-semibold text-[var(--primary)] ring-1 ring-[var(--primary)]/20 uppercase tracking-widest mt-1">
              Temática: {tematicaDeco}
            </span>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default HeroPortada;
