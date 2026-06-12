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
  ExternalLink,
  Smartphone,
  Trash2,
  Info,
  Image as ImageIcon,
  Palette,
  CheckCircle,
  MapPin,
  AlertCircle,
  ChevronDown,
  Plus,
  Minus,
  Gift,
  BookOpen,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";
import { Pedido, Cliente, Prisma } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTemplateConfig, TEMPLATE_COMPONENTS } from "@/lib/templates";
import { TemplateWrapper } from "@/components/templates/TemplateWrapper";
import { TemplateType, InvitacionData } from "@/types";
import { useToast } from "@/components/ui/toast";
import { MultiImageUploader } from "@/components/ui/multi-image-uploader";
import { hexColorRegex, urlValidation } from "./schemas";
import {
  savePedidoDatosAction,
  publicarInvitacionAction,
  generarQRAction,
  uploadImageAction
} from "./actions";

const preprocessNumber = (val: unknown) => {
  if (val === "" || val === null || val === undefined) return undefined;
  const num = Number(val);
  return Number.isNaN(num) ? undefined : num;
};

// Form Schema generator for Drafts (all fields optional, formats validated)
const getDraftFormSchema = () => {
  return z.object({
    nombres: z.string().optional().nullable().or(z.literal("")),
    nombre: z.string().optional().nullable().or(z.literal("")),
    edad: z.preprocess(preprocessNumber, z.number().optional()),
    fechaPart: z.string().optional().nullable().or(z.literal("")),
    horaPart: z.string().optional().nullable().or(z.literal("")),
    lugar: z.string().optional().nullable().or(z.literal("")),
    direccion: z.string().optional().nullable().or(z.literal("")),
    mapaUrl: urlValidation,
    mapsLink: urlValidation,
    mensaje: z.string().optional().nullable().or(z.literal("")),
    colorPrimario: z.string().optional().nullable().or(z.literal(""))
      .refine((val) => !val || hexColorRegex.test(val), {
        message: "Debe ser un color hexadecimal válido (ej. #FFFFFF)",
      }),
    colorSecundario: z.string().optional().nullable().or(z.literal(""))
      .refine((val) => !val || hexColorRegex.test(val), {
        message: "Debe ser un color hexadecimal válido (ej. #FFFFFF)",
      }),
    colorPrincipal: z.string().optional().nullable().or(z.literal(""))
      .refine((val) => !val || hexColorRegex.test(val), {
        message: "Debe ser un color hexadecimal válido (ej. #FFFFFF)",
      }),
    portadaUrl: urlValidation,
    fotoPortada: urlValidation,
    dressCode: z.string().optional().nullable().or(z.literal("")),
    dressCodeDesc: z.string().optional().nullable().or(z.literal("")),
    mensajeFestejo: z.string().optional().nullable().or(z.literal("")),
    itinerario: z.string().optional().nullable().or(z.literal("")),
    datosRegalo: z.string().optional().nullable().or(z.literal("")),
    regalosDatos: z.string().optional().nullable().or(z.literal("")),
    musicaUrl: urlValidation,
    musica: z.string().optional().nullable().or(z.literal("")),
    whatsapp: z.string().optional().nullable().or(z.literal("")),
    mesaRegalos: z.boolean().optional().nullable().or(z.literal(false)),
    mesaRegalosDatos: z.string().optional().nullable().or(z.literal("")),
    historiaEdad: z.string().optional().nullable().or(z.literal("")),
    historiaSeresQueridos: z.string().optional().nullable().or(z.literal("")),
    historiaRecuerdo: z.string().optional().nullable().or(z.literal("")),
    buzonDeseos: z.boolean().optional().nullable().or(z.literal(false)),
    pases: z.boolean().optional().nullable().or(z.literal(false)),
    numPases: z.preprocess(preprocessNumber, z.number().optional()),
    tematica: z.string().optional().nullable().or(z.literal("")),
    videoURL: urlValidation,
    colorAcento: z.string().optional().nullable().or(z.literal("")),
    padrinos: z.string().optional().nullable().or(z.literal("")),
    padres: z.string().optional().nullable().or(z.literal("")),
    nombreBebe: z.string().optional().nullable().or(z.literal("")),
    fechaLimiteRSVP: z.string().optional().nullable().or(z.literal("")),
    mensajeAgradecimiento: z.string().optional().nullable().or(z.literal("")),
    confettiAnimacion: z.boolean().optional().nullable().or(z.literal(false)),
    cuentaRegresiva: z.boolean().optional().nullable().or(z.literal(false)),
    tipoCelebracion: z.string().optional().nullable().or(z.literal("")),
    tipoBebe: z.string().optional().nullable().or(z.literal("")),
    nombreMama: z.string().optional().nullable().or(z.literal("")),
    nombrePapa: z.string().optional().nullable().or(z.literal("")),
    listaRegalos: z.string().optional().nullable().or(z.literal("")),
    juegos: z.string().optional().nullable().or(z.literal("")),
    historiaEmbarazo: z.string().optional().nullable().or(z.literal("")),
    historiaVivencia: z.string().optional().nullable().or(z.literal("")),
    historiaSignificado: z.string().optional().nullable().or(z.literal("")),
    historiaConocieron: z.string().optional().nullable().or(z.literal("")),
    historiaPropuesta: z.string().optional().nullable().or(z.literal("")),
    historiaPadres: z.string().optional().nullable().or(z.literal("")),
    historiaAmigos: z.string().optional().nullable().or(z.literal("")),
    chambelanes: z.string().optional().nullable().or(z.literal("")),
  });
};

