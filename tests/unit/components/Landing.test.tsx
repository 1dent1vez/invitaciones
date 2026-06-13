import { render, screen, fireEvent } from '@testing-library/react';
import LandingPage from '@/app/(public)/page';
import { describe, it, expect, vi } from 'vitest';
import { ToastProvider } from '@/components/ui/toast';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

vi.mock('@/components/landing/HeroBox', () => ({
  default: ({ onOpen }: { onOpen: () => void }) => (
    <button data-testid="btn-abreme" onClick={onOpen}>
      Ábreme
    </button>
  ),
}));

describe('LandingPage Component', () => {
  it('renderiza la landing page correctamente', () => {
    render(
      <ToastProvider>
        <LandingPage />
      </ToastProvider>
    );

    // Verificar que el título principal de la marca existe
    const brandTitle = screen.getAllByText(/¡Ábreme!/i);
    expect(brandTitle.length).toBeGreaterThan(0);

    // Hacer click en el botón de abrir
    const openButton = screen.getByTestId('btn-abreme');
    fireEvent.click(openButton);

    // Verificar presencia del CTA "Ver Demo Completo"
    const ctaLink = screen.getByText(/Ver Demo Completo/i);
    expect(ctaLink).toBeInTheDocument();
  });

  it('muestra las secciones clave: características, ejemplos y precios', () => {
    render(
      <ToastProvider>
        <LandingPage />
      </ToastProvider>
    );

    // Hacer click en el botón de abrir
    const openButton = screen.getByTestId('btn-abreme');
    fireEvent.click(openButton);

    // Verificar los pasos de cómo funciona
    expect(screen.getByText(/Elige tu plan/i)).toBeInTheDocument();
    expect(screen.getByText(/Envía tus datos/i)).toBeInTheDocument();
    expect(screen.getByText(/Diseñamos con magia/i)).toBeInTheDocument();
    expect(screen.getByText(/Comparte por WhatsApp/i)).toBeInTheDocument();

    // Verificar sección ejemplos/galería/demo
    expect(screen.getByText(/Elige tu estilo favorito/i)).toBeInTheDocument();

    // Verificar sección precios
    expect(screen.getByText(/Elige el plan ideal para tu fiesta/i)).toBeInTheDocument();
  });
});
