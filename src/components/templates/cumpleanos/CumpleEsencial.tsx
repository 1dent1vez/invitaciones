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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const getFraseDefault = (edad?: number | string | null): string => {
    if (edad === undefined || edad === null || edad === "") {
      return "¡Celebremos juntos esta fecha especial!";
    }
    const age = Number(edad);
    if (isNaN(age) || age <= 0) {
      return "¡Celebremos juntos esta fecha especial!";
    }
    if (age >= 1 && age <= 5) return `¡Estoy cumpliendo ${age} añitos!`;
    if (age >= 6 && age <= 17) return `¡Celebremos mis ${age} años!`;
    if (age >= 18 && age <= 29) return "¡Un año más de vida, un año más de aventuras!";
    if (age >= 30 && age <= 49) return `¡${age} años y contando!`;
    return `¡${age} años de historias por celebrar!`;
  };

  const nombreFestejado = data.nombre || data.nombres || "Festejado";
  const edadFestejado = data.edad || "";
  const fraseMensaje = data.mensaje || getFraseDefault(data.edad);
  const fotoPortada = data.fotoPortada || data.portadaUrl || "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop";
  const lugarFiesta = data.lugar || data.ubicacion || "Lugar del Evento";
  const direccionFiesta = data.direccion || "";
  const mapaUrl = data.mapsLink || data.mapaUrl || (direccionFiesta ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionFiesta)}` : "");
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fotoPortada}
          alt="Cumpleañero"
          className="absolute inset-0 w-full h-full object-cover select-none"
        />
        


        <div className="w-full p-8 z-10 space-y-2 text-center flex flex-col items-center">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 mb-1">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <p className="text-2xs uppercase tracking-[0.3em] text-[var(--primary)] font-bold">¡Estás Invitado!</p>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-tight font-sans">
            ¡{edadFestejado} años!
          </h1>
          <h2 className="text-xl font-bold text-white font-mono tracking-wide">
            {nombreFestejado}
          </h2>
          {fraseMensaje && (
            <p className="text-xs italic text-slate-300 max-w-xs mx-auto mt-2 opacity-90">
              {fraseMensaje}
            </p>
          )}
          {data.tipoCelebracion && data.tipoCelebracion !== "general" && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-violet-600/30 px-3 py-1 text-xs font-semibold ring-1 ring-violet-500/50 text-violet-300" data-testid="tipo-celebracion-badge">
              {(data.tipoCelebracion.toLowerCase() === "infantil") && "🎈 Infantil"}
              {(data.tipoCelebracion.toLowerCase() === "juvenil") && "🎸 Juvenil"}
              {(data.tipoCelebracion.toLowerCase() === "adultos" || data.tipoCelebracion.toLowerCase() === "adulto") && "🍷 Adultos"}
              {(data.tipoCelebracion.toLowerCase() === "sorpresa") && "🎁 Sorpresa"}
              {!["infantil", "juvenil", "adultos", "adulto", "sorpresa"].includes(data.tipoCelebracion.toLowerCase()) && `Celeb: ${data.tipoCelebracion}`}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-8 mt-4 relative">
        
        {/* Frase Festejo */}
        {data.mensaje && (
          <div className="text-center py-2">
            <p className="text-sm italic font-light text-slate-400 max-w-xs mx-auto leading-relaxed">
              &ldquo;{data.mensaje}&rdquo;
            </p>
          </div>
        )}

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



      </div>

      {data.whatsapp && (
        <div className="px-6 py-2">
          <a
            href={`https://wa.me/${data.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-98 text-sm"
            data-testid="whatsapp-confirmar"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.488 1.449 5.413 1.451 5.617 0 10.193-4.579 10.197-10.198.002-2.722-1.053-5.281-2.971-7.202C17.368 1.282 14.808.225 12.01.225c-5.626 0-10.201 4.582-10.206 10.201-.002 1.905.497 3.766 1.445 5.378L2.24 21.78l6.104-1.601-.697-.425zm9.336-6.43c-.27-.136-1.602-.79-1.85-.882-.25-.091-.43-.136-.61.136-.18.27-.698.88-.857 1.06-.16.182-.32.203-.59.067-.27-.136-1.14-.42-2.172-1.341-.803-.715-1.347-1.602-1.505-1.872-.158-.272-.017-.419.118-.554.123-.122.272-.32.408-.48.136-.163.18-.28.272-.465.091-.186.046-.35-.023-.487-.067-.136-.61-1.47-.837-2.013-.22-.53-.44-.457-.61-.466-.156-.008-.336-.01-.516-.01-.18 0-.473.067-.72.337-.247.27-.945.926-.945 2.261 0 1.335.972 2.625 1.107 2.81.136.185 1.914 2.923 4.636 4.103.648.28 1.153.447 1.548.572.651.207 1.243.177 1.71.107.52-.078 1.602-.656 1.828-1.288.225-.633.225-1.176.157-1.288-.068-.113-.248-.18-.518-.316z"/>
            </svg>
            Confirmar asistencia por WhatsApp
          </a>
        </div>
      )}

      <div className="text-center pt-8 text-[10px] text-slate-700 uppercase tracking-[0.3em]">
        ¡No faltes a esta gran noche!
      </div>

      <footer className="mt-12 mb-4 text-center text-[10px] text-slate-500 space-y-1.5 font-sans tracking-normal">
        <p className="opacity-80">
          Invitación creada por TusInvitaciones.mx &copy; {new Date().getFullYear()}
        </p>
        <p>
          <a
            href="https://tusinvitaciones.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-[var(--primary)] underline transition-colors"
          >
            ¿Quieres una invitación como esta?
          </a>
        </p>
      </footer>
    </div>
  );
}
export default CumpleEsencial;
