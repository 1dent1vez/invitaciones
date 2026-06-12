"use client";

import { motion } from "framer-motion";
import { 
  Gift, 
  Palette, 
  Share2, 
  Check, 
  ChevronDown, 
  Star, 
  Sparkles, 
  ArrowRight 
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { ContactForm } from "@/components/public/ContactForm";
import { CumpleEsencial } from "@/components/templates/cumpleanos/CumpleEsencial";

// Packages configuration according to pricing plans
const packages = [
  {
    name: "Esencial",
    price: 350,
    color: "#E8B4B8",
    ctaBg: "bg-[#3D3D3D] hover:bg-[#3D3D3D]/90 text-white",
    features: [
      "Portada personalizada (nombre, edad, fecha, frase)",
      "Ubicación del evento",
      "Confirmación RSVP básico",
      "Música de fondo"
    ]
  },
  {
    name: "Completa",
    price: 550,
    color: "#D4A373",
    ctaBg: "bg-[#C85C5C] hover:bg-[#C85C5C]/90 text-white shadow-lg shadow-[#C85C5C]/20",
    badge: "Recomendado",
    badgeBg: "bg-[#D4A373] text-white",
    features: [
      "Todo lo de Esencial",
      "Galería de fotos (hasta 6)",
      "Código de vestimenta",
      "Mensaje del festejado",
      "Itinerario de la fiesta",
      "Mesa de regalos / datos bancarios"
    ]
  },
  {
    name: "Premium",
    price: 850,
    color: "#E8B4B8",
    ctaBg: "bg-[#D4A373] hover:bg-[#D4A373]/90 text-white shadow-lg shadow-[#D4A373]/20",
    badge: "Experiencia completa",
    badgeBg: "bg-[#E8B4B8] text-[#3D3D3D]",
    features: [
      "Todo lo de Completa",
      "Historia del festejado (3 momentos)",
      "Galería extendida (hasta 12 fotos)",
      "Buzón de deseos",
      "Álbum QR post-evento",
      "Número de pases",
      "Video embebido",
      "Temática de decoración"
    ]
  }
];

// Interactive FAQ Accordion Item
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#E8B4B8]/30 py-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-[#3D3D3D] font-semibold text-base py-2 focus:outline-none"
      >
        <span>{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-[#D4A373]" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="text-[#3D3D3D]/80 text-sm mt-2 pb-2 leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </div>
  );
};

// Animated Envelope illustration
const FloatingEnvelope = () => {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      <motion.div
        animate={{
          y: [0, -12, 0],
          rotate: [0, 1, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-10 w-48 h-48"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
          {/* Back flap of open envelope */}
          <path d="M10 50 L50 25 L90 50 L90 85 L10 85 Z" fill="#E8B4B8" />
          
          {/* Card sliding out */}
          <motion.g
            animate={{
              y: [10, -8, 10]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <rect x="20" y="30" width="60" height="45" rx="3" fill="#FFFFFF" stroke="#D4A373" strokeWidth="1.5" />
            <circle cx="50" cy="42" r="5" fill="#D4A373" />
            <line x1="30" y1="54" x2="70" y2="54" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" />
            <line x1="35" y1="60" x2="65" y2="60" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="40" y1="66" x2="60" y2="66" stroke="#3D3D3D" strokeWidth="1" strokeLinecap="round" />
          </motion.g>

          {/* Front body of envelope */}
          <path d="M10 50 L50 70 L90 50 L90 85 L10 85 Z" fill="#F9F5F0" opacity="0.95" />
          <path d="M10 50 L35 68 L10 85 Z" fill="#E8B4B8" opacity="0.8" />
          <path d="M90 50 L65 68 L90 85 Z" fill="#E8B4B8" opacity="0.8" />
          <path d="M10 85 L50 70 L90 85 Z" fill="#F9F5F0" />
        </svg>
      </motion.div>

      {/* Gold and Terracota confetti */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: i % 2 === 0 ? "#D4A373" : "#C85C5C",
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -20 - Math.random() * 30, 0],
            x: [0, -10 + Math.random() * 20, 0],
            rotate: [0, 360, 0],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4
          }}
        />
      ))}
    </div>
  );
};

