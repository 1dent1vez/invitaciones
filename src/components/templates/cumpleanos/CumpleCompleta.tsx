"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Sparkles, Volume2, VolumeX, Image as ImageIcon, Gift, Shirt, Milestone } from "lucide-react";
import { InvitacionData } from "@/types";

interface CumpleCompletaProps {
  data: InvitacionData;
}

export function CumpleCompleta({ data }: CumpleCompletaProps) {
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

  const parseItinerario = (text?: string) => {
    if (!text) return [];
    
    // Check if it's separate lines or separated by dash
    const lines = text.includes("\n") ? text.split("\n") : text.split(" — ");
    
    return lines.map(line => {
      const parts = line.split(/—|-|:/);
      if (parts.length >= 2) {
        const possibleHora = parts[0].trim();
        // Check if there are digits in the first part, meaning it is a time
        if (/\d+/.test(possibleHora)) {
          // Re-join remaining parts in case they have dashes
          const rest = line.substring(line.indexOf(parts[0]) + parts[0].length).replace(/^[\s—\-\:]+/, "").trim();
          return { hora: possibleHora, event: rest };
        }
      }
      return { hora: "", event: line.trim() };
    }).filter(i => i.event !== "");
  };

  const nombreFestejado = data.nombre || data.nombres || "Festejado";
  const edadFestejado = data.edad || "";
  const fraseMensaje = data.mensaje || "¡Celebremos juntos esta fecha especial!";
  const fotoPortada = data.fotoPortada || data.portadaUrl || "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop";
  const lugarFiesta = data.lugar || data.ubicacion || "Lugar del Evento";
  const direccionFiesta = data.direccion || "";
  const mapaUrl = data.mapaUrl || data.mapsLink || "";
  const horaFiesta = data.hora || "";
  
  // Gallery and completion features
  const galleryPhotos = data.fotosGaleria || data.fotos || [];
  const codeVestimenta = data.dressCode || "";
  const descVestimenta = data.dressCodeDesc || "";
  const mensajeFestejo = data.mensajeFestejo || "";
  const itinerarioEventos = parseItinerario(data.itinerario);
  const regalosBanco = data.datosRegalo || data.regalosDatos || "";
  const mesaRegalosActiva = data.mesaRegalos || false;
  const mesaRegalosDetalles = data.mesaRegalosDatos || "";

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#0B0C10] text-[#C5C6C7] pb-16 relative">
      {/* Decorative Confetti Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-12 left-10 h-3.5 w-3.5 rounded-full bg-amber-400 animate-ping" />
        <div className="absolute top-36 right-16 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        <div className="absolute top-2/3 left-16 h-3 w-3 rounded-full bg-[var(--primary)] animate-bounce" />
        <div className="absolute top-1/2 right-12 h-2.5 w-2.5 rounded-full bg-[var(--secondary)]" />
      </div>

      <div className="absolute inset-4 border border-[var(--primary)]/10 pointer-events-none rounded-2xl animate-fade-in" />

      {/* Hero Portada */}
      <div className="relative h-[400px] w-full overflow-hidden flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/40 to-transparent z-10" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
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

        <div className="w-full p-8 z-10 space-y-2 text-center flex flex-col items-center">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 mb-1">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <p className="text-2xs uppercase tracking-[0.3em] text-[var(--primary)] font-bold">¡Estás Invitado!</p>
          <h1 className="text-4xl font-extrabold text-white uppercase tracking-tight font-sans">
            Mis {edadFestejado} Años
          </h1>
          <h2 className="text-xl font-bold text-white font-mono tracking-wide">
            {nombreFestejado}
          </h2>
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
      <div className="px-6 space-y-10 mt-4 relative">
        
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

        {/* Mensaje del Festejado */}
        {mensajeFestejo && (
          <div className="bg-slate-900/40 border border-[var(--primary)]/10 rounded-2xl p-6 text-center space-y-2 shadow-inner">
            <span className="text-[10px] tracking-widest text-[var(--primary)] uppercase font-bold block">Mensaje Especial</span>
            <p className="text-xs text-slate-300 leading-relaxed font-light whitespace-pre-line">
              {mensajeFestejo}
            </p>
          </div>
        )}

        {/* Itinerario Timeline */}
        {itinerarioEventos.length > 0 && (
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold text-center block flex items-center justify-center gap-1.5">
              <Milestone className="h-4 w-4" />
              Programa del Evento
            </span>
            <div className="bg-slate-900/40 border border-[var(--primary)]/10 rounded-2xl p-5 space-y-4 shadow-xl">
              {itinerarioEventos.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start relative pb-4 last:pb-0">
                  {idx < itinerarioEventos.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-0 w-[1px] bg-[var(--primary)]/20" />
                  )}
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-950 text-[var(--primary)] shrink-0 border border-[var(--primary)]/10 z-10 shadow-inner font-mono text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div className="space-y-0.5">
                    {item.hora && <span className="text-[10px] font-mono text-[var(--primary)] font-semibold">{item.hora}</span>}
                    <h4 className="text-sm font-bold text-white">{item.event}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Galería de fotos (hasta 6) */}
        {galleryPhotos.length > 0 && (
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold text-center block flex items-center justify-center gap-1.5">
              <ImageIcon className="h-4 w-4" />
              Galería de Recuerdos
            </span>
            <div className="grid grid-cols-2 gap-3">
              {galleryPhotos.slice(0, 6).map((photo, index) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden border border-slate-900 shadow-md group relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt={`Galería ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dress code */}
        {codeVestimenta && (
          <div className="bg-slate-900/60 border border-[var(--primary)]/10 rounded-2xl p-5 space-y-3 shadow-xl backdrop-blur-md text-center flex flex-col items-center">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-950 text-[var(--primary)] border border-[var(--primary)]/15 mb-1">
              <Shirt className="h-5 w-5" />
            </div>
            <span className="text-[10px] tracking-wider text-slate-400 uppercase font-semibold">Código de Vestimenta</span>
            <p className="text-sm font-bold text-white uppercase">{codeVestimenta}</p>
            {descVestimenta && <p className="text-xs text-slate-400 max-w-xs">{descVestimenta}</p>}
          </div>
        )}

        {/* Mesa de Regalos / Datos bancarios */}
        {(regalosBanco || mesaRegalosActiva) && (
          <div className="bg-slate-900/60 border border-[var(--primary)]/10 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-[var(--primary)]">
              <Gift className="h-5 w-5" />
              <span className="text-xs uppercase tracking-widest font-bold">Mesa de Regalos</span>
            </div>
            {regalosBanco && (
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap border-b border-slate-800 pb-3 last:border-b-0 last:pb-0">
                {regalosBanco}
              </p>
            )}
            {mesaRegalosActiva && mesaRegalosDetalles && (
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-900 text-xs">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wide">Mesa Registrada</span>
                <span className="text-white font-medium">{mesaRegalosDetalles}</span>
              </div>
            )}
          </div>
        )}

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

      <div className="text-center pt-12 text-[10px] text-slate-700 uppercase tracking-[0.3em]">
        ¡No faltes a esta gran noche!
      </div>
    </div>
  );
}
export default CumpleCompleta;
