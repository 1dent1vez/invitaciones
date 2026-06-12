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
    const brandTitle = screen.getAllByText(/¡Ábreme!/i);
    expect(brandTitle.length).toBeGreaterThan(0);

    // Verificar presencia del CTA "Ver ejemplos"
    const ctaLink = screen.getByText(/Ver ejemplos/i);
    expect(ctaLink).toBeInTheDocument();
  });

  it("muestra las secciones clave: características, ejemplos y precios", () => {
    render(
      <ToastProvider>
        <LandingPage />
      </ToastProvider>
    );

    // Verificar los pasos de cómo funciona
    expect(screen.getByText(/Elige tu paquete/i)).toBeInTheDocument();
    expect(screen.getByText(/Personaliza tu diseño/i)).toBeInTheDocument();
    expect(screen.getByText(/Comparte y celebra/i)).toBeInTheDocument();

    // Verificar sección ejemplos/galería/demo
    expect(screen.getByText(/Así se ve tu invitación/i)).toBeInTheDocument();

    // Verificar sección precios
    expect(screen.getByText(/Elige el plan perfecto para tu celebración/i)).toBeInTheDocument();
  });
});
