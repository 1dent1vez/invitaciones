'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from 'lucide-react';
import Link from 'next/link';

import dynamic from 'next/dynamic';

// Import custom landing components
import HeroBox from '@/components/landing/HeroBox';
import { Button } from '@/components/ui/button';

const RevealedSections = dynamic(() => import('@/components/landing/RevealedSections'), { ssr: false });

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
            <RevealedSections />
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
