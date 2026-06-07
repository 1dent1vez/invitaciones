"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Save, 
  Globe, 
  QrCode, 
  Loader2, 
  Upload, 
  ArrowLeft, 
  Check, 
  ExternalLink,
  Smartphone
} from "lucide-react";
import { Pedido, Cliente, Prisma } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTemplateConfig, TEMPLATE_COMPONENTS } from "@/lib/templates";
import { TemplateType, InvitacionData } from "@/types";
import { 
  savePedidoDatosAction, 
  publicarInvitacionAction, 
  generarQRAction, 
  uploadImageAction 
} from "./actions";

// Form Schema matching InvitacionData
const editorSchema = z.object({
  nombres: z.string().min(2, "El nombre del evento debe tener al menos 2 caracteres"),
  fecha: z.string().min(1, "La fecha y hora del evento es requerida"),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  mapaUrl: z.string().optional().nullable().or(z.literal("")),
  mensaje: z.string().optional().nullable().or(z.literal("")),
  colorPrincipal: z.string().optional().nullable().or(z.literal("")),
  colorSecundario: z.string().optional().nullable().or(z.literal("")),
  portadaUrl: z.string().optional().nullable().or(z.literal("")),
  dressCode: z.string().optional().nullable().or(z.literal("")),
  regalosDatos: z.string().optional().nullable().or(z.literal("")),
  musicaUrl: z.string().optional().nullable().or(z.literal("")),
  nombreBebe: z.string().optional().nullable().or(z.literal("")),
  padrinos: z.string().optional().nullable().or(z.literal("")),
  padres: z.string().optional().nullable().or(z.literal("")),
});

type EditorFormValues = z.infer<typeof editorSchema>;

type PedidoWithCliente = Pedido & { cliente: Cliente };

interface EditorClientProps {
  pedido: PedidoWithCliente;
}

function cleanFormValues(data: EditorFormValues): InvitacionData {
  const clean: Record<string, unknown> = {};
  
  (Object.keys(data) as Array<keyof EditorFormValues>).forEach((key) => {
    const val = data[key];
    if (val !== null && val !== "") {
      clean[key] = val;
    }
  });

  return {
    ...clean,
    fecha: data.fecha ? new Date(data.fecha).toISOString() : new Date().toISOString(),
  } as unknown as InvitacionData;
}

