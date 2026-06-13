import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'El slug es requerido' }, { status: 400 });
    }

    const pedido = await prisma.pedido.findUnique({
      where: { slug },
    });

    if (!pedido) {
      return NextResponse.json({ success: false, error: 'El pedido no existe' }, { status: 404 });
    }

    // Get IP and UserAgent from body or request headers as fallback
    const ip =
      body.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    const userAgent = body.userAgent || request.headers.get('user-agent');

    const newVisita = await prisma.visita.create({
      data: {
        pedidoId: pedido.id,
        ip: ip || null,
        userAgent: userAgent || null,
      },
    });

    return NextResponse.json({ success: true, data: newVisita });
  } catch (err) {
    console.error('[POST /api/analytics]', err);
    return NextResponse.json(
      { success: false, error: 'Error al registrar la visita en analíticas' },
      { status: 500 }
    );
  }
}
