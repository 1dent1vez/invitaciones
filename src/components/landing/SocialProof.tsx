'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, Smartphone, Eye, Sparkles } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CumpleEsencial } from '@/components/templates/cumpleanos/CumpleEsencial';

// Elemento del abanico de tarjetas
interface FanCardProps {
  title: string;
  age: string;
  theme: string;
  image: string;
  index: number;
  hovered: boolean;
}

function FanCard({ title, age, theme, image, index, hovered }: FanCardProps) {
  const shouldReduceMotion = useReducedMotion();

  // Definir la rotación y el desplazamiento del abanico
  const getFanStyles = () => {
    if (shouldReduceMotion) {
      return { x: 0, rotate: 0, zIndex: 10 - index };
    }

    if (hovered) {
      if (index === 0) return { rotate: -22, x: -75, y: 15, zIndex: 10 };
      if (index === 1) return { rotate: 0, x: 0, y: -25, zIndex: 15 };
      return { rotate: 22, x: 75, y: 15, zIndex: 10 };
    }

    // Posición apilada inicial
    if (index === 0) return { rotate: -8, x: -15, y: 5, zIndex: 8 };
    if (index === 1) return { rotate: 0, x: 0, y: 0, zIndex: 10 };
    return { rotate: 8, x: 15, y: 5, zIndex: 8 };
  };

  const styles = getFanStyles();

  return (
    <motion.div
      animate={styles}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="absolute w-48 h-64 bg-white rounded-2xl border-2 border-rosa-regalo shadow-xl overflow-hidden flex flex-col justify-between p-4 origin-bottom cursor-pointer select-none"
    >
      <div className="relative w-full h-32 rounded-xl overflow-hidden bg-crema-seda">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="flex-1 flex flex-col justify-end pt-3 space-y-1">
        <span className="text-[9px] font-extrabold text-terracota uppercase tracking-widest">
          {theme}
        </span>
        <h4 className="text-sm font-extrabold text-carbon-suave truncate">{title}</h4>
        <div className="flex justify-between items-center text-[10px] text-carbon-suave/60 font-semibold pt-1">
          <span>Edad: {age} años</span>
          <span className="text-dorado-calido flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-dorado-calido" /> 5.0
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function SocialProof() {
  const [isFanHovered, setIsFanHovered] = useState(false);

  const previewCards = [
    {
      title: 'Santiago Pool Party',
      age: '8',
      theme: 'Infantil / Acuática',
      image:
        'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=400&auto=format&fit=crop',
    },
    {
      title: '30 Años de Sofía',
      age: '30',
      theme: 'Adulto / Elegante',
      image:
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=400&auto=format&fit=crop',
    },
    {
      title: 'Neón Fest Carlos',
      age: '18',
      theme: 'Temática / Neón',
      image:
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop',
    },
  ];

  return (
    <section id="demo" className="py-24 bg-white overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Columna Izquierda: Copy + Abanico de tarjetas */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1 bg-dorado-calido/20 border border-dorado-calido/30 px-3.5 py-1 rounded-full text-xs font-bold text-dorado-calido">
                <Sparkles className="w-3.5 h-3.5 fill-dorado-calido" /> Diseños que enamoran
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-carbon-suave tracking-tight">
                Elige tu estilo favorito
              </h2>
              <p className="text-base sm:text-lg text-carbon-suave/70 max-w-xl font-medium">
                Pasa el mouse sobre el abanico de tarjetas para ver cómo lucen nuestros diferentes
                estilos y temáticas. Creamos una identidad visual única para tu evento.
              </p>
            </div>

            {/* Contenedor del abanico */}
            <div
              className="relative w-full h-[320px] flex items-center justify-center pt-8"
              onMouseEnter={() => setIsFanHovered(true)}
              onMouseLeave={() => setIsFanHovered(false)}
            >
              <div className="relative w-48 h-64">
                {previewCards.map((card, idx) => (
                  <FanCard
                    key={idx}
                    index={idx}
                    title={card.title}
                    age={card.age}
                    theme={card.theme}
                    image={card.image}
                    hovered={isFanHovered}
                  />
                ))}
              </div>
            </div>

            <div className="w-full flex justify-center lg:justify-start">
              <a
                href="/i/santiago-cumple"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-terracota hover:bg-terracota/95 text-white font-extrabold rounded-full px-8 py-6 text-sm shadow-lg shadow-terracota/10 flex items-center gap-2 transition transform hover:scale-105 h-auto'
                )}
              >
                <Eye className="w-4.5 h-4.5" />
                Ver Demo Completo
              </a>
            </div>
          </div>

          {/* Columna Derecha: Celular Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="space-y-2 text-center mb-6">
              <span className="text-[10px] font-extrabold uppercase bg-rosa-regalo/30 text-terracota px-3 py-1 rounded-full tracking-wider">
                Simulador Móvil
              </span>
              <h3 className="text-lg font-extrabold text-carbon-suave flex items-center justify-center gap-1.5">
                <Smartphone className="w-5 h-5 text-dorado-calido" /> Pruébalo en vivo
              </h3>
            </div>

            <div className="relative border-slate-900 bg-slate-900 border-[12px] md:border-[14px] rounded-[2.2rem] md:rounded-[2.5rem] h-[550px] md:h-[580px] w-[270px] md:w-[290px] shadow-2xl overflow-hidden flex flex-col ring-8 ring-black/5">
              <div className="h-[32px] w-[3px] bg-slate-900 absolute -start-[15px] md:-start-[17px] top-[72px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-slate-900 absolute -start-[15px] md:-start-[17px] top-[124px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-slate-900 absolute -start-[15px] md:-start-[17px] top-[178px] rounded-s-lg"></div>
              <div className="h-[64px] w-[3px] bg-slate-900 absolute -end-[15px] md:-end-[17px] top-[142px] rounded-e-lg"></div>
              <div className="rounded-[1.8rem] md:rounded-[2rem] overflow-hidden w-full h-full bg-white flex flex-col overflow-y-auto scrollbar-thin">
                <CumpleEsencial
                  data={{
                    nombre: 'Mateo Hernández',
                    edad: 30,
                    fecha: '2026-10-24',
                    hora: '19:00',
                    lugar: 'Terraza El Mirador',
                    direccion: 'Av. Chapultepec #456, Guadalajara, Jal.',
                    tipoCelebracion: 'adultos',
                    mensaje: '¡Acompáñame a celebrar un año más de risas y buenos momentos!',
                    whatsapp: '5512345678',
                    colorPrimario: '#D4A373',
                    colorSecundario: '#3D3D3D',
                    fotoPortada:
                      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop',
                  }}
                  fechaEvento={new Date('2026-10-24T19:00:00Z')}
                  direccion="Av. Chapultepec #456, Guadalajara, Jal."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
