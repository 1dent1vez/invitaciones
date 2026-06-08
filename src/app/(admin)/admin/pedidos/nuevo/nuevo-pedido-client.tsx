"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  FileText, 
  UserPlus, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  Check, 
  Sparkles,
  Users,
  Search
} from "lucide-react";
import { Cliente } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClienteAction } from "../../clientes/actions";
import { createPedidoAction } from "../actions";
import { PedidoInput } from "@/types";


const quickClientSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  telefono: z.string().optional().transform(val => val || ""),
  email: z.string().email("El correo no es válido").optional().or(z.literal("")).transform(val => val || ""),
  fuente: z.enum(["tienda", "instagram", "whatsapp", "referido"]),
});

interface EventFormValues {
  clienteId: string;
  tipoEvento: "boda" | "xv" | "baby_shower" | "cumpleanos";
  fechaPart: string;
  horaPart: string;
  template: "boda-elegante" | "xv-moderno" | "baby-shower" | "cumpleanos-fiesta";
  precio: number;
  notas: string;
}

const eventSchema = z.object({
  clienteId: z.string().optional(),
  tipoEvento: z.enum(["boda", "xv", "baby_shower", "cumpleanos"], {
    message: "Selecciona un tipo de evento",
  }),
  fechaPart: z.string().min(1, "La fecha del evento es requerida"),
  horaPart: z.string().min(1, "La hora del evento es requerida"),
  template: z.enum(["boda-elegante", "xv-moderno", "baby-shower", "cumpleanos-fiesta"], {
    message: "Selecciona una plantilla",
  }),
  precio: z.preprocess((val) => Number(val), z.number().positive("El precio debe ser un número positivo")),
  notas: z.string().optional().transform(val => val || ""),
}).refine((data) => {
  if (!data.fechaPart || !data.horaPart) return true;
  const combined = new Date(`${data.fechaPart}T${data.horaPart}`);
  if (isNaN(combined.getTime())) return false;
  return combined > new Date();
}, {
  message: "La fecha y hora del evento debe ser futura",
  path: ["fechaPart"],
});

interface NuevoPedidoClientProps {
  clientes: Cliente[];
}

