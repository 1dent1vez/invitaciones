'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ChevronDown } from 'lucide-react';
import Link from 'next/link';

// Import custom landing components
import HeroBox from '@/components/landing/HeroBox';
import ProblemSection from '@/components/landing/ProblemSection';
import HowItWorks from '@/components/landing/HowItWorks';
import PackagesSection from '@/components/landing/PackagesSection';
import SocialProof from '@/components/landing/SocialProof';
import FinalCTA from '@/components/landing/FinalCTA';
import { ContactForm } from '@/components/public/ContactForm';
import { Button } from '@/components/ui/button';

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

export default function LandingPage() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className="min-h-screen bg-crema-seda text-carbon-suave font-sans selection:bg-terracota selection:text-white antialiased">
      {/* Navbar - Siempre visible */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E8B4B8]/20 bg-crema-seda/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-carbon-suave text-lg tracking-tight"
          >
            <Gift className="h-5.5 w-5.5 text-terracota" />
            <span className="font-bold">¡Ábreme!</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="#como-funciona"
              className="text-xs sm:text-sm text-carbon-suave/70 hover:text-carbon-suave font-semibold transition-colors"
            >
              Cómo funciona
            </Link>
            <Link
              href="#paquetes"
              className="text-xs sm:text-sm text-carbon-suave/70 hover:text-carbon-suave font-semibold transition-colors"
            >
              Paquetes
            </Link>
            <Link
              href="#demo"
              className="text-xs sm:text-sm text-carbon-suave/70 hover:text-carbon-suave font-semibold transition-colors"
            >
              Demo
            </Link>
            <Link href="#contacto">
              <Button
                variant="outline"
                className="border-[#E8B4B8] text-terracota hover:bg-rosa-regalo/20 rounded-full text-xs h-9 font-bold"
              >
                Contacto
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero: La Caja Cerrada / Regalo */}
      <HeroBox onOpen={() => setIsOpened(true)} />

      {/* Secciones Reveladas después de abrir el regalo */}
      <AnimatePresence>
        {isOpened && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-full"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-[#E8B4B8]/20 bg-crema-seda py-12 relative z-20">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Gift className="h-5.5 w-5.5 text-terracota" />
            <span className="font-bold text-carbon-suave tracking-tight">¡Ábreme!</span>
          </div>
          <p className="text-xs text-carbon-suave/60 font-semibold">
            &copy; {new Date().getFullYear()} ¡Ábreme! Invitaciones Digitales. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-6 text-xs text-carbon-suave/60 font-bold">
            <Link href="#" className="hover:text-terracota transition-colors">
              Aviso de Privacidad
            </Link>
            <Link href="#" className="hover:text-terracota transition-colors">
              Términos de Servicio
            </Link>
            <Link href="/admin" className="hover:text-terracota transition-colors">
              Acceso Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
