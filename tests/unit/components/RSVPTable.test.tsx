import { render, screen, fireEvent } from "@testing-library/react";
import { RSVPTable } from "@/app/(admin)/admin/pedidos/[id]/rsvp-table";
import { describe, it, expect } from "vitest";

describe("RSVPTable Component Tests", () => {
  const mockRSVPs = [
    {
      id: "rsvp-1",
      pedidoId: "pedido-1",
      nombre: "Juan Perez",
      asiste: true,
      pax: 3,
      telefono: "5512345678",
      mensaje: "Felicidades",
      createdAt: new Date("2026-06-07T12:00:00Z"),
    },
    {
      id: "rsvp-2",
      pedidoId: "pedido-1",
      nombre: "Maria Gomez",
      asiste: false,
      pax: 0,
      telefono: null,
      mensaje: null,
      createdAt: new Date("2026-06-07T13:00:00Z"),
    },
  ];

  it("debe renderizar correctamente los totales de asistencia y la tabla", () => {
    render(
      <RSVPTable
        rsvps={mockRSVPs as any}
        precio={2500}
        datosInvitacion={{ invitadosEsperados: 120 }}
      />
    );

    // Verify stats cards values
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);

    // Verify table records
    expect(screen.getByText("Juan Perez")).toBeInTheDocument();
    expect(screen.getByText("Maria Gomez")).toBeInTheDocument();
  });

  it("debe calcular los invitados esperados estimando desde el precio si no hay campo configurable", () => {
    render(
      <RSVPTable
        rsvps={mockRSVPs as any}
        precio={3000}
        datosInvitacion={null}
      />
    );

    // Math.round(3000 / 20) = 150 expected guests
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("debe filtrar confirmaciones al hacer clic en los botones de filtro", () => {
    render(
      <RSVPTable
        rsvps={mockRSVPs as any}
        precio={2000}
        datosInvitacion={null}
      />
    );

    // Both should render initially
    expect(screen.getByText("Juan Perez")).toBeInTheDocument();
    expect(screen.getByText("Maria Gomez")).toBeInTheDocument();

    // Click "Asiste" filter button (anchor text to prevent matching "No asiste")
    fireEvent.click(screen.getByRole("button", { name: /^Asiste \(/i }));

    // Only Juan Perez (asiste = true) should be visible
    expect(screen.getByText("Juan Perez")).toBeInTheDocument();
    expect(screen.queryByText("Maria Gomez")).not.toBeInTheDocument();
  });

  it("debe exportar a CSV incluyendo metadatos del evento en la cabecera", () => {
    const createObjectURLMock = vi.fn(() => "blob:url");
    global.URL.createObjectURL = createObjectURLMock;

    // Prevent JSDOM navigation error on anchor click
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    let exportedContent = "";
    const mockBlob = vi.spyOn(global, "Blob").mockImplementation(function (content) {
      exportedContent = content[0];
      return {} as any;
    } as any);

    render(
      <RSVPTable
        rsvps={mockRSVPs as any}
        precio={2500}
        datosInvitacion={{
          nombre: "Mateo",
          fecha: "2026-12-24T18:00:00Z",
          lugar: "Terraza La Vista",
        }}
      />
    );

    const exportBtn = screen.getByRole("button", { name: /Exportar CSV/i });
    fireEvent.click(exportBtn);

    expect(exportedContent).toContain(`"Evento:","Mateo"`);
    expect(exportedContent).toContain(`"Lugar:","Terraza La Vista"`);
    expect(exportedContent).toContain("Nombre,¿Asiste?,Lugares/Pax,Teléfono,Mensaje,Fecha de registro");
    
    mockBlob.mockRestore();
    clickSpy.mockRestore();
  });
});
