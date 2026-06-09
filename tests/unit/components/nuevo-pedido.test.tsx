import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { NuevoPedidoClient } from "@/app/(admin)/admin/pedidos/nuevo/nuevo-pedido-client";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/app/(admin)/admin/clientes/actions", () => ({
  createClienteAction: vi.fn(() => Promise.resolve({ success: true, data: { id: "new-id" } })),
}));

describe("NuevoPedidoClient Phone Validation", () => {
  const mockClientes = [
    {
      id: "c-1",
      nombre: "Juan Perez",
      telefono: "5512345678",
      fuente: "tienda",
      email: "juan@perez.com",
      notas: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it("debe validar estrictamente el teléfono a 10 dígitos en el formulario rápido de cliente", async () => {
    render(<NuevoPedidoClient clientes={mockClientes} />);

    // Click on "Crear Cliente Rápido"
    const quickCreateBtn = screen.getByText("Crear Cliente Rápido");
    fireEvent.click(quickCreateBtn);

    // Get input fields
    const nombreInput = screen.getByPlaceholderText("Ej. Juan Gómez");
    const telefonoInput = screen.getByPlaceholderText("Ej. 5512345678");

    // Enter name
    fireEvent.change(nombreInput, { target: { value: "Test Client" } });
    
    // Enter invalid telephone (e.g. 5 digits)
    fireEvent.change(telefonoInput, { target: { value: "12345" } });

    // Submit
    const submitBtn = screen.getByText("Crear y Continuar");
    fireEvent.click(submitBtn);

    // Expect validation error
    await waitFor(() => {
      expect(screen.getByText("El teléfono debe tener exactamente 10 dígitos numéricos")).toBeInTheDocument();
    });
  });
});