// Form Schema generator for Publications (required fields enforced dynamically from config)
const getPublishFormSchema = (templateType: TemplateType) => {
  const templateConfig = getTemplateConfig(templateType);
  const base: Record<string, z.ZodTypeAny> = {
    fechaPart: z.string().min(1, "La fecha del evento es requerida"),
    horaPart: z.string().min(1, "La hora del evento es requerida"),
  };

  for (const field of templateConfig.fields) {
    if (field.required) {
      if (field.key === "fecha" || field.key === "hora") {
        continue;
      }
      if (field.type === "gallery") {
        base[field.key] = z.array(z.string()).min(1, `El campo "${field.label}" es requerido`);
      } else if (field.type === "image" || field.key.includes("Portada")) {
        base[field.key] = urlValidation.refine(val => !!val, { message: `El campo "${field.label}" es requerido` });
      } else if (field.key === "edad" || field.key === "numPases") {
        base[field.key] = z.preprocess(preprocessNumber, z.number({ required_error: `El campo "${field.label}" es requerido` }));
      } else {
        base[field.key] = z.string().min(1, `El campo "${field.label}" es requerido`);
      }
    } else {
      if (field.type === "gallery") {
        base[field.key] = z.array(z.string()).optional();
      } else if (field.type === "image" || field.key.includes("Url") || field.key.includes("Link") || field.key.includes("video")) {
        base[field.key] = urlValidation;
      } else if (field.key === "edad" || field.key === "numPases") {
        base[field.key] = z.preprocess(preprocessNumber, z.number().optional());
      } else if (field.type === "boolean") {
        base[field.key] = z.boolean().optional();
      } else {
        base[field.key] = z.string().optional().nullable().or(z.literal(""));
      }
    }
  }

  return z.object(base);
};

type EditorFormValues = {
  nombres?: string;
  nombre?: string;
  edad?: number | string;
  fechaPart: string;
  horaPart: string;
  ubicacion?: string;
  lugar?: string;
  direccion?: string;
  mapaUrl?: string | null;
  mapsLink?: string | null;
  mensaje?: string | null;
  colorPrimario?: string | null;
  colorSecundario?: string | null;
  colorPrincipal?: string | null;
  portadaUrl?: string | null;
  fotoPortada?: string | null;
  dressCode?: string | null;
  dressCodeDesc?: string | null;
  mensajeFestejo?: string | null;
  itinerario?: string | null;
  datosRegalo?: string | null;
  regalosDatos?: string | null;
  musicaUrl?: string | null;
  musica?: string | null;
  whatsapp?: string | null;
  mesaRegalos?: boolean;
  mesaRegalosDatos?: string | null;
  historiaEdad?: string | null;
  historiaSeresQueridos?: string | null;
  historiaRecuerdo?: string | null;
  fotosExtra?: string[];
  fotosGaleria?: string[];
  buzonDeseos?: boolean;
  pases?: boolean;
  numPases?: number | string;
  tematica?: string | null;
  videoURL?: string | null;
  colorAcento?: string | null;
  padrinos?: string | null;
  padres?: string | null;
  nombreBebe?: string | null;
  fechaLimiteRSVP?: string | null;
  mensajeAgradecimiento?: string | null;
  confettiAnimacion?: boolean;
  cuentaRegresiva?: boolean;
  tipoCelebracion?: string | null;
  tipoBebe?: string | null;
  nombreMama?: string | null;
  nombrePapa?: string | null;
  listaRegalos?: string | null;
  juegos?: string | null;
  historiaEmbarazo?: string | null;
  historiaVivencia?: string | null;
  historiaSignificado?: string | null;
  historiaConocieron?: string | null;
  historiaPropuesta?: string | null;
  historiaPadres?: string | null;
  historiaAmigos?: string | null;
  chambelanes?: string | null;
};

type PedidoWithCliente = Pedido & { cliente: Cliente };

interface EditorClientProps {
  pedido: PedidoWithCliente;
  initialIsLoading?: boolean;
}

