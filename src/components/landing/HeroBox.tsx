"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Gift, ChevronDown, Sparkles } from "lucide-react";
import { fireConfetti } from "./ConfettiBurst";
import { Button } from "@/components/ui/button";

interface HeroBoxProps {
  onOpen: () => void;
}

export default function HeroBox({ onOpen }: HeroBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Función para abrir la caja
  const handleOpen = useCallback(() => {
    if (isOpen) return;
    setIsOpen(true);
    fireConfetti();
    // Esperar a que la animación termine antes de revelar el contenido
    setTimeout(() => {
      onOpen();
    }, 800);
  }, [isOpen, onOpen]);

  // Escuchar scroll, rueda del mouse y gestos táctiles para abrir automáticamente
  useEffect(() => {
    const handleScroll = () => {
      if (!isOpen && window.scrollY > 10) {
        handleOpen();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isOpen && e.deltaY > 0) {
        handleOpen();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isOpen) return;
      const touchEndY = e.touches[0].clientY;
      const diffY = touchStartY - touchEndY;
      if (diffY > 10) { // Desplazamiento hacia arriba
        handleOpen();
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isOpen, handleOpen]);

  // Animaciones para las tapas de la caja
  const lidVariants = {
    closed: { y: 0, rotate: 0, opacity: 1 },
    open: shouldReduceMotion
      ? { opacity: 0 }
      : { y: -140, rotate: -35, scale: 0.9, opacity: 0 },
  };

  const bodyLeftVariants = {
    closed: { x: 0, rotate: 0, opacity: 1 },
    open: shouldReduceMotion
      ? { opacity: 0 }
      : { x: -150, rotate: -25, opacity: 0 },
  };

  const bodyRightVariants = {
    closed: { x: 0, rotate: 0, opacity: 1 },
    open: shouldReduceMotion
      ? { opacity: 0 }
      : { x: 150, rotate: 25, opacity: 0 },
  };

  const cardVariants = {
    closed: { y: 40, scale: 0.8, opacity: 0 },
    open: {
      y: -20,
      scale: 1.1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, delay: 0.2 },
    },
  };

  return (
    <section className={`relative flex flex-col justify-between bg-crema-seda text-carbon-suave overflow-hidden px-6 py-8 select-none transition-all duration-300 ${isOpen ? "min-h-[100dvh]" : "min-h-[105dvh] pb-16"}`}>
      {/* Header / Logo */}
      <div className="relative z-20 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8B4B8]/30 border border-[#E8B4B8]/50 px-3 py-1 text-xs font-semibold text-terracota">
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-dorado-calido" />
          <span>Tu evento empieza al abrir</span>
        </div>
      </div>

      {/* Caja y Headline */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center max-w-4xl mx-auto w-full text-center py-12 gap-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-4"
        >
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-extrabold tracking-tight leading-none text-carbon-suave">
            Tu invitación de Canva ya pasó de moda.
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-medium text-carbon-suave/80 max-w-2xl mx-auto">
            Deja de mandar PDFs feos por WhatsApp. Dale a tus invitados una experiencia memorable desde el primer segundo.
          </p>
        </motion.div>

        {/* Contenedor Visual de la Caja */}
        <div className="relative w-72 h-72 flex items-center justify-center mt-4">
          {/* Caja Físicamente Cerrada */}
          <div
            role="button"
            tabIndex={0}
            data-testid="gift-box"
            aria-label="Caja de regalo interactiva. Presiona Enter o Espacio para abrir."
            aria-expanded={isOpen}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpen();
              }
            }}
            className="relative w-56 h-56 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-calido focus-visible:ring-offset-2 rounded-2xl"
            onClick={handleOpen}
          >
            {/* TAPA DE LA CAJA (LID) */}
            <motion.div
              variants={lidVariants}
              initial="closed"
              animate={isOpen ? "open" : "closed"}
              transition={{ duration: 0.6, ease: "backOut" }}
              className="absolute top-0 z-30 w-full h-16 bg-rosa-regalo rounded-t-xl shadow-md border-b-4 border-black/10 flex items-center justify-center"
            >
              {/* Listón Dorado de la Tapa */}
              <div className="absolute left-1/2 -translate-x-1/2 w-8 h-full bg-dorado-calido border-x border-black/5" />
              {/* Lazo/Sello central */}
              <div className="absolute top-2 w-10 h-6 bg-terracota rounded-md border border-black/5 flex items-center justify-center shadow-inner">
                <div className="w-2 h-2 rounded-full bg-dorado-calido" />
              </div>
            </motion.div>

            {/* CUERPO DE LA CAJA - MITAD IZQUIERDA */}
            <motion.div
              variants={bodyLeftVariants}
              initial="closed"
              animate={isOpen ? "open" : "closed"}
              transition={{ duration: 0.6, ease: "backOut" }}
              className="absolute top-16 left-0 z-20 w-[112px] h-40 bg-rosa-regalo rounded-bl-xl border-r-2 border-black/5 shadow-lg overflow-hidden"
            >
              {/* Listón horizontal */}
              <div className="absolute top-12 w-full h-8 bg-dorado-calido border-y border-black/5" />
              {/* Listón vertical (parte izquierda) */}
              <div className="absolute right-0 w-4 h-full bg-dorado-calido border-l border-black/5" />
            </motion.div>

            {/* CUERPO DE LA CAJA - MITAD DERECHA */}
            <motion.div
              variants={bodyRightVariants}
              initial="closed"
              animate={isOpen ? "open" : "closed"}
              transition={{ duration: 0.6, ease: "backOut" }}
              className="absolute top-16 right-0 z-20 w-[112px] h-40 bg-rosa-regalo rounded-br-xl border-l-2 border-black/5 shadow-lg overflow-hidden"
            >
              {/* Listón horizontal */}
              <div className="absolute top-12 w-full h-8 bg-dorado-calido border-y border-black/5" />
              {/* Listón vertical (parte derecha) */}
              <div className="absolute left-0 w-4 h-full bg-dorado-calido border-r border-black/5" />
            </motion.div>

            {/* TARJETA INTERNA REVELADA (SE LLEVA EL FOCO CUANDO SE ABRE) */}
            <motion.div
              variants={cardVariants}
              initial="closed"
              animate={isOpen ? "open" : "closed"}
              className="absolute top-12 z-10 w-48 h-40 bg-blanco-puro rounded-xl border border-dorado-calido/30 p-4 shadow-xl flex flex-col justify-between items-center"
            >
              <div className="w-10 h-10 rounded-full bg-crema-seda flex items-center justify-center text-terracota border border-rosa-regalo">
                <Gift className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-center">
                <h3 className="font-extrabold text-xs text-carbon-suave uppercase tracking-widest">¡Sorpresa!</h3>
                <p className="text-[10px] text-carbon-suave/70 leading-tight">Tu invitación interactiva está lista.</p>
              </div>
              <span className="text-[10px] font-bold text-terracota bg-rosa-regalo/30 px-2.5 py-0.5 rounded-full">
                ¡Ábreme!
              </span>
            </motion.div>
          </div>

          {/* Sello Dorado Foil de Fondo (Detrás del regalo) */}
          <div className="absolute inset-0 z-0 bg-dorado-calido/10 rounded-full blur-2xl scale-75 pointer-events-none" />
        </div>

        {/* CTA "Ábreme" */}
        <motion.div
          animate={isOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-30"
        >
          <Button
            onClick={handleOpen}
            size="lg"
            data-testid="btn-abreme"
            aria-expanded={isOpen}
            className="bg-terracota hover:bg-terracota/95 text-white font-extrabold rounded-full px-12 py-7 text-lg shadow-xl shadow-terracota/20 transition transform hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            <Gift className="h-6 w-6" />
            Ábreme
          </Button>
        </motion.div>
      </div>

      {/* Indicador de Scroll para abrir */}
      <motion.div
        animate={
          isOpen
            ? { opacity: 0, y: 20 }
            : { opacity: [0.3, 0.8, 0.3], y: [0, 6, 0] }
        }
        transition={
          isOpen
            ? { duration: 0.2 }
            : { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative z-20 flex flex-col items-center justify-center text-xs font-semibold text-carbon-suave/60"
      >
        <span className="mb-1">Haz scroll o click para abrir</span>
        <ChevronDown className="h-5 w-5 text-dorado-calido" />
      </motion.div>
    </section>
  );
}
