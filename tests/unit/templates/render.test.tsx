import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BodaElegante } from "@/components/templates/BodaElegante";
import { XVModerno } from "@/components/templates/XVModerno";
import { BabyShower } from "@/components/templates/BabyShower";
import { CumpleanosFiesta } from "@/components/templates/CumpleanosFiesta";
import { InvitacionData } from "@/types";

const mockBoda: InvitacionData = {
  nombres: "María & Juan",
  fecha: "2026-10-24T18:00:00Z",
  ubicacion: "Salón Real, Av. Principal #123",
  mensaje: "Nuestra Boda",
  dressCode: "Formal",
  padres: "Padres de la novia",
  padrinos: "Padrinos de honor",
};

const mockXV: InvitacionData = {
  nombres: "Sofía Alejandra",
  fecha: "2026-09-12T19:00:00Z",
  ubicacion: "Jardín de los Ensuños",
  mensaje: "Mis Quince Años",
  dressCode: "Elegante",
  musicaUrl: "https://example.com/audio.mp3",
};

const mockBaby: InvitacionData = {
  nombres: "Laura & Carlos",
  nombreBebe: "Emma Lucía",
  fecha: "2026-08-08T16:00:00Z",
  ubicacion: "Jardín Los Tulipanes",
  mensaje: "Baby Shower de Emma",
  regalosDatos: "Liverpool",
};

const mockCumple: InvitacionData = {
  nombres: "Santiago",
  fecha: "2026-07-25T20:00:00Z",
  ubicacion: "Club Campestre",
  mensaje: "Mis 30 años",
  regalosDatos: "Efectivo",
};

describe("Template Rendering", () => {
  it("renderiza BodaElegante correctamente", () => {
    render(<BodaElegante data={mockBoda} />);
    expect(screen.getByText(/María/i)).toBeInTheDocument();
    expect(screen.getByText(/Salón Real/i)).toBeInTheDocument();
  });

  it("renderiza XVModerno correctamente", () => {
    render(<XVModerno data={mockXV} />);
    expect(screen.getByText(/Sofía Alejandra/i)).toBeInTheDocument();
    expect(screen.getByText(/Jardín de los Ensuños/i)).toBeInTheDocument();
  });

  it("renderiza BabyShower correctamente", () => {
    render(<BabyShower data={mockBaby} />);
    expect(screen.getByRole("heading", { name: "Baby Shower" })).toBeInTheDocument();
    expect(screen.getByText(/Emma Lucía/i)).toBeInTheDocument();
  });

  it("renderiza CumpleanosFiesta correctamente", () => {
    render(<CumpleanosFiesta data={mockCumple} />);
    expect(screen.getByText(/Santiago/i)).toBeInTheDocument();
    expect(screen.getByText(/Club Campestre/i)).toBeInTheDocument();
  });
});
