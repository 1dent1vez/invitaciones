'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm, Resolver, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ArrowLeft,
  FileText,
  User,
  PlusCircle,
  Loader2,
  ExternalLink,
  QrCode,
  Send,
  Copy,
  Check,
  Calendar,
  Phone,
  Mail,
  History,
  Users,
  Plus,
  Download,
  DollarSign,
  Pencil,
  X,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { Pedido, Cliente, Pago, RSVP, Prisma } from '@prisma/client';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { PagoInput } from '@/types';
import { registrarPagoAction, despublicarInvitacionAction } from './actions';
import { updatePedidoEstadoAction } from '../actions';
import { generarQRAction, publicarInvitacionAction } from './editar/actions';

import { generarTextoNotificacion } from '@/lib/notificaciones';
import { RSVPTable } from './rsvp-table';

const getPagoSchema = (balance: number) =>
  z
    .object({
      monto: z.preprocess(
        (val) => Number(val),
        z.number().positive('El monto debe ser un número positivo')
      ),
      metodo: z.enum(['efectivo', 'transferencia'], {
        message: 'Selecciona un método válido',
      }),
      comprobante: z.string().optional().nullable().or(z.literal('')),
      notas: z.string().optional().nullable().or(z.literal('')),
    })
    .refine((data) => data.monto <= balance, {
      message: `El monto no puede exceder el saldo pendiente (${balance} MXN)`,
      path: ['monto'],
    });

// Custom Hooks
function useClipboard() {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  };
  return { copied, copy };
}

function useShare() {
  const share = async (data: ShareData) => {
    try {
      if (navigator.share) {
        await navigator.share(data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };
  return { share, canShare: typeof navigator !== 'undefined' && !!navigator.share };
}

// Custom Formatters
function formatFechaMX(fecha: Date | string): string {
  if (!fecha) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha));
}

function formatFechaCorta(fecha: Date | string): string {
  if (!fecha) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(fecha));
}

function formatCurrencyMXN(monto: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(monto);
}

function getStatusLabel(status: string): string {
  const mapping: Record<string, string> = {
    cotizado: 'PENDIENTE',
    pagado: 'PAGADO',
    en_produccion: 'EN_PROCESO',
    entregado: 'COMPLETADO',
    completado: 'COMPLETADO',
    cancelado: 'CANCELADO',
  };
  return mapping[status] || status.toUpperCase();
}

// Reusable Status Badge Component
function StatusBadge({ status, type }: { status: string; type: 'pedido' | 'pago' }) {
  const variants = {
    pedido: {
      PENDIENTE: 'bg-amber-50 text-amber-800 border-amber-200/50',
      PAGADO: 'bg-green-50 text-green-800 border-green-200/50',
      EN_PROCESO: 'bg-blue-50 text-blue-800 border-blue-200/50',
      COMPLETADO: 'bg-emerald-50 text-emerald-800 border-emerald-200/50',
      CANCELADO: 'bg-red-50 text-red-800 border-red-200/50',
    },
    pago: {
      PENDIENTE: 'bg-amber-50 text-amber-855 border-amber-100',
      COMPLETADO: 'bg-green-50 text-green-855 border-green-100',
      REEMBOLSADO: 'bg-gray-50 text-gray-855 border-gray-100',
    },
  };

  const label = type === 'pedido' ? getStatusLabel(status) : status.toUpperCase();
  const classes =
    variants[type][label as keyof (typeof variants)['pedido'] & keyof (typeof variants)['pago']] ||
    'bg-gray-50 text-gray-805 border-gray-150';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border uppercase tracking-wider',
        classes
      )}
    >
      {label}
    </span>
  );
}

