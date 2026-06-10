import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  Smartphone, 
  MapPin, 
  Clock, 
  Users 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/public/ContactForm";


interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  popular: boolean;
  ctaText: string;
  color: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Esencial",
    price: "$350",
    description: "Ideal para celebraciones de cumpleaños sencillas.",
    features: [
      { text: "Diseño responsivo móvil", included: true },
      { text: "Detalles de fecha y ubicación", included: true },
      { text: "Confirmación RSVP vía WhatsApp", included: true },
      { text: "Música de fondo", included: true },
      { text: "Galería de fotos", included: false },
      { text: "Itinerario del festejo", included: false },
      { text: "Mesa de regalos", included: false },
    ],
    popular: false,
    ctaText: "Comenzar Esencial",
    color: "border-slate-800 bg-slate-900/20",
  },
  {
    name: "Completa",
    price: "$550",
    description: "La más equilibrada para una gran fiesta.",
    features: [
      { text: "Diseño responsivo móvil", included: true },
      { text: "Detalles de fecha y ubicación", included: true },
      { text: "Confirmación RSVP vía WhatsApp", included: true },
      { text: "Música de fondo", included: true },
      { text: "Galería de fotos (hasta 3 fotos)", included: true },
      { text: "Dress code, Frase & Itinerario", included: true },
      { text: "Mesa y datos de regalos", included: true },
    ],
    popular: true,
    ctaText: "Comenzar Completa",
    color: "border-violet-500 bg-slate-900/60 shadow-lg shadow-violet-500/5 ring-1 ring-violet-500/20",
  },
  {
    name: "Premium",
    price: "$850",
    description: "Experiencia espectacular y de primer nivel.",
    features: [
      { text: "Diseño responsivo móvil", included: true },
      { text: "Detalles de fecha y ubicación", included: true },
      { text: "Confirmación RSVP + límite de fecha", included: true },
      { text: "Música de fondo & Animaciones", included: true },
      { text: "Galería extendida + Fotos extra", included: true },
      { text: "Buzón de deseos & Pases invitados", included: true },
      { text: "Video integrado & Temáticas premium", included: true },
    ],
    popular: false,
    ctaText: "Comenzar Premium",
    color: "border-slate-800 bg-slate-900/20",
  },
];

interface GalleryItem {
  title: string;
  type: string;
  slug: string;
  image: string;
  description: string;
}

