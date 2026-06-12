"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Gift, Sparkles, Send } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function FinalCTA() {
  const shouldReduceMotion = useReducedMotion();

  // Animaciones spring para el botón
  const buttonAnimVariants = {
    hover: shouldReduceMotion ? {} : { scale: 1.05, transition: { type: "spring", stiffness: 300, damping: 10 } },
    tap: shouldReduceMotion ? {} : { scale: 0.95 },
  };

  // Flotación del sello
  const sealVariants = {
    animate: shouldReduceMotion
      ? {}
      : {
          y: [0, -10, 0],
          rotate: [0, 2, 0],
          transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        },
  };

  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-white to-crema-seda text-center border-t border-[#E8B4B8]/30">
      {/* Círculo dorado difuminado de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-dorado-calido/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-10">
        {/* Sello Foil Flotante */}
        <motion.div
          variants={sealVariants}
          animate="animate"
          className="mx-auto w-24 h-24 rounded-full bg-rosa-regalo border-4 border-dorado-calido shadow-xl flex items-center justify-center relative cursor-pointer group"
        >
          <Gift className="w-10 h-10 text-terracota group-hover:scale-110 transition-transform duration-300" />
          {/* Brillo circular sutil */}
          <div className="absolute inset-1 rounded-full border border-white/20 pointer-events-none" />
        </motion.div>

        {/* Copy de Urgencia */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="text-terracota font-extrabold uppercase text-xs tracking-widest flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 fill-terracota" /> Empieza Hoy Mismo
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-carbon-suave leading-tight">
            ¿Quieres que tu fiesta empiece desde el primer mensaje?
          </h2>
          <p className="text-base sm:text-lg text-carbon-suave/80 font-medium">
            No dejes la confirmación al último momento. Dale a tus invitados una invitación digna de tu evento. Nosotros nos encargamos de todo el diseño.
          </p>
        </div>

        {/* Botón CTA con resortes */}
        <div className="pt-2">
          <Link
            href="#contacto"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-terracota hover:bg-terracota/95 text-white font-extrabold rounded-full px-12 py-7 text-lg sm:text-xl shadow-2xl shadow-terracota/30 inline-flex items-center gap-3 cursor-pointer h-auto"
            )}
          >
            <motion.span
              variants={buttonAnimVariants}
              whileHover="hover"
              whileTap="tap"
              className="flex items-center gap-3"
            >
              <Send className="w-5.5 h-5.5 animate-bounce-horizontal" />
              Crea tu invitación ahora
            </motion.span>
          </Link>
        </div>

        <p className="text-xs text-carbon-suave/60 font-semibold uppercase tracking-wider">
          Listo en menos de 24 horas • Diseñado por profesionales
        </p>
      </div>
    </section>
  );
}
