Contexto:
@src/app/(admin)/admin/pedidos/[id]/page.tsx
@src/app/(admin)/admin/pedidos/[id]/detalle-client.tsx
@src/app/(admin)/admin/pedidos/page.tsx
@src/components/templates/cumpleanos/CumpleEsencial.tsx
@src/lib/paquetes.ts
@src/types/index.ts
@src/components/ui/
@tailwind.config.ts

Prompt: "🎨 REDISEÑO COMPLETO — Vista de Detalle del Pedido (Dashboard unificado: Pedido + Cliente + Pago + Asistencia + QR)

## OBJETIVO PRINCIPAL
Rediseñar la vista de detalle de un pedido para que el admin vea TODA la información relevante en un solo vistazo, con jerarquía visual clara, datos accionables y diseño profesional tipo SaaS. Debe sentirse como un CRM moderno, no como una tabla de Excel.

---

## 📐 ARQUITECTURA DE PANTALLA: DASHBOARD UNIFICADO

### Layout General (Desktop ≥1024px)
```
┌─────────────────────────────────────────────────────────────────────┐
│ [← Volver]  Pedido #123  │  Status: ✅ Entregado  │  [✏️ Editar]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐  ┌─────────────────────────────────────────────┐ │
│  │              │  │                                             │ │
│  │   TARJETA    │  │         PESTAÑAS DE CONTENIDO               │ │
│  │   RESUMEN    │  │   ┌────┬─────┬─────┬─────┬─────┐          │ │
│  │   (Sticky)   │  │   │Gen.│Pago │Asist│Analít│Accion│         │ │
│  │              │  │   └────┴─────┴─────┴─────┴─────┘          │ │
│  │  [Foto del   │  │                                             │ │
│  │   festejado] │  │   [CONTENIDO DE LA PESTAÑA ACTIVA]         │ │
│  │              │  │                                             │ │
│  │  Nombre      │  │                                             │ │
│  │  Paquete     │  │                                             │ │
│  │  Fecha evento│  │                                             │ │
│  │              │  │                                             │ │
│  │  [QR Code]   │  │                                             │ │
│  │  [URL Pública│  │                                             │ │
│  │   copiable]  │  │                                             │ │
│  │              │  │                                             │ │
│  │  [🚀 Ver     │  │                                             │ │
│  │   Invitación]│  │                                             │ │
│  │              │  │                                             │ │
│  └──────────────┘  └─────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Mobile (<1024px): Stack vertical con tarjeta resumen colapsable
```
┌─────────────────────────────┐
│ [←] Pedido #123 [✏️]        │
├─────────────────────────────┤
│ ▼ Tarjeta resumen          │
│   [Foto] Nombre            │
│   Paquete | Fecha | Status │
│   [QR] [URL] [Ver]         │
├─────────────────────────────┤
│ [Tabs scrollable horizontal]│
├─────────────────────────────┤
│ [Contenido de pestaña]      │
└─────────────────────────────┘
```

---

## 🎨 DISEÑO VISUAL

### Paleta
- Fondo: `#F8F9FA` (light) / `#0A0A0A` (dark)
- Tarjeta resumen: gradiente sutil del color primario del evento (10% opacidad)
- Cards: `#FFFFFF` / `#171717`
- Éxito: `#22C55E` | Warning: `#EAB308` | Error: `#EF4444` | Info: `#3B82F6`
- Texto: `#171717` / `#FAFAFA`
- Muted: `#737373` / `#A3A3A3`
- Bordes: `#E5E5E5` / `#262626`

### Tipografía
- Título pedido: `text-2xl font-bold tracking-tight`
- Sección: `text-lg font-semibold`
- Label: `text-xs uppercase tracking-wider text-muted-foreground font-medium`
- Valor: `text-base font-medium`
- Monospace (montos, IDs): `font-mono text-sm`

---

## 🧩 COMPONENTES

### 1. HEADER STICKY
```tsx
<header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
  <div className="flex items-center justify-between h-14 px-6">
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/admin/pedidos"><ArrowLeft className="w-5 h-5" /></Link>
      </Button>
      <div>
        <h1 className="text-lg font-semibold">Pedido #{pedido.numero}</h1>
        <p className="text-xs text-muted-foreground">Creado {formatDate(pedido.createdAt)}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <StatusBadge status={pedido.estado} />
      <Button variant="outline" size="sm" asChild>
        <Link href={`/admin/pedidos/${id}/editar`}><Pencil className="w-4 h-4 mr-2" />Editar</Link>
      </Button>
    </div>
  </div>
</header>
```

