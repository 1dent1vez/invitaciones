import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { CumplePremium } from '@/components/templates/cumpleanos/CumplePremium';
import { InvitacionData } from '@/types';

const mockDataPremium: InvitacionData = {
  nombre: 'Santiago Premium',
  edad: 30,
  fecha: '2026-12-31T20:00:00Z', // future date
  hora: '20:00',
  lugar: 'Terraza La Vista',
  direccion: 'Av. Insurgentes 123, CDMX',
  tipoCelebracion: 'Adultos',
  fotoPortada: 'https://example.com/portada.jpg',
  mensaje: 'Mis 30 años',
  musica: 'Fiesta',
  whatsapp: '5512345678',
  colorPrimario: '#f59e0b',
  colorSecundario: '#1f2937',
  fotosGaleria: ['https://example.com/g1.jpg'],
  dressCode: 'Casual',
  dressCodeDesc: 'Vente cómodo',
  mensajeFestejo: 'Gracias por venir',
  itinerario: '20:00 Bienvenida\n22:00 Pastel',
  datosRegalo: 'Efectivo',
  historiaEdad: 'Los 30 son lo máximo',
  historiaSeresQueridos: 'Familia es todo',
  historiaRecuerdo: 'Mi cumple 25',
  fotosExtra: ['https://example.com/e1.jpg'],
  buzonDeseos: true,
  pases: true,
  numPases: 2,
  tematica: 'Neon',
  videoURL: 'https://example.com/video.mp4',
  colorAcento: 'Dorado',
  cuentaRegresiva: true,
  confettiAnimacion: true,
  mensajeAgradecimiento: '¡Muchas gracias por celebrar conmigo!',
  fechaLimiteRSVP: '2026-12-25T20:00:00Z',
};

describe('CumplePremium Advanced Features', () => {
  it('renders countdown timer, confetti button, and thank you message', () => {
    render(<CumplePremium data={mockDataPremium} />);

    // Check countdown elements
    expect(screen.getByText('Días')).toBeInTheDocument();
    expect(screen.getByText('Hrs')).toBeInTheDocument();
    expect(screen.getByText('Min')).toBeInTheDocument();
    expect(screen.getByText('Seg')).toBeInTheDocument();

    // Check RSVP limit date card
    expect(screen.getByText('Límite para Confirmar')).toBeInTheDocument();
    expect(screen.getByText(/Antes del/i)).toBeInTheDocument();

    // Check message of thank you
    expect(screen.getByText('¡Muchas gracias por celebrar conmigo!')).toBeInTheDocument();

    // Check confetti trigger button 🎉 exists
    const confettiBtn = screen.getByTitle('Lanzar Confetti');
    expect(confettiBtn).toBeInTheDocument();
  });
});
