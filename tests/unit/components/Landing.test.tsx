import { render, screen } from "@testing-library/react";
import LandingPage from "@/app/(public)/page";
import { describe, it, expect } from "vitest";
import { ToastProvider } from "@/components/ui/toast";

describe("LandingPage Component", () => {
  it("renderiza la landing page correctamente", () => {
    render(
      <ToastProvider>
        <LandingPage />
      </ToastProvider>
    );
    
    // Verificar que el título principal de la marca existe
    const brandTitle = screen.getAllByText(/Kilo Invitaciones/i);
    expect(brandTitle.length).toBeGreaterThan(0);

    // Verificar presencia del CTA "Ver ejemplos"
    const ctaButton = screen.getByRole("button", { name: /Ver ejemplos/i });
    expect(ctaButton).toBeInTheDocument();
  });

  it("muestra las secciones clave: características, ejemplos y precios", () => {
    render(
      <ToastProvider>
        <LandingPage />
      </ToastProvider>
    );

    // Verificar características
    expect(screen.getByText(/100% Responsivo/i)).toBeInTheDocument();
    expect(screen.getByText(/Ubicación GPS/i)).toBeInTheDocument();
    expect(screen.getByText(/Control de Asistencia/i)).toBeInTheDocument();

    // Verificar sección ejemplos/galería
    expect(screen.getByText(/Nuestros Diseños Inspiradores/i)).toBeInTheDocument();

    // Verificar sección precios
    expect(screen.getByText(/Planes Simples y Transparentes/i)).toBeInTheDocument();
  });
});
