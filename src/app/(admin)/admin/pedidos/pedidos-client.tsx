"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Calendar, 
  DollarSign, 
  Eye
} from "lucide-react";
import { Pedido, Cliente } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePedidoEstadoAction } from "./actions";

type PedidoWithCliente = Pedido & { cliente: Cliente };

const TIPO_EVENTO_MAP: Record<string, string> = {
  cumpleanos: "Cumpleaños",
  boda: "Boda",
  xv: "XV Años",
  babyshower: "Baby Shower",
};

interface PedidosClientProps {
  initialPedidos: PedidoWithCliente[];
}

const ESTADOS = [
  { key: "cotizado", label: "Cotizado", color: "border-slate-800 bg-slate-900/10 text-slate-400" },
  { key: "pagado", label: "Pagado", color: "border-blue-500/30 bg-blue-500/5 text-blue-400 ring-1 ring-blue-500/10" },
  { key: "en_produccion", label: "En Producción", color: "border-violet-500/30 bg-violet-500/5 text-violet-400 ring-1 ring-violet-500/10" },
  { key: "entregado", label: "Entregado", color: "border-amber-500/30 bg-amber-500/5 text-amber-400 ring-1 ring-amber-500/10" },
  { key: "completado", label: "Completado", color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400 ring-1 ring-emerald-500/10" }
];

export function PedidosClient({ initialPedidos }: PedidosClientProps) {
  const router = useRouter();
  const [pedidos, setPedidos] = useState(initialPedidos);
  const [search, setSearch] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("todos");
  const [isPending, startTransition] = useTransition();

  const handleMoveState = (pedidoId: string, currentState: string, direction: "prev" | "next") => {
    const currentIndex = ESTADOS.findIndex(e => e.key === currentState);
    let nextIndex = currentIndex;

    if (direction === "prev" && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    } else if (direction === "next" && currentIndex < ESTADOS.length - 1) {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex === currentIndex) return;

    const nextState = ESTADOS[nextIndex].key;

    // Optimistic UI update
    setPedidos(prev =>
      prev.map(p => (p.id === pedidoId ? { ...p, estado: nextState } : p))
    );

    startTransition(async () => {
      const res = await updatePedidoEstadoAction(pedidoId, nextState);
      if (!res.success) {
        // Rollback on failure
        setPedidos(prev =>
          prev.map(p => (p.id === pedidoId ? { ...p, estado: currentState } : p))
        );
        alert(res.error || "No se pudo actualizar el estado del pedido");
      }
    });
  };

  const filteredPedidos = pedidos.filter(p => {
    let datos: Record<string, unknown> = {};
    if (p.datosInvitacion) {
      try {
        datos = typeof p.datosInvitacion === "string"
          ? JSON.parse(p.datosInvitacion)
          : (p.datosInvitacion as Record<string, unknown>);
      } catch {
        datos = {};
      }
    }
    const nombreFestejado = (datos.nombre as string) || (datos.nombres as string) || "";
    const matchesSearch = p.cliente.nombre.toLowerCase().includes(search.toLowerCase()) || 
                          (p.slug || "").toLowerCase().includes(search.toLowerCase()) ||
                          nombreFestejado.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = eventTypeFilter === "todos" || p.tipoEvento === eventTypeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-violet-400" />
            Flujo de Pedidos (Kanban)
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Visualiza y arrastra/mueve tus pedidos entre diferentes estados de producción.
          </p>
        </div>
        <Link href="/admin/pedidos/nuevo">
          <Button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-2">
            Nuevo Pedido
          </Button>
        </Link>
      </div>

      {/* Filters and search bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center w-full md:max-w-md relative">
          <Search className="absolute left-3 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar por cliente o slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-slate-900 bg-slate-900/40 text-slate-100 placeholder:text-slate-500"
          />
        </div>

        {/* Tab filters styled with Tailwind */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-slate-900/40 border border-slate-900 self-stretch sm:self-auto overflow-x-auto">
          {[
            { key: "todos", label: "Todos" },
            { key: "boda", label: "Bodas" },
            { key: "xv", label: "XV Años" },
            { key: "babyshower", label: "Baby Shower" },
            { key: "cumpleanos", label: "Cumpleaños" }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setEventTypeFilter(tab.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0",
                eventTypeFilter === tab.key 
                  ? "bg-violet-600 text-white" 
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5 items-start">
        {ESTADOS.map(col => {
          const colPedidos = filteredPedidos.filter(p => p.estado === col.key);

          return (
            <div key={col.key} className="flex flex-col gap-4 rounded-xl border border-slate-900/60 bg-slate-900/5 p-4 min-h-[500px]">
              {/* Column Title Header */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-sm font-bold text-white">{col.label}</span>
                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs text-slate-500 font-semibold ring-1 ring-slate-800">
                  {colPedidos.length}
                </span>
              </div>

              {/* Column cards container */}
              <div className="flex flex-col gap-3">
                {colPedidos.length === 0 ? (
                  <div className="border border-dashed border-slate-900 rounded-lg p-6 text-center text-slate-600 text-xs italic">
                    Sin pedidos
                  </div>
                ) : (
                  colPedidos.map((pedido) => (
                    <div
                      key={pedido.id}
                      onClick={() => router.push(`/admin/pedidos/${pedido.id}`)}
                      className={cn(
                        "group relative rounded-xl border p-4 bg-slate-950/40 hover:border-slate-800 hover:bg-slate-950 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer",
                        isPending && "opacity-60"
                      )}
                    >
                      <div className="space-y-3">
                        {/* Event type badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-4xs font-bold uppercase tracking-wider text-violet-400">
                            {TIPO_EVENTO_MAP[pedido.tipoEvento] || pedido.tipoEvento}
                          </span>
                          <span className="text-4xs text-slate-500 font-medium">
                            {pedido.template}
                          </span>
                        </div>

                        {/* Customer name */}
                        <h4 className="font-bold text-white text-sm line-clamp-1">{pedido.cliente.nombre}</h4>

                        {/* Details */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-3xs text-slate-400">
                            <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                            <span>
                              {new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "2-digit" }).format(new Date(pedido.fechaEvento))}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-3xs text-slate-400">
                            <DollarSign className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                            <span className="font-semibold text-white">
                              {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(Number(pedido.precio))}
                            </span>
                          </div>
                        </div>

                        {/* Actions buttons footer inside the card */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-900/60 mt-1">
                          {/* Left Move Arrow */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveState(pedido.id, col.key, "prev");
                            }}
                            className="h-7 w-7 text-slate-500 hover:text-white disabled:opacity-30 hover:bg-slate-900"
                            disabled={col.key === "cotizado" || isPending}
                            title="Mover al estado anterior"
                          >
                            <ArrowLeft className="h-3.5 w-3.5" />
                          </Button>

                          {/* Detail View Button */}
                          <Link href={`/admin/pedidos/${pedido.id}`} className="inline-flex" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="outline"
                              className="h-7 px-3 text-4xs font-bold border-violet-500/30 text-violet-400 hover:text-white hover:bg-violet-600 hover:border-violet-600 flex items-center gap-1 shadow-sm transition-all"
                              title="Ver detalle del pedido"
                            >
                              <Eye className="h-3 w-3" />
                              Ver Detalle
                            </Button>
                          </Link>

                          {/* Right Move Arrow */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveState(pedido.id, col.key, "next");
                            }}
                            className="h-7 w-7 text-slate-500 hover:text-white disabled:opacity-30 hover:bg-slate-900"
                            disabled={col.key === "completado" || isPending}
                            title="Mover al siguiente estado"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
