"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Sparkles, Volume2, VolumeX, Image as ImageIcon, Gift, Shirt, Milestone } from "lucide-react";
import { InvitacionData } from "@/types";
import { getOptimizedImageUrl, formatFechaMX, parseItinerario } from "./shared/utils";
import { MapsLink } from "./shared/MapsLink";
import { RSVPForm } from "./shared/RSVPForm";

if (typeof window !== "undefined" && !window.IntersectionObserver) {
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: class IntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  });
}

interface CumpleCompletaProps {
  data: InvitacionData;
}

export function CumpleCompleta({ data }: CumpleCompletaProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

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

  const nombreFestejado = data.nombre || data.nombres || "Festejado";
  const edadFestejado = data.edad || "";
  const fraseMensaje = data.mensaje || "¡Celebremos juntos esta fecha especial!";
  const fotoPortada = getOptimizedImageUrl(data.fotoPortada || data.portadaUrl || "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop");
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

  // Parse and format date
  const dateObj = data.fecha ? new Date(data.fecha) : null;
  let dateText = "";
  if (dateObj && !isNaN(dateObj.getTime())) {
    dateText = formatFechaMX(dateObj);
  } else {
    dateText = data.fecha || "";
  }

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
              
              <div className="mt-2 w-full max-w-xs">
                <MapsLink direccion={direccionFiesta} mapaUrl={mapaUrl} />
              </div>
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

        {/* RSVP Form */}
        <RSVPForm whatsapp={data.whatsapp} />
      </div>

      <div className="text-center pt-12 text-[10px] text-slate-700 uppercase tracking-[0.3em]">
        ¡No faltes a esta gran noche!
      </div>
    </div>
  );
}

export default CumpleCompleta;
