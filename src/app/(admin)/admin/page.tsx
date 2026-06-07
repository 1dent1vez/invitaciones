import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp, 
  CheckCircle,
  ArrowRight,
  PlusCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCard {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const stats: StatCard[] = [
  {
    title: "Clientes Totales",
    value: "24",
    description: "+4 nuevos esta semana",
    icon: Users,
    color: "from-blue-500 to-indigo-500",
  },
  {
    title: "Pedidos Activos",
    value: "12",
    description: "8 en producción, 4 cotizados",
    icon: FileText,
    color: "from-violet-500 to-purple-500",
  },
  {
    title: "Confirmaciones RSVP",
    value: "148",
    description: "Promedio de 85% de asistencia",
    icon: CheckCircle,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Ingresos Estimados",
    value: "$18,500 MXN",
    description: "Este mes",
    icon: TrendingUp,
    color: "from-pink-500 to-rose-500",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header welcome banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-8 shadow-xl">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-violet-500/5 blur-[80px]" />
        <div className="relative space-y-4 max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ¡Bienvenido de nuevo, Admin!
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Aquí tienes un resumen general de tus invitaciones digitales y pedidos actuales. Comienza creando un nuevo cliente o modificando plantillas.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Nuevo Pedido
            </Button>
            <Button variant="outline" className="border-slate-800 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-900 flex items-center gap-2">
              Ver Catálogo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="border-slate-900 bg-slate-900/20 backdrop-blur-sm shadow-md text-slate-100 hover:border-slate-800 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {stat.title}
                </CardTitle>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r ${stat.color} text-white shadow-md shadow-violet-500/10`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Secondary section: Recent activity placeholder */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-900 bg-slate-900/20 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-400" />
              Próximos Eventos
            </CardTitle>
            <CardDescription className="text-slate-400">
              Eventos programados para las siguientes semanas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-colors">
              <div>
                <p className="font-semibold text-white">Boda Ana & Carlos</p>
                <p className="text-xs text-slate-500">Template: Boda Elegante</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-violet-400">18 Ago, 2026</p>
                <span className="inline-block rounded-full bg-violet-900/20 px-2 py-0.5 text-3xs font-medium text-violet-400 ring-1 ring-violet-500/20">En Producción</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-colors">
              <div>
                <p className="font-semibold text-white">XV Años Sofia</p>
                <p className="text-xs text-slate-500">Template: XV Moderno</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-violet-400">05 Sep, 2026</p>
                <span className="inline-block rounded-full bg-emerald-900/20 px-2 py-0.5 text-3xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">Pagado</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-900 bg-slate-900/20 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-400" />
              Clientes Recientes
            </CardTitle>
            <CardDescription className="text-slate-400">
              Últimos clientes registrados en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 font-bold">
                  ML
                </div>
                <div>
                  <p className="font-semibold text-white">María López</p>
                  <p className="text-xs text-slate-500">Tel: 5512345678</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-900/20 px-2.5 py-0.5 text-xs font-medium text-blue-400 ring-1 ring-blue-500/20">Instagram</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 font-bold">
                  RG
                </div>
                <div>
                  <p className="font-semibold text-white">Rodrigo Gómez</p>
                  <p className="text-xs text-slate-500">Tel: 5598765432</p>
                </div>
              </div>
              <span className="rounded-full bg-green-900/20 px-2.5 py-0.5 text-xs font-medium text-green-400 ring-1 ring-green-500/20">Referido</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