### 2. TARJETA RESUMEN (Sidebar izquierda, sticky)
```tsx
<aside className="w-80 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r bg-card">
  <div className="p-6 space-y-6">

    {/* Foto del festejado */}
    <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20">
      <Image 
        src={datos.fotoPortada || '/placeholder-avatar.jpg'} 
        alt={datos.nombre}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <Badge className="bg-primary text-white text-xs">{paquete.nombre}</Badge>
      </div>
    </div>

    {/* Nombre + edad */}
    <div className="text-center">
      <h2 className="text-xl font-bold">{datos.nombre}</h2>
      <p className="text-muted-foreground">{datos.edad} años</p>
    </div>

    {/* Divider */}
    <Separator />

    {/* Info rápida */}
    <div className="space-y-3">
      <InfoRow icon={Calendar} label="Fecha del evento" value={formatFechaMX(pedido.fechaEvento)} />
      <InfoRow icon={Clock} label="Hora" value={formatHora(pedido.fechaEvento)} />
      <InfoRow icon={MapPin} label="Lugar" value={pedido.direccion} truncate />
      <InfoRow icon={User} label="Cliente" value={cliente.nombre} />
      <InfoRow icon={Phone} label="Teléfono" value={cliente.telefono} />
      <InfoRow icon={Mail} label="Email" value={cliente.email} />
    </div>

    <Separator />

    {/* QR + URL */}
    <div className="space-y-3">
      <Label className="text-xs uppercase">Invitación pública</Label>

      {pedido.estadoInvitacion === 'PUBLICADA' ? (
        <>
          <div className="bg-white p-3 rounded-lg mx-auto w-fit">
            <QRCodeSVG value={pedido.urlPublica} size={160} />
          </div>

          <div className="flex items-center gap-2 bg-muted rounded-lg p-2">
            <input 
              value={pedido.urlPublica} 
              readOnly 
              className="bg-transparent text-xs flex-1 outline-none"
            />
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={copyUrl}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <a href={pedido.urlPublica} target="_blank" rel="noopener">
                <ExternalLink className="w-4 h-4 mr-2" /> Ver
              </a>
            </Button>
            <Button variant="outline" size="sm" className="w-full" onClick={downloadQR}>
              <Download className="w-4 h-4 mr-2" /> QR
            </Button>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(`¡Te invito! 🎉 ${pedido.urlPublica}`)}`}
              target="_blank"
            >
              <MessageCircle className="w-4 h-4 mr-2" /> Compartir por WhatsApp
            </a>
          </Button>
        </>
      ) : (
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            La invitación aún no está publicada.
            <Button size="sm" variant="link" className="h-auto p-0" asChild>
              <Link href={`/admin/pedidos/${id}/editar`}>Publicar ahora →</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>

  </div>
</aside>
```

### 3. PESTAÑAS DE CONTENIDO

#### Tab: General
```tsx
<TabsContent value="general" className="space-y-6">

  {/* Grid de cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

    {/* Card: Timeline del pedido */}
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <History className="w-4 h-4" /> Timeline del pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Timeline>
          <TimelineItem 
            status="completed" 
            title="Pedido creado" 
            date={pedido.createdAt}
            description={`Por ${adminName}`}
          />
          <TimelineItem 
            status="completed" 
            title="Cuestionario enviado al cliente" 
            date={pedido.fechaCuestionarioEnviado}
          />
          <TimelineItem 
            status={pedido.datosInvitacion ? 'completed' : 'pending'}
            title="Cliente llenó cuestionario"
            date={pedido.fechaCuestionarioRespondido}
          />
          <TimelineItem 
            status={pedido.estadoInvitacion === 'PUBLICADA' ? 'completed' : 'pending'}
            title="Invitación publicada"
            date={pedido.fechaPublicacion}
          />
        </Timeline>
      </CardContent>
    </Card>

    {/* Card: Detalles del evento */}
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <PartyPopper className="w-4 h-4" /> Detalles del evento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <DataRow label="Tipo" value="Cumpleaños" />
        <DataRow label="Paquete" value={paquete.nombre} badge={paquete.precio} />
        <DataRow label="Fecha" value={formatFechaMX(pedido.fechaEvento)} />
        <DataRow label="Hora" value={formatHora(pedido.fechaEvento)} />
        <DataRow label="Dirección" value={pedido.direccion} multiline />
        {datos.dressCode && <DataRow label="Dress code" value={datos.dressCode} />}
      </CardContent>
    </Card>

    {/* Card: Datos del cliente */}
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <User className="w-4 h-4" /> Cliente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <DataRow label="Nombre" value={cliente.nombre} />
        <DataRow label="Teléfono" value={cliente.telefono} copyable />
        <DataRow label="Email" value={cliente.email} copyable />
        <DataRow label="WhatsApp" value={cliente.whatsapp || 'No proporcionado'} />
        <Button variant="outline" size="sm" className="w-full mt-2" asChild>
          <a href={`https://wa.me/${cleanPhone(cliente.telefono)}`} target="_blank">
            <MessageCircle className="w-4 h-4 mr-2" /> Abrir chat
          </a>
        </Button>
      </CardContent>
    </Card>

    {/* Card: Configuración de la invitación */}
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Settings className="w-4 h-4" /> Configuración
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <DataRow label="Color principal" value={
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: datos.colorPrimario }} />
            {datos.colorPrimario}
          </div>
        } />
        <DataRow label="Música" value={paquete.incluyeMusica ? 'Sí' : 'No incluido'} />
        <DataRow label="Galería" value={`${paquete.maxFotos} fotos máx.`} />
        <DataRow label="RSVP límite" value={datos.rsvpFechaLimite ? formatDate(datos.rsvpFechaLimite) : 'Sin límite'} />
      </CardContent>
    </Card>

  </div>
