import { render } from '@testing-library/react';
import { EditorClient } from '@/app/(admin)/admin/pedidos/[id]/editar/editor-client';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('@/app/(admin)/admin/pedidos/[id]/editar/actions', () => {
  return {
    savePedidoDatosAction: vi.fn(() => Promise.resolve({ success: true, data: {} })),
    publicarInvitacionAction: vi.fn(() =>
      Promise.resolve({
        success: true,
        data: { slug: 'test-slug', urlPublica: 'http://localhost:3000/i/test-slug' },
      })
    ),
    generarQRAction: vi.fn(() =>
      Promise.resolve({ success: true, data: 'https://cloudinary.com/qr.png' })
    ),
    uploadImageAction: vi.fn(() =>
      Promise.resolve({ success: true, data: 'https://cloudinary.com/image.png' })
    ),
  };
});

describe('EditorClient defaultValues Tests', () => {
  const mockPedido = {
    id: 'pedido-123',
    clienteId: 'cliente-123',
    tipoEvento: 'cumpleanos',
    paquete: 'premium',
    fechaEvento: new Date('2026-12-18T18:00:00Z'),
    template: 'cumpleanos-premium',
    precio: 850.0,
    estado: 'cotizado',
    slug: null,
    urlPublica: null,
    qrUrl: null,
    datosInvitacion: {
      nombre: 'María Festejada',
      edad: 25,
      lugar: 'Salón de Fiestas',
      direccion: 'Calle Falsa 123',
      fotoPortada: 'https://example.com/portada-maria.jpg',
      tipoCelebracion: 'Sorpresa',
      mensajeFestejo: 'Bienvenidos a mi super fiesta!',
      itinerario: '18:00 Inicio — 20:00 Pastel',
      datosRegalo: 'Transferencia a CLABE 12345678',
      fotosGaleria: ['https://example.com/g1.jpg', 'https://example.com/g2.jpg'],
      colorPrimario: '#FF55AA',
      colorSecundario: '#2288FF',
      historiaEdad: 'Un año más de aprendizaje',
      historiaSeresQueridos: 'Agradecida con todos',
      historiaRecuerdo: 'El mejor cumpleaños de mi infancia',
      buzonDeseos: true,
      pases: true,
      numPases: 3,
      tematica: 'Neon',
      videoURL: 'https://youtube.com/watch?v=123',
      colorAcento: 'Rosa',
    },
    cliente: {
      id: 'cliente-123',
      nombre: 'María Cliente',
      fuente: 'instagram',
      telefono: null,
      email: null,
      notes: null,
    },
  };

  it('debe restaurar y cargar todos los campos de cumpleaños desde datosInvitacion', () => {
    const { container } = render(<EditorClient pedido={mockPedido as any} />);

    // Check input elements are initialized with mock values
    const nombreInput = container.querySelector('input[name="nombre"]') as HTMLInputElement;
    const edadInput = container.querySelector('input[name="edad"]') as HTMLInputElement;
    const lugarInput = container.querySelector('input[name="lugar"]') as HTMLInputElement;
    const direccionInput = container.querySelector(
      'textarea[name="direccion"]'
    ) as HTMLTextAreaElement;
    const fotoPortadaInput = container.querySelector(
      'input[name="fotoPortada"]'
    ) as HTMLInputElement;
    const tipoCelebracionInput = container.querySelector(
      'select[name="tipoCelebracion"]'
    ) as HTMLSelectElement;
    const mensajeFestejoInput = container.querySelector(
      'textarea[name="mensajeFestejo"]'
    ) as HTMLTextAreaElement;
    const itinerarioInput = container.querySelector(
      'textarea[name="itinerario"]'
    ) as HTMLTextAreaElement;
    const datosRegaloInput = container.querySelector(
      'textarea[name="datosRegalo"]'
    ) as HTMLTextAreaElement;
    const colorPrimarioInput = container.querySelector(
      'input[name="colorPrimario"]'
    ) as HTMLInputElement;
    const colorSecundarioInput = container.querySelector(
      'input[name="colorSecundario"]'
    ) as HTMLInputElement;
    const historiaEdadInput = container.querySelector(
      'textarea[name="historiaEdad"]'
    ) as HTMLTextAreaElement;
    const historiaSeresQueridosInput = container.querySelector(
      'textarea[name="historiaSeresQueridos"]'
    ) as HTMLTextAreaElement;
    const historiaRecuerdoInput = container.querySelector(
      'textarea[name="historiaRecuerdo"]'
    ) as HTMLTextAreaElement;
    const buzonDeseosInput = container.querySelector(
      'input[name="buzonDeseos"]'
    ) as HTMLInputElement;
    const pasesInput = container.querySelector('input[name="pases"]') as HTMLInputElement;
    const numPasesInput = container.querySelector('input[name="numPases"]') as HTMLInputElement;
    const tematicaInput = container.querySelector('select[name="tematica"]') as HTMLSelectElement;
    const videoURLInput = container.querySelector('input[name="videoURL"]') as HTMLInputElement;
    const colorAcentoInput = container.querySelector(
      'select[name="colorAcento"]'
    ) as HTMLSelectElement;

    expect(nombreInput?.value).toBe('María Festejada');
    expect(edadInput?.value).toBe('25');
    expect(lugarInput?.value).toBe('Salón de Fiestas');
    expect(direccionInput?.value).toBe('Calle Falsa 123');
    expect(fotoPortadaInput?.value).toBe('https://example.com/portada-maria.jpg');
    expect(tipoCelebracionInput?.value).toBe('Sorpresa');
    expect(mensajeFestejoInput?.value).toBe('Bienvenidos a mi super fiesta!');
    expect(itinerarioInput?.value).toBe('18:00 Inicio — 20:00 Pastel');
    expect(datosRegaloInput?.value).toBe('Transferencia a CLABE 12345678');
    expect(colorPrimarioInput?.value).toBe('#FF55AA');
    expect(colorSecundarioInput?.value).toBe('#2288FF');
    expect(historiaEdadInput?.value).toBe('Un año más de aprendizaje');
    expect(historiaSeresQueridosInput?.value).toBe('Agradecida con todos');
    expect(historiaRecuerdoInput?.value).toBe('El mejor cumpleaños de mi infancia');
    expect(buzonDeseosInput?.checked).toBe(true);
    expect(pasesInput?.checked).toBe(true);
    expect(numPasesInput?.value).toBe('3');
    expect(tematicaInput?.value).toBe('Neon');
    expect(videoURLInput?.value).toBe('https://youtube.com/watch?v=123');
    expect(colorAcentoInput?.value).toBe('Rosa');
  });
});
