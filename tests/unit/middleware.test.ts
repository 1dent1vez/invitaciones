import { describe, it, expect, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '@/middleware';
import { verifySession } from '@/lib/auth';

vi.mock('@/lib/auth', () => ({
  verifySession: vi.fn(),
}));

describe('Middleware Route Protection Tests', () => {
  it('debe permitir continuar si la ruta no está protegida', async () => {
    const req = new NextRequest('http://localhost:3000/i/sofia-esencial');
    const res = await middleware(req);
    expect(res).toBeDefined();
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('debe redirigir a /login si accede a /admin sin sesión activa', async () => {
    vi.mocked(verifySession).mockResolvedValue(false);
    const req = new NextRequest('http://localhost:3000/admin/dashboard');

    const res = await middleware(req);
    expect(res).toBeDefined();
    expect(res.status).toBe(307);
    expect(res.headers.get('Location')).toContain('/login');
  });

  it('debe retornar 401 si accede a /api/admin sin sesión activa', async () => {
    vi.mocked(verifySession).mockResolvedValue(false);
    const req = new NextRequest('http://localhost:3000/api/admin/pedidos');

    const res = await middleware(req);
    expect(res).toBeDefined();
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('No autorizado');
  });

  it('debe permitir continuar si la sesión es válida para /admin', async () => {
    vi.mocked(verifySession).mockResolvedValue(true);
    const req = new NextRequest('http://localhost:3000/admin/pedidos');
    req.cookies.set('admin_session', 'valid_token');

    const res = await middleware(req);
    expect(res).toBeDefined();
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });
});
