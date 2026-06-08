"use client";

import { useState } from "react";
import { 
  Search, 
  Trash2, 
  Mail,
  Phone,
  Calendar,
  MessageSquare
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lead } from "@prisma/client";
import { useToast } from "@/components/ui/toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { deleteLeadAction } from "./actions";

interface LeadsClientProps {
  initialLeads: Lead[];
}

export function LeadsClient({ initialLeads }: LeadsClientProps) {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de que desea eliminar este lead?")) return;

    try {
      const res = await deleteLeadAction(id);
      if (res.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        toast({
          title: "Lead eliminado",
          description: "El lead ha sido removido con éxito.",
          type: "success",
        });
      } else {
        toast({
          title: "Error al eliminar",
          description: res.error || "Ocurrió un error al intentar eliminar el lead.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error de red",
        description: "No se pudo comunicar con el servidor.",
        type: "error",
      });
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const s = search.toLowerCase();
    return (
      lead.nombre.toLowerCase().includes(s) ||
      (lead.mensaje && lead.mensaje.toLowerCase().includes(s)) ||
      (lead.telefono && lead.telefono.includes(s)) ||
      (lead.evento && lead.evento.toLowerCase().includes(s))
    );
  });

  const getEventBadge = (evento: string | null) => {
    if (!evento) return <span className="text-slate-500">-</span>;
    switch (evento) {
      case "boda":
        return <span className="inline-flex items-center rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-semibold text-violet-400 ring-1 ring-violet-500/20">Boda</span>;
      case "xv":
        return <span className="inline-flex items-center rounded-full bg-pink-500/10 px-2.5 py-0.5 text-xs font-semibold text-pink-400 ring-1 ring-pink-500/20">XV Años</span>;
      case "babyshower":
        return <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">Baby Shower</span>;
      case "cumpleanos":
        return <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20">Cumpleaños</span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-semibold text-slate-400 ring-1 ring-slate-500/20">{evento}</span>;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return <span className="text-slate-500">-</span>;
    const d = new Date(date);
    if (isNaN(d.getTime())) return <span className="text-slate-500">-</span>;
    return d.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date: Date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Mail className="h-6 w-6 text-violet-400" />
          Leads de Contacto
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Bandeja de entrada para los mensajes de clientes recibidos desde el formulario de la landing page.
        </p>
      </div>

      {/* Filter and search */}
      <div className="flex items-center max-w-md relative">
        <Search className="absolute left-3 h-4 w-4 text-slate-500" />
        <Input
          type="text"
          placeholder="Buscar por nombre, mensaje, teléfono o evento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 border-slate-900 bg-slate-900/40 text-slate-100 placeholder:text-slate-500 focus-visible:ring-violet-500 focus-visible:ring-offset-slate-950"
        />
      </div>

      {/* Leads Table */}
      <div className="rounded-xl border border-slate-900 bg-slate-900/10 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-950/40">
            <TableRow className="border-b border-slate-900 hover:bg-transparent">
              <TableHead className="text-slate-400 font-semibold">Fecha Registro</TableHead>
              <TableHead className="text-slate-400 font-semibold">Nombre</TableHead>
              <TableHead className="text-slate-400 font-semibold">Evento</TableHead>
              <TableHead className="text-slate-400 font-semibold">Fecha Evento</TableHead>
              <TableHead className="text-slate-400 font-semibold">Teléfono</TableHead>
              <TableHead className="text-slate-400 font-semibold">Mensaje</TableHead>
              <TableHead className="text-right text-slate-400 font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="h-24 text-center text-slate-500 italic">
                  No se encontraron leads de contacto.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-colors">
                  <TableCell className="text-slate-400 text-xs whitespace-nowrap">
                    {formatDateTime(lead.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium text-white whitespace-nowrap">{lead.nombre}</TableCell>
                  <TableCell className="whitespace-nowrap">{getEventBadge(lead.evento)}</TableCell>
                  <TableCell className="text-slate-300 whitespace-nowrap">
                    {lead.fecha ? (
                      <span className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        {formatDate(lead.fecha)}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-300 whitespace-nowrap">
                    {lead.telefono ? (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-500" />
                        {lead.telefono}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-300 min-w-[200px] max-w-sm">
                    <span className="flex items-start gap-1.5 py-1">
                      <MessageSquare className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span className="text-sm line-clamp-2" title={lead.mensaje}>
                        {lead.mensaje}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(lead.id)}
                        className="h-8 w-8 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