const galleryItems: GalleryItem[] = [
  {
    title: "Cumpleaños Esencial",
    type: "Cumpleaños",
    slug: "santiago-cumple",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop",
    description: "Diseño divertido con frase y detalles de la celebración esenciales."
  },
  {
    title: "Cumpleaños Premium",
    type: "Cumpleaños",
    slug: "sofia-premium",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop",
    description: "Diseño elegante con fotos extra, pases, música y animación de confetti."
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-violet-600 selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-white text-lg tracking-tight">
            <Sparkles className="h-5 w-5 text-violet-400" />
            <span>Kilo Invitaciones</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="#ejemplos" className="text-sm text-slate-400 hover:text-white transition-colors">
              Ejemplos
            </Link>
            <Link href="#precios" className="text-sm text-slate-400 hover:text-white transition-colors">
              Precios
            </Link>
            <Link href="#contacto" className="text-sm text-slate-400 hover:text-white transition-colors">
              Contacto
            </Link>
            <Link href="/admin">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-900 text-sm">
                Panel Admin
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl px-6 text-center space-y-8">
          <Badge className="bg-violet-950/60 text-violet-400 border-violet-800 hover:bg-violet-950/60 py-1.5 px-3 rounded-full text-xs font-semibold gap-1.5 tracking-wide uppercase inline-flex ring-1 ring-violet-500/20">
            <Sparkles className="h-3.5 w-3.5" /> El Futuro de los Eventos
          </Badge>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl leading-none">
            Crea invitaciones <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">digitales únicas</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed">
            Sorprende a tus invitados con invitaciones modernas, interactivas, responsivas y con confirmación RSVP en tiempo real para tus fiestas de cumpleaños.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="#ejemplos">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 font-semibold shadow-lg shadow-violet-500/20 px-8 py-6 rounded-xl flex items-center gap-2">
                Ver ejemplos
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="#precios">
              <Button size="lg" variant="outline" className="border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-900 px-8 py-6 rounded-xl">
                Ver Planes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-20 border-t border-slate-900 bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center p-6 space-y-3 rounded-2xl border border-slate-900 bg-slate-900/10">
              <div className="p-3 bg-violet-600/10 text-violet-400 rounded-xl">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white text-lg">100% Responsivo</h3>
              <p className="text-sm text-slate-400">Diseñado especialmente para verse espectacular en pantallas de teléfonos móviles.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 space-y-3 rounded-2xl border border-slate-900 bg-slate-900/10">
              <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white text-lg">Ubicación GPS</h3>
              <p className="text-sm text-slate-400">Tus invitados podrán abrir Waze o Google Maps directamente desde tu invitación.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 space-y-3 rounded-2xl border border-slate-900 bg-slate-900/10">
              <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white text-lg">Control de Asistencia</h3>
              <p className="text-sm text-slate-400">Recibe confirmaciones RSVP en tiempo real directo en tu panel administrativo.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 space-y-3 rounded-2xl border border-slate-900 bg-slate-900/10">
              <div className="p-3 bg-pink-600/10 text-pink-400 rounded-xl">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white text-lg">Cuenta Regresiva</h3>
              <p className="text-sm text-slate-400">Un reloj visual que incrementa la emoción de tus invitados por la llegada del gran día.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="ejemplos" className="py-20 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Nuestros Diseños Inspiradores
            </h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              Contamos con plantillas diseñadas meticulosamente para cada tipo de celebración social.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((item, i) => {
              return (
                <Card key={i} className="group overflow-hidden border-slate-900 bg-slate-900/20 text-slate-100 hover:border-slate-800 flex flex-col justify-between transition-all duration-300">
                  <div>
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        loading="lazy"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-950/40" />
                    </div>
                    <CardHeader className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">{item.type}</span>
                        <span className="inline-block rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-400">Demo Activa</span>
                      </div>
                      <CardTitle className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors duration-200">{item.title}</CardTitle>
                      <CardDescription className="text-slate-400 text-sm mt-1">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                  </div>
                  <CardFooter className="p-5 pt-0">
                    <Link href={`/i/${item.slug}`} className="w-full">
                      <Button className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold rounded-lg py-2 transition-all">
                        Ver Demo
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-20 border-t border-slate-900 bg-slate-950/30">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Planes Simples y Transparentes
            </h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              Elige el plan ideal para tu evento. Sin cargos ocultos, un solo pago por evento.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 items-stretch">
            {pricingPlans.map((plan, i) => (
              <Card key={i} className={`flex flex-col justify-between text-slate-100 ${plan.color}`}>
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">{plan.name}</span>
                    {plan.popular && (
                      <Badge className="bg-violet-600 hover:bg-violet-600 text-white font-semibold rounded-full px-2.5 py-0.5 text-2xs">
                        Más Popular
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-white">{plan.price}</span>
                    <span className="text-sm text-slate-500 font-semibold">MXN</span>
                  </div>
                  <CardDescription className="text-slate-400 text-sm mt-2">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-0 flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm">
                        <Check className={`h-4.5 w-4.5 shrink-0 ${feature.included ? "text-violet-400" : "text-slate-700"}`} />
                        <span className={feature.included ? "text-slate-300" : "text-slate-600 line-through"}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button className={`w-full py-5 rounded-xl font-semibold transition-all ${
                    plan.popular 
                      ? "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-500/20" 
                      : "bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white"
                  }`}>
                    {plan.ctaText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 border-t border-slate-900 bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              ¿Listo para crear tu Invitación?
            </h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              Déjanos tus datos o cuéntanos qué necesitas para tu evento. Nos pondremos en contacto contigo a la brevedad.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-400" />
            <span className="font-bold text-white tracking-tight">Kilo Invitaciones</span>
          </div>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Kilo Invitaciones. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="#" className="hover:text-slate-300 transition-colors">Aviso de Privacidad</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Términos de Servicio</Link>
            <Link href="/admin" className="hover:text-slate-300 transition-colors">Acceso Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
