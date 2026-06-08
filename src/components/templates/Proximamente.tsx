"use client";

import React from "react";
import { Sparkles, Clock } from "lucide-react";

export function Proximamente() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-[#0B0C10] text-[#C5C6C7] p-8 text-center min-h-[500px]">
      <div className="h-16 w-16 bg-slate-900 border border-[var(--primary)]/20 rounded-full flex items-center justify-center text-[var(--primary)] mb-6 animate-pulse shadow-lg shadow-[var(--primary)]/5">
        <Clock className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
        Próximamente
      </h2>
      <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
        Esta invitación digital está en desarrollo y estará disponible muy pronto para tu evento.
      </p>
      <div className="mt-8 flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--primary)] font-bold">
        <span>Diseñando Experiencias</span>
        <Sparkles className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}
export default Proximamente;