export function NuevoPedidoClient({ clientes: initialClientes }: NuevoPedidoClientProps) {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const [step, setStep] = useState(1);
  const [selectedClienteId, setSelectedClienteId] = useState("");
  const [isNewClientForm, setIsNewClientForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Client search state
  const [clientSearch, setClientSearch] = useState("");

  // Forms
  const {
    register: registerClient,
    handleSubmit: handleClientSubmit,
    formState: { errors: clientErrors },
    reset: resetClientForm,
  } = useForm<z.infer<typeof quickClientSchema>>({
    resolver: zodResolver(quickClientSchema) as unknown as Resolver<z.infer<typeof quickClientSchema>>,
    defaultValues: {
      nombre: "",
      telefono: "",
      email: "",
      fuente: "tienda",
    },
  });

  const {
    register: registerEvent,
    handleSubmit: handleEventSubmit,
    formState: { errors: eventErrors },
    setValue: setEventValue,
    watch: watchEvent,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema) as unknown as Resolver<EventFormValues>,
    defaultValues: {
      clienteId: "",
      tipoEvento: "boda",
      fechaPart: "",
      horaPart: "18:00",
      template: "boda-elegante",
      precio: 1500,
      notas: "",
    } as EventFormValues,
  });

  // Watch event type to automatically set template matching it
  const watchTipoEvento = watchEvent("tipoEvento");
  const handleTipoEventoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "boda" | "xv" | "baby_shower" | "cumpleanos";
    setEventValue("tipoEvento", value);
    if (value === "boda") setEventValue("template", "boda-elegante");
    else if (value === "xv") setEventValue("template", "xv-moderno");
    else if (value === "baby_shower") setEventValue("template", "baby-shower");
    else if (value === "cumpleanos") setEventValue("template", "cumpleanos-fiesta");
  };

  const handleNextStep1 = () => {
    if (!selectedClienteId) {
      setError("Por favor, selecciona un cliente para continuar.");
      return;
    }
    setEventValue("clienteId", selectedClienteId);
    setError(null);
    setStep(2);
  };

  const handleQuickClientCreate = async (data: z.infer<typeof quickClientSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await createClienteAction(data);
      if (res.success && res.data) {
        const newClient: Cliente = {
          id: res.data.id,
          nombre: data.nombre,
          fuente: data.fuente,
          telefono: data.telefono || null,
          email: data.email || null,
          notas: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setClientes(prev => [newClient, ...prev]);
        setSelectedClienteId(newClient.id);
        setEventValue("clienteId", newClient.id);
        setIsNewClientForm(false);
        setStep(2);
        resetClientForm();
      } else {
        setError(res.error || "Error al crear cliente rápido");
      }
    } catch {
      setError("Error inesperado al registrar cliente");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePedido = async (data: EventFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const combinedDate = new Date(`${data.fechaPart}T${data.horaPart}`);
      const payload: PedidoInput = {
        clienteId: selectedClienteId,
        tipoEvento: data.tipoEvento,
        fechaEvento: combinedDate.toISOString(),
        template: data.template,
        precio: data.precio,
        notas: data.notas,
      };
      const res = await createPedidoAction(payload);
      if (res.success && res.data) {
        router.push(`/admin/pedidos/${res.data.id}`);
        router.refresh();
      } else {
        setError(res.error || "Error al guardar el pedido");
      }
    } catch (err) {
      console.error("[handleSavePedido] Client catch error:", err);
      setError(err instanceof Error ? err.message : "Error inesperado al guardar el pedido");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter clients client-side
  const filteredClientes = clientes.filter(c =>
    c.nombre.toLowerCase().includes(clientSearch.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <FileText className="h-6 w-6 text-violet-400" />
          Registrar Nuevo Pedido
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Sigue los pasos para configurar el cliente y los detalles de la invitación.
        </p>
      </div>

      {/* Progress Indicators */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-5">
        <div className="flex items-center gap-8 w-full max-w-md">
          {/* Step 1 Indicator */}
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ring-1 transition-all",
              step === 1 
                ? "bg-violet-600/20 ring-violet-500 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.1)]" 
                : "bg-slate-900 ring-slate-800 text-slate-400"
            )}>
              {step > 1 ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <span className={cn("text-sm font-semibold", step === 1 ? "text-white" : "text-slate-500")}>
              Cliente
            </span>
          </div>

          {/* Line separator */}
          <div className={cn("h-[1px] flex-1", step > 1 ? "bg-violet-600" : "bg-slate-900")} />

          {/* Step 2 Indicator */}
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ring-1 transition-all",
              step === 2 
                ? "bg-violet-600/20 ring-violet-500 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.1)]" 
                : "bg-slate-900 ring-slate-800 text-slate-400"
            )}>
              2
            </div>
            <span className={cn("text-sm font-semibold", step === 2 ? "text-white" : "text-slate-500")}>
              Detalles del Evento
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-medium text-rose-400">
          {error}
        </div>
      )}

      {/* STEP 1: SELECT OR CREATE CLIENT */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-400" />
              Paso 1: Asignar Cliente al Pedido
            </h3>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsNewClientForm(!isNewClientForm);
                setError(null);
              }}
              className="border-slate-800 bg-slate-950/40 text-slate-300 hover:text-white hover:bg-slate-900 text-sm flex items-center gap-1.5"
            >
              <UserPlus className="h-4 w-4" />
              {isNewClientForm ? "Seleccionar Existente" : "Crear Cliente Rápido"}
            </Button>
          </div>

          {isNewClientForm ? (
            /* Quick create Client form */
            <Card className="border-slate-900 bg-slate-900/20 text-slate-100">
              <CardHeader>
                <CardTitle className="text-md font-bold text-white">Registrar Cliente Nuevo</CardTitle>
                <CardDescription className="text-slate-400">Introduce la información del nuevo cliente para proceder.</CardDescription>
              </CardHeader>
              <form onSubmit={handleClientSubmit(handleQuickClientCreate)}>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Nombre *</label>
                      <input
                        placeholder="Ej. Juan Gómez"
                        className={cn(
                          "flex h-10 w-full rounded-md border border-slate-850 bg-slate-950/60 text-slate-100 placeholder:text-slate-600 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
                          clientErrors.nombre && "border-rose-500 focus-visible:ring-rose-500"
                        )}
                        aria-invalid={!!clientErrors.nombre}
                        {...registerClient("nombre")}
                      />
                      {clientErrors.nombre && <p className="text-xs text-rose-500">{clientErrors.nombre.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Teléfono</label>
                      <input
                        placeholder="Ej. 5512345678"
                        className={cn(
                          "flex h-10 w-full rounded-md border border-slate-850 bg-slate-950/60 text-slate-100 placeholder:text-slate-600 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
                          clientErrors.telefono && "border-rose-500 focus-visible:ring-rose-500"
                        )}
                        aria-invalid={!!clientErrors.telefono}
                        {...registerClient("telefono")}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Correo Electrónico</label>
                      <input
                        placeholder="Ej. juan@example.com"
                        className={cn(
                          "flex h-10 w-full rounded-md border border-slate-850 bg-slate-950/60 text-slate-100 placeholder:text-slate-600 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
                          clientErrors.email && "border-rose-500 focus-visible:ring-rose-500"
                        )}
                        aria-invalid={!!clientErrors.email}
                        {...registerClient("email")}
                      />
                      {clientErrors.email && <p className="text-xs text-rose-500">{clientErrors.email.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300">Origen *</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-slate-850 bg-slate-950/60 text-slate-100 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                        {...registerClient("fuente")}
                      >
                        <option value="tienda">Tienda</option>
                        <option value="instagram">Instagram</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="referido">Referido</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <div className="px-6 pb-6 flex justify-end gap-3">
                  <Button
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-1.5"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    Crear y Continuar
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            /* Select existing Client */
            <div className="space-y-4">
              <div className="relative max-w-sm flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Filtrar clientes..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="pl-9 border-slate-900 bg-slate-900/40 text-slate-100 placeholder:text-slate-500"
                />
              </div>

              <div className="border border-slate-900 rounded-xl max-h-72 overflow-y-auto bg-slate-900/10">
                {filteredClientes.length === 0 ? (
                  <p className="text-sm text-slate-500 italic p-6 text-center">No hay clientes que coincidan con la búsqueda.</p>
                ) : (
                  <div className="divide-y divide-slate-900/50">
                    {filteredClientes.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedClienteId(c.id);
                          setEventValue("clienteId", c.id);
                        }}
                        className={cn(
                          "flex items-center justify-between p-4 cursor-pointer transition-colors",
                          selectedClienteId === c.id 
                            ? "bg-violet-600/10 hover:bg-violet-600/15" 
                            : "hover:bg-slate-900/20"
                        )}
                      >
                        <div>
                          <p className="font-semibold text-white">{c.nombre}</p>
                          <p className="text-xs text-slate-500">{c.email || "Sin email"} | {c.telefono || "Sin teléfono"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-3xs font-medium text-slate-400 capitalize">
                            {c.fuente}
                          </span>
                          {selectedClienteId === c.id && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleNextStep1}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-1.5"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: EVENT DETAILS */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              Paso 2: Detalles del Evento
            </h3>
            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              className="text-slate-400 hover:text-white hover:bg-slate-900 flex items-center gap-1.5"
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4" />
              Atrás
            </Button>
          </div>

          <Card className="border-slate-900 bg-slate-900/20 text-slate-100">
            <form onSubmit={handleEventSubmit(handleSavePedido)}>
              <CardContent className="space-y-5 pt-6">
                {/* Event Type & Template */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Tipo de Evento *</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-slate-850 bg-slate-950/60 text-slate-100 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                      disabled={isLoading}
                      {...registerEvent("tipoEvento")}
                      onChange={handleTipoEventoChange}
                    >
                      <option value="boda">Boda</option>
                      <option value="xv">XV Años</option>
                      <option value="baby_shower">Baby Shower</option>
                      <option value="cumpleanos">Cumpleaños</option>
                    </select>
                    {eventErrors.tipoEvento && <p className="text-xs text-rose-500">{eventErrors.tipoEvento.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Plantilla Visual *</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-slate-850 bg-slate-950/60 text-slate-100 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                      disabled={isLoading}
                      {...registerEvent("template")}
                    >
                      {watchTipoEvento === "boda" && <option value="boda-elegante">Boda Elegante</option>}
                      {watchTipoEvento === "xv" && <option value="xv-moderno">XV Años Moderno</option>}
                      {watchTipoEvento === "baby_shower" && <option value="baby-shower">Baby Shower Clásico</option>}
                      {watchTipoEvento === "cumpleanos" && <option value="cumpleanos-fiesta">Cumpleaños Fiesta</option>}
                    </select>
                    {eventErrors.template && <p className="text-xs text-rose-500">{eventErrors.template.message}</p>}
                  </div>
                </div>

                {/* Date, Time & Price */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label htmlFor="fechaEvento" className="text-sm font-medium text-slate-300">Fecha del Evento *</label>
                    <input
                      id="fechaEvento"
                      type="date"
                      className={cn(
                        "flex h-10 w-full rounded-md border border-slate-850 bg-slate-950/60 text-slate-100 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
                        eventErrors.fechaPart && "border-rose-500 focus-visible:ring-rose-500"
                      )}
                      disabled={isLoading}
                      aria-invalid={!!eventErrors.fechaPart}
                      {...registerEvent("fechaPart")}
                    />
                    {eventErrors.fechaPart && <p className="text-xs text-rose-500">{eventErrors.fechaPart.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="horaPart" className="text-sm font-medium text-slate-300">Hora del Evento *</label>
                    <input
                      id="horaPart"
                      type="time"
                      className={cn(
                        "flex h-10 w-full rounded-md border border-slate-850 bg-slate-950/60 text-slate-100 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
                        eventErrors.horaPart && "border-rose-500 focus-visible:ring-rose-500"
                      )}
                      disabled={isLoading}
                      aria-invalid={!!eventErrors.horaPart}
                      {...registerEvent("horaPart")}
                    />
                    {eventErrors.horaPart && <p className="text-xs text-rose-500">{eventErrors.horaPart.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="precio" className="text-sm font-medium text-slate-300">Precio Total (MXN) *</label>
                    <input
                      id="precio"
                      type="number"
                      placeholder="Ej. 1500"
                      className={cn(
                        "flex h-10 w-full rounded-md border border-slate-850 bg-slate-950/60 text-slate-100 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
                        eventErrors.precio && "border-rose-500 focus-visible:ring-rose-500"
                      )}
                      disabled={isLoading}
                      aria-invalid={!!eventErrors.precio}
                      {...registerEvent("precio")}
                    />
                    {eventErrors.precio && <p className="text-xs text-rose-500">{eventErrors.precio.message}</p>}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Notas / Requerimientos</label>
                  <textarea
                    placeholder="Detalles sobre el evento o personalización..."
                    rows={4}
                    className="flex w-full rounded-md border border-slate-855 bg-slate-950/60 text-slate-100 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 resize-none"
                    disabled={isLoading}
                    {...registerEvent("notas")}
                  />
                </div>
              </CardContent>
              <div className="px-6 pb-6 flex justify-end gap-3 border-t border-slate-900/50 pt-4 mt-2">
                <Button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-violet-500/10"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      Crear Pedido
                      <Check className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
