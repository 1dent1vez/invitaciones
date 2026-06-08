"use client";

import { Calendar, Gift, Heart, MapPin, Sparkles } from "lucide-react";
import { InvitacionData } from "@/types";

interface BabyShowerProps {
  data: InvitacionData;
}

export function BabyShower({ data }: BabyShowerProps) {
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
    <div className="flex-1 flex flex-col justify-between bg-[#F7F4EB] text-[#4E4438] pb-16 relative">
      {/* Decorative Soft Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#d3cbb5_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
      <div className="absolute inset-4 border border-[var(--secondary)]/15 pointer-events-none rounded-2xl" />

      {/* Header */}
      <div className="pt-16 px-6 text-center flex flex-col items-center gap-4 relative">
        <div className="h-14 w-14 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shadow-inner mb-2 animate-bounce">
          <Heart className="h-6 w-6 fill-current" />
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--primary)]/80 font-semibold">¡Llega una nueva vida!</span>
        <h1 className="text-3xl font-bold tracking-tight text-[#3d3329] leading-tight font-sans">
          Baby Shower
        </h1>
        {data.nombreBebe && (
          <div className="bg-[var(--primary)]/10 text-[var(--primary)] font-semibold text-lg py-1.5 px-6 rounded-full inline-block shadow-sm">
            {data.nombreBebe}
          </div>
        )}
        <p className="text-xs text-[var(--primary)]/80 font-medium mt-1">
          Organizado con amor por: <span className="font-semibold">{data.nombres}</span>
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-6 my-8 relative">
        
        {/* Welcome Message */}
        {data.mensaje && (
          <div className="text-center italic text-sm text-[var(--primary)]/80 px-4 leading-relaxed font-medium">
            &ldquo;{data.mensaje}&rdquo;
          </div>
        )}

        {/* Date and Place cards */}
        <div className="bg-white/40 border border-[var(--secondary)]/20 rounded-2xl p-5 space-y-5 shadow-sm">
          {/* Calendar */}
          <div className="flex gap-4 items-start">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] shrink-0 shadow-sm">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-[var(--primary)]/80 uppercase font-bold">¿Cuándo será?</span>
              <p className="text-sm font-semibold text-[#3d3329] capitalize">{dateText}</p>
            </div>
          </div>

          {/* Place */}
          <div className="flex gap-4 items-start">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] shrink-0 shadow-sm">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-[var(--primary)]/80 uppercase font-bold">¿Dónde nos vemos?</span>
              <p className="text-sm font-semibold text-[#3d3329]">{data.ubicacion}</p>
              {data.mapaUrl && (
                <a
                  href={data.mapaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:text-[var(--secondary)] font-bold mt-1 underline"
                >
                  Abrir mapa
                  <Sparkles className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Gift Table Section */}
        {data.regalosDatos && (
          <div className="bg-white/40 border border-[var(--secondary)]/20 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-[var(--primary)]">
              <Gift className="h-5 w-5" />
              <span className="text-xs uppercase tracking-widest font-bold">Sugerencias de Regalos</span>
            </div>
            <p className="text-sm text-[var(--primary)]/80 leading-relaxed whitespace-pre-wrap font-medium">
              {data.regalosDatos}
            </p>
          </div>
        )}

        {/* RSVP Form Card */}
        <div className="border-t border-[var(--secondary)]/20 pt-6 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold">Confirmación</span>
          <p className="text-xs text-[var(--primary)]/80">Por favor, confírmanos si podrás acompañarnos en este día tan alegre.</p>
          <button 
            disabled 
            className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-md transition-all cursor-not-allowed opacity-80"
          >
            Confirmar Asistencia (Muy Pronto)
          </button>
        </div>

      </div>

      <div className="text-center pt-4 text-[10px] text-[#A69B8F] uppercase tracking-[0.25em]">
        ¡Te esperamos con ansias!
      </div>
    </div>
  );
}
