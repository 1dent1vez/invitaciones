"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2, 
  Users,
  Sparkles,
  Phone,
  Mail,
  FileText
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Cliente } from "@prisma/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createClienteAction,
  updateClienteAction,
  deleteClienteAction
} from "./actions";
import { ClienteInput } from "@/types";


const clienteSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  telefono: z.string().optional().nullable().transform(val => val || ""),
  fuente: z.enum(["tienda", "instagram", "whatsapp", "referido"], {
    message: "Selecciona una fuente válida",
  }),
  email: z.string()
    .email("El correo electrónico no es válido")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform(val => val || ""),
  notas: z.string().optional().nullable().transform(val => val || ""),
});

interface ClientesClientProps {
  initialClientes: Cliente[];
}

export function ClientesClient({ initialClientes }: ClientesClientProps) {
  const router = useRouter();
  const [clientes, setClientes] = useState(initialClientes);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClienteInput>({
    resolver: zodResolver(clienteSchema) as unknown as Resolver<ClienteInput>,
    defaultValues: {
      nombre: "",
      telefono: "",
      fuente: "tienda",
      email: "",
      notas: "",
    },
  });

  const handleOpenAdd = () => {
    setEditingCliente(null);
    setError(null);
    reset({
      nombre: "",
      telefono: "",
      fuente: "tienda",
      email: "",
      notas: "",
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setError(null);
    reset({
      nombre: cliente.nombre,
      telefono: cliente.telefono || "",
      fuente: cliente.fuente as "tienda" | "instagram" | "whatsapp" | "referido",
      email: cliente.email || "",
      notas: cliente.notas || "",
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: ClienteInput) => {
    setIsLoading(true);
    setError(null);
    try {
      if (editingCliente) {
        const res = await updateClienteAction(editingCliente.id, data);
        if (res.success) {
          setClientes(prev =>
            prev.map(c => (c.id === editingCliente.id ? { ...c, ...data } : c))
          );
          setIsOpen(false);
          router.push("/admin/clientes");
          router.refresh();
        } else {
          setError(res.error || "Ocurrió un error al actualizar");
        }
      } else {
        const res = await createClienteAction(data);
        if (res.success && res.data) {
          const newClient = {
            id: res.data.id,
            nombre: data.nombre,
            telefono: data.telefono || null,
            email: data.email || null,
            fuente: data.fuente,
            notas: data.notas || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setClientes(prev => [newClient, ...prev]);
          setIsOpen(false);
          router.push("/admin/clientes");
          router.refresh();
        } else {
          setError(res.error || "Ocurrió un error al crear");
        }
      }
    } catch {
      setError("Error inesperado en el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este cliente?")) return;

    try {
      const res = await deleteClienteAction(id);
      if (res.success) {
        setClientes(prev => prev.filter(c => c.id !== id));
      } else {
        alert(res.error || "No se pudo eliminar el cliente");
      }
    } catch {
      alert("Error al intentar eliminar");
    }
  };

  // Filter clients client-side for immediate search response
  const filteredClientes = clientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
    (c.telefono && c.telefono.includes(search))
  );

  const getSourceBadge = (source: string) => {
    switch (source) {
      case "instagram":
        return <span className="inline-flex items-center rounded-full bg-pink-500/10 px-2.5 py-0.5 text-xs font-semibold text-pink-400 ring-1 ring-pink-500/20">Instagram</span>;
      case "whatsapp":
        return <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">WhatsApp</span>;
      case "referido":
        return <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 ring-1 ring-amber-500/20">Referido</span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20">Tienda</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-violet-400" />
            Clientes
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Gestiona la información de contacto y origen de tus clientes.
          </p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          className="bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Registrar Cliente
        </Button>
      </div>

      {/* Filter and search */}
      <div className="flex items-center max-w-md relative">
        <Search className="absolute left-3 h-4 w-4 text-slate-500" />
        <Input
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 border-slate-900 bg-slate-900/40 text-slate-100 placeholder:text-slate-500 focus-visible:ring-violet-500 focus-visible:ring-offset-slate-950"
        />
      </div>

      {/* Clients Table */}
      <div className="rounded-xl border border-slate-900 bg-slate-900/10 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-950/40">
            <TableRow className="border-b border-slate-900 hover:bg-transparent">
              <TableHead className="text-slate-400 font-semibold">Nombre</TableHead>
              <TableHead className="text-slate-400 font-semibold">Teléfono</TableHead>
              <TableHead className="text-slate-400 font-semibold">Correo Electrónico</TableHead>
              <TableHead className="text-slate-400 font-semibold">Origen</TableHead>
              <TableHead className="text-slate-400 font-semibold">Notas</TableHead>
              <TableHead className="text-right text-slate-400 font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClientes.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="h-24 text-center text-slate-500 italic">
                  No se encontraron clientes registrados.
                </TableCell>
              </TableRow>
            ) : (
              filteredClientes.map((cliente) => (
                <TableRow key={cliente.id} className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-colors">
                  <TableCell className="font-medium text-white">{cliente.nombre}</TableCell>
                  <TableCell className="text-slate-300">
                    {cliente.telefono ? (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-500" />
                        {cliente.telefono}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {cliente.email ? (
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                        {cliente.email}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getSourceBadge(cliente.fuente)}</TableCell>
                  <TableCell className="text-slate-400 max-w-xs truncate">
                    {cliente.notas ? (
                      <span className="flex items-center gap-1.5" title={cliente.notas}>
                        <FileText className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                        {cliente.notas}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(cliente)}
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-900"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(cliente.id)}
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

      {/* Add / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border-slate-800 bg-slate-900 text-slate-100 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              {editingCliente ? "Editar Cliente" : "Registrar Nuevo Cliente"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Llena los campos requeridos para {editingCliente ? "actualizar" : "guardar"} la información.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Nombre */}
            <div className="space-y-1.5">
              <label htmlFor="nombre" className="text-sm font-medium text-slate-300">
                Nombre Completo <span className="text-violet-400">*</span>
              </label>
              <input
                id="nombre"
                placeholder="Ej. María López"
                className={cn(
                  "flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/60 text-slate-100 placeholder:text-slate-600 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
                  errors.nombre && "border-rose-500 focus-visible:ring-rose-500"
                )}
                disabled={isLoading}
                aria-invalid={!!errors.nombre}
                {...register("nombre")}
              />
              {errors.nombre && (
                <p className="text-xs font-semibold text-rose-500">{errors.nombre.message}</p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-1.5">
              <label htmlFor="telefono" className="text-sm font-medium text-slate-300">
                Teléfono
              </label>
              <input
                id="telefono"
                placeholder="Ej. 5512345678"
                className={cn(
                  "flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/60 text-slate-100 placeholder:text-slate-600 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
                  errors.telefono && "border-rose-500 focus-visible:ring-rose-500"
                )}
                disabled={isLoading}
                aria-invalid={!!errors.telefono}
                {...register("telefono")}
              />
              {errors.telefono && (
                <p className="text-xs font-semibold text-rose-500">{errors.telefono.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="text"
                placeholder="Ej. maria@example.com"
                className={cn(
                  "flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/60 text-slate-100 placeholder:text-slate-600 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
                  errors.email && "border-rose-500 focus-visible:ring-rose-500"
                )}
                disabled={isLoading}
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs font-semibold text-rose-500">{errors.email.message}</p>
              )}
            </div>

            {/* Fuente / Origen */}
            <div className="space-y-1.5">
              <label htmlFor="fuente" className="text-sm font-medium text-slate-300">
                Origen / Canal <span className="text-violet-400">*</span>
              </label>
              <select
                id="fuente"
                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/60 text-slate-100 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50"
                disabled={isLoading}
                {...register("fuente")}
              >
                <option value="tienda" className="bg-slate-900">Tienda</option>
                <option value="instagram" className="bg-slate-900">Instagram</option>
                <option value="whatsapp" className="bg-slate-900">WhatsApp</option>
                <option value="referido" className="bg-slate-900">Referido</option>
              </select>
              {errors.fuente && (
                <p className="text-xs font-semibold text-rose-500">{errors.fuente.message}</p>
              )}
            </div>

            {/* Notas */}
            <div className="space-y-1.5">
              <label htmlFor="notas" className="text-sm font-medium text-slate-300">
                Notas / Detalles Adicionales
              </label>
              <textarea
                id="notas"
                placeholder="Ej. Detalles especiales sobre el pedido del cliente"
                rows={3}
                className="flex w-full rounded-md border border-slate-800 bg-slate-950/60 text-slate-100 px-3 py-2 text-sm placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 resize-none"
                disabled={isLoading}
                {...register("notas")}
              />
              {errors.notas && (
                <p className="text-xs font-semibold text-rose-500">{errors.notas.message}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm font-medium text-rose-400">
                {error}
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-violet-500/10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
