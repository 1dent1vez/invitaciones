"use client";

import { Calendar, Clock, Gift, MapPin, Sparkles } from "lucide-react";
import { InvitacionData } from "@/types";

interface CumpleanosFiestaProps {
  data: InvitacionData;
}

export function CumpleanosFiesta({ data }: CumpleanosFiestaProps) {
  const defaultTimeline = data.timeline && data.timeline.length > 0 ? data.timeline : [
    { hora: "08:00 PM", titulo: "Llegada & Recepción", notas: "¡Cóctel de bienvenida!" },
    { hora: "09:30 PM", titulo: "Cena & Taquiza", notas: "Deliciosos snacks" },
    { hora: "11:00 PM", titulo: "Cantar Pastel", notas: "¡Las mañanitas!" },
    { hora: "11:30 PM", titulo: "DJ & Fiesta", notas: "Hasta que el cuerpo aguante" },
  ];

  let dateText = data.fecha;
  try {
    const d = new Date(data.fecha);
    if (!isNaN(d.getTime())) {
      dateText = d.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }) + " - " + d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    }
  } catch {
    // fallback
  }

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#0B0C10] text-[#C5C6C7] pb-16 relative">
      {/* CSS Confetti / Floating Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-12 left-10 h-3 w-3 rounded-full bg-amber-400 animate-ping" />
        <div className="absolute top-36 right-16 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        <div className="absolute top-2/3 left-16 h-3 w-3 rounded-full bg-violet-400 animate-bounce" />
        <div className="absolute top-1/2 right-12 h-2.5 w-2.5 rounded-full bg-rose-500" />
      </div>

      <div className="absolute inset-4 border border-slate-900 pointer-events-none rounded-xl" />

      {/* Header */}
      <div className="pt-20 px-6 text-center flex flex-col items-center gap-4 relative">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 mb-2">
          <Sparkles className="h-5 w-5" />
        </div>
        <span className="text-xs uppercase tracking-[0.35em] text-[var(--primary)] font-bold">¡Estás Invitado!</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight uppercase font-sans">
          ¡A Celebrar!
        </h1>
        <div className="text-2xl font-bold text-[var(--primary)] font-mono">
          {data.nombres}
        </div>
        {data.mensaje && (
          <p className="text-sm italic font-light text-slate-400 max-w-xs mt-2">
            &ldquo;{data.mensaje}&rdquo;
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-8 my-8 relative">
        
        {/* Date and Location Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
          {/* Date */}
          <div className="flex gap-4 items-start">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-950 text-[var(--primary)] shrink-0 border border-slate-800">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-400 uppercase font-semibold">Día del Festejo</span>
              <p className="text-sm font-semibold text-white capitalize">{dateText}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex gap-4 items-start">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-950 text-[var(--primary)] shrink-0 border border-slate-800">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-400 uppercase font-semibold">¿Dónde será?</span>
              <p className="text-sm font-semibold text-white">{data.ubicacion}</p>
              {data.mapaUrl && (
                <a
                  href={data.mapaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:underline mt-1 font-semibold"
                >
                  Ver dirección
                  <Sparkles className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Schedule */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold text-center block">Programa de la Fiesta</span>
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 space-y-4">
            {defaultTimeline.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start relative pb-4 last:pb-0">
                {/* Connector line */}
                {idx < defaultTimeline.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-[1px] bg-slate-800" />
                )}
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-950 text-slate-400 shrink-0 border border-slate-800/60 z-10">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-mono text-[var(--primary)] font-semibold">{item.hora}</span>
                  <h4 className="text-sm font-bold text-white">{item.titulo}</h4>
                  {item.notas && <p className="text-xs text-slate-400">{item.notas}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gift details */}
        {data.regalosDatos && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-[var(--primary)]">
              <Gift className="h-5 w-5" />
              <span className="text-xs uppercase tracking-widest font-bold">Mesa de Regalos</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {data.regalosDatos}
            </p>
          </div>
        )}

        {/* RSVP Placeholder */}
        <div className="border-t border-slate-900 pt-6 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold">Confirmar Asistencia</span>
          <p className="text-xs text-slate-400">¡Asegura tu lugar para no perderte de la diversión!</p>
          <button 
            disabled 
            className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-widest shadow-xl transition-all cursor-not-allowed opacity-80"
          >
            Confirmar Lugar (Muy Pronto)
          </button>
        </div>

      </div>

      <div className="text-center pt-4 text-[10px] text-slate-700 uppercase tracking-[0.3em]">
        ¡No faltes!
      </div>
    </div>
  );
}
