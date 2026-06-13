'use client';

import React, { useState } from 'react';
import { RSVP } from '@prisma/client';
import { Download, Users, Check, X, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface RSVPTableProps {
  rsvps: RSVP[];
  precio: number;
  datosInvitacion: unknown;
}

export function RSVPTable({ rsvps, precio, datosInvitacion }: RSVPTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'asiste' | 'no-asiste'>('all');

  const invitadosEsperados =
    Number((datosInvitacion as Record<string, unknown>)?.invitadosEsperados) ||
    Math.round(precio / 20) ||
    100;
  const paxConfirmados = rsvps.filter((r) => r.asiste).reduce((sum, r) => sum + r.pax, 0);
  const totalRespuestas = rsvps.length;
  const asistenCount = rsvps.filter((r) => r.asiste).length;
  const noAsistenCount = rsvps.filter((r) => !r.asiste).length;

  const exportToCSV = () => {
    let dataObj: Record<string, unknown> = {};
    if (datosInvitacion) {
      try {
        dataObj =
          typeof datosInvitacion === 'string'
            ? JSON.parse(datosInvitacion)
            : (datosInvitacion as Record<string, unknown>);
      } catch {
        dataObj = {};
      }
    }
    const nombreFestejado =
      (dataObj.nombre as string) || (dataObj.nombres as string) || 'Festejado';
    const fechaEvento = (dataObj.fecha as string) || '';
    const lugarEvento = (dataObj.lugar as string) || (dataObj.ubicacion as string) || '';

    let dateText = fechaEvento;
    try {
      if (fechaEvento) {
        const d = new Date(fechaEvento);
        if (!isNaN(d.getTime())) {
          dateText = d.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
        }
      }
    } catch {
      // fallback
    }

    const metadata = [
      `"Evento:","${nombreFestejado.replace(/"/g, '""')}"`,
      `"Fecha:","${dateText.replace(/"/g, '""')}"`,
      `"Lugar:","${lugarEvento.replace(/"/g, '""')}"`,
      `""`,
    ];

    const headers = [
      'Nombre',
      '¿Asiste?',
      'Lugares/Pax',
      'Teléfono',
      'Mensaje',
      'Fecha de registro',
    ];
    const rows = rsvps.map((r) => [
      r.nombre,
      r.asiste ? 'Sí' : 'No',
      r.asiste ? r.pax : 0,
      r.telefono ?? '',
      r.mensaje ?? '',
      new Date(r.createdAt).toLocaleString('es-MX'),
    ]);

    const csvContent = [
      ...metadata,
      headers.join(','),
      ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `confirmaciones-pedidos.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRSVPs = rsvps.filter((r) => {
    const matchesSearch =
      r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.telefono && r.telefono.includes(searchTerm));

    if (filterType === 'asiste') {
      return matchesSearch && r.asiste;
    }
    if (filterType === 'no-asiste') {
      return matchesSearch && !r.asiste;
    }
    return matchesSearch;
  });

  return (
    <Card className="border-slate-900 bg-slate-900/10 text-slate-100 backdrop-blur-xs">
      <CardHeader className="border-b border-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-5">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-violet-400" />
            Control de Asistencia (RSVP)
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Invitados que han confirmado a través de la invitación pública.
          </CardDescription>
        </div>
        {rsvps.length > 0 && (
          <Button
            onClick={exportToCSV}
            size="sm"
            variant="outline"
            className="border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white gap-1.5 self-start sm:self-auto text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            Exportar CSV
          </Button>
        )}
      </CardHeader>

      {/* RSVP Stats Indicators */}
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-3.5 text-center">
            <p className="text-2xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Confirmados (Pax)
            </p>
            <p className="text-xl font-bold text-violet-400">{paxConfirmados}</p>
            <p className="text-[10px] text-slate-600">personas en total</p>
          </div>
          <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-3.5 text-center">
            <p className="text-2xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Esperados
            </p>
            <p className="text-xl font-bold text-white">{invitadosEsperados}</p>
            <p className="text-[10px] text-slate-600">invitados estimados</p>
          </div>
          <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-3.5 text-center">
            <p className="text-2xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Asistirán
            </p>
            <p className="text-xl font-bold text-emerald-400">{asistenCount}</p>
            <p className="text-[10px] text-slate-600">respuestas positivas</p>
          </div>
          <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-3.5 text-center">
            <p className="text-2xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
              No Asistirán
            </p>
            <p className="text-xl font-bold text-rose-500">{noAsistenCount}</p>
            <p className="text-[10px] text-slate-600">respuestas negativas</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Avance de asistencia:</span>
            <span className="text-violet-400">
              {paxConfirmados} de {invitadosEsperados} confirmados (
              {Math.round((paxConfirmados / invitadosEsperados) * 100) || 0}%)
            </span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
            <div
              style={{
                width: `${Math.min(100, Math.round((paxConfirmados / invitadosEsperados) * 100))}%`,
              }}
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500"
            />
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Buscar por nombre o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-950/40 border-slate-900 text-slate-100 placeholder:text-slate-600 focus-visible:ring-violet-500"
            />
          </div>
          <div className="flex gap-1.5 bg-slate-950/40 border border-slate-900 p-1 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterType === 'all'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({totalRespuestas})
            </button>
            <button
              onClick={() => setFilterType('asiste')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterType === 'asiste'
                  ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Asiste ({asistenCount})
            </button>
            <button
              onClick={() => setFilterType('no-asiste')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterType === 'no-asiste'
                  ? 'bg-rose-600/10 text-rose-400 border border-rose-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              No asiste ({noAsistenCount})
            </button>
          </div>
        </div>

        {/* Table Data */}
        {filteredRSVPs.length === 0 ? (
          <div className="border border-dashed border-slate-900 rounded-xl py-10 text-center text-xs text-slate-500 italic">
            No se encontraron confirmaciones que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-900">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-2xs uppercase tracking-wider font-semibold text-slate-400 bg-slate-950/60 border-b border-slate-900">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3 text-center">¿Asiste?</th>
                  <th className="px-4 py-3 text-center">Pax</th>
                  <th className="px-4 py-3">Teléfono</th>
                  <th className="px-4 py-3">Mensaje</th>
                  <th className="px-4 py-3 text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 bg-slate-950/20">
                {filteredRSVPs.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-white">{r.nombre}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          r.asiste
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {r.asiste ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {r.asiste ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center text-slate-100 font-mono">
                      {r.asiste ? r.pax : 0}
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 font-mono text-xs">
                      {r.telefono ?? '-'}
                    </td>
                    <td
                      className="px-4 py-3.5 text-slate-400 max-w-[200px] truncate"
                      title={r.mensaje ?? ''}
                    >
                      {r.mensaje ?? <span className="italic text-slate-700">Sin mensaje</span>}
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-500 text-xs">
                      {new Intl.DateTimeFormat('es-MX', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      }).format(new Date(r.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
