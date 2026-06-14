'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import ProblemSection from '@/components/landing/ProblemSection';
import HowItWorks from '@/components/landing/HowItWorks';
import PackagesSection from '@/components/landing/PackagesSection';
import SocialProof from '@/components/landing/SocialProof';
import FinalCTA from '@/components/landing/FinalCTA';
import { ContactForm } from '@/components/public/ContactForm';

// FAQ Item Component
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#E8B4B8]/30 py-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-carbon-suave font-bold text-base py-2 focus:outline-none"
      >
        <span>{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-5 w-5 text-dorado-calido" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="text-carbon-suave/80 text-sm mt-2 pb-2 leading-relaxed font-medium">
          {answer}
        </p>
      </motion.div>
    </div>
  );
};

export default function RevealedSections() {
  return (
    <>
      {/* 2. El Problema */}
      <ProblemSection />

      {/* 3. Cómo Funciona */}
      <HowItWorks />

      {/* 4. Paquetes */}
      <PackagesSection />

      {/* 5. Ejemplos / Prueba Social */}
      <SocialProof />

      {/* 6. Preguntas Frecuentes (FAQs) */}
      <section className="py-24 bg-crema-seda border-b border-[#E8B4B8]/30">
        <div className="mx-auto max-w-3xl px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-terracota font-extrabold uppercase text-xs tracking-widest">
              Resolvemos tus dudas
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-carbon-suave">
              Preguntas frecuentes
            </h2>
            <p className="text-carbon-suave/70 text-sm font-medium">
              Todo lo que necesitas saber antes de contratar tu plan.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8B4B8]/30 p-6 md:p-8 shadow-sm">
            <FAQItem
              question="¿Cuánto tiempo tarda la entrega?"
              answer="El tiempo de entrega es de 24 horas una vez que hayas completado el formulario de datos de tu invitación."
            />
            <FAQItem
              question="¿Puedo modificar mi invitación después?"
              answer="Sí, todos nuestros planes incluyen cambios y correcciones gratuitas tras la entrega para asegurar que todo quede exactamente a tu gusto."
            />
            <FAQItem
              question="¿Cómo comparto la invitación?"
              answer="Te entregamos un enlace web único que puedes enviar por WhatsApp, mensajería, correo o redes sociales. También incluye la descarga de un código QR listo para imprimir o compartir."
            />
            <FAQItem
              question="¿Qué pasa si no tengo todas las fotos aún?"
              answer="No te preocupes. Puedes realizar tu pedido hoy para apartar tu lugar y completar el formulario de datos después cuando tengas las fotos listas."
            />
            <FAQItem
              question="¿El pago es seguro?"
              answer="Totalmente. Procesamos pagos seguros mediante transferencias bancarias directas, tarjetas de débito/crédito y pagos en efectivo a través de tiendas de conveniencia."
            />
          </div>
        </div>
      </section>

      {/* 7. Formulario de Contacto */}
      <section id="contacto" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-terracota font-extrabold uppercase text-xs tracking-widest">
              ¿Listo para comenzar?
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-carbon-suave">
              Pide tu Invitación
            </h2>
            <p className="mx-auto max-w-2xl text-carbon-suave/70 text-base font-medium">
              Completa el formulario y nos comunicaremos contigo de inmediato para iniciar la
              personalización de tu diseño.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* 8. CTA Final con el Sello */}
      <FinalCTA />
    </>
  );
}
