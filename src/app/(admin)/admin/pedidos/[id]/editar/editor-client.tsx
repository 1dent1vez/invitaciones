"use client";

import React, { useState, useTransition, useMemo } from "react";
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
  ExternalLink,
  Smartphone,
  Trash2
} from "lucide-react";
import { Pedido, Cliente, Prisma } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTemplateConfig, TEMPLATE_COMPONENTS } from "@/lib/templates";
import { TemplateWrapper } from "@/components/templates/TemplateWrapper";
import { TemplateType, InvitacionData } from "@/types";
import { useToast } from "@/components/ui/toast";
import { hexColorRegex, urlValidation } from "./schemas";
import {
  savePedidoDatosAction,
  publicarInvitacionAction,
  generarQRAction,
  uploadImageAction
} from "./actions";

// Form Schema generator for Drafts (all fields optional, formats validated)
const getDraftFormSchema = () => {
  return z.object({
    nombres: z.string().optional().nullable().or(z.literal("")),
    fechaPart: z.string().optional().nullable().or(z.literal("")),
    horaPart: z.string().optional().nullable().or(z.literal("")),
    ubicacion: z.string().optional().nullable().or(z.literal("")),
    mapaUrl: urlValidation,
    mensaje: z.string().optional().nullable().or(z.literal("")),
    colorPrincipal: z.string().optional().nullable().or(z.literal(""))
      .refine((val) => !val || hexColorRegex.test(val), {
        message: "Debe ser un color hexadecimal válido (ej. #FFFFFF)",
      }),
    colorSecundario: z.string().optional().nullable().or(z.literal(""))
      .refine((val) => !val || hexColorRegex.test(val), {
        message: "Debe ser un color hexadecimal válido (ej. #FFFFFF)",
      }),
    portadaUrl: urlValidation,
    dressCode: z.string().optional().nullable().or(z.literal("")),
    regalosDatos: z.string().optional().nullable().or(z.literal("")),
    musicaUrl: urlValidation,
    nombreBebe: z.string().optional().nullable().or(z.literal("")),
    padrinos: z.string().optional().nullable().or(z.literal("")),
    padres: z.string().optional().nullable().or(z.literal("")),
  });
};

// Form Schema generator for Publications (required fields enforced)
const getPublishFormSchema = (templateType: TemplateType) => {
  const base: Record<string, z.ZodTypeAny> = {
    nombres: z.string().min(2, "El nombre del evento debe tener al menos 2 caracteres"),
    fechaPart: z.string().min(1, "La fecha del evento es requerida"),
    horaPart: z.string().min(1, "La hora del evento es requerida"),
    ubicacion: z.string().min(1, "La ubicación es requerida"),
    mapaUrl: urlValidation,
    mensaje: z.string().optional().nullable().or(z.literal("")),
    colorPrincipal: z.string().optional().nullable().or(z.literal(""))
      .refine((val) => !val || hexColorRegex.test(val), {
        message: "Debe ser un color hexadecimal válido (ej. #FFFFFF)",
      }),
    colorSecundario: z.string().optional().nullable().or(z.literal(""))
      .refine((val) => !val || hexColorRegex.test(val), {
        message: "Debe ser un color hexadecimal válido (ej. #FFFFFF)",
      }),
    portadaUrl: urlValidation,
    dressCode: z.string().optional().nullable().or(z.literal("")),
    regalosDatos: z.string().optional().nullable().or(z.literal("")),
    musicaUrl: urlValidation,
    nombreBebe: z.string().optional().nullable().or(z.literal("")),
    padrinos: z.string().optional().nullable().or(z.literal("")),
    padres: z.string().optional().nullable().or(z.literal("")),
  };

  if (templateType === "baby-shower") {
    base.nombreBebe = z.string().min(1, "El nombre del bebé es requerido");
  }

  return z.object(base);
};