function cleanFormValues(data: EditorFormValues): InvitacionData {
  const clean: Record<string, unknown> = {};
  const safeData = data || {};

  (Object.keys(safeData) as Array<keyof EditorFormValues>).forEach((key) => {
    if (key !== "fechaPart" && key !== "horaPart" && (key as string) !== "fecha") {
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

function getSafeTemplateData(data: Partial<InvitacionData> | null | undefined): InvitacionData {
  const safe = data || {};
  
  const defaultPrimary = "#f59e0b";
  const defaultSecondary = "#1f2937";

  return {
    nombres: safe.nombres || "",
    nombre: safe.nombre || "",
    edad: safe.edad || 0,
    fecha: safe.fecha || new Date().toISOString(),
    ubicacion: safe.ubicacion || "",
    lugar: safe.lugar || "",
    direccion: safe.direccion || "",
    mapaUrl: safe.mapaUrl || "",
    mapsLink: safe.mapsLink || "",
    mensaje: safe.mensaje || "",
    colorPrimario: safe.colorPrimario || defaultPrimary,
    colorSecundario: safe.colorSecundario || defaultSecondary,
    colorPrincipal: safe.colorPrimario || safe.colorPrincipal || defaultPrimary,
    portadaUrl: safe.portadaUrl || "",
    fotoPortada: safe.fotoPortada || "",
    fotos: safe.fotos || [],
    fotosGaleria: safe.fotosGaleria || [],
    dressCode: safe.dressCode || "",
    dressCodeDesc: safe.dressCodeDesc || "",
    mensajeFestejo: safe.mensajeFestejo || "",
    itinerario: safe.itinerario || "",
    datosRegalo: safe.datosRegalo || "",
    regalosDatos: safe.regalosDatos || "",
    musicaUrl: safe.musicaUrl || "",
    musica: safe.musica || "",
    whatsapp: safe.whatsapp || "",
    mesaRegalos: safe.mesaRegalos || false,
    mesaRegalosDatos: safe.mesaRegalosDatos || "",
    historiaEdad: safe.historiaEdad || "",
    historiaSeresQueridos: safe.historiaSeresQueridos || "",
    historiaRecuerdo: safe.historiaRecuerdo || "",
    fotosExtra: safe.fotosExtra || [],
    buzonDeseos: safe.buzonDeseos || false,
    pases: safe.pases || false,
    numPases: safe.numPases || 2,
    tematica: safe.tematica || "",
    videoURL: safe.videoURL || "",
    colorAcento: safe.colorAcento || "",
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

function formatRelativeTime(date: Date): string {
  const diffMs = new Date().getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 5) return "hace unos segundos";
  if (diffSecs < 60) return `hace ${diffSecs} segundos`;
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `hace ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`;
  return `a las ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

interface AutoSaveIndicatorProps {
  status: "saving" | "saved" | "unsaved";
  lastSaved?: Date;
}

function AutoSaveIndicator({ status, lastSaved }: AutoSaveIndicatorProps) {
  const [formattedTime, setFormattedTime] = useState("");

  React.useEffect(() => {
    if (!lastSaved) {
      setFormattedTime("");
      return;
    }
    const updateTime = () => {
      setFormattedTime(formatRelativeTime(lastSaved));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000); // update every 10 seconds
    return () => clearInterval(interval);
  }, [lastSaved]);

  return (
    <div className="flex items-center gap-2 text-xs font-medium" data-testid="autosave-status">
      {status === "saving" && (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
          <span className="text-slate-400 font-semibold">💾 Guardando...</span>
        </>
      )}
      {status === "saved" && (
        <>
          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
          <span className="text-slate-400 font-semibold">
            ✓ Guardado {formattedTime ? `${formattedTime}` : ""}
          </span>
        </>
      )}
      {status === "unsaved" && (
        <>
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-amber-500 font-semibold">● Cambios sin guardar</span>
        </>
      )}
    </div>
  );
}

function getFieldTab(field: { key: string; type: string }) {
  const key = field.key;
  const type = field.type;
  if (type === "gallery" || type === "image" || key === "fotoPortada" || key === "portadaUrl" || key === "fotosGaleria" || key === "fotosExtra" || key === "fotos") {
    return "fotos";
  }
  if (type === "color" || key.includes("color") || key.includes("Color") || key === "tematica" || key === "confettiAnimacion" || key === "cuentaRegresiva") {
    return "diseno";
  }
  if (key === "whatsapp" || key === "fechaLimiteRSVP" || key === "mensajeAgradecimiento" || key === "buzonDeseos" || key === "pases" || key === "numPases") {
    return "rsvp";
  }
  return "info";
}

function getAccordionGroup(field: { key: string }) {
  const key = field.key;
  if (key === "nombre" || key === "nombres" || key === "edad" || key === "tipoCelebracion" || key === "mensaje" || key === "nombreBebe" || key === "padres" || key === "padrinos" || key === "chambelanes") {
    return "basico";
  }
  if (key === "fecha" || key === "hora" || key === "lugar" || key === "direccion" || key === "mapsLink" || key === "mapaUrl") {
    return "fecha";
  }
  if (key === "itinerario" || key === "datosRegalo" || key === "mesaRegalos" || key === "mesaRegalosDatos" || key === "regalosDatos") {
    return "regalos";
  }
  if (key === "historiaEdad" || key === "historiaSeresQueridos" || key === "historiaRecuerdo" || key.startsWith("historia")) {
    return "historia";
  }
  return "otros";
}

export function EditorClient({ pedido: initialPedido, initialIsLoading }: EditorClientProps) {
  const { toast } = useToast();
  const [pedido, setPedido] = useState<PedidoWithCliente>(() => {
    const p = { ...initialPedido };
    if (!p.datosInvitacion) {
      p.datosInvitacion = {} as unknown as Prisma.JsonValue;
    }
    return p;
  });
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [currentFormTab, setCurrentFormTab] = useState<"info" | "fotos" | "diseno" | "rsvp">("info");
  const [openAccordion, setOpenAccordion] = useState<Record<string, boolean>>({
    basico: true,
    fecha: true,
    regalos: false,
    historia: false,
    otros: false
  });

  // Action states
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  // Phase 3 states: Auto-save, Viewport, Loaders
  const [isDirty, setIsDirty] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(() =>
    initialIsLoading !== undefined
      ? initialIsLoading
      : typeof process !== "undefined" && process.env?.NODE_ENV === "test"
      ? false
      : true
  );
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");

  const templateType = pedido.template as TemplateType;
  const config = getTemplateConfig(templateType);
  const TemplateComponent = TEMPLATE_COMPONENTS[templateType];

  // Default values from db JSON or order columns fallback
  const dbDatos = useMemo(() => (pedido.datosInvitacion as unknown as InvitacionData) || {}, [pedido.datosInvitacion]);

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
    // Campos comunes / boda / xv / babyshower / cumpleanos
    nombres: dbDatos.nombres || "",
    nombre: dbDatos.nombre || pedido.cliente?.nombre || "",
    edad: dbDatos.edad || "",
    fechaPart: initialDateParts.fechaPart,
    horaPart: initialDateParts.horaPart,
    ubicacion: dbDatos.ubicacion || "",
    lugar: dbDatos.lugar || pedido.notas || "",
    direccion: dbDatos.direccion || "",
    mapaUrl: dbDatos.mapaUrl || "",
    mapsLink: dbDatos.mapsLink || "",
    mensaje: dbDatos.mensaje || "",
    colorPrimario: dbDatos.colorPrimario || "#f59e0b",
    colorSecundario: dbDatos.colorSecundario || "#1f2937",
    colorPrincipal: dbDatos.colorPrincipal || "#f59e0b",
    portadaUrl: dbDatos.portadaUrl || "",
    fotoPortada: dbDatos.fotoPortada || "",
    dressCode: dbDatos.dressCode || "",
    dressCodeDesc: dbDatos.dressCodeDesc || "",
    mensajeFestejo: dbDatos.mensajeFestejo || "",
    itinerario: dbDatos.itinerario || "",
    datosRegalo: dbDatos.datosRegalo || "",
    regalosDatos: dbDatos.regalosDatos || "",
    musicaUrl: dbDatos.musicaUrl || "",
    musica: dbDatos.musica || "",
    whatsapp: dbDatos.whatsapp || "",
    mesaRegalos: dbDatos.mesaRegalos || false,
    mesaRegalosDatos: dbDatos.mesaRegalosDatos || "",
    historiaEdad: dbDatos.historiaEdad || "",
    historiaSeresQueridos: dbDatos.historiaSeresQueridos || "",
    historiaRecuerdo: dbDatos.historiaRecuerdo || "",
    fotosExtra: dbDatos.fotosExtra || [],
    fotosGaleria: dbDatos.fotosGaleria || dbDatos.fotos || [],
    buzonDeseos: dbDatos.buzonDeseos !== undefined ? dbDatos.buzonDeseos : false,
    pases: dbDatos.pases !== undefined ? dbDatos.pases : false,
    numPases: dbDatos.numPases || 2,
    tematica: dbDatos.tematica || "",
    videoURL: dbDatos.videoURL || "",
    colorAcento: dbDatos.colorAcento || "",
    padrinos: dbDatos.padrinos || "",
    padres: dbDatos.padres || "",
    nombreBebe: dbDatos.nombreBebe || "",
    fechaLimiteRSVP: dbDatos.fechaLimiteRSVP || "",
    mensajeAgradecimiento: dbDatos.mensajeAgradecimiento || "",
    confettiAnimacion: dbDatos.confettiAnimacion !== undefined ? dbDatos.confettiAnimacion : true,
    cuentaRegresiva: dbDatos.cuentaRegresiva !== undefined ? dbDatos.cuentaRegresiva : true,
    tipoCelebracion: dbDatos.tipoCelebracion || "",
    tipoBebe: dbDatos.tipoBebe || "",
    nombreMama: dbDatos.nombreMama || "",
    nombrePapa: dbDatos.nombrePapa || "",
    listaRegalos: dbDatos.listaRegalos || "",
    juegos: dbDatos.juegos || "",
    historiaEmbarazo: dbDatos.historiaEmbarazo || "",
    historiaVivencia: dbDatos.historiaVivencia || "",
    historiaSignificado: dbDatos.historiaSignificado || "",
    historiaConocieron: dbDatos.historiaConocieron || "",
    historiaPropuesta: dbDatos.historiaPropuesta || "",
    historiaPadres: dbDatos.historiaPadres || "",
    historiaAmigos: dbDatos.historiaAmigos || "",
    chambelanes: dbDatos.chambelanes || "",
  }), [dbDatos, pedido, initialDateParts]);

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

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const subscription = watch(() => {
      setIsDirty(true);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  React.useEffect(() => {
    if (isDirty && !isAutoSaving && !isPending) {
      autoSaveTimerRef.current = setTimeout(() => {
        const handleAutoSave = async () => {
          setIsAutoSaving(true);
          try {
            const values = getValues();
            const mappedData = cleanFormValues(values);
            const res = await savePedidoDatosAction(pedido.id, mappedData);
            if (res.success && res.data) {
              setPedido(prev => ({ ...prev, datosInvitacion: res.data as unknown as Prisma.JsonValue }));
              setIsDirty(false);
              setLastSaved(new Date());
              toast({
                title: "Auto-guardado",
                description: "Borrador guardado automáticamente.",
                type: "success",
              });
            }
          } catch (error) {
            console.error("Error auto-saving draft", error);
          } finally {
            setIsAutoSaving(false);
          }
        };
        handleAutoSave();
      }, 30000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [isDirty, isAutoSaving, isPending, watchedData, pedido.id, getValues, toast]);
  const currentPreviewData = useMemo(() => {
    const cleaned = cleanFormValues(watchedData);
    return getSafeTemplateData(cleaned);
  }, [watchedData]);

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
        setPedido(prev => ({ ...prev, datosInvitacion: res.data as unknown as Prisma.JsonValue }));
        setIsDirty(false);
        setLastSaved(new Date());
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
          datosInvitacion: saveRes.data as unknown as Prisma.JsonValue
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

  const incrementEdad = () => {
    const current = Number(getValues("edad")) || 0;
    setValue("edad", current + 1, { shouldDirty: true, shouldValidate: true });
  };

  const decrementEdad = () => {
    const current = Number(getValues("edad")) || 0;
    if (current > 0) {
      setValue("edad", current - 1, { shouldDirty: true, shouldValidate: true });
    }
  };

  const PRESET_COLORS = [
    { name: "Naranja Cálido", value: "#F97316" },
    { name: "Ámbar", value: "#f59e0b" },
    { name: "Esmeralda", value: "#10b981" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Rosa", value: "#ec4899" },
    { name: "Rojo", value: "#ef4444" },
    { name: "Violeta", value: "#8b5cf6" },
    { name: "Cian", value: "#06b6d4" },
    { name: "Oscuro", value: "#1f2937" },
  ];

  const renderField = (field: typeof config.fields[0]) => {
    const registerKey = field.key as keyof EditorFormValues;

    if (field.key === "hora") {
      return null;
    }

    if (field.condicion) {
      const conditionValue = watchedData[field.condicion as keyof EditorFormValues];
      if (!conditionValue) {
        return null;
      }
    }

    return (
      <div key={field.key} className="space-y-2">
        <label className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center justify-between">
          <span>
            {field.label} {field.required && <span className="text-rose-500">*</span>}
          </span>
        </label>

        {field.key === "edad" ? (
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white h-10 w-10 p-0 flex items-center justify-center rounded-lg"
              onClick={decrementEdad}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              placeholder={field.placeholder}
              className={cn(
                "border bg-slate-950 text-center text-lg font-bold focus-visible:ring-orange-500 text-slate-100 placeholder:text-slate-700 h-10 w-24 rounded-lg",
                errors.edad ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-800"
              )}
              {...register("edad", { valueAsNumber: true })}
            />
            <Button
              type="button"
              variant="outline"
              className="border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white h-10 w-10 p-0 flex items-center justify-center rounded-lg"
              onClick={incrementEdad}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="text-xs text-slate-500 uppercase tracking-wider">años</span>
          </div>
        ) : field.type === "text" ? (
          <Input
            type="text"
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            className={cn(
              "border bg-slate-950 text-sm focus-visible:ring-orange-500 text-slate-100 placeholder:text-slate-700 h-10 rounded-lg",
              errors[registerKey] ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-800"
            )}
            {...register(registerKey)}
          />
        ) : field.type === "time" ? (
          <Input
            type="time"
            className={cn(
              "border bg-slate-950 text-sm focus-visible:ring-orange-500 text-slate-100 h-10 rounded-lg",
              errors[registerKey] ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-800"
            )}
            {...register(registerKey)}
          />
        ) : field.type === "number" ? (
          <Input
            type="number"
            placeholder={field.placeholder}
            className={cn(
              "border bg-slate-950 text-sm focus-visible:ring-orange-500 text-slate-100 placeholder:text-slate-700 h-10 rounded-lg",
              errors[registerKey] ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-800"
            )}
            {...register(registerKey, { valueAsNumber: true })}
          />
        ) : field.type === "tel" ? (
          <Input
            type="tel"
            placeholder={field.placeholder}
            className={cn(
              "border bg-slate-950 text-sm focus-visible:ring-orange-500 text-slate-100 placeholder:text-slate-700 h-10 rounded-lg",
              errors[registerKey] ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-800"
            )}
            {...register(registerKey)}
          />
        ) : field.type === "url" ? (
          <Input
            type="url"
            placeholder={field.placeholder}
            className={cn(
              "border bg-slate-950 text-sm focus-visible:ring-orange-500 text-slate-100 placeholder:text-slate-700 h-10 rounded-lg",
              errors[registerKey] ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-800"
            )}
            {...register(registerKey)}
          />
        ) : field.type === "select" ? (
          <select
            className={cn(
              "flex h-10 w-full rounded-md border bg-slate-950 text-slate-100 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
              errors[registerKey] ? "border-rose-500" : "border-slate-800"
            )}
            {...register(registerKey)}
          >
            <option value="">Selecciona una opción...</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : field.type === "boolean" ? (
          <div className="flex items-center gap-2 p-1">
            <input
              type="checkbox"
              id={field.key}
              className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-orange-600 focus:ring-orange-500 focus:ring-offset-slate-900"
              {...register(registerKey)}
            />
            <label htmlFor={field.key} className="text-sm text-slate-300 select-none cursor-pointer">
              Activar sección / campo
            </label>
          </div>
        ) : field.key === "fecha" ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                type="date"
                className={cn(
                  "border bg-slate-950 text-sm focus-visible:ring-orange-500 text-slate-100 h-10 rounded-lg",
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
                  "border bg-slate-950 text-sm focus-visible:ring-orange-500 text-slate-100 h-10 rounded-lg",
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
              "border bg-slate-950 text-sm focus-visible:ring-orange-500 text-slate-100 h-10 rounded-lg",
              errors[registerKey] ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-800"
            )}
            {...register(registerKey)}
          />
        ) : field.type === "color" ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 mb-1">
              {PRESET_COLORS.map((color) => {
                const isSelected = watchedData[registerKey] === color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setValue(registerKey, color.value, { shouldDirty: true, shouldValidate: true })}
                    className={cn(
                      "w-7 h-7 rounded-full border transition-all relative shrink-0",
                      isSelected
                        ? "border-white scale-110 ring-2 ring-orange-500 ring-offset-2 ring-offset-[#0e0f14]"
                        : "border-slate-800/80 hover:scale-105 active:scale-95"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-[8px] font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className={cn(
              "flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border w-full hover:border-slate-700 transition-colors",
              errors[registerKey] ? "border-rose-500" : "border-slate-800"
            )}>
              <div 
                className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-800 shrink-0 shadow-md transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: (watchedData[registerKey] as string) || "#000000" }}
              >
                <input
                  type="color"
                  value={(watchedData[registerKey] as string) || "#000000"}
                  onChange={(e) => setValue(registerKey, e.target.value, { shouldDirty: true, shouldValidate: true })}
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
          </div>
        ) : field.type === "textarea" ? (
          <textarea
            placeholder={field.placeholder}
            rows={3}
            className={cn(
              "w-full rounded-lg border bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all font-sans",
              errors[registerKey] ? "border-rose-500" : "border-slate-800"
            )}
            {...register(registerKey)}
          />
        ) : field.type === "gallery" ? (
          <MultiImageUploader
            value={(watchedData[registerKey] as string[]) || []}
            onChange={(urls) => setValue(registerKey, urls, { shouldDirty: true, shouldValidate: true })}
            maxImages={field.maxItems || (config.id.includes("premium") ? 6 : 3)}
          />
        ) : field.type === "image" ? (
          <div className="space-y-3">
            {watchedData[registerKey] ? (
              <div className="relative rounded-xl border border-slate-800 overflow-hidden bg-slate-950 group">
                <img
                  src={watchedData[registerKey] as string}
                  alt="Subida de foto"
                  className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setValue(registerKey, "", { shouldDirty: true, shouldValidate: true })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
                  </button>
                  <label
                    htmlFor={`file-upload-${field.key}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
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
                className="border-2 border-dashed border-slate-800 hover:border-orange-500/50 hover:bg-orange-600/5 rounded-xl p-6 transition-all text-center flex flex-col items-center justify-center cursor-pointer group relative"
              >
                <input
                  type="file"
                  id={`file-upload-${field.key}`}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  disabled={uploadingField !== null}
                  onChange={(e) => handleImageUpload(e, registerKey)}
                />
                <div className="p-3 bg-slate-900 rounded-full border border-slate-800 group-hover:border-orange-500/30 group-hover:bg-orange-600/10 transition-colors mb-2">
                  {uploadingField === registerKey ? (
                    <Loader2 className="h-6 w-6 animate-spin text-orange-400" />
                  ) : (
                    <Upload className="h-6 w-6 text-slate-400 group-hover:text-orange-400 transition-colors" />
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
                  "bg-slate-950 text-xs focus-visible:ring-orange-500 flex-1 h-9 rounded-lg border",
                  errors[registerKey] ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-800"
                )}
                {...register(registerKey)}
              />
            </div>
          </div>
        ) : null}

        {field.key !== "fecha" && errors[registerKey] && (
          <p className="text-xs font-semibold text-rose-500 mt-1">
            {errors[registerKey]?.message}
          </p>
        )}
      </div>
    );
  };

  const infoFields = config.fields.filter(f => getFieldTab(f) === "info");
  const fotosFields = config.fields.filter(f => getFieldTab(f) === "fotos");
  const disenoFields = config.fields.filter(f => getFieldTab(f) === "diseno");
  const rsvpFields = config.fields.filter(f => getFieldTab(f) === "rsvp");

  const accordionGroups = [
    { id: "basico", title: "👤 Datos básicos", icon: Info },
    { id: "fecha", title: "📍 Fecha y lugar", icon: MapPin },
    { id: "regalos", title: "🎁 Regalos e Itinerario", icon: Gift },
    { id: "historia", title: "📖 Historia del festejado", icon: BookOpen },
    { id: "otros", title: "⚙️ Otros detalles", icon: Settings }
  ] as const;

  try {
    return (
      <div className="lg:h-[calc(100vh-11.5rem)] lg:min-h-[650px] flex flex-col w-full bg-[#0a0b0d] text-slate-100 lg:border lg:border-slate-900 lg:rounded-2xl overflow-hidden shadow-2xl relative">
        
        {/* HEADER DEL EDITOR (Sticky top-0 z-40) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 bg-[#111217] border-b border-slate-900 gap-3 z-30 shrink-0">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-2xs sm:text-xs text-slate-400">
              <Link href={`/admin/pedidos`} className="hover:text-orange-500 transition-colors">
                Pedidos
              </Link>
              <span>/</span>
              <Link href={`/admin/pedidos/${pedido.id}`} className="font-mono hover:text-orange-500 transition-colors truncate max-w-[80px] sm:max-w-none">
                #{pedido.id}
              </Link>
              <span>/</span>
              <span className="text-slate-300">Editar</span>
              <span className="ml-1 inline-flex items-center rounded-full bg-slate-950 px-2 py-0.5 text-[9px] sm:text-2xs font-semibold ring-1 ring-slate-800 text-orange-400 shrink-0">
                {config.name}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">Editar Invitación</h2>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <AutoSaveIndicator status={isAutoSaving ? "saving" : (isDirty ? "unsaved" : "saved")} lastSaved={lastSaved || undefined} />
            <Link href={`/admin/pedidos/${pedido.id}`}>
              <Button type="button" variant="outline" className="border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 text-[10px] sm:text-xs py-1 sm:py-1.5 px-2.5 sm:px-3 h-8">
                Descartar cambios
              </Button>
            </Link>
            <Button
              type="submit"
              form="editor-form"
              disabled={isPending}
              className="bg-orange-600 hover:bg-orange-500 text-white text-[10px] sm:text-xs font-semibold h-8 py-1 sm:py-1.5 px-3 sm:px-4 rounded-lg flex items-center gap-1.5 shadow-lg shadow-orange-600/10"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Guardar
            </Button>
          </div>
        </div>

        {actionError && (
          <div className="bg-rose-950/30 border-b border-rose-900/50 px-6 py-2.5 text-xs text-rose-400 font-medium flex items-center gap-2 shrink-0">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{actionError}</span>
          </div>
        )}

        {/* MOBILE TOGGLE HEADER (lg:hidden) */}
        <div className="lg:hidden flex border-b border-slate-900 bg-slate-950 p-2 sticky top-0 z-20 backdrop-blur-md gap-2 w-full shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={cn(
              "flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all border flex items-center justify-center gap-1.5",
              activeTab === "edit"
                ? "bg-orange-600/10 text-orange-400 border-orange-505/30 shadow-md shadow-orange-950/10"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            )}
          >
            ✏️ Editar Formulario
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all border flex items-center justify-center gap-1.5",
              activeTab === "preview"
                ? "bg-orange-600/10 text-orange-400 border-orange-505/30 shadow-md shadow-orange-950/10"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            )}
          >
            👁️ Vista Previa
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL (Split screen o apilado) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

          {/* PANEL IZQUIERDO: FORMULARIO (40% de ancho en Desktop) */}
          <div className={cn(
            "w-full lg:w-[40%] flex flex-col h-full bg-[#0e0f14] lg:border-r lg:border-slate-900 relative overflow-hidden",
            activeTab === "edit" ? "flex" : "hidden lg:flex"
          )}>
            
            {/* Tabs de navegación horizontales */}
            <div className="bg-[#121318] border-b border-slate-900 px-4 py-2 shrink-0">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {(["info", "fotos", "diseno", "rsvp"] as const).map((tab) => {
                  const isActive = currentFormTab === tab;
                  const labels = {
                    info: "Información",
                    fotos: "Fotos",
                    diseno: "Diseño",
                    rsvp: "RSVP"
                  };
                  const Icons = {
                    info: Info,
                    fotos: ImageIcon,
                    diseno: Palette,
                    rsvp: CheckCircle
                  };
                  const Icon = Icons[tab];
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setCurrentFormTab(tab)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-2xs sm:text-xs font-semibold rounded-lg transition-all relative shrink-0",
                        isActive 
                          ? "text-orange-500 bg-orange-500/5 font-bold" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {labels[tab]}
                      {isActive && (
                        <motion.div
                          layoutId="activeFormTabLine"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-6">
              {isLoading ? (
                <div className="space-y-4 p-4" data-testid="editor-skeleton">
                  <div className="h-8 w-3/4 bg-slate-900 animate-pulse rounded" />
                  <div className="h-10 w-full bg-slate-900 animate-pulse rounded" />
                  <div className="h-10 w-full bg-slate-900 animate-pulse rounded" />
                  <div className="h-32 w-full bg-slate-900 animate-pulse rounded" />
                  <div className="h-10 w-2/3 bg-slate-900 animate-pulse rounded" />
                </div>
              ) : (
                <form id="editor-form" onSubmit={handleSubmit(onSave)} className="space-y-6">
                  {/* Tab 1: Info */}
                  <div className={cn("space-y-5", currentFormTab === "info" ? "block" : "hidden")}>
                    <div className="space-y-4">
                      {accordionGroups.map((group) => {
                        const groupFields = infoFields.filter(f => getAccordionGroup(f) === group.id);
                        if (groupFields.length === 0) return null;
                        const isOpen = !!openAccordion[group.id];
                        return (
                          <div key={group.id} className="border border-slate-900 rounded-xl bg-[#111217]/40 overflow-hidden transition-all duration-200">
                            <button
                              type="button"
                              onClick={() => setOpenAccordion(prev => ({ ...prev, [group.id]: !prev[group.id] }))}
                              className="w-full px-4 py-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-[#121318]/90 hover:bg-[#16171e] transition-colors border-b border-slate-900/40"
                            >
                              <div className="flex items-center gap-2">
                                <group.icon className="h-4 w-4 text-orange-500" />
                                <span>{group.title}</span>
                              </div>
                              <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform duration-200", isOpen ? "transform rotate-180" : "")} />
                            </button>

                            <div className={cn("p-4 space-y-4 border-t border-slate-900/60 bg-[#0e0f14]/20", isOpen ? "block" : "hidden")}>
                              {groupFields.map(field => renderField(field))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tab 2: Fotos */}
                  <div className={cn("space-y-4", currentFormTab === "fotos" ? "block" : "hidden")}>
                    {fotosFields.map(field => renderField(field))}
                    
                    {/* Info del paquete */}
                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/30 p-4 flex items-start gap-3 text-xs">
                      <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-200">Información del Paquete</p>
                        <p className="text-slate-400">
                          Tu paquete actual es **{pedido.paquete.toUpperCase()}**.
                          {pedido.paquete === "esencial" && (
                            <span>
                              {" "}Permite 1 foto de portada. <Link href={`/admin/pedidos/${pedido.id}`} className="text-orange-500 underline hover:text-orange-400 font-medium">Upgrade a Completa</Link> para galería de 3 fotos.
                            </span>
                          )}
                          {pedido.paquete === "completa" && (
                            <span>
                              {" "}Permite 1 foto de portada y 3 fotos en galería. <Link href={`/admin/pedidos/${pedido.id}`} className="text-orange-500 underline hover:text-orange-400 font-medium">Upgrade a Premium</Link> para galería de 6 fotos.
                            </span>
                          )}
                          {pedido.paquete === "premium" && (
                            <span> Permite 1 foto de portada, galería de 6 fotos y fotos de itinerario/historia.</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tab 3: Diseño */}
                  <div className={cn("space-y-4", currentFormTab === "diseno" ? "block" : "hidden")}>
                    {disenoFields.map(field => renderField(field))}
                  </div>

                  {/* Tab 4: RSVP */}
                  <div className={cn("space-y-4", currentFormTab === "rsvp" ? "block" : "hidden")}>
                    {rsvpFields.map(field => renderField(field))}

                    {/* Enlace y QR section en RSVP tab if published */}
                    {pedido.urlPublica && (
                      <div className="border border-slate-900 rounded-xl bg-[#111217]/40 p-4 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                          <QrCode className="h-4 w-4 text-orange-500" />
                          <span>Código QR y Enlace</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 border-t border-slate-900 pt-3">
                          {pedido.qrUrl ? (
                            <div className="flex items-center gap-3">
                              <div className="h-14 w-14 bg-white p-1 rounded-lg border border-slate-200 shadow-md shrink-0">
                                <img src={pedido.qrUrl} alt="QR Code" className="h-full w-full" />
                              </div>
                              <div>
                                <p className="text-2xs font-bold text-slate-300">Código QR Listo</p>
                                <a href={pedido.qrUrl} download="qr.png" target="_blank" rel="noopener noreferrer" className="text-[10px] text-orange-505 hover:underline">
                                  Ver original
                                </a>
                              </div>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              onClick={onGenerateQR}
                              disabled={qrLoading}
                              className="w-full bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 border border-orange-500/20 text-xs gap-1.5 h-9"
                            >
                              {qrLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <QrCode className="h-3.5 w-3.5" />}
                              Generar Código QR
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* FIXED BUTTON BAR AT THE BOTTOM OF THE FORM */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#0e0f14]/95 border-t border-slate-900 p-4 flex gap-3 backdrop-blur-md z-20">
              <Button
                type="submit"
                form="editor-form"
                disabled={isPending}
                variant="outline"
                className="flex-1 border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-900 font-semibold gap-1.5 h-11 rounded-lg text-xs"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 text-orange-500" />
                    Guardar borrador
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={onPublish}
                disabled={isPending}
                className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 font-bold text-white hover:from-orange-500 hover:to-amber-500 gap-1.5 shadow-lg shadow-orange-500/10 h-11 rounded-lg text-xs"
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

          {/* PANEL DERECHO: PREVIEW (60% de ancho en Desktop) */}
          <div className={cn(
            "w-full lg:w-[60%] flex flex-col h-full bg-[#06070a] relative overflow-hidden",
            activeTab === "preview" ? "flex" : "hidden lg:flex"
          )}>
            
            {/* Viewport Header */}
            <div className="flex items-center justify-between px-6 py-3 bg-[#0d0e12] border-b border-slate-900/80 shrink-0">
              <div className="flex items-center gap-1.5">
                <Smartphone className="h-4 w-4 text-orange-500" />
                <span className="text-2xs sm:text-xs uppercase tracking-wider text-slate-400 font-bold">Vista previa en vivo</span>
              </div>
              
              <div className="flex bg-[#121318] rounded-lg p-1 border border-slate-900" data-testid="viewport-toggle">
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-semibold transition-all",
                    previewMode === "mobile"
                      ? "bg-orange-600 text-white font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  📱  Móvil
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-semibold transition-all",
                    previewMode === "desktop"
                      ? "bg-orange-600 text-white font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  🖥️  Escritorio
                </button>
              </div>
            </div>

            {/* Live Preview Scrollable Area */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-10 overflow-y-auto bg-[#07080c] relative">
              
              {/* Glow effects around device */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-600/5 blur-[80px] rounded-full pointer-events-none" />

              <div className={cn(
                "w-full h-[580px] sm:h-[620px] border-[8px] border-slate-900 rounded-[36px] overflow-hidden shadow-[20px_20px_60px_rgba(0,0,0,0.6)] relative bg-[#0b0f19] flex flex-col ring-1 ring-slate-800/40 [&_.min-h-screen]:min-h-full [&_.min-h-screen]:h-auto [&_.min-h-screen]:shadow-none [&_.min-h-screen]:border-0 shrink-0 transition-all duration-300",
                previewMode === "mobile" ? "max-w-[360px]" : "max-w-[768px]"
              )} data-testid="device-simulator">
                
                {/* Top Notch simulator */}
                {previewMode === "mobile" && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-slate-900 rounded-b-2xl z-40 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-950/40 mr-4" />
                    <div className="h-1 w-8 rounded-full bg-slate-950/40" />
                  </div>
                )}

                {/* Live Template Render */}
                <div className={cn("h-full w-full overflow-y-auto flex flex-col relative", previewMode === "mobile" ? "pt-5" : "pt-0")}>
                  {pedido.estadoInvitacion === "BORRADOR" && (
                    <div className="absolute top-8 right-4 z-50 pointer-events-none" data-testid="watermark-borrador">
                      <div className="bg-amber-500/80 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider rotate-[-5deg] shadow-lg">
                        VISTA PREVIA — BORRADOR
                      </div>
                    </div>
                  )}
                  <PreviewErrorBoundary>
                    <TemplateWrapper data={currentPreviewData}>
                      <motion.div
                        key={JSON.stringify(currentPreviewData)}
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TemplateComponent data={currentPreviewData} />
                      </motion.div>
                    </TemplateWrapper>
                  </PreviewErrorBoundary>
                </div>
              </div>
            </div>

            {/* Preview Bottom Action Bar */}
            <div className="bg-[#0e0f14] border-t border-slate-900 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-semibold ring-1 shadow-inner",
                  pedido.estadoInvitacion === "PUBLICADA"
                    ? "bg-green-500/10 text-green-400 ring-green-500/20"
                    : "bg-slate-900 text-slate-400 ring-slate-800"
                )}>
                  {pedido.estadoInvitacion === "PUBLICADA" ? "✅ Publicada" : "📝 Borrador"}
                </span>
                
                {pedido.estadoInvitacion === "PUBLICADA" && pedido.urlPublica && (
                  <span className="text-2xs text-slate-500 font-mono truncate max-w-[180px] sm:max-w-[280px]">
                    {pedido.urlPublica}
                  </span>
                )}
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                {pedido.urlPublica && (
                  <a href={pedido.urlPublica} target="_blank" rel="noopener noreferrer">
                    <Button type="button" variant="outline" className="border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 text-xs py-1.5 px-3 h-9">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      Abrir en nueva pestaña
                    </Button>
                  </a>
                )}
                <Button
                  type="button"
                  onClick={onPublish}
                  disabled={isPending}
                  className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold h-9 py-1.5 px-4 rounded-lg flex items-center gap-1.5 shadow-lg shadow-orange-600/10"
                >
                  {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
                  Publicar ahora
                </Button>
              </div>
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
          <Button onClick={() => window.location.reload()} className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold rounded-lg">
            Recargar Página
          </Button>
        </div>
      </div>
    );
  }
}

