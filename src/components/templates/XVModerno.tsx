"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin, Music2, Sparkles, Volume2, VolumeX } from "lucide-react";
import { InvitacionData } from "@/types";

interface XVModernoProps {
  data: InvitacionData;
}

export function XVModerno({ data }: XVModernoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (data.musicaUrl) {
      const aud = new Audio(data.musicaUrl);
      aud.loop = true;
      setAudio(aud);
      return () => {
        aud.pause();
      };
    }
  }, [data.musicaUrl]);

  const toggleMusic = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  // Default image gallery if none provided
  const sampleGallery = data.fotos && data.fotos.length > 0 ? data.fotos : [
    "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop"
  ];

  const heroImage = data.portadaUrl || "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=600&auto=format&fit=crop";

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
        }) + " - " + d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
      }
    }
  } catch {
    // fallback
  }

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#080510] text-[#fce7f3] pb-16 relative">
      {/* Background audio controller */}
      {mounted && data.musicaUrl && audio && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-50 h-12 w-12 flex items-center justify-center rounded-full bg-[var(--primary)] text-slate-950 shadow-2xl hover:scale-110 active:scale-95 transition-all"
        >
          {isPlaying ? <Volume2 className="h-5 w-5 animate-bounce" /> : <VolumeX className="h-5 w-5" />}
        </button>
      )}

      {/* Quinceañera Banner Image */}
      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={heroImage}
          alt={data.nombres}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080510] via-[#080510]/30 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--primary)] font-bold">Mis XV Años</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1 uppercase font-sans">
            {data.nombres}
          </h1>
        </div>
      </div>

      {/* Main Details */}
      <div className="px-6 space-y-8 mt-6">
        
        {/* Welcome Message */}
        {data.mensaje && (
          <div className="text-center italic text-sm text-slate-300 px-4 leading-relaxed font-light">
            &ldquo;{data.mensaje}&rdquo;
          </div>
        )}

        {/* Date and Location Info */}
        <div className="bg-[#140f23]/60 border border-[var(--secondary)]/30 rounded-2xl p-6 space-y-6 shadow-xl">
          {/* Date */}
          <div className="flex gap-4 items-start">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--secondary)]/15 text-[var(--primary)] shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-[var(--primary)] uppercase font-semibold">¿Cuándo es?</span>
              <p className="text-sm font-medium text-white capitalize">{dateText}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex gap-4 items-start">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--secondary)]/15 text-[var(--primary)] shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-[var(--primary)] uppercase font-semibold">¿Dónde es?</span>
              <p className="text-sm font-medium text-white">{data.ubicacion}</p>
              {data.mapaUrl && (
                <a
                  href={data.mapaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:underline mt-1 font-semibold"
                >
                  Abrir mapa
                  <Sparkles className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Photo Gallery Grid */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold text-center block">Galería de Fotos</span>
          <div className="grid grid-cols-2 gap-3">
            {sampleGallery.map((img, idx) => (
              <div key={idx} className="h-40 rounded-xl overflow-hidden shadow-md border border-[var(--secondary)]/30">
                <img src={img} alt={`Quinceañera ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Dress Code */}
        {data.dressCode && (
          <div className="text-center space-y-2 py-4 border-t border-[var(--secondary)]/30">
            <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold">Código de Vestimenta</span>
            <p className="text-sm font-medium text-slate-200">{data.dressCode}</p>
          </div>
        )}

        {/* Music Hint if not playing */}
        {mounted && data.musicaUrl && !isPlaying && (
          <div className="text-center py-2 bg-slate-900/30 border border-[var(--secondary)]/20 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-400">
            <Music2 className="h-4 w-4 text-[var(--primary)] animate-pulse" />
            Haz clic en el botón flotante para activar la música
          </div>
        )}

        {/* RSVP Placeholder */}
        <div className="border-t border-[var(--secondary)]/30 pt-6 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold">Confirmar Lugar</span>
          <p className="text-xs text-slate-400 leading-relaxed">Confirma tu asistencia con nuestro botón interactivo.</p>
          <button 
            disabled 
            className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-widest shadow-xl transition-all cursor-not-allowed opacity-80"
          >
            Confirmar Asistencia (Muy Pronto)
          </button>
        </div>

      </div>

      <div className="text-center pt-8 text-[10px] text-slate-600 uppercase tracking-[0.3em]">
        ¡Te espero para festejar!
      </div>
    </div>
  );
}
