"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Sparkles, Music, Volume2, VolumeX } from "lucide-react";
import { InvitacionData } from "@/types";

interface CumpleEsencialProps {
  data: InvitacionData;
}

export function CumpleEsencial({ data }: CumpleEsencialProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Parse date
  let dateText = data.fecha || "";
  try {
    if (data.fecha) {
      const d = new Date(data.fecha);
      if (!isNaN(d.getTime())) {
        dateText = d.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    }
  } catch {
    // fallback
  }

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
  }, [data.musicaUrl]);

  const toggleMusic = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => console.log("Audio play failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const nombreFestejado = data.nombre || data.nombres || "Festejado";
  const edadFestejado = data.edad || "";
  const fraseMensaje = data.mensaje || "¡Celebremos juntos esta fecha especial!";
  const fotoPortada = data.fotoPortada || data.portadaUrl || "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop";
  const lugarFiesta = data.lugar || data.ubicacion || "Lugar del Evento";
  const direccionFiesta = data.direccion || "";
  const mapaUrl = data.mapaUrl || data.mapsLink || "";
  const horaFiesta = data.hora || "";

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#0B0C10] text-[#C5C6C7] pb-16 relative">
      {/* Decorative Confetti Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-12 left-10 h-3.5 w-3.5 rounded-full bg-amber-400 animate-ping" />
        <div className="absolute top-36 right-16 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        <div className="absolute top-2/3 left-16 h-3 w-3 rounded-full bg-[var(--primary)] animate-bounce" />
        <div className="absolute top-1/2 right-12 h-2.5 w-2.5 rounded-full bg-[var(--secondary)]" />
      </div>

      <div className="absolute inset-4 border border-[var(--primary)]/10 pointer-events-none rounded-2xl" />

      {/* Hero Portada */}
      <div className="relative h-[380px] w-full overflow-hidden flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/40 to-transparent z-10" />
        <img
          src={fotoPortada}
          alt="Cumpleañero"
          className="absolute inset-0 w-full h-full object-cover select-none"
        />
        
        {/* Play/Pause float button for background music */}
        {data.musicaUrl && (
          <button
            onClick={toggleMusic}
            className="absolute top-6 right-6 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-slate-950/70 border border-white/10 text-[var(--primary)] backdrop-blur-sm shadow-xl active:scale-95 transition-all"
          >
            {isPlaying ? <Volume2 className="h-5 w-5 animate-pulse" /> : <VolumeX className="h-5 w-5 text-slate-400" />}
          </button>
        )}

        <div className="w-full p-8 z-10 space-y-2 text-center">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 mb-1">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <p className="text-2xs uppercase tracking-[0.3em] text-[var(--primary)] font-bold">¡Estás Invitado!</p>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-tight font-sans">
            Mis {edadFestejado} Años
          </h1>
          <h2 className="text-xl font-bold text-white font-mono tracking-wide">
            {nombreFestejado}
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-8 mt-4 relative">
        
        {/* Frase Festejo */}
        <div className="text-center py-2">
          <p className="text-sm italic font-light text-slate-400 max-w-xs mx-auto leading-relaxed">
            &ldquo;{fraseMensaje}&rdquo;
          </p>
        </div>

        {/* Date and Location Card */}
        <div className="bg-slate-900/60 border border-[var(--primary)]/10 rounded-2xl p-5 space-y-5 shadow-xl backdrop-blur-md">
          {/* Date */}
          <div className="flex gap-4 items-start">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-950 text-[var(--primary)] shrink-0 border border-[var(--primary)]/15">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-400 uppercase font-semibold">¿Cuándo?</span>
              <p className="text-sm font-semibold text-white capitalize">{dateText}</p>
              {horaFiesta && <p className="text-xs text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" /> A las {horaFiesta} hrs</p>}
            </div>
          </div>

          {/* Location */}
          <div className="flex gap-4 items-start">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-950 text-[var(--primary)] shrink-0 border border-[var(--primary)]/15">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-400 uppercase font-semibold">¿Dónde?</span>
              <p className="text-sm font-semibold text-white">{lugarFiesta}</p>
              {direccionFiesta && <p className="text-xs text-slate-400">{direccionFiesta}</p>}
              {mapaUrl && (
                <a
                  href={mapaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:underline mt-2 font-semibold transition-all"
                >
                  Ver dirección en Maps
                  <Sparkles className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Música Card basic fallback indicator */}
        {data.musica && !data.musicaUrl && (
          <div className="bg-slate-900/40 border border-[var(--primary)]/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-950 text-[var(--primary)] border border-slate-900">
              <Music className="h-4.5 w-4.5" />
            </div>
            <div className="text-xs">
              <span className="text-slate-400 font-semibold block uppercase text-[9px] tracking-wider">Música recomendada</span>
              <span className="text-white font-medium">Género / Playlist: {data.musica}</span>
            </div>
          </div>
        )}

      </div>

      <div className="text-center pt-8 text-[10px] text-slate-700 uppercase tracking-[0.3em]">
        ¡No faltes a esta gran noche!
      </div>
    </div>
  );
}
export default CumpleEsencial;
