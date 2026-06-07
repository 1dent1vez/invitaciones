"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import { InvitacionData } from "@/types";

interface BodaEleganteProps {
  data: InvitacionData;
}

export function BodaElegante({ data }: BodaEleganteProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const calculateTimeLeft = () => {
      const difference = new Date(data.fecha).getTime() - Date.now();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [data.fecha]);

  // Date Parsing
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
    // fallback to text
  }

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#0e0e13] font-serif text-[#d8d3c9] pb-16">
      {/* Decorative Gold Border */}
      <div className="absolute inset-4 border border-[var(--primary)]/20 pointer-events-none rounded-lg" />
      
      {/* Hero Header */}
      <div className="pt-20 px-8 text-center flex flex-col items-center gap-6">
        <span className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-sans">Nuestra Boda</span>
        <h1 className="text-4xl md:text-5xl font-light text-white tracking-wide leading-tight px-4 font-serif">
          {data.nombres.split("&").map((name, i) => (
            <span key={i} className="block">
              {name.trim()}
              {i === 0 && data.nombres.includes("&") && (
                <span className="block my-2 text-2xl text-[var(--primary)] font-light font-sans">&</span>
              )}
            </span>
          ))}
        </h1>
        
        {data.mensaje && (
          <p className="text-sm italic font-light max-w-xs text-slate-400 mt-2 leading-relaxed">
            &ldquo;{data.mensaje}&rdquo;
          </p>
        )}
      </div>

      {/* Main Details */}
      <div className="my-12 px-8 space-y-10">
        
        {/* Countdown */}
        {mounted && timeLeft && (
          <div className="bg-slate-950/40 backdrop-blur-md rounded-xl p-6 border border-slate-900/60 shadow-xl text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-sans">Faltan</span>
            <div className="grid grid-cols-4 gap-2 font-sans">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-light text-white">{timeLeft.days}</span>
                <span className="text-[10px] text-slate-500 uppercase">Días</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-light text-white">{timeLeft.hours}</span>
                <span className="text-[10px] text-slate-500 uppercase">Horas</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-light text-white">{timeLeft.minutes}</span>
                <span className="text-[10px] text-slate-500 uppercase">Min</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-light text-white">{timeLeft.seconds}</span>
                <span className="text-[10px] text-slate-500 uppercase">Seg</span>
              </div>
            </div>
          </div>
        )}

        {/* Date & Location Cards */}
        <div className="space-y-6">
          {/* Date Card */}
          <div className="flex gap-4 items-start">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-950/50 border border-slate-900 text-[var(--primary)] shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs uppercase tracking-widest text-[var(--primary)] font-sans">¿Cuándo?</h4>
              <p className="text-sm font-light text-white leading-relaxed capitalize">{dateText}</p>
            </div>
          </div>

          {/* Location Card */}
          <div className="flex gap-4 items-start">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-950/50 border border-slate-900 text-[var(--primary)] shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="space-y-1 w-full">
              <h4 className="text-xs uppercase tracking-widest text-[var(--primary)] font-sans">¿Dónde?</h4>
              <p className="text-sm font-light text-white leading-relaxed">{data.ubicacion}</p>
              {data.mapaUrl && (
                <a
                  href={data.mapaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:text-white transition-colors font-sans mt-1"
                >
                  Ver en Google Maps
                  <Sparkles className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Parents / Godparents */}
        {(data.padres || data.padrinos) && (
          <div className="border-t border-slate-900/60 pt-8 space-y-6 text-center">
            {data.padres && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-sans">Con la bendición de nuestros padres</span>
                <p className="text-sm font-light text-slate-300 italic">{data.padres}</p>
              </div>
            )}
            {data.padrinos && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] font-sans">Nuestros Padrinos</span>
                <p className="text-sm font-light text-slate-300 italic">{data.padrinos}</p>
              </div>
            )}
          </div>
        )}

        {/* Dress Code */}
        {data.dressCode && (
          <div className="border-t border-slate-900/60 pt-8 text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-sans">Código de Vestimenta</span>
            <div className="bg-slate-950/30 border border-slate-900/50 rounded-xl py-4 px-6 inline-block">
              <p className="text-sm font-light text-white tracking-wide">{data.dressCode}</p>
            </div>
          </div>
        )}

        {/* RSVP Placeholder */}
        <div className="border-t border-slate-900/60 pt-8 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-sans">Confirmar Asistencia</span>
          <p className="text-xs text-slate-400 font-sans px-4">Por favor, confírmanos tu asistencia antes del evento.</p>
          <button 
            disabled 
            className="w-full py-3 bg-[var(--primary)] text-[#0e0e13] font-sans font-semibold rounded-lg text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-[var(--primary)]/10 transition-all cursor-not-allowed opacity-80"
          >
            Confirmar Lugar (Muy Pronto)
          </button>
        </div>

      </div>

      {/* Decorative Footer */}
      <div className="text-center pt-8 text-xs font-sans text-slate-500 uppercase tracking-widest">
        ¡Te esperamos!
      </div>
    </div>
  );
}