// Reusable Copy Button Component
function CopyButton({ text, label }: { text: string; label?: string }) {
  const { copy, copied } = useClipboard();
  const { toast } = useToast();

  const handleCopy = async () => {
    const success = await copy(text);
    if (success) {
      toast({
        title: 'Copiado',
        description: `${label ?? 'El texto'} ha sido copiado al portapapeles.`,
        type: 'success',
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-gray-400 hover:text-gray-900 transition-colors p-1"
      title="Copiar al portapapeles"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

// RSVP Mini List Component
function RSVPList({ asistencias, onShowAll }: { asistencias: RSVP[]; onShowAll: () => void }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (asistencias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <Users className="h-10 w-10 text-gray-350 mb-2" />
        <p className="text-xs font-semibold text-gray-500">Aún no hay confirmaciones</p>
      </div>
    );
  }

  const totalPages = Math.ceil(asistencias.length / itemsPerPage);
  const currentItems = asistencias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-xs text-left text-gray-600">
          <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-100">
            <tr>
              <th className="px-4 py-2.5">Nombre</th>
              <th className="px-4 py-2.5 text-center">Lugares</th>
              <th className="px-4 py-2.5">Mensaje</th>
              <th className="px-4 py-2.5 text-right">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 font-semibold text-gray-900">{r.nombre}</td>
                <td className="px-4 py-3 text-center font-bold text-gray-800">
                  {r.asiste ? r.pax : 0}
                </td>
                <td
                  className="px-4 py-3 text-gray-500 max-w-[150px] truncate"
                  title={r.mensaje ?? ''}
                >
                  {r.mensaje ?? <span className="italic text-gray-400">Sin mensaje</span>}
                </td>
                <td className="px-4 py-3 text-right text-gray-400 font-mono">
                  {formatFechaCorta(r.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-2">
        {totalPages > 1 ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 text-xs border-gray-200 hover:bg-gray-50"
            >
              Anterior
            </Button>
            <span className="text-xs text-gray-500 font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 text-xs border-gray-200 hover:bg-gray-50"
            >
              Siguiente
            </Button>
          </div>
        ) : (
          <div />
        )}

        <Button
          variant="link"
          onClick={onShowAll}
          className="text-xs font-semibold text-violet-600 hover:text-violet-700 h-auto p-0"
        >
          Ver todos ({asistencias.length})
        </Button>
      </div>
    </div>
  );
}

// Types and props
type PedidoFull = Pedido & {
  cliente: Cliente;
  pagos: Pago[];
  rsvps: RSVP[];
  visitas: { id: string; fecha?: Date | string }[];
};

interface PedidoDetalleClientProps {
  pedido: PedidoFull;
}

export function PedidoDetalleClient({ pedido: initialPedido }: PedidoDetalleClientProps) {
  const [pedido, setPedido] = useState<PedidoFull>(initialPedido);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notifyText, setNotifyText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isAllRsvpsOpen, setIsAllRsvpsOpen] = useState(false);

  const { toast } = useToast();
  const { copy } = useClipboard();
  const { share, canShare } = useShare();

  // Local QR Generation
  useEffect(() => {
    if (pedido.urlPublica) {
      QRCode.toDataURL(pedido.urlPublica, {
        width: 250,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('[QRCode Local Generation]', err));
    }
  }, [pedido.urlPublica]);

  // Calculations
  const price = Number(pedido.precio);
  const totalPaid = pedido.pagos.reduce((sum: number, p: Pago) => sum + Number(p.monto), 0);
  const balance = price - totalPaid;
  const paymentProgress = Math.round((totalPaid / price) * 100) || 0;
  const lastPayment = pedido.pagos.length > 0 ? pedido.pagos[0] : null;
  const paxConfirmados = pedido.rsvps.reduce(
    (sum: number, r: RSVP) => sum + (r.asiste ? r.pax : 0),
    0
  );

  // React Hook Form for payments
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PagoInput>({
    resolver: zodResolver(getPagoSchema(balance)) as unknown as Resolver<PagoInput>,
    defaultValues: {
      monto: 0,
      metodo: 'transferencia',
      comprobante: '',
      notas: '',
    },
  });

  // Action handlers
  const handleOpenNotify = () => {
    let dataObj: Record<string, unknown> = {};
    if (pedido.datosInvitacion) {
      try {
        dataObj =
          typeof pedido.datosInvitacion === 'string'
            ? JSON.parse(pedido.datosInvitacion)
            : (pedido.datosInvitacion as Record<string, unknown>);
      } catch {
        dataObj = {};
      }
    }
    const fecha = (dataObj.fecha as string) || '';
    const hora = (dataObj.hora as string) || '';
    const lugar = (dataObj.lugar as string) || (dataObj.ubicacion as string) || '';

    const text = generarTextoNotificacion(
      pedido.cliente.nombre,
      pedido.urlPublica ?? '',
      pedido.qrUrl ?? qrDataUrl ?? '',
      pedido.tipoEvento,
      fecha,
      hora,
      lugar
    );
    setNotifyText(text);
    setCopied(false);
    setIsNotifyOpen(true);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(notifyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: 'Copiado', description: 'Mensaje copiado al portapapeles', type: 'success' });
    } catch {
      toast({ title: 'Error', description: 'No se pudo copiar el texto', type: 'error' });
    }
  };

  const handleTogglePublish = async () => {
    try {
      if (pedido.estadoInvitacion === 'PUBLICADA') {
        const res = await despublicarInvitacionAction(pedido.id);
        if (res.success) {
          setPedido((prev) => ({ ...prev, estadoInvitacion: 'BORRADOR' }));
          toast({
            title: 'Despublicada',
            description: 'La invitación ahora es un borrador.',
            type: 'success',
          });
        } else {
          toast({
            title: 'Error',
            description: res.error ?? 'Error al despublicar',
            type: 'error',
          });
        }
      } else {
        const res = await publicarInvitacionAction(pedido.id);
        if (res.success && res.data) {
          setPedido((prev) => ({
            ...prev,
            estadoInvitacion: 'PUBLICADA',
            urlPublica: res.data?.urlPublica ?? prev.urlPublica,
            slug: res.data?.slug ?? prev.slug,
          }));
          toast({
            title: 'Publicada',
            description: 'La invitación ya está activa en internet.',
            type: 'success',
          });
        } else {
          toast({ title: 'Error', description: res.error ?? 'Error al publicar', type: 'error' });
        }
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Error al cambiar estado de publicación',
        type: 'error',
      });
    }
  };

  const handleGenerateQR = async () => {
    setQrLoading(true);
    try {
      const res = await generarQRAction(pedido.id);
      if (res.success && res.data) {
        setPedido((prev: PedidoFull) => ({ ...prev, qrUrl: res.data ?? prev.qrUrl }));
        toast({
          title: 'QR Generado',
          description: 'El QR oficial se ha guardado en la nube.',
          type: 'success',
        });
      } else {
        toast({
          title: 'Error',
          description: res.error ?? 'No se pudo generar el código QR.',
          type: 'error',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Error de red al intentar generar el QR.',
        type: 'error',
      });
    } finally {
      setQrLoading(false);
    }
  };

  const handleDownloadQRLocal = () => {
    const targetUrl = qrDataUrl || pedido.qrUrl;
    if (!targetUrl) {
      toast({ title: 'Error', description: 'Código QR no generado aún', type: 'error' });
      return;
    }
    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = `qr-pedido-${pedido.slug ?? pedido.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextState = e.target.value;
    const previousState = pedido.estado;

    setPedido((prev: PedidoFull) => ({ ...prev, estado: nextState }));

    startTransition(async () => {
      const res = await updatePedidoEstadoAction(pedido.id, nextState);
      if (res.success) {
        toast({
          title: 'Estado actualizado',
          description: `El pedido está ahora en estado: ${getStatusLabel(nextState)}`,
          type: 'success',
        });
      } else {
        setPedido((prev: PedidoFull) => ({ ...prev, estado: previousState }));
        toast({
          title: 'Error',
          description: res.error ?? 'No se pudo actualizar el estado',
          type: 'error',
        });
      }
    });
  };

  const handleMarcarCompletado = () => {
    startTransition(async () => {
      const res = await updatePedidoEstadoAction(pedido.id, 'completado');
      if (res.success) {
        setPedido((prev) => ({ ...prev, estado: 'completado' }));
        toast({
          title: 'Completado',
          description: 'El pedido ha sido marcado como COMPLETADO.',
          type: 'success',
        });
      } else {
        toast({
          title: 'Error',
          description: res.error ?? 'No se pudo completar el pedido.',
          type: 'error',
        });
      }
    });
  };

  const handleCancelarPedido = () => {
    startTransition(async () => {
      const res = await updatePedidoEstadoAction(pedido.id, 'cancelado');
      if (res.success) {
        setPedido((prev) => ({ ...prev, estado: 'cancelado' }));
        setIsCancelDialogOpen(false);
        toast({
          title: 'Pedido cancelado',
          description: 'El pedido ha sido cancelado.',
          type: 'success',
        });
      } else {
        toast({
          title: 'Error',
          description: res.error ?? 'No se pudo cancelar el pedido.',
          type: 'error',
        });
      }
    });
  };

  const onSubmitPago: SubmitHandler<PagoInput> = async (data: PagoInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await registrarPagoAction(pedido.id, data);
      if (res.success) {
        const newPago: Pago = {
          id: Math.random().toString(),
          pedidoId: pedido.id,
          monto: new Prisma.Decimal(data.monto),
          metodo: data.metodo,
          comprobante: data.comprobante ?? null,
          notas: data.notas ?? null,
          fecha: new Date(),
        };

        setPedido((prev: PedidoFull) => {
          const updatedPagos = [...prev.pagos, newPago];
          const newTotalPaid = totalPaid + data.monto;
          const nextState =
            newTotalPaid >= price && prev.estado === 'cotizado' ? 'pagado' : prev.estado;
          return {
            ...prev,
            estado: nextState,
            pagos: updatedPagos,
          };
        });

        toast({
          title: 'Pago registrado',
          description: 'El pago se ha agregado con éxito.',
          type: 'success',
        });
        reset({
          monto: 0,
          metodo: 'transferencia',
          comprobante: '',
          notas: '',
        });
      } else {
        setError(res.error ?? 'Error al registrar el pago');
      }
    } catch {
      setError('Error inesperado en el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  // Extract variables
  const dataInvitacion = (() => {
    if (!pedido.datosInvitacion) return {};
    try {
      return typeof pedido.datosInvitacion === 'string'
        ? JSON.parse(pedido.datosInvitacion)
        : (pedido.datosInvitacion as Record<string, unknown>);
    } catch {
      return {};
    }
  })();

  const colorPrimario = dataInvitacion.colorPrimario ?? '#8B5CF6';
  const colorSecundario = dataInvitacion.colorSecundario ?? '#4C1D95';

  const primerRSVP = pedido.rsvps.length > 0 ? pedido.rsvps[pedido.rsvps.length - 1] : null;

  // Timeline events definition
  const timelineEvents = [
    {
      title: 'Pedido creado',
      status: 'completed' as const,
      date: pedido.createdAt,
      description: 'El pedido fue registrado correctamente en el sistema.',
    },
    {
      title: 'Pago registrado',
      status: totalPaid > 0 ? 'completed' : 'pending',
      date: lastPayment ? lastPayment.fecha : null,
      description:
        totalPaid > 0
          ? `Se registró un abono acumulado de ${formatCurrencyMXN(totalPaid)}.`
          : 'El pedido se encuentra pendiente de liquidar o abonar.',
    },
    {
      title: 'Invitación generada',
      status: pedido.slug || pedido.urlPublica ? ('completed' as const) : ('pending' as const),
      date: pedido.slug || pedido.urlPublica ? pedido.createdAt : null,
      description:
        pedido.slug || pedido.urlPublica
          ? 'La invitación digital se encuentra disponible en la web.'
          : 'La invitación digital aún se encuentra en borrador.',
    },
    {
      title: 'Primer confirmación (RSVP)',
      status: primerRSVP ? 'completed' : 'pending',
      date: primerRSVP ? primerRSVP.createdAt : null,
      description: primerRSVP
        ? `Confirmado por ${primerRSVP.nombre} para ${primerRSVP.pax} pases.`
        : 'Aún no se reciben confirmaciones de invitados.',
    },
  ];

  // Framer Motion Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.06 } },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 -m-6 md:-m-8 p-6 md:p-8 space-y-6">
      {/* 1.1 Header del Pedido (Hero Section) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative min-h-[200px] rounded-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-lg text-white"
        style={{
          background: `linear-gradient(135deg, ${colorPrimario} 0%, ${colorSecundario} 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none" />

        {/* Top bar info */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/pedidos"
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-xs"
              title="Volver a Pedidos"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs">
                  ID: {pedido.id.substring(0, 8)}
                </span>
                <StatusBadge status={pedido.estado} type="pedido" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/80 mt-1">
                <Calendar className="h-4 w-4" />
                <span>Creado el {formatFechaMX(pedido.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Estado Selector inline */}
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 h-10 backdrop-blur-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/75">
              Estado:
            </span>
            <select
              value={pedido.estado}
              onChange={handleStateChange}
              disabled={isPending}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer capitalize border-none"
            >
              <option value="cotizado" className="bg-slate-900 text-white">
                Cotizado
              </option>
              <option value="pagado" className="bg-slate-900 text-white">
                Pagado
              </option>
              <option value="en_produccion" className="bg-slate-900 text-white">
                En Producción
              </option>
              <option value="entregado" className="bg-slate-900 text-white">
                Entregado
              </option>
              <option value="completado" className="bg-slate-900 text-white">
                Completado
              </option>
              <option value="cancelado" className="bg-slate-900 text-white">
                Cancelado
              </option>
            </select>
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-white/70" />}
          </div>
        </div>

        {/* Large Name */}
        <div className="relative z-10 py-4 sm:py-6">
          <h2 className="text-[clamp(1.5rem,5vw,2.5rem)] font-bold tracking-tight leading-tight">
            Pedido: {pedido.cliente.nombre}
          </h2>
        </div>

        {/* Quick Actions Hero Footer */}
        <div className="relative z-10 flex flex-wrap gap-2.5 pt-2 border-t border-white/10">
          {pedido.urlPublica && (
            <a href={pedido.urlPublica} target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                className="bg-white/10 hover:bg-white/20 text-white text-xs h-11 px-4 rounded-xl flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
              >
                <ExternalLink className="h-4 w-4" />
                Ver invitación
              </Button>
            </a>
          )}

          {pedido.urlPublica && (
            <Button
              onClick={handleOpenNotify}
              variant="ghost"
              className="bg-white/10 hover:bg-white/20 text-white text-xs h-11 px-4 rounded-xl flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
            >
              <Send className="h-4 w-4" />
              Reenviar QR
            </Button>
          )}

          <Link href={`/admin/pedidos/${pedido.id}/editar`}>
            <Button
              variant="ghost"
              className="bg-white/10 hover:bg-white/20 text-white text-xs h-11 px-4 rounded-xl flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
            >
              <Pencil className="h-4 w-4" />
              Editar pedido
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* 1.2 Grid de Tarjetas (2 columnas md+, 1 columna mobile) */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Tarjeta 1: Resumen del Pedido */}
        <motion.div variants={fadeInUp} viewport={{ once: true }}>
          <Card className="rounded-2xl shadow-md border border-gray-100 bg-white h-full">
            <CardHeader className="border-b border-gray-50 pb-4">
              <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-violet-500" />
                Resumen del Pedido
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Detalles principales del servicio contratado.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500 font-medium">Paquete contratado</span>
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-2xs font-bold uppercase border tracking-wider',
                    pedido.paquete === 'esencial' &&
                      'bg-amber-50 text-amber-700 border-amber-200/50',
                    pedido.paquete === 'completa' &&
                      'bg-violet-50 text-violet-700 border-violet-200/50',
                    pedido.paquete === 'premium' &&
                      'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                  )}
                >
                  {pedido.paquete}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500 font-medium">Precio Total</span>
                <span className="text-2xl font-bold text-violet-600">
                  {formatCurrencyMXN(price)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500 font-medium">Fecha del evento</span>
                <span className="text-xs text-gray-900 font-semibold flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  {formatFechaCorta(pedido.fechaEvento)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-gray-500 font-medium">Template</span>
                <span className="text-xs text-gray-950 font-semibold bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-150 capitalize">
                  {pedido.template.replace('-', ' ')}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tarjeta 2: Información de Pago */}
        <motion.div variants={fadeInUp} viewport={{ once: true }}>
          <Card className="rounded-2xl shadow-md border border-gray-100 bg-white h-full flex flex-col justify-between">
            <div>
              <CardHeader className="border-b border-gray-50 pb-4">
                <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-violet-500" />
                  Información de Pago
                </CardTitle>
                <CardDescription className="text-xs text-gray-400">
                  Control financiero y registro de abonos.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Method + Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block mb-1">
                      Método de pago
                    </span>
                    <span className="text-xs text-gray-800 font-bold capitalize flex items-center gap-1.5">
                      <PlusCircle className="h-3.5 w-3.5 text-gray-400" />
                      {lastPayment?.metodo ?? 'Sin pagos'}
                    </span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col justify-center">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block mb-1">
                      Estado de Pago
                    </span>
                    <div>
                      <StatusBadge
                        status={balance === 0 ? 'COMPLETADO' : 'PENDIENTE'}
                        type="pago"
                      />
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-500">Monto abonado:</span>
                    <span className="text-violet-600">
                      {formatCurrencyMXN(totalPaid)} de {formatCurrencyMXN(price)} (
                      {paymentProgress}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                    <div
                      className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300"
                      style={{ width: `${paymentProgress}%` }}
                    />
                  </div>
                </div>

                {/* References */}
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-500 font-medium">Referencia</span>
                  <div className="flex items-center gap-1">
                    <span
                      className="text-xs text-gray-900 font-mono font-medium max-w-[150px] truncate"
                      title={lastPayment?.comprobante ?? ''}
                    >
                      {lastPayment?.comprobante ?? 'Sin referencia'}
                    </span>
                    {lastPayment?.comprobante && (
                      <CopyButton text={lastPayment.comprobante} label="La referencia" />
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-gray-500 font-medium">Último Pago</span>
                  <span className="text-xs text-gray-900 font-semibold">
                    {lastPayment ? formatFechaCorta(lastPayment.fecha) : 'Sin pagos registrados'}
                  </span>
                </div>
              </CardContent>
            </div>

            {/* Quick register payment */}
            {balance > 0 && (
              <div className="p-6 pt-0 border-t border-gray-50 mt-2 bg-gray-50/50 rounded-b-2xl">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                  Registrar Abono
                </h4>
                <form
                  onSubmit={handleSubmit(onSubmitPago)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-gray-400 text-xs">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Monto"
                      className="pl-6 h-9 text-xs rounded-lg bg-white border-gray-200"
                      disabled={isLoading}
                      {...register('monto')}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 h-9 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs outline-none"
                      disabled={isLoading}
                      {...register('metodo')}
                    >
                      <option value="transferencia">Transferencia</option>
                      <option value="efectivo">Efectivo</option>
                    </select>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-violet-600 hover:bg-violet-700 text-white font-semibold h-9 px-3.5 rounded-lg text-xs"
                    >
                      {isLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </form>
                {errors.monto && (
                  <p className="text-[10px] text-red-500 mt-1">{errors.monto.message}</p>
                )}
                {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Tarjeta 3: Datos del Cliente */}
        <motion.div variants={fadeInUp} viewport={{ once: true }}>
          <Card className="rounded-2xl shadow-md border border-gray-100 bg-white h-full">
            <CardHeader className="border-b border-gray-50 pb-4">
              <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-5 w-5 text-violet-500" />
                Datos del Cliente
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Información de contacto del contratante.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500 font-medium">Nombre completo</span>
                <span className="text-xs text-gray-900 font-bold">{pedido.cliente.nombre}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500 font-medium">Email</span>
                <a
                  href={pedido.cliente.email ? `mailto:${pedido.cliente.email}` : '#'}
                  className={cn(
                    'text-xs font-semibold flex items-center gap-1.5 transition-colors',
                    pedido.cliente.email
                      ? 'text-violet-600 hover:text-violet-700'
                      : 'text-gray-400 pointer-events-none'
                  )}
                >
                  <Mail className="h-3.5 w-3.5" />
                  {pedido.cliente.email ?? 'No registrado'}
                </a>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500 font-medium">Teléfono</span>
                <a
                  href={pedido.cliente.telefono ? `tel:${pedido.cliente.telefono}` : '#'}
                  className={cn(
                    'text-xs font-semibold flex items-center gap-1.5 transition-colors',
                    pedido.cliente.telefono
                      ? 'text-violet-600 hover:text-violet-700'
                      : 'text-gray-400 pointer-events-none'
                  )}
                >
                  <Phone className="h-3.5 w-3.5" />
                  {pedido.cliente.telefono ?? 'No registrado'}
                </a>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-xs text-gray-500 font-medium">Notas del Cliente</span>
                <textarea
                  readOnly
                  value={pedido.cliente.notas ?? 'Sin notas adicionales.'}
                  className="w-full text-xs text-gray-650 bg-gray-50 border border-gray-200 rounded-xl p-3 h-20 resize-none outline-none focus:ring-0 leading-relaxed overflow-y-auto"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tarjeta 4: Asistencia / RSVP */}
        <motion.div variants={fadeInUp} viewport={{ once: true }}>
          <Card className="rounded-2xl shadow-md border border-gray-100 bg-white h-full">
            <CardHeader className="border-b border-gray-50 pb-4">
              <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-violet-500" />
                Asistencia / RSVP
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Confirmaciones de asistencia para el evento.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Stats and count */}
              <div className="flex items-center gap-4 py-2 border-b border-gray-50">
                <div className="flex-1">
                  <p className="text-3xl font-extrabold text-violet-600">{paxConfirmados}</p>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    Confirmados
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                    Total: {pedido.rsvps.length} respuestas
                  </span>
                </div>
              </div>

              {/* Compact table */}
              <RSVPList asistencias={pedido.rsvps} onShowAll={() => setIsAllRsvpsOpen(true)} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Tarjeta 5: Código QR */}
        <motion.div variants={fadeInUp} className="md:col-span-2" viewport={{ once: true }}>
          <Card className="rounded-2xl shadow-md border border-gray-100 bg-white p-6 flex flex-col md:flex-row items-center gap-6">
            {/* Left Column QR Image */}
            <div className="flex-1 flex flex-col items-center justify-center border border-gray-50 bg-gray-50/50 p-4 rounded-xl max-w-sm w-full">
              {pedido.urlPublica ? (
                <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100">
                  <img
                    src={qrDataUrl || pedido.qrUrl ?? ''}
                    alt="QR Invitación"
                    className="w-48 h-48 object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-48 h-48 text-center text-gray-400">
                  <QrCode className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-xs">Sin QR Generado</p>
                </div>
              )}
              {pedido.urlPublica && (
                <span className="text-[10px] font-mono text-gray-400 mt-2.5">
                  ID: {pedido.slug ?? pedido.id}
                </span>
              )}
            </div>

            {/* Right Column details and action buttons */}
            <div className="flex-[1.5] w-full flex flex-col justify-between h-full space-y-4">
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                  <QrCode className="h-4.5 w-4.5 text-violet-500" />
                  Código QR de Acceso
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Este código QR permite a los invitados abrir directamente la invitación pública.
                  Puedes descargarlo, copiar el enlace o compartirlo.
                </p>
              </div>

              {/* URL bar */}
              {pedido.urlPublica ? (
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-150 rounded-xl px-3 py-2">
                  <input
                    value={pedido.urlPublica}
                    readOnly
                    className="bg-transparent text-xs text-gray-600 font-mono font-medium truncate flex-1 outline-none"
                  />
                  <CopyButton text={pedido.urlPublica} label="El enlace" />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 p-4 bg-gray-50 text-center text-xs text-gray-500 italic space-y-2">
                  <p>La invitación no se encuentra publicada aún.</p>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-violet-600 font-semibold"
                    onClick={handleTogglePublish}
                  >
                    Publicar ahora y generar QR →
                  </Button>
                </div>
              )}

              {/* Action buttons */}
              {pedido.urlPublica && (
                <div className="flex flex-wrap gap-2.5">
                  <Button
                    onClick={handleDownloadQRLocal}
                    variant="outline"
                    size="sm"
                    className="h-10 text-xs font-semibold border-gray-200 hover:bg-gray-50 bg-white"
                  >
                    <Download className="h-4 w-4 mr-1.5 text-gray-400" />
                    Descargar QR
                  </Button>

                  <Button
                    onClick={async () => {
                      const success = await copy(pedido.urlPublica ?? '');
                      if (success) {
                        toast({
                          title: 'Copiado',
                          description: 'Enlace copiado con éxito.',
                          type: 'success',
                        });
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="h-10 text-xs font-semibold border-gray-200 hover:bg-gray-50 bg-white"
                  >
                    <Copy className="h-4 w-4 mr-1.5 text-gray-400" />
                    Copiar link
                  </Button>

                  <Button
                    onClick={async () => {
                      if (canShare) {
                        await share({
                          title: 'Mi Invitación',
                          text: `¡Te invito a mi cumpleaños! Abre el enlace para ver los detalles:`,
                          url: pedido.urlPublica ?? '',
                        });
                      } else {
                        const success = await copy(pedido.urlPublica ?? '');
                        if (success) {
                          toast({
                            title: 'Copiado',
                            description: 'Enlace copiado (compartir no soportado).',
                            type: 'success',
                          });
                        }
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="h-10 text-xs font-semibold border-gray-200 hover:bg-gray-50 bg-white"
                  >
                    <Send className="h-4 w-4 mr-1.5 text-gray-400" />
                    {canShare ? 'Compartir' : 'Copiar'}
                  </Button>
                </div>
              )}

              {/* Cloudinary upload action */}
              {pedido.urlPublica && !pedido.qrUrl && (
                <div className="pt-2">
                  <Button
                    onClick={handleGenerateQR}
                    disabled={qrLoading}
                    variant="link"
                    className="h-auto p-0 text-violet-600 hover:text-violet-700 text-xs font-semibold flex items-center gap-1"
                  >
                    {qrLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                    Guardar QR Oficial en Cloudinary
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* 1.3 Timeline / Historial del Pedido (Full Width) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="relative border border-gray-100 bg-white rounded-2xl shadow-md p-6 w-full"
      >
        <div className="flex items-center gap-2 mb-6">
          <History className="h-5 w-5 text-violet-500" />
          <h3 className="font-semibold text-gray-800 text-sm">Timeline / Historial del Pedido</h3>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
          {timelineEvents.map((ev, idx) => {
            const isCompleted = ev.status === 'completed';
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.35 }}
                className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                {/* Dot */}
                <span
                  className={cn(
                    'absolute -left-[22px] top-1.5 h-3.5 w-3.5 rounded-full border-2 ring-4 ring-white shrink-0 z-10',
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-500 shadow-sm'
                      : 'bg-gray-200 border-gray-200'
                  )}
                />

                <div className="space-y-1">
                  <h4
                    className={cn(
                      'font-bold text-sm',
                      isCompleted ? 'text-gray-900' : 'text-gray-400'
                    )}
                  >
                    {ev.title}
                  </h4>
                  <p className="text-gray-500 leading-relaxed">{ev.description}</p>
                </div>

                {ev.date ? (
                  <span className="text-[10px] font-mono font-medium text-gray-400 shrink-0 self-start sm:self-auto bg-gray-50 border border-gray-150 rounded px-2 py-0.5 shadow-3xs">
                    {formatFechaMX(ev.date)}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400 italic shrink-0 self-start sm:self-auto bg-gray-50 border border-gray-150 rounded px-2 py-0.5">
                    Pendiente
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 1.4 Footer de Acciones */}
      <div className="sticky bottom-0 z-40 bg-white border-t border-gray-150 p-4 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 md:relative md:bg-transparent md:border-none md:p-0 md:mx-0 md:mb-0 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex gap-3 w-full sm:w-auto">
          {pedido.estado !== 'completado' && pedido.estado !== 'cancelado' && (
            <Button
              onClick={handleMarcarCompletado}
              className="flex-1 sm:flex-initial h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 rounded-xl shadow-md transition-transform hover:scale-105"
            >
              Marcar como completado
            </Button>
          )}

          {pedido.estado !== 'cancelado' && (
            <Button
              onClick={() => setIsCancelDialogOpen(true)}
              variant="outline"
              className="flex-1 sm:flex-initial h-11 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold text-xs px-5 rounded-xl transition-transform hover:scale-105 bg-white"
            >
              Cancelar pedido
            </Button>
          )}
        </div>

        <Link href="/admin/pedidos" className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto h-11 border-gray-200 text-gray-750 bg-white font-semibold text-xs px-5 rounded-xl transition-transform hover:scale-105"
          >
            Volver a pedidos
          </Button>
        </Link>
      </div>

      {/* MODAL: NOTIFICAR CLIENTE / WHATSAPP TEMPLATE */}
      {isNotifyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsNotifyOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-md bg-white border border-gray-100 rounded-2xl p-6 text-left shadow-2xl space-y-4 z-10 text-gray-900">
            <button
              onClick={() => setIsNotifyOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="space-y-1 pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Send className="h-4.5 w-4.5 text-violet-600" />
                Notificar Cliente
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Mensaje de invitación preformateado
              </p>
            </div>
            <div className="space-y-1.5">
              <textarea
                value={notifyText}
                onChange={(e) => setNotifyText(e.target.value)}
                rows={7}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all resize-none leading-relaxed font-mono"
              />
            </div>
            <div className="flex gap-2.5 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                className="flex-1 border-gray-200 text-gray-500 hover:text-gray-900 font-bold text-xs h-10 rounded-xl bg-white"
                onClick={() => setIsNotifyOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  const phone = pedido.cliente.telefono
                    ? pedido.cliente.telefono.replace(/\D/g, '')
                    : '';
                  const url = `https://wa.me/${phone}?text=${encodeURIComponent(notifyText)}`;
                  window.open(url, '_blank');
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 text-xs h-10 rounded-xl"
              >
                Enviar WhatsApp
              </Button>
              <Button
                onClick={handleCopyText}
                className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold flex items-center justify-center gap-1.5 text-xs h-10 rounded-xl"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG DE CONFIRMACION: CANCELAR PEDIDO */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="max-w-sm bg-white text-gray-900 border border-gray-100 rounded-2xl shadow-xl p-5">
          <DialogHeader>
            <DialogTitle className="text-gray-950 font-bold text-base flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-650" />
              ¿Cancelar este pedido?
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-xs mt-2">
              Esta acción marcará el estado del pedido como CANCELADO. Podrás cambiarlo después si
              es necesario.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 pt-3 border-t border-gray-50 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              className="flex-1 border-gray-200 hover:bg-gray-50 bg-white text-gray-700 font-bold text-xs h-10 rounded-xl"
            >
              No, conservar
            </Button>
            <Button
              onClick={handleCancelarPedido}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-10 rounded-xl"
            >
              Sí, cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG FULL: ASISTENCIA RSVP COMPLETO */}
      <Dialog open={isAllRsvpsOpen} onOpenChange={setIsAllRsvpsOpen}>
        <DialogContent className="max-w-4xl bg-[#F8FAFC] text-gray-900 border border-gray-150 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-gray-100 pb-3">
            <DialogTitle className="text-gray-950 font-extrabold text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-500" />
              Lista de Confirmaciones RSVP Completa
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-xs">
              Detalle completo y filtros de todos los confirmados.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <RSVPTable
              rsvps={pedido.rsvps}
              precio={price}
              datosInvitacion={pedido.datosInvitacion}
            />
          </div>
          <DialogFooter className="border-t border-gray-100 pt-3">
            <Button
              variant="outline"
              onClick={() => setIsAllRsvpsOpen(false)}
              className="border-gray-200 hover:bg-gray-50 bg-white font-bold text-xs h-10 px-4 rounded-xl"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
