"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

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

interface RSVPFormProps {
  whatsapp?: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

export function RSVPForm({ whatsapp }: RSVPFormProps) {
  const [nombre, setNombre] = useState("");
  const [pax, setPax] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  if (!whatsapp) return null;

  return (
    <motion.div
      initial={fadeInUp.initial}
      whileInView={fadeInUp.whileInView}
      viewport={fadeInUp.viewport}
      transition={fadeInUp.transition}
      className="bg-white border-2 border-[var(--primary)]/30 rounded-2xl p-6 shadow-xl space-y-4 max-w-md mx-auto w-full text-gray-800 font-sans"
    >
      <div className="text-center space-y-1">
        <h3 className="text-sm uppercase tracking-widest text-[var(--primary)] font-bold">
          Confirmación de Asistencia
        </h3>
        <p className="text-xs text-gray-500">
          Acompáñanos a celebrar este día tan especial
        </p>
      </div>

      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-6 text-center space-y-3"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="h-14 w-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner"
          >
            <Check className="h-8 w-8 stroke-[3]" />
          </motion.div>
          <h4 className="text-base font-bold text-gray-800">¡Confirmación Registrada!</h4>
          <p className="text-xs text-gray-600 font-medium px-4">
            ¡Gracias! Tu confirmación ha sido registrada 🎉
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {status === "error" && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
              El nombre debe tener al menos 3 caracteres para confirmar.
            </div>
          )}

          <div className="space-y-3">
            {/* Nombre */}
            <div className="space-y-1">
              <label htmlFor="rsvp-nombre" className="text-2xs font-bold uppercase tracking-wider text-gray-500 block text-left">
                Tu Nombre *
              </label>
              <input
                id="rsvp-nombre"
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (status === "error" && e.target.value.trim().length >= 3) {
                    setStatus("idle");
                  }
                }}
                className={`w-full h-11 px-4 rounded-xl border bg-gray-50/50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all ${
                  status === "error" && nombre.trim().length < 3
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : "border-gray-200 focus:border-[var(--primary)]"
                }`}
              />
            </div>

            {/* Número de personas */}
            <div className="space-y-1">
              <label htmlFor="rsvp-pax" className="text-2xs font-bold uppercase tracking-wider text-gray-500 block text-left">
                Número de Personas *
              </label>
              <div className="relative">
                <select
                  id="rsvp-pax"
                  value={pax}
                  onChange={(e) => setPax(Number(e.target.value))}
                  className="w-full h-11 px-4 pr-10 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all appearance-none cursor-pointer"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
                    <option key={val} value={val}>
                      {val} {val === 1 ? "persona" : "personas"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Mensaje opcional */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="rsvp-mensaje" className="text-2xs font-bold uppercase tracking-wider text-gray-500 block text-left">
                  Mensaje Opcional
                </label>
                <span className="text-2xs text-gray-400 font-medium">
                  {mensaje.length}/200
                </span>
              </div>
              <textarea
                id="rsvp-mensaje"
                placeholder="Deja un mensaje especial..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value.slice(0, 200))}
                rows={3}
                className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all resize-none"
              />
            </div>
          </div>

          {/* Botón de Confirmación */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="pt-2"
          >
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              onClick={(e) => {
                if (nombre.trim().length < 3) {
                  e.preventDefault();
                  setStatus("error");
                  return;
                }
                
                e.preventDefault();
                setStatus("loading");
                
                setTimeout(() => {
                  setStatus("success");
                  
                  try {
                    const whatsappClean = whatsapp.replace(/\D/g, "");
                    const texto = `¡Hola! Confirmo mi asistencia a tu cumpleaños.\n*Nombre:* ${nombre.trim()}\n*Personas:* ${pax}\n*Mensaje:* ${mensaje.trim() || "Sin mensaje"}`;
                    const url = `https://wa.me/${whatsappClean}?text=${encodeURIComponent(texto)}`;
                    window.open(url, "_blank");
                  } catch (err) {
                    console.warn("window.open blocked or failed:", err);
                  }
                }, 800);
              }}
              data-testid="whatsapp-confirmar"
              className="h-11 w-full bg-[var(--primary)] text-white font-bold rounded-full flex items-center justify-center gap-2 hover:opacity-90 shadow-lg shadow-[var(--primary)]/20 transition-all cursor-pointer text-sm"
            >
              {status === "loading" ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Confirmar asistencia"
              )}
            </a>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default RSVPForm;
