import { render, screen, fireEvent } from "@testing-library/react";
import { PedidosClient } from "@/app/(admin)/admin/pedidos/pedidos-client";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/app/(admin)/admin/pedidos/actions", () => {
  return {
    updatePedidoEstadoAction: vi.fn(() => Promise.resolve({ success: true })),
  };
});

describe("Kanban (PedidosClient) Component Tests", () => {
  const initialPedidos = [
    {
      id: "pedido-1",
      clienteId: "cliente-1",
      tipoEvento: "boda",
      fechaEvento: new Date("2026-12-18T18:00:00Z").toISOString(),
      template: "boda-elegante",
      precio: 1500.00,
      estado: "cotizado",
      slug: "boda-pedro-y-ana",
      cliente: {
        id: "cliente-1",
        nombre: "Pedro & Ana",
        fuente: "instagram",
      },
      pagos: [],
    },
  ];

  it("debe renderizar correctamente las columnas y las tarjetas de pedido", () => {
    render(<PedidosClient initialPedidos={initialPedidos} />);

    // Check columns are rendered
    expect(screen.getByText("Cotizado")).toBeInTheDocument();
    expect(screen.getByText("Pagado")).toBeInTheDocument();
    expect(screen.getByText("En Producción")).toBeInTheDocument();

    // Check card details
    expect(screen.getByText("Pedro & Ana")).toBeInTheDocument();
    expect(screen.getByText("boda-elegante")).toBeInTheDocument();
  });

  it("debe filtrar pedidos por tipo de evento al seleccionar un tab", async () => {
    const multiPedidos = [
      ...initialPedidos,
      {
        id: "pedido-2",
        clienteId: "cliente-2",
        tipoEvento: "xv",
        fechaEvento: new Date("2026-12-18T18:00:00Z").toISOString(),
        template: "xv-moderno",
        precio: 2000.00,
        estado: "cotizado",
        slug: "xv-valeria",
        cliente: {
          id: "cliente-2",
          nombre: "Valeria Gomez",
          fuente: "tienda",
        },
        pagos: [],
      },
    ];

    render(<PedidosClient initialPedidos={multiPedidos} />);

    // Initially both should render
    expect(screen.getByText("Pedro & Ana")).toBeInTheDocument();
    expect(screen.getByText("Valeria Gomez")).toBeInTheDocument();

    // Click on XV Años tab
    fireEvent.click(screen.getByRole("button", { name: "XV Años" }));

    // Valeria Gomez (XV Años) should be visible, Pedro & Ana (Boda) should not
    expect(screen.getByText("Valeria Gomez")).toBeInTheDocument();
    expect(screen.queryByText("Pedro & Ana")).not.toBeInTheDocument();
  });

  it("debe invocar la acción de actualizar estado al mover de columna", async () => {
    const { updatePedidoEstadoAction } = await import("@/app/(admin)/admin/pedidos/actions");

    render(<PedidosClient initialPedidos={initialPedidos} />);

    // Pedro & Ana starts in "Cotizado" column
    // Find right arrow button on Pedro & Ana card
    const rightArrow = screen.getByTitle("Mover al siguiente estado");

    fireEvent.click(rightArrow);

    // Verify update action called
    expect(updatePedidoEstadoAction).toHaveBeenCalledWith("pedido-1", "pagado");
  });

  it("debe traducir el tipo de evento en el badge del Kanban a español", () => {
    render(<PedidosClient initialPedidos={initialPedidos} />);
    // "boda" is mapped to "Boda"
    expect(screen.getByText("Boda")).toBeInTheDocument();
  });

  it("debe filtrar pedidos por nombre del festejado en datosInvitacion", () => {
    const festejadoPedidos = [
      ...initialPedidos,
      {
        id: "pedido-3",
        clienteId: "cliente-3",
        tipoEvento: "cumpleanos",
        fechaEvento: new Date("2026-12-18T18:00:00Z").toISOString(),
        template: "cumpleanos-esencial",
        precio: 350.00,
        estado: "cotizado",
        slug: "cumple-festejado",
        cliente: {
          id: "cliente-3",
          nombre: "Felipe Gomez",
          fuente: "tienda",
        },
        datosInvitacion: {
          nombre: "Mateo",
        },
        pagos: [],
      },
    ];

    render(<PedidosClient initialPedidos={festejadoPedidos} />);

    // Mateo card should render initially since search is empty
    expect(screen.getByText("Felipe Gomez")).toBeInTheDocument();

    // Type "Mateo" into search input
    const searchInput = screen.getByPlaceholderText("Buscar por cliente o slug...");
    fireEvent.change(searchInput, { target: { value: "Mateo" } });

    // Felipe Gomez (which has Mateo as celebrant) should remain visible
    expect(screen.getByText("Felipe Gomez")).toBeInTheDocument();
    // Pedro & Ana (which doesn't match Mateo) should be hidden
    expect(screen.queryByText("Pedro & Ana")).not.toBeInTheDocument();
  });
});