type EditorFormValues = {
  nombres: string;
  fecha?: string;
  fechaPart: string;
  horaPart: string;
  ubicacion: string;
  mapaUrl?: string | null;
  mensaje?: string | null;
  colorPrincipal?: string | null;
  colorSecundario?: string | null;
  portadaUrl?: string | null;
  dressCode?: string | null;
  regalosDatos?: string | null;
  musicaUrl?: string | null;
  nombreBebe?: string | null;
  padrinos?: string | null;
  padres?: string | null;
};

type PedidoWithCliente = Pedido & { cliente: Cliente };

interface EditorClientProps {
  pedido: PedidoWithCliente;
}

function cleanFormValues(data: EditorFormValues): InvitacionData {
  const clean: Record<string, unknown> = {};
  const safeData = data || {};

  (Object.keys(safeData) as Array<keyof EditorFormValues>).forEach((key) => {
    if (key !== "fechaPart" && key !== "horaPart" && key !== "fecha") {
      const val = safeData[key];
      if (val !== null && val !== undefined && val !== "") {
        clean[key] = val;
      }
    }
  });

  let fechaIso = new Date().toISOString();
  if (safeData.fechaPart && safeData.horaPart) {
    const d = new Date(`${safeData.fechaPart}T${safeData.horaPart}`);
    if (!isNaN(d.getTime())) {
      fechaIso = d.toISOString();
    }
  }

  return {
    ...clean,
    fecha: fechaIso,
  } as unknown as InvitacionData;
}

function getSafeTemplateData(data: Partial<InvitacionData> | null | undefined, templateType: string): InvitacionData {
  const safe = data || {};
  
  // Template specific defaults
  let defaultPrimary = "#8B5CF6";
  let defaultSecondary = "#EC4899";
  if (templateType === "boda-elegante") {
    defaultPrimary = "#C5A880";
    defaultSecondary = "#1e293b";
  } else if (templateType === "xv-moderno") {
    defaultPrimary = "#EC4899";
    defaultSecondary = "#4C1D95";
  } else if (templateType === "baby-shower") {
    defaultPrimary = "#725C42";
    defaultSecondary = "#1e293b";
  } else if (templateType === "cumpleanos-fiesta") {
    defaultPrimary = "#F59E0B";
    defaultSecondary = "#1e293b";
  }

  return {
    nombres: safe.nombres || "",
    fecha: safe.fecha || new Date().toISOString(),
    ubicacion: safe.ubicacion || "",
    mapaUrl: safe.mapaUrl || "",
    mensaje: safe.mensaje || "",
    colorPrincipal: safe.colorPrincipal || defaultPrimary,
    colorSecundario: safe.colorSecundario || defaultSecondary,
    portadaUrl: safe.portadaUrl || "",
    fotos: safe.fotos || [],
    dressCode: safe.dressCode || "",
    regalosDatos: safe.regalosDatos || "",
    musicaUrl: safe.musicaUrl || "",
    timeline: safe.timeline || [],
    nombreBebe: safe.nombreBebe || "",
    padrinos: safe.padrinos || "",
    padres: safe.padres || "",
  };
}

class PreviewErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Preview rendering error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl m-4 space-y-2">
          <p className="font-bold text-sm text-white">Error en plantilla</p>
          <p className="text-xs text-rose-300">Los datos ingresados causaron un error al renderizar la vista previa.</p>
          <p className="text-[10px] text-slate-500 font-mono">{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const SECTIONS = [
  {
    id: "general",
    title: "👤 Información del evento",
    keys: ["nombres", "nombreBebe", "fecha", "ubicacion", "mapaUrl", "dressCode", "padres", "padrinos"],
  },
  {
    id: "colores",
    title: "🎨 Colores y estilo",
    keys: ["colorPrincipal", "colorSecundario"],
  },
  {
    id: "fotos",
    title: "📸 Fotos",
    keys: ["portadaUrl", "fotos"],
  },
  {
    id: "mensajes",
    title: "💬 Mensajes",
    keys: ["mensaje", "musicaUrl", "regalosDatos"],
  },
];

export function EditorClient({ pedido: initialPedido }: EditorClientProps) {
  const { toast } = useToast();
  const [pedido, setPedido] = useState<PedidoWithCliente>(() => {
    const p = { ...initialPedido };
    if (!p.datosJson) {
      p.datosJson = {} as unknown as Prisma.JsonValue;
    }
    return p;
  });
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Action states
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  const templateType = pedido.template as TemplateType;
  const config = getTemplateConfig(templateType);
  const TemplateComponent = TEMPLATE_COMPONENTS[templateType];

  // Default values from db JSON or order columns fallback
  const dbDatos = useMemo(() => (pedido.datosJson as unknown as InvitacionData) || {}, [pedido.datosJson]);

  // Split date and time for inputs
  const initialDateParts = useMemo(() => {
    try {
      const d = new Date(dbDatos.fecha || pedido.fechaEvento);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        return {
          fechaPart: `${year}-${month}-${day}`,
          horaPart: `${hours}:${minutes}`,
        };
      }
    } catch {
      // fallback
    }
    return { fechaPart: "", horaPart: "18:00" };
  }, [dbDatos.fecha, pedido.fechaEvento]);

  // Initialize form with loose Draft Zod Schema
  const schema = useMemo(() => getDraftFormSchema(), []);

  const defaultValues = useMemo<EditorFormValues>(() => ({
    nombres: dbDatos.nombres || pedido.cliente?.nombre || "",
    fechaPart: initialDateParts.fechaPart,
    horaPart: initialDateParts.horaPart,
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
  }), [dbDatos, pedido, initialDateParts, templateType]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<EditorFormValues>({
    mode: "onSubmit",
    resolver: zodResolver(schema) as unknown as Resolver<EditorFormValues>,
    defaultValues,
  });

  // Watch for real-time instantaneous sync
  const watchedData = watch();
  const currentPreviewData = useMemo(() => {
    const cleaned = cleanFormValues(watchedData);
    return getSafeTemplateData(cleaned, templateType);
  }, [watchedData, templateType]);

  // Image Upload File Handler
  const handleImageUploadFile = async (file: File, fieldKey: keyof EditorFormValues) => {
    setUploadingField(fieldKey);
    setActionError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadImageAction(formData);
      if (res.success && res.data) {
        setValue(fieldKey, res.data, { shouldDirty: true, shouldValidate: true });
        toast({
          title: "Imagen subida",
          description: "La imagen se ha subido correctamente.",
          type: "success",
        });
      } else {
        const err = res.error || "Error al subir la imagen.";
        setActionError(err);
        toast({
          title: "Error al subir imagen",
          description: err,
          type: "error",
        });
      }
    } catch {
      const err = "Error de red al intentar subir la imagen.";
      setActionError(err);
      toast({
        title: "Error de red",
        description: err,
        type: "error",
      });
    } finally {
      setUploadingField(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: keyof EditorFormValues) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageUploadFile(file, fieldKey);
    }
  };

  const onSave = async (data: EditorFormValues) => {
    setActionError(null);

    startTransition(async () => {
      const mappedData = cleanFormValues(data);

      const res = await savePedidoDatosAction(pedido.id, mappedData);
      if (res.success && res.data) {
        setPedido(prev => ({ ...prev, datosJson: res.data as unknown as Prisma.JsonValue }));
        toast({
          title: "Borrador guardado",
          description: "Los cambios han sido guardados como borrador con éxito.",
          type: "success",
        });
      } else {
        const errMsg = res.error || "No se pudo guardar la invitación.";
        setActionError(errMsg);
        toast({
          title: "Error al guardar",
          description: errMsg,
          type: "error",
        });
      }
    });
  };

  const onPublish = async () => {
    setActionError(null);
    clearErrors();

    // Validate form fields manually for publication
    const currentValues = getValues();
    const publishSchema = getPublishFormSchema(templateType);
    const parsed = publishSchema.safeParse(currentValues);
    if (!parsed.success) {
      // Set RHF errors to show up in red on UI
      parsed.error.issues.forEach((issue) => {
        const fieldKey = issue.path[0] as keyof EditorFormValues;
        setError(fieldKey, {
          type: "required",
          message: issue.message,
        });
      });
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa correctamente los campos obligatorios del formulario.",
        type: "error",
      });
      return;
    }

    const mappedData = cleanFormValues(currentValues);

    startTransition(async () => {
      const saveRes = await savePedidoDatosAction(pedido.id, mappedData);
      if (!saveRes.success) {
        const errMsg = "No se pudieron guardar los cambios previos a publicar.";
        setActionError(errMsg);
        toast({
          title: "Error al publicar",
          description: errMsg,
          type: "error",
        });
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
        toast({
          title: "Invitación publicada",
          description: "La invitación se ha publicado con éxito.",
          type: "success",
        });
      } else {
        const errMsg = res.error || "Ocurrió un error al publicar la invitación.";
        setActionError(errMsg);
        toast({
          title: "Error al publicar",
          description: errMsg,
          type: "error",
        });
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
        toast({
          title: "Código QR generado",
          description: "El código QR se generó y guardó con éxito.",
          type: "success",
        });
      } else {
        const errMsg = res.error || "No se pudo generar el código QR.";
        setActionError(errMsg);
        toast({
          title: "Error al generar QR",
          description: errMsg,
          type: "error",
        });
      }
    } catch {
      const errMsg = "Ocurrió un error inesperado al generar el QR.";
      setActionError(errMsg);
      toast({
        title: "Error inesperado",
        description: errMsg,
        type: "error",
      });
    } finally {
      setQrLoading(false);
    }
  };

  // Group Dynamic Config Fields by preset sections
  const groupedFields = SECTIONS.map(section => {
    const fields = config.fields.filter(f => section.keys.includes(f.key));
    return { ...section, fields };
  }).filter(s => s.fields.length > 0);

  // Append remaining config fields to Information General
  const matchedKeys = new Set(SECTIONS.flatMap(s => s.keys));
  const remainingFields = config.fields.filter(f => !matchedKeys.has(f.key));
  if (remainingFields.length > 0) {
    const generalSection = groupedFields.find(s => s.id === "general");
    if (generalSection) {
      generalSection.fields.push(...remainingFields);
    } else {
      groupedFields.unshift({
        id: "other",
        title: "Otros datos",
        fields: remainingFields,
        keys: []
      });
    }
  }

  try {
    return (
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 font-sans">
        
        {/* MOBILE & TABLET NAVIGATION TABS */}
        <div className="lg:hidden flex border-b border-slate-900 bg-slate-950/90 p-2.5 sticky top-0 z-30 backdrop-blur-md gap-2 w-full">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={cn(
              "flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all border",
              activeTab === "edit"
                ? "bg-violet-600/10 text-violet-400 border-violet-500/30 shadow-md shadow-violet-900/5"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            )}
          >
            ✏️ Editar Formulario
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all border",
              activeTab === "preview"
                ? "bg-violet-600/10 text-violet-400 border-violet-500/30 shadow-md shadow-violet-900/5"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            )}
          >
            👁️ Vista Previa
          </button>
        </div>

        {/* LEFT COLUMN: FORM FIELD CONTROLS (35% on Desktop) */}
        <div
          className={cn(
            "w-full lg:w-[35%] border-r border-slate-900 flex flex-col h-[calc(100vh-4rem)] relative",
            activeTab === "edit" ? "flex" : "hidden lg:flex"
          )}
        >
          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto p-6 pb-28 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div className="space-y-1">
                <Link
                  href={`/admin/pedidos/${pedido.id}`}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-violet-400 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Detalle del Pedido
                </Link>
                <h2 className="text-xl font-bold tracking-tight text-white mt-1">Editar Invitación</h2>
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold ring-1 ring-slate-800 text-slate-400 shadow-inner">
                {config.name}
              </span>
            </div>

            {actionError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm font-medium text-rose-400">
                {actionError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSave)} className="space-y-8">
              {groupedFields.map(section => (
                <div key={section.id} className="space-y-4 bg-slate-900/10 p-4 rounded-xl border border-slate-900/50">
                  <h3 className="text-sm font-bold text-slate-200 border-b border-slate-900 pb-2 mb-2 tracking-wide flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                    {section.title}
                  </h3>
                  
                  <div className="space-y-5">
                    {section.fields.map(field => {
                      const registerKey = field.key as keyof EditorFormValues;

                      return (
                        <div key={field.key} className="space-y-2">
                          <label className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center justify-between">
                            <span>
                              {field.label} {field.required && <span className="text-rose-500">*</span>}
                            </span>
                          </label>

                          {field.type === "text" && (
                            <Input
                              type="text"
                              placeholder={field.placeholder}
                              className={cn(
                                "border bg-slate-950 text-sm focus-visible:ring-violet-500 text-slate-100 placeholder:text-slate-700 h-10 rounded-lg",
                                errors[registerKey] ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-800"
                              )}
                              {...register(registerKey)}
                            />
                          )}

                          {field.key === "fecha" ? (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Input
                                  type="date"
                                  className={cn(
                                    "border bg-slate-950 text-sm focus-visible:ring-violet-500 text-slate-100 h-10 rounded-lg",
                                    errors.fechaPart ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-800"
                                  )}
                                  {...register("fechaPart")}
                                />
                                {errors.fechaPart && (
                                  <p className="text-xs font-semibold text-rose-500 mt-1">
                                    {errors.fechaPart.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <Input
                                  type="time"
                                  className={cn(
                                    "border bg-slate-950 text-sm focus-visible:ring-violet-500 text-slate-100 h-10 rounded-lg",
                                    errors.horaPart ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-800"
                                  )}
                                  {...register("horaPart")}
                                />
                                {errors.horaPart && (
                                  <p className="text-xs font-semibold text-rose-500 mt-1">
                                    {errors.horaPart.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : field.type === "date" ? (
                            <Input
                              type="date"
                              className={cn(
                                "border bg-slate-950 text-sm focus-visible:ring-violet-500 text-slate-100 h-10 rounded-lg",
                                errors[registerKey] ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-800"
                              )}
                              {...register(registerKey)}
                            />
                          ) : null}

                          {field.type === "color" && (
                            <div className={cn(
                              "flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border w-full hover:border-slate-700 transition-colors",
                              errors[registerKey] ? "border-rose-500" : "border-slate-800"
                            )}>
                              <div 
                                className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-800 shrink-0 shadow-md transition-transform hover:scale-105 active:scale-95"
                                style={{ backgroundColor: watchedData[registerKey] || "#000000" }}
                              >
                                <input
                                  type="color"
                                  value={watchedData[registerKey] || "#000000"}
                                  onChange={(e) => setValue(registerKey, e.target.value, { shouldDirty: true })}
                                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                />
                              </div>
                              <div className="flex-1 flex items-center gap-2">
                                <span className="text-xs font-mono text-slate-500">HEX:</span>
                                <Input
                                  type="text"
                                  placeholder="#000000"
                                  className="border-transparent bg-transparent font-mono text-sm focus-visible:ring-0 focus-visible:border-transparent h-9 w-full p-0 text-white"
                                  {...register(registerKey)}
                                />
                              </div>
                            </div>
                          )}

                          {field.type === "textarea" && (
                            <textarea
                              placeholder={field.placeholder}
                              rows={3}
                              className={cn(
                                "w-full rounded-lg border bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all font-sans",
                                errors[registerKey] ? "border-rose-500" : "border-slate-800"
                              )}
                              {...register(registerKey)}
                            />
                          )}

                          {field.type === "image" && (
                            <div className="space-y-3">
                              {watchedData[registerKey] ? (
                                <div className="relative rounded-xl border border-slate-850 overflow-hidden bg-slate-950 group">
                                  <img
                                    src={watchedData[registerKey] as string}
                                    alt="Subida de foto"
                                    className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-102"
                                  />
                                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setValue(registerKey, "", { shouldDirty: true })}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                      Eliminar
                                    </button>
                                    <label
                                      htmlFor={`file-upload-${field.key}`}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                                    >
                                      <Upload className="h-3.5 w-3.5" />
                                      Cambiar foto
                                    </label>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) handleImageUploadFile(file, registerKey);
                                  }}
                                  className="border-2 border-dashed border-slate-800 hover:border-violet-500/50 hover:bg-violet-600/5 rounded-xl p-6 transition-all text-center flex flex-col items-center justify-center cursor-pointer group relative"
                                >
                                  <input
                                    type="file"
                                    id={`file-upload-${field.key}`}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept="image/*"
                                    disabled={uploadingField !== null}
                                    onChange={(e) => handleImageUpload(e, registerKey)}
                                  />
                                  <div className="p-3 bg-slate-900 rounded-full border border-slate-800 group-hover:border-violet-500/30 group-hover:bg-violet-600/10 transition-colors mb-2">
                                    {uploadingField === registerKey ? (
                                      <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
                                    ) : (
                                      <Upload className="h-6 w-6 text-slate-400 group-hover:text-violet-400 transition-colors" />
                                    )}
                                  </div>
                                  <p className="text-xs font-semibold text-slate-300">
                                    {uploadingField === registerKey ? "Subiendo foto..." : "Arrastra una foto aquí o haz clic para buscar"}
                                  </p>
                                  <p className="text-[10px] text-slate-500 mt-1">Soporta formatos de imagen (Máx. 5MB)</p>
                                </div>
                              )}
                              <div className="flex gap-2">
                                <Input
                                  type="text"
                                  placeholder="O ingresa la URL de la imagen directamente..."
                                  className={cn(
                                    "bg-slate-950 text-xs focus-visible:ring-violet-500 flex-1 h-9 rounded-lg border",
                                    errors[registerKey] ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-800"
                                  )}
                                  {...register(registerKey)}
                                />
                              </div>
                            </div>
                          )}

                          {field.key !== "fecha" && errors[registerKey] && (
                            <p className="text-xs font-semibold text-rose-500 mt-1">
                              {errors[registerKey]?.message}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* PUBLICATION FLOW CARD INSIDE THE SCROLL CONTAINER */}
              <Card className="border-slate-900 bg-slate-900/10 rounded-xl">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-violet-400" />
                    Enlace de Publicación y QR
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Genera el código QR y publica tu invitación para que los invitados la vean en internet.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-4">
                  {pedido.urlPublica ? (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Enlace Público</span>
                        <div className="flex items-center gap-2 bg-slate-950 border border-slate-900 rounded-lg p-2.5">
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

                      <div className="space-y-4">
                        {pedido.qrUrl ? (
                          <div className="flex items-center justify-between gap-4 border-t border-slate-900 pt-4">
                            <div className="h-20 w-20 bg-white p-1 rounded-lg border border-slate-200 shadow-md shrink-0">
                              <img src={pedido.qrUrl} alt="QR Code" className="h-full w-full" />
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <p className="text-xs font-bold text-slate-300">Código QR Generado</p>
                              <a
                                href={pedido.qrUrl}
                                download="invitacion-qr.png"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button size="sm" variant="outline" className="border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white text-2xs gap-1.5 h-8">
                                  <QrCode className="h-3.5 w-3.5" />
                                  Ver / Descargar
                                </Button>
                              </a>
                            </div>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            onClick={onGenerateQR}
                            disabled={qrLoading}
                            className="w-full bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 border border-violet-500/20 text-xs gap-1.5 h-10"
                          >
                            {qrLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <QrCode className="h-3.5 w-3.5" />}
                            Generar Código QR
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic py-2">
                      Publica la invitación usando el botón destacado de la barra inferior para generar su enlace público.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Form submit target */}
              <button type="submit" className="hidden" id="form-submit-trigger" />
            </form>
          </div>

          {/* FIXED BUTTON BAR AT THE BOTTOM OF THE FORM */}
          <div className="absolute bottom-0 left-0 right-0 bg-slate-950/95 border-t border-slate-900 p-4 flex gap-3 backdrop-blur-sm z-20">
            <Button
              type="button"
              disabled={isPending}
              onClick={() => {
                const btn = document.getElementById("form-submit-trigger");
                if (btn) btn.click();
              }}
              variant="outline"
              className="flex-1 border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-900 font-semibold gap-1.5 h-11 rounded-lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar borrador
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={onPublish}
              disabled={isPending}
              className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white hover:from-violet-500 hover:to-indigo-500 gap-1.5 shadow-lg shadow-violet-500/20 h-11 rounded-lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  Publicar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE MOBILE PREVIEW (65% on Desktop) */}
        <div
          className={cn(
            "w-full lg:w-[65%] bg-[#05070f] overflow-y-auto flex items-center justify-center p-6 lg:p-12 h-[calc(100vh-4rem)] border-t lg:border-t-0 border-slate-900 relative",
            activeTab === "preview" ? "flex" : "hidden lg:flex"
          )}
        >
          {/* Floating Mock Simulator Indicator */}
          <div className="absolute top-4 left-6 flex items-center gap-1.5 text-xs text-slate-500 z-10">
            <Smartphone className="h-4 w-4" />
            <span>Vista Previa de la Invitación</span>
          </div>

          {/* Device Frame Mock */}
          <div className="w-full max-w-[360px] h-[720px] border-[8px] border-slate-900 rounded-[36px] overflow-hidden shadow-[20px_20px_60px_rgba(0,0,0,0.6)] relative bg-[#0b0f19] flex flex-col ring-1 ring-slate-800/40 [&_.min-h-screen]:min-h-full [&_.min-h-screen]:h-auto [&_.min-h-screen]:shadow-none [&_.min-h-screen]:border-0 shrink-0">
            {/* Top Notch simulator */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-slate-900 rounded-b-2xl z-40 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-950/40 mr-4" />
              <div className="h-1 w-8 rounded-full bg-slate-950/40" />
            </div>

            {/* TemplateWrapper inside Device */}
            <div className="h-full w-full overflow-y-auto flex flex-col pt-5">
              <PreviewErrorBoundary>
                <TemplateWrapper data={currentPreviewData}>
                  <TemplateComponent data={currentPreviewData} />
                </TemplateWrapper>
              </PreviewErrorBoundary>
            </div>
          </div>
        </div>

      </div>
    );

  } catch (err) {
    console.error("EditorClient rendering error:", err);
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full border border-slate-900 bg-slate-900/40 p-6 rounded-2xl shadow-xl text-center space-y-4">
          <h2 className="text-lg font-bold text-rose-500">Ocurrió un error en el editor</h2>
          <p className="text-sm text-slate-400">Hubo un problema al cargar o procesar los datos de la invitación.</p>
          <pre className="text-[10px] text-slate-500 bg-black/40 p-3 rounded-lg overflow-x-auto text-left max-h-40 font-mono">
            {err instanceof Error ? err.stack || err.message : String(err)}
          </pre>
          <Button onClick={() => window.location.reload()} className="bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg">
            Recargar Página
          </Button>
        </div>
      </div>
    );
  }
}

