import Link from "next/link";
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp, 
  ArrowRight, 
  PlusCircle
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 0; // Disable caching to ensure fresh database data on load

export default async function AdminDashboardPage() {
  // 1. Pedidos del mes (since start of current month)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const ordersThisMonth = await prisma.pedido.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
  });

  // 2. Ingresos totales (sum of payments)
  const paymentsAggregate = await prisma.pago.aggregate({
    _sum: {
      monto: true,
    },
  });
  const totalIncome = Number(paymentsAggregate._sum.monto || 0);

  // 3. Eventos/Pendientes de hoy (event dates falling within today)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const eventsToday = await prisma.pedido.count({
    where: {
      fechaEvento: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
  });

  // 4. Leads nuevos
  const newLeads = await prisma.lead.count();

  // Load recent events (next 5 upcoming events)
  const upcomingEvents = await prisma.pedido.findMany({
    where: {
      fechaEvento: {
        gte: startOfToday,
      },
    },
    orderBy: {
      fechaEvento: "asc",
    },
    take: 5,
    include: {
      cliente: true,
    },
  });

  // Load recent clients
  const recentClients = await prisma.cliente.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header welcome banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-8 shadow-xl">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-violet-500/5 blur-[80px]" />
        <div className="relative space-y-4 max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ¡Bienvenido al Panel CRM!
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Aquí tienes el estado actual de tu negocio en tiempo real. Crea clientes, gestiona pedidos y registra pagos.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/admin/pedidos/nuevo">
              <Button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Nuevo Pedido
              </Button>
            </Link>
            <Link href="/admin/pedidos">
              <Button variant="outline" className="border-slate-800 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-900 flex items-center gap-2">
                Ver Kanban de Pedidos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <Card className="border-slate-900 bg-slate-900/20 backdrop-blur-sm shadow-md text-slate-100 hover:border-slate-800 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-400">
              Pedidos del Mes
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md shadow-violet-500/10">
              <FileText className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{ordersThisMonth}</div>
            <p className="text-xs text-slate-500 mt-1">Registrados este mes</p>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="border-slate-900 bg-slate-900/20 backdrop-blur-sm shadow-md text-slate-100 hover:border-slate-800 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-400">
              Ingresos Totales
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/10">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(totalIncome)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Suma de pagos registrados</p>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="border-slate-900 bg-slate-900/20 backdrop-blur-sm shadow-md text-slate-100 hover:border-slate-800 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-400">
              Eventos de Hoy
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/10">
              <Calendar className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{eventsToday}</div>
            <p className="text-xs text-slate-500 mt-1">Programados para hoy</p>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="border-slate-900 bg-slate-900/20 backdrop-blur-sm shadow-md text-slate-100 hover:border-slate-800 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-400">
              Leads Nuevos
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/10">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{newLeads}</div>
            <p className="text-xs text-slate-500 mt-1">Prospectos interesados</p>
          </CardContent>
        </Card>
      </div>

      {/* Lists Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming events list */}
        <Card className="border-slate-900 bg-slate-900/20 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-400" />
              Próximos Eventos
            </CardTitle>
            <CardDescription className="text-slate-400">
              Eventos agendados en orden cronológico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-slate-500 italic text-center py-4">No hay eventos próximos agendados.</p>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-colors">
                  <div>
                    <p className="font-semibold text-white">{event.cliente.nombre}</p>
                    <p className="text-xs text-slate-500 capitalize">Evento: {event.tipoEvento} | {event.template}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-violet-400">
                      {new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" }).format(event.fechaEvento)}
                    </p>
                    <div className="flex items-center gap-1.5 justify-end">
                      {(() => {
                        const diffTime = new Date(event.fechaEvento).getTime() - startOfToday.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays >= 0 && diffDays <= 7) {
                          return (
                            <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-3xs font-bold text-amber-400 ring-1 ring-amber-500/20 uppercase tracking-wider">
                              Próximo
                            </span>
                          );
                        }
                        return null;
                      })()}
                      <span className="inline-block rounded-full bg-violet-900/20 px-2 py-0.5 text-2xs font-medium text-violet-400 ring-1 ring-violet-500/20 capitalize">
                        {event.estado}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent clients list */}
        <Card className="border-slate-900 bg-slate-900/20 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-400" />
              Clientes Recientes
            </CardTitle>
            <CardDescription className="text-slate-400">
              Últimos registros de clientes en la base de datos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentClients.length === 0 ? (
              <p className="text-sm text-slate-500 italic text-center py-4">No hay clientes registrados.</p>
            ) : (
              recentClients.map((client) => {
                const initials = client.nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                return (
                  <div key={client.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 font-bold text-sm">
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{client.nombre}</p>
                        <p className="text-xs text-slate-500">{client.email || "Sin email"} | {client.telefono || "Sin teléfono"}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-2xs font-medium text-slate-400 ring-1 ring-slate-700/50 capitalize">
                      {client.fuente}
                    </span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
