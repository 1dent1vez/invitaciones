import { NextRequest, NextResponse } from 'next/server';
import { generateQRBuffer } from '@/lib/qr';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'El parámetro URL es requerido' },
        { status: 400 }
      );
    }

    const qrBuffer = await generateQRBuffer(url);

    return new Response(new Uint8Array(qrBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('[GET /api/qr]', err);
    return NextResponse.json(
      { success: false, error: 'Error al generar el código QR' },
      { status: 500 }
    );
  }
}
