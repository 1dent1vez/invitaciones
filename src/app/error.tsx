"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-rose-600/5 blur-[80px] pointer-events-none" />

      <div className="relative z-10 text-center space-y-6 max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-rose-500 shadow-xl shadow-rose-500/5">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Ha ocurrido un problema
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed px-4">
            Ocurrió un error inesperado al procesar la solicitud. Si el problema persiste, ponte en contacto con soporte.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold flex items-center justify-center gap-2 px-5 py-5 rounded-xl text-xs"
          >
            <RotateCcw className="h-4 w-4" />
            Intentar de nuevo
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              className="border-slate-850 hover:bg-slate-900 text-slate-300 hover:text-white flex items-center justify-center gap-2 px-5 py-5 rounded-xl text-xs"
            >
              <Home className="h-4 w-4" />
              Ir al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
