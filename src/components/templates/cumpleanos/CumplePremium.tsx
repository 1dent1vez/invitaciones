'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  Gift,
  Shirt,
  Milestone,
  BookOpen,
  MessageSquare,
  QrCode,
  UserCheck,
  Video,
} from 'lucide-react';
import { InvitacionData } from '@/types';
import { motion } from 'framer-motion';
import { getOptimizedImageUrl, formatFechaMX, parseItinerario } from './shared/utils';
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

function triggerConfetti() {
  if (typeof window === 'undefined') return () => {};

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const resizeHandler = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resizeHandler);

  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#aa77ff', '#ff77ff'];
  const particles: Array<{
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
  }> = [];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * -height - 20,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: Math.random() * 3 - 1.5,
      speedY: Math.random() * 4 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 3 - 1.5,
    });
  }

  let animationFrameId: number;
  function update() {
    ctx!.clearRect(0, 0, width, height);
    let alive = false;

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.y < height) {
        alive = true;
      }

      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate((p.rotation * Math.PI) / 180);
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx!.restore();
    });

    if (alive) {
      animationFrameId = requestAnimationFrame(update);
    } else {
      if (canvas.parentNode) {
        document.body.removeChild(canvas);
      }
      window.removeEventListener('resize', resizeHandler);
    }
  }

  update();

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resizeHandler);
    if (canvas.parentNode) {
      document.body.removeChild(canvas);
    }
  };
}