export function EditorClient({ pedido: initialPedido }: EditorClientProps) {
  const [pedido, setPedido] = useState<PedidoWithCliente>(initialPedido);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  
  // Action states
  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  const templateType = pedido.template as TemplateType;
  const config = getTemplateConfig(templateType);
  const TemplateComponent = TEMPLATE_COMPONENTS[templateType];

  // Default values from db JSON or order columns fallback
  const dbDatos = (pedido.datosJson as unknown as InvitacionData) || {};
  
  // Format Date to datetime-local input string (YYYY-MM-DDTHH:MM)
  let initialDate = "";
  try {
    const d = new Date(dbDatos.fecha || pedido.fechaEvento);
    if (!isNaN(d.getTime())) {
      // Adjusted to local timezone ISO string segment
      const offset = d.getTimezoneOffset();
      const localD = new Date(d.getTime() - offset * 60 * 1000);
      initialDate = localD.toISOString().slice(0, 16);
    }
  } catch {
    // fallback
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditorFormValues>({
    resolver: zodResolver(editorSchema) as unknown as Resolver<EditorFormValues>,
    defaultValues: {
      nombres: dbDatos.nombres || pedido.cliente.nombre || "",
      fecha: initialDate,
      ubicacion: dbDatos.ubicacion || pedido.notas || "",
      mapaUrl: dbDatos.mapaUrl || "",
      mensaje: dbDatos.mensaje || "",
      colorPrincipal: dbDatos.colorPrincipal || (templateType === "boda-elegante" ? "#C5A880" : templateType === "xv-moderno" ? "#EC4899" : templateType === "baby-shower" ? "#725C42" : "#F59E0B"),
      colorSecundario: dbDatos.colorSecundario || (templateType === "xv-moderno" ? "#4C1D95" : "#1e293b"),
      portadaUrl: dbDatos.portadaUrl || "",
      dressCode: dbDatos.dressCode || "",
      regalosDatos: dbDatos.regalosDatos || "",
      musicaUrl: dbDatos.musicaUrl || "",
      nombreBebe: dbDatos.nombreBebe || "",
      padrinos: dbDatos.padrinos || "",
      padres: dbDatos.padres || "",
    },
  });

  const watchedData = watch();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: keyof EditorFormValues) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldKey);
    setActionError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadImageAction(formData);
      if (res.success && res.data) {
        setValue(fieldKey, res.data);
      } else {
        setActionError(res.error || "Error al subir la imagen.");
      }
    } catch {
      setActionError("Error de red al intentar subir la imagen.");
    } finally {
      setUploadingField(null);
    }
  };

  const onSave = async (data: EditorFormValues) => {
    setSaveSuccess(false);
    setActionError(null);

    startTransition(async () => {
      const mappedData = cleanFormValues(data);

      const res = await savePedidoDatosAction(pedido.id, mappedData);
      if (res.success && res.data) {
        setSaveSuccess(true);
        setPedido(prev => ({ ...prev, datosJson: res.data as unknown as Prisma.JsonValue }));
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setActionError(res.error || "No se pudo guardar la invitación.");
      }
    });
  };

  const onPublish = async () => {
    setActionError(null);

    // Save first
    const currentData = watchedData;
    const mappedData = cleanFormValues(currentData);

    startTransition(async () => {
      const saveRes = await savePedidoDatosAction(pedido.id, mappedData);
      if (!saveRes.success) {
        setActionError("No se pudieron guardar los cambios previos a publicar.");
        return;
      }

      const res = await publicarInvitacionAction(pedido.id);
      if (res.success && res.data) {
        setPedido(prev => ({
          ...prev,
          slug: res.data?.slug || prev.slug,
          urlPublica: res.data?.urlPublica || prev.urlPublica,
          estado: "entregado",
          datosJson: saveRes.data as unknown as Prisma.JsonValue
        }));
      } else {
        setActionError(res.error || "Ocurrió un error al publicar la invitación.");
      }
    });
  };

  const onGenerateQR = async () => {
    setActionError(null);
    setQrLoading(true);

    try {
      const res = await generarQRAction(pedido.id);
      if (res.success && res.data) {
        setPedido(prev => ({ ...prev, qrUrl: res.data || prev.qrUrl }));
      } else {
        setActionError(res.error || "No se pudo generar el código QR.");
      }
    } catch {
      setActionError("Ocurrió un error inesperado al generar el QR.");
    } finally {
      setQrLoading(false);
    }
  };

  // Resolve Preview data context
  const previewData = cleanFormValues(watchedData);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 font-sans">
      
      {/* LEFT: FORM FIELD CONTROLS */}
      <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-900 overflow-y-auto p-6 max-h-none lg:max-h-[calc(100vh-4rem)] space-y-6">
        <div className="flex items-center justify-between border-b border-slate-900 pb-4">
          <div className="space-y-0.5">
            <Link 
              href={`/admin/pedidos/${pedido.id}`} 
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-violet-400 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Detalle del Pedido
            </Link>
            <h2 className="text-xl font-bold tracking-tight text-white">Editar Invitación</h2>
          </div>
          <span className="inline-flex items-center rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold ring-1 ring-slate-800 text-slate-400">
            {config.name}
          </span>
        </div>

        {actionError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm font-medium text-rose-400">
            {actionError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
          <div className="space-y-4">
            {config.fields.map(field => {
              const registerKey = field.key as keyof EditorFormValues;

              return (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                    {field.label} {field.required && <span className="text-violet-400">*</span>}
                  </label>

                  {field.type === "text" && (
                    <Input
                      type="text"
                      placeholder={field.placeholder}
                      className="border-slate-900 bg-slate-950 text-sm focus-visible:ring-violet-500"
                      {...register(registerKey)}
                    />
                  )}

                  {field.type === "date" && (
                    <Input
                      type="datetime-local"
                      className="border-slate-900 bg-slate-950 text-sm focus-visible:ring-violet-500"
                      {...register(registerKey)}
                    />
                  )}

                  {field.type === "color" && (
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        className="w-12 h-10 p-1 bg-slate-950 border-slate-900 rounded-lg cursor-pointer"
                        {...register(registerKey)}
                      />
                      <span className="text-xs font-mono text-slate-400">{watchedData[registerKey] || "#000000"}</span>
                    </div>
                  )}

                  {field.type === "textarea" && (
                    <textarea
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full rounded-lg border border-slate-900 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all"
                      {...register(registerKey)}
                    />
                  )}

                  {field.type === "image" && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="URL de la imagen"
                          className="border-slate-900 bg-slate-950 text-sm focus-visible:ring-violet-500 flex-1"
                          {...register(registerKey)}
                        />
                        <div className="relative">
                          <input
                            type="file"
                            id={`file-upload-${field.key}`}
                            className="hidden"
                            accept="image/*"
                            disabled={uploadingField !== null}
                            onChange={(e) => handleImageUpload(e, registerKey)}
                          />
                          <label
                            htmlFor={`file-upload-${field.key}`}
                            className={cn(
                              "inline-flex h-9 items-center justify-center rounded-lg px-3 text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white cursor-pointer select-none transition-colors",
                              uploadingField === field.key && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {uploadingField === field.key ? (
                              <Loader2 className="h-4.5 w-4.5 animate-spin" />
                            ) : (
                              <Upload className="h-4.5 w-4.5" />
                            )}
                          </label>
                        </div>
                      </div>
                      {watchedData[registerKey] && (
                        <div className="h-20 w-32 rounded-lg border border-slate-900 overflow-hidden relative bg-slate-950">
                          <img
                            src={watchedData[registerKey] as string}
                            alt="preview thumbnail"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {errors[registerKey] && (
                    <p className="text-2xs font-semibold text-rose-500">
                      {errors[registerKey]?.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 border-t border-slate-900 pt-6">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-white hover:from-violet-500 hover:to-indigo-500 gap-1.5 shadow-lg shadow-violet-500/20"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Guardar Cambios
            </Button>
            
            {saveSuccess && (
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 rounded-lg py-2 px-4 animate-fade-in">
                <Check className="h-4 w-4" />
                ¡Cambios guardados!
              </div>
            )}
          </div>
        </form>

        {/* PUBLICATION FLOW CARD */}
        <Card className="border-slate-900 bg-slate-900/20">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-violet-400" />
              Publicación e Internet
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Genera tu enlace y QR para que los invitados accedan.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-4">
            {pedido.urlPublica ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-2xs uppercase tracking-widest text-slate-500 font-semibold">Enlace Público</span>
                  <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-900 rounded-lg p-2.5">
                    <span className="text-xs font-mono text-slate-300 truncate flex-1">{pedido.urlPublica}</span>
                    <a 
                      href={pedido.urlPublica} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-violet-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <Button
                    onClick={onPublish}
                    disabled={isPending}
                    variant="outline"
                    className="flex-1 border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-900 text-xs gap-1.5"
                  >
                    {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
                    Republicar Cambios
                  </Button>

                  {pedido.qrUrl ? (
                    <div className="w-full flex items-center justify-between gap-4 border-t border-slate-900 pt-4 mt-2">
                      <div className="h-20 w-20 bg-white p-1 rounded-lg border border-slate-200 shadow-sm shrink-0">
                        <img src={pedido.qrUrl} alt="QR Code" className="h-full w-full" />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <p className="text-xs font-semibold text-slate-300">Código QR Generado</p>
                        <a 
                          href={pedido.qrUrl} 
                          download="invitacion-qr.png" 
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="outline" className="border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white text-2xs gap-1">
                            <QrCode className="h-3 w-3" />
                            Ver / Descargar
                          </Button>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={onGenerateQR}
                      disabled={qrLoading}
                      className="flex-1 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 border border-violet-500/20 text-xs gap-1.5"
                    >
                      {qrLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <QrCode className="h-3.5 w-3.5" />}
                      Generar Código QR
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <Button
                onClick={onPublish}
                disabled={isPending}
                className="w-full bg-violet-600 text-white hover:bg-violet-500 font-semibold text-xs gap-1.5"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
                Publicar Invitación
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT: LIVE MOBILE PREVIEW */}
      <div className="lg:col-span-7 bg-[#05070f] overflow-y-auto flex items-center justify-center p-6 lg:p-12 max-h-none lg:max-h-[calc(100vh-4rem)] border-t lg:border-t-0 border-slate-900 relative">
        {/* Floating Mock Simulator Indicator */}
        <div className="absolute top-4 left-6 flex items-center gap-1.5 text-xs text-slate-500">
          <Smartphone className="h-4 w-4" />
          <span>Vista Previa del Invitado</span>
        </div>

        {/* Device frame mock */}
        <div className="w-full max-w-sm aspect-[9/18] min-h-[660px] border-[8px] border-slate-900 rounded-[36px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative bg-[#0b0f19] flex flex-col ring-1 ring-slate-800/40">
          {/* Top Notch simulator */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-slate-900 rounded-b-2xl z-40 flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-950/40 mr-4" />
            <div className="h-1 w-8 rounded-full bg-slate-950/40" />
          </div>

          {/* Dynamic styles mapping */}
          <div 
            style={{ 
              "--primary": previewData.colorPrincipal || "#8B5CF6", 
              "--secondary": previewData.colorSecundario || "#EC4899" 
            } as React.CSSProperties}
            className="h-full w-full overflow-y-auto flex flex-col pt-5"
          >
            <TemplateComponent data={previewData} />
          </div>
        </div>
      </div>

    </div>
  );
}
