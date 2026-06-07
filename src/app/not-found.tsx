"use client";

import Link from "next/link";
import { HelpCircle, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />

      <div className="relative z-10 text-center space-y-6 max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-violet-400 shadow-xl shadow-violet-500/5 animate-pulse">
          <HelpCircle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-serif">
            Invitación No Encontrada
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed px-4">
            Lo sentimos, el enlace de invitación no es válido, no existe o ha expirado. Por favor verifica la dirección e intenta de nuevo.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 mx-auto shadow-lg shadow-violet-500/20 px-6 py-5 rounded-xl">
              <ArrowLeft className="h-4 w-4" />
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Decorative Brand Tag */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-2xs uppercase tracking-widest text-slate-600 flex items-center gap-1.5 font-semibold">
        <Sparkles className="h-3 w-3 text-violet-500" />
        <span>Invitaciones Digitales</span>
      </div>
    </div>
  );
}
