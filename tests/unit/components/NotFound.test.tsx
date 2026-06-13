import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';
import { describe, it, expect } from 'vitest';

describe('NotFound Component', () => {
  it('renderiza el contenido de invitación no encontrada correctamente', () => {
    render(<NotFound />);

    // Verify header text
    expect(screen.getByText(/Invitación No Encontrada/i)).toBeInTheDocument();

    // Verify helper instruction
    expect(screen.getByText(/el enlace de invitación no es válido/i)).toBeInTheDocument();

    // Verify back to home button
    const backButton = screen.getByRole('button', { name: /Volver al Inicio/i });
    expect(backButton).toBeInTheDocument();
  });
});
