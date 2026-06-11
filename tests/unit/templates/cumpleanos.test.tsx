import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import { CumpleEsencial } from "@/components/templates/cumpleanos/CumpleEsencial";
import { CumpleCompleta } from "@/components/templates/cumpleanos/CumpleCompleta";
import { CumplePremium } from "@/components/templates/cumpleanos/CumplePremium";
import { InvitacionData } from "@/types";

const mockDataEsencial: InvitacionData = {
  nombre: "Santiago",
  edad: 30,
  fecha: "2026-07-25T20:00:00Z",
  hora: "20:00",
  lugar: "Terraza La Vista",
  direccion: "Av. Insurgentes 123, CDMX",
  tipoCelebracion: "Adultos",
  fotoPortada: "https://example.com/portada.jpg",
  mensaje: "Mis 30 años",
  musica: "Fiesta",
  whatsapp: "5512345678",
  colorPrimario: "#f59e0b",
  colorSecundario: "#1f2937",
};

const mockDataCompleta: InvitacionData = {
  ...mockDataEsencial,
  fotosGaleria: ["https://example.com/g1.jpg"],
  dressCode: "Casual",
  dressCodeDesc: "Vente cómodo",
  mensajeFestejo: "Gracias por venir",
  itinerario: "20:00 Bienvenida\n22:00 Pastel",
  datosRegalo: "Efectivo",
};

const mockDataPremium: InvitacionData = {
  ...mockDataCompleta,
  historiaEdad: "Los 30 son lo máximo",
  historiaSeresQueridos: "Familia es todo",
  historiaRecuerdo: "Mi cumple 25",
  fotosExtra: ["https://example.com/e1.jpg"],
  buzonDeseos: true,
  pases: true,
  numPases: 2,
  tematica: "Neon",
  videoURL: "https://example.com/video.mp4",
  colorAcento: "Dorado",
};

describe("Birthday Templates Rendering Tests", () => {
  it("renderiza CumpleEsencial correctamente", () => {
    render(<CumpleEsencial data={mockDataEsencial} />);
    expect(screen.getByText("Santiago")).toBeInTheDocument();
    expect(screen.getAllByText(/30/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Terraza La Vista")).toBeInTheDocument();
    expect(screen.getByTestId("tipo-celebracion-badge")).toHaveTextContent("🍷 Adultos");
    expect(screen.getByTestId("whatsapp-confirmar")).toHaveAttribute("href", "https://wa.me/5512345678");
  });

  it("renderiza CumpleCompleta correctamente", () => {
    render(<CumpleCompleta data={mockDataCompleta} />);
    expect(screen.getByText("Santiago")).toBeInTheDocument();
    expect(screen.getAllByText(/30/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Terraza La Vista")).toBeInTheDocument();
    expect(screen.getByText("Código de Vestimenta")).toBeInTheDocument();
    expect(screen.getByText("Casual")).toBeInTheDocument();
    expect(screen.getByTestId("tipo-celebracion-badge")).toHaveTextContent("🍷 Adultos");
    expect(screen.getByTestId("whatsapp-confirmar")).toHaveAttribute("href", "https://wa.me/5512345678");
  });

  it("renderiza CumplePremium correctamente", () => {
    render(<CumplePremium data={mockDataPremium} />);
    expect(screen.getByText("Santiago")).toBeInTheDocument();
    expect(screen.getAllByText(/30/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Terraza La Vista")).toBeInTheDocument();
    expect(screen.getByText(/Galería de Recuerdos/i)).toBeInTheDocument();
    expect(screen.getByText(/Buzón de Deseos/i)).toBeInTheDocument();
  });

  it("optimiza la foto de portada si proviene de cloudinary en CumpleEsencial", () => {
    const mockCloudinaryData = {
      ...mockDataEsencial,
      fotoPortada: "https://res.cloudinary.com/demo/image/upload/v12345/portada.jpg",
    };
    render(<CumpleEsencial data={mockCloudinaryData} />);
    const img = screen.getByRole("img", { name: /cumpleañero/i });
    expect(img).toHaveAttribute("src", "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/v12345/portada.jpg");
  });

  it("los botones táctiles son de mínimo 44px de alto (clase h-11) en CumpleEsencial", () => {
    render(<CumpleEsencial data={mockDataEsencial} />);
    const whatsappBtn = screen.getByTestId("whatsapp-confirmar");
    expect(whatsappBtn).toHaveClass("h-11");
  });
});
