"use client";

import { useState, useTransition } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  ArrowLeft, 
  FileText, 
  User, 
  PlusCircle, 
  Loader2, 
  Clock, 
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Pedido, Cliente, Pago, Prisma } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { registrarPagoAction, PagoInput } from "./actions";
import { updatePedidoEstadoAction } from "../actions";

const pagoSchema = z.object({
  monto: z.preprocess((val) => Number(val), z.number().min(0.01, "El monto debe ser mayor a 0")),
  metodo: z.enum(["efectivo", "transferencia"], {
    message: "Selecciona un método válido",
  }),
  comprobante: z.string().optional().nullable(),
  notas: z.string().optional().nullable(),
});

type PedidoFull = Pedido & { cliente: Cliente; pagos: Pago[] };

interface PedidoDetalleClientProps {
  pedido: PedidoFull;
}

export function PedidoDetalleClient({ pedido: initialPedido }: PedidoDetalleClientProps) {
  const [pedido, setPedido] = useState<PedidoFull>(initialPedido);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PagoInput>({
    resolver: zodResolver(pagoSchema) as unknown as Resolver<PagoInput>,
    defaultValues: {
      monto: 0,
      metodo: "transferencia",
      comprobante: "",
      notas: "",
    },
  });

  // Calculate financials
  const price = Number(pedido.precio);
  const totalPaid = pedido.pagos.reduce((sum: number, p: Pago) => sum + Number(p.monto), 0);
  const balance = price - totalPaid;

  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextState = e.target.value;
    const previousState = pedido.estado;

    // Optimistically update state
    setPedido((prev: PedidoFull) => ({ ...prev, estado: nextState }));

    startTransition(async () => {
      const res = await updatePedidoEstadoAction(pedido.id, nextState);
      if (!res.success) {
        // Rollback
        setPedido((prev: PedidoFull) => ({ ...prev, estado: previousState }));
        alert(res.error || "No se pudo actualizar el estado");
      }
    });
  };

  const onSubmitPago = async (data: PagoInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await registrarPagoAction(pedido.id, data);
      if (res.success) {
        // Create new mock payment object to inject into state
        const newPago: Pago = {
          id: Math.random().toString(),
          pedidoId: pedido.id,
          monto: new Prisma.Decimal(data.monto),
          metodo: data.metodo,
          comprobante: data.comprobante || null,
          notas: data.notas || null,
          fecha: new Date(),
        };

        setPedido((prev: PedidoFull) => {
          const updatedPagos = [...prev.pagos, newPago];
          const newTotalPaid = totalPaid + data.monto;
          // Automatically mark as paid state if fully paid
          const nextState = newTotalPaid >= price && prev.estado === "cotizado" ? "pagado" : prev.estado;
          return {
            ...prev,
            estado: nextState,
            pagos: updatedPagos,
          };
        });

        reset({
          monto: 0,
          metodo: "transferencia",
          comprobante: "",
          notas: "",
        });
      } else {
        setError(res.error || "Error al registrar el pago");
      }
    } catch {
      setError("Error inesperado en el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with quick back links and state selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="space-y-1">
          <Link 
            href="/admin/pedidos" 
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-violet-400 transition-colors w-fit"
          >
            <ArrowLeft className="h-3 w-3" />
            Volver a Pedidos
          </Link>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Pedido: {pedido.cliente.nombre}
            </h2>
            <span className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 capitalize",
              balance === 0 
                ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" 
                : "bg-amber-500/10 text-amber-400 ring-amber-500/20"
            )}>
              {balance === 0 ? "Saldado" : "Pendiente"}
            </span>
          </div>
        </div>

        {/* Change Order State on the fly */}
        <div className="flex items-center gap-3 bg-slate-900/40 border border-slate-900 rounded-xl px-4 py-2 self-stretch sm:self-auto justify-between">
          <span className="text-xs font-semibold text-slate-400">Estado del Pedido:</span>
          <select
            value={pedido.estado}
            onChange={handleStateChange}
            disabled={isPending}
            className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer capitalize"
          >
            <option value="cotizado" className="bg-slate-900">Cotizado</option>
            <option value="pagado" className="bg-slate-900">Pagado</option>
            <option value="en_produccion" className="bg-slate-900">En Producción</option>
            <option value="entregado" className="bg-slate-900">Entregado</option>
            <option value="completado" className="bg-slate-900">Completado</option>
          </select>
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-400 shrink-0" />}
        </div>
      </div>

      {/* Main split grid layout */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Order & Client Info */}
        <div className="space-y-6 md:col-span-2">
          {/* Card: Order Details */}
          <Card className="border-slate-900 bg-slate-900/10 text-slate-100 backdrop-blur-xs">
            <CardHeader className="border-b border-slate-900">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-violet-400" />
                Detalles del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 pt-6">
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500 font-medium uppercase">Tipo de Evento</p>
                <p className="text-sm font-semibold text-white capitalize">{pedido.tipoEvento}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500 font-medium uppercase">Fecha del Evento</p>
                <p className="text-sm font-semibold text-white">
                  {new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(new Date(pedido.fechaEvento))}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500 font-medium uppercase">Plantilla Seleccionada</p>
                <p className="text-sm font-semibold text-white capitalize">{pedido.template}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500 font-medium uppercase">URL Pública de Invitación</p>
                <a 
                  href={pedido.urlPublica || "#"} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-sm font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 w-fit"
                >
                  /i/{pedido.slug}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <p className="text-xs text-slate-500 font-medium uppercase">Notas / Observaciones</p>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 border border-slate-900 rounded-lg p-3">
                  {pedido.notas || "Sin observaciones adicionales."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card: Client Info */}
          <Card className="border-slate-900 bg-slate-900/10 text-slate-100 backdrop-blur-xs">
            <CardHeader className="border-b border-slate-900">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <User className="h-4.5 w-4.5 text-violet-400" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 pt-6">
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500 font-medium uppercase">Nombre</p>
                <p className="text-sm font-semibold text-white">{pedido.cliente.nombre}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500 font-medium uppercase">Teléfono</p>
                <p className="text-sm font-semibold text-slate-300">{pedido.cliente.telefono || "No registrado"}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500 font-medium uppercase">Email</p>
                <p className="text-sm font-semibold text-slate-300">{pedido.cliente.email || "No registrado"}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500 font-medium uppercase">Origen del Cliente</p>
                <span className="inline-block rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-400 font-medium w-fit capitalize">
                  {pedido.cliente.fuente}
                </span>
              </div>
              {pedido.cliente.notas && (
                <div className="space-y-1.5 sm:col-span-2">
                  <p className="text-xs text-slate-500 font-medium uppercase">Notas del Cliente</p>
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 border border-slate-900 rounded-lg p-3">
                    {pedido.cliente.notas}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Financials, Payments & Forms */}
        <div className="space-y-6">
          {/* Card: Financial Summary Details */}
          <Card className="border-slate-900 bg-slate-900/10 text-slate-100">
            <CardHeader className="pb-3 border-b border-slate-900">
              <CardTitle className="text-base font-bold text-white">Resumen de Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Precio del Evento:</span>
                <span className="font-semibold text-white">
                  {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Pagado:</span>
                <span className="font-semibold text-emerald-400">
                  {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(totalPaid)}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-900 pt-3">
                <span className="text-sm font-semibold text-slate-300">Saldo Pendiente:</span>
                <span className={cn(
                  "text-lg font-bold",
                  balance === 0 ? "text-emerald-400" : "text-rose-500"
                )}>
                  {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(balance)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Form: Register Payment */}
          {balance > 0 && (
            <Card className="border-slate-900 bg-slate-900/10 text-slate-100">
              <CardHeader className="pb-3 border-b border-slate-900">
                <CardTitle className="text-base font-bold text-white flex items-center gap-1.5">
                  <PlusCircle className="h-4.5 w-4.5 text-violet-400" />
                  Registrar Pago
                </CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmitPago)}>
                <CardContent className="space-y-4 pt-4">
                  {/* Amount */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Monto del Pago (MXN) *</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-slate-500 text-sm">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Ej. 500"
                        className="pl-7 border-slate-850 bg-slate-950/60 text-slate-100"
                        disabled={isLoading}
                        {...register("monto")}
                      />
                    </div>
                    {errors.monto && <p className="text-xs text-rose-500">{errors.monto.message}</p>}
                  </div>

                  {/* Method */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Método de Pago *</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-slate-850 bg-slate-950/60 text-slate-100 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                      disabled={isLoading}
                      {...register("metodo")}
                    >
                      <option value="transferencia">Transferencia</option>
                      <option value="efectivo">Efectivo</option>
                    </select>
                  </div>

                  {/* Mock Comprobante URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Comprobante (URL/Texto)</label>
                    <Input
                      placeholder="Ej. URL de comprobante"
                      className="border-slate-855 bg-slate-950/60 text-slate-100 text-xs"
                      disabled={isLoading}
                      {...register("comprobante")}
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Notas de Pago</label>
                    <textarea
                      placeholder="Ej. Liquidación anticipo"
                      rows={2}
                      className="flex w-full rounded-md border border-slate-855 bg-slate-950/60 text-slate-100 px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 resize-none"
                      disabled={isLoading}
                      {...register("notas")}
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-400">
                      {error}
                    </div>
                  )}
                </CardContent>
                <div className="px-6 pb-6 flex justify-end">
                  <Button
                    type="submit"
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-violet-500/10"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      "Registrar Pago"
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Card: Payments History */}
          <Card className="border-slate-900 bg-slate-900/10 text-slate-100">
            <CardHeader className="pb-3 border-b border-slate-900">
              <CardTitle className="text-base font-bold text-white flex items-center gap-1.5">
                <Clock className="h-4.5 w-4.5 text-violet-400" />
                Historial de Pagos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-4">
              {pedido.pagos.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-4">No hay pagos registrados aún.</p>
              ) : (
                <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                  {pedido.pagos.map((pago: Pago) => (
                    <div key={pago.id} className="p-3 border border-slate-900 rounded-lg bg-slate-950/40 text-xs space-y-1.5 hover:border-slate-850 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-400">
                          {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(pago.monto))}
                        </span>
                        <span className="text-slate-500 uppercase font-semibold tracking-wider text-4xs">
                          {pago.metodo}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-4xs text-slate-500">
                        <span>
                          {new Intl.DateTimeFormat("es-MX", { dateStyle: "short", timeStyle: "short" }).format(new Date(pago.fecha))}
                        </span>
                        {pago.comprobante && (
                          <span className="text-violet-400 max-w-[120px] truncate" title={pago.comprobante}>
                            Comp: {pago.comprobante}
                          </span>
                        )}
                      </div>
                      {pago.notas && (
                        <p className="text-slate-400 text-3xs border-t border-slate-900/50 pt-1 leading-relaxed">
                          {pago.notas}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
