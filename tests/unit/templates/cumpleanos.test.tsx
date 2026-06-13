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
  mesaRegalos: true,
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
  it("renderiza CumpleEsencial correctamente (No-Regresión)", () => {
    render(<CumpleEsencial data={mockDataEsencial} />);
    expect(screen.getByText("Santiago")).toBeInTheDocument();
    expect(screen.getAllByText(/30/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Terraza La Vista")).toBeInTheDocument();
    expect(screen.getByTestId("tipo-celebracion-badge")).toHaveTextContent("🍷 Adultos");
    expect(screen.getByTestId("whatsapp-confirmar")).toHaveAttribute("href", "https://wa.me/5512345678");
  });

  it("renderiza CumpleCompleta y todas sus secciones correctamente", () => {
    render(<CumpleCompleta data={mockDataCompleta} />);
    expect(screen.getByText("Santiago")).toBeInTheDocument();
    expect(screen.getAllByText(/30/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Terraza La Vista")).toBeInTheDocument();
    
    // Vestimenta
    expect(screen.getByText("Código de Vestimenta")).toBeInTheDocument();
    expect(screen.getByText("Casual")).toBeInTheDocument();
    expect(screen.getByText("Vente cómodo")).toBeInTheDocument();
    
    // Mensaje Especial
    expect(screen.getByText("Mensaje Especial")).toBeInTheDocument();
    expect(screen.getByText("Gracias por venir")).toBeInTheDocument();

    // Itinerario / Programa
    expect(screen.getByText("Programa del Evento")).toBeInTheDocument();
    expect(screen.getByText(/Bienvenida/i)).toBeInTheDocument();
    expect(screen.getByText(/Pastel/i)).toBeInTheDocument();

    // Galería
    expect(screen.getByText("Galería de Recuerdos")).toBeInTheDocument();

    // Mesa de regalos
    expect(screen.getByText("Mesa de Regalos")).toBeInTheDocument();
    expect(screen.getByText("Efectivo")).toBeInTheDocument();
    
    expect(screen.getByTestId("tipo-celebracion-badge")).toHaveTextContent("🍷 Adultos");
    expect(screen.getByTestId("whatsapp-confirmar")).toHaveAttribute("href", "https://wa.me/5512345678");
  });

  it("mapea los alias de campos correctamente en CumpleCompleta", () => {
    const mockDataConAlias: InvitacionData = {
      ...mockDataEsencial,
      galeriaFotos: ["https://example.com/alias-galeria.jpg"],
      dressCode: "Elegante",
      dressCodeDescripcion: "Traje formal requerido",
      mensajeFestejado: "Un mensaje con alias",
      itinerario: "19:00 Recepción",
      tieneMesaRegalos: true,
      mesaRegalosDatos: "Liverpool 12345",
    };
    render(<CumpleCompleta data={mockDataConAlias} />);
    
    // Galería con alias
    expect(screen.getByText("Galería de Recuerdos")).toBeInTheDocument();
    const imgs = screen.getAllByRole("img");
    const aliasImg = imgs.find(img => img.getAttribute("src") === "https://example.com/alias-galeria.jpg");
    expect(aliasImg).toBeDefined();

    // Vestimenta con alias
    expect(screen.getByText("Elegante")).toBeInTheDocument();
    expect(screen.getByText("Traje formal requerido")).toBeInTheDocument();

    // Mensaje especial con alias
    expect(screen.getByText("Un mensaje con alias")).toBeInTheDocument();

    // Mesa de regalos con alias
    expect(screen.getByText("Mesa de Regalos")).toBeInTheDocument();
    expect(screen.getByText("Liverpool 12345")).toBeInTheDocument();
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

  it("contiene los breakpoints responsive indicados (E-19) en CumpleEsencial", () => {
    const { container } = render(<CumpleEsencial data={mockDataEsencial} />);
    
    // Contenedor principal
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass("md:max-w-2xl");
    expect(mainContainer).toHaveClass("md:mx-auto");
    expect(mainContainer).toHaveClass("md:shadow-2xl");

    // Hero Portada
    const hero = container.querySelector(".animate-fade-in");
    expect(hero).toHaveClass("md:h-[50vh]");
    expect(hero).toHaveClass("md:rounded-t-2xl");

    // Detalles wrapper (has py-12 / px-10 on md)
    const detailsWrapper = container.querySelector(".md\\:px-10");
    expect(detailsWrapper).toHaveClass("md:px-10");
    expect(detailsWrapper).toHaveClass("md:py-12");

    // Grid fecha/hora/lugar has md:grid-cols-3
    const grid = container.querySelector(".md\\:grid-cols-3");
    expect(grid).toBeInTheDocument();
  });
});