function CountdownTimer({ fecha }: { fecha: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const target = new Date(fecha).getTime();
    if (isNaN(target)) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(null);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [fecha]);

  if (!timeLeft) return null;

  const units = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Seg', value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 text-center max-w-xs mx-auto">
      {units.map((unit) => (
        <motion.div
          key={unit.label}
          layout
          className="bg-slate-900/60 border border-[var(--primary)]/15 rounded-xl p-2 backdrop-blur-md"
        >
          <div className="text-lg font-bold text-white font-mono tracking-tight">
            {String(unit.value).padStart(2, '0')}
          </div>
          <div className="text-[9px] uppercase tracking-wider text-[var(--primary)] mt-0.5 font-semibold">
            {unit.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

interface CumplePremiumProps {
  data: InvitacionData;
}

export function CumplePremium({ data }: CumplePremiumProps) {
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
      audio.play().catch((err) => console.log('Audio play failed:', err));
    }
    setIsPlaying(!isPlaying);
  };

  // Trigger Confetti effect on mount if enabled
  useEffect(() => {
    if (data.confettiAnimacion !== false) {
      const cleanup = triggerConfetti();
      return cleanup;
    }
  }, [data.confettiAnimacion, data.fecha]); // include date to re-trigger if dates change

  const nombreFestejado = data.nombre || data.nombres || 'Festejado';
  const edadFestejado = data.edad || '';
  const fraseMensaje = data.mensaje || '¡Celebremos juntos esta fecha especial!';
  const fotoPortada = getOptimizedImageUrl(
    data.fotoPortada ||
      data.portadaUrl ||
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop'
  );
  const lugarFiesta = data.lugar || data.ubicacion || 'Lugar del Evento';
  const direccionFiesta = data.direccion || '';
  const mapaUrl = data.mapaUrl || data.mapsLink || '';
  const horaFiesta = data.hora || '';

  // Gallery and completion features
  const galleryPhotos = data.fotosGaleria || data.fotos || [];
  const extraPhotos = data.fotosExtra || [];
  const allPhotos = [...galleryPhotos, ...extraPhotos].slice(0, 12);

  const codeVestimenta = data.dressCode || '';
  const descVestimenta = data.dressCodeDesc || '';
  const mensajeFestejo = data.mensajeFestejo || '';
  const itinerarioEventos = parseItinerario(data.itinerario);
  const regalosBanco = data.datosRegalo || data.regalosDatos || '';
  const mesaRegalosActiva = data.mesaRegalos || false;
  const mesaRegalosDetalles = data.mesaRegalosDatos || '';

  // Premium specific features
  const histEdad = data.historiaEdad || '';
  const histSeres = data.historiaSeresQueridos || '';
  const histRecuerdo = data.historiaRecuerdo || '';
  const tieneHistoria = histEdad || histSeres || histRecuerdo;

  const activarBuzon = data.buzonDeseos || false;
  const tienePases = data.pases || false;
  const numPasesDefault = data.numPases || 2;
  const tematicaDeco = data.tematica || '';
  const videoURL = data.videoURL || '';
  const colorAcento = data.colorAcento || 'Dorado';

  // Parse date
  const dateObj = data.fecha ? new Date(data.fecha) : null;
  let dateText = '';
  if (dateObj && !isNaN(dateObj.getTime())) {
    dateText = formatFechaMX(dateObj);
  } else {
    dateText = data.fecha || '';
  }

  // Parse RSVP deadline date
  let limitDateText = '';
  try {
    if (data.fechaLimiteRSVP) {
      const d = new Date(data.fechaLimiteRSVP);
      if (!isNaN(d.getTime())) {
        limitDateText = formatFechaMX(d);
      }
    }
  } catch {
    // fallback
  }

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#0B0C10] text-[#C5C6C7] pb-16 relative">
      {/* CSS Confetti / Falling particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 z-0">
        <div className="absolute top-12 left-10 h-3 w-3 rounded-full bg-yellow-400 animate-ping" />
        <div className="absolute top-24 left-1/4 h-2 w-4 bg-violet-500 rotate-45 animate-bounce" />
        <div className="absolute top-48 right-16 h-3 w-1.5 bg-pink-500 -rotate-12 animate-pulse" />
        <div className="absolute top-96 left-12 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        <div className="absolute top-[500px] right-24 h-2 w-5 bg-amber-500 rotate-12" />
        <div className="absolute bottom-64 left-20 h-3 w-3 bg-red-400 rounded-full animate-bounce" />
        <div className="absolute bottom-24 right-10 h-2 w-2 bg-indigo-500 animate-pulse" />
      </div>

      {/* Styled Double Border */}
      <div className="absolute inset-4 border border-[var(--primary)]/10 pointer-events-none rounded-2xl z-10" />
      <div className="absolute inset-5 border border-[var(--primary)]/5 pointer-events-none rounded-2xl z-10" />

      {/* Hero Portada */}
      <div className="relative h-[440px] w-full overflow-hidden flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/40 to-transparent z-10" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fotoPortada}
          alt="Cumpleañero"
          className="absolute inset-0 w-full h-full object-cover select-none"
        />

        {/* Confetti float button */}
        {data.confettiAnimacion !== false && (
          <button
            onClick={() => triggerConfetti()}
            className="absolute top-6 left-6 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-slate-950/70 border border-white/10 text-xl backdrop-blur-sm shadow-xl active:scale-95 transition-all hover:bg-slate-900"
            title="Lanzar Confetti"
          >
            🎉
          </button>
        )}

        {/* Play/Pause float button for background music */}
        {data.musicaUrl && (
          <button
            onClick={toggleMusic}
            className="absolute top-6 right-6 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-slate-950/70 border border-white/10 text-[var(--primary)] backdrop-blur-sm shadow-xl active:scale-95 transition-all"
          >
            {isPlaying ? (
              <Volume2 className="h-5 w-5 animate-pulse" />
            ) : (
              <VolumeX className="h-5 w-5 text-slate-400" />
            )}
          </button>
        )}

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
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-10 mt-4 relative z-10">
        {/* Frase Festejo */}
        <div className="text-center py-2">
          <p className="text-sm italic font-light text-slate-400 max-w-xs mx-auto leading-relaxed">
            &ldquo;{fraseMensaje}&rdquo;
          </p>
        </div>

        {/* Countdown Timer */}
        {data.cuentaRegresiva !== false && data.fecha && (
          <div className="py-2 animate-fade-in">
            <CountdownTimer fecha={data.fecha} />
          </div>
        )}

        {/* Date and Location Card */}
        <div className="bg-slate-900/60 border border-[var(--primary)]/10 rounded-2xl p-5 space-y-5 shadow-xl backdrop-blur-md">
          <div className="flex gap-4 items-start">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-950 text-[var(--primary)] shrink-0 border border-[var(--primary)]/15">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-400 uppercase font-semibold">
                ¿Cuándo?
              </span>
              <p className="text-sm font-semibold text-white capitalize">{dateText}</p>
              {horaFiesta && (
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> A las {horaFiesta} hrs
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-950 text-[var(--primary)] shrink-0 border border-[var(--primary)]/15">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-slate-400 uppercase font-semibold">
                ¿Dónde?
              </span>
              <p className="text-sm font-semibold text-white">{lugarFiesta}</p>
              {direccionFiesta && <p className="text-xs text-slate-400">{direccionFiesta}</p>}

              <div className="mt-2 w-full max-w-xs">
                <MapsLink direccion={direccionFiesta} mapaUrl={mapaUrl} />
              </div>
            </div>
          </div>

          {limitDateText && (
            <div className="flex gap-4 items-start border-t border-[var(--primary)]/10 pt-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-950 text-amber-500 shrink-0 border border-amber-500/15 animate-pulse">
                <Clock className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] tracking-wider text-slate-400 uppercase font-semibold">
                  Límite para Confirmar
                </span>
                <p className="text-sm font-semibold text-white">Antes del {limitDateText}</p>
                <p className="text-[10px] text-slate-400">Agradecemos tu pronta confirmación.</p>
              </div>
            </div>
          )}
        </div>

        {/* Pases Personalizados */}
        {tienePases && (
          <div className="bg-gradient-to-r from-slate-900/80 to-slate-950/80 border border-[var(--primary)]/20 rounded-2xl p-5 shadow-xl backdrop-blur-md text-center flex flex-col items-center gap-1">
            <div className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-950 text-[var(--primary)] border border-[var(--primary)]/25 mb-1 animate-pulse">
              <UserCheck className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] tracking-widest text-[var(--primary)] uppercase font-bold">
              Tu Pase Personalizado
            </span>
            <p className="text-xs text-slate-400">Esta invitación es válida para:</p>
            <p className="text-xl font-black text-white font-mono tracking-wider bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-900 mt-2">
              {numPasesDefault} PASES
            </p>
          </div>
        )}

        {/* Mensaje del Festejado */}
        {mensajeFestejo && (
          <div className="bg-slate-900/40 border border-[var(--primary)]/10 rounded-2xl p-6 text-center space-y-2 shadow-inner">
            <span className="text-[10px] tracking-widest text-[var(--primary)] uppercase font-bold block">
              Mensaje Especial
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-light whitespace-pre-line">
              {mensajeFestejo}
            </p>
          </div>
        )}

        {/* Video Embebido */}
        {videoURL && (
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold text-center block flex items-center justify-center gap-1.5">
              <Video className="h-4 w-4" />
              Save The Date Video
            </span>
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-900 shadow-xl bg-black">
              <iframe
                src={videoURL}
                title="Save the date"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Historia de Vida (3 momentos) */}
        {tieneHistoria && (
          <div className="space-y-5">
            <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold text-center block flex items-center justify-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              Mi Trayectoria
            </span>
            <div className="space-y-4">
              {histEdad && (
                <div className="bg-slate-900/40 border-l-2 border-[var(--primary)] p-4 rounded-r-xl space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase">
                    El Significado de esta Edad
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{histEdad}</p>
                </div>
              )}
              {histSeres && (
                <div className="bg-slate-900/40 border-l-2 border-[var(--secondary)] p-4 rounded-r-xl space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase">A mis Seres Queridos</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{histSeres}</p>
                </div>
              )}
              {histRecuerdo && (
                <div className="bg-slate-900/40 border-l-2 border-amber-500/80 p-4 rounded-r-xl space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase">Un Recuerdo Especial</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    {histRecuerdo}
                  </p>
                </div>
              )}
            </div>
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
                    {item.hora && (
                      <span className="text-[10px] font-mono text-[var(--primary)] font-semibold">
                        {item.hora}
                      </span>
                    )}
                    <h4 className="text-sm font-bold text-white">{item.event}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Galería de fotos (hasta 12) */}
        {allPhotos.length > 0 && (
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold text-center block flex items-center justify-center gap-1.5">
              <ImageIcon className="h-4 w-4" />
              Galería de Recuerdos ({allPhotos.length})
            </span>
            <div className="grid grid-cols-3 gap-2">
              {allPhotos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-xl overflow-hidden border border-slate-900 shadow-md group relative"
                >
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
            <span className="text-[10px] tracking-wider text-slate-400 uppercase font-semibold">
              Código de Vestimenta
            </span>
            <p className="text-sm font-bold text-white uppercase">{codeVestimenta}</p>
            {descVestimenta && <p className="text-xs text-slate-400 max-w-xs">{descVestimenta}</p>}
            {colorAcento && (
              <span className="inline-block mt-2 rounded bg-amber-500/10 px-2 py-0.5 text-4xs font-semibold text-amber-400 border border-amber-500/20 uppercase tracking-widest">
                Acento recomendado: {colorAcento}
              </span>
            )}
          </div>
        )}

        {/* Álbum de Fotos Compartido QR */}
        <div className="bg-slate-900/60 border border-[var(--primary)]/10 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-md text-center flex flex-col items-center">
          <div className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-950 text-[var(--primary)] border border-slate-900">
            <QrCode className="h-4.5 w-4.5" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] tracking-widest text-[var(--primary)] uppercase font-bold">
              Comparte tus fotos
            </span>
            <p className="text-xs text-slate-400 max-w-xs">
              Durante el evento, escanea el código QR en las mesas para subir tus recuerdos a
              nuestro álbum colectivo.
            </p>
          </div>
          <div className="h-32 w-32 bg-white p-2.5 rounded-xl border border-slate-900 shadow-md flex items-center justify-center relative group select-none">
            {/* Simple simulated QR pattern */}
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 opacity-10 absolute inset-0 pointer-events-none rounded-lg" />
            <span className="text-[8px] font-mono font-bold text-slate-900">ÁLBUM QR DEMO</span>
          </div>
        </div>

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
                <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wide">
                  Mesa Registrada
                </span>
                <span className="text-white font-medium">{mesaRegalosDetalles}</span>
              </div>
            )}
          </div>
        )}

        {/* Buzón de Deseos (Placeholder visual) */}
        {activarBuzon && (
          <div className="bg-slate-900/60 border border-[var(--primary)]/15 rounded-2xl p-5 space-y-3 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-[var(--primary)]">
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs uppercase tracking-widest font-bold">Buzón de Deseos</span>
            </div>
            <p className="text-xs text-slate-400">
              Deja un mensaje especial de felicitación en la caja de comentarios al confirmar tu
              asistencia.
            </p>
          </div>
        )}

        {/* RSVP Form */}
        <RSVPForm whatsapp={data.whatsapp} />
      </div>

      {/* Mensaje de Agradecimiento */}
      {data.mensajeAgradecimiento && (
        <div className="text-center px-6 pt-8 pb-2 relative z-10">
          <p className="text-xs text-[var(--primary)] font-medium italic max-w-xs mx-auto leading-relaxed">
            {data.mensajeAgradecimiento}
          </p>
        </div>
      )}

      <div className="text-center pt-12 text-[10px] text-slate-700 uppercase tracking-[0.3em] relative z-10">
        ¡Una celebración inolvidable!
      </div>
    </div>
  );
}

export default CumplePremium;
