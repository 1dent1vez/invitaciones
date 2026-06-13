'use client';

import { motion } from 'framer-motion';
import {
  XCircle,
  CheckCircle2,
  MessageSquare,
  Music,
  MapPin,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export default function ProblemSection() {
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
  };

  return (
    <section className="py-24 bg-crema-seda border-b border-[#E8B4B8]/30 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header de la sección */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-carbon-suave tracking-tight">
            Nadie quiere otro PDF de 20 Megas por WhatsApp
          </h2>
          <p className="text-base sm:text-lg text-carbon-suave/80 font-medium">
            Seamos honestos. La forma tradicional de invitar a tus seres queridos se siente vieja,
            aburrida y es un caos de organizar.
          </p>
        </motion.div>

        {/* Grid comparativo */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 gap-8 items-stretch"
        >
          {/* TARJETA ANTES */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-between bg-white rounded-3xl border border-gray-200 p-8 shadow-sm relative overflow-hidden"
          >
            {/* Indicador de "Antes" */}
            <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-xs font-bold uppercase px-4 py-2 rounded-bl-2xl flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              La Invitación Típica
            </div>

            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <span className="text-gray-400 font-extrabold uppercase text-[10px] tracking-widest">
                  El Pasado
                </span>
                <h3 className="text-2xl font-extrabold text-gray-700">
                  El PDF estático o captura de Canva
                </h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5.5 h-5.5 text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-500">
                    <strong>Pesa demasiado:</strong> Llena la memoria del teléfono de tus invitados.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5.5 h-5.5 text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-500">
                    <strong>Ubicación ciega:</strong> Tienen que copiar la dirección a mano en
                    Google Maps.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5.5 h-5.5 text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-500">
                    <strong>RSVP infernal:</strong> Te toca perseguir a cada persona por chat para
                    saber si va a ir.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5.5 h-5.5 text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-500">
                    <strong>Estática y fría:</strong> No hay música, no hay animaciones, no
                    transmite emoción.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 text-center uppercase tracking-wide">
                Resultado: Invitaciones que nadie abre o se pierden en el chat.
              </p>
            </div>
          </motion.div>

          {/* TARJETA DESPUÉS */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-between bg-white rounded-3xl border-2 border-[#E8B4B8] p-8 shadow-xl relative overflow-hidden"
          >
            {/* Brillo foil de fondo */}
            <div className="absolute top-0 right-0 bg-[#E8B4B8]/30 text-terracota text-xs font-extrabold uppercase px-4 py-2 rounded-bl-2xl flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-dorado-calido animate-spin-slow" />
              Experiencia ¡Ábreme!
            </div>

            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <span className="text-dorado-calido font-extrabold uppercase text-[10px] tracking-widest">
                  El Futuro
                </span>
                <h3 className="text-2xl font-extrabold text-carbon-suave">
                  La Caja de Regalo Interactiva
                </h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5.5 h-5.5 text-terracota shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-carbon-suave/80">
                    <strong>Un link rápido:</strong> Carga al instante en cualquier teléfono, sin
                    descargar nada.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5.5 h-5.5 text-terracota shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-carbon-suave/80">
                    <MapPin className="inline w-4 h-4 mr-1 text-dorado-calido" />
                    <strong>Ubicación a un click:</strong> Botón directo a Waze y Google Maps.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5.5 h-5.5 text-terracota shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-carbon-suave/80">
                    <MessageSquare className="inline w-4 h-4 mr-1 text-dorado-calido" />
                    <strong>Confirmación RSVP automatizada:</strong> Registro en segundos que
                    controlas desde tu panel.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5.5 h-5.5 text-terracota shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-carbon-suave/80">
                    <Music className="inline w-4 h-4 mr-1 text-dorado-calido" />
                    <strong>Música y animación:</strong> Confeti interactivo y tus canciones
                    favoritas de fondo.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E8B4B8]/30">
              <p className="text-xs font-bold text-terracota text-center uppercase tracking-wide">
                Resultado: Tus invitados se emocionan incluso antes del evento.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