</TabsContent>
```

#### Tab: Pago
```tsx
<TabsContent value="pago" className="space-y-6">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

    {/* Card: Resumen de pago */}
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">💳 Estado de pago</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Montos */}
        <div className="grid grid-cols-3 gap-4">
          <AmountCard 
            label="Total" 
            amount={pedido.total} 
            highlight 
          />
          <AmountCard 
            label="Pagado" 
            amount={pedido.totalPagado} 
            variant="success" 
          />
          <AmountCard 
            label="Pendiente" 
            amount={pedido.total - pedido.totalPagado} 
            variant={pedido.total - pedido.totalPagado > 0 ? 'warning' : 'success'}
          />
        </div>

        {/* Barra de progreso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progreso de pago</span>
            <span className="font-medium">{Math.round((pedido.totalPagado / pedido.total) * 100)}%</span>
          </div>
          <Progress value={(pedido.totalPagado / pedido.total) * 100} className="h-2" />
        </div>

        {/* Historial de pagos */}
        <div>
          <h4 className="text-sm font-medium mb-3">Historial de pagos</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagos.map((pago) => (
                <TableRow key={pago.id}>
                  <TableCell>{formatDate(pago.fecha)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{pago.metodo}</Badge>
                  </TableCell>
                  <TableCell className="font-mono font-medium">${pago.monto}</TableCell>
                  <TableCell className="font-mono text-xs">{pago.referencia}</TableCell>
                  <TableCell><StatusBadge status={pago.estado} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <Button><Plus className="w-4 h-4 mr-2" /> Registrar pago</Button>
          <Button variant="outline"><Receipt className="w-4 h-4 mr-2" /> Generar recibo</Button>
        </div>

      </CardContent>
    </Card>

    {/* Card: Notas de pago */}
    <Card>
      <CardHeader>
        <CardTitle className="text-base">📝 Notas</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea 
          placeholder="Notas internas sobre pagos..."
          className="min-h-[200px]"
          defaultValue={pedido.notasPago}
        />
      </CardContent>
    </Card>

  </div>
</TabsContent>
```

#### Tab: Asistencia (RSVP)
```tsx
<TabsContent value="asistencia" className="space-y-6">

  {/* KPIs */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <KpiCard 
      label="Confirmados" 
      value={rsvpStats.confirmados} 
      icon={CheckCircle} 
      color="green"
      subtitle={`${rsvpStats.totalPaxConfirmados} personas`}
    />
    <KpiCard 
      label="Pendientes" 
      value={rsvpStats.pendientes} 
      icon={HelpCircle} 
      color="yellow"
    />
    <KpiCard 
      label="Rechazados" 
      value={rsvpStats.rechazados} 
      icon={XCircle} 
      color="red"
    />
    <KpiCard 
      label="Total invitados" 
      value={rsvpStats.total} 
      icon={Users} 
      color="blue"
      subtitle={`Capacidad: ${datos.rsvpMaxPax * rsvpStats.confirmados}`}
    />
  </div>

  {/* Lista de confirmaciones */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-base">Lista de confirmaciones</CardTitle>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="w-4 h-4 mr-2" /> Exportar CSV
        </Button>
        <Button variant="outline" size="sm" onClick={exportWhatsApp}>
          <MessageCircle className="w-4 h-4 mr-2" /> Compartir lista
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Pax</TableHead>
            <TableHead>Mensaje</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rsvps.map((rsvp) => (
            <TableRow key={rsvp.id}>
              <TableCell className="font-medium">{rsvp.nombre}</TableCell>
              <TableCell>{rsvp.pax} <Users className="w-3 h-3 inline" /></TableCell>
              <TableCell className="max-w-[200px] truncate">{rsvp.mensaje || '-'}</TableCell>
              <TableCell>{formatDate(rsvp.createdAt)}</TableCell>
              <TableCell>
                <Badge variant={rsvp.asiste ? 'default' : 'destructive'}>
                  {rsvp.asiste ? 'Asiste' : 'No asiste'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</TabsContent>
```

#### Tab: Analítica
```tsx
<TabsContent value="analitica" className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* Gráfico: Visitas a la invitación */}
    <Card>
      <CardHeader>
        <CardTitle className="text-base">👁️ Visitas a la invitación</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-end justify-between gap-2">
          {visitasPorDia.map((dia, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-primary/80 rounded-t-sm transition-all hover:bg-primary"
                style={{ height: `${(dia.visitas / maxVisitas) * 100}%` }}
                title={`${dia.fecha}: ${dia.visitas} visitas`}
              />
              <span className="text-[10px] text-muted-foreground">{dia.dia}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-muted-foreground">Total visitas</span>
          <span className="font-bold text-2xl">{totalVisitas}</span>
        </div>
      </CardContent>
    </Card>

    {/* Gráfico: Tasa de conversión RSVP */}
    <Card>
      <CardHeader>
        <CardTitle className="text-base">📊 Conversión RSVP</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          {/* Donut chart simple con CSS */}
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path
              className="text-muted"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="text-primary"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${tasaConversion}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">{tasaConversion}%</span>
          </div>
        </div>
      </CardContent>
    </Card>

  </div>
</TabsContent>
```

#### Tab: Acciones
```tsx
<TabsContent value="acciones" className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <ActionCard 
      icon={Rocket}
      title="Publicar / Despublicar"
      description={pedido.estadoInvitacion === 'PUBLICADA' 
        ? "La invitación está visible públicamente" 
        : "La invitación solo es visible para ti"
      }
      action={
        <Button 
          variant={pedido.estadoInvitacion === 'PUBLICADA' ? 'destructive' : 'default'}
        >
          {pedido.estadoInvitacion === 'PUBLICADA' ? 'Despublicar' : 'Publicar'}
        </Button>
      }
    />

    <ActionCard 
      icon={Copy}
      title="Duplicar pedido"
      description="Crea un nuevo pedido con los mismos datos"
      action={<Button variant="outline">Duplicar</Button>}
    />

    <ActionCard 
      icon={Mail}
      title="Reenviar cuestionario"
      description="Envía el link del cuestionario al cliente de nuevo"
      action={<Button variant="outline">Reenviar</Button>}
    />

    <ActionCard 
      icon={Trash2}
      title="Eliminar pedido"
      description="Esta acción no se puede deshacer"
      action={<Button variant="destructive" outline>Eliminar</Button>}
      danger
    />

  </div>
</TabsContent>
```

---

## 🎭 ANIMACIONES

```tsx
// Entrada de cards
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, staggerChildren: 0.1 }}
>
  {children}
</motion.div>

// Tab content
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.2 }}
  />
</AnimatePresence>
```

---

## 📱 RESPONSIVE

| Breakpoint | Layout |
|-----------|--------|
| < 768px | Stack vertical. Tarjeta resumen colapsable en acordeón. Tabs scrollable horizontal. |
| 768-1024px | Stack vertical. Tarjeta resumen en top como header expandido. |
| ≥1024px | Split: sidebar 320px fijo + content flexible. Tabs normales. |

---

## 🧪 VERIFICACIÓN

1. npm run build — sin errores
2. npx vitest run — tests pasan
3. Probar: abrir pedido existente, navegar tabs, copiar URL, ver QR, exportar CSV
4. Responsive: 375px, 768px, 1024px, 1440px

---

## 🚫 REGLAS
1. NO modificar API routes
2. NO modificar schema de Prisma
3. NO cambiar lógica de negocio (solo UI)
4. NO agregar dependencias nuevas
5. Backward compatibility: pedidos antiguos deben renderizar igual

---

## Commit:
git commit -m "redesign(admin): rediseña vista de detalle de pedido con dashboard unificado, timeline, KPIs y analítica"