export default function LandingPage() {
  // Animation presets
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { staggerChildren: 0.1 }
  };

  return (
    <div className="min-h-screen bg-[#F9F5F0] text-[#3D3D3D] font-sans selection:bg-[#C85C5C] selection:text-white antialiased">
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E8B4B8]/20 bg-[#F9F5F0]/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-[#3D3D3D] text-lg tracking-tight">
            <Gift className="h-5.5 w-5.5 text-[#C85C5C]" />
            <span className="font-bold">¡Ábreme!</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="#como-funciona" className="text-xs sm:text-sm text-[#3D3D3D]/70 hover:text-[#3D3D3D] font-medium transition-colors">
              Cómo funciona
            </Link>
            <Link href="#paquetes" className="text-xs sm:text-sm text-[#3D3D3D]/70 hover:text-[#3D3D3D] font-medium transition-colors">
              Paquetes
            </Link>
            <Link href="#demo" className="text-xs sm:text-sm text-[#3D3D3D]/70 hover:text-[#3D3D3D] font-medium transition-colors">
              Demo
            </Link>
            <Link href="#contacto">
              <Button variant="outline" className="border-[#E8B4B8] text-[#C85C5C] hover:bg-[#E8B4B8]/20 rounded-full text-xs h-9">
                Contacto
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* 1.1 Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-28 md:pb-32 bg-gradient-to-b from-[#F9F5F0] to-[#E8B4B8]/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E8B4B8_1px,transparent_1px),linear-gradient(to_bottom,#E8B4B8_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        
        <div className="relative mx-auto max-w-5xl px-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8B4B8]/40 border border-[#E8B4B8]/60 px-3 py-1 text-xs font-semibold text-[#C85C5C]">
              <Sparkles className="h-3.5 w-3.5" /> Diseño Premium & Entrega en 24h
            </div>
            
            <h1 className="text-[clamp(2.2rem,7vw,4.5rem)] font-extrabold tracking-tight text-[#3D3D3D] leading-none max-w-4xl mx-auto">
              Tu invitación, una experiencia que abren con emoción
            </h1>
            
            <p className="mx-auto max-w-2xl text-[#3D3D3D]/80 text-base sm:text-lg md:text-xl leading-relaxed">
              Invitaciones digitales para cumpleaños, bodas y eventos inolvidables. Diseño premium, interactivo y con confirmación RSVP en tiempo real.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#contacto">
                <Button size="lg" className="bg-[#C85C5C] hover:bg-[#C85C5C]/90 text-white rounded-full px-8 py-6 text-base font-semibold shadow-xl shadow-[#C85C5C]/20 transition transform hover:scale-105 active:scale-95 flex items-center gap-2">
                  Crea tu invitación
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#demo" className="flex items-center justify-center">
                <span className="text-[#C85C5C] font-semibold underline text-sm hover:text-[#C85C5C]/80 transition cursor-pointer">
                  Ver ejemplos
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Floating visual envelope */}
          <div className="pt-6">
            <FloatingEnvelope />
          </div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center pt-8"
          >
            <ChevronDown className="h-6 w-6 text-[#D4A373]" />
          </motion.div>
        </div>
      </section>

      {/* 1.2 Social Proof / Confianza */}
      <section className="-mt-6 relative z-10 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-md border border-[#E8B4B8]/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-[#D4A373]">Garantía de Satisfacción</p>
            <h4 className="text-lg font-bold text-[#3D3D3D] mt-0.5">Más de 500 invitaciones creadas</h4>
          </div>
          
          <div className="grid grid-cols-3 gap-6 text-center w-full md:w-auto">
            <div>
              <p className="text-xl font-bold text-[#C85C5C]">500+</p>
              <p className="text-[10px] uppercase font-semibold text-[#3D3D3D]/50">Invitaciones</p>
            </div>
            <div>
              <p className="text-xl font-bold text-[#C85C5C]">3</p>
              <p className="text-[10px] uppercase font-semibold text-[#3D3D3D]/50">Paquetes</p>
            </div>
            <div>
              <p className="text-xl font-bold text-[#C85C5C]">24h</p>
              <p className="text-[10px] uppercase font-semibold text-[#3D3D3D]/50">Entrega</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 1.3 Cómo Funciona */}
      <section id="como-funciona" className="py-24 bg-[#F9F5F0]">
        <div className="mx-auto max-w-7xl px-6 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-[#3D3D3D] sm:text-4xl">
              Crea tu invitación en 3 simples pasos
            </h2>
            <p className="mx-auto max-w-2xl text-[#3D3D3D]/70 text-sm sm:text-base">
              Todo el proceso se realiza digitalmente. Rápido, seguro y sin complicaciones.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            className="grid gap-8 md:grid-cols-3"
          >
            {/* Step 1 */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-[#E8B4B8]/30 p-8 flex flex-col items-center text-center space-y-4 transition-all">
              <div className="p-4 bg-[#F9F5F0] text-[#D4A373] rounded-2xl border border-[#E8B4B8]/20">
                <Gift className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-[#3D3D3D] text-lg">1. Elige tu paquete</h3>
              <p className="text-sm text-[#3D3D3D]/70 leading-relaxed">
                Desde $350 MXN. Selecciona el plan que se ajuste mejor al tamaño y características de tu celebración.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-[#E8B4B8]/30 p-8 flex flex-col items-center text-center space-y-4 transition-all">
              <div className="p-4 bg-[#F9F5F0] text-[#D4A373] rounded-2xl border border-[#E8B4B8]/20">
                <Palette className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-[#3D3D3D] text-lg">2. Personaliza tu diseño</h3>
              <p className="text-sm text-[#3D3D3D]/70 leading-relaxed">
                Llena un cuestionario sumamente sencillo con los datos de tu evento. Nosotros nos encargamos de todo el diseño.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-[#E8B4B8]/30 p-8 flex flex-col items-center text-center space-y-4 transition-all">
              <div className="p-4 bg-[#F9F5F0] text-[#D4A373] rounded-2xl border border-[#E8B4B8]/20">
                <Share2 className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-[#3D3D3D] text-lg">3. Comparte y celebra</h3>
              <p className="text-sm text-[#3D3D3D]/70 leading-relaxed">
                Recibe tu invitación digital en un link exclusivo con código QR de acceso. Compártela directamente por WhatsApp.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 1.4 Paquetes (Pricing) */}
      <section id="paquetes" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-[#3D3D3D] sm:text-4xl">
              Elige el plan perfecto para tu celebración
            </h2>
            <p className="mx-auto max-w-2xl text-[#3D3D3D]/70 text-sm sm:text-base">
              Precios transparentes de pago único. Sin suscripciones ni costos extra.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            className="grid gap-8 md:grid-cols-3 items-stretch"
          >
            {packages.map((plan, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -6, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                className="flex flex-col justify-between rounded-2xl border-2 p-8 transition-all bg-white relative"
                style={{ borderColor: plan.color }}
              >
                {plan.badge && (
                  <span className={`absolute -top-3 right-6 text-2xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider ${plan.badgeBg}`}>
                    {plan.badge}
                  </span>
                )}
                
                <div>
                  <CardHeader className="p-0 pb-6 space-y-2">
                    <span className="text-lg font-bold text-[#3D3D3D]">{plan.name}</span>
                    <div className="flex items-baseline gap-1 pt-2">
                      <span className="text-4xl font-extrabold text-[#3D3D3D]">${plan.price}</span>
                      <span className="text-xs text-[#3D3D3D]/50 font-bold uppercase">MXN / invitación</span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 pb-8">
                    <ul className="space-y-3.5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm">
                          <Check className="h-4.5 w-4.5 text-[#D4A373] shrink-0 mt-0.5" />
                          <span className="text-[#3D3D3D]/80 leading-normal">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>

                <Link href="#contacto" className="w-full">
                  <Button className={`w-full py-5 rounded-full font-bold text-xs uppercase tracking-wider transition-all ${plan.ctaBg}`}>
                    Comenzar
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 1.5 Demo / Preview Interactivo */}
      <section id="demo" className="py-24 bg-[#F9F5F0]">
        <div className="mx-auto max-w-7xl px-6 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-[#3D3D3D] sm:text-4xl">
              Así se ve tu invitación
            </h2>
            <p className="mx-auto max-w-2xl text-[#3D3D3D]/70 text-sm sm:text-base">
              Diseño responsive que se adapta automáticamente. Prueba e interactúa con el demo real a continuación.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-5xl mx-auto">
            {/* Left: Text & Info */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1 bg-[#D4A373]/20 border border-[#D4A373]/30 px-3 py-1 rounded-full text-xs font-bold text-[#D4A373]">
                Vista Previa Interactiva
              </div>
              <h3 className="text-2xl font-bold text-[#3D3D3D]">Interactúa con el Celular de la Derecha</h3>
              <p className="text-[#3D3D3D]/70 text-sm sm:text-base leading-relaxed">
                Este es un ejemplo real del paquete <strong>Esencial</strong>. Tus invitados pueden hacer scroll, confirmar asistencia vía formulario, abrir la ubicación en Google Maps e interactuar de forma intuitiva.
              </p>
              
              <div className="pt-2">
                <a href="/i/santiago-cumple" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#C85C5C] hover:bg-[#C85C5C]/90 text-white font-bold rounded-full px-6 py-4.5 text-xs uppercase tracking-wider transition transform hover:scale-105 active:scale-95 shadow-md">
                    Ver ejemplo en pantalla completa
                  </Button>
                </a>
              </div>
            </div>

            {/* Right: Celular Mockup */}
            <div className="flex-1 flex justify-center">
              <div className="relative border-slate-900 bg-slate-900 border-[12px] md:border-[14px] rounded-[2.2rem] md:rounded-[2.5rem] h-[550px] md:h-[600px] w-[280px] md:w-[300px] shadow-2xl overflow-hidden flex flex-col ring-8 ring-white/10">
                <div className="h-[32px] w-[3px] bg-slate-900 absolute -start-[15px] md:-start-[17px] top-[72px] rounded-s-lg"></div>
                <div className="h-[46px] w-[3px] bg-slate-900 absolute -start-[15px] md:-start-[17px] top-[124px] rounded-s-lg"></div>
                <div className="h-[46px] w-[3px] bg-slate-900 absolute -start-[15px] md:-start-[17px] top-[178px] rounded-s-lg"></div>
                <div className="h-[64px] w-[3px] bg-slate-900 absolute -end-[15px] md:-end-[17px] top-[142px] rounded-e-lg"></div>
                <div className="rounded-[1.8rem] md:rounded-[2rem] overflow-hidden w-full h-full bg-white flex flex-col overflow-y-auto scrollbar-thin">
                  <CumpleEsencial
                    data={{
                      nombre: "Mateo Hernández",
                      edad: 30,
                      fecha: "2026-10-24",
                      hora: "19:00",
                      lugar: "Terraza El Mirador",
                      direccion: "Av. Chapultepec #456, Guadalajara, Jal.",
                      tipoCelebracion: "adultos",
                      mensaje: "¡Acompáñame a celebrar un año más de risas y buenos momentos!",
                      whatsapp: "5512345678",
                      colorPrimario: "#D4A373",
                      colorSecundario: "#3D3D3D",
                      fotoPortada: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop"
                    }}
                    fechaEvento={new Date("2026-10-24T19:00:00Z")}
                    direccion="Av. Chapultepec #456, Guadalajara, Jal."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.6 Testimonios */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-[#3D3D3D] sm:text-4xl">
              Lo que opinan nuestros clientes
            </h2>
            <p className="mx-auto max-w-2xl text-[#3D3D3D]/70 text-sm sm:text-base">
              La satisfacción de quienes ya compartieron su alegría con nosotros.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#F9F5F0] rounded-2xl p-6 md:p-8 flex flex-col justify-between border border-[#E8B4B8]/15"
            >
              <p className="italic text-[#3D3D3D] text-sm leading-relaxed">
                &ldquo;La invitación de mi cumpleaños quedó hermosa. Todos preguntaron quién la hizo. El diseño súper limpio y el soporte por WhatsApp excelente.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#D4A373] text-[#D4A373]" />)}
                <span className="text-xs font-bold text-[#3D3D3D] ml-2">María G.</span>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-[#F9F5F0] rounded-2xl p-6 md:p-8 flex flex-col justify-between border border-[#E8B4B8]/15"
            >
              <p className="italic text-[#3D3D3D] text-sm leading-relaxed">
                &ldquo;El QR para confirmar asistencia fue un golazo. Sabíamos exactamente quién venía y cuántos pases requería cada familia. Ahorré muchísimo tiempo de llamadas.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#D4A373] text-[#D4A373]" />)}
                <span className="text-xs font-bold text-[#3D3D3D] ml-2">Carlos R.</span>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-[#F9F5F0] rounded-2xl p-6 md:p-8 flex flex-col justify-between border border-[#E8B4B8]/15"
            >
              <p className="italic text-[#3D3D3D] text-sm leading-relaxed">
                &ldquo;El paquete Premium vale cada peso. El buzón de deseos y el poder incrustar nuestro video de agradecimiento post-evento hizo llorar a toda mi familia.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#D4A373] text-[#D4A373]" />)}
                <span className="text-xs font-bold text-[#3D3D3D] ml-2">Ana P.</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 1.7 FAQ Section */}
      <section className="py-24 bg-[#F9F5F0]">
        <div className="mx-auto max-w-3xl px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-[#3D3D3D]">
              Preguntas frecuentes
            </h2>
            <p className="text-[#3D3D3D]/70 text-sm">
              Todo lo que necesitas saber antes de contratar tu plan.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8B4B8]/30 p-6 md:p-8 shadow-sm">
            <FAQItem
              question="¿Cuánto tiempo tarda la entrega?"
              answer="El tiempo de entrega es de 24 a 48 horas una vez que hayas completado el formulario de datos de tu invitación."
            />
            <FAQItem
              question="¿Puedo modificar mi invitación después?"
              answer="Sí, todos nuestros planes incluyen hasta 2 rondas de revisiones y correcciones gratuitas tras la entrega para asegurar que todo quede perfecto."
            />
            <FAQItem
              question="¿Cómo comparto la invitación?"
              answer="Te entregamos un enlace web único que puedes enviar por WhatsApp, mensajería, correo o redes sociales. También incluye la descarga de un código QR listo para imprimir o compartir."
            />
            <FAQItem
              question="¿Qué pasa si no tengo todas las fotos?"
              answer="No te preocupes. Puedes realizar tu pedido hoy y completar los datos del formulario inicial. Las fotos las puedes enviar después para que comencemos el diseño."
            />
            <FAQItem
              question="¿El pago es seguro?"
              answer="Totalmente. Procesamos pagos mediante transferencias bancarias directas, tarjetas de débito/crédito y pagos en efectivo a través de tiendas OXXO."
            />
          </div>
        </div>
      </section>

      {/* 1.8 Contact Form Section */}
      <section id="contacto" className="py-24 bg-white border-t border-[#E8B4B8]/20">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-[#3D3D3D] sm:text-4xl">
              ¿Listo para crear tu Invitación?
            </h2>
            <p className="mx-auto max-w-2xl text-[#3D3D3D]/70 text-sm sm:text-base">
              Completa el formulario y nos comunicaremos contigo a la brevedad para guiarte en el proceso de creación.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Final CTA / Footer */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-r from-[#E8B4B8] to-[#D4A373] text-white text-center">
        <div className="absolute inset-0 bg-black/5 mix-blend-multiply pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-8">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            ¿Listo para crear tu invitación?
          </h2>
          <p className="text-white/95 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Empieza hoy mismo. Tu celebración merece un inicio inolvidable desde el primer mensaje.
          </p>
          <div className="pt-2">
            <Link href="#contacto">
              <Button size="lg" className="bg-white hover:bg-[#F9F5F0] text-[#C85C5C] font-bold rounded-full px-10 py-6 text-lg shadow-2xl transition transform hover:scale-105 active:scale-95">
                Crear mi invitación — desde $350
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8B4B8]/20 bg-[#F9F5F0] py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Gift className="h-5.5 w-5.5 text-[#C85C5C]" />
            <span className="font-bold text-[#3D3D3D] tracking-tight">¡Ábreme!</span>
          </div>
          <p className="text-xs text-[#3D3D3D]/60 font-semibold">
            &copy; {new Date().getFullYear()} ¡Ábreme! Invitaciones Digitales. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-xs text-[#3D3D3D]/60 font-bold">
            <Link href="#" className="hover:text-[#C85C5C] transition-colors">Aviso de Privacidad</Link>
            <Link href="#" className="hover:text-[#C85C5C] transition-colors">Términos de Servicio</Link>
            <Link href="/admin" className="hover:text-[#C85C5C] transition-colors">Acceso Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
