'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  Sparkles,
  Mail,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { logoutAction } from '../login/actions';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Panel Control', href: '/admin', icon: LayoutDashboard },
  { name: 'Clientes', href: '/admin/clientes', icon: Users },
  { name: 'Pedidos', href: '/admin/pedidos', icon: FileText },
  { name: 'Leads', href: '/admin/leads', icon: Mail },
  { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await logoutAction();
      if (result.success) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const NavigationList = ({
    className,
    onItemClick,
  }: {
    className?: string;
    onItemClick?: () => void;
  }) => (
    <nav className={cn('space-y-1.5', className)}>
      {sidebarItems.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/10'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            )}
          >
            <Icon className="h-4.5 w-4.5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-slate-900 bg-slate-900/40 backdrop-blur-xl z-20">
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-900">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-bold text-white text-lg tracking-tight"
          >
            <Sparkles className="h-5 w-5 text-violet-400" />
            <span>Kilo Invitaciones</span>
          </Link>
        </div>
        <div className="flex-1 flex flex-col justify-between py-6 px-4">
          <NavigationList />
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start gap-3 px-3 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-colors"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-4.5 w-4.5" />
            {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
          </Button>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Header */}
        <header className="sticky top-0 h-16 border-b border-slate-900 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            {/* Mobile Navigation Trigger */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-slate-400 hover:text-white hover:bg-slate-900"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                }
              />
              <SheetContent
                side="left"
                className="w-64 border-r border-slate-900 bg-slate-950 p-0 text-slate-100"
              >
                <div className="flex h-16 items-center px-6 border-b border-slate-900">
                  <span className="flex items-center gap-2 font-bold text-white text-lg">
                    <Sparkles className="h-5 w-5 text-violet-400" />
                    Kilo Invitaciones
                  </span>
                </div>
                <div className="flex flex-col justify-between h-[calc(100vh-4rem)] p-4">
                  <NavigationList onItemClick={() => setIsMobileOpen(false)} />
                  <Button
                    variant="ghost"
                    className="flex w-full items-center justify-start gap-3 px-3 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-colors"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="h-4.5 w-4.5" />
                    {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <h1 className="text-sm font-semibold text-slate-400 hidden sm:block">
              {pathname === '/admin'
                ? 'Dashboard'
                : sidebarItems.find((i) => pathname.startsWith(i.href))?.name ?? 'Administración'}
            </h1>
          </div>

          {/* User profile dropdown placeholder / avatar */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-white">Admin Principal</span>
              <span className="text-xs text-slate-400">Administrador</span>
            </div>
            <Avatar className="ring-2 ring-violet-500/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-violet-600/20 text-violet-400 font-bold">
                AD
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
