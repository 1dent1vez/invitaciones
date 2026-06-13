'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import { Check, Star, ArrowRight, Gift } from 'lucide-react';
import { PRECIOS_PAQUETE } from '@/lib/paquetes';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Tarjeta interactiva 3D con efecto Tilt
function PhysicalCard({
  name,
  price,
  features,
  ctaText,
  isPremium,
  color,
  badgeText,
}: {
  name: string;
  price: number;
  features: string[];
  ctaText: string;
  isPremium?: boolean;
  color: string;
  badgeText?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Coordenadas para el efecto Tilt 3D
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transformar coordenadas a ángulos de rotación (-8 a 8 grados)
  const rotateX = useTransform(y, [-150, 150], [8, -8]);
  const rotateY = useTransform(x, [-150, 150], [-8, 8]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - rect.width / 2;
    const mouseY = event.clientY - rect.top - rect.height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        borderColor: color,
        ...(shouldReduceMotion
          ? {}
          : { rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }),
      }}
      className={`flex flex-col justify-between rounded-3xl p-8 bg-white border-2 shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden select-none`}
      whileHover={shouldReduceMotion ? { y: -4 } : { y: -8, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* Efecto de Brillo (Shine) al pasar el cursor (solo Premium) */}
      {isPremium && (
        <motion.div
          initial={{ x: '-150%', y: '-150%' }}
          animate={isHovered ? { x: '150%', y: '150%' } : { x: '-150%', y: '-150%' }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/45 to-transparent pointer-events-none z-10"
        />
      )}

      {/* Sello Foil Dorado Wax Seal para el paquete Premium */}
      {isPremium && (
        <div className="absolute -top-1 -right-1 z-20 w-24 h-24 overflow-hidden pointer-events-none">
          <div className="absolute top-4 right-[-24px] rotate-45 bg-dorado-calido text-white text-[9px] font-extrabold py-1 px-8 text-center uppercase tracking-widest shadow-md border-y border-white/20">
            Foil Gold
          </div>
        </div>
      )}

      {/* Contenido de la tarjeta física */}
      <div style={shouldReduceMotion ? {} : { transform: 'translateZ(30px)' }}>
        {/* Cabecera */}
        <div className="relative mb-6">
          {badgeText && (
            <span className="inline-block text-[10px] font-extrabold uppercase bg-dorado-calido text-white px-3 py-1 rounded-full tracking-wider mb-2.5 shadow-sm">
              {badgeText}
            </span>
          )}
          <h3 className="text-xl font-extrabold text-carbon-suave flex items-center gap-2">
            {name}
            {isPremium && (
              <Star className="w-5 h-5 fill-dorado-calido text-dorado-calido animate-pulse" />
            )}
          </h3>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-4xl font-extrabold text-carbon-suave">${price}</span>
            <span className="text-xs text-carbon-suave/60 font-bold uppercase">
              MXN / Pago Único
            </span>
          </div>
        </div>

        {/* Lista de Features */}
        <ul className="space-y-4 mb-8">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <div className="p-0.5 rounded-full bg-crema-seda text-dorado-calido border border-rosa-regalo shrink-0 mt-0.5">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span className="text-carbon-suave/80 font-medium leading-tight">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Botón de Comienzo */}
      <div
        className="w-full mt-auto"
        style={shouldReduceMotion ? {} : { transform: 'translateZ(45px)' }}
      >
        <Link
          href="#contacto"
          className={cn(
            buttonVariants(),
            'w-full py-6 rounded-full font-bold text-xs uppercase tracking-widest transition-transform flex items-center justify-center gap-1.5 h-auto',
            isPremium
              ? 'bg-terracota hover:bg-terracota/95 text-white shadow-lg shadow-terracota/20'
              : name === 'Completa'
                ? 'bg-carbon-suave hover:bg-carbon-suave/90 text-white'
                : 'bg-crema-seda hover:bg-rosa-regalo/30 text-carbon-suave border border-[#E8B4B8]'
          )}
        >
          {ctaText}
          <ArrowRight className="w-4 h-4 ml-1.5 inline shrink-0" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function PackagesSection() {
  const packagesList = [
    {
      name: 'Esencial',
      price: PRECIOS_PAQUETE.esencial,
      color: '#E8B4B8',
      badgeText: 'El Básico',
      ctaText: 'Quiero Esencial',
      features: [
        'Portada personalizada (foto, nombre, edad y frase)',
        'Ubicación exacta conectada con Google Maps',
        'Formulario RSVP básico (confirmación de asistencia)',
        'Canción favorita de música de fondo (reproductor)',
        'Diseño 100% móvil y responsive',
      ],
    },
    {
      name: 'Completa',
      price: PRECIOS_PAQUETE.completa,
      color: '#D4A373',
      badgeText: 'El Más Popular',
      ctaText: 'Elegir Completa',
      features: [
        'Todo lo del paquete Esencial',
        'Galería de fotos interactiva (hasta 6 fotos)',
        'Sección detallada de Código de vestimenta',
        'Itinerario completo del evento con iconos',
        'Datos de mesa de regalos o transferencias',
        'Mensaje especial del cumpleañero',
      ],
    },
    {
      name: 'Premium',
      price: PRECIOS_PAQUETE.premium,
      color: '#C85C5C',
      isPremium: true,
      badgeText: 'Experiencia Completa',
      ctaText: 'Obtener Premium',
      features: [
        'Todo lo del paquete Completa',
        'Historia personal (3 momentos con fotos)',
        'Galería de fotos ampliada (hasta 12 fotos)',
        'Buzón de deseos digital para invitados',
        'Álbum QR interactivo para subir fotos post-evento',
        'Asignación de pases individuales por invitado',
        'Video de agradecimiento integrado',
        'Temática visual y colores personalizados',
      ],
    },
  ];

  return (
    <section id="paquetes" className="py-24 bg-white relative overflow-hidden">
      {/* Fondo decorativo sutil */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-rosa-regalo/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-dorado-calido/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-terracota font-extrabold uppercase text-xs tracking-widest flex items-center justify-center gap-1.5">
            <Gift className="w-4 h-4" /> Precios Transparentes
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-carbon-suave tracking-tight">
            Elige el plan ideal para tu fiesta
          </h2>
          <p className="text-base sm:text-lg text-carbon-suave/70 font-medium">
            Pago único por evento. Sin plazos forzosos, sin letras chiquitas.
          </p>
        </div>

        {/* Tarjetas */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {packagesList.map((pkg, idx) => (
            <PhysicalCard
              key={idx}
              name={pkg.name}
              price={pkg.price}
              features={pkg.features}
              ctaText={pkg.ctaText}
              color={pkg.color}
              isPremium={pkg.isPremium}
              badgeText={pkg.badgeText}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
