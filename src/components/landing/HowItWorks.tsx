'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Gift, FileText, Palette, Share2 } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: Step[] = [
  {
    title: '1. Elige tu plan',
    description:
      'Selecciona el paquete (Esencial, Completa o Premium) según las secciones que desees. Haz tu pago seguro en línea en menos de un minuto.',
    icon: Gift,
  },
  {
    title: '2. Envía tus datos',
    description:
      'Llena un formulario sencillo con los detalles del evento (fecha, lugar, frase especial) y sube las fotos que quieres lucir.',
    icon: FileText,
  },
  {
    title: '3. Diseñamos con magia',
    description:
      'Construimos tu invitación digital cuidando cada detalle de tipografía, colores y animaciones. Te la entregamos en menos de 24 horas.',
    icon: Palette,
  },
  {
    title: '4. Comparte por WhatsApp',
    description:
      'Te enviamos un enlace personalizado (ej: abre.me/tu-nombre) y un código QR de alta resolución. ¡Compártelo y sorprende a todos!',
    icon: Share2,
  },
];

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  // Animaciones para la línea conectora
  const lineVariants = {
    initial: { scaleY: 0 },
    animate: {
      scaleY: 1,
      transition: { duration: 1.2, ease: 'easeInOut' },
    },
  };

  // Animaciones para los bloques de pasos
  const stepVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 70, damping: 15 },
    },
  };

  return (
    <section
      id="como-funciona"
      className="py-24 bg-crema-seda border-b border-[#E8B4B8]/30 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-terracota font-extrabold uppercase text-xs tracking-widest">
            Fácil y Rápido
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-carbon-suave tracking-tight">
            ¿Cómo funciona?
          </h2>
          <p className="text-base sm:text-lg text-carbon-suave/70 font-medium">
            Sin código, sin configuraciones confusas. Nosotros hacemos todo el trabajo duro por ti.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mt-12">
          {/* Línea central conectora (Desktop) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-rosa-regalo/40 -translate-x-1/2 rounded-full hidden sm:block">
            <motion.div
              variants={lineVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              className="w-full h-full bg-dorado-calido origin-top rounded-full"
            />
          </div>

          {/* Línea lateral conectora (Mobile) */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-rosa-regalo/40 rounded-full sm:hidden">
            <motion.div
              variants={lineVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              className="w-full h-full bg-dorado-calido origin-top rounded-full"
            />
          </div>

          <div className="space-y-12 sm:space-y-16">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  className={`flex flex-col sm:flex-row items-start sm:items-center relative ${
                    isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Contenedor del icono (Punto central de la timeline) */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-10">
                    <motion.div
                      initial={shouldReduceMotion ? { scale: 1 } : { scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ type: 'spring', stiffness: 120, delay: 0.1 }}
                      className="w-12 h-12 rounded-full bg-white border-2 border-dorado-calido shadow-md flex items-center justify-center text-terracota"
                    >
                      <IconComponent className="w-5.5 h-5.5" />
                    </motion.div>
                  </div>

                  {/* Bloque de Contenido */}
                  <div className="w-full sm:w-1/2 pl-16 sm:pl-0 sm:px-8">
                    <motion.div
                      variants={stepVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, margin: '-100px' }}
                      className={`bg-white rounded-2xl border border-[#E8B4B8]/30 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow ${
                        isEven ? 'sm:text-right' : 'sm:text-left'
                      }`}
                    >
                      <h3 className="text-lg md:text-xl font-extrabold text-carbon-suave mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-carbon-suave/70 leading-relaxed font-medium">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Espaciador para desktop */}
                  <div className="hidden sm:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
